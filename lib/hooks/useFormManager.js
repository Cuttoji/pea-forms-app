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
      
      try {
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
          console.log('Fetched data from database:', data);
          
          // ใช้ข้อมูลจากฐานข้อมูลเป็นหลัก แต่เติมค่าที่ขาดหายไปจาก initialData
          const sanitizedData = { ...initialData };
          
          // วนลูปเพื่อคัดลอกข้อมูลทั้งหมดจากฐานข้อมูล
          Object.keys(data).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(initialData, key)) {
              // แปลงค่า null เป็นค่าว่าง "" สำหรับ input fields
              // ยกเว้นฟิลด์ที่ควรเป็น null (เช่น วันที่, พิกัด)
              const nullableFields = ['requestdate', 'latitude', 'longitude', 'user_id'];
              
              if (nullableFields.includes(key)) {
                sanitizedData[key] = data[key]; // เก็บค่า null ไว้สำหรับฟิลด์เหล่านี้
              } else {
                sanitizedData[key] = data[key] === null ? '' : data[key];
              }
            }
          });
          
          // เติมฟิลด์ที่ไม่มีในฐานข้อมูลด้วยค่าเริ่มต้น
          Object.keys(initialData).forEach(key => {
            if (!data.hasOwnProperty(key)) {
              sanitizedData[key] = initialData[key];
            }
          });
          
          console.log('Sanitized data for form:', sanitizedData);
          setFormData(sanitizedData);
        }
      } catch (fetchError) {
        console.error('Error during form data fetch:', fetchError);
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    } else {
      // ตั้งค่าวันที่เริ่มต้นสำหรับฟอร์มใหม่
      const today = new Date().toISOString().split('T')[0];
      const newFormData = {
        ...initialData,
        // กำหนดค่าเริ่มต้นสำหรับฟิลด์วันที่ถ้ามีอยู่ใน initialData
        ...(Object.prototype.hasOwnProperty.call(initialData, 'inspectiondate') && { inspectiondate: today }),
        ...(Object.prototype.hasOwnProperty.call(initialData, 'requestdate') && { requestdate: null })
      };
      
      console.log('Setting up new form with initial data:', newFormData);
      setFormData(newFormData);
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
      // Get current user for RLS policy
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
        router.push('/auth/signin');
        return { success: false, error: 'User not authenticated' };
      }

      // Use destructuring to exclude id from formData for new records
      const { id, ...formDataWithoutId } = formData;
      
      // Create cleaned data object
      const cleanedData = { 
        ...formDataWithoutId,
        user_id: user.id,  // Add user_id for RLS policy
        updated_at: new Date().toISOString() // Add timestamp for updates
      };

      // Clean up date fields - convert empty strings to null
      Object.keys(cleanedData).forEach(key => {
        if (key.includes('date')) {
          cleanedData[key] = cleanedData[key] === '' ? null : cleanedData[key];
        }
      });

      // Clean up optional numeric and coordinate fields
      const optionalFields = ['requestdate', 'latitude', 'longitude'];
      optionalFields.forEach(field => {
        if (!cleanedData[field] || cleanedData[field] === '') {
          cleanedData[field] = null;
        }
      });

      // Convert numeric fields to proper numbers
      const numericFields = ['estimatedload', 'cablesizesqmm', 'breakeramprating', 'groundwiresizesqmm', 'groundresistanceohm'];
      numericFields.forEach(field => {
        if (cleanedData[field] && cleanedData[field] !== '') {
          const numValue = parseFloat(cleanedData[field]);
          cleanedData[field] = isNaN(numValue) ? null : numValue;
        }
      });

      let imageUploadSuccess = false;

      // Handle image upload if there's an imageFile - DON'T THROW ERRORS
      if (imageFile) {
        try {
          console.log('Starting image upload process...', {
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type,
            bucketName: imageBucketName
          });

          // Validate file before upload
          if (!imageFile?.type) {
            throw new Error('Invalid file object');
          }

          if (!imageFile.type.startsWith('image/')) {
            throw new Error('File must be an image');
          }
          
          if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('File size must be less than 5MB');
          }

          // Check if bucket exists by trying to list files in it
          console.log('Checking if bucket exists by listing files...');
          let bucketExists = false;
          
          try {
            const { data: files, error: listError } = await supabase.storage
              .from(imageBucketName)
              .list('', { limit: 1 });
              
            if (!listError) {
              bucketExists = true;
              console.log(`Bucket '${imageBucketName}' exists and is accessible`);
            }
          } catch (listErr) {
            console.log(`Bucket '${imageBucketName}' may not exist, checking bucket list...`);
          }
          
          // If bucket doesn't exist or listing failed, check bucket list
          if (!bucketExists) {
            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
            
            if (bucketsError) {
              console.error('Error listing buckets:', bucketsError);
              throw new Error(`Cannot access storage buckets: ${bucketsError.message}`);
            }

            console.log('Available buckets:', buckets?.map(b => b.name) || []);
            bucketExists = buckets?.some(bucket => bucket.name === imageBucketName);
          }
          
          if (!bucketExists) {
            // Try to create the bucket if it doesn't exist
            console.log(`Bucket '${imageBucketName}' not found. Attempting to create it...`);
            
            try {
              const { data: createBucketData, error: createBucketError } = await supabase.storage
                .createBucket(imageBucketName, {
                  public: true,
                  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
                  fileSizeLimit: 5242880 // 5MB
                });

              if (createBucketError) {
                console.error('Error creating bucket:', createBucketError);
                
                // Check if error is due to bucket already existing
                if (createBucketError.message?.includes('already exists') || 
                    createBucketError.message?.includes('resource already exists') ||
                    createBucketError.statusCode === 409) {
                  console.log('Bucket already exists (race condition), continuing with upload...');
                  bucketExists = true;
                } else {
                  throw new Error(`Cannot create bucket '${imageBucketName}': ${createBucketError.message}`);
                }
              } else {
                console.log('Bucket created successfully:', createBucketData);
                bucketExists = true;
              }
            } catch (createError) {
              console.error('Bucket creation failed:', createError);
              // If bucket creation fails, try to proceed anyway in case it was created by another process
              console.log('Attempting to proceed with upload despite creation error...');
              bucketExists = true;
            }
          }

          // Generate unique filename
          const timestamp = Date.now();
          const sanitizedFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileName = `${timestamp}-${sanitizedFileName}`;
          
          console.log('Uploading to bucket:', imageBucketName, 'with filename:', fileName);
          
          // Try uploading the file
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(imageBucketName)
            .upload(fileName, imageFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Image upload error details:', uploadError);
            throw new Error(`Image upload failed: ${uploadError.message || 'Unknown storage error'}`);
          }

          if (!uploadData?.path) {
            console.error('Upload data:', uploadData);
            throw new Error('Upload successful but no path returned');
          }

          console.log('Upload successful, getting public URL for path:', uploadData.path);

          // Get public URL for the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from(imageBucketName)
            .getPublicUrl(uploadData.path);
          
          if (!publicUrl) {
            throw new Error('Failed to get public URL for uploaded image');
          }
          
          cleanedData.address_photo_url = publicUrl;
          imageUploadSuccess = true;
          console.log('Image uploaded successfully:', publicUrl);
          
        } catch (imageError) {
          console.error('Image upload error:', imageError);
          
          // Show user-friendly error message but don't stop form submission
          if (imageError.message.includes('does not exist') || imageError.message.includes('Cannot create bucket')) {
            toast.error('ไม่สามารถอัปโหลดรูปภาพได้ - ระบบจัดเก็บรูปภาพยังไม่พร้อมใช้งาน');
          } else if (imageError.message.includes('File size')) {
            toast.error('ไฟล์รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 5MB)');
          } else if (imageError.message.includes('File must be an image')) {
            toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
          } else {
            toast.error(`ไม่สามารถอัปโหลดรูปภาพได้: ${imageError.message}`);
          }
          
          // Continue with form submission without image
          console.log('Continuing form submission without image...');
        }
      }

      // Continue with form submission (with or without image)
      console.log('Submitting form data to database...', { 
        operation: id ? 'UPDATE' : 'INSERT',
        recordId: id,
        dataFields: Object.keys(cleanedData),
        hasImage: !!cleanedData.address_photo_url
      });
      
      let resultData;
      
      if (id) {
        // UPDATE operation - add id back to cleanedData for WHERE clause
        cleanedData.id = id;
        const { data, error } = await supabase
          .from(tableName)
          .update(cleanedData)
          .eq('id', id)
          .select();
          
        if (error) {
          console.error('Database UPDATE error:', error);
          throw error;
        }
        resultData = data?.[0];
      } else {
        // INSERT operation - use cleanedData without id
        const { data, error } = await supabase
          .from(tableName)
          .insert([cleanedData])
          .select();
          
        if (error) {
          console.error('Database INSERT error:', error);
          throw error;
        }
        resultData = data?.[0];
      }

      if (!resultData) {
        throw new Error('No data returned from database operation');
      }

      // Show different success message based on whether image was uploaded
      if (imageFile && !imageUploadSuccess) {
        toast.success('✅ บันทึกข้อมูลเรียบร้อยแล้ว (ยกเว้นรูปภาพ - สามารถแก้ไขเพิ่มภายหลังได้)', {
          duration: 4000
        });
      } else {
        toast.success('✅ บันทึกข้อมูลเรียบร้อยแล้ว!');
      }

      // Clear image file after successful submission
      setImageFile(null);

      if (!id) {
        // For new submissions, redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
        return { success: true, isNewSubmission: true, data: resultData };
      } else {
        // For updates, update local form data with returned data
        const sanitizedResult = { ...initialData };
        Object.keys(resultData).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(initialData, key)) {
            sanitizedResult[key] = resultData[key] === null ? '' : resultData[key];
          }
        });
        setFormData(sanitizedResult);
        return { success: true, isNewSubmission: false, data: resultData };
      }

    } catch (error) {
      console.error('Error saving form:', error);
      
      // Enhanced error handling with specific messages
      let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      
      if (error?.message) {
        const { message } = error;
        
        if (message.includes('timestamp') || message.includes('invalid input syntax for type timestamp')) {
          errorMessage = 'กรุณาตรวจสอบรูปแบบวันที่ให้ถูกต้อง';
        } else if (message.includes('unique') || message.includes('duplicate key')) {
          errorMessage = 'ข้อมูลซ้ำกับข้อมูลที่มีอยู่แล้ว กรุณาตรวจสอบเลขที่บันทึกตรวจสอบ';
        } else if (message.includes('foreign key') || message.includes('violates foreign key constraint')) {
          errorMessage = 'ข้อมูลอ้างอิงไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่';
        } else if (message.includes('ไม่มีสิทธิ์') || message.includes('row-level security')) {
          errorMessage = 'ไม่มีสิทธิ์ในการบันทึกข้อมูล - กรุณาติดต่อผู้ดูแลระบบ';
        } else if (message.includes('User not authenticated')) {
          errorMessage = 'กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล';
        } else {
          errorMessage = `เกิดข้อผิดพลาด: ${message}`;
        }
      }
      
      toast.error(errorMessage);
      return { success: false, error: error?.message || 'Unknown error' };
      
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