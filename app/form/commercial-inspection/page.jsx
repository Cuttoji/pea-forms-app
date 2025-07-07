"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFormManager } from "@/lib/hooks/useFormManager";
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InspectionPDF from "@/components/forms/InspectionPDF";
// import CommercialInspectionPDF from '@/components/forms/CommercialInspectionPDF';
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';

const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), { 
  ssr: false 
});

// --- ค่าเริ่มต้นของข้อมูลในฟอร์ม ---
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
  voltageSystem: "",
  estimatedLoad: "",
  hasDesignCertification: null,
  asBuiltDrawingCertified: false,
  engineerLicenseCopy: false,

  // 2.1 ระบบจำหน่ายเหนือดิน
  overhead_cableType: "",
  overhead_cableType_correct: null,
  overhead_cableType_note: "",
  overhead_cableSizeSqmm: "",
  overhead_cableSize_correct: null,
  overhead_cableSize_note: "",
  overhead_poleCondition_correct: null,
  overhead_poleCondition_note: "",
  overhead_poleTopEquipment_correct: null,
  overhead_poleTopEquipment_note: "",
  overhead_guyWireAssembly_correct: null,
  overhead_guyWireAssembly_note: "",
  overhead_insulatorType_correct: null,
  overhead_insulatorType_note: "",
  overhead_cableSagging_correct: null,
  overhead_cableSagging_note: "",
  overhead_clearance_correct: null,
  overhead_clearance_note: "",
  overhead_hvSurgeArrester_correct: null,
  overhead_hvSurgeArrester_note: "",
  overhead_cableJointCondition_correct: null,
  overhead_cableJointCondition_note: "",
  overhead_grounding_correct: null,
  overhead_grounding_note: "",

  // 2.2 ระบบจำหน่ายใต้ดิน
  underground_cableType: "",
  underground_cableType_correct: null,
  underground_cableType_note: "",
  underground_cableSizeSqmm: "",
  underground_cableSize_correct: null,
  underground_cableSize_note: "",
  underground_visibleCableCondition_correct: null,
  underground_visibleCableCondition_note: "",
  underground_cableTension_correct: null,
  underground_cableTension_note: "",
  underground_hvSurgeArrester_correct: null,
  underground_hvSurgeArrester_note: "",
  underground_cableJointCondition_correct: null,
  underground_cableJointCondition_note: "",
  underground_grounding_correct: null,
  underground_grounding_note: "",

  // 2.3 เครื่องปลดวงจรต้นทาง
  disconnectingDeviceStatus: null,
  disconnectingDeviceNote: "",
  disconnectingDeviceType: [],
  disconnectingDeviceSwitchType: "",
  hvDistributionOther: "",
  
  // หม้อแปลง (ฟิลด์เดี่ยว)
  transformer_tested: null,
  transformer_number: "",
  transformer_size_kva: "",
  transformer_hv_voltage: "",
  transformer_lv_voltage: "",
  transformer_impedance: "",
  transformer_type: "",
  transformer_type_other: "",
  transformer_vector_group: "",
  transformer_short_circuit_rating_correct: null,
  transformer_short_circuit_rating_note: "",
  transformer_installation_type: [],
  transformer_overcurrent_protection_type: [],
  transformer_overcurrent_protection_other: "",
  transformer_continuous_current_a: '',
  transformer_interrupting_capacity_ic: '',
  transformer_overcurrent_protection_correct: null,
  transformer_overcurrent_protection_note: "",
  transformer_hv_surge_arrester_correct: null,
  transformer_hv_surge_arrester_note: "",
  transformer_grounding_assembly_correct: null,
  transformer_grounding_assembly_note: "",
  transformer_hv_ground_resistance_correct: null,
  transformer_hv_ground_resistance_note: "",
  transformer_silica_gel_correct: null,
  transformer_silica_gel_note: "",
  transformer_bushing_condition_correct: null,
  transformer_bushing_condition_note: "",
  transformer_oil_level_correct: null,
  transformer_oil_level_note: "",
  transformer_oil_leak_correct: null,
  transformer_oil_leak_note: "",
  transformer_warning_sign_correct: null,
  transformer_warning_sign_note: "",
  transformer_other_note: "",

  // สรุปผลและลงนาม
  summaryResult: "",
  scopeAndLimitations: "",
  applicantSignature: "",
  peaOfficerSignature: "",
};

