"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function useFormManager(tableName, initialData, imageBucketName = 'default') {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const fetchFormData = useCallback(async () => {
    if (id) {
      setIsLoading(true);
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error) {
        toast.error("ไม่สามารถโหลดข้อมูลฟอร์มได้");
        router.push('/dashboard');
      } else if (data) {
        const sanitizedData = { ...initialData };
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(sanitizedData, key)) {
            sanitizedData[key] = data[key] === null ? '' : data[key];
          }
        }
        setFormData(sanitizedData);
      }
      setIsLoading(false);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...initialData, inspectionDate: today, requestDate: today }));
      setIsLoading(false);
    }
  }, [id, tableName, supabase, router, initialData]);

  useEffect(() => { fetchFormData(); }, [fetchFormData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleImageUpload = (file) => { setImageFile(file); };
  const handleSignatureSave = (fieldName, dataUrl) => { setFormData(prev => ({ ...prev, [fieldName]: dataUrl })); };
  const handleSignatureClear = (fieldName) => { setFormData(prev => ({ ...prev, [fieldName]: "" })); };

  const handleSubmit = async (e, refs = {}) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล");
        return { success: false };
      }

      let dataToSubmit = { ...formData, user_id: user.id };
      
      const numericFields = ['latitude', 'longitude', 'estimatedLoad', 'cableSizeSqmm', 'breakerAmpRating', 'groundWireSizeSqmm', 'groundResistanceOhm'];
      numericFields.forEach(field => {
        const value = dataToSubmit[field];
        dataToSubmit[field] = (value === '' || value === null || value === undefined) ? null : parseFloat(value);
      });

      if (imageFile) {
        const fileName = `${user.id}/${imageBucketName}/${Date.now()}_${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('form-images').upload(fileName, imageFile);
        if (uploadError) throw new Error(`อัปโหลดรูปภาพล้มเหลว: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage.from('form-images').getPublicUrl(uploadData.path);
        dataToSubmit.address_photo_url = publicUrlData.publicUrl;
      }

      if (refs.userSigRef?.current && !refs.userSigRef.current.isEmpty()) { dataToSubmit.userSignature = refs.userSigRef.current.toDataURL(); }
      if (refs.inspectorSigRef?.current && !refs.inspectorSigRef.current.isEmpty()) { dataToSubmit.inspectorSignature = refs.inspectorSigRef.current.toDataURL(); }
      
      console.log('Data being sent to Supabase:', dataToSubmit);

      let dbOperation;
      if (id) {
        dbOperation = supabase.from(tableName).update(dataToSubmit).eq('id', id).select().single();
      } else {
        delete dataToSubmit.id;
        dbOperation = supabase.from(tableName).insert([dataToSubmit]).select().single();
      }

      const { data: resultData, error } = await dbOperation;
      
      if (error) {
        console.error('Supabase Error Details:', error);
        throw error;
      }
      
      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว!');

      if (!id) {
        return { success: true, isNewSubmission: true };
      } else {
        setFormData(prev => ({ ...prev, ...resultData }));
        return { success: true, isNewSubmission: false };
      }

    } catch (error) {
      console.error(`Error submitting to ${tableName}:`, error);
      toast.error(`เกิดข้อผิดพลาด: ${error.message || 'ไม่สามารถบันทึกข้อมูลได้'}`);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData, setFormData, isLoading, isSubmitting,
    handleChange, handleImageUpload, handleSubmit,
    handleSignatureSave, handleSignatureClear,
  };
}