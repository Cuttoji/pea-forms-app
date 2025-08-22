"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
import CondoInspectionPDF from "@/components/pdf/CondoInspectionPDF";
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';
import { useFormManager } from "@/lib/hooks/useFormManager";
import { FormProvider } from '@/lib/contexts/FormContext';

// Dynamic import for OpenStreetMapComponent to avoid SSR issues
const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), {
  ssr: false
});

// --- ค่าเริ่มต้นของข้อมูลในฟอร์มสำหรับอาคารชุด ---
const initialFormData = {
  id: null,
  user_id: null,

  // ข้อมูลทั่วไป
  inspectionnumber: "",
  inspectiondate: new Date().toISOString().split('T')[0], // Set current date as default
  requestnumber: "",
  requestdate: null, // Use null instead of empty string for optional dates
  fullname: "",
  phone: "",
  address: "",
  latitude: null,  
  longitude: null,
  address_photo_url: "",
  phasetype: "",
  estimatedload: "",

  has_design_certification: null,
  as_built_drawing_certified: false,
  engineer_license_copy: false,

  // 2.1 ระบบจำหน่ายเหนือดิน
  overhead_cable_type: "",
  overhead_cable_type_correct: '',
  overhead_cable_type_correct_note: "",
  overhead_cable_size_sqmm: "",
  overhead_cable_size_correct: '',
  overhead_cable_size_correct_note: "",
  overhead_pole_condition_correct: '',
  overhead_pole_condition_correct_note: "",
  overhead_pole_top_equipment_correct: '',
  overhead_pole_top_equipment_correct_note: "",
  overhead_guy_wire_assembly_correct: '',
  overhead_guy_wire_assembly_correct_note: "",
  overhead_insulator_type_correct: '',
  overhead_insulator_type_correct_note: "",
  overhead_cable_sagging_correct: '',
  overhead_cable_sagging_correct_note: "",
  overhead_clearance_correct: '',
  overhead_clearance_correct_note: "",
  overhead_hv_surge_arrester_correct: '',
  overhead_hv_surge_arrester_correct_note: "",
  overhead_cable_joint_condition_correct: '',
  overhead_cable_joint_condition_correct_note: "",
  overhead_grounding_correct: '',
  overhead_grounding_correct_note: "",

  // 2.2 ระบบจำหน่ายใต้ดิน
  underground_cable_type: "",
  underground_cable_type_correct: '',
  underground_cable_type_correct_note: "",
  underground_cable_size_sqmm: "",
  underground_cable_size_correct: '',
  underground_cable_size_correct_note: "",
  underground_visible_cable_condition_correct: '',
  underground_visible_cable_condition_correct_note: "",
  underground_cable_tension_correct: '',
  underground_cable_tension_correct_note: "",
  underground_hv_surge_arrester_correct: '',
  underground_hv_surge_arrester_correct_note: "",
  underground_cable_joint_condition_correct: '',
  underground_cable_joint_condition_correct_note: "",
  underground_grounding_correct: '',
  underground_grounding_correct_note: "",

  // 2.3 เครื่องปลดวงจรต้นทาง
  disconnecting_device_status: '',
  disconnecting_device_correct_note: "",
  disconnecting_device_type: [],
  disconnecting_device_switch_type: "",
  hv_distribution_other: "",
  hv_distribution_other_note: "",

  // หม้อแปลง (เก็บเป็น JSON Array of Objects)
  transformers: [], // ค่าเริ่มต้นเป็น Array ว่าง

  // 2.14 สายตัวนำประธานแรงต่ำ
  lv_main_cable_standard_correct: '',
  lv_main_cable_standard_correct_note: '',
  lv_main_cable_type: '',
  lv_main_cable_other_type: '',
  lv_main_cable_size: '',
  lv_main_cable_type_size_correct: '',
  lv_main_cable_type_size_correct_note: '',
  lv_main_cable_wiring_method: [],
  lv_main_cable_wiring_correct: '',
  lv_main_cable_wiring_correct_note: '',

  // 2.15 เครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์
  main_breaker_type: '',
  main_breaker_standard: '',
  main_breaker_product: '',
  main_breaker_type_spec: '',
  main_breaker_in: '',
  main_breaker_ic: '',
  main_breaker_voltage: '',
  main_breaker_at: '',
  main_breaker_af: '',
  main_breaker_gfp_installed: false,
  main_breaker_correct: '',
  main_breaker_note: '',

  // 2.16 การต่อลงดินของแผงเมนสวิตช์
  main_grounding_conductor_size_correct: '',
  main_grounding_conductor_size_correct_note: '',
  main_grounding_conductor_size_sqmm: '',
  main_grounding_resistance_correct: '',
  main_grounding_resistance_correct_note: '',
  main_grounding_test_point_correct: '',
  main_grounding_test_point_correct_note: '',
  main_grounding_bus_correct: '',
  main_grounding_bus_correct_note: '',

  // 2.17 แผงจ่ายไฟประจำชั้น
  floor_panel_breaker_standard_correct: '',
  floor_panel_breaker_standard_correct_note: '',
  floor_panel_breaker_size_correct: '',
  floor_panel_breaker_size_correct_note: '',
  floor_panel_breaker_at: '',
  floor_panel_breaker_af: '',
  floor_panel_breaker_ic: '',
  floor_panel_ground_bus_correct: '',
  floor_panel_ground_bus_correct_note: '',

  // 2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์
  meter_breaker_size_correct: '',
  meter_breaker_size_correct_note: '',
  meter_breaker_at: '',
  meter_breaker_af: '',
  meter_breaker_ic: '',

  // 2.19 สายตัวนำประธานเข้าห้องชุด
  room_feeder_standard_correct: '',
  room_feeder_standard_correct_note: '',
  room_feeder_type: '',
  room_feeder_size: '',
  room_feeder_wiring: [],

  // 2.20 แผงจ่ายไฟในห้องชุด
  room_panel_breaker_standard_correct: '',
  room_panel_breaker_standard_correct_note: '',
  room_panel_breaker_meter_match_correct: '',
  room_panel_breaker_meter_match_correct_note: '',
  room_panel_breaker_at: '',
  room_panel_breaker_af: '',
  room_panel_ic_rating_correct: '',
  room_panel_ic_rating_correct_note: '',
  room_panel_ground_bus_correct: '',
  room_panel_ground_bus_correct_note: '',

  // 2.22 อื่นๆ
  lv_system_other_correct_note: '',

  // สรุปและลงนาม
  summaryresult: "",
  scopeofinspection: "",
  usersignature: "",
  inspectorsignature: "",
};