export default function CommercialInspectionForm() {
  const {
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleSignatureSave,
    handleSignatureClear
  } = useFormManager('commercial_inspection', initialFormData, 'commercial');

  const applicantSigRef = useRef(null);
  const peaOfficerSigRef = useRef(null);
  
  // ปรับฟังก์ชัน handleRadioChange ให้รองรับการเปลี่ยน note (textarea) ของ CorrectiveRadio
  const handleRadioChange = (groupName, value, noteFieldName) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: value,
      ...(noteFieldName && value === 'ถูกต้อง' ? { [noteFieldName]: '' } : {}),
    }));
  };

  // เพิ่มฟังก์ชันนี้เพื่อรองรับการเปลี่ยน note ของ CorrectiveRadio
  const handleRadioNoteChange = (noteFieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [noteFieldName]: value,
    }));
  };

  // เพิ่มฟังก์ชันนี้เพื่อแก้ error
  const handleInstallationTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      let updated = [...(prev.transformer_installation_type || [])];
      if (checked) {
        if (!updated.includes(value)) updated.push(value);
      } else {
        updated = updated.filter(item => item !== value);
      }
      return { ...prev, transformer_installation_type: updated };
    });
  };

  // เพิ่มฟังก์ชันนี้สำหรับ overcurrent protection type ด้วย (ถ้ายังไม่มี)
  const handleOvercurrentProtectionTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      let updated = [...(prev.transformer_overcurrent_protection_type || [])];
      if (checked) {
        if (!updated.includes(value)) updated.push(value);
      } else {
        updated = updated.filter(item => item !== value);
      }
      return { ...prev, transformer_overcurrent_protection_type: updated };
    });
  };

  // เพิ่มฟังก์ชันนี้เพื่อแก้ error
  const handleDeviceTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      let updated = [...(prev.disconnectingDeviceType || [])];
      if (checked) {
        if (!updated.includes(value)) updated.push(value);
      } else {
        updated = updated.filter(item => item !== value);
      }
      return { ...prev, disconnectingDeviceType: updated };
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pea-primary"></div><p className="ml-4 text-lg text-gray-600">กำลังโหลดข้อมูลฟอร์ม...</p></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
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

      <section className="bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">2. การตรวจสอบ</h2>
        {/* --- 2. การตรวจสอบ --- */}
