"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
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
  inspection_number: "",
  inspection_date: "",
  request_number: "",
  request_date: "",
  pea_office: "",
  full_name: "",
  phone: "",
  address: "",
  voltage_system: "", // '22kV' หรือ '33kV'
  estimated_load: "",
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
  summary_result: "",
  scope_and_limitations: "",
  applicant_signature: "",
  pea_officer_signature: "",
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
      [groupName]: value, // รับค่า 'ถูกต้อง' หรือ 'ต้องแก้ไข' มาโดยตรง
      ...(value === 'ถูกต้อง' && { [noteFieldName]: '' }),
    }));
  };
  // ฟังก์ชันสำหรับจัดการ Checkbox ที่เลือกได้หลายข้อ
  const handleWiringMethodChange = (e) => {
    const { value, checked } = e.target;
    // ดึงข้อมูล array ปัจจุบันจาก state, ถ้ายังไม่มีให้ใช้ array ว่าง
    const currentMethods = formData.lv_main_cable_wiring_method || [];

    let newMethods;
    if (checked) {
      // ถ้าถูกติ๊ก, ให้เพิ่มค่าใหม่เข้าไปใน array
      newMethods = [...currentMethods, value];
    } else {
      // ถ้าติ๊กออก, ให้กรองค่าที่ตรงกันออกจาก array
      newMethods = currentMethods.filter((method) => method !== value);
    }
    // อัปเดต state ด้วย array ใหม่
    setFormData(prev => ({ ...prev, lv_main_cable_wiring_method: newMethods }));
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
    const currentTypes = formData.disconnecting_device_type || [];

    let newTypes;
    if (checked) {
      newTypes = [...currentTypes, value];
    } else {
      newTypes = currentTypes.filter((type) => type !== value);
    }
    setFormData(prev => ({ ...prev, disconnecting_device_type: newTypes }));
  };

  // --- เพิ่ม error handler สำหรับ Supabase ---
  const safeHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(e);
    } catch (err) {
      let msg = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      if (err) {
        if (err.message) msg += `\n${err.message}`;
        if (err.details) msg += `\nรายละเอียด: ${err.details}`;
        if (err.hint) msg += `\nคำแนะนำ: ${err.hint}`;
      }
      if (typeof window !== 'undefined') {
        alert(msg);
      }
      console.error('Supabase Error:', err);
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
    <form onSubmit={safeHandleSubmit} id="pea-condo-inspection-form" className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
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
            <input type="text" id="inspectionNumber" name="inspection_number" value={formData.inspection_number} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-900 mb-1">วันที่ตรวจสอบ:</label>
            <input type="date" id="inspectionDate" name="inspection_date" value={formData.inspection_date} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900 bg-gray-100" />
          </div>
          <div>
            <label htmlFor="requestNumber" className="block text-sm font-medium text-gray-900 mb-1">เลขที่คำร้องขอใช้ไฟฟ้า:</label>
            <input type="text" id="requestNumber" name="request_number" value={formData.request_number} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
          </div>
          <div>
            <label htmlFor="requestDate" className="block text-sm font-medium text-gray-900 mb-1">วันที่ยื่นคำร้อง:</label>
            <input type="date" id="requestDate" name="request_date" value={formData.request_date} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
          </div>
        </div>
      </section>

      {/* --- 1. General Information --- */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">1. ข้อมูลทั่วไป</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-1">ชื่อนิติบุคคล/ผู้ขอใช้ไฟฟ้า:</label>
            <input type="text" id="fullName" name="full_name" value={formData.full_name} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
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
            <select id="voltageSystem" name="voltage_system" value={formData.voltage_system} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900">
                <option value="">เลือกระบบแรงดัน</option>
                <option value="22kV">22 kV</option>
                <option value="33kV">33 kV</option>
            </select>
          </div>
          <div>
            <label htmlFor="estimatedLoad" className="block text-sm font-medium text-gray-900 mb-1">โหลดประมาณ (kVA):</label>
            <input type="number" step="any" id="estimatedLoad" name="estimated_load" value={formData.estimated_load} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm text-gray-900" />
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
              <label htmlFor="overhead_cable_Type" className="block text-sm font-semibold text-gray-800 mb-2">2.1.1 ชนิดสายตัวนำ:</label>
              <input
                type="text"
                id="overhead_cable_Type"
                name="overhead_cableType"
                value={formData.overhead_cable_Type}
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
                currentValue={formData.overhead_cable_Size_correct}
                currentNote={formData.overhead_cable_Size_correct_note}
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

          <div className="pl-4 border-l-4 border-purple-300 mt-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-800">2.2 ระบบจำหน่ายใต้ดิน</h4>
              <div className="space-y-4">
                  <label htmlFor="underground_cable_type" className="block text-sm font-semibold text-gray-800 mb-2">2.2.1 ชนิดสายตัวนำ:</label>
                  <input
                    type="text"
                    id="underground_cable_type"
                    name="underground_cable_type"
                    value={formData.underground_cable_type}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
                  />
                  <CorrectiveRadio
                    groupName="underground_cable_type_correct"
                    currentValue={formData.underground_cable_type_correct}
                    currentNote={formData.underground_cable_type_correct_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                  <label htmlFor="underground_cable_size_sqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.2.2 ขนาดสายตัวนำ (ตร.มม.):</label>
                  <input
                    type="text"
                    id="underground_cable_size_sqmm"
                    name="underground_cable_size_sqmm"
                    value={formData.underground_cable_size_sqmm}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
                  />
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
                    groupName="underground_cable_jointCondition_correct"
                    label="2.2.6 สภาพของจุดต่อสาย"
                    currentValue={formData.underground_cable_jointCondition_correct}
                    currentNote={formData.underground_cable_jointCondition_correct_note}
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
        
        {/* สร้าง Checkbox สำหรับแต่ละตัวเลือก */}
        {[
            'ดรอพเอาท์ฟิวส์คัตเอาท์',
            'สวิตช์ตัดตอน',
            'RMU (ไม่รวมฟังก์ชั่น)'
        ].map((device) => (
            <label key={device} className="flex items-center">
                <input
                    type="checkbox"
                    name="disconnecting_device_type"
                    value={device}
                    // ตรวจสอบว่าค่านี้มีอยู่ใน array หรือไม่
                    checked={(formData.disconnecting_device_type || []).includes(device)}
                    // เรียกใช้ handler ใหม่
                    onChange={handleDeviceTypeChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{device}</span>

                {/* แสดงช่อง input ถ้าเป็น 'สวิตช์ตัดตอน' และถูกเลือก */}
                {device === 'สวิตช์ตัดตอน' && (formData.disconnecting_device_type || []).includes('สวิตช์ตัดตอน') && (
                     <div className="flex items-center ml-2">
                        <span className="text-sm mr-2">ชนิด:</span>
                        <input
                            type="text"
                            name="disconnecting_device_switch_type"
                            value={formData.disconnecting_device_switch_type}
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
        groupName="hv_distribution_other" 
        label="" 
        currentValue={formData.hv_distribution_other} 
        currentNote={formData.hv_distribution_other_note} 
        onStatusChange={handleRadioChange} 
        onNoteChange={handleChange}
    />
    <div className="mt-2">
        <label htmlFor="hv_distribution_other" className="text-sm font-medium">อื่นๆ:</label>
        <input 
            type="text" 
            id="hv_distribution_other" 
            name="hv_distribution_other" 
            value={formData.hv_distribution_other} 
            onChange={handleChange} 
            className="mt-1 block w-full p-2 border rounded-md text-sm"
        />
    </div>
</div>

          <div className="mt-6"><h3 className="text-xl font-semibold mb-3 text-[#3a1a5b] mt-6">หม้อแปลง</h3></div>

          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b] mt-6">ระบบจำหน่ายแรงต่ำ</h3>
          <div className="pl-4 border-l-4 border-purple-300 space-y-6">
              <div><h4 className="text-lg font-semibold mb-3 text-gray-800">2.14 สายตัวนำประธานแรงต่ำ</h4>
              <CorrectiveRadio groupName="lv_main_cable_standard_correct" 
                label="2.14.1 สายไฟฟ้าเป็นไปตามมาตรฐานมอก.11-2553, มอก. 293-2541 หรือ IEC 60502" 
                currentValue={formData.lv_main_cable_standard_correct} 
                currentNote={formData.lv_main_cable_standard_correct_note} 
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
                                name="lv_main_cable_type"
                                value="IEC 01"
                                checked={formData.lv_main_cable_type === 'IEC 01'}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-gray-800"
                            />
                            <span className="ml-2 text-sm">IEC 01</span>
                        </label>
                        <label className="inline-flex items-center text-gray-700">
                            <input
                                type="radio"
                                name="lv_main_cable_type"
                                value="NYY"
                                checked={formData.lv_main_cable_type === 'NYY'}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-gray-800"
                            />
                            <span className="ml-2 text-sm">NYY</span>
                        </label>
                        <label className="inline-flex items-center text-gray-700">
                            <input
                                type="radio"
                                name="lv_main_cable_type"
                                value="CV"
                                checked={formData.lv_main_cable_type === 'CV'}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-gray-800"
                            />
                            <span className="ml-2 text-sm">CV</span>
                        </label>
                        <label className="inline-flex items-center text-gray-700">
                            <input
                                type="radio"
                                name="lv_main_cable_type"
                                value="อื่นๆ"
                                checked={formData.lv_main_cable_type === 'อื่นๆ'}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-gray-800"
                            />
                             <span className="ml-2 text-sm">อื่นๆ:</span>
                            {formData.lv_main_cable_type === 'อื่นๆ' && (
                                <input
                                    type="text"
                                    name="lv_main_cable_other_type"
                                    value={formData.lv_main_cable_other_type}
                                    onChange={handleChange}
                                    className="ml-2 p-1 border rounded-md text-sm w-32 border-gray-300"
                                    placeholder="ระบุชนิด"
                                />
                            )}
                        </label>
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="lv_main_cable_size" 
                    className="block text-sm font-medium text-gray-700 mb-2">ขนาด (ตร.มม.):</label>
                    <input
                        type="number"
                        step="any"
                        id="lv_main_cable_size"
                        name="lv_main_cable_size"
                        value={formData.lv_main_cable_size}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
                        placeholder="ระบุขนาดสาย"
                    />
                </div>

                <CorrectiveRadio
                    groupName="lv_main_cable_type_size_correct"
                    label=""
                    currentValue={formData.lv_main_cable_type_size_correct}
                    currentNote={formData.lv_main_cable_type_size_correct_note}
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
                                  name="lv_main_cable_wiring_method"
                                  value={method}
                                  checked={(formData.lv_main_cable_wiring_method || []).includes(method)}
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
                              name="lv_main_cable_wiring_method"
                              value="อื่นๆ"
                              checked={(formData.lv_main_cable_wiring_method || []).includes('อื่นๆ')}
                              onChange={handleWiringMethodChange}
                              className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">อื่นๆ:</span>
                      </label>
                  </div>

                  {/* ช่องใส่ข้อความสำหรับ "อื่นๆ" จะแสดงเมื่อถูกเลือก */}
                  {(formData.lv_main_cable_wiring_method || []).includes('อื่นๆ') && (
                      <div className="mt-3">
                          <input
                              type="text"
                              name="lv_main_cable_wiring_note"
                              value={formData.lv_main_cable_wiring_note || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full p-2 border rounded-md text-sm border-gray-300 shadow-sm"
                              placeholder="โปรดระบุวิธีการเดินสายอื่นๆ"
                          />
                      </div>
                  )}

                  {/* ผลการตรวจสอบ */}
                  <CorrectiveRadio
                      groupName="lv_main_cable_wiring_correct"
                      label=""
                      currentValue={formData.lv_main_cable_wiring_correct}
                      currentNote={formData.lv_main_cable_wiring_correct_note}
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
                    name="main_breaker_type"
                    value="เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2"
                    checked={formData.main_breaker_type === "เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2</span>
            </label>
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="main_breaker_type"
                    value="สวิตช์พร้อมฟิวส์"
                    checked={formData.main_breaker_type === "สวิตช์พร้อมฟิวส์"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">สวิตช์พร้อมฟิวส์</span>
            </label>
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="main_breaker_type"
                    value="อื่นๆ"
                    checked={formData.main_breaker_type === "อื่นๆ"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">อื่นๆ:</span>
                {formData.main_breaker_type === "อื่นๆ" && (
                    <input
                        type="text"
                        name="main_breaker_standard" // ใช้ฟิลด์ standard เก็บค่า "อื่นๆ"
                        value={formData.main_breaker_standard || ''}
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
            <label htmlFor="main_breaker_in" className="block text-xs font-medium text-gray-600">In (A):</label>
            <input type="number" name="main_breaker_in" value={formData.main_breaker_in} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-700"/>
        </div>
        <div>
            <label htmlFor="main_breaker_ic" className="block text-xs font-medium text-gray-600">IC (kA):</label>
            <input type="number" name="main_breaker_ic" value={formData.main_breaker_ic} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-700"/>
        </div>
        <div>
            <label htmlFor="main_breaker_voltage" className="block text-xs font-medium text-gray-600">แรงดัน (V):</label>
            <input type="number" name="main_breaker_voltage" value={formData.main_breaker_voltage} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-600"/>
        </div>
        <div>
            <label htmlFor="main_breaker_at" className="block text-xs font-medium text-gray-600">AT (A):</label>
            <input type="number" name="main_breaker_at" value={formData.main_breaker_at} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-700"/>
        </div>
        <div>
            <label htmlFor="main_breaker_af" className="block text-xs font-medium text-gray-600">AF (A):</label>
            <input type="number" name="main_breaker_af" value={formData.main_breaker_af} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-sm border-gray-300 text-gray-700"/>
        </div>
    </div>
    {/* --- ผลการตรวจสอบ --- */}
    <CorrectiveRadio
        groupName="main_breaker_correct"
        label="ผลการตรวจสอบ:"
        currentValue={formData.main_breaker_correct}
        currentNote={formData.main_breaker_correct_note}
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
            <label htmlFor="main_grounding_conductor_size_sqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.16.1 ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน</label>
            <div className="mt-1">
                 <label htmlFor="main_grounding_conductor_size_sqmm" className="block text-sm font-medium text-gray-700 mb-2">ขนาดสายต่อหลักดิน (ตร.มม.):</label>
                <input
                    type="number"
                    step="any"
                    id="main_grounding_conductor_size_sqmm"
                    name="main_grounding_conductor_size_sqmm"
                    value={formData.main_grounding_conductor_size_sqmm}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm text-gray-900"
                    placeholder="ระบุขนาด"
                />
            </div>
            <CorrectiveRadio
                groupName="main_grounding_conductor_size_correct"
                label=""
                currentValue={formData.main_grounding_conductor_size_correct}
                currentNote={formData.main_grounding_conductor_size_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
            />
        </div>

        {/* 2.16.2 ค่าความต้านทาน */}
        <CorrectiveRadio
            groupName="main_grounding_resistance_correct"
            label="2.16.2 ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม (มีข้อยกเว้น)"
            currentValue={formData.main_grounding_resistance_correct}
            currentNote={formData.main_grounding_resistance_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />

        {/* 2.16.3 จุดทดสอบ */}
        <CorrectiveRadio
            groupName="main_grounding_testPoint_correct"
            label="2.16.3 ต้องทำจุดทดสอบ สำหรับใช้วัดค่าความต้านทานการต่อลงดิน"
            currentValue={formData.main_grounding_testPoint_correct}
            currentNote={formData.main_grounding_testPoint_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />

        {/* 2.16.4 ขั้วต่อสายดิน */}
        <CorrectiveRadio
            groupName="main_grounding_bus_correct"
            label="2.16.4 แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) ตามที่ กฟภ. กำหนด"
            currentValue={formData.main_grounding_bus_correct}
            currentNote={formData.main_grounding_bus_correct_note}
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
            groupName="floor_panel_breaker_standard_correct"
            label="2.17.1 เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ มอก. 909-2548"
            currentValue={formData.floor_panel_breaker_standard_correct}
            currentNote={formData.floor_panel_breaker_standard_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />

        {/* 2.17.2 ขนาดเซอร์กิตเบรกเกอร์ */}
        <div className="border-b border-gray-200 pb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2">2.17.2 ขนาดเซอร์กิตเบรกเกอร์สอดคล้องกับขนาดสายป้อน</label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                <div>
                    <label htmlFor="floor_panel_breaker_at" className="block text-xs font-medium text-gray-600">AT (A):</label>
                    <input type="number" name="floor_panel_breaker_at" value={formData.floor_panel_breaker_at} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-gray-600 border-gray-600"/>
                </div>
                <div>
                    <label htmlFor="floor_panel_breaker_af" className="block text-xs font-medium text-gray-600">AF (A):</label>
                    <input type="number" name="floor_panel_breaker_af" value={formData.floor_panel_breaker_af} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-gray-600 border-gray-600"/>
                </div>
                <div>
                    <label htmlFor="floor_panel_breaker_ic" className="block text-xs font-medium text-gray-600">IC (kA):</label>
                    <input type="number" name="floor_panel_breaker_ic" value={formData.floor_panel_breaker_ic} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md text-gray-600 border-gray-600"/>
                </div>
            </div>

            <CorrectiveRadio
                groupName="floor_panel_breaker_size_correct"
                label=""
                currentValue={formData.floor_panel_breaker_size_correct}
                currentNote={formData.floor_panel_breaker_size_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
            />
        </div>

        {/* 2.17.3 ขั้วต่อสายดิน */}
        <CorrectiveRadio
            groupName="floor_panel_ground_bus_correct"
            label="2.17.3 แผงจ่ายไฟประจำชั้นต้องมีขั้วต่อสายดิน (Ground Bus) แยกจากขั้วต่อสายนิวทรัล (Neutral Bus)"
            currentValue={formData.floor_panel_ground_bus_correct}
            currentNote={formData.floor_panel_ground_bus_correct_note}
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
                <label htmlFor="meter_breaker_at" className="block text-xs font-medium text-gray-600">AT (A):</label>
                <input type="number" 
                name="meter_breaker_at" 
                value={formData.meter_breaker_at} 
                onChange={handleChange} 
                className="mt-1 w-full p-2 border rounded-md text-gray-600"/>
            </div>
            <div>
                <label htmlFor="meter_breaker_af" className="block text-xs font-medium text-gray-600">AF (A):</label>
                <input type="number" name="meter_breaker_af" 
                value={formData.meter_breaker_af} onChange={handleChange} 
                className="mt-1 w-full p-2 border rounded-md text-gray-600"/>
            </div>
        </div>

        <CorrectiveRadio
            groupName="meter_breaker_size_correct"
            label=""
            currentValue={formData.meter_breaker_size_correct}
            currentNote={formData.meter_breaker_size_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
        />
    </div>
</div>

{/* --- 2.19 สายตัวนำประธานเข้าห้องชุด --- */}
<div className="border-b border-gray-200 pb-4 mb-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.19 สายตัวนำประธานเข้าห้องชุด</h4>
    <CorrectiveRadio
        groupName="room_feeder_standard_correct"
        label="สายไฟฟ้าเป็นไปตามมาตรฐาน มอก.11-2553 หรือ IEC 60502"
        currentValue={formData.room_feeder_standard_correct}
        currentNote={formData.room_feeder_standard_correct_note}
        onStatusChange={handleRadioChange}
        onNoteChange={handleChange}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
        <div>
            <label htmlFor="room_feeder_type" className="block text-xs font-medium text-gray-600">ชนิด:</label>
            <input type="text" 
            name="room_feeder_type" 
            value={formData.room_feeder_type} 
            onChange={handleChange} 
            className="mt-1 w-full p-2 border rounded-md border-gray-600 text-gray-600"/>
        </div>
        <div>
            <label htmlFor="room_feeder_size" className="block text-xs font-medium text-gray-600">ขนาด (ตร.มม.):</label>
            <input type="number" 
            name="room_feeder_size" 
            value={formData.room_feeder_size} 
            onChange={handleChange} 
            className="mt-1 w-full p-2 border rounded-md border-gray-600 text-gray-600"/>
        </div>
    </div>
    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
        <label className="inline-flex items-center">
            <input type="checkbox" name="room_feeder_wiring" 
              value="ท่อร้อยสาย" checked={(formData.room_feeder_wiring || []).includes('ท่อร้อยสาย')} 
              onChange={handleWiringMethodChange} className="form-checkbox h-5 w-5"/>
            <span className="ml-2 text-sm text-gray-700">เดินในท่อร้อยสาย</span>
        </label>
        <label className="inline-flex items-center">
            <input type="checkbox" name="room_feeder_wiring" 
              value="รางเดินสาย" 
              checked={(formData.room_feeder_wiring || []).includes('รางเดินสาย')} 
              onChange={handleWiringMethodChange} 
              className="form-checkbox h-5 w-5"/>
            <span className="ml-2 text-sm text-gray-700">เดินในรางเดินสาย</span>
        </label>
        <label className="inline-flex items-center">
            <input type="checkbox" name="room_feeder_wiring" 
              value="อื่นๆ" 
              checked={(formData.room_feeder_wiring || []).includes('อื่นๆ')} 
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
        groupName="room_panel_breaker_standard_correct"
        label="2.20.1 เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898"
        currentValue={formData.room_panel_breaker_standard_correct}
        currentNote={formData.room_panel_breaker_standard_correct_note}
        onStatusChange={handleRadioChange}
        onNoteChange={handleChange}
    />
    <div className="border-t border-b border-gray-200 py-4 my-4">
        <label className="block text-sm font-semibold text-gray-800 mb-2">2.20.2 เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            <div>
                <label htmlFor="room_panel_breaker_at" className="block text-xs font-medium text-gray-600">AT (A):</label>
                <input type="number" 
                name="room_panel_breaker_at" 
                value={formData.room_panel_breaker_at} 
                onChange={handleChange} 
                className="mt-1 w-full p-2 border rounded-md border-gray-600 text-gray-700"/>
            </div>
            <div>
                <label htmlFor="room_panel_breaker_af" className="block text-xs font-medium text-gray-600">AF (A):</label>
                <input type="number" 
                name="room_panel_breaker_af" 
                value={formData.room_panel_breaker_af} 
                onChange={handleChange} 
                className="mt-1 w-full p-2 border rounded-md border-gray-600 text-gray-700"/>
            </div>
        </div>
        <CorrectiveRadio
            groupName="room_panel_breaker_meter_match_correct"
            label=""
            currentValue={formData.room_panel_breaker_meter_match_correct}
            currentNote={formData.room_panel_breaker_meter_match_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
            className="mt-4 text-sm font-semibold text-gray-800"
        />
    </div>
    <CorrectiveRadio
        groupName="room_panel_ic_rating_correct"
        label="2.20.3 พิกัดตัดกระแสลัดวงจร (IC) ไม่ต่ำกว่า 10 kA"
        currentValue={formData.room_panel_ic_rating_correct}
        currentNote={formData.room_panel_ic_rating_correct_note}
        onStatusChange={handleRadioChange}
        onNoteChange={handleChange}
        className="mb-4 text-sm font-semibold text-gray-800"
    />
</div>

{/* --- 2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน --- */}
<div className="border-b border-gray-200 pb-4 mb-6">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน (Ground Bus)</h4>
    <CorrectiveRadio
        groupName="room_panel_ground_bus_correct"
        label="สำหรับต่อกับอุปกรณ์และเครื่องใช้ไฟฟ้า"
        currentValue={formData.room_panel_ground_bus_correct}
        currentNote={formData.room_panel_ground_bus_correct_note}
        onStatusChange={handleRadioChange}
        onNoteChange={handleChange}
        className="mb-4 text-sm font-semibold text-gray-800"
    />
</div>

{/* --- 2.22 อื่นๆ --- */}
<div className="mt-4">
    <label htmlFor="lv_system_other_note" className="text-lg font-semibold text-gray-800">2.22 อื่นๆ</label>
    <textarea
        id="lv_system_other_note"
        name="lv_system_other_note"
        value={formData.lv_system_other_note}
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
          <label className="inline-flex items-center text-gray-900"><input type="radio" name="summary_result" value="ติดตั้งมิเตอร์ถาวร" checked={formData.summary_result === 'ติดตั้งมิเตอร์ถาวร'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">ติดตั้งมิเตอร์ถาวร</span></label>
          <label className="inline-flex items-center text-gray-900"><input type="radio" name="summary_result" value="ติดตั้งมิเตอร์ชั่วคราว" checked={formData.summary_result === 'ติดตั้งมิเตอร์ชั่วคราว'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">ติดตั้งมิเตอร์ชั่วคราว</span></label>
          <label className="inline-flex items-center text-gray-900"><input type="radio" name="summary_result" value="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" checked={formData.summary_result === 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์</span></label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SignaturePad 
            title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" 
            ref={userSigRef}
            onSave={(dataUrl) => handleSignatureSave('applicant_signature', dataUrl)} 
            onClear={() => handleSignatureClear('applicant_signature')}
            initialValue={formData.applicant_signature}
          />
          <SignaturePad 
            title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" 
            ref={inspectorSigRef} 
            onSave={(dataUrl) => handleSignatureSave('pea_officer_signature', dataUrl)} 
            onClear={() => handleSignatureClear('pea_officer_signature')}
            initialValue={formData.pea_officer_signature}
          />
        </div>
      </section>
      
      {/* --- Action Buttons --- */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 mt-8 border-t border-gray-200">
        <PDFDownloadLink
          document={<CondoInspectionPDF formData={formData} />}
          fileName={`condo-inspection-form-${formData.inspection_number || 'form'}.pdf`}
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