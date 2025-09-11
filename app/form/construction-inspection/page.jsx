"use client";

import React, { useRef, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ConstructionInspectionPDF from '@/components/pdf/constructioninspectionPDF';
import { Download, Save } from "lucide-react";
import { useFormManager } from "@/lib/hooks/useFormManager";
import initialConstructionItems from "@/lib/constants/constructioninspectionitems";

// --- ค่าเริ่มต้นของข้อมูลในฟอร์มสำหรับตรวจสอบงานก่อสร้าง ---
const initialConstructionInspectionFormData = {
  id: null,
  user_id: null,
  work_name:"",
  approval_number:"",
  approval :"",
  work_id:"",
  operation :"",
  contractor_work :"",
  hv_work_volume:"",
  hv_work_volume_poles:"",
  hv_station:"",
  hv_feeder:"",
  hv_phase:"",
  hv_transformer_kva:"",
  lv_work_volume:"",
  lv_work_volume_poles:"",
  supervisor_name:"",
  supervisor_position:"",
  supervisor_affiliation:"",
  inspection_date :"",
  inspection_result:"",
  user_signature:"",
  user_position:"",
  created_at: new Date().toISOString(),
  inspection_items: initialConstructionItems,
};

function ConstructionInspectionFormContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const {
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleSignatureSave,
    handleSignatureClear
  } = useFormManager('construction_inspection', initialConstructionInspectionFormData, [], '*', 'form-images');

  const inspectorSigRef = useRef(null);
  const userSigRef = useRef(null);

  // Enhanced handleSubmit with proper error handling
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await handleSubmit(e);
      if (result && result.success) {
        console.log('Form submitted successfully:', result);
      } else if (result && !result.success) {
        console.error('Form submission failed:', result.error);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5b2d90] mb-4"></div>
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">กำลังโหลดข้อมูลฟอร์ม...</p>
          {id && (
            <p className="text-sm text-gray-500">กำลังดึงข้อมูลรายการ ID: {id}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <form onSubmit={handleFormSubmit} className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-[#5b2d90]">
          การไฟฟ้าส่วนภูมิภาค
          <br />
          แบบฟอร์มตรวจสอบมาตรฐานงานก่อสร้างและปรับปรุงระบบจำหน่าย ของ กฟภ.
        </h2>

        {/* Header Information */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-[#5b2d90]">ข้อมูลส่วนหัว</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="work_name" className="block text-sm font-medium text-gray-700 mb-1">ชื่องาน:</label>
              <input
                type="text"
                id="work_name"
                name="work_name"
                value={formData.work_name || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                placeholder="กรอกชื่องาน"
              />
            </div>
            <div>
              <label htmlFor="approval_number" className="block text-sm font-medium text-gray-700 mb-1">อนุมัติเลขที่:</label>
              <input
                type="text"
                id="approval_number"
                name="approval_number"
                value={formData.approval_number || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                placeholder="กรอกเลขอนุมัติ"
              />
            </div>
            <div>
              <label htmlFor="approval" className="block text-sm font-medium text-gray-700 mb-1">ลงวันที่:</label>
              <input
                type="date"
                id="approval"
                name="approval"
                value={formData.approval || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="work_id" className="block text-sm font-medium text-gray-700 mb-1">หมายเลขงาน:</label>
              <input
                type="text"
                id="work_id"
                name="work_id"
                value={formData.work_id || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                placeholder="กรอกหมายเลขงาน"
              />
            </div>
            <div>
              <label htmlFor="inspection_date" className="block text-sm font-medium text-gray-700 mb-1">วัน/เดือน/ปี ที่ดำเนินการตรวจ:</label>
              <input
                type="date"
                id="inspection_date"
                name="inspection_date"
                value={formData.inspection_date || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-4">
              <label className="inline-flex items-center text-gray-800">
                <input
                  type="checkbox"
                  name="operation"
                  checked={formData.operation}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-3">กฟภ. ดำเนินการ</span>
              </label>
              <label className="inline-flex items-center text-gray-800">
                <input
                  type="checkbox"
                  name="contractor_work"
                  checked={formData.contractor_work}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-3">งานจ้างฯบริษัท</span>
              </label>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hv_work_volume" className="block text-sm font-medium text-gray-700 mb-1">ปริมาณงานแรงสูง (วงจร-กม.):</label>
                <input 
                  type="text" 
                  id="hv_work_volume" 
                  name="hv_work_volume" 
                  value={formData.hv_work_volume || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกจำนวน"
                />
              </div>
              <div>
                <label htmlFor="hv_work_volume_poles" className="block text-sm font-medium text-gray-700 mb-1">จำนวนเสา (ต้น):</label>
                <input 
                  type="text" 
                  id="hv_work_volume_poles" 
                  name="hv_work_volume_poles" 
                  value={formData.hv_work_volume_poles || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกจำนวนเสา"
                />
              </div>
              <div>
                <label htmlFor="hv_station" className="block text-sm font-medium text-gray-700 mb-1">รับไฟจากสถานี:</label>
                <input 
                  type="text" 
                  id="hv_station" 
                  name="hv_station" 
                  value={formData.hv_station || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกชื่อสถานี"
                />
              </div>
              <div>
                <label htmlFor="hv_feeder" className="block text-sm font-medium text-gray-700 mb-1">ฟีดเดอร์:</label>
                <input 
                  type="text" 
                  id="hv_feeder" 
                  name="hv_feeder" 
                  value={formData.hv_feeder || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกชื่อฟีดเดอร์"
                />
              </div>
              <div>
                <label htmlFor="hv_phase" className="block text-sm font-medium text-gray-700 mb-1">เฟสที่ต่อ:</label>
                <input 
                  type="text" 
                  id="hv_phase" 
                  name="hv_phase" 
                  value={formData.hv_phase || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกเฟส"
                />
              </div>
              <div>
                <label htmlFor="hv_transformer_kva" className="block text-sm font-medium text-gray-700 mb-1">หม้อแปลงรวม (KVA):</label>
                <input 
                  type="text" 
                  id="hv_transformer_kva" 
                  name="hv_transformer_kva" 
                  value={formData.hv_transformer_kva || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอก KVA"
                />
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lv_work_volume" className="block text-sm font-medium text-gray-700 mb-1">ปริมาณงานแรงต่ำ (วงจร-กม.):</label>
                <input 
                  type="text" 
                  id="lv_work_volume" 
                  name="lv_work_volume" 
                  value={formData.lv_work_volume || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกจำนวน"
                />
              </div>
              <div>
                <label htmlFor="lv_work_volume_poles" className="block text-sm font-medium text-gray-700 mb-1">จำนวนเสา (ต้น):</label>
                <input 
                  type="text" 
                  id="lv_work_volume_poles" 
                  name="lv_work_volume_poles" 
                  value={formData.lv_work_volume_poles || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกจำนวนเสา"
                />
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="supervisor_name" className="block text-sm font-medium text-gray-700 mb-1">ผู้ควบคุมงาน:</label>
                <input 
                  type="text" 
                  id="supervisor_name" 
                  name="supervisor_name" 
                  value={formData.supervisor_name || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกชื่อผู้ควบคุมงาน"
                />
              </div>
              <div>
                <label htmlFor="supervisor_position" className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง:</label>
                <input 
                  type="text" 
                  id="supervisor_position" 
                  name="supervisor_position" 
                  value={formData.supervisor_position || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกตำแหน่ง"
                />
              </div>
              <div>
                <label htmlFor="supervisor_affiliation" className="block text-sm font-medium text-gray-700 mb-1">สังกัด:</label>
                <input 
                  type="text" 
                  id="supervisor_affiliation" 
                  name="supervisor_affiliation" 
                  value={formData.supervisor_affiliation || ''} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm"
                  placeholder="กรอกสังกัด"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Inspection Items Sections */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-[#5b2d90]">รายการตรวจสอบ</h2>
          <CorrectiveRadio
            items={initialConstructionItems}
            values={formData.inspection_items}
            onChange={items => setFormData(prev => ({ ...prev, inspection_items: items }))}
            disabled={isSubmitting}
          />
        </section>
        
        {/* Inspection Summary Section */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
          <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
            ผลการตรวจสอบ
          </h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="inline-flex items-center text-gray-800">
              <input
                type="radio"
                name="inspection_result"
                value="ถูกต้องตามมาตรฐาน กฟภ."
                checked={formData.inspection_result === 'ถูกต้องตามมาตรฐาน กฟภ.'}
                onChange={handleChange}
                className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-6 w-6"
              />
              <span className="ml-3">ตรวจสอบแล้ว ถูกต้องตามมาตรฐาน กฟภ.</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="radio"
                name="inspection_result"
                value="เห็นควรแก้ไข"
                checked={formData.inspection_result === 'เห็นควรแก้ไข'}
                onChange={handleChange}
                className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-6 w-6"
              />
              <span className="ml-3">ตรวจสอบแล้ว เห็นควรแก้ไขให้ถูกต้องตามรายการข้างต้น</span>
            </label>
          </div>
        </section>

        {/* Signatures Section */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">ลายเซ็น</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="user_position" className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่งผู้ขอใช้ไฟฟ้า:</label>
              <input 
                type="text" 
                id="user_position" 
                name="user_position" 
                value={formData.user_position || ''} 
                onChange={handleChange} 
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 shadow-sm mb-4"
                placeholder="กรอกตำแหน่ง"
              />
              <SignaturePad 
                title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" 
                ref={userSigRef}
                onSave={(dataUrl) => handleSignatureSave('user_signature', dataUrl)} 
                onClear={() => handleSignatureClear('user_signature')}
                initialValue={formData.user_signature}
              />
            </div>
            <SignaturePad 
              title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" 
              ref={inspectorSigRef} 
              onSave={(dataUrl) => handleSignatureSave('inspector_signature', dataUrl)} 
              onClear={() => handleSignatureClear('inspector_signature')}
              initialValue={formData.inspector_signature}
            />
          </div>
        </section>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 mt-8 border-t border-gray-200">
          {typeof window !== 'undefined' && (
            <PDFDownloadLink
              document={<ConstructionInspectionPDF formData={formData} />}
              fileName={`construction-inspection-form-${formData.work_name || 'form'}.pdf`}
              className="w-full sm:w-auto"
            >
              {({ loading, error }) => (
                <button
                  type="button"
                  disabled={loading || isSubmitting || error}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-base text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg shadow-sm hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Download className="w-5 h-5"/>
                  {loading ? 'กำลังสร้าง...' : error ? 'เกิดข้อผิดพลาด' : 'ดาวน์โหลด PDF'}
                </button>
              )}
            </PDFDownloadLink>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-base text-white bg-[#5b2d90] rounded-lg shadow-lg hover:bg-[#4a2575] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a78bfa] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>กำลังบันทึก...</span>
                </>
            ) : (
                <>
                    <Save className="w-5 h-5"/>
                    <span>บันทึกข้อมูล</span>
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5b2d90] mb-4"></div>
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-2">กำลังโหลดข้อมูลฟอร์ม...</p>
      </div>
    </div>
  );
}

export default function ConstructionInspectionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingFallback />}>
        <ConstructionInspectionFormContent />
      </Suspense>
    </div>
  );
}