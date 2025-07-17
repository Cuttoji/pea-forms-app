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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล");
        return { success: false };
      }

      let dataToSubmit = { ...formData, user_id: user.id };
      
      // ตรวจสอบว่าเป็น Array ก่อนใช้ forEach
      if (Array.isArray(numericFields)) {
        numericFields.forEach(field => {
          const value = dataToSubmit[field];
          // แปลงค่าว่างหรือ null/undefined เป็น null สำหรับ DB
          dataToSubmit[field] = (value === '' || value === null || value === undefined) ? null : parseFloat(value);
        });
      } else {
          console.warn("numericFields is not an array. Skipping numeric conversion.");
      }


      if (imageFile) {
        // ตรวจสอบให้แน่ใจว่า 'form-images' bucket มีอยู่จริงและมีสิทธิ์เขียน
        const fileName = `${user.id}/${imageBucketName}/${Date.now()}_${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('form-images').upload(fileName, imageFile);
        if (uploadError) throw new Error(`อัปโหลดรูปภาพล้มเหลว: ${uploadError.message}`);
        
        // ตรวจสอบว่า publicUrlData.publicUrl มีค่าก่อนนำไปใช้
        const { data: publicUrlData } = supabase.storage.from('form-images').getPublicUrl(uploadData.path);
        if (publicUrlData && publicUrlData.publicUrl) {
            dataToSubmit.address_photo_url = publicUrlData.publicUrl;
        } else {
            console.warn("Could not get public URL for uploaded image.");
            // พิจารณาว่าควรจัดการกับกรณีนี้อย่างไร เช่น ไม่ตั้งค่า address_photo_url หรือโยน error
        }
      }

      // ตรวจสอบและบันทึกลายเซ็น
      if (refs.userSigRef?.current && !refs.userSigRef.current.isEmpty()) { dataToSubmit.userSignature = refs.userSigRef.current.toDataURL(); }
      if (refs.inspectorSigRef?.current && !refs.inspectorSigRef.current.isEmpty()) { dataToSubmit.inspectorSignature = refs.inspectorSigRef.current.toDataURL(); }
      
      console.log('Data being sent to Supabase:', dataToSubmit);

      let dbOperation;
      // ลบ field ที่ DB จัดการเองเสมอ
      delete dataToSubmit.created_at; 
      delete dataToSubmit.updated_at; // เพิ่ม updated_at ถ้า Supabase จัดการเอง

      if (id) {
        delete dataToSubmit.id; // ลบ id ออกก่อนการ update
        dbOperation = supabase.from(tableName).update(dataToSubmit).eq('id', id).select().single();
      } else {
        delete dataToSubmit.id; // ลบ id ที่เป็น null/undefined ออกก่อน insert สำหรับ record ใหม่
        dbOperation = supabase.from(tableName).insert([dataToSubmit]).select().single();
      }

      const { data: resultData, error } = await dbOperation;
      
      if (error) {
        console.error('Supabase Error Details:', error);
        throw error;
      }
      
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
      console.error(`Error submitting to ${tableName}:`, error);
      toast.error(`เกิดข้อผิดพลาด: ${error.message || 'ไม่สามารถบันทึกข้อมูลได้'}`);
      return { success: false, error: error };
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