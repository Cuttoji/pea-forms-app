"use client";

import React, { useRef } from "react";
import { useFormManager } from "@/lib/hooks/useFormManager";
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import { PDFDownloadLink } from '@react-pdf/renderer';
import CondoInspectionPDF from '@/components/forms/CondoInspectionPDF';
import { Download, Save } from "lucide-react";

// --- ค่าเริ่มต้นของข้อมูลในฟอร์มสำหรับอาคารชุด ---
const initialFormData = {
  id: null,
  user_id: null,
  
  // ข้อมูลทั่วไป
  inspectionNumber: "",
  inspectionDate: "",
  requestNumber: "",
  requestDate: "",
  peaOffice: "",
  fullName: "",
  phone: "",
  address: "",
  voltageSystem: "", // '22kV' หรือ '33kV'
  estimatedLoad: "",
  hasDesignCertification: null,
  asBuiltDrawingCertified: false,
  engineerLicenseCopy: false,

  // 2.1 ระบบจำหน่ายเหนือดิน
  overhead_cableType: "",
  overhead_cableType_correct: '',
  overhead_cableType_note: "",
  overhead_cableSizeSqmm: "",
  overhead_cableSize_correct: '',
  overhead_cableSize_note: "",
  overhead_poleCondition_correct: '',
  overhead_poleCondition_note: "",
  overhead_poleTopEquipment_correct: '',
  overhead_poleTopEquipment_note: "",
  overhead_guyWireAssembly_correct: '',
  overhead_guyWireAssembly_note: "",
  overhead_insulatorType_correct: '',
  overhead_insulatorType_note: "",
  overhead_cableSagging_correct: '',
  overhead_cableSagging_note: "",
  overhead_clearance_correct: '',
  overhead_clearance_note: "",
  overhead_hvSurgeArrester_correct: '',
  overhead_hvSurgeArrester_note: "",
  overhead_cableJointCondition_correct: '',
  overhead_cableJointCondition_note: "",
  overhead_grounding_correct: '',
  overhead_grounding_note: "",

  // 2.2 ระบบจำหน่ายใต้ดิน
  underground_cableType: "",
  underground_cableType_correct: '',
  underground_cableType_note: "",
  underground_cableSizeSqmm: "",
  underground_cableSize_correct: '',
  underground_cableSize_note: "",
  underground_visibleCableCondition_correct: '',
  underground_visibleCableCondition_note: "",
  underground_cableTension_correct: '',
  underground_cableTension_note: "",
  underground_hvSurgeArrester_correct: '',
  underground_hvSurgeArrester_note: "",
  underground_cableJointCondition_correct: '',
  underground_cableJointCondition_note: "",
  underground_grounding_correct: '',
  underground_grounding_note: "",

  // 2.3 เครื่องปลดวงจรต้นทาง
  disconnectingDeviceStatus: '',
  disconnectingDeviceNote: "",
  disconnectingDeviceType: "",
  disconnectingDeviceSwitchType: "",
  hvDistributionOther: "",
  
  // หม้อแปลง (เก็บเป็น JSON)
  transformers: [],

  // 2.14 สายตัวนำประธานแรงต่ำ
  lvMainCable_standard_correct: '',
  lvMainCable_standard_note: '',
  lvMainCable_type: '',
  lvMainCable_other_type: '',
  lvMainCable_size: '',
  lvMainCable_type_size_correct: '',
  lvMainCable_type_size_note: '',
  lvMainCable_wiring_method: [],
  lvMainCable_wiring_correct: '',
  lvMainCable_wiring_note: '',

  // 2.15 เครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์
  mainBreaker_type: '',
  mainBreaker_standard: '',
  mainBreaker_product: '',
  mainBreaker_type_spec: '',
  mainBreaker_in: '',
  mainBreaker_ic: '',
  mainBreaker_voltage: '',
  mainBreaker_at: '',
  mainBreaker_af: '',
  mainBreaker_gfp_installed: false,
  mainBreaker_correct: '',
  mainBreaker_note: '',
  
  // 2.16 การต่อลงดินของแผงเมนสวิตช์
  mainGrounding_conductorSize_correct: '',
  mainGrounding_conductorSize_note: '',
  mainGrounding_conductorSize_sqmm: '',
  mainGrounding_resistance_correct: '',
  mainGrounding_resistance_note: '',
  mainGrounding_testPoint_correct: '',
  mainGrounding_testPoint_note: '',
  mainGrounding_bus_correct: '',
  mainGrounding_bus_note: '',

  // 2.17 แผงจ่ายไฟประจำชั้น
  floorPanel_breakerStandard_correct: '',
  floorPanel_breakerStandard_note: '',
  floorPanel_breakerSize_correct: '',
  floorPanel_breakerSize_note: '',
  floorPanel_breaker_at: '',
  floorPanel_breaker_af: '',
  floorPanel_breaker_ic: '',
  floorPanel_groundBus_correct: '',
  floorPanel_groundBus_note: '',
  
  // 2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์
  meterBreaker_size_correct: '',
  meterBreaker_size_note: '',
  meterBreaker_at: '',
  meterBreaker_af: '',

  // 2.19 สายตัวนำประธานเข้าห้องชุด
  roomFeeder_standard_correct: '',
  roomFeeder_standard_note: '',
  roomFeeder_type: '',
  roomFeeder_size: '',
  roomFeeder_wiring: [],

  // 2.20 แผงจ่ายไฟในห้องชุด
  roomPanel_breakerStandard_correct: '',
  roomPanel_breakerStandard_note: '',
  roomPanel_breakerMeterMatch_correct: '',
  roomPanel_breakerMeterMatch_note: '',
  roomPanel_breaker_at: '',
  roomPanel_breaker_af: '',
  roomPanel_icRating_correct: '',
  roomPanel_icRating_note: '',
  roomPanel_groundBus_correct: '',
  roomPanel_groundBus_note: '',

  // 2.22 อื่นๆ
  lvSystem_other_note: '',

  // สรุปและลงนาม
  summaryResult: "",
  scopeAndLimitations: "",
  applicantSignature: "",
  peaOfficerSignature: "",
};


