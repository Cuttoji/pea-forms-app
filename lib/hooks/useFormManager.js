"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export const useFormManager = (tableName, initialFormData, arrayFields = [], selectFields = '*', bucketName = 'form-images') => {
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
  const transformFormData = useCallback((data, userId, isUpdate) => {
    const transformed = isUpdate ? { ...data } : { ...data, user_id: userId };
    
    // Transform array fields
    arrayFieldsRef.current.forEach(field => {
      if (Array.isArray(transformed[field])) {
        transformed[field] = JSON.stringify(transformed[field]);
      }
    });
    
    // Transform date fields - convert empty strings to null
    Object.keys(transformed).forEach(key => {
      if (key.includes('date') && transformed[key] === '') {
        transformed[key] = null;
      }
    });
    
    return transformed;
  }, []);

  const parseFormData = useCallback((data) => {
    if (!data) return initialFormDataRef.current;
    
    const parsed = { ...data };
    
    // Parse array fields
    arrayFieldsRef.current.forEach(field => {
      if (typeof parsed[field] === 'string') {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch {
          parsed[field] = [];
        }
      } else if (!Array.isArray(parsed[field])) {
        parsed[field] = [];
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tableName, selectFields, parseFormData]); // router intentionally omitted to prevent infinite loops

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

      const dataToSubmit = transformFormData(formData, user.id, !!id);
      
      let result;
      if (id) {
        result = await supabaseRef.current
          .from(tableName)
          .update(dataToSubmit)
          .eq('id', id);
      } else {
        result = await supabaseRef.current
          .from(tableName)
          .insert([dataToSubmit]);
      }

      if (result.error) throw result.error;

      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว!');
      router.push('/dashboard');
      
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, id, tableName, transformFormData, router]);

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