<section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
    <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">2. การตรวจสอบ</h2>

    {/* เอกสารรับรองการออกแบบ */}
    <div className="border-b border-gray-200 pb-4 mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">เอกสารรับรองการออกแบบระบบไฟฟ้า:</label>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
            <label className="inline-flex items-center cursor-pointer">
                <input type="radio" name="hasDesignCertification" value="true" checked={formData.hasDesignCertification === true} onChange={() => setFormData(prev => ({...prev, hasDesignCertification: true}))} className="form-radio h-5 w-5 text-[#5b2d90]"/>
                <span className="ml-2 text-sm text-gray-700">มี</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
                <input type="radio" name="hasDesignCertification" value="false" checked={formData.hasDesignCertification === false} onChange={() => setFormData(prev => ({...prev, hasDesignCertification: false}))} className="form-radio h-5 w-5 text-[#5b2d90]"/>
                <span className="ml-2 text-sm text-gray-700">ไม่มี</span>
            </label>
        </div>
        {formData.hasDesignCertification && (
            <div className="mt-3 pl-6 space-y-2">
                <label className="flex items-center text-sm text-gray-700">
                    <input type="checkbox" name="asBuiltDrawingCertified" checked={formData.asBuiltDrawingCertified} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 rounded"/>
                    <span className="ml-2">1. วิศวกรลงนามรับรองในแบบ As-built Drawing</span>
                </label>
                <label className="flex items-center text-sm text-gray-700">
                    <input type="checkbox" name="engineerLicenseCopy" checked={formData.engineerLicenseCopy} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 rounded"/>
                    <span className="ml-2">2. สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม</span>
                </label>
            </div>
        )}
    </div>

    <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b] mt-6">ระบบจำหน่ายแรงสูง</h3>

        {/* --- 2.1 ระบบจำหน่ายเหนือดิน --- */}
        <div className="pl-4 border-l-4 border-purple-300">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.1 ระบบจำหน่ายเหนือดิน</h4>
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <div className="mb-4">
                        <label htmlFor="overhead_cableType" className="block text-sm font-semibold text-gray-800 mb-2">2.1.1 ชนิดสายตัวนำ:</label>
                        <input type="text" id="overhead_cableType" name="overhead_cableType" value={formData.overhead_cableType} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" placeholder="เช่น SAC, THW-A"/>
                        <CorrectiveRadio groupName="overhead_cableType_correct" currentValue={formData.overhead_cableType_correct} currentNote={formData.overhead_cableType_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                    </div>
                    <div>
                        <label htmlFor="overhead_cableSizeSqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.1.2 ขนาดสายตัวนำ (ตร.มม.):</label>
                        <input type="number" step="any" id="overhead_cableSizeSqmm" name="overhead_cableSizeSqmm" value={formData.overhead_cableSizeSqmm} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm" placeholder="เช่น 50, 70"/>
                        <CorrectiveRadio groupName="overhead_cableSize_correct" currentValue={formData.overhead_cableSize_correct} currentNote={formData.overhead_cableSize_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                    </div>
                </div>
                <CorrectiveRadio groupName="overhead_poleCondition_correct" label="2.1.3 สภาพเสาและระยะห่าง" currentValue={formData.overhead_poleCondition_correct} currentNote={formData.overhead_poleCondition_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="overhead_poleTopEquipment_correct" label="2.1.4 การประกอบอุปกรณ์หัวเสา" currentValue={formData.overhead_poleTopEquipment_correct} currentNote={formData.overhead_poleTopEquipment_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="overhead_guyWireAssembly_correct" label="2.1.5 การประกอบชุดยึดโยง" currentValue={formData.overhead_guyWireAssembly_correct} currentNote={formData.overhead_guyWireAssembly_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="overhead_insulatorType_correct" label="2.1.6 ลูกถ้วยและฉนวน" currentValue={formData.overhead_insulatorType_correct} currentNote={formData.overhead_insulatorType_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="overhead_cableSagging_correct" label="2.1.7 การพาดสาย (สภาพสาย, ระยะหย่อนยาน)" currentValue={formData.overhead_cableSagging_correct} currentNote={formData.overhead_cableSagging_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="overhead_clearance_correct" label="2.1.8 ระยะห่างของสายกับอาคาร สิ่งก่อสร้าง หรือต้นไม้" currentValue={formData.overhead_clearance_correct} currentNote={formData.overhead_clearance_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="overhead_hvSurgeArrester_correct" label="2.1.9 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)" currentValue={formData.overhead_hvSurgeArrester_correct} currentNote={formData.overhead_hvSurgeArrester_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="overhead_cableJointCondition_correct" label="2.1.10 สภาพของจุดต่อสาย" currentValue={formData.overhead_cableJointCondition_correct} currentNote={formData.overhead_cableJointCondition_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="overhead_grounding_correct" label="2.1.11 การต่อลงดิน" currentValue={formData.overhead_grounding_correct} currentNote={formData.overhead_grounding_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
            </div>
        </div>

        {/* --- 2.2 ระบบจำหน่ายใต้ดิน --- */}
        <div className="pl-4 border-l-4 border-purple-300 mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.2 ระบบจำหน่ายใต้ดิน</h4>
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <div className="mb-4">
                        <label htmlFor="underground_cableType" className="block text-sm font-semibold text-gray-800 mb-2">2.2.1 ชนิดสายตัวนำ:</label>
                        <input type="text" id="underground_cableType" name="underground_cableType" value={formData.underground_cableType} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm"/>
                        <CorrectiveRadio groupName="underground_cableType_correct" currentValue={formData.underground_cableType_correct} currentNote={formData.underground_cableType_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                    </div>
                    <div>
                        <label htmlFor="underground_cableSizeSqmm" className="block text-sm font-semibold text-gray-800 mb-2">2.2.2 ขนาดสายตัวนำ (ตร.มม.):</label>
                        <input type="number" step="any" id="underground_cableSizeSqmm" name="underground_cableSizeSqmm" value={formData.underground_cableSizeSqmm} onChange={handleChange} className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm"/>
                        <CorrectiveRadio groupName="underground_cableSize_correct" currentValue={formData.underground_cableSize_correct} currentNote={formData.underground_cableSize_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                    </div>
                </div>
                <CorrectiveRadio groupName="underground_visibleCableCondition_correct" label="2.2.3 สภาพสายส่วนที่มองเห็นได้" currentValue={formData.underground_visibleCableCondition_correct} currentNote={formData.underground_visibleCableCondition_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="underground_cableTension_correct" label="2.2.4 ความตึงของสาย" currentValue={formData.underground_cableTension_correct} currentNote={formData.underground_cableTension_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="underground_hvSurgeArrester_correct" label="2.2.5 การติดตั้งกับดักเสิร์จ" currentValue={formData.underground_hvSurgeArrester_correct} currentNote={formData.underground_hvSurgeArrester_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="underground_cableJointCondition_correct" label="2.2.6 สภาพของจุดต่อสาย" currentValue={formData.underground_cableJointCondition_correct} currentNote={formData.underground_cableJointCondition_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
                <CorrectiveRadio groupName="underground_grounding_correct" label="2.2.7 การต่อลงดิน" currentValue={formData.underground_grounding_correct} currentNote={formData.underground_grounding_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
            </div>
        </div>

        {/* --- 2.3 การติดตั้งเครื่องปลดวงจรต้นทาง --- */}
        <div className="pl-4 border-l-4 border-purple-300 mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.3 การติดตั้งเครื่องปลดวงจรต้นทาง</h4>
            <div className="space-y-3">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="disconnectingDeviceType"
                        value="ดรอพเอาท์ฟิวส์คัตเอาท์"
                        checked={formData.disconnectingDeviceType.includes('ดรอพเอาท์ฟิวส์คัตเอาท์')}
                        onChange={handleDeviceTypeChange}
                        className="form-checkbox h-5 w-5 text-purple-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="disconnectingDeviceType"
                        value="สวิตช์ตัดตอน"
                        checked={formData.disconnectingDeviceType.includes('สวิตช์ตัดตอน')}
                        onChange={handleDeviceTypeChange}
                        className="form-checkbox h-5 w-5 text-purple-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">สวิตช์ตัดตอน</span>
                    {formData.disconnectingDeviceType.includes('สวิตช์ตัดตอน') && (
                        <div className="flex items-center ml-2">
                            <span className="text-sm mr-2">ชนิด:</span>
                            <input
                                type="text"
                                name="disconnectingDeviceSwitchType"
                                value={formData.disconnectingDeviceSwitchType}
                                onChange={handleChange}
                                className="p-1 border rounded-md text-sm w-40"
                            />
                        </div>
                    )}
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="disconnectingDeviceType"
                        value="RMU (ไม่รวมฟังก์ชั่น)"
                        checked={formData.disconnectingDeviceType.includes('RMU (ไม่รวมฟังก์ชั่น)')}
                        onChange={handleDeviceTypeChange}
                        className="form-checkbox h-5 w-5 text-purple-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">RMU (ไม่รวมฟังก์ชั่น)</span>
                </label>
            </div>
            <CorrectiveRadio groupName="disconnectingDeviceStatus" label="" currentValue={formData.disconnectingDeviceStatus} currentNote={formData.disconnectingDeviceNote} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
            <div className="mt-2">
                <label htmlFor="hvDistributionOther" className="text-sm font-medium">อื่นๆ:</label>
                <input type="text" id="hvDistributionOther" name="hvDistributionOther" value={formData.hvDistributionOther} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md text-sm"/>
            </div>
        </div>
    </div>
</section>

{/* --- หม้อแปลง (2.5 - 2.13) --- */}
<div className="mt-6">
    <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">หม้อแปลง</h3>
    <div className="space-y-4 pl-4 border-l-4 border-purple-300">

        {/* --- 2.5 คุณสมบัติทั่วไปของหม้อแปลง --- */}
        <div className="border-b border-gray-200 pb-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.5 คุณสมบัติทั่วไปของหม้อแปลง</h4>
            <div className="flex items-center space-x-4 mb-4">
                <label className="inline-flex items-center">
                    <input type="radio" name="transformer_tested" value="true" checked={formData.transformer_tested === true} onChange={() => setFormData(prev => ({...prev, transformer_tested: true}))} className="form-radio h-5 w-5 text-purple-600"/>
                    <span className="ml-2 text-sm">ผ่านการทดสอบ</span>
                </label>
                <label className="inline-flex items-center">
                    <input type="radio" name="transformer_tested" value="false" checked={formData.transformer_tested === false} onChange={() => setFormData(prev => ({...prev, transformer_tested: false}))} className="form-radio h-5 w-5 text-purple-600"/>
                    <span className="ml-2 text-sm">ไม่ผ่านการทดสอบ</span>
                </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ขนาด (kVA)</label>
                    <input type="number" name="transformer_size_kva" value={formData.transformer_size_kva || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">พิกัดแรงดัน (ด้านแรงสูง)</label>
                    <input type="text" name="transformer_hv_voltage" value={formData.transformer_hv_voltage || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">พิกัดแรงดัน (ด้านแรงต่ำ)</label>
                    <input type="text" name="transformer_lv_voltage" value={formData.transformer_lv_voltage || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">% Impedance</label>
                    <input type="number" step="any" name="transformer_impedance" value={formData.transformer_impedance || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Vector Group</label>
                    <input type="text" name="transformer_vector_group" value={formData.transformer_vector_group || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">ชนิด:</label>
                <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center"><input type="radio" name="transformer_type" value="Oil" checked={formData.transformer_type === 'Oil'} onChange={handleChange} className="form-radio"/><span className="ml-2 text-sm">Oil</span></label>
                    <label className="inline-flex items-center"><input type="radio" name="transformer_type" value="Dry" checked={formData.transformer_type === 'Dry'} onChange={handleChange} className="form-radio"/><span className="ml-2 text-sm">Dry</span></label>
                    <label className="inline-flex items-center">
                        <input type="radio" name="transformer_type" value="Other" checked={formData.transformer_type === 'Other'} onChange={handleChange} className="form-radio"/>
                        <span className="ml-2 text-sm">อื่นๆ:</span>
                        {formData.transformer_type === 'Other' && (
                            <input type="text" name="transformer_type_other" value={formData.transformer_type_other || ''} onChange={handleChange} className="ml-2 p-1 border rounded-md text-sm w-32"/>
                        )}
                    </label>
                </div>
            </div>
            <CorrectiveRadio groupName="transformer_properties_correct" label="ผลการตรวจสอบคุณสมบัติ" currentValue={formData.transformer_properties_correct} currentNote={formData.transformer_properties_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
        </div>

        {/* --- 2.6 ลักษณะการติดตั้ง --- */}
        <div className="border-b border-gray-200 pb-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.6 ลักษณะการติดตั้ง</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700 mb-3">
                {['แขวน', 'นั่งร้าน', 'ตั้งพื้น', 'บนดาดฟ้า', 'ห้องหม้อแปลง'].map(type => (
                    <label key={type} className="inline-flex items-center">
                        <input type="checkbox" value={type} checked={formData.transformer_installation_type.includes(type)} onChange={handleInstallationTypeChange} className="form-checkbox"/>
                        <span className="ml-2 text-sm">{type}</span>
                    </label>
                ))}
                <label className="inline-flex items-center">
                    <input type="checkbox" value="อื่นๆ" checked={formData.transformer_installation_type.includes('อื่นๆ')} onChange={handleInstallationTypeChange} className="form-checkbox"/>
                    <span className="ml-2 text-sm">อื่นๆ:</span>
                    {formData.transformer_installation_type.includes('อื่นๆ') && (
                        <input type="text" name="transformer_installation_type_other" value={formData.transformer_installation_type_other || ''} onChange={handleChange} className="ml-2 p-1 border rounded-md text-sm w-32"/>
                    )}
                </label>
            </div>
            <CorrectiveRadio groupName="transformer_installation_correct" label="" currentValue={formData.transformer_installation_correct} currentNote={formData.transformer_installation_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
        </div>

        {/* --- 2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า --- */}
        <div className="border-b border-gray-200 pb-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า</h4>
            <div className="flex flex-wrap gap-4 mb-3 text-gray-700">
                {['ดรอพเอาท์ฟิวส์คัตเอาท์', 'เซอร์กิตเบรกเกอร์'].map(type => (
                     <label key={type} className="inline-flex items-center">
                        <input type="checkbox" value={type} checked={formData.transformer_overcurrent_protection_type.includes(type)} onChange={handleOvercurrentProtectionTypeChange} className="form-checkbox"/>
                        <span className="ml-2 text-sm">{type}</span>
                    </label>
                ))}
                <label className="inline-flex items-center">
                    <input type="checkbox" value="อื่นๆ" checked={formData.transformer_overcurrent_protection_type.includes('อื่นๆ')} onChange={handleOvercurrentProtectionTypeChange} className="form-checkbox"/>
                    <span className="ml-2 text-sm">อื่นๆ:</span>
                    {formData.transformer_overcurrent_protection_type.includes('อื่นๆ') && (
                        <input type="text" name="transformer_overcurrent_protection_other" value={formData.transformer_overcurrent_protection_other || ''} onChange={handleChange} className="ml-2 p-1 border rounded-md text-sm w-32"/>
                    )}
                </label>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">พิกัดกระแสต่อเนื่อง (A)</label>
                    <input type="number" name="transformer_continuous_current_a" value={formData.transformer_continuous_current_a || ''} onChange={handleChange} className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">พิกัดตัดกระแสลัดวงจร (IC)</label>
                    <input type="text" name="transformer_interrupting_capacity_ic" value={formData.transformer_interrupting_capacity_ic || ''} onChange={handleChange} className="w-full p-2 border rounded-md"/>
                </div>
            </div>
            <CorrectiveRadio groupName="transformer_overcurrent_correct" label="" currentValue={formData.transformer_overcurrent_correct} currentNote={formData.transformer_overcurrent_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
        </div>
        
        {/* --- 2.8 - 2.13 --- */}
        <CorrectiveRadio groupName="transformer_hv_surge_arrester_correct" label="2.8 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)" currentValue={formData.transformer_hv_surge_arrester_correct} currentNote={formData.transformer_hv_surge_arrester_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
        <CorrectiveRadio groupName="transformer_grounding_assembly_correct" label="2.9 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จ" currentValue={formData.transformer_grounding_assembly_correct} currentNote={formData.transformer_grounding_assembly_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
        <CorrectiveRadio groupName="transformer_hv_ground_resistance_correct" label="2.10 ค่าความต้านทานดินของระบบแรงสูง" currentValue={formData.transformer_hv_ground_resistance_correct} currentNote={formData.transformer_hv_ground_resistance_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
        
        <h5 className="font-semibold text-gray-700 mt-4">2.11 สภาพภายนอกหม้อแปลง (เฉพาะชนิดน้ำมัน)</h5>
        <div className="pl-4">
            <CorrectiveRadio groupName="transformer_silica_gel_correct" label="2.11.1 สารดูดความชื้น (Silica Gel)" currentValue={formData.transformer_silica_gel_correct} currentNote={formData.transformer_silica_gel_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
            <CorrectiveRadio groupName="transformer_bushing_condition_correct" label="2.11.2 สภาพบุชชิ่ง" currentValue={formData.transformer_bushing_condition_correct} currentNote={formData.transformer_bushing_condition_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
            <CorrectiveRadio groupName="transformer_oil_level_correct" label="2.11.3 ระดับน้ำมัน" currentValue={formData.transformer_oil_level_correct} currentNote={formData.transformer_oil_level_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
            <CorrectiveRadio groupName="transformer_oil_leak_correct" label="2.11.4 การรั่วซึมของน้ำมัน" currentValue={formData.transformer_oil_leak_correct} currentNote={formData.transformer_oil_leak_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
        </div>

        <CorrectiveRadio groupName="transformer_warning_sign_correct" label="2.12 ป้ายเตือนอันตรายไฟฟ้าแรงสูง" currentValue={formData.transformer_warning_sign_correct} currentNote={formData.transformer_warning_sign_note} onStatusChange={handleRadioChange} onNoteChange={(noteField, value) => handleRadioNoteChange(noteField, value)}/>
        
        <div>
            <label htmlFor="transformer_other_note" className="text-lg font-semibold text-gray-800">2.13 อื่นๆ</label>
            <textarea id="transformer_other_note" name="transformer_other_note" value={formData.transformer_other_note} onChange={handleChange} rows="3" className="mt-1 block w-full p-2 border rounded-md text-sm text-gray-700"></textarea>
        </div>
    </div>
</div>

      </section>
      {/* --- สรุปและลงนาม --- */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">สรุปผลและลงนาม</h3>
        {/* ... UI for Summary and Signatures ... */}
      </section>
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">ลงชื่อ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SignaturePad 
                  title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" 
                  ref={applicantSigRef}
                  onSave={(dataUrl) => handleSignatureSave('applicantSignature', dataUrl)} 
                  onClear={() => handleSignatureClear('applicantSignature')}
                  initialValue={formData.applicantSignature}
                />
                <SignaturePad 
                  title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" 
                  ref={peaOfficerSigRef}
                  onSave={(dataUrl) => handleSignatureSave('peaOfficerSignature', dataUrl)} 
                  onClear={() => handleSignatureClear('peaOfficerSignature')}
                  initialValue={formData.peaOfficerSignature}
                />
              </div>
            </section>
            
            {/* --- Action Buttons --- */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 mt-8 border-t border-gray-200">
              <PDFDownloadLink
                document={<InspectionPDF formData={formData} />}
                fileName={`inspection-form-${formData.inspectionNumber || 'form'}.pdf`}
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