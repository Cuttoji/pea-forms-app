"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InspectionPDF from '@/components/forms/InspectionPDF';
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';
import { useFormManager } from "@/lib/hooks/useFormManager"; 
import { toast } from "react-hot-toast";
import CondoInspectionPDF from "@/components/forms/CondoInspectionPDF";


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
  disconnectingDeviceType: [],
  disconnectingDeviceSwitchType: "",
  hvDistributionOther: "",
  
  // หม้อแปลง (เก็บเป็น JSON Array of Objects)
  transformers: [
    // {
    //   tested: null, // true, false
    //   number: "",
    //   size_kva: "",
    //   hv_voltage: "",
    //   lv_voltage: "",
    //   impedance: "",
    //   type: "", // 'Oil', 'Dry', 'Other'
    //   type_other: "",
    //   vector_group: "",
    //   short_circuit_rating_correct: '',
    //   short_circuit_rating_note: '',
    //   installation_type: [],
    //   overcurrent_protection_type: "",
    //   overcurrent_protection_correct: '',
    //   overcurrent_protection_note: '',
    //   continuous_current_a: '',
    //   interrupting_capacity_ic: '',
    //   hv_surge_arrester_correct: '',
    //   hv_surge_arrester_note: '',
    //   surge_arrester_kv: '',
    //   surge_arrester_ka: '',
    //   grounding_assembly_correct: '',
    //   grounding_assembly_note: '',
    //   hv_ground_resistance_ohm: '',
    //   hv_ground_resistance_correct: '',
    //   hv_ground_resistance_note: '',
    //   silica_gel_correct: '',
    //   silica_gel_note: '',
    //   bushing_condition_correct: '',
    //   bushing_condition_note: '',
    //   oil_level_correct: '',
    //   oil_level_note: '',
    //   oil_leak_correct: '',
    //   oil_leak_note: '',
    //   warning_sign_correct: '',
    //   warning_sign_note: '',
    //   transformer_other_note: ''
    // }
  ],

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
  meterBreaker_ic: '', // **[เพิ่ม]** เพิ่มฟิลด์สำหรับ IC kA

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
  // ฟังก์ชันสำหรับจัดการ Checkbox ที่เลือกได้หลายข้อ
  const handleWiringMethodChange = (e) => {
    const { value, checked } = e.target;
    // ดึงข้อมูล array ปัจจุบันจาก state, ถ้ายังไม่มีให้ใช้ array ว่าง
    const currentMethods = formData.lvMainCable_wiring_method || [];

    let newMethods;
    if (checked) {
      // ถ้าถูกติ๊ก, ให้เพิ่มค่าใหม่เข้าไปใน array
      newMethods = [...currentMethods, value];
    } else {
      // ถ้าติ๊กออก, ให้กรองค่าที่ตรงกันออกจาก array
      newMethods = currentMethods.filter((method) => method !== value);
    }
    // อัปเดต state ด้วย array ใหม่
    setFormData(prev => ({ ...prev, lvMainCable_wiring_method: newMethods }));
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
  // ฟังก์ชันสำหรับจัดการ Checkbox (เลือกได้หลายข้อ) ของ "เครื่องปลดวงจร"
  const handleDeviceTypeChange = (e) => {
    const { value, checked } = e.target;
    const currentTypes = formData.disconnectingDeviceType || [];

    let newTypes;
    if (checked) {
      newTypes = [...currentTypes, value];
    } else {
      newTypes = currentTypes.filter((type) => type !== value);
    }
    setFormData(prev => ({ ...prev, disconnectingDeviceType: newTypes }));
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
            <label className="block text-lg font-semibold mb-3 text-gray-800">2.1 ระบบจำหน่ายเหนือดิน</label>
            {/* 2.1.1 ชนิดสายตัวนำ */}
            <div className="mb-4">
              <label htmlFor="overhead_cableType" className="block text-sm font-semibold text-gray-800 mb-2">2.1.1 ชนิดสายตัวนำ:</label>
              <input
                type="text"
                id="overhead_cableType"
                name="overhead_cableType"
                value={formData.overhead_cableType}
                onChange={handleChange}
                className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
              />
              <CorrectiveRadio
                groupName="overhead_cableType_correct"
                label=""
                currentValue={formData.overhead_cableType_correct}
                currentNote={formData.overhead_cableType_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
            {/* 2.1.2 ขนาดสายตัวนำ */}
            <div className="mb-4">
              <label htmlFor="overhead_cableSizeSqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.1.2 ขนาดสายตัวนำ (ตร.มม.):</label>
              <input
                type="number"
                step="any"
                id="overhead_cableSizeSqmm"
                name="overhead_cableSizeSqmm"
                value={formData.overhead_cableSizeSqmm}
                onChange={handleChange}
                className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
              />
              <CorrectiveRadio
                groupName="overhead_cableSize_correct"
                label=""
                currentValue={formData.overhead_cableSize_correct}
                currentNote={formData.overhead_cableSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
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
                  <label htmlFor="underground_cableType" className="block text-sm font-semibold text-gray-800 mb-2">2.2.1 ชนิดสายตัวนำ:</label>
                  <input
                    type="text"
                    id="underground_cableType"
                    name="underground_cableType"
                    value={formData.underground_cableType}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
                  />
                  <CorrectiveRadio
                    groupName="underground_cableType_correct"
                    currentValue={formData.underground_cableType_correct}
                    currentNote={formData.underground_cableType_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                  <label htmlFor="underground_cableSizeSqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.2.2 ขนาดสายตัวนำ (ตร.มม.):</label>
                  <input
                    type="text"
                    id="underground_cableSizeSqmm"
                    name="underground_cableSizeSqmm"
                    value={formData.underground_cableSizeSqmm}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
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

{/* --- 2.3 การติดตั้งเครื่องปลดวงจรต้นทาง --- */}
<div className="pl-4 border-l-4 border-purple-300 mt-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.3 การติดตั้งเครื่องปลดวงจรต้นทาง</h4>
    <div className="space-y-3">
        
        {/* สร้าง Checkbox สำหรับแต่ละตัวเลือก */}
        {[
            'ดรอพเอาท์ฟิวส์คัตเอาท์',
            'สวิตช์ตัดตอน',
            'RMU (ไม่รวมฟังก์ชั่น)'
        ].map((device) => (
            <label key={device} className="flex items-center">
                <input
                    type="checkbox"
                    name="disconnectingDeviceType"
                    value={device}
                    // ตรวจสอบว่าค่านี้มีอยู่ใน array หรือไม่
                    checked={formData.disconnectingDeviceType.includes(device)}
                    // เรียกใช้ handler ใหม่
                    onChange={handleDeviceTypeChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{device}</span>

                {/* แสดงช่อง input ถ้าเป็น 'สวิตช์ตัดตอน' และถูกเลือก */}
                {device === 'สวิตช์ตัดตอน' && formData.disconnectingDeviceType.includes('สวิตช์ตัดตอน') && (
                     <div className="flex items-center ml-2">
                        <span className="text-sm mr-2">ชนิด:</span>
                        <input
                            type="text"
                            name="disconnectingDeviceSwitchType"
                            value={formData.disconnectingDeviceSwitchType}
                            onChange={handleChange} // ใช้ handleChange ปกติ
                            className="p-1 border rounded-md text-sm w-40 border-gray-300"
                        />
                    </div>
                )}
            </label>
        ))}

    </div>
    
    {/* ผลการตรวจสอบและอื่นๆ */}
    <CorrectiveRadio 
        groupName="disconnectingDeviceStatus" 
        label="" 
        currentValue={formData.disconnectingDeviceStatus} 
        currentNote={formData.disconnectingDeviceNote} 
        onStatusChange={handleRadioChange} 
        onNoteChange={handleChange}
    />
    <div className="mt-2">
        <label htmlFor="hvDistributionOther" className="text-sm font-medium">อื่นๆ:</label>
        <input 
            type="text" 
            id="hvDistributionOther" 
            name="hvDistributionOther" 
            value={formData.hvDistributionOther} 
            onChange={handleChange} 
            className="mt-1 block w-full p-2 border rounded-md text-sm"
        />
    </div>
</div>

          <div className="mt-6"><h3 className="text-xl font-semibold mb-3 text-[#3a1a5b] mt-6">หม้อแปลง</h3></div>

          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b] mt-6">ระบบจำหน่ายแรงต่ำ</h3>
          <div className="pl-4 border-l-4 border-purple-300 space-y-6">
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.14 สายตัวนำประธานแรงต่ำ</h4>
              <CorrectiveRadio groupName="lvMainCable_standard_correct" 
                label="2.14.1 สายไฟฟ้าเป็นไปตามมาตรฐานมอก.11-2553, มอก. 293-2541 หรือ IEC 60502" 
                currentValue={formData.lvMainCable_standard_correct} 
                currentNote={formData.lvMainCable_standard_note} 
                onStatusChange={handleRadioChange} onNoteChange={handleChange}
              />
              {/* 2.14.2 ชนิดและขนาดของสายไฟฟ้า */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">2.14.2 ชนิดและขนาดของสายไฟฟ้า</label>
                
                {/* ส่วนของ "ชนิด" */}
                <div className="mt-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชนิด:</label>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <label className="inline-flex items-center text-gray-700">
                            <input
                                type="radio"
                                name="lvMainCable_type"
                                value="IEC 01"
                                checked={formData.lvMainCable_type === 'IEC 01'}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-gray-800"
                            />
                            <span className="ml-2 text-sm">IEC 01</span>
                        </label>
                        <label className="inline-flex items-center text-gray-700">
                            <input
                                type="radio"
                                name="lvMainCable_type"
                                value="NYY"
                                checked={formData.lvMainCable_type === 'NYY'}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-gray-800"
                            />
                            <span className="ml-2 text-sm">NYY</span>
                        </label>
                        <label className="inline-flex items-center text-gray-700">
                            <input
                                type="radio"
                                name="lvMainCable_type"
                                value="CV"
                                checked={formData.lvMainCable_type === 'CV'}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-gray-800"
                            />
                            <span className="ml-2 text-sm">CV</span>
                        </label>
                        <label className="inline-flex items-center text-gray-700">
                            <input
                                type="radio"
                                name="lvMainCable_type"
                                value="อื่นๆ"
                                checked={formData.lvMainCable_type === 'อื่นๆ'}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-gray-800"
                            />
                             <span className="ml-2 text-sm">อื่นๆ:</span>
                            {formData.lvMainCable_type === 'อื่นๆ' && (
                                <input
                                    type="text"
                                    name="lvMainCable_other_type"
                                    value={formData.lvMainCable_other_type}
                                    onChange={handleChange}
                                    className="ml-2 p-1 border rounded-md text-sm w-32 border-gray-300"
                                    placeholder="ระบุชนิด"
                                />
                            )}
                        </label>
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="lvMainCable_size" 
                    className="block text-sm font-medium text-gray-700 mb-2">ขนาด (ตร.มม.):</label>
                    <input
                        type="number"
                        step="any"
                        id="lvMainCable_size"
                        name="lvMainCable_size"
                        value={formData.lvMainCable_size}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
                        placeholder="ระบุขนาดสาย"
                    />
                </div>

                <CorrectiveRadio
                    groupName="lvMainCable_type_size_correct"
                    label=""
                    currentValue={formData.lvMainCable_type_size_correct}
                    currentNote={formData.lvMainCable_type_size_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                />;
              </div>
              {/* 2.14.3 วิธีการเดินสายไฟฟ้า */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">2.14.3 วิธีการเดินสายไฟฟ้า:</label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                      
                      {/* สร้าง Checkbox สำหรับแต่ละตัวเลือกโดยอัตโนมัติ */}
                      {[
                          'บนลูกถ้วยฉนวนในอากาศ', 
                          'ท่อร้อยสาย (Conduit)', 
                          'รางเดินสาย (Wire Way)', 
                          'รางเคเบิล (Cable Tray)', 
                          'บัสเวย์ (Bus Way)', 
                          'เดินฝังใต้ดิน'
                      ].map((method) => (
                          <label key={method} className="inline-flex items-center">
                              <input
                                  type="checkbox"
                                  name="lvMainCable_wiring_method"
                                  value={method}
                                  checked={formData.lvMainCable_wiring_method.includes(method)}
                                  onChange={handleWiringMethodChange}
                                  className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{method}</span>
                          </label>
                      ))}

                      {/* ตัวเลือก "อื่นๆ" */}
                      <label className="inline-flex items-center">
                          <input
                              type="checkbox"
                              name="lvMainCable_wiring_method"
                              value="อื่นๆ"
                              checked={formData.lvMainCable_wiring_method.includes('อื่นๆ')}
                              onChange={handleWiringMethodChange}
                              className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">อื่นๆ:</span>
                      </label>
                  </div>

                  {/* ช่องใส่ข้อความสำหรับ "อื่นๆ" จะแสดงเมื่อถูกเลือก */}
                  {formData.lvMainCable_wiring_method.includes('อื่นๆ') && (
                      <div className="mt-3">
                          <input
                              type="text"
                              name="lvMainCable_wiring_note" // ใช้ฟิลด์ note สำหรับเก็บค่า
                              value={formData.lvMainCable_wiring_note || ''}
                              onChange={handleChange} // ใช้ handleChange ปกติจาก useFormManager
                              className="mt-1 block w-full p-2 border rounded-md text-sm border-gray-300 shadow-sm"
                              placeholder="โปรดระบุวิธีการเดินสายอื่นๆ"
                          />
                      </div>
                  )}

                  {/* ผลการตรวจสอบ */}
                  <CorrectiveRadio
                      groupName="lvMainCable_wiring_correct"
                      label=""
                      currentValue={formData.lvMainCable_wiring_correct}
                      currentNote={formData.lvMainCable_wiring_note} // หมายเหตุจะใช้ร่วมกับช่องอื่นๆ
                      onStatusChange={handleRadioChange}
                      onNoteChange={handleChange}
                  />
              </div>
             {/* --- 2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร --- */}
<div className="border-b border-gray-200 pb-4 mb-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร</h4>

    <div className="space-y-3 mb-4">
        {/* --- ตัวเลือกชนิด --- */}
        <label className="block text-sm font-medium text-gray-700 mb-2">ชนิด:</label>
        <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="mainBreaker_type"
                    value="เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2"
                    checked={formData.mainBreaker_type === "เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2</span>
            </label>
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="mainBreaker_type"
                    value="สวิตช์พร้อมฟิวส์"
                    checked={formData.mainBreaker_type === "สวิตช์พร้อมฟิวส์"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">สวิตช์พร้อมฟิวส์</span>
            </label>
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="mainBreaker_type"
                    value="อื่นๆ"
                    checked={formData.mainBreaker_type === "อื่นๆ"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">อื่นๆ:</span>
                {formData.mainBreaker_type === "อื่นๆ" && (
                    <input
                        type="text"
                        name="mainBreaker_standard" // ใช้ฟิลด์ standard เก็บค่า "อื่นๆ"
                        value={formData.mainBreaker_standard || ''}
                        onChange={handleChange}
                        className="ml-2 p-1 border rounded-md text-sm w-40 border-gray-300"
                        placeholder="ระบุมาตรฐานอื่นๆ"
                    />
                )}
            </label>
        </div>
    </div>

    {/* --- Input fields for details --- */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div>
            <label htmlFor="mainBreaker_in" className="block text-xs font-medium text-gray-600">In (A):</label>
            <input type="number" name="mainBreaker_in" value={formData.mainBreaker_in} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-700"/>
        </div>
        <div>
            <label htmlFor="mainBreaker_ic" className="block text-xs font-medium text-gray-600">IC (kA):</label>
            <input type="number" name="mainBreaker_ic" value={formData.mainBreaker_ic} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-700"/>
        </div>
        <div>
            <label htmlFor="mainBreaker_voltage" className="block text-xs font-medium text-gray-600">แรงดัน (V):</label>
            <input type="number" name="mainBreaker_voltage" value={formData.mainBreaker_voltage} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-600"/>
        </div>
        <div>
            <label htmlFor="mainBreaker_at" className="block text-xs font-medium text-gray-600">AT (A):</label>
            <input type="number" name="mainBreaker_at" value={formData.mainBreaker_at} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-700"/>
        </div>
        <div>
            <label htmlFor="mainBreaker_af" className="block text-xs font-medium text-gray-600">AF (A):</label>
            <input type="number" name="mainBreaker_af" value={formData.mainBreaker_af} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-700"/>
        </div>
    </div>
    {/* --- ผลการตรวจสอบ --- */}
    <CorrectiveRadio
        groupName="mainBreaker_correct"
        label="ผลการตรวจสอบ:"
        currentValue={formData.mainBreaker_correct}
        currentNote={formData.mainBreaker_note}
        onStatusChange={handleRadioChange}
        onNoteChange={handleChange}
    />
</div>

              {/* --- 2.16 การต่อลงดินของแผงเมนสวิตช์ของอาคาร --- */}
<div className="border-b border-gray-200 pb-4 mb-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.16 การต่อลงดินของแผงเมนสวิตช์ของอาคาร</h4>
    <div className="space-y-4">
        
        {/* 2.16.1 ขนาดสายต่อหลักดิน */}
        <div className="border-b border-gray-200 pb-4">
            <label htmlFor="mainGrounding_conductorSize_sqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.16.1 ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน</label>
            <div className="mt-1">
                 <label htmlFor="mainGrounding_conductorSize_sqmm" className="block text-sm font-medium text-gray-700 mb-2">ขนาดสายต่อหลักดิน (ตร.มม.):</label>
                <input
                    type="number"
                    step="any"
                    id="mainGrounding_conductorSize_sqmm"
                    name="mainGrounding_conductorSize_sqmm"
                    value={formData.mainGrounding_conductorSize_sqmm}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
                    placeholder="ระบุขนาด"
                />
            </div>
            <CorrectiveRadio
                groupName="mainGrounding_conductorSize_correct"
                label=""
                currentValue={formData.mainGrounding_conductorSize_correct}
                currentNote={formData.mainGrounding_conductorSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
            />
        </div>

        {/* 2.16.2 ค่าความต้านทาน */}
        <CorrectiveRadio
            groupName="mainGrounding_resistance_correct"
            label="2.16.2 ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม (มีข้อยกเว้น)"
            currentValue={formData.mainGrounding_resistance_correct}
            currentNote={formData.mainGrounding_resistance_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />

        {/* 2.16.3 จุดทดสอบ */}
        <CorrectiveRadio
            groupName="mainGrounding_testPoint_correct"
            label="2.16.3 ต้องทำจุดทดสอบ สำหรับใช้วัดค่าความต้านทานการต่อลงดิน"
            currentValue={formData.mainGrounding_testPoint_correct}
            currentNote={formData.mainGrounding_testPoint_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />

        {/* 2.16.4 ขั้วต่อสายดิน */}
        <CorrectiveRadio
            groupName="mainGrounding_bus_correct"
            label="2.16.4 แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) ตามที่ กฟภ. กำหนด"
            currentValue={formData.mainGrounding_bus_correct}
            currentNote={formData.mainGrounding_bus_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />
    </div>
</div>
              {/* --- 2.17 แผงจ่ายไฟประจำชั้น (Floor Panel) --- */}
<div className="border-b border-gray-200 pb-4 mb-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.17 แผงจ่ายไฟประจำชั้น (Floor Panel)</h4>
    <div className="space-y-4">

        {/* 2.17.1 มาตรฐานเซอร์กิตเบรกเกอร์ */}
        <CorrectiveRadio
            groupName="floorPanel_breakerStandard_correct"
            label="2.17.1 เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ มอก. 909-2548"
            currentValue={formData.floorPanel_breakerStandard_correct}
            currentNote={formData.floorPanel_breakerStandard_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />

        {/* 2.17.2 ขนาดเซอร์กิตเบรกเกอร์ */}
        <div className="border-b border-gray-200 pb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2">2.17.2 ขนาดเซอร์กิตเบรกเกอร์สอดคล้องกับขนาดสายป้อน</label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                <div>
                    <label htmlFor="floorPanel_breaker_at" className="block text-xs font-medium text-gray-600">AT (A):</label>
                    <input type="number" name="floorPanel_breaker_at" value={formData.floorPanel_breaker_at} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-gray-600 border-gray-600"/>
                </div>
                <div>
                    <label htmlFor="floorPanel_breaker_af" className="block text-xs font-medium text-gray-600">AF (A):</label>
                    <input type="number" name="floorPanel_breaker_af" value={formData.floorPanel_breaker_af} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-gray-600 border-gray-600"/>
                </div>
                <div>
                    <label htmlFor="floorPanel_breaker_ic" className="block text-xs font-medium text-gray-600">IC (kA):</label>
                    <input type="number" name="floorPanel_breaker_ic" value={formData.floorPanel_breaker_ic} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-gray-600 border-gray-600"/>
                </div>
            </div>

            <CorrectiveRadio
                groupName="floorPanel_breakerSize_correct"
                label=""
                currentValue={formData.floorPanel_breakerSize_correct}
                currentNote={formData.floorPanel_breakerSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
            />
        </div>

        {/* 2.17.3 ขั้วต่อสายดิน */}
        <CorrectiveRadio
            groupName="floorPanel_groundBus_correct"
            label="2.17.3 แผงจ่ายไฟประจำชั้นต้องมีขั้วต่อสายดิน (Ground Bus) แยกจากขั้วต่อสายนิวทรัล (Neutral Bus)"
            currentValue={formData.floorPanel_groundBus_correct}
            currentNote={formData.floorPanel_groundBus_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />
    </div>
</div>
             {/* --- 2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์ --- */}
<div className="border-b border-gray-200 pb-4 mb-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์</h4>
    <div className="border-b border-gray-200 pb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-2">มีขนาดสอดคล้องกับขนาดมิเตอร์</label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            <div>
                <label htmlFor="meterBreaker_at" className="block text-xs font-medium text-gray-600">AT (A):</label>
                <input type="number" 
                name="meterBreaker_at" 
                value={formData.meterBreaker_at} 
                onChange={handleChange} 
                className="mt-1 w-full p-2 border rounded-md text-gray-600"/>
            </div>
            <div>
                <label htmlFor="meterBreaker_af" className="block text-xs font-medium text-gray-600">AF (A):</label>
                <input type="number" name="meterBreaker_af" 
                value={formData.meterBreaker_af} onChange={handleChange} 
                className="mt-1 w-full p-2 border rounded-md text-gray-600"/>
            </div>
        </div>

        <CorrectiveRadio
            groupName="meterBreaker_size_correct"
            label=""
            currentValue={formData.meterBreaker_size_correct}
            currentNote={formData.meterBreaker_size_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />
    </div>
</div>

{/* --- 2.19 สายตัวนำประธานเข้าห้องชุด --- */}
<div className="border-b border-gray-200 pb-4 mb-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.19 สายตัวนำประธานเข้าห้องชุด</h4>
    <CorrectiveRadio
        groupName="roomFeeder_standard_correct"
        label="สายไฟฟ้าเป็นไปตามมาตรฐาน มอก.11-2553 หรือ IEC 60502"
        currentValue={formData.roomFeeder_standard_correct}
        currentNote={formData.roomFeeder_standard_note}
        onStatusChange={handleRadioChange}
        onNoteChange={handleChange}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
        <div>
            <label htmlFor="roomFeeder_type" className="block text-xs font-medium text-gray-600">ชนิด:</label>
            <input type="text" 
            name="roomFeeder_type" 
            value={formData.roomFeeder_type} 
            onChange={handleChange} 
            className="mt-1 w-full p-2 border rounded-md border-gray-600 text-gray-600"/>
        </div>
        <div>
            <label htmlFor="roomFeeder_size" className="block text-xs font-medium text-gray-600">ขนาด (ตร.มม.):</label>
            <input type="number" 
            name="roomFeeder_size" 
            value={formData.roomFeeder_size} 
            onChange={handleChange} 
            className="mt-1 w-full p-2 border rounded-md border-gray-600 text-gray-600"/>
        </div>
    </div>
    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
        <label className="inline-flex items-center">
            <input type="checkbox" name="roomFeeder_wiring" 
            value="ท่อร้อยสาย" checked={formData.roomFeeder_wiring.includes('ท่อร้อยสาย')} 
            onChange={handleWiringMethodChange} className="form-checkbox h-5 w-5"/>
            <span className="ml-2 text-sm text-gray-700">เดินในท่อร้อยสาย</span>
        </label>
        <label className="inline-flex items-center">
            <input type="checkbox" name="roomFeeder_wiring" 
            value="รางเดินสาย" 
            checked={formData.roomFeeder_wiring.includes('รางเดินสาย')} 
            onChange={handleWiringMethodChange} 
            className="form-checkbox h-5 w-5"/>
            <span className="ml-2 text-sm text-gray-700">เดินในรางเดินสาย</span>
        </label>
        <label className="inline-flex items-center">
            <input type="checkbox" name="roomFeeder_wiring" 
            value="อื่นๆ" 
            checked={formData.roomFeeder_wiring.includes('อื่นๆ')} 
            onChange={handleWiringMethodChange} 
            className="form-checkbox h-5 w-5"/>
            <span className="ml-2 text-sm text-gray-700">อื่นๆ</span>
        </label>
    </div>
</div>

{/* --- 2.20 แผงจ่ายไฟในห้องชุด --- */}
<div className="border-b border-gray-200 pb-4 mb-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.20 แผงจ่ายไฟในห้องชุด</h4>
    <CorrectiveRadio
        groupName="roomPanel_breakerStandard_correct"
        label="2.20.1 เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898"
        currentValue={formData.roomPanel_breakerStandard_correct}
        currentNote={formData.roomPanel_breakerStandard_note}
        onStatusChange={handleRadioChange}
        onNoteChange={handleChange}
    />
    <div className="border-t border-b border-gray-200 py-4 my-4">
        <label className="block text-sm font-semibold text-gray-800 mb-2">2.20.2 เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            <div>
                <label htmlFor="roomPanel_breaker_at" className="block text-xs font-medium text-gray-600">AT (A):</label>
                <input type="number" 
                name="roomPanel_breaker_at" 
                value={formData.roomPanel_breaker_at} 
                onChange={handleChange} 
                className="mt-1 w-full p-2 border rounded-md border-gray-600 text-gray-700"/>
            </div>
            <div>
                <label htmlFor="roomPanel_breaker_af" className="block text-xs font-medium text-gray-600">AF (A):</label>
                <input type="number" 
                name="roomPanel_breaker_af" 
                value={formData.roomPanel_breaker_af} 
                onChange={handleChange} 
                className="mt-1 w-full p-2 border rounded-md border-gray-600 text-gray-700"/>
            </div>
        </div>
        <CorrectiveRadio
            groupName="roomPanel_breakerMeterMatch_correct"
            label=""
            currentValue={formData.roomPanel_breakerMeterMatch_correct}
            currentNote={formData.roomPanel_breakerMeterMatch_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
            className="mt-4 text-sm font-semibold text-gray-800"
        />
    </div>
    <CorrectiveRadio
        groupName="roomPanel_icRating_correct"
        label="2.20.3 พิกัดตัดกระแสลัดวงจร (IC) ไม่ต่ำกว่า 10 kA"
        currentValue={formData.roomPanel_icRating_correct}
        currentNote={formData.roomPanel_icRating_note}
        onStatusChange={handleRadioChange}
        onNoteChange={handleChange}
        className="mb-4 text-sm font-semibold text-gray-800"
    />
</div>

{/* --- 2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน --- */}
<div className="border-b border-gray-200 pb-4 mb-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน (Ground Bus)</h4>
    <CorrectiveRadio
        groupName="roomPanel_groundBus_correct"
        label="สำหรับต่อกับอุปกรณ์และเครื่องใช้ไฟฟ้า"
        currentValue={formData.roomPanel_groundBus_correct}
        currentNote={formData.roomPanel_groundBus_note}
        onStatusChange={handleRadioChange}
        onNoteChange={handleChange}
        className="mb-4 text-sm font-semibold text-gray-800"
    />
</div>

{/* --- 2.22 อื่นๆ --- */}
<div className="mt-4">
    <label htmlFor="lvSystem_other_note" className="text-lg font-semibold text-gray-800">2.22 อื่นๆ</label>
    <textarea
        id="lvSystem_other_note"
        name="lvSystem_other_note"
        value={formData.lvSystem_other_note}
        onChange={handleChange}
        rows="3"
        className="mt-1 block w-full p-2 border rounded-md text-sm border-gray-300 shadow-sm text-gray-700"
        placeholder="รายละเอียดเพิ่มเติม..."
    ></textarea>
</div>
      </div>
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