// เพิ่ม transformer template สำหรับการสร้าง transformer ใหม่
const newTransformerTemplate = {
  kVA: '',
  merk: '',
  serialNo: '',  // เพิ่มเลขประจำเครื่อง
  yearMade: '',  // เพิ่มปีที่ผลิต
  location: '',  // เพิ่มตำแหน่งติดตั้ง
  correct: '',
  correct_note: '',
  mounting_correct: '',        // เพิ่มการตรวจสอบการติดตั้ง
  mounting_correct_note: '',
  connection_correct: '',      // เพิ่มการตรวจสอบการต่อสาย
  connection_correct_note: '', 
  ground_correct: '',         // เพิ่มการตรวจสอบระบบดิน
  ground_correct_note: ''
};

function CondoInspectionForm() {
  const _router = useRouter();
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
  } = useFormManager('condo_inspection_forms', initialFormData, [], '*', 'form-images');

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
        // Uncomment the line below if you want to redirect to sign-in
        // router.push('/auth/signin');
      }
    };
    
    checkAuth();
  }, []);

  // ปรับ handleRadioChange ให้รองรับทั้ง event, (groupName, value), และ (event.target == undefined)
  const handleRadioChange = (groupName, value, noteFieldName) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: value,
      ...(noteFieldName && value === 'ถูกต้อง' ? { [noteFieldName]: '' } : {}),
    }));
  };

  // Enhanced handleChange to properly handle date fields และ checkbox arrays
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || null // Convert empty string to null for dates
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

  const handleLocationSelect = (location) => {
    setFormData(prevData => ({
      ...prevData,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6),
    }));
  };

  // Enhanced checkbox handling for array fields
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const arrayFields = ['disconnecting_device_type', 'lv_main_cable_wiring_method', 'room_feeder_wiring'];
    
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
      // Regular checkbox handling
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  // --- Functions to manage transformers ---
  const handleAddTransformer = () => {
    setFormData(prevData => ({
      ...prevData,
      transformers: [
        ...prevData.transformers, 
        { ...newTransformerTemplate }
      ]
    }));
  };

  const handleRemoveTransformer = (index) => {
    setFormData(prevData => ({
      ...prevData,
      transformers: prevData.transformers.filter((_, i) => i !== index)
    }));
  };

  const handleTransformerChange = (index, e) => {
    const { name, value, type } = e.target;
    setFormData(prevData => {
      const newTransformers = [...prevData.transformers];
      newTransformers[index] = {
        ...newTransformers[index],
        [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
      };
      
      // Validate kVA value
      if (name === 'kVA') {
        const kva = Number(value);
        if (isNaN(kva) || kva < 0) {
          newTransformers[index].kVA = '';
        }
      }
      
      // Validate yearMade
      if (name === 'yearMade') {
        const year = Number(value);
        if (isNaN(year) || year < 0) {
          newTransformers[index].yearMade = '';
        }
      }

      return { ...prevData, transformers: newTransformers };
    });
  };

  const handleTransformerCorrectiveChange = (index, field, value) => {
    setFormData(prevData => {
      const newTransformers = [...prevData.transformers];
      newTransformers[index] = { ...newTransformers[index], [field]: value };
      if (field === 'correct' && value === 'ถูกต้อง') {
        newTransformers[index] = { ...newTransformers[index], correct_note: '' };
      }
      return { ...prevData, transformers: newTransformers };
    });
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
      <form onSubmit={handleFormSubmit} id="pea-condo-inspection-form" className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
        <style jsx global>{`
          .sigCanvas { touch-action: none; }
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
          input[type=number] { -moz-appearance: textfield; }
        `}</style>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-[#5b2d90]">
          แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้า (สำหรับอาคารชุด)
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

        {/* --- 1. General Information --- */}
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
              <label htmlFor="voltageSystem" className="block text-sm font-medium text-gray-900 mb-1">ระบบแรงดันไฟฟ้า:</label>
              <select id="voltageSystem" name="phasetype" value={formData.phasetype || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] bg-white text-gray-900">
                <option value="">เลือกระบบแรงดัน</option>
                <option value="22kV">22 kV</option>
                <option value="33kV">33 kV</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimatedLoad" className="block text-sm font-medium text-gray-900 mb-1">โหลดประมาณ (kVA):</label>
              <input type="number" step="any" id="estimatedLoad" name="estimatedload" value={formData.estimatedload || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900" />
            </div>
          </div>
        </section>
        
        {/* --- 2. การตรวจสอบ --- */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-[#5b2d90]">2. การตรวจสอบ</h2>
          <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
            <label className="block text-lg font-semibold mb-3 text-gray-800">2.1 ระบบจำหน่ายเหนือดิน</label>
            {/* 2.1.1 ชนิดสายตัวนำ */}
            <div className="mb-4">
              <label htmlFor="overhead_cable_type" className="block text-sm font-semibold text-gray-800 mb-2">2.1.1 ชนิดสายตัวนำ:</label>
              <input
                type="text"
                id="overhead_cable_type"
                name="overhead_cable_type" // แก้ไขตรงนี้
                value={formData.overhead_cable_type}
                onChange={handleChange}
                className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
              />
              <CorrectiveRadio
                groupName="overhead_cable_type_correct"
                label=""
                currentValue={formData.overhead_cable_type_correct}
                currentNote={formData.overhead_cable_type_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
            {/* 2.1.2 ขนาดสายตัวนำ */}
            <div className="mb-4">
              <label htmlFor="overhead_cable_size_sqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.1.2 ขนาดสายตัวนำ (ตร.มม.):</label>
              <input
                type="number"
                step="any"
                id="overhead_cable_size_sqmm"
                name="overhead_cable_size_sqmm"
                value={formData.overhead_cable_size_sqmm}
                onChange={handleChange}
                className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
              />
              <CorrectiveRadio
                groupName="overhead_cable_size_correct"
                label=""
                currentValue={formData.overhead_cable_size_correct} // แก้ไขตรงนี้
                currentNote={formData.overhead_cable_size_correct_note} // แก้ไขตรงนี้
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
            <CorrectiveRadio
              groupName="overhead_pole_condition_correct"
              label="2.1.3 สภาพเสาและระยะห่าง"
              currentValue={formData.overhead_pole_condition_correct}
              currentNote={formData.overhead_pole_condition_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_pole_top_equipment_correct"
              label="2.1.4 การประกอบอุปกรณ์หัวเสา"
              currentValue={formData.overhead_pole_top_equipment_correct}
              currentNote={formData.overhead_pole_top_equipment_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_guy_wire_assembly_correct"
              label="2.1.5 การประกอบชุดยึดโยง"
              currentValue={formData.overhead_guy_wire_assembly_correct}
              currentNote={formData.overhead_guy_wire_assembly_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_insulator_type_correct"
              label="2.1.6 ลูกถ้วยและฉนวน"
              currentValue={formData.overhead_insulator_type_correct}
              currentNote={formData.overhead_insulator_type_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_cable_sagging_correct"
              label="2.1.7 การพาดสาย"
              currentValue={formData.overhead_cable_sagging_correct}
              currentNote={formData.overhead_cable_sagging_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_clearance_correct"
              label="2.1.8 ระยะห่างของสาย"
              currentValue={formData.overhead_clearance_correct}
              currentNote={formData.overhead_clearance_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_hv_surge_arrester_correct"
              label="2.1.9 การติดตั้งกับดักเสิร์จ"
              currentValue={formData.overhead_hv_surge_arrester_correct}
              currentNote={formData.overhead_hv_surge_arrester_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_cable_joint_condition_correct"
              label="2.1.10 สภาพของจุดต่อสาย"
              currentValue={formData.overhead_cable_joint_condition_correct}
              currentNote={formData.overhead_cable_joint_condition_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_grounding_correct"
              label="2.1.11 การต่อลงดิน"
              currentValue={formData.overhead_grounding_correct}
              currentNote={formData.overhead_grounding_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* --- 2.2 ระบบจำหน่ายใต้ดิน --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.2 ระบบจำหน่ายใต้ดิน</h4>
            <div className="space-y-4">
              <label htmlFor="underground_cable_type" className="block text-sm font-semibold text-gray-800 mb-2">2.2.1 ชนิดสายตัวนำ:</label>
              <input type="text" id="underground_cable_type" name="underground_cable_type" value={formData.underground_cable_type} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
              <CorrectiveRadio
                groupName="underground_cable_type_correct"
                currentValue={formData.underground_cable_type_correct}
                currentNote={formData.underground_cable_type_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <label htmlFor="underground_cable_size_sqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.2.2 ขนาดสายตัวนำ (ตร.มม.):</label>
              <input type="text" id="underground_cable_size_sqmm" name="underground_cable_size_sqmm" value={formData.underground_cable_size_sqmm} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
              <CorrectiveRadio
                groupName="underground_cable_size_correct"
                label="2.2.2 ขนาดสายตัวนำ"
                currentValue={formData.underground_cable_size_correct}
                currentNote={formData.underground_cable_size_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <CorrectiveRadio
                groupName="underground_visible_cable_condition_correct"
                label="2.2.3 สภาพสายส่วนที่มองเห็นได้"
                currentValue={formData.underground_visible_cable_condition_correct}
                currentNote={formData.underground_visible_cable_condition_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <CorrectiveRadio
                groupName="underground_cable_tension_correct"
                label="2.2.4 ความตึงของสาย"
                currentValue={formData.underground_cable_tension_correct}
                currentNote={formData.underground_cable_tension_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <CorrectiveRadio
                groupName="underground_hv_surge_arrester_correct"
                label="2.2.5 การติดตั้งกับดักเสิร์จ"
                currentValue={formData.underground_hv_surge_arrester_correct}
                currentNote={formData.underground_hv_surge_arrester_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <CorrectiveRadio
                groupName="underground_cable_joint_condition_correct"
                label="2.2.6 สภาพของจุดต่อสาย"
                currentValue={formData.underground_cable_joint_condition_correct}
                currentNote={formData.underground_cable_joint_condition_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <CorrectiveRadio
                groupName="underground_grounding_correct"
                label="2.2.7 การต่อลงดิน"
                currentValue={formData.underground_grounding_correct}
                currentNote={formData.underground_grounding_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
          </div>

          {/* --- 2.3 การติดตั้งเครื่องปลดวงจรต้นทาง --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.3 การติดตั้งเครื่องปลดวงจรต้นทาง</h4>
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">2.3.1 สถานะการติดตั้ง</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    id="installed"
                    type="radio"
                    name="disconnecting_device_status"
                    value="installed"
                    checked={formData.disconnecting_device_status === 'installed'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#5b2d90] border-gray-300 focus:ring-[#5b2d90]"
                  />
                  <label htmlFor="installed" className="ml-2 block text-sm text-gray-900">ติดตั้งแล้ว</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="notInstalled"
                    type="radio"
                    name="disconnecting_device_status"
                    value="not-installed"
                    checked={formData.disconnecting_device_status === 'not-installed'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#5b2d90] border-gray-300 focus:ring-[#5b2d90]"
                  />
                  <label htmlFor="notInstalled" className="ml-2 block text-sm text-gray-900">ยังไม่ติดตั้ง</label>
                </div>
              </div>
              <p className="text-sm text-gray-500 italic">
                  หากเลือก "ติดตั้งแล้ว" ให้ทำการตรวจสอบในหัวข้อถัดไป
              </p>
              {formData.disconnecting_device_status === 'not-installed' && (
                  <div className="mt-4">
                    <label htmlFor="disconnecting_device_correct_note" className="block text-sm font-medium text-gray-700">เหตุผลที่ยังไม่ติดตั้ง:</label>
                    <textarea
                      id="disconnecting_device_correct_note"
                      name="disconnecting_device_correct_note"
                      value={formData.disconnecting_device_correct_note}
                      onChange={handleChange}
                      rows="2"
                      className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
                    ></textarea>
                  </div>
              )}
            </div>
            {formData.disconnecting_device_status === 'installed' && (
              <div className="space-y-4 mt-6">
                <p className="text-sm font-medium text-gray-700">2.3.2 ชนิดของเครื่องปลดวงจร:</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      id="load-break-switch"
                      type="checkbox"
                      name="disconnecting_device_type"
                      value="Load Break Switch"
                      checked={Array.isArray(formData.disconnecting_device_type) && formData.disconnecting_device_type.includes('Load Break Switch')}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]"
                    />
                    <label htmlFor="load-break-switch" className="ml-2 block text-sm text-gray-900">Load Break Switch</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="air-break-switch"
                      type="checkbox"
                      name="disconnecting_device_type"
                      value="Air Break Switch"
                      checked={Array.isArray(formData.disconnecting_device_type) && formData.disconnecting_device_type.includes('Air Break Switch')}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]"
                    />
                    <label htmlFor="air-break-switch" className="ml-2 block text-sm text-gray-900">Air Break Switch</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="oil-switch"
                      type="checkbox"
                      name="disconnecting_device_type"
                      value="Oil Switch"
                      checked={Array.isArray(formData.disconnecting_device_type) && formData.disconnecting_device_type.includes('Oil Switch')}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]"
                    />
                    <label htmlFor="oil-switch" className="ml-2 block text-sm text-gray-900">Oil Switch</label>
                  </div>
                </div>
                <label htmlFor="disconnecting_device_switch_type" className="block text-sm font-medium text-gray-900 mb-1">2.3.3 ชนิดสวิตช์:</label>
                <input type="text" id="disconnecting_device_switch_type" name="disconnecting_device_switch_type" value={formData.disconnecting_device_switch_type} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
              </div>
            )}
          </div>
          
{/* --- 2.4 - 2.13 หม้อแปลง --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.4 - 2.13 หม้อแปลง (Transformers)</h4>
            <div className="p-4 border border-gray-200 rounded-md">
              {formData.transformers?.map((transformer, index) => (
                <div key={index} className="space-y-4 mb-4 pb-4 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-gray-700">หม้อแปลงลูกที่ {index + 1}</h5>
                    <button type="button" onClick={() => handleRemoveTransformer(index)} className="text-red-500 hover:text-red-700 text-sm">ลบ</button>
                  </div>
                  {/* ข้อมูลหม้อแปลง */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ขนาด (kVA):</label>
                      <input type="number" name="kVA" value={transformer.kVA} onChange={(e) => handleTransformerChange(index, e)} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Merk:</label>
                      <input type="text" name="merk" value={transformer.merk} onChange={(e) => handleTransformerChange(index, e)} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">เลขประจำเครื่อง:</label>
                      <input type="text" name="serialNo" value={transformer.serialNo} onChange={(e) => handleTransformerChange(index, e)} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ปีที่ผลิต:</label>
                      <input type="number" name="yearMade" value={transformer.yearMade} onChange={(e) => handleTransformerChange(index, e)} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ตำแหน่งติดตั้ง:</label>
                    <input type="text" name="location" value={transformer.location} onChange={(e) => handleTransformerChange(index, e)} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                  </div>
                  {/* --- ส่วนที่แก้ไข --- */}
                  <CorrectiveRadio
                    groupName={`transformers[${index}].correct`}
                    label="สถานะ"
                    currentValue={transformer.correct}
                    currentNote={transformer.correct_note}
                    onStatusChange={(_, value) => handleTransformerCorrectiveChange(index, 'correct', value)}
                    onNoteChange={(e) => handleTransformerCorrectiveChange(index, 'correct_note', e.target.value)}
                  />
                  <CorrectiveRadio
                    groupName={`transformers[${index}].mounting_correct`}
                    label="การติดตั้ง"
                    currentValue={transformer.mounting_correct}
                    currentNote={transformer.mounting_correct_note}
                    onStatusChange={(_, value) => handleTransformerCorrectiveChange(index, 'mounting_correct', value)}
                    onNoteChange={(e) => handleTransformerCorrectiveChange(index, 'mounting_correct_note', e.target.value)}
                  />
                  <CorrectiveRadio
                    groupName={`transformers[${index}].connection_correct`}
                    label="การต่อสาย"
                    currentValue={transformer.connection_correct}
                    currentNote={transformer.connection_correct_note}
                    onStatusChange={(_, value) => handleTransformerCorrectiveChange(index, 'connection_correct', value)}
                    onNoteChange={(e) => handleTransformerCorrectiveChange(index, 'connection_correct_note', e.target.value)}
                  />
                  <CorrectiveRadio
                    groupName={`transformers[${index}].ground_correct`}
                    label="ระบบดิน"
                    currentValue={transformer.ground_correct}
                    currentNote={transformer.ground_correct_note}
                    onStatusChange={(_, value) => handleTransformerCorrectiveChange(index, 'ground_correct', value)}
                    onNoteChange={(e) => handleTransformerCorrectiveChange(index, 'ground_correct_note', e.target.value)}
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddTransformer} className="w-full py-2 mt-4 text-[#5b2d90] border border-[#5b2d90] rounded-md hover:bg-[#f0eaff] transition-colors duration-200">
                + เพิ่มหม้อแปลง
              </button>
            </div>
          </div>
          
          {/* --- 2.14 สายตัวนำประธานแรงต่ำ --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6 space-y-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.14 สายตัวนำประธานแรงต่ำ</h4>
            <CorrectiveRadio
              groupName="lv_main_cable_standard_correct"
              label="2.14.1 มาตรฐานสายตัวนำ"
              currentValue={formData.lv_main_cable_standard_correct}
              currentNote={formData.lv_main_cable_standard_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <div className="pl-4">
              <label htmlFor="lv_main_cable_type" className="block text-sm font-semibold text-gray-800 mb-2">ชนิดของสาย:</label>
              <input type="text" id="lv_main_cable_type" name="lv_main_cable_type" value={formData.lv_main_cable_type} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
            </div>
            <div className="pl-4">
              <label htmlFor="lv_main_cable_size" className="block text-sm font-semibold text-gray-800 mb-2">ขนาดของสาย:</label>
              <input type="text" id="lv_main_cable_size" name="lv_main_cable_size" value={formData.lv_main_cable_size} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
              <CorrectiveRadio
                groupName="lv_main_cable_type_size_correct"
                label="ชนิดและขนาดสาย"
                currentValue={formData.lv_main_cable_type_size_correct}
                currentNote={formData.lv_main_cable_type_size_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
            <div className="pl-4">
              <p className="block text-sm font-semibold text-gray-800 mb-2">2.14.3 วิธีเดินสาย:</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="wiring-conduit" 
                    name="lv_main_cable_wiring_method" 
                    value="ในท่อร้อยสาย" 
                    checked={Array.isArray(formData.lv_main_cable_wiring_method) && formData.lv_main_cable_wiring_method.includes('ในท่อร้อยสาย')} 
                    onChange={handleCheckboxChange} 
                    className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]" 
                  />
                  <label htmlFor="wiring-conduit" className="ml-2 block text-sm text-gray-900">ในท่อร้อยสาย</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="wiring-cable-tray" 
                    name="lv_main_cable_wiring_method" 
                    value="รางเคเบิล" 
                    checked={Array.isArray(formData.lv_main_cable_wiring_method) && formData.lv_main_cable_wiring_method.includes('รางเคเบิล')} 
                    onChange={handleCheckboxChange} 
                    className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]" 
                  />
                  <label htmlFor="wiring-cable-tray" className="ml-2 block text-sm text-gray-900">รางเคเบิล</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="wiring-open" 
                    name="lv_main_cable_wiring_method" 
                    value="ในที่เปิดโล่ง" 
                    checked={Array.isArray(formData.lv_main_cable_wiring_method) && formData.lv_main_cable_wiring_method.includes('ในที่เปิดโล่ง')} 
                    onChange={handleCheckboxChange} 
                    className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]" 
                  />
                  <label htmlFor="wiring-open" className="ml-2 block text-sm text-gray-900">ในที่เปิดโล่ง</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="wiring-other" 
                    name="lv_main_cable_wiring_method" 
                    value="อื่นๆ" 
                    checked={Array.isArray(formData.lv_main_cable_wiring_method) && formData.lv_main_cable_wiring_method.includes('อื่นๆ')} 
                    onChange={handleCheckboxChange} 
                    className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]" 
                  />
                  <label htmlFor="wiring-other" className="ml-2 block text-sm text-gray-900">อื่นๆ</label>
                </div>
              </div>
              <CorrectiveRadio
                groupName="lv_main_cable_wiring_correct"
                label="การเดินสาย"
                currentValue={formData.lv_main_cable_wiring_correct}
                currentNote={formData.lv_main_cable_wiring_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
          </div>

          {/* --- 2.15 เครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6 space-y-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.15 เครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="main_breaker_type" className="block text-sm font-medium text-gray-700">ชนิด:</label>
                  <input type="text" id="main_breaker_type" name="main_breaker_type" value={formData.main_breaker_type} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="main_breaker_standard" className="block text-sm font-medium text-gray-700">มาตรฐาน:</label>
                  <input type="text" id="main_breaker_standard" name="main_breaker_standard" value={formData.main_breaker_standard} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="main_breaker_product" className="block text-sm font-medium text-gray-700">ยี่ห้อ:</label>
                  <input type="text" id="main_breaker_product" name="main_breaker_product" value={formData.main_breaker_product} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="main_breaker_type_spec" className="block text-sm font-medium text-gray-700">พิกัดกระแส (In):</label>
                  <input type="text" id="main_breaker_in" name="main_breaker_in" value={formData.main_breaker_in} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="main_breaker_ic" className="block text-sm font-medium text-gray-700">พิกัดกระแสลัดวงจร (I.C.):</label>
                  <input type="text" id="main_breaker_ic" name="main_breaker_ic" value={formData.main_breaker_ic} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="main_breaker_voltage" className="block text-sm font-medium text-gray-700">พิกัดแรงดัน:</label>
                  <input type="text" id="main_breaker_voltage" name="main_breaker_voltage" value={formData.main_breaker_voltage} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="main_breaker_at" className="block text-sm font-medium text-gray-700">พิกัดกระแสที่ตั้ง (AT):</label>
                  <input type="text" id="main_breaker_at" name="main_breaker_at" value={formData.main_breaker_at} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="main_breaker_af" className="block text-sm font-medium text-gray-700">พิกัดเฟรม (AF):</label>
                  <input type="text" id="main_breaker_af" name="main_breaker_af" value={formData.main_breaker_af} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-800" />
                </div>
            </div>
            <div className="flex items-center mt-3">
              <input type="checkbox" id="gfpInstalled" name="main_breaker_gfp_installed" checked={formData.main_breaker_gfp_installed} onChange={handleChange} className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]" />
              <label htmlFor="gfpInstalled" className="ml-2 block text-sm text-gray-900">มีอุปกรณ์ป้องกันกระแสรั่ว (GFP) ติดตั้งอยู่</label>
            </div>
            <CorrectiveRadio
              groupName="main_breaker_correct"
              label="การติดตั้งถูกต้อง"
              currentValue={formData.main_breaker_correct}
              currentNote={formData.main_breaker_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* --- 2.16 การต่อลงดินของแผงเมนสวิตช์ --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6 space-y-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.16 การต่อลงดินของแผงเมนสวิตช์</h4>
            <div className="pl-4">
              <label htmlFor="main_grounding_conductor_size_sqmm" className="block text-sm font-semibold text-gray-800 mb-2">ขนาดสายดิน (ตร.มม.):</label>
              <input type="text" id="main_grounding_conductor_size_sqmm" name="main_grounding_conductor_size_sqmm" value={formData.main_grounding_conductor_size_sqmm} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900" />
              <CorrectiveRadio
                groupName="main_grounding_conductor_size_correct"
                label="ขนาดสายดินถูกต้อง"
                currentValue={formData.main_grounding_conductor_size_correct}
                currentNote={formData.main_grounding_conductor_size_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
            <CorrectiveRadio
              groupName="main_grounding_resistance_correct"
              label="ค่าความต้านทานถูกต้อง"
              currentValue={formData.main_grounding_resistance_correct}
              currentNote={formData.main_grounding_resistance_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="main_grounding_test_point_correct"
              label="มีจุดทดสอบค่าความต้านทาน"
              currentValue={formData.main_grounding_test_point_correct}
              currentNote={formData.main_grounding_test_point_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="main_grounding_bus_correct"
              label="การต่อลงดินของบัสบาร์"
              currentValue={formData.main_grounding_bus_correct}
              currentNote={formData.main_grounding_bus_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* --- 2.17 แผงจ่ายไฟประจำชั้น (Floor Panel) --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6 space-y-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.17 แผงจ่ายไฟประจำชั้น</h4>
            <CorrectiveRadio
              groupName="floor_panel_breaker_standard_correct"
              label="2.17.1 มาตรฐานเครื่องป้องกันกระแสเกิน"
              currentValue={formData.floor_panel_breaker_standard_correct}
              currentNote={formData.floor_panel_breaker_standard_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <div className="pl-4">
              <label htmlFor="floor_panel_breaker_at" className="block text-sm font-medium text-gray-700">พิกัดกระแสที่ตั้ง (AT):</label>
              <input type="text" id="floor_panel_breaker_at" name="floor_panel_breaker_at" value={formData.floor_panel_breaker_at} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <div className="pl-4">
              <label htmlFor="floor_panel_breaker_af" className="block text-sm font-medium text-gray-700">พิกัดเฟรม (AF):</label>
              <input type="text" id="floor_panel_breaker_af" name="floor_panel_breaker_af" value={formData.floor_panel_breaker_af} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <div className="pl-4">
              <label htmlFor="floor_panel_breaker_ic" className="block text-sm font-medium text-gray-700">พิกัดกระแสลัดวงจร (I.C.):</label>
              <input type="text" id="floor_panel_breaker_ic" name="floor_panel_breaker_ic" value={formData.floor_panel_breaker_ic} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <CorrectiveRadio
              groupName="floor_panel_breaker_size_correct"
              label="ขนาดพิกัดเหมาะสมกับสาย"
              currentValue={formData.floor_panel_breaker_size_correct}
              currentNote={formData.floor_panel_breaker_size_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="floor_panel_ground_bus_correct"
              label="บัสบาร์กราวด์ติดตั้งถูกต้อง"
              currentValue={formData.floor_panel_ground_bus_correct}
              currentNote={formData.floor_panel_ground_bus_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* --- 2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์ --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6 space-y-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์</h4>
            <div className="pl-4">
              <label htmlFor="meter_breaker_at" className="block text-sm font-medium text-gray-700">พิกัดกระแสที่ตั้ง (AT):</label>
              <input type="text" id="meter_breaker_at" name="meter_breaker_at" value={formData.meter_breaker_at} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <div className="pl-4">
              <label htmlFor="meter_breaker_af" className="block text-sm font-medium text-gray-700">พิกัดเฟรม (AF):</label>
              <input type="text" id="meter_breaker_af" name="meter_breaker_af" value={formData.meter_breaker_af} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <div className="pl-4">
              <label htmlFor="meter_breaker_ic" className="block text-sm font-medium text-gray-700">พิกัดกระแสลัดวงจร (I.C.):</label>
              <input type="text" id="meter_breaker_ic" name="meter_breaker_ic" value={formData.meter_breaker_ic} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <CorrectiveRadio
              groupName="meter_breaker_size_correct"
              label="ขนาดพิกัดเหมาะสมกับมิเตอร์"
              currentValue={formData.meter_breaker_size_correct}
              currentNote={formData.meter_breaker_size_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* --- 2.19 สายตัวนำประธานเข้าห้องชุด --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6 space-y-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.19 สายตัวนำประธานเข้าห้องชุด</h4>
            <CorrectiveRadio
              groupName="room_feeder_standard_correct"
              label="2.19.1 มาตรฐานสายตัวนำ"
              currentValue={formData.room_feeder_standard_correct}
              currentNote={formData.room_feeder_standard_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <div className="pl-4">
              <label htmlFor="room_feeder_type" className="block text-sm font-medium text-gray-700">ชนิดของสาย:</label>
              <input type="text" id="room_feeder_type" name="room_feeder_type" value={formData.room_feeder_type} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <div className="pl-4">
              <label htmlFor="room_feeder_size" className="block text-sm font-medium text-gray-700">ขนาดของสาย:</label>
              <input type="text" id="room_feeder_size" name="room_feeder_size" value={formData.room_feeder_size} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <div className="pl-4">
              <p className="block text-sm font-semibold text-gray-800 mb-2">2.19.4 วิธีเดินสาย:</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="room-wiring-conduit" 
                    name="room_feeder_wiring" 
                    value="ในท่อร้อยสาย" 
                    checked={Array.isArray(formData.room_feeder_wiring) && formData.room_feeder_wiring.includes('ในท่อร้อยสาย')} 
                    onChange={handleCheckboxChange} 
                    className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]" 
                  />
                  <label htmlFor="room-wiring-conduit" className="ml-2 block text-sm text-gray-900">ในท่อร้อยสาย</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="room-wiring-other" 
                    name="room_feeder_wiring" 
                    value="อื่นๆ" 
                    checked={Array.isArray(formData.room_feeder_wiring) && formData.room_feeder_wiring.includes('อื่นๆ')} 
                    onChange={handleCheckboxChange} 
                    className="h-4 w-4 text-[#5b2d90] border-gray-300 rounded focus:ring-[#5b2d90]" 
                  />
                  <label htmlFor="room-wiring-other" className="ml-2 block text-sm text-gray-900">อื่นๆ</label>
                </div>
              </div>
            </div>
          </div>

          {/* --- 2.20 แผงจ่ายไฟในห้องชุด --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6 space-y-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.20 แผงจ่ายไฟในห้องชุด</h4>
            <CorrectiveRadio
              groupName="room_panel_breaker_standard_correct"
              label="2.20.1 มาตรฐานเครื่องป้องกันกระแสเกิน"
              currentValue={formData.room_panel_breaker_standard_correct}
              currentNote={formData.room_panel_breaker_standard_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="room_panel_breaker_meter_match_correct"
              label="2.20.2 ขนาดพิกัดเหมาะสมกับมิเตอร์"
              currentValue={formData.room_panel_breaker_meter_match_correct}
              currentNote={formData.room_panel_breaker_meter_match_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <div className="pl-4">
              <label htmlFor="room_panel_breaker_at" className="block text-sm font-medium text-gray-700">พิกัดกระแสที่ตั้ง (AT):</label>
              <input type="text" id="room_panel_breaker_at" name="room_panel_breaker_at" value={formData.room_panel_breaker_at} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <div className="pl-4">
              <label htmlFor="room_panel_breaker_af" className="block text-sm font-medium text-gray-700">พิกัดเฟรม (AF):</label>
              <input type="text" id="room_panel_breaker_af" name="room_panel_breaker_af" value={formData.room_panel_breaker_af} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" />
            </div>
            <CorrectiveRadio
              groupName="room_panel_ic_rating_correct"
              label="2.20.5 พิกัดกระแสลัดวงจร (I.C.)"
              currentValue={formData.room_panel_ic_rating_correct}
              currentNote={formData.room_panel_ic_rating_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="room_panel_ground_bus_correct"
              label="2.20.6 บัสบาร์กราวด์ติดตั้งถูกต้อง"
              currentValue={formData.room_panel_ground_bus_correct}
              currentNote={formData.room_panel_ground_bus_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* --- 2.22 อื่นๆ --- */}
          <div className="pl-4 border-l-4 border-purple-300 mt-6 space-y-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.22 อื่นๆ</h4>
            <label htmlFor="lv_system_other_correct_note" className="block text-sm font-medium text-gray-700">บันทึกข้อความ</label>
            <textarea
              id="lv_system_other_correct_note"
              name="lv_system_other_correct_note"
              value={formData.lv_system_other_correct_note}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
            ></textarea>
          </div>
      </section>

      {/* --- 3. สรุปและลงนาม --- */}
      <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-5 text-[#5b2d90]">3. สรุปและลงนาม</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="summaryResult" className="block text-sm font-medium text-gray-900 mb-1">ผลการตรวจสอบสรุปโดยย่อ:</label>
            <textarea id="summaryResult" name="summaryresult" value={formData.summaryresult || ''} onChange={handleChange} rows="3" className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900"></textarea>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="scopeAndLimitations" className="block text-sm font-medium text-gray-900 mb-1">ขอบเขตและข้อจำกัด:</label>
            <textarea id="scopeAndLimitations" name="scopeofinspection" value={formData.scopeofinspection || ''} onChange={handleChange} rows="3" className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">ลายเซ็นผู้ขอใช้ไฟฟ้า:</label>
            <SignaturePad
              title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน"
              ref={userSigRef}
              onSave={(dataUrl) => handleSignatureSave('userSignature', dataUrl)}
              onClear={() => handleSignatureClear('userSignature')}
              initialValue={formData.userSignature}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">ลายเซ็นเจ้าหน้าที่ กฟภ.:</label>
            <SignaturePad
              title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค"
              ref={inspectorSigRef}
              onSave={(dataUrl) => handleSignatureSave('inspectorSignature', dataUrl)}
              onClear={() => handleSignatureClear('inspectorSignature')}
              initialValue={formData.inspectorsignature}
            />
          </div>
        </div>
      </section>

      {/* --- Action Buttons --- */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 mt-8 border-t border-gray-200">
        <PDFDownloadLink
          document={<CondoInspectionPDF formData={formData} />}
          fileName={`condo-inspection-form-${formData.inspectionnumber || 'form'}.pdf`}
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
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373  0 12h4z"></path>
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
      <CondoInspectionForm />
    </FormProvider>
  );
}

export default FormWrapper;