// เพิ่มฟังก์ชันตรวจสอบไฟล์ภาพ (image extension) ก่อนอัปโหลด
function isValidImageFile(file) {
  if (!file) return false;
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const ext = file.name.split('.').pop().toLowerCase();
  return validExtensions.includes(ext);
}

export default function CondoInspectionForm() {
  const {
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleSignatureSave,
    handleSignatureClear
  } = useFormManager('condo_inspection_forms', initialFormData, 'condo');

  const userSigRef = useRef(null);
  const inspectorSigRef = useRef(null);

  const handleRadioChange = (groupName, value, noteFieldName) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: value,
      ...(value === 'ถูกต้อง' && { [noteFieldName]: '' }),
    }));
  };

  // เพิ่ม handleImageUpload ที่ตรวจสอบไฟล์ภาพก่อน
  const handleImageUpload = (file) => {
    if (!isValidImageFile(file)) {
      alert("กรุณาเลือกไฟล์รูปภาพที่มีนามสกุล jpg, jpeg, png, gif, bmp หรือ webp เท่านั้น");
      return;
    }
    // เรียกใช้ handleImageUpload เดิม (จาก useFormManager)
    if (typeof formData.address_photo_url !== "undefined") {
      setFormData(prev => ({ ...prev, address_photo_url: "" }));
    }
    // สมมติว่ามี handleImageUpload ใน useFormManager
    if (typeof handleImageUpload === "function") {
      handleImageUpload(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pea-primary"></div>
        <p className="ml-4 text-lg text-gray-600">กำลังโหลดข้อมูลฟอร์ม...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="pea-condo-inspection-form" className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
      <style jsx global>{`
        .sigCanvas { touch-action: none; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
      <h2 className="text-2xl font-bold mb-6 text-center text-[#5b2d90]">
        แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้า (สำหรับอาคารชุด)
      </h2>

      {/* --- Header Section --- */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="inspectionNumber" className="block text-sm font-medium text-gray-900 mb-1">เลขที่บันทึกตรวจสอบ:</label>
            <input type="text" id="inspectionNumber" name="inspectionNumber" value={formData.inspectionNumber} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-900 mb-1">วันที่ตรวจสอบ:</label>
            <input type="date" id="inspectionDate" name="inspectionDate" value={formData.inspectionDate} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900 bg-gray-100" />
          </div>
          <div>
            <label htmlFor="requestNumber" className="block text-sm font-medium text-gray-900 mb-1">เลขที่คำร้องขอใช้ไฟฟ้า:</label>
            <input type="text" id="requestNumber" name="requestNumber" value={formData.requestNumber} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="requestDate" className="block text-sm font-medium text-gray-900 mb-1">วันที่ยื่นคำร้อง:</label>
            <input type="date" id="requestDate" name="requestDate" value={formData.requestDate} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
          </div>
        </div>
      </section>

      {/* --- 1. General Information --- */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">1. ข้อมูลทั่วไป</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-1">ชื่อนิติบุคคล/ผู้ขอใช้ไฟฟ้า:</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">โทรศัพท์:</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-1">ที่อยู่:</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3" className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900"></textarea>
          </div>
          <div>
            <label htmlFor="voltageSystem" className="block text-sm font-medium text-gray-900 mb-1">ระบบแรงดันไฟฟ้า:</label>
            <select id="voltageSystem" name="voltageSystem" value={formData.voltageSystem} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900">
                <option value="">เลือกระบบแรงดัน</option>
                <option value="22kV">22 kV</option>
                <option value="33kV">33 kV</option>
            </select>
          </div>
          <div>
            <label htmlFor="estimatedLoad" className="block text-sm font-medium text-gray-900 mb-1">โหลดประมาณ (kVA):</label>
            <input type="number" step="any" id="estimatedLoad" name="estimatedLoad" value={formData.estimatedLoad} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
          </div>
        </div>
      </section>
      
      {/* --- 2. การตรวจสอบ --- */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">2. การตรวจสอบ</h2>
          
          <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
            <CorrectiveRadio
              groupName="overhead_cableType_correct"
              label="2.1.1 ชนิดสายตัวนำ"
              currentValue={formData.overhead_cableType_correct}
              currentNote={formData.overhead_cableType_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_cableSize_correct"
              label="2.1.2 ขนาดสายตัวนำ"
              currentValue={formData.overhead_cableSize_correct}
              currentNote={formData.overhead_cableSize_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_poleCondition_correct"
              label="2.1.3 สภาพเสาและระยะห่าง"
              currentValue={formData.overhead_poleCondition_correct}
              currentNote={formData.overhead_poleCondition_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_poleTopEquipment_correct"
              label="2.1.4 การประกอบอุปกรณ์หัวเสา"
              currentValue={formData.overhead_poleTopEquipment_correct}
              currentNote={formData.overhead_poleTopEquipment_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_guyWireAssembly_correct"
              label="2.1.5 การประกอบชุดยึดโยง"
              currentValue={formData.overhead_guyWireAssembly_correct}
              currentNote={formData.overhead_guyWireAssembly_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_insulatorType_correct"
              label="2.1.6 ลูกถ้วยและฉนวน"
              currentValue={formData.overhead_insulatorType_correct}
              currentNote={formData.overhead_insulatorType_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_cableSagging_correct"
              label="2.1.7 การพาดสาย"
              currentValue={formData.overhead_cableSagging_correct}
              currentNote={formData.overhead_cableSagging_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_clearance_correct"
              label="2.1.8 ระยะห่างของสาย"
              currentValue={formData.overhead_clearance_correct}
              currentNote={formData.overhead_clearance_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_hvSurgeArrester_correct"
              label="2.1.9 การติดตั้งกับดักเสิร์จ"
              currentValue={formData.overhead_hvSurgeArrester_correct}
              currentNote={formData.overhead_hvSurgeArrester_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_cableJointCondition_correct"
              label="2.1.10 สภาพของจุดต่อสาย"
              currentValue={formData.overhead_cableJointCondition_correct}
              currentNote={formData.overhead_cableJointCondition_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="overhead_grounding_correct"
              label="2.1.11 การต่อลงดิน"
              currentValue={formData.overhead_grounding_correct}
              currentNote={formData.overhead_grounding_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          <div className="pl-4 border-l-4 border-purple-300 mt-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-800">2.2 ระบบจำหน่ายใต้ดิน</h4>
              <div className="space-y-4">
                  <CorrectiveRadio
                    groupName="underground_cableType_correct"
                    label="2.2.1 ชนิดสายตัวนำ"
                    currentValue={formData.underground_cableType_correct}
                    currentNote={formData.underground_cableType_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                  <CorrectiveRadio
                    groupName="underground_cableSize_correct"
                    label="2.2.2 ขนาดสายตัวนำ"
                    currentValue={formData.underground_cableSize_correct}
                    currentNote={formData.underground_cableSize_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                  <CorrectiveRadio
                    groupName="underground_visibleCableCondition_correct"
                    label="2.2.3 สภาพสายส่วนที่มองเห็นได้"
                    currentValue={formData.underground_visibleCableCondition_correct}
                    currentNote={formData.underground_visibleCableCondition_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                  <CorrectiveRadio
                    groupName="underground_cableTension_correct"
                    label="2.2.4 ความตึงของสาย"
                    currentValue={formData.underground_cableTension_correct}
                    currentNote={formData.underground_cableTension_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                  <CorrectiveRadio
                    groupName="underground_hvSurgeArrester_correct"
                    label="2.2.5 การติดตั้งกับดักเสิร์จ"
                    currentValue={formData.underground_hvSurgeArrester_correct}
                    currentNote={formData.underground_hvSurgeArrester_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                  <CorrectiveRadio
                    groupName="underground_cableJointCondition_correct"
                    label="2.2.6 สภาพของจุดต่อสาย"
                    currentValue={formData.underground_cableJointCondition_correct}
                    currentNote={formData.underground_cableJointCondition_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                  <CorrectiveRadio
                    groupName="underground_grounding_correct"
                    label="2.2.7 การต่อลงดิน"
                    currentValue={formData.underground_grounding_correct}
                    currentNote={formData.underground_grounding_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
              </div>
          </div>

          <div className="pl-4 border-l-4 border-purple-300 mt-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-800">2.3 การติดตั้งเครื่องปลดวงจรต้นทาง</h4>
              <div className="space-y-3">
                <label className="flex items-center"><input type="radio" name="disconnectingDeviceType" value="dropout-fuse-cutout" checked={formData.disconnectingDeviceType === 'dropout-fuse-cutout'} onChange={handleChange} className="form-radio h-5 w-5 text-purple-600"/><span className="ml-2 text-sm text-gray-700">ดรอพเอาท์ฟิวส์คัตเอาท์</span></label>
                <label className="flex items-center"><input type="radio" name="disconnectingDeviceType" value="switch-disconnect" checked={formData.disconnectingDeviceType === 'switch-disconnect'} onChange={handleChange} className="form-radio h-5 w-5 text-purple-600"/><span className="ml-2 text-sm text-gray-700">สวิตช์ตัดตอน ชนิด:</span>{formData.disconnectingDeviceType === 'switch-disconnect' && (<input type="text" name="disconnectingDeviceSwitchType" value={formData.disconnectingDeviceSwitchType} onChange={handleChange} className="ml-2 p-1 border rounded-md text-sm w-40 border-gray-300 text-gray-700"/>)}</label>
                <label className="flex items-center"><input type="radio" name="disconnectingDeviceType" value="rmu" checked={formData.disconnectingDeviceType === 'rmu'} onChange={handleChange} className="form-radio h-5 w-5 text-purple-600"/><span className="ml-2 text-sm text-gray-700">RMU (ไม่รวมฟังก์ชั่น)</span></label>
              </div>
              <CorrectiveRadio groupName="disconnectingDeviceStatus" label="" currentValue={formData.disconnectingDeviceStatus} currentNote={formData.disconnectingDeviceNote} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <div className="mt-2"><label htmlFor="hvDistributionOther" className="text-sm font-medium">อื่นๆ:</label><input type="text" id="hvDistributionOther" name="hvDistributionOther" value={formData.hvDistributionOther} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md text-sm"/></div>
          </div>

          <div className="mt-6"><h3 className="text-xl font-semibold mb-3 text-[#3a1a5b] mt-6">หม้อแปลง</h3></div>

          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b] mt-6">ระบบจำหน่ายแรงต่ำ</h3>
          <div className="pl-4 border-l-4 border-purple-300 space-y-6">
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.14 สายตัวนำประธานแรงต่ำ</h4><CorrectiveRadio groupName="lvMainCable_standard_correct" label="2.14.1 สายไฟฟ้าเป็นไปตามมาตรฐาน" currentValue={formData.lvMainCable_standard_correct} currentNote={formData.lvMainCable_standard_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/><CorrectiveRadio groupName="lvMainCable_type_size_correct" label="2.14.2 ชนิดและขนาดของสายไฟฟ้า" currentValue={formData.lvMainCable_type_size_correct} currentNote={formData.lvMainCable_type_size_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/><CorrectiveRadio groupName="lvMainCable_wiring_correct" label="2.14.3 วิธีการเดินสาย" currentValue={formData.lvMainCable_wiring_correct} currentNote={formData.lvMainCable_wiring_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/></div>
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกิน</h4><CorrectiveRadio groupName="mainBreaker_correct" label="ผลการตรวจสอบ" currentValue={formData.mainBreaker_correct} currentNote={formData.mainBreaker_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/></div>
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.16 การต่อลงดินของแผงเมนสวิตช์</h4><CorrectiveRadio groupName="mainGrounding_conductorSize_correct" label="2.16.1 ขนาดสายต่อหลักดิน" currentValue={formData.mainGrounding_conductorSize_correct} currentNote={formData.mainGrounding_conductorSize_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/><CorrectiveRadio groupName="mainGrounding_resistance_correct" label="2.16.2 ค่าความต้านทาน" currentValue={formData.mainGrounding_resistance_correct} currentNote={formData.mainGrounding_resistance_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/><CorrectiveRadio groupName="mainGrounding_testPoint_correct" label="2.16.3 จุดทดสอบ" currentValue={formData.mainGrounding_testPoint_correct} currentNote={formData.mainGrounding_testPoint_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/><CorrectiveRadio groupName="mainGrounding_bus_correct" label="2.16.4 การติดตั้งขั้วต่อ" currentValue={formData.mainGrounding_bus_correct} currentNote={formData.mainGrounding_bus_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/></div>
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.17 แผงจ่ายไฟประจำชั้น</h4><CorrectiveRadio groupName="floorPanel_breakerStandard_correct" label="2.17.1 มาตรฐานเบรกเกอร์" currentValue={formData.floorPanel_breakerStandard_correct} currentNote={formData.floorPanel_breakerStandard_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/><CorrectiveRadio groupName="floorPanel_breakerSize_correct" label="2.17.2 ขนาดเบรกเกอร์" currentValue={formData.floorPanel_breakerSize_correct} currentNote={formData.floorPanel_breakerSize_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/><CorrectiveRadio groupName="floorPanel_groundBus_correct" label="2.17.3 ขั้วต่อสายดิน" currentValue={formData.floorPanel_groundBus_correct} currentNote={formData.floorPanel_groundBus_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/></div>
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.18 เบรกเกอร์ด้านไฟเข้ามิเตอร์</h4><CorrectiveRadio groupName="meterBreaker_size_correct" label="ขนาดสอดคล้องกับมิเตอร์" currentValue={formData.meterBreaker_size_correct} currentNote={formData.meterBreaker_size_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/></div>
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.19 สายตัวนำประธานเข้าห้องชุด</h4><CorrectiveRadio groupName="roomFeeder_standard_correct" label="ผลการตรวจสอบ" currentValue={formData.roomFeeder_standard_correct} currentNote={formData.roomFeeder_standard_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/></div>
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.20 แผงจ่ายไฟในห้องชุด</h4><CorrectiveRadio groupName="roomPanel_breakerStandard_correct" label="2.20.1 มาตรฐานเบรกเกอร์" currentValue={formData.roomPanel_breakerStandard_correct} currentNote={formData.roomPanel_breakerStandard_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/><CorrectiveRadio groupName="roomPanel_breakerMeterMatch_correct" label="2.20.2 ขนาดเบรกเกอร์" currentValue={formData.roomPanel_breakerMeterMatch_correct} currentNote={formData.roomPanel_breakerMeterMatch_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/><CorrectiveRadio groupName="roomPanel_icRating_correct" label="2.20.3 พิกัด IC" currentValue={formData.roomPanel_icRating_correct} currentNote={formData.roomPanel_icRating_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/></div>
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.21 ขั้วต่อสายดินในห้องชุด</h4><CorrectiveRadio groupName="roomPanel_groundBus_correct" label="สำหรับต่ออุปกรณ์" currentValue={formData.roomPanel_groundBus_correct} currentNote={formData.roomPanel_groundBus_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/></div>
              <div className="mt-4"><label htmlFor="lvSystem_other_note" className="text-lg font-semibold text-gray-800">2.22 อื่นๆ</label><textarea id="lvSystem_other_note" name="lvSystem_other_note" value={formData.lvSystem_other_note} onChange={handleChange} rows="3" className="mt-1 block w-full p-2 border rounded-md text-sm border-gray-300 text-gray-700"></textarea></div>
          </div>
      </section>

      {/* --- สรุปและลงนาม --- */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">สรุปผลและลงนาม</h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <label className="inline-flex items-center text-gray-900"><input type="radio" name="summaryResult" value="ติดตั้งมิเตอร์ถาวร" checked={formData.summaryResult === 'ติดตั้งมิเตอร์ถาวร'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">ติดตั้งมิเตอร์ถาวร</span></label>
          <label className="inline-flex items-center text-gray-900"><input type="radio" name="summaryResult" value="ติดตั้งมิเตอร์ชั่วคราว" checked={formData.summaryResult === 'ติดตั้งมิเตอร์ชั่วคราว'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">ติดตั้งมิเตอร์ชั่วคราว</span></label>
          <label className="inline-flex items-center text-gray-900"><input type="radio" name="summaryResult" value="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" checked={formData.summaryResult === 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์</span></label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SignaturePad 
            title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" 
            ref={userSigRef}
            onSave={(dataUrl) => handleSignatureSave('applicantSignature', dataUrl)} 
            onClear={() => handleSignatureClear('applicantSignature')}
            initialValue={formData.applicantSignature}
          />
          <SignaturePad 
            title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" 
            ref={inspectorSigRef} 
            onSave={(dataUrl) => handleSignatureSave('peaOfficerSignature', dataUrl)} 
            onClear={() => handleSignatureClear('peaOfficerSignature')}
            initialValue={formData.peaOfficerSignature}
          />
        </div>
      </section>
      
      {/* --- Action Buttons --- */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 mt-8 border-t border-gray-200">
        <PDFDownloadLink
          document={<CondoInspectionPDF formData={formData} />}
          fileName={`condo-inspection-form-${formData.inspectionNumber || 'form'}.pdf`}
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
  );
}