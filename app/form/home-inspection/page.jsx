"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InspectionPDF from '@/components/pdf/InspectionPDF';
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';
import { useFormManager } from "@/lib/hooks/useFormManager"; 
import { FormProvider } from '@/lib/contexts/FormContext';
import initialInspectionItems from '@/lib/constants/inspectionItems';

// Dynamic import for OpenStreetMapComponent to avoid SSR issues
const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), { 
  ssr: false 
});

// Default inspection items if none provided

const initialResidentialInspectionFormData = {
  id: null,
  user_id: null,
  inspection_round: 1,
  inspection_date: new Date().toISOString().split('T')[0],
  request_number: "",
  request_date: "",
  applicant_name: "",
  applicant_phone: "",
  applicant_address: "",
  map_latitude: null,
  map_longitude: null,
  front_photo_url: "",
  electrical_system: "",
  approximate_load_amp: "",
  inspection_result: "",
  inspection_scope: "",
  applicant_signature: "",
  applicant_signature_name: "",
  officer_signature: "",
  officer_signature_name: "",
  created_at: new Date().toISOString(),
  inspection_items: initialInspectionItems,
};

function ResidentialInspectionForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const {
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    handleChange,
    handleImageUpload,
    handleSubmit,
    handleSignatureSave,
    handleSignatureClear
  } = useFormManager('residential_inspection_form', initialResidentialInspectionFormData, [], '*', 'front-photo');

  const applicantSigRef = useRef(null);
  const officerSigRef = useRef(null);
  const imageUploadRef = useRef(null);

  // ตรวจสอบการเข้าสู่ระบบ
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        toast.error('กรุณาเข้าสู่ระบบก่อนใช้งาน');
        // router.push('/auth/signin');
      }
    };
    checkAuth();
  }, []);

  // เลือกตำแหน่งแผนที่
  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      map_latitude: location.lat.toFixed(6),
      map_longitude: location.lng.toFixed(6),
    }));
  };

  // ปรับ Date ให้เก็บ null ถ้าเป็นค่าว่าง
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || null
    }));
  };

  // บันทึกฟอร์ม
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await handleSubmit(e);
      if (result && result.success) {
        toast.success('บันทึกข้อมูลสำเร็จ');
      } else if (result && !result.success) {
        toast.error('บันทึกข้อมูลไม่สำเร็จ');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  };

  useEffect(() => {
    if (!isLoading && formData) {
      // สำหรับ debug หรือ analytics
      // console.log('formData:', formData);
    }
  }, [isLoading, formData]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5b2d90] mb-4"></div>
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">กำลังโหลดข้อมูลฟอร์ม...</p>
          {id && (<p className="text-sm text-gray-500">ID: {id}</p>)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
      <form onSubmit={handleFormSubmit} id="residential-inspection-form" className="space-y-8 max-w-4xl mx-auto p-4 md:p-8">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้า (ที่อยู่อาศัย)
          </h1>
        </div>

        {/* SECTION 1: ข้อมูลการตรวจสอบ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ข้อมูลการตรวจสอบ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">ครั้งที่ตรวจสอบ:</label>
              <input type="number" min={1} name="inspection_round" value={formData.inspection_round || ''} onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 text-gray-900 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">วันที่ตรวจสอบ:</label>
              <input type="date" name="inspection_date" value={formData.inspection_date || ''} onChange={handleDateChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 text-gray-900 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">เลขที่คำร้องขอใช้ไฟ:</label>
              <input type="text" name="request_number" value={formData.request_number || ''} onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 text-gray-900 shadow-sm"
                placeholder="กรอกเลขที่คำร้อง" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">วันที่ในคำร้องขอใช้ไฟ:</label>
              <input type="date" name="request_date" value={formData.request_date || ''} onChange={handleDateChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 text-gray-900 shadow-sm" />
            </div>
          </div>
        </section>

        {/* SECTION 2: ข้อมูลผู้ขอใช้ไฟ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ข้อมูลผู้ขอใช้ไฟ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">ชื่อ-นามสกุล:</label>
              <input type="text" name="applicant_name" value={formData.applicant_name || ''} onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 text-gray-900 shadow-sm"
                placeholder="กรอกชื่อ-นามสกุล" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">โทรศัพท์:</label>
              <input type="text" name="applicant_phone" value={formData.applicant_phone || ''} onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 text-gray-900 shadow-sm"
                placeholder="กรอกเบอร์โทรศัพท์" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">ที่อยู่:</label>
              <textarea name="applicant_address" value={formData.applicant_address || ''} onChange={handleChange} rows={3}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 text-gray-900 shadow-sm resize-none"
                placeholder="กรอกที่อยู่" />
            </div>
          </div>
        </section>

        {/* SECTION 3: แผนที่และรูปหน้าบ้าน */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🗺️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ตำแหน่งบ้านและรูปถ่าย</h2>
          </div>
          <div className="relative z-0  rounded-lg overflow-hidden">
            <OpenStreetMapComponent 
              onLocationSelect={handleLocationSelect} 
              initialLatitude={formData.map_latitude}
              initialLongitude={formData.map_longitude}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm font-semibold text-gray-700">ละติจูด:</span>
                <div className="font-mono text-gray-700">{formData.map_latitude || 'N/A'}</div>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700">ลองจิจูด:</span>
                <div className="font-mono text-gray-700">{formData.map_longitude || 'N/A'}</div>
              </div>
            </div>
          </div>
          <ImageUpload 
            ref={imageUploadRef}
            onImageSelected={handleImageUpload} 
            disabled={isSubmitting}
            initialImageUrl={formData.front_photo_url}
            label="รูปหน้าบ้าน"
          />
        </section>

        {/* SECTION 4: ระบบไฟฟ้า */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ระบบไฟฟ้า</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">ชนิดของระบบไฟฟ้า:</label>
              <select name="electrical_system" value={formData.electrical_system || ''} onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 text-gray-900 shadow-sm bg-white">
                <option value="">เลือกชนิด</option>
                <option value="1 เฟส">1 เฟส</option>
                <option value="3 เฟส">3 เฟส</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">โหลดประมาณ (แอมแปร์):</label>
              <input type="number" step="any" name="approximate_load_amp" value={formData.approximate_load_amp || ''} onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 text-gray-900 shadow-sm"
                placeholder="กรอกค่าโหลดโดยประมาณ" />
            </div>
          </div>
        </section>

        {/* SECTION 4.5: รายการตรวจสอบ (Inspection Items) */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">รายการตรวจสอบ</h2>
          </div>
          <CorrectiveRadio
            items={initialInspectionItems}
            values={formData.inspection_items}
            onChange={items => setFormData(prev => ({ ...prev, inspection_items: items }))}
            disabled={isSubmitting}
          />
        </section>

        {/* SECTION 5: สรุปผลการตรวจสอบ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">✔️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">สรุปผลการตรวจสอบ</h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {["ติดตั้งมิเตอร์ถาวร", "ติดตั้งมิเตอร์ชั่วคราว", "ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์"].map(opt => (
              <label key={opt} className="inline-flex items-center text-gray-900">
                <input
                  type="radio"
                  name="inspection_result"
                  value={opt}
                  checked={formData.inspection_result === opt}
                  onChange={handleChange}
                  className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"
                />
                <span className="ml-2">{opt}</span>
              </label>
            ))}
          </div>
        </section>

        {/* SECTION 6: ขอบเขตและข้อจำกัดในการตรวจสอบ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ขอบเขตและข้อจำกัดในการตรวจสอบ</h2>
          </div>
          <textarea
            name="inspection_scope"
            value={formData.inspection_scope || ''}
            onChange={handleChange}
            rows="4"
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-gray-400 focus:ring-4 focus:ring-gray-100 text-gray-900 shadow-sm resize-none"
            placeholder="ระบุขอบเขต/ข้อจำกัด (ถ้ามี)"
          />
        </section>

        {/* SECTION 7: ลายเซ็น */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">✍️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ลงชื่อ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SignaturePad
              title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน"
              ref={applicantSigRef}
              onSave={dataUrl => handleSignatureSave('applicant_signature', dataUrl)}
              onClear={() => handleSignatureClear('applicant_signature')}
              initialValue={formData.applicant_signature}
            />
            <SignaturePad
              title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค"
              ref={officerSigRef}
              onSave={dataUrl => handleSignatureSave('officer_signature', dataUrl)}
              onClear={() => handleSignatureClear('officer_signature')}
              initialValue={formData.officer_signature}
            />
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8 mt-12">
          <PDFDownloadLink
            document={<InspectionPDF formData={formData} />}
            fileName={`inspection-form-${formData.request_number || 'form'}.pdf`}
            className="w-full sm:w-auto"
          >
            {({ loading }) => (
              <button
                type="button"
                disabled={loading || isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 font-semibold text-lg text-emerald-700 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 border-2 border-emerald-300 rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-6 h-6" />
                {loading ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}
              </button>
            )}
          </PDFDownloadLink>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 font-semibold text-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                <span>บันทึกข้อมูล</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Wrap with Suspense
function ResidentialInspectionFormSuspense() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5b2d90] mb-4"></div>
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <ResidentialInspectionForm />
    </Suspense>
  );
}

export default function FormWrapper() {
  return (
    <FormProvider>
      <ResidentialInspectionFormSuspense />
    </FormProvider>
  );
}