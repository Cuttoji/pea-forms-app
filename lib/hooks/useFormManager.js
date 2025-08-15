"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { transformFormData, sanitizeFormData } from '@/lib/utils/formUtils';

/**
 * Custom Hook สำหรับจัดการฟอร์มและเชื่อมต่อกับ Supabase
 *
 * @param {string} tableName - ชื่อตารางใน Supabase ที่จะใช้
 * @param {object} initialData - อ็อบเจกต์ของค่าเริ่มต้นสำหรับฟอร์ม (สำคัญมาก: ควรมีโครงสร้างครบถ้วนตามฟิลด์ในฟอร์ม)
 * @param {string[]} numericFields - อาร์เรย์ของชื่อฟิลด์ที่ควรแปลงเป็นตัวเลขก่อนส่งไป Supabase
 * @param {string} columnsToSelect - สตริงของคอลัมน์ที่จะเลือกเมื่อดึงข้อมูล (เช่น '*', 'id,name,value')
 * @param {string} imageBucketName - ชื่อ Bucket สำหรับอัปโหลดรูปภาพ (ค่าเริ่มต้นคือ 'default')
 */
export function useFormManager(
  tableName,
  initialData,
  requiredFields = [],
  selectFields = '*',
  bucketName = 'form-images'
) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const supabase = createClient();

  // Basic form validation
  const validateForm = useCallback((data) => {
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        newErrors[field] = 'ฟิลด์นี้จำเป็นต้องกรอก';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [requiredFields]);

  // Load existing form data if editing
  useEffect(() => {
    const loadFormData = async () => {
      if (id) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select(selectFields)
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error loading form data:', error);
            toast.error('ไม่สามารถโหลดข้อมูลฟอร์มได้');
            router.push('/dashboard');
          } else if (data) {
            // Merge with initial data to ensure all fields exist
            setFormData({ ...initialData, ...data });
          }
        } catch (error) {
          console.error('Unexpected error loading form:', error);
          toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
      } else {
        // Set current date for new forms
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
          ...prev,
          inspectiondate: today,
          inspectionDate: today,
          inspection_date: today
        }));
      }
      setIsLoading(false);
    };

    loadFormData();
  }, [id, tableName, selectFields, initialData, router, supabase]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error('ไม่สามารถอัปโหลดรูปภาพได้');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        toast.error('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
        return { success: false, error: 'Authentication required' };
      }

      // Sanitize and validate form data
      const sanitizedData = sanitizeFormData(formData);
      const isValid = validateForm(sanitizedData);
      
      if (!isValid) {
        toast.error('กรุณาตรวจสอบข้อมูลที่กรอก');
        console.error('Validation errors:', errors);
        return { success: false, error: 'Validation failed', details: errors };
      }

      // Transform data for database
      const transformedData = transformFormData(sanitizedData, userData.user.id, !!id);
      
      console.log('Submitting transformed data:', transformedData);

      let result;
      if (id) {
        // Update existing record
        result = await supabase
          .from(tableName)
          .update(transformedData)
          .eq('id', id)
          .select();
      } else {
        // Insert new record
        result = await supabase
          .from(tableName)
          .insert([transformedData])
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('Database error:', error);
        toast.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
        return { success: false, error: error.message };
      }

      toast.success(id ? 'อัปเดตข้อมูลเรียบร้อยแล้ว!' : 'บันทึกข้อมูลเรียบร้อยแล้ว!');
      
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

      return { success: true, data };
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(`เกิดข้อผิดพลาดที่ไม่คาดคิด: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle signature save
  const handleSignatureSave = (fieldName, signatureDataUrl) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: signatureDataUrl
    }));
  };

  // Handle signature clear
  const handleSignatureClear = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  return {
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    handleChange,
    handleImageUpload,
    handleSubmit,
    handleSignatureSave,
    handleSignatureClear
  };
};