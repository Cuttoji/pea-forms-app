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
import { FormProvider } from '@/lib/contexts/FormContext';

// Dynamic import for OpenStreetMapComponent to avoid SSR issues
const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), { 
  ssr: false 
});

// -- ค่าเริ่มต้นของข้อมูลในฟอร์ม --
const initialFormData = {
  id: null,
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

  cablestandard_correct: '',
  cablestandard_correct_note: "",
  cabletype: "",
  cableothertype: "",
  cablesizesqmm: "",
  cabletypesize_correct: '',
  cabletypesize_correct_note: "",
  wiringmethodoverheadchecked: false,
  wiringmethodundergroundchecked: false,
  overhead_height_correct: '',
  overhead_height_correct_note: "",
  overhead_neutralmarked_correct: '',
  overhead_neutralmarked_correct_note: "",
  underground_neutralmarked_correct: '',
  underground_neutralmarked_correct_note: "",
  breakerstandard_correct: '',
  breakerstandard_correct_note: "",
  breakermetermatch_correct: '',
  breakermetermatch_correct_note: "",
  breakeramprating: "",
  breakershortcircuitrating_correct: '',
  breakershortcircuitrating_correct_note: "",
  groundwiresize_correct: '',
  groundwiresize_correct_note: "",
  groundwiresizesqmm: "",
  groundresistance_correct: '',
  groundresistance_correct_note: "",
  groundresistanceohm: "",
  onephasegroundconnection_correct: '',
  onephasegroundconnection_correct_note: "",
  threephasegroundconnection_correct: '',
  threephasegroundconnection_correct_note: "",
  rcdinstalledoption: '',
  rcdinstalled_correct: '',
  rcdinstalled_correct_note: "",
  summaryresult: "",
  scopeofinspection: "",
  usersignature: "",
  inspectorsignature: "",
  user_id: null,
};

function HomeForm() {
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
            [groupName]: value,
            ...(noteFieldName && value === 'ถูกต้อง' ? { [noteFieldName]: '' } : {}),
        }));
    };
  
  // Enhanced handleChange to properly handle date fields
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || null // Convert empty string to null for dates
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
    <div className="min-h-screen bg-gray-50 py-8">
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
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-900 mb-1">ชื่อ-นามสกุล/ชื่อผู้ขอใช้ไฟฟ้า:</label>
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
                    currentImageUrl={formData.address_photo_url}
                />
            </div>
            <div>
              <label htmlFor="phasetype" className="block text-sm font-medium text-gray-900 mb-1">ชนิดของระบบไฟฟ้า:</label>
              <select id="phasetype" name="phasetype" value={formData.phasetype || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] bg-white text-gray-900">
                <option value="">เลือกชนิด</option>
                <option value="1_phase">1 เฟส</option>
                <option value="3_phase">3 เฟส</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimatedload" className="block text-sm font-medium text-gray-900 mb-1">ประมาณการโหลด (แอมแปร์):</label>
              <input type="number" step="any" id="estimatedload" name="estimatedload" value={formData.estimatedload || ''} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900" />
            </div>
          </div>
        </section>
        
        {/* 2. Inspection */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-5 text-[#5b2d90]">2. การตรวจสอบ</h2>
            
            {/* 2.1 Cable Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-[#5b2d90] bg-purple-50 p-3 rounded-lg">2.1 สายตัวนำประธานเข้าอาคาร</h3>
              <div className="pl-4 border-l-4 border-purple-300 space-y-6">
                <CorrectiveRadio 
                  groupName="cablestandard_correct" 
                  label="ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502" 
                  currentValue={formData.cablestandard_correct} 
                  currentNote={formData.cablestandard_correct_note} 
                  onStatusChange={handleRadioChange} 
                  onNoteChange={handleChange}
                />
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-900 mb-3">ข) ชนิดและขนาด:</label>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {['IEC 01', 'NYY', 'CV', 'อื่นๆ'].map(type => (
                        <label key={type} className="inline-flex items-center text-gray-900">
                          <input 
                            type="radio" 
                            name="cabletype" 
                            value={type} 
                            checked={formData.cabletype === type} 
                            onChange={handleChange} 
                            className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"
                          />
                          <span className="ml-2">{type}</span>
                        </label>
                      ))}
                    </div>
                    {formData.cabletype === 'อื่นๆ' && (
                      <input 
                        type="text" 
                        name="cableothertype" 
                        value={formData.cableothertype || ''} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900" 
                        placeholder="ระบุชนิดอื่นๆ"
                      />
                    )}
                    <div>
                      <label htmlFor="cablesizesqmm" className="block text-sm font-medium text-gray-900 mb-1">ขนาด (ตร.มม.):</label>
                      <input 
                        type="number" 
                        step="any" 
                        id="cablesizesqmm" 
                        name="cablesizesqmm" 
                        value={formData.cablesizesqmm || ''} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>
                </div>
                
                <CorrectiveRadio 
                  groupName="cabletypesize_correct" 
                  label="ผลการตรวจสอบชนิดและขนาด" 
                  currentValue={formData.cabletypesize_correct} 
                  currentNote={formData.cabletypesize_correct_note} 
                  onStatusChange={handleRadioChange} 
                  onNoteChange={handleChange}
                />
                
                {/* Wiring Method Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-900 mb-3">ค) วิธีการเดินสาย:</label>
                  <div className="space-y-4">
                    <div>
                      <label className="inline-flex items-center text-gray-900">
                        <input 
                          type="checkbox" 
                          name="wiringmethodoverheadchecked" 
                          checked={formData.wiringmethodoverheadchecked || false} 
                          onChange={handleChange} 
                          className="form-checkbox h-5 w-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
                      </label>
                      {formData.wiringmethodoverheadchecked && (
                        <div className="mt-3 pl-6 border-l-2 border-gray-300 space-y-4">
                          <CorrectiveRadio 
                            groupName="overhead_height_correct" 
                            label="1) สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตร ถ้ายานพาหนะลอดผ่าน" 
                            currentValue={formData.overhead_height_correct} 
                            currentNote={formData.overhead_height_correct_note} 
                            onStatusChange={handleRadioChange} 
                            onNoteChange={handleChange}
                          />
                          <CorrectiveRadio 
                            groupName="overhead_neutralmarked_correct" 
                            label="2) สายตัวนำประธานทำเครื่องหมายที่สาย Neutral" 
                            currentValue={formData.overhead_neutralmarked_correct} 
                            currentNote={formData.overhead_neutralmarked_correct_note} 
                            onStatusChange={handleRadioChange} 
                            onNoteChange={handleChange}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="inline-flex items-center text-gray-900">
                        <input 
                          type="checkbox" 
                          name="wiringmethodundergroundchecked" 
                          checked={formData.wiringmethodundergroundchecked || false} 
                          onChange={handleChange} 
                          className="form-checkbox h-5 w-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2">เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                      </label>
                      {formData.wiringmethodundergroundchecked && (
                        <div className="mt-3 pl-6 border-l-2 border-gray-300">
                          <CorrectiveRadio 
                            groupName="underground_neutralmarked_correct" 
                            label="1) สายตัวนำประธานทำเครื่องหมายที่สาย Neutral" 
                            currentValue={formData.underground_neutralmarked_correct} 
                            currentNote={formData.underground_neutralmarked_correct_note} 
                            onStatusChange={handleRadioChange} 
                            onNoteChange={handleChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2.2 Breaker Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-[#5b2d90] bg-purple-50 p-3 rounded-lg">2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)</h3>
              <div className="pl-4 border-l-4 border-purple-300 space-y-6">
                <CorrectiveRadio 
                  groupName="breakerstandard_correct" 
                  label="ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898" 
                  currentValue={formData.breakerstandard_correct} 
                  currentNote={formData.breakerstandard_correct_note} 
                  onStatusChange={handleRadioChange} 
                  onNoteChange={handleChange}
                />
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label htmlFor="breakeramprating" className="block text-sm font-medium text-gray-900 mb-1">ขนาด AT:</label>
                  <input 
                    type="number" 
                    step="any" 
                    id="breakeramprating" 
                    name="breakeramprating" 
                    value={formData.breakeramprating || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                  />
                </div>
                <CorrectiveRadio 
                  groupName="breakermetermatch_correct" 
                  label="ข) เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์" 
                  currentValue={formData.breakermetermatch_correct} 
                  currentNote={formData.breakermetermatch_correct_note} 
                  onStatusChange={handleRadioChange} 
                  onNoteChange={handleChange}
                />
                <CorrectiveRadio 
                  groupName="breakershortcircuitrating_correct" 
                  label="ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)" 
                  currentValue={formData.breakershortcircuitrating_correct} 
                  currentNote={formData.breakershortcircuitrating_correct_note} 
                  onStatusChange={handleRadioChange} 
                  onNoteChange={handleChange}
                />
              </div>
            </div>

            {/* 2.3 Grounding System Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-[#5b2d90] bg-purple-50 p-3 rounded-lg">2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</h3>
              <div className="pl-4 border-l-4 border-purple-300 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label htmlFor="groundwiresizesqmm" className="block text-sm font-medium text-gray-900 mb-1">ขนาดสายต่อหลักดิน (ตร.มม.):</label>
                  <input 
                    type="number" 
                    step="any" 
                    id="groundwiresizesqmm" 
                    name="groundwiresizesqmm" 
                    value={formData.groundwiresizesqmm || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                  />
                </div>
                <CorrectiveRadio 
                  groupName="groundwiresize_correct" 
                  label="ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน" 
                  currentValue={formData.groundwiresize_correct} 
                  currentNote={formData.groundwiresize_correct_note} 
                  onStatusChange={handleRadioChange} 
                  onNoteChange={handleChange}
                />
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label htmlFor="groundresistanceohm" className="block text-sm font-medium text-gray-900 mb-1">ค่าความต้านทานการต่อลงดิน (โอห์ม):</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    id="groundresistanceohm" 
                    name="groundresistanceohm" 
                    value={formData.groundresistanceohm || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900"
                  />
                </div>
                <CorrectiveRadio 
                  groupName="groundresistance_correct" 
                  label="ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม..." 
                  currentValue={formData.groundresistance_correct} 
                  currentNote={formData.groundresistance_correct_note} 
                  onStatusChange={handleRadioChange} 
                  onNoteChange={handleChange}
                />
                <CorrectiveRadio 
                  groupName="onephasegroundconnection_correct" 
                  label="ค) กรณีระบบไฟฟ้า 1 เฟส..." 
                  currentValue={formData.onephasegroundconnection_correct} 
                  currentNote={formData.onephasegroundconnection_correct_note} 
                  onStatusChange={handleRadioChange} 
                  onNoteChange={handleChange}
                />
                <CorrectiveRadio 
                  groupName="threephasegroundconnection_correct" 
                  label="ง) กรณีระบบไฟฟ้า 3 เฟส..." 
                  currentValue={formData.threephasegroundconnection_correct} 
                  currentNote={formData.threephasegroundconnection_correct_note} 
                  onStatusChange={handleRadioChange} 
                  onNoteChange={handleChange}
                />
              </div>
            </div>

            {/* 2.4 RCD Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-[#5b2d90] bg-purple-50 p-3 rounded-lg">2.4 เครื่องตัดไฟรั่ว (RCD)</h3>
              <div className="pl-4 border-l-4 border-purple-300 space-y-4">
                <label className="block text-sm font-medium text-gray-900 mb-1">ติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดพิกัดกระแสรั่ว (I∆n) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง</label>
                <div className="flex flex-wrap gap-4 mt-2">
                    <label className="inline-flex items-center text-gray-900">
                        <input type="radio" name="rcdinstalledoption" value="ถูกต้อง" checked={formData.rcdinstalledoption === 'ถูกต้อง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/>
                        <span className="ml-2">ถูกต้อง</span>
                    </label>
                    <label className="inline-flex items-center text-gray-900">
                        <input type="radio" name="rcdinstalledoption" value="ไม่ประสงค์ติดตั้ง" checked={formData.rcdinstalledoption === 'ไม่ประสงค์ติดตั้ง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"/>
                        <span className="ml-2">ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว...</span>
                    </label>
                </div>
                {formData.rcdinstalledoption === 'ถูกต้อง' && (
                  <div className="mt-4">
                    <CorrectiveRadio 
                      groupName="rcdinstalled_correct" 
                      label="การทำงานของ RCD ถูกต้อง" 
                      currentValue={formData.rcdinstalled_correct} 
                      currentNote={formData.rcdinstalled_correct_note} 
                      onStatusChange={handleRadioChange} 
                      onNoteChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>
        </section>

        {/* --- Sections 3, 4, 5, 6 --- */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">3. กรณีผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ติดตั้งหม้อแปลงไฟฟ้าเพื่อรับไฟแรงสูง</h3>
          <p className="text-sm text-gray-600 mb-3">ให้ตรวจสอบมาตรฐานการติดตั้งระบบไฟฟ้าแรงสูงเพิ่มเติมโดยใช้แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆ นอกเหนือจากที่อยู่อาศัย</p>
        </section>

        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</h3>
          <div className="flex flex-wrap gap-6 mb-4">
            {['ติดตั้งมิเตอร์ถาวร', 'ติดตั้งมิเตอร์ชั่วคราว', 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'].map(option => (
              <label key={option} className="inline-flex items-center text-gray-900">
                <input 
                  type="radio" 
                  name="summaryresult" 
                  value={option} 
                  checked={formData.summaryresult === option} 
                  onChange={handleChange} 
                  className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">5. ขอบเขตและข้อจำกัดในการตรวจสอบ</h3>
          <textarea 
            id="scopeofinspection" 
            name="scopeofinspection" 
            value={formData.scopeofinspection || ''} 
            onChange={handleChange} 
            rows="4" 
            className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#5b2d90] focus:ring-[#5b2d90] text-gray-900"
          />
        </section>

        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
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
            fileName={`inspection-form-${formData.inspectionnumber || 'form'}.pdf`}
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
export default function FormWrapper() {
  return (
    <FormProvider>
      <HomeForm />
    </FormProvider>
  );
}