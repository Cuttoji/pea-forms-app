"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

// เพิ่ม numericFields เป็น argument
export const useFormManager = (
  tableName,
  initialFormData,
  arrayFields = [],
  numericFields = [],
  selectFields = '*',
  bucketName = 'form-images'
) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use refs to maintain stable references
  const supabaseRef = useRef(createClient());
  const initialFormDataRef = useRef(initialFormData);
  const arrayFieldsRef = useRef(arrayFields);
  
  // Update refs when props change
  useEffect(() => {
    initialFormDataRef.current = initialFormData;
    arrayFieldsRef.current = arrayFields;
  }, [initialFormData, arrayFields]);

  // Memoized data transformation functions
  // เพิ่ม numericFields เป็น argument
  const transformFormData = useCallback((data, userId, isUpdate, numericFields) => {
    const transformed = isUpdate ? { ...data } : { ...data, user_id: userId };

    Object.keys(transformed).forEach(key => {
      const value = transformed[key];
      const isNumericField =
        (Array.isArray(numericFields) && numericFields.includes(key)) ||
        /(latitude|longitude|load|amprating|ohm|size|rating|number)/i.test(key);

      if (value === '' && (key.includes('date') || isNumericField)) {
        transformed[key] = null;
      } else if (isNumericField && value !== null && value !== '') {
        const num = Number(value);
        transformed[key] = isNaN(num) ? null : num;
      }
    });

    // Transform array fields ONLY IF your column is JSON/JSONB
    // If your column is ARRAY (e.g. text[]), DO NOT stringify!
    arrayFieldsRef.current.forEach(field => {
      if (Array.isArray(transformed[field])) {
        // ตรวจสอบชนิดคอลัมน์ในฐานข้อมูลของคุณ
        // ถ้าเป็น JSON/JSONB ให้ stringify
        // ถ้าเป็น ARRAY ให้ส่ง array ตรง ๆ
        // ตัวอย่างนี้: **ไม่ stringify**
        // transformed[field] = JSON.stringify(transformed[field]); // <-- ลบหรือคอมเมนต์บรรทัดนี้
        // ส่ง array ตรง ๆ
        // ไม่ต้องทำอะไร
      }
    });

    return transformed;
  }, []);

  const parseFormData = useCallback((data) => {
    if (!data) return initialFormDataRef.current;

    const parsed = { ...data };

    // Parse array fields
    arrayFieldsRef.current.forEach(field => {
      // ถ้าเป็น string และขึ้นต้นด้วย "[" ให้ parse เป็น JSON
      if (typeof parsed[field] === 'string' && parsed[field].trim().startsWith('[')) {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch {
          parsed[field] = [];
        }
      }
      // ถ้าไม่ใช่ array ให้กำหนดเป็น []
      else if (!Array.isArray(parsed[field])) {
        parsed[field] = [];
      }
      // ถ้าเป็น array อยู่แล้ว ไม่ต้องทำอะไร
    });

    return parsed;
  }, []);

  // Load form data - only run when id changes
  useEffect(() => {
    let isMounted = true;
    
    const loadFormData = async () => {
      if (!id) {
        setFormData(initialFormDataRef.current);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabaseRef.current
          .from(tableName)
          .select(selectFields)
          .eq('id', id)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error('Error loading form data:', error);
          toast.error('ไม่สามารถโหลดข้อมูลฟอร์มได้');
          router.push('/dashboard');
          return;
        }

        if (data) {
          setFormData(parseFormData(data));
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error in loadFormData:', error);
          toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFormData();
    
    return () => {
      isMounted = false;
    };
  }, [id, tableName, selectFields, parseFormData, router]);

  // Stable event handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleImageUpload = useCallback(async (file) => {
    if (!file) {
      setFormData(prev => ({
        ...prev,
        address_photo_url: ''
      }));
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabaseRef.current.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabaseRef.current.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        address_photo_url: publicUrl
      }));

      toast.success('อัปโหลดรูปภาพสำเร็จ');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('ไม่สามารถอัปโหลดรูปภาพได้');
    }
  }, [bucketName]);

  const handleSignatureSave = useCallback((signatureType, dataUrl) => {
    setFormData(prev => ({
      ...prev,
      [signatureType]: dataUrl
    }));
  }, []);

  const handleSignatureClear = useCallback((signatureType) => {
    setFormData(prev => ({
      ...prev,
      [signatureType]: ''
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const { data: { user } } = await supabaseRef.current.auth.getUser();

    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
      return { success: false, error: 'No user authenticated' };
    }

    // Ensure numericFields is always an array
    const numericArr = Array.isArray(numericFields) ? numericFields : [];

    const dataToSubmit = transformFormData(formData, user.id, !!id, numericArr);
      // ลบ id field ออกเพื่อไม่ให้เกิดปัญหากับ GENERATED ALWAYS AS IDENTITY
      delete dataToSubmit.id;

      let result;
      if (id) {
        // สำหรับ update
        result = await supabaseRef.current
          .from(tableName)
          .update(dataToSubmit)
          .eq('id', id)
          .select();
      } else {
        // สำหรับ insert
        result = await supabaseRef.current
          .from(tableName)
          .insert([dataToSubmit])
          .select();
      }

      if (result.error) throw result.error;

      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว!');
      router.push('/dashboard');
      
      return { success: true, data: result.data };
     } catch (error) {
      // ป้องกัน error.message เป็น undefined
      const errorMsg =
        (error && error.message) ||
        (typeof error === 'string' ? error : JSON.stringify(error)) ||
        'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      console.error('Error submitting form:', error);
      toast.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${errorMsg}`);
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, id, tableName, transformFormData, router, numericFields]);

  // Memoized return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    handleChange,
    handleImageUpload,
    handleSubmit,
    handleSignatureSave,
    handleSignatureClear
  }), [
    formData,
    isLoading,
    isSubmitting,
    handleChange,
    handleImageUpload,
    handleSubmit,
    handleSignatureSave,
    handleSignatureClear
  ]);

  return returnValue;
};