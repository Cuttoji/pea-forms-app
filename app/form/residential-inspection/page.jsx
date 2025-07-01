"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InspectionPDF from '@/components/forms/InspectionPDF'; // ตรวจสอบว่า path ไปยัง PDF component ถูกต้อง
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';
import { useFormManager } from "@/lib/hooks/useFormManager"; 

// Dynamic import for OpenStreetMapComponent to avoid SSR issues
const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), { 
  ssr: false 
});

// -- ค่าเริ่มต้นของข้อมูลในฟอร์ม --
const initialFormData = {
  id: null,
  inspectionNumber: "",
  inspectionDate: "",
  requestNumber: "",
  requestDate: "",
  fullName: "",
  phone: "",
  address: "",
  latitude: null,  
  longitude: null,
  address_photo_url: "",
  phaseType: "",
  estimatedLoad: "",
  cableStandard_correct: '',
  cableStandard_correct_note: "",
  cableType: "",
  cableOtherType: "",
  cableSizeSqmm: "",
  cableTypeSize_correct: '',
  cableTypeSize_correct_note: "",
  wiringMethodOverheadChecked: false,
  wiringMethodUndergroundChecked: false,
  overhead_height_correct: '',
  overhead_height_correct_note: "",
  overhead_neutralMarked_correct: '',
  overhead_neutralMarked_correct_note: "",
  underground_neutralMarked_correct: '',
  underground_neutralMarked_correct_note: "",
  breakerStandard_correct: '',
  breakerStandard_correct_note: "",
  breakerMeterMatch_correct: '',
  breakerMeterMatch_correct_note: "",
  breakerAmpRating: "",
  breakerShortCircuitRating_correct: '',
  breakerShortCircuitRating_correct_note: "",
  groundWireSize_correct: '',
  groundWireSize_correct_note: "",
  groundWireSizeSqmm: "",
  groundResistance_correct: '',
  groundResistance_correct_note: "",
  groundResistanceOhm: "",
  onePhaseGroundConnection_correct: '',
  onePhaseGroundConnection_correct_note: "",
  threePhaseGroundConnection_correct: '',
  threePhaseGroundConnection_correct_note: "",
  rcdInstalledOption: '',
  rcdInstalled_correct: '',
  rcdInstalled_correct_note: "",
  summaryResult: "",
  scopeOfInspection: "",
  userSignature: "",
  inspectorSignature: "",
  user_id: null,
};


export default function HomeForm() {
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
  } = useFormManager('inspection_forms', initialFormData, 'residential');

  const userSigRef = useRef(null);
  const inspectorSigRef = useRef(null);
  const imageUploadRef = useRef(null);

  const handleLocationSelect = (location) => {
    setFormData(prevData => ({
      ...prevData,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6),
    }));
  };

  // **ใช้ฟังก์ชันนี้เพียงฟังก์ชันเดียวสำหรับ CorrectiveRadio**
  const handleRadioChange = (groupName, value, noteFieldName) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: value, // รับค่า 'ถูกต้อง' หรือ 'ต้องแก้ไข' มาโดยตรง
      ...(value === 'ถูกต้อง' && { [noteFieldName]: '' }),
    }));
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
      <form onSubmit={handleSubmit} id="pea-inspection-form" className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
        <style jsx global>{`
          .sigCanvas { touch-action: none; }
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
          input[type=number] { -moz-appearance: textfield; }
        `}</style>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-[#5b2d90]">
          แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน
        </h2>

        {/* Header Section */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="inspectionNumber" className="block text-sm font-medium text-gray-900 mb-1">เลขที่บันทึกตรวจสอบ:</label>
              <input type="text" id="inspectionNumber" name="inspectionNumber" value={formData.inspectionNumber} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] text-gray-900" />
            </div>
            <div>
              <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-900 mb-1">วันที่ตรวจสอบ: <span className="text-xs text-gray-500">(อัตโนมัติ)</span></label>
              <input type="date" id="inspectionDate" name="inspectionDate" value={formData.inspectionDate} onChange={handleChange} readOnly className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] bg-gray-100 text-gray-900" />
            </div>
            <div>
              <label htmlFor="requestNumber" className="block text-sm font-medium text-gray-900 mb-1">เลขที่คำร้องขอใช้ไฟฟ้า:</label>
              <input type="text" id="requestNumber" name="requestNumber" value={formData.requestNumber} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] text-gray-900" />
            </div>
            <div>
              <label htmlFor="requestDate" className="block text-sm font-medium text-gray-900 mb-1">วันที่ยื่นคำร้อง:</label>
              <input type="date" id="requestDate" name="requestDate" value={formData.requestDate} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] text-gray-900" />
            </div>
          </div>
        </section>

        {/* 1. General Information */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">1. ข้อมูลทั่วไป</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-1">ชื่อ-นามสกุล/ชื่อผู้ขอใช้ไฟฟ้า:</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] text-gray-900" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">โทรศัพท์:</label>
              <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] text-gray-900" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-1">ที่อยู่:</label>
              <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3" className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] text-gray-900"></textarea>
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
                    currentImageUrl={formData.address_photo_url}
                />
            </div>
            <div>
              <label htmlFor="phaseType" className="block text-sm font-medium text-gray-900 mb-1">ชนิดของระบบไฟฟ้า:</label>
              <select id="phaseType" name="phaseType" value={formData.phaseType} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] bg-white text-gray-900">
                <option value="">เลือกชนิด</option>
                <option value="1_phase">1 เฟส</option>
                <option value="3_phase">3 เฟส</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimatedLoad" className="block text-sm font-medium text-gray-900 mb-1">ประมาณการโหลด (แอมแปร์):</label>
              <input type="number" step="any" id="estimatedLoad" name="estimatedLoad" value={formData.estimatedLoad} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] text-gray-900" />
            </div>
          </div>
        </section>
        
        {/* 2. Inspection */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">2. การตรวจสอบ</h2>
            <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">2.1 สายตัวนำประธานเข้าอาคาร</h3>
            <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
              <CorrectiveRadio groupName="cableStandard_correct" label="ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502" currentValue={formData.cableStandard_correct} currentNote={formData.cableStandard_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              
              <div className="border-b border-gray-200 pb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-1">ข) ชนิดและขนาด:</label>
                  <div className="flex flex-wrap gap-4 mt-2 mb-2">
                      <label className="inline-flex items-center text-gray-900"><input type="radio" name="cableType" value="IEC 01" checked={formData.cableType === 'IEC 01'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">IEC 01</span></label>
                      <label className="inline-flex items-center text-gray-900"><input type="radio" name="cableType" value="NYY" checked={formData.cableType === 'NYY'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">NYY</span></label>
                      <label className="inline-flex items-center text-gray-900"><input type="radio" name="cableType" value="CV" checked={formData.cableType === 'CV'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">CV</span></label>
                      <label className="inline-flex items-center text-gray-900"><input type="radio" name="cableType" value="อื่นๆ" checked={formData.cableType === 'อื่นๆ'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">อื่นๆ</span></label>
                      {formData.cableType === 'อื่นๆ' && (<input type="text" name="cableOtherType" value={formData.cableOtherType} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ"/>)}
                  </div>
                  <label htmlFor="cableSizeSqmm" className="block text-sm font-medium text-gray-900 mb-1">ขนาด (ตร.มม.):</label>
                  <input type="number" step="any" id="cableSizeSqmm" name="cableSizeSqmm" value={formData.cableSizeSqmm} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"/>
              </div>
              <CorrectiveRadio groupName="cableTypeSize_correct" label="ผลการตรวจสอบชนิดและขนาด" currentValue={formData.cableTypeSize_correct} currentNote={formData.cableTypeSize_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              
              <div className="border-b border-gray-200 pb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">ค) วิธีการเดินสาย:</label>
                  <div className="mt-2 space-y-4">
                      <div>
                          <label className="inline-flex items-center text-gray-900">
                            <input type="checkbox" name="wiringMethodOverheadChecked" checked={formData.wiringMethodOverheadChecked} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"/>
                            <span className="ml-2">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
                          </label>
                          {formData.wiringMethodOverheadChecked && (
                              <div className="mt-2 pl-6 border-l-2 border-gray-200 ml-2 space-y-3">
                                  <CorrectiveRadio groupName="overhead_height_correct" label="1) สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตร ถ้ายานพาหนะลอดผ่าน" currentValue={formData.overhead_height_correct} currentNote={formData.overhead_height_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
                                  <CorrectiveRadio groupName="overhead_neutralMarked_correct" label="2) สายตัวนำประธานทำเครื่องหมายที่สาย Neutral" currentValue={formData.overhead_neutralMarked_correct} currentNote={formData.overhead_neutralMarked_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
                              </div>
                          )}
                      </div>
                      <div>
                          <label className="inline-flex items-center text-gray-900">
                            <input type="checkbox" name="wiringMethodUndergroundChecked" checked={formData.wiringMethodUndergroundChecked} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"/>
                            <span className="ml-2">เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                          </label>
                          {formData.wiringMethodUndergroundChecked && (
                              <div className="mt-2 pl-6 border-l-2 border-gray-200 ml-2">
                                  <CorrectiveRadio groupName="underground_neutralMarked_correct" label="1) สายตัวนำประธานทำเครื่องหมายที่สาย Neutral" currentValue={formData.underground_neutralMarked_correct} currentNote={formData.underground_neutralMarked_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)</h3>
            <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
              <CorrectiveRadio groupName="breakerStandard_correct" label="ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898" currentValue={formData.breakerStandard_correct} currentNote={formData.breakerStandard_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <div className="border-b border-gray-200 pb-4">
                  <label htmlFor="breakerAmpRating" className="block text-sm font-medium text-gray-900 mb-1">ขนาด AT:</label>
                  <input type="number" step="any" id="breakerAmpRating" name="breakerAmpRating" value={formData.breakerAmpRating} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"/>
              </div>
              <CorrectiveRadio groupName="breakerMeterMatch_correct" label="ข) เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์" currentValue={formData.breakerMeterMatch_correct} currentNote={formData.breakerMeterMatch_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="breakerShortCircuitRating_correct" label="ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)" currentValue={formData.breakerShortCircuitRating_correct} currentNote={formData.breakerShortCircuitRating_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            </div>
            
            <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</h3>
            <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                  <label htmlFor="groundWireSizeSqmm" className="block text-sm font-medium text-gray-900 mb-1">ขนาดสายต่อหลักดิน (ตร.มม.):</label>
                  <input type="number" step="any" id="groundWireSizeSqmm" name="groundWireSizeSqmm" value={formData.groundWireSizeSqmm} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"/>
              </div>
              <CorrectiveRadio groupName="groundWireSize_correct" label="ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน" currentValue={formData.groundWireSize_correct} currentNote={formData.groundWireSize_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <div className="border-b border-gray-200 pb-4">
                  <label htmlFor="groundResistanceOhm" className="block text-sm font-medium text-gray-900 mb-1">ค่าความต้านทานการต่อลงดิน (โอห์ม):</label>
                  <input type="number" step="0.01" id="groundResistanceOhm" name="groundResistanceOhm" value={formData.groundResistanceOhm} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"/>
              </div>
              <CorrectiveRadio groupName="groundResistance_correct" label="ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม..." currentValue={formData.groundResistance_correct} currentNote={formData.groundResistance_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="onePhaseGroundConnection_correct" label="ค) กรณีระบบไฟฟ้า 1 เฟส..." currentValue={formData.onePhaseGroundConnection_correct} currentNote={formData.onePhaseGroundConnection_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              <CorrectiveRadio groupName="threePhaseGroundConnection_correct" label="ง) กรณีระบบไฟฟ้า 3 เฟส..." currentValue={formData.threePhaseGroundConnection_correct} currentNote={formData.threePhaseGroundConnection_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">2.4 เครื่องตัดไฟรั่ว (RCD)</h3>
            <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">ติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดพิกัดกระแสรั่ว (I∆n) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง</label>
              <div className="flex flex-wrap gap-4 mt-2">
                  <label className="inline-flex items-center text-gray-900">
                      <input type="radio" name="rcdInstalledOption" value="ถูกต้อง" checked={formData.rcdInstalledOption === 'ถูกต้อง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/>
                      <span className="ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center text-gray-900">
                      <input type="radio" name="rcdInstalledOption" value="ไม่ประสงค์ติดตั้ง" checked={formData.rcdInstalledOption === 'ไม่ประสงค์ติดตั้ง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/>
                      <span className="ml-2">ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว...</span>
                  </label>
              </div>
              {formData.rcdInstalledOption === 'ถูกต้อง' && (
                <div className="mt-4">
                  <CorrectiveRadio groupName="rcdInstalled_correct" label="การทำงานของ RCD ถูกต้อง" currentValue={formData.rcdInstalled_correct} currentNote={formData.rcdInstalled_correct_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
                </div>
              )}
            </div>
        </section>

        {/* --- Sections 3, 4, 5, 6 --- */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">3. กรณีผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ติดตั้งหม้อแปลงไฟฟ้าเพื่อรับไฟแรงสูง</h3>
          <p className="text-sm text-gray-600">ให้ตรวจสอบมาตรฐานการติดตั้งระบบไฟฟ้าแรงสูงเพิ่มเติมโดยใช้แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆ นอกเหนือจากที่อยู่อาศัย</p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</h3>
          <div className="flex flex-wrap gap-6 mb-4">
            <label className="inline-flex items-center text-gray-900"><input type="radio" name="summaryResult" value="ติดตั้งมิเตอร์ถาวร" checked={formData.summaryResult === 'ติดตั้งมิเตอร์ถาวร'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">ติดตั้งมิเตอร์ถาวร</span></label>
            <label className="inline-flex items-center text-gray-900"><input type="radio" name="summaryResult" value="ติดตั้งมิเตอร์ชั่วคราว" checked={formData.summaryResult === 'ติดตั้งมิเตอร์ชั่วคราว'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">ติดตั้งมิเตอร์ชั่วคราว</span></label>
            <label className="inline-flex items-center text-gray-900"><input type="radio" name="summaryResult" value="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" checked={formData.summaryResult === 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/><span className="ml-2">ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์</span></label>
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">5. ขอบเขตและข้อจำกัดในการตรวจสอบ</h3>
          <textarea id="scopeOfInspection" name="scopeOfInspection" value={formData.scopeOfInspection} onChange={handleChange} rows="4" className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] text-gray-900"></textarea>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</h3>
          <div className="text-gray-900 text-sm mb-6 space-y-3">
              <p>6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนสิ่งก่อสร้างอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงอยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว</p>
              <p>6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหลัง หรืออุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
              <p>6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
              <p>6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SignaturePad 
              title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" 
              ref={userSigRef}
              onSave={(dataUrl) => handleSignatureSave('userSignature', dataUrl)} 
              onClear={() => handleSignatureClear('userSignature')}
              initialValue={formData.userSignature}
            />
            <SignaturePad 
              title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" 
              ref={inspectorSigRef} 
              onSave={(dataUrl) => handleSignatureSave('inspectorSignature', dataUrl)} 
              onClear={() => handleSignatureClear('inspectorSignature')}
              initialValue={formData.inspectorSignature}
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