"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

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
  numericFields = [], // กำหนดค่าเริ่มต้นเป็น Array เปล่า เพื่อป้องกัน forEach error
  columnsToSelect = '*',
  imageBucketName = 'default'
) {
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
      const { data, error } = await supabase
        .from(tableName)
        .select(columnsToSelect) // ใช้ columnsToSelect ที่ส่งเข้ามา
        .eq('id', id)
        .single();

      if (error) {
        toast.error("ไม่สามารถโหลดข้อมูลฟอร์มได้");
        console.error(`Error fetching ${tableName}:`, error.message);
        router.push('/dashboard'); // หรือเส้นทางอื่นที่คุณต้องการเมื่อโหลดข้อมูลไม่ได้
      } else if (data) {
        // แปลงค่า null ที่ได้จาก DB ทุกค่าให้เป็นค่าว่าง "" เพื่อป้องกัน error ใน input
        const sanitizedData = { ...initialData }; // ใช้ initialData เป็น template เพื่อให้แน่ใจว่ามี key ครบ
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(initialData, key)) { // ตรวจสอบกับ initialData เพื่อให้แน่ใจว่า key นั้นคาดหวัง
            sanitizedData[key] = data[key] === null ? '' : data[key];
          }
        }
        setFormData(sanitizedData);
      }
      setIsLoading(false);
    } else {
      // ตั้งค่าวันที่เริ่มต้นสำหรับฟอร์มใหม่
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...initialData,
        // กำหนดค่าเริ่มต้นสำหรับฟิลด์วันที่ถ้ามีอยู่ใน initialData
        ...(Object.prototype.hasOwnProperty.call(initialData, 'inspectionDate') && { inspectionDate: today }),
        ...(Object.prototype.hasOwnProperty.call(initialData, 'requestDate') && { requestDate: today })
      }));
      setIsLoading(false);
    }
  }, [id, tableName, supabase, router, initialData, columnsToSelect]);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleImageUpload = (file) => {
    setImageFile(file);
  };

  const handleSignatureSave = (fieldName, dataUrl) => {
    setFormData(prev => ({ ...prev, [fieldName]: dataUrl }));
  };

  const handleSignatureClear = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: "" }));
  };

  const handleSubmit = async (e, refs = {}) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean up data before submission
      const cleanedData = { ...formData };
      
      // Convert empty date strings to null
      Object.keys(cleanedData).forEach(key => {
        if (key.includes('date') && cleanedData[key] === '') {
          cleanedData[key] = null;
        }
      });

      // Remove empty strings for optional fields
      if (!cleanedData.requestdate) cleanedData.requestdate = null;
      if (!cleanedData.latitude) cleanedData.latitude = null;
      if (!cleanedData.longitude) cleanedData.longitude = null;

      const { data, error } = formData.id 
        ? await supabase
            .from(tableName)
            .update(cleanedData)
            .eq('id', formData.id)
            .select()
        : await supabase
            .from(tableName)
            .insert([cleanedData])
            .select();

      if (error) throw error;

      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว!');

      if (!id) {
        router.push('/dashboard'); // ไปยัง Dashboard หลังจากบันทึกข้อมูลใหม่
        return { success: true, isNewSubmission: true, data: resultData }; // ส่ง data กลับไปด้วย
      } else {
        // อัปเดต formData ด้วยข้อมูลที่ได้จาก DB หลังจาก update สำเร็จ
        const sanitizedResult = { ...initialData };
        for (const key in resultData) {
            if (Object.prototype.hasOwnProperty.call(initialData, key)) { // ตรวจสอบกับ initialData
                sanitizedResult[key] = resultData[key] === null ? '' : resultData[key];
            }
        }
        setFormData(sanitizedResult);
        return { success: true, isNewSubmission: false, data: resultData }; // ส่ง data กลับไปด้วย
      }

    } catch (error) {
      console.error('Error saving form:', error);
      // Handle specific database errors
      if (error.message.includes('timestamp')) {
        alert('กรุณาตรวจสอบรูปแบบวันที่ให้ถูกต้อง');
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } finally {
      setIsSubmitting(false);
    }
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
    handleSignatureClear,
  };
}