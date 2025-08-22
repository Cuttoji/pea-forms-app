"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { transformFormData } from '@/lib/utils/formUtils';

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
      
      const { error } = await supabase.storage
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
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm(formData)) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return { success: false, error: 'Validation failed' };
    }

    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Prepare data for submission - keep original field names
      const submissionData = {
        ...transformFormData(formData),
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      // Remove any undefined or empty string values that might cause issues
      Object.keys(submissionData).forEach(key => {
        if (submissionData[key] === undefined || submissionData[key] === '') {
          submissionData[key] = null;
        }
      });

      let result;
      
      if (submissionData.id) {
        // Update existing record
        const { data, error } = await supabase
          .from(tableName)
          .update(submissionData)
          .eq('id', submissionData.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        // Insert new record
        delete submissionData.id; // Remove null id for insert
        submissionData.created_at = new Date().toISOString();
        
        const { data, error } = await supabase
          .from(tableName)
          .insert([submissionData])
          .select();
          
        if (error) throw error;
        result = data;
      }

      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว');
      console.log('Form submitted successfully:', result);
      
      return { success: true, data: result };
      
    } catch (error) {
      console.error('Form submission failed:', error);
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, tableName, supabase]);

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