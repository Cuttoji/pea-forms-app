"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';
import { useFormManager } from "@/lib/hooks/useFormManager";
import { FormProvider } from '@/lib/contexts/FormContext';
import CommercialInspectionPDF from "@/components/pdf/CommercialInspectionPDF";

const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), {
  ssr: false
});

// --- ค่าเริ่มต้นของข้อมูลในฟอร์ม ---
const initialFormData = {
  id: null,
  user_id: null,

  // ข้อมูลทั่วไป
  inspectionnumber: "",
  inspectiondate: new Date().toISOString().split('T')[0],
  requestnumber: "",
  requestdate: null,
  peaoffice: "",
  fullname: "",
  phone: "",
  address: "",
  latitude: null,
  longitude: null,
  address_photo_url: "",
  voltagesystem: "",
  estimatedload: "",
  hasdesigncertification: null,

  // 2.1 ระบบจำหน่ายเหนือดิน
  overhead_cabletype: "",
  overhead_cabletype_correct: '',
  overhead_cabletype_correct_note: "",
  overhead_cablesizesqmm: "",
  overhead_cablesize_correct: '',
  overhead_cablesize_correct_note: "",
  overhead_polecondition_correct: '',
  overhead_polecondition_correct_note: "",
  overhead_poletopequipment_correct: '',
  overhead_poletopequipment_correct_note: "",
  overhead_guywireassembly_correct: '',
  overhead_guywireassembly_correct_note: "",
  overhead_insulatortype_correct: '',
  overhead_insulatortype_correct_note: "",
  overhead_cablesagging_correct: '',
  overhead_cablesagging_correct_note: "",
  overhead_clearance_correct: '',
  overhead_clearance_correct_note: "",
  overhead_hvsurgearrester_correct: '',
  overhead_hvsurgearrester_correct_note: "",
  overhead_cablejointcondition_correct: '',
  overhead_cablejointcondition_correct_note: "",
  overhead_grounding_correct: '',
  overhead_grounding_correct_note: "",

  // 2.2 ระบบจำหน่ายใต้ดิน
  underground_cabletype: "",
  underground_cabletype_correct: '',
  underground_cabletype_correct_note: "",
  underground_cablesizesqmm: "",
  underground_cablesize_correct: '',
  underground_cablesize_correct_note: "",
  underground_visiblecablecondition_correct: '',
  underground_visiblecablecondition_correct_note: "",
  underground_cabletension_correct: '',
  underground_cabletension_correct_note: "",
  underground_hvsurgearrester_correct: '',
  underground_hvsurgearrester_correct_note: "",
  underground_cablejointcondition_correct: '',
  underground_cablejointcondition_correct_note: "",
  underground_grounding_correct: '',
  underground_grounding_correct_note: "",

  // 2.3 เครื่องปลดวงจรต้นทาง
  disconnectingdevicestatus: '',
  disconnectingdevicestatus_note: "",
  disconnectingdevicetype: [],
  disconnectingdeviceswitchtype: "",
  hvdistributionother: "",

  // หม้อแปลง
  transformer_tested: null,
  transformer_number: "",
  transformer_size_kva: "",
  transformer_hv_voltage: "",
  transformer_lv_voltage: "",
  transformer_impedance: "",
  transformer_type: "",
  transformer_type_other: "",
  transformer_vector_group: "",
  transformer_shortcircuitrating_correct: '',
  transformer_shortcircuitrating_correct_note: "",
  transformer_properties_correct: '',
  transformer_properties_correct_note: "",
  transformer_installationtype: [],
  transformer_installation_correct: '',
  transformer_installation_correct_note: "",
  transformer_overcurrentprotectiontype: [],
  transformer_overcurrentprotection_other: "",
  transformer_continuouscurrent_a: '',
  transformer_overcurrent_correct: '',
  transformer_overcurrent_correct_note: "",
  transformer_interruptingcapacity_ic: '',
  transformer_overcurrentprotection_correct: '',
  transformer_overcurrentprotection_correct_note: "",
  transformer_hvsurgearrester_correct: '',
  transformer_hvsurgearrester_correct_note: "",
  transformer_groundingassembly_correct: '',
  transformer_groundingassembly_correct_note: "",
  transformer_hvgroundresistance_correct: '',
  transformer_hvgroundresistance_correct_note: "",
  transformer_silicagel_correct: '',
  transformer_silicagel_correct_note: "",
  transformer_bushingcondition_correct: '',
  transformer_bushingcondition_correct_note: "",
  transformer_oillevel_correct: '',
  transformer_oillevel_correct_note: "",
  transformer_oilleak_correct: '',
  transformer_oilleak_correct_note: "",
  transformer_warningsign_correct: '',
  transformer_warningsign_correct_note: "",
  transformer_other_correct_note: "",

  // สรุปผลและลงนาม
  summaryresult: "",
  scopeofinspection: "",
  usersignature: "",
  inspectorsignature: "",
};

