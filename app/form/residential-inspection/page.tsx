// app/(forms)/residential-inspection/page.tsx
// หน้านี้สำหรับแบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายใน (ที่อยู่อาศัย)
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
// สมมติว่าคุณได้ย้าย CorrectiveRadio และ SignaturePad ไปยังโฟลเดอร์ components
// Assume you have moved CorrectiveRadio and SignaturePad to the components folder
import CorrectiveRadio from "@/components/forms/CorrectiveRadio"; // ปรับ path ตามตำแหน่งจริง
import SignaturePad from "@/components/forms/SignaturePad";       // ปรับ path ตามตำแหน่งจริง

// --- Supabase Configuration ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Define a type for the Supabase client if you have it, otherwise use 'any'
// For a more robust setup, you would typically have a shared Supabase client instance
// import { SupabaseClient } from '@supabase/supabase-js'; // Example if using npm package
type SupabaseClientType = any; // Replace 'any' with actual SupabaseClient type if available


export default function ResidentialInspectionPage() {
  const initialFormData = {
    inspectionNumber: "",
    inspectionDate: "",
    requestNumber: "",
    requestDate: "",
    fullName: "",
    phone: "",
    address: "",
    phaseType: "",
    estimatedLoad: "",
    cableStandard_correct: '',
    cableStandard_note: "",
    cableType: "",
    cableOtherType: "",
    cableSizeSqmm: "",
    cableTypeSize_correct: '',
    cableTypeSize_note: "",
    wiringMethodOverheadChecked: false,
    wiringMethodUndergroundChecked: false,
    overhead_height_correct: '',
    overhead_height_note: "",
    overhead_neutralMarked_correct: '',
    overhead_neutralMarked_note: "",
    underground_neutralMarked_correct: '',
    underground_neutralMarked_note: "",
    breakerStandard_correct: '',
    breakerStandard_note: "",
    breakerMeterMatch_correct: '',
    breakerMeterMatch_note: "",
    breakerAmpRating: "",
    breakerShortCircuitRating_correct: '',
    breakerShortCircuitRating_note: "",
    groundWireSize_correct: '',
    groundWireSize_note: "",
    groundWireSizeSqmm: "",
    groundResistance_correct: '',
    groundResistance_note: "",
    groundResistanceOhm: "",
    onePhaseGroundConnection_correct: '',
    onePhaseGroundConnection_note: "",
    threePhaseGroundConnection_correct: '',
    threePhaseGroundConnection_note: "",
    rcdInstalledOption: '',
    rcdInstalled_correct: '',
    rcdInstalled_note: "",
    summaryResult: "",
    scopeOfInspection: "",
    userSignature: "",
    inspectorSignature: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(''); // For success/error messages
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClientType>(null);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);

  const userSigRef = useRef<any>(null);
  const inspectorSigRef = useRef<any>(null);
  const router = useRouter();

  // Effect for loading Supabase client from CDN
  useEffect(() => {
    let checkSupabaseInterval: NodeJS.Timeout | null = null;
    let scriptRef: HTMLScriptElement | null = null;

    const initializeSupabase = () => {
      if ((window as any).supabase) {
        if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
          try {
            const client = (window as any).supabase.createClient(supabaseUrl, supabaseKey);
            setSupabaseClient(client);
            console.log("Supabase client initialized (Residential Form).");
          } catch (e) {
            console.error("Error initializing Supabase client (Residential Form):", e);
            setMessage('เกิดข้อผิดพลาดในการโหลด Supabase');
          }
        } else {
          console.warn("Supabase URL or Key is not configured (Residential Form).");
          setMessage('Supabase ยังไม่ได้ตั้งค่า กรุณาตรวจสอบ URL และ Key');
        }
        setSupabaseLoaded(true);
        if (checkSupabaseInterval) clearInterval(checkSupabaseInterval);
      }
    };

    if ((window as any).supabase) {
      initializeSupabase();
      return;
    }

    const scriptId = 'supabase-js-cdn-residential';
    scriptRef = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (scriptRef) {
        if ((window as any).supabase) {
            initializeSupabase();
        } else {
            if (scriptRef.onload === null && !scriptRef.dataset.initialized) {
                scriptRef.onload = initializeSupabase;
                scriptRef.dataset.initialized = "true";
            } else if (!(window as any).supabase) {
                 checkSupabaseInterval = setInterval(initializeSupabase, 100);
            }
        }
        return () => {
            if (checkSupabaseInterval) clearInterval(checkSupabaseInterval);
        };
    }

    scriptRef = document.createElement('script');
    scriptRef.id = scriptId;
    scriptRef.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    scriptRef.async = true;
    scriptRef.dataset.initialized = "true";

    scriptRef.onload = initializeSupabase;

    scriptRef.onerror = () => {
      console.error("Error loading Supabase script from CDN (Residential Form).");
      setSupabaseLoaded(true);
      setMessage('เกิดข้อผิดพลาดในการโหลด Supabase จาก CDN');
    };

    document.head.appendChild(scriptRef);

    return () => {
      if (checkSupabaseInterval) clearInterval(checkSupabaseInterval);
    };
  }, []);


  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData(prev => ({
      ...prev,
      inspectionDate: formattedDate,
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleRadioChange = (groupName: string, value: string, noteFieldName: string) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: value,
      ...(value === 'ถูกต้อง' && noteFieldName && { [noteFieldName]: '' }),
    }));
  };

  const handleSignatureSave = (fieldName: string, dataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: dataUrl,
    }));
  };

  const handleSignatureClear = (fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    if (!supabaseLoaded) {
        setMessage("Supabase library กำลังโหลด กรุณารอสักครู่แล้วลองอีกครั้ง");
        setIsSubmitting(false);
        return;
    }
    if (!supabaseClient) {
      setMessage('Supabase client ยังไม่พร้อมใช้งาน กรุณาตรวจสอบการตั้งค่า');
      setIsSubmitting(false);
      return;
    }

    let dataToSubmit = { ...formData };

    if (userSigRef.current && typeof userSigRef.current.toDataURL === 'function') {
        dataToSubmit.userSignature = userSigRef.current.toDataURL('image/png');
    }
    if (inspectorSigRef.current && typeof inspectorSigRef.current.toDataURL === 'function') {
        dataToSubmit.inspectorSignature = inspectorSigRef.current.toDataURL('image/png');
    }

    console.log("Submitting Residential Form Data:", dataToSubmit);
    const tableName = 'residential_inspection_forms';

    try {
      const { data, error } = await supabaseClient
        .from(tableName)
        .insert([dataToSubmit])
        .select();

      if (error) {
        console.error('Error saving to Supabase:', error);
        setMessage(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
      } else {
        console.log('Data saved to Supabase:', data);
        setMessage('ข้อมูลถูกบันทึกเรียบร้อยแล้ว!');
        setFormData(initialFormData);
        if (userSigRef.current && typeof userSigRef.current.clear === 'function') {
          userSigRef.current.clear();
        }
        if (inspectorSigRef.current && typeof inspectorSigRef.current.clear === 'function') {
          inspectorSigRef.current.clear();
        }
      }
    } catch (err:any) {
      console.error('An unexpected error occurred:', err);
      setMessage(err.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h1 className="text-3xl font-bold text-[#3a1a5b] mb-8 text-center">
          แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายใน (ที่อยู่อาศัย)
        </h1>

        {/* Header Information */}
        <section className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-[#5b2d90] mb-4">ข้อมูลทั่วไปของการตรวจสอบ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="inspectionNumber" className="block text-sm font-medium text-gray-700 mb-1">
                เลขที่บันทึกตรวจสอบ:
              </label>
              <input
                type="text"
                id="inspectionNumber"
                name="inspectionNumber"
                value={formData.inspectionNumber}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
              />
            </div>
            <div>
              <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-700 mb-1">
                วันที่ตรวจสอบ: <span className="text-xs text-gray-500">(อัตโนมัติ)</span>
              </label>
              <input
                type="date"
                id="inspectionDate"
                name="inspectionDate"
                value={formData.inspectionDate}
                onChange={handleChange}
                readOnly
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="requestNumber" className="block text-sm font-medium text-gray-700 mb-1">
                เลขที่คำร้องขอใช้ไฟฟ้า:
              </label>
              <input
                type="text"
                id="requestNumber"
                name="requestNumber"
                value={formData.requestNumber}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
              />
            </div>
            <div>
              <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700 mb-1">
                วันที่ยื่นคำร้อง:
              </label>
              <input
                type="date"
                id="requestDate"
                name="requestDate"
                value={formData.requestDate}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
              />
            </div>
          </div>
        </section>

        {/* 1. ข้อมูลทั่วไป (General Information) */}
        <section className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-[#5b2d90] mb-4">1. ข้อมูลทั่วไปของผู้ขอใช้ไฟฟ้า</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ-นามสกุล/ชื่อผู้ขอใช้ไฟฟ้า:
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                โทรศัพท์:
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่:
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
              ></textarea>
            </div>
            <div>
              <label htmlFor="phaseType" className="block text-sm font-medium text-gray-700 mb-1">
                ชนิดของระบบไฟฟ้า:
              </label>
              <select
                id="phaseType"
                name="phaseType"
                value={formData.phaseType}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] bg-white"
              >
                <option value="">เลือกชนิด</option>
                <option value="1_phase">1 เฟส</option>
                <option value="3_phase">3 เฟส</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimatedLoad" className="block text-sm font-medium text-gray-700 mb-1">
                ประมาณการโหลด (kW):
              </label>
              <input
                type="number"
                id="estimatedLoad"
                name="estimatedLoad"
                value={formData.estimatedLoad}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
              />
            </div>
          </div>
        </section>

        {/* 2. การตรวจสอบ */}
        <section className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-[#5b2d90] mb-4">2. การตรวจสอบ</h2>

          {/* 2.1 สายตัวนำประธานเข้าอาคาร */}
          <h3 className="text-lg font-semibold text-[#3a1a5b] mb-3">2.1 สายตัวนำประธานเข้าอาคาร</h3>
          <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
            <CorrectiveRadio
              groupName="cableStandard_correct"
              label="ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502"
              currentValue={formData.cableStandard_correct}
              currentNote={formData.cableStandard_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ข) ชนิดและขนาด:
              </label>
              <div className="flex flex-wrap gap-4 mt-2 mb-2">
                <label className="inline-flex items-center">
                  <input type="radio" name="cableType" value="IEC 01" checked={formData.cableType === 'IEC 01'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                  <span className="ml-2">IEC 01</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="cableType" value="NYY" checked={formData.cableType === 'NYY'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                  <span className="ml-2">NYY</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="cableType" value="CV" checked={formData.cableType === 'CV'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                  <span className="ml-2">CV</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="cableType" value="อื่นๆ" checked={formData.cableType === 'อื่นๆ'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                  <span className="ml-2">อื่นๆ</span>
                </label>
                {formData.cableType === 'อื่นๆ' && (
                  <input type="text" name="cableOtherType" value={formData.cableOtherType} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ"/>
                )}
              </div>
              <label htmlFor="cableSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
                ขนาด (ตร.มม.):
              </label>
              <input type="number" id="cableSizeSqmm" name="cableSizeSqmm" value={formData.cableSizeSqmm} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"/>
              <CorrectiveRadio
                groupName="cableTypeSize_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.cableTypeSize_correct}
                currentNote={formData.cableTypeSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค) วิธีการเดินสาย:
              </label>
              <div className="mt-2 space-y-4">
                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" name="wiringMethodOverheadChecked" checked={formData.wiringMethodOverheadChecked} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"/>
                    <span className="ml-2">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
                  </label>
                  {formData.wiringMethodOverheadChecked && (
                    <div className="mt-2 pl-6 border-l-2 border-gray-200 ml-2 space-y-3">
                      <CorrectiveRadio groupName="overhead_height_correct" label="1) สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตร ถ้ายานพาหนะลอดผ่าน" currentValue={formData.overhead_height_correct} currentNote={formData.overhead_height_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
                      <CorrectiveRadio groupName="overhead_neutralMarked_correct" label="2) สายตัวนำประธานทำเครื่องหมายที่สาย Neutral" currentValue={formData.overhead_neutralMarked_correct} currentNote={formData.overhead_neutralMarked_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
                    </div>
                  )}
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" name="wiringMethodUndergroundChecked" checked={formData.wiringMethodUndergroundChecked} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"/>
                    <span className="ml-2">เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                  </label>
                  {formData.wiringMethodUndergroundChecked && (
                    <div className="mt-2 pl-6 border-l-2 border-gray-200 ml-2">
                      <CorrectiveRadio groupName="underground_neutralMarked_correct" label="1) สายตัวนำประธานทำเครื่องหมายที่สาย Neutral" currentValue={formData.underground_neutralMarked_correct} currentNote={formData.underground_neutralMarked_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ */}
          <h3 className="text-lg font-semibold text-[#3a1a5b] mb-3">2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)</h3>
          <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
            <CorrectiveRadio groupName="breakerStandard_correct" label="ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898" currentValue={formData.breakerStandard_correct} currentNote={formData.breakerStandard_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            <div className="border-b border-gray-200 pb-4">
              <label htmlFor="breakerAmpRating" className="block text-sm font-medium text-gray-700 mb-1">ขนาด AT:</label>
              <input type="number" id="breakerAmpRating" name="breakerAmpRating" value={formData.breakerAmpRating} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"/>
            </div>
            <CorrectiveRadio groupName="breakerMeterMatch_correct" label="ข) เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์" currentValue={formData.breakerMeterMatch_correct} currentNote={formData.breakerMeterMatch_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            <CorrectiveRadio groupName="breakerShortCircuitRating_correct" label="ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)" currentValue={formData.breakerShortCircuitRating_correct} currentNote={formData.breakerShortCircuitRating_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
          </div>

          {/* 2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์ */}
          <h3 className="text-lg font-semibold text-[#3a1a5b] mb-3">2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</h3>
          <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <label htmlFor="groundWireSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">ขนาดสายต่อหลักดิน (ตร.มม.):</label>
              <input type="number" id="groundWireSizeSqmm" name="groundWireSizeSqmm" value={formData.groundWireSizeSqmm} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"/>
            </div>
            <CorrectiveRadio groupName="groundWireSize_correct" label="ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน" currentValue={formData.groundWireSize_correct} currentNote={formData.groundWireSize_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            <div className="border-b border-gray-200 pb-4">
              <label htmlFor="groundResistanceOhm" className="block text-sm font-medium text-gray-700 mb-1">ค่าความต้านทานการต่อลงดิน (โอห์ม):</label>
              <input type="number" step="0.01" id="groundResistanceOhm" name="groundResistanceOhm" value={formData.groundResistanceOhm} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"/>
            </div>
            <CorrectiveRadio groupName="groundResistance_correct" label="ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากในการปฏิบัติและการไฟฟ้าส่วนภูมิภาคเห็นชอบ ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีก 1 แท่ง" currentValue={formData.groundResistance_correct} currentNote={formData.groundResistance_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            <CorrectiveRadio groupName="onePhaseGroundConnection_correct" label="ค) กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสาย Neutral (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่ กฟภ. กำหนด" currentValue={formData.onePhaseGroundConnection_correct} currentNote={formData.onePhaseGroundConnection_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            <CorrectiveRadio groupName="threePhaseGroundConnection_correct" label="ง) กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสาย Neutral (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่ กฟภ. กำหนด" currentValue={formData.threePhaseGroundConnection_correct} currentNote={formData.threePhaseGroundConnection_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
          </div>

          {/* 2.4 เครื่องตัดไฟรั่ว (RCD) */}
          <h3 className="text-lg font-semibold text-[#3a1a5b] mb-3">2.4 เครื่องตัดไฟรั่ว (RCD)</h3>
          <div className="mb-6 pl-4 border-l-4 border-purple-300 space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดพิกัดกระแสรั่ว (I∆n) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="inline-flex items-center">
                <input type="radio" name="rcdInstalledOption" value="ถูกต้อง" checked={formData.rcdInstalledOption === 'ถูกต้อง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                <span className="ml-2">ถูกต้อง</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="rcdInstalledOption" value="ไม่ประสงค์ติดตั้ง" checked={formData.rcdInstalledOption === 'ไม่ประสงค์ติดตั้ง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                <span className="ml-2">ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว และผู้ตรวจสอบมาตรฐานได้แจ้งให้ผู้ขอใช้ไฟฟ้าหรือผู้แทนทราบถึงความเสี่ยงจากการไม่ติดตั้งเครื่องตัดไฟรั่วแล้ว</span>
              </label>
            </div>
            {formData.rcdInstalledOption === 'ถูกต้อง' && (
              <div className="mt-4">
                <CorrectiveRadio groupName="rcdInstalled_correct" label="การทำงานของ RCD ถูกต้อง" currentValue={formData.rcdInstalled_correct} currentNote={formData.rcdInstalled_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
              </div>
            )}
          </div>
        </section>

        {/* 3. กรณีผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัย... */}
        <section className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-[#5b2d90] mb-2">
            3. กรณีผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ติดตั้งหม้อแปลงไฟฟ้าเพื่อรับไฟแรงสูง
          </h3>
          <p className="text-sm text-gray-600">
            ให้ตรวจสอบมาตรฐานการติดตั้งระบบไฟฟ้าแรงสูงเพิ่มเติมโดยใช้แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆ นอกเหนือจากที่อยู่อาศัย
          </p>
        </section>

        {/* 4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า */}
        <section className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</h3>
          <div className="flex flex-wrap gap-6 mb-4">
            <label className="inline-flex items-center">
              <input type="radio" name="summaryResult" value="ติดตั้งมิเตอร์ถาวร" checked={formData.summaryResult === 'ติดตั้งมิเตอร์ถาวร'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
              <span className="ml-2">ติดตั้งมิเตอร์ถาวร</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="summaryResult" value="ติดตั้งมิเตอร์ชั่วคราว" checked={formData.summaryResult === 'ติดตั้งมิเตอร์ชั่วคราว'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
              <span className="ml-2">ติดตั้งมิเตอร์ชั่วคราว</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="summaryResult" value="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" checked={formData.summaryResult === 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
              <span className="ml-2">ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์</span>
            </label>
          </div>
        </section>

        {/* 5. ขอบเขตและข้อจำกัดในการตรวจสอบ */}
        <section className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">5. ขอบเขตและข้อจำกัดในการตรวจสอบ</h3>
          <textarea
            id="scopeOfInspection"
            name="scopeOfInspection"
            value={formData.scopeOfInspection}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
          ></textarea>
        </section>

        {/* 6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ (Signatures) */}
        <section className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</h3>
          <div className="text-gray-600 text-sm mb-6 space-y-3">
            <p>6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนสิ่งก่อสร้างอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงอยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว</p>
            <p>6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหลัง หรืออุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
            <p>6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
            <p>6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SignaturePad
              title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน"
              ref={userSigRef}
              onSave={(dataUrl: string) => handleSignatureSave('userSignature', dataUrl)}
              onClear={() => handleSignatureClear('userSignature')}
            />
            <SignaturePad
              title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค"
              ref={inspectorSigRef}
              onSave={(dataUrl: string) => handleSignatureSave('inspectorSignature', dataUrl)}
              onClear={() => handleSignatureClear('inspectorSignature')}
            />
          </div>
        </section>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={isSubmitting || !supabaseLoaded || !supabaseClient}
            className={`px-8 py-4 bg-[#5b2d90] text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#3a1a5b] focus:outline-none focus:ring-4 focus:ring-[#a78bfa] focus:ring-offset-2 transition duration-300 ease-in-out ${
              (isSubmitting || !supabaseLoaded || !supabaseClient) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'บันทึกข้อมูล'}
          </button>
        </div>
        {(!supabaseClient && supabaseLoaded && (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY')) && (
          <p className="text-center text-red-500 mt-4">
            Supabase ยังไม่ได้ตั้งค่า กรุณาอัปเดต Supabase URL และ Key ในโค้ด
          </p>
        )}
      </form>
    </div>
  );
}