function CommercialInspectionForm() {
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
  } = useFormManager('commercial_inspection_forms', initialFormData, [], '*', 'form-images');

  const userSigRef = useRef(null);
  const inspectorSigRef = useRef(null);
  const imageUploadRef = useRef(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        toast.error('กรุณาเข้าสู่ระบบก่อนใช้งาน');
      }
    };
    
    checkAuth();
  }, []);

  const handleLocationSelect = (location) => {
    setFormData(prevData => ({
      ...prevData,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6),
    }));
  };

  const handleRadioChange = (groupName, value, noteFieldName) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: value,
      ...(noteFieldName && value === 'ถูกต้อง' ? { [noteFieldName]: '' } : {}),
    }));
  };

  // Enhanced handleChange to properly handle date fields
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || null
    }));
  };

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

  // Enhanced checkbox handling for array fields
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const arrayFields = ['disconnectingdevicetype', 'transformer_installationtype', 'transformer_overcurrentprotectiontype'];
    
    if (arrayFields.includes(name)) {
      const currentArray = Array.isArray(formData[name]) ? formData[name] : [];
      let newValue;
      
      if (checked) {
        newValue = [...currentArray, value];
      } else {
        newValue = currentArray.filter((item) => item !== value);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  // เพิ่ม useEffect เพื่อ debug ข้อมูลที่โหลดมา
  useEffect(() => {
    if (!isLoading && formData) {
      console.log('Current form data:', formData);
      console.log('Form data keys:', Object.keys(formData));
      console.log('Form data values:', Object.values(formData).filter(v => v !== '' && v !== null));
    }
  }, [isLoading, formData]);

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
      <form onSubmit={handleFormSubmit} id="pea-commercial-inspection-form" className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
        <style jsx global>{`
          .sigCanvas { touch-action: none; }
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
          input[type=number] { -moz-appearance: textfield; }
        `}</style>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-[#5b2d90]">
          แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้า อื่นๆ
        </h2>

        {/* Header Section */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="inspectionnumber" className="block text-sm font-medium text-gray-900 mb-1">เลขที่บันทึกตรวจสอบ:</label>
              <input type="text" id="inspectionnumber" name="inspectionnumber" value={formData.inspectionnumber || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900" />
            </div>
            <div>
              <label htmlFor="inspectiondate" className="block text-sm font-medium text-gray-900 mb-1">วันที่ตรวจสอบ:</label>
              <input 
                type="date" 
                id="inspectiondate" 
                name="inspectiondate" 
                value={formData.inspectiondate || ''} 
                onChange={handleDateChange} 
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900" 
              />
            </div>
            <div>
              <label htmlFor="requestnumber" className="block text-sm font-medium text-gray-900 mb-1">เลขที่คำร้องขอใช้ไฟฟ้า:</label>
              <input type="text" id="requestnumber" name="requestnumber" value={formData.requestnumber || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900" />
            </div>
            <div>
              <label htmlFor="requestdate" className="block text-sm font-medium text-gray-900 mb-1">วันที่ยื่นคำร้อง:</label>
              <input 
                type="date" 
                id="requestdate" 
                name="requestdate" 
                value={formData.requestdate || ''} 
                onChange={handleDateChange} 
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900" 
              />
            </div>
          </div>
        </section>

        {/* 1. General Information */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-[#5b2d90]">1. ข้อมูลทั่วไป</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-900 mb-1">ชื่อนิติบุคคล/ผู้ขอใช้ไฟฟ้า:</label>
              <input type="text" id="fullname" name="fullname" value={formData.fullname || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">โทรศัพท์:</label>
              <input type="text" id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-1">ที่อยู่:</label>
              <textarea id="address" name="address" value={formData.address || ''} onChange={handleChange} rows="3" className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900"></textarea>
            </div>
            <div className="md:col-span-2 bg-white p-4 rounded-lg shadow mt-4">
              <h3 className="text-lg font-semibold text-[#3a1a5b] mb-3">ค้นหาและปักหมุดที่อยู่</h3>
              <p className="text-sm text-gray-500 mb-3">ค้นหาหรือลากแผนที่เพื่อเลือกตำแหน่ง จากนั้นพิกัดจะแสดงด้านล่าง</p>
              <div className="relative z-0 h-80 rounded-lg overflow-hidden">
                <OpenStreetMapComponent
                  onLocationSelect={handleLocationSelect}
                  initialLatitude={formData.latitude}
                  initialLongitude={formData.longitude}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <p>ละติจูด: <span className="font-mono text-gray-700 p-2 bg-gray-100 rounded">{formData.latitude || 'N/A'}</span></p>
                <p>ลองจิจูด: <span className="font-mono text-gray-700 p-2 bg-gray-100 rounded">{formData.longitude || 'N/A'}</span></p>
              </div>
            </div>
            <div className="md:col-span-2 mt-4">
              <ImageUpload
                ref={imageUploadRef}
                onImageSelected={handleImageUpload}
                disabled={isSubmitting}
                initialImageUrl={formData.address_photo_url}
              />
            </div>
            <div>
              <label htmlFor="voltagesystem" className="block text-sm font-medium text-gray-900 mb-1">ระบบแรงดันไฟฟ้า:</label>
              <select id="voltagesystem" name="voltagesystem" value={formData.voltagesystem || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] bg-white text-gray-900">
                <option value="">เลือกระบบแรงดัน</option>
                <option value="22kV">22 kV</option>
                <option value="33kV">33 kV</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimatedload" className="block text-sm font-medium text-gray-900 mb-1">โหลดประมาณ (kVA):</label>
              <input type="number" step="any" id="estimatedload" name="estimatedload" value={formData.estimatedload || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900" />
            </div>
          </div>
        </section>

        {/* 2. การตรวจสอบ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-[#5b2d90]">2. การตรวจสอบ</h2>

          {/* เอกสารรับรองการออกแบบ */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <label className="block text-xl font-bold text-[#3a1a5b] mb-4">เอกสารรับรองการออกแบบระบบไฟฟ้า:</label>
            <div className="flex flex-col sm:flex-row gap-4 mt-3">
              <label className="inline-flex items-start cursor-pointer p-4 rounded-lg border border-gray-300 transition-all duration-200 hover:border-[#a78bfa] flex-1">
                <input
                  type="radio"
                  name="hasdesigncertification"
                  value="true"
                  checked={formData.hasdesigncertification === true}
                  onChange={() => setFormData(prev => ({ ...prev, hasdesigncertification: true }))
                  }
                  className="form-radio h-5 w-5 text-[#5b2d90] ring-offset-2 focus:ring-2 focus:ring-[#a78bfa] cursor-pointer"
                />
                <span className="ml-3 text-base font-medium text-gray-800">มี</span>
              </label>
              <label className="inline-flex items-start cursor-pointer p-4 rounded-lg border border-gray-300 transition-all duration-200 hover:border-[#a78bfa] flex-1">
                <input
                  type="radio"
                  name="hasdesigncertification"
                  value="false"
                  checked={formData.hasdesigncertification === false}
                  onChange={() => setFormData(prev => ({ ...prev, hasdesigncertification: false }))}
                  className="form-radio h-5 w-5 text-[#5b2d90] ring-offset-2 focus:ring-2 focus:ring-[#a78bfa] cursor-pointer"
                />
                <span className="ml-3 text-base font-medium text-gray-800">ไม่มี</span>
              </label>
            </div>
          </div>

          {/* Overhead Distribution System */}
          <div className="pl-4 border-l-4 border-purple-300">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.1 ระบบจำหน่ายเหนือดิน</h4>
            <div className="space-y-6">
              <div className="mb-4">
                <label htmlFor="overhead_cabletype" className="block text-sm font-semibold text-gray-800 mb-2">2.1.1 ชนิดสายตัวนำ:</label>
                <input type="text" id="overhead_cabletype" name="overhead_cabletype" value={formData.overhead_cabletype || ''} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
                <CorrectiveRadio
                  groupName="overhead_cabletype_correct"
                  label=""
                  currentValue={formData.overhead_cabletype_correct}
                  currentNote={formData.overhead_cabletype_correct_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="overhead_cablesizesqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.1.2 ขนาดสายตัวนำ (ตร.มม.):</label>
                <input type="number" step="any" id="overhead_cablesizesqmm" name="overhead_cablesizesqmm" value={formData.overhead_cablesizesqmm || ''} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
                <CorrectiveRadio
                  groupName="overhead_cablesize_correct"
                  label=""
                  currentValue={formData.overhead_cablesize_correct}
                  currentNote={formData.overhead_cablesize_correct_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
              <CorrectiveRadio groupName="overhead_polecondition_correct" label="2.1.3 สภาพเสาและระยะห่าง" currentValue={formData.overhead_polecondition_correct} currentNote={formData.overhead_polecondition_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="overhead_poletopequipment_correct" label="2.1.4 การประกอบอุปกรณ์หัวเสา" currentValue={formData.overhead_poletopequipment_correct} currentNote={formData.overhead_poletopequipment_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="overhead_guywireassembly_correct" label="2.1.5 การประกอบชุดยึดโยง" currentValue={formData.overhead_guywireassembly_correct} currentNote={formData.overhead_guywireassembly_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="overhead_insulatortype_correct" label="2.1.6 ลูกถ้วยและฉนวน" currentValue={formData.overhead_insulatortype_correct} currentNote={formData.overhead_insulatortype_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="overhead_cablesagging_correct" label="2.1.7 การพาดสาย (สภาพสาย, ระยะหย่อนยาน)" currentValue={formData.overhead_cablesagging_correct} currentNote={formData.overhead_cablesagging_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="overhead_clearance_correct" label="2.1.8 ระยะห่างของสายกับอาคาร สิ่งก่อสร้าง หรือต้นไม้" currentValue={formData.overhead_clearance_correct} currentNote={formData.overhead_clearance_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="overhead_hvsurgearrester_correct" label="2.1.9 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)" currentValue={formData.overhead_hvsurgearrester_correct} currentNote={formData.overhead_hvsurgearrester_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="overhead_cablejointcondition_correct" label="2.1.10 สภาพของจุดต่อสาย" currentValue={formData.overhead_cablejointcondition_correct} currentNote={formData.overhead_cablejointcondition_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="overhead_grounding_correct" label="2.1.11 การต่อลงดิน" currentValue={formData.overhead_grounding_correct} currentNote={formData.overhead_grounding_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            </div>
          </div>

          {/* Underground Distribution System */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.2 ระบบจำหน่ายใต้ดิน</h4>
            <div className="space-y-6">
              <div className="mb-4">
                <label htmlFor="underground_cabletype" className="block text-sm font-semibold text-gray-800 mb-2">2.2.1 ชนิดสายตัวนำ:</label>
                <input type="text" id="underground_cabletype" name="underground_cabletype" value={formData.underground_cabletype || ''} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
                <CorrectiveRadio
                  groupName="underground_cabletype_correct"
                  label=""
                  currentValue={formData.underground_cabletype_correct}
                  currentNote={formData.underground_cabletype_correct_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="underground_cablesizesqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.2.2 ขนาดสายตัวนำ (ตร.มม.):</label>
                <input type="number" step="any" id="underground_cablesizesqmm" name="underground_cablesizesqmm" value={formData.underground_cablesizesqmm || ''} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
                <CorrectiveRadio
                  groupName="underground_cablesize_correct"
                  label=""
                  currentValue={formData.underground_cablesize_correct}
                  currentNote={formData.underground_cablesize_correct_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
              <CorrectiveRadio groupName="underground_visiblecablecondition_correct" label="2.2.3 สภาพสายส่วนที่มองเห็นได้" currentValue={formData.underground_visiblecablecondition_correct} currentNote={formData.underground_visiblecablecondition_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="underground_cabletension_correct" label="2.2.4 ความตึงของสาย" currentValue={formData.underground_cabletension_correct} currentNote={formData.underground_cabletension_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="underground_hvsurgearrester_correct" label="2.2.5 การติดตั้งกับดักเสิร์จ" currentValue={formData.underground_hvsurgearrester_correct} currentNote={formData.underground_hvsurgearrester_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="underground_cablejointcondition_correct" label="2.2.6 สภาพของจุดต่อสาย" currentValue={formData.underground_cablejointcondition_correct} currentNote={formData.underground_cablejointcondition_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="underground_grounding_correct" label="2.2.7 การต่อลงดิน" currentValue={formData.underground_grounding_correct} currentNote={formData.underground_grounding_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            </div>
          </div>

          {/* Disconnecting Device */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.3 การติดตั้งเครื่องปลดวงจรต้นทาง</h4>
            <div className="space-y-3">
              {['ดรอพเอาท์ฟิวส์คัตเอาท์', 'สวิตช์ตัดตอน', 'RMU (ไม่รวมฟังก์ชั่น)'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    name="disconnectingdevicetype"
                    value={type}
                    checked={Array.isArray(formData.disconnectingdevicetype) && formData.disconnectingdevicetype.includes(type)}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transformer Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">หม้อแปลง</h3>
            <div className="space-y-4 pl-4 border-l-4 border-purple-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ขนาด (kVA)</label>
                  <input type="number" name="transformer_size_kva" value={formData.transformer_size_kva || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-700"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">พิกัดแรงดัน (ด้านแรงสูง)</label>
                  <input type="text" name="transformer_hv_voltage" value={formData.transformer_hv_voltage || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-700"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">พิกัดแรงดัน (ด้านแรงต่ำ)</label>
                  <input type="text" name="transformer_lv_voltage" value={formData.transformer_lv_voltage || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-700"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">% Impedance</label>
                  <input type="number" step="any" name="transformer_impedance" value={formData.transformer_impedance || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-700"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vector Group</label>
                  <input type="text" name="transformer_vector_group" value={formData.transformer_vector_group || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-700"/>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">ชนิด:</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center"><input type="radio" name="transformer_type" value="Oil" checked={formData.transformer_type === 'Oil'} onChange={handleChange} className="form-radio"/><span className="ml-2 text-sm text-gray-700">Oil</span></label>
                  <label className="inline-flex items-center"><input type="radio" name="transformer_type" value="Dry" checked={formData.transformer_type === 'Dry'} onChange={handleChange} className="form-radio"/><span className="ml-2 text-sm text-gray-700">Dry</span></label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="transformer_type" value="Other" checked={formData.transformer_type === 'Other'} onChange={handleChange} className="form-radio"/>
                    <span className="ml-2 text-sm text-gray-700">อื่นๆ:</span>
                    {formData.transformer_type === 'Other' && (
                      <input type="text" name="transformer_type_other" value={formData.transformer_type_other || ''} onChange={handleChange} className="ml-2 p-1 border rounded-md text-sm w-32 text-gray-700"/>
                    )}
                  </label>
                </div>
              </div>
              <CorrectiveRadio
                groupName="transformer_properties_correct"
                label="ผลการตรวจสอบคุณสมบัติ"
                currentValue={formData.transformer_properties_correct}
                currentNote={formData.transformer_properties_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* สรุปและลงนาม */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-[#5b2d90]">3. สรุปและลงนาม</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="summaryresult" className="block text-sm font-medium text-gray-900 mb-1">ผลการตรวจสอบสรุปโดยย่อ:</label>
              <textarea id="summaryresult" name="summaryresult" value={formData.summaryresult || ''} onChange={handleChange} rows="3" className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900"></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="scopeofinspection" className="block text-sm font-medium text-gray-900 mb-1">ขอบเขตและข้อจำกัด:</label>
              <textarea id="scopeofinspection" name="scopeofinspection" value={formData.scopeofinspection || ''} onChange={handleChange} rows="3" className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900"></textarea>
            </div>
            <div>
              <SignaturePad
                title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน"
                ref={userSigRef}
                onSave={(dataUrl) => handleSignatureSave('usersignature', dataUrl)}
                onClear={() => handleSignatureClear('usersignature')}
                initialValue={formData.usersignature}
              />
            </div>
            <div>
              <SignaturePad
                title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค"
                ref={inspectorSigRef}
                onSave={(dataUrl) => handleSignatureSave('inspectorsignature', dataUrl)}
                onClear={() => handleSignatureClear('inspectorsignature')}
                initialValue={formData.inspectorsignature}
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 mt-8 border-t border-gray-200">
          <PDFDownloadLink
            document={<CommercialInspectionPDF formData={formData} />}
            fileName={`commercial-inspection-form-${formData.inspectionnumber || 'form'}.pdf`}
            className="w-full sm:w-auto"
          >
            {({ loading }) => (
              <button
                type="button"
                disabled={loading || isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-base text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg shadow-sm hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Download className="w-5 h-5"/>
                {loading ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}
              </button>
            )}
          </PDFDownloadLink>

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

// Wrap the component with FormProvider
function FormWrapper() {
  return (
    <FormProvider>
      <CommercialInspectionForm />
    </FormProvider>
  );
}

export default FormWrapper;