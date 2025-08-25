"use client";

import { Suspense } from 'react';
import React, { useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InspectionPDF from '@/components/pdf/EvChargerHvFormPDF';
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';
import { useFormManager } from "@/lib/hooks/useFormManager";
import { FormProvider } from '@/lib/contexts/FormContext';

const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), {
  ssr: false
});

// --- ค่าเริ่มต้นของข้อมูลในฟอร์ม ---
const initialFormData = {
  id: null,
  user_id: null,

  // Header Info
  peaoffice: "",
  inspectioncount: "",
  inspectiondate: new Date().toISOString().split('T')[0],
  requestnumber: "",
  requestdate: "",

  // 1. General Information
  usertype: "", // "individual" or "juristic"
  individualname: "",
  individualphone: "",
  juristicname: "",
  juristicphone: "",
  address: "",
  latitude: "",
  longitude: "",
  phasetype: "",
  estimatedload: "",
  address_photo_url: "",
  totalloadamp: "",
  numchargers: "",
  totalchargerpowerkw: "",

  // 2.1 Document Checklist - Individual
  docspecevcharger: false,
  docsinglelinediagram: false,
  docloadschedule: false,
  docindividualcomplete: null,
  docindividual_note: "",

  // 2.2 Document Checklist - Public
  docpublicsinglelinediagram: false,
  docpublicasbuiltdrawing: false,
  docpublicloadschedule: false,
  docpublicengineerlicense: false,
  docpublicspecevcharger: false,
  docpublicnotificationorlicense: false,
  docpubliccomplete: null,
  docpublicnote: "",

  // 3. High Voltage Distribution System
  // 3.1 Overhead Distribution System
  overheadcabletype: "",
  overheadcabletype_correct: '',
  overheadcabletype_correct_note: "",
  overheadcablesizesqmm: "",
  overheadcablesize_correct: '',
  overheadcablesize_correct_note: "",
  polecondition_correct: '',
  polecondition_correct_note: "",
  poleheadassembly_correct: '',
  poleheadassembly_correct_note: "",
  guywireassembly_correct: '',
  guywireassembly_correct_note: "",
  insulatorcondition_correct: '',
  insulatorcondition_correct_note: "",
  cablespancondition_correct: '',
  cablespancondition_correct_note: "",
  cableclearance_correct: '',
  cableclearance_correct_note: "",
  hvsurgearrester_correct: '',
  hvsurgearrester_correct_note: "",
  jointcondition_correct: '',
  jointcondition_correct_note: "",
  groundingoverhead_correct: '',
  groundingoverhead_correct_note: "",

  // 3.2 Underground Distribution System
  undergroundcabletype: "",
  undergroundcabletype_correct: '',
  undergroundcabletype_correct_note: "",
  undergroundcablesizesqmm: "",
  undergroundcablesize_correct: '',
  undergroundcablesize_correct_note: "",
  visiblecablecondition_correct: '',
  visiblecablecondition_correct_note: "",
  cabletension_correct: '',
  cabletension_correct_note: "",
  hvsurgearresterunderground_correct: '',
  hvsurgearresterunderground_correct_note: "",
  jointconditionunderground_correct: '',
  jointconditionunderground_correct_note: "",
  groundingunderground_correct: '',
  groundingunderground_correct_note: "",

  // 3.3 Upstream Disconnecting Device
  disconnectingdevicetype: [], // Changed to array for multiple selections
  disconnectingdeviceswitchtype: "", // for switch-disconnect
  disconnectingdevicermu: "",
  disconnectingdevice_correct: '',
  disconnectingdevice_correct_note: "",

  // 3.4 Others
  otherhvnotes: "",

  // 4. Transformer
  transformerteststatus: "", // "pass" or "fail"
  transformernum: "",
  transformersizekva: "",
  hvvoltageratingkv: "",
  lvvoltageratingv: "",
  impedancepercent: "",
  transformertype: "", // "Oil", "Dry", "Other"
  transformerothertype: "",
  vectorgroup: "",
  shortcircuitratingka: "",
  transformerproperty_correct: '',
  transformerproperty_correct_note: "",

  // 4.2 Installation Type
  installationtype: [], // Array of selected types
  installationtypeother: "",
  installationtype_correct: '',
  installationtype_correct_note: "",

  // 4.3 Overcurrent Protection (Input Side)
  overcurrentprotectiontype: "", // "dropout-fuse-cutout", "circuit-breaker", "other"
  overcurrentprotectionothertype: "",
  continuouscurrentratinga: "",
  interruptingcapacityka: "",
  overcurrentprotection_correct: '',
  overcurrentprotection_correct_note: "",

  // 4.4 HV Surge Arrester Installation
  hvsurgearrestertransformer_correct: '',
  hvsurgearrestertransformer_correct_note: "",
  hvsurgearrestervoltagaratingkv: "",
  hvsurgearrestercurrentratingka: "",

  // 4.5 Transformer Body & HV Surge Arrester Grounding
  transformergrounding_correct: '',
  transformergrounding_correct_note: "",

  // 4.6 HV Ground Resistance
  hvgroundresistanceohm: "",
  hvgroundresistance_correct: '',
  hvgroundresistance_correct_note: "",

  // 4.7 Transformer External Condition (Oil Type Only)
  desiccant_correct: '',
  desiccant_correct_note: "",
  bushingcondition_correct: '',
  bushingcondition_correct_note: "",
  oillevel_correct: '',
  oillevel_correct_note: "",
  oilleakage_correct: '',
  oilleakage_correct_note: "",

  // 4.8 Warning Sign
  warningsign_correct: '',
  warningsign_correct_note: "",

  // 4.9 Others
  othertransformernotes: "",

  // 5. Low Voltage System
  // 5.1 LV Main Circuit
  maincablestandard: "", // "มอก. 11-2553", "มอก. 293-2541", "IEC 60502"
  maincablestandard_correct: '',
  maincablestandard_correct_note: "",
  maincabletype: "", // "IEC01", "NYY", "CV", "Other"
  maincabletypeother: "",
  maincabletype_correct: '',
  maincabletype_correct_note: "",
  mainphasecablesizesqmm: "", // Phase cable size
  mainphasecablesize_correct: '',
  mainphasecablesize_correct_note: "",
  mainneutralcablesizesqmm: "", // Neutral cable size
  mainneutralcablesize_correct: '',
  mainneutralcablesize_correct_note: "",
  phasemarking_correct: '',
  phasemarking_correct_note: "",
  conduitcontinuity_correct: '',
  conduitcontinuity_correct_note: "",

  // 5.1.7 Wiring Method
  wiringmethod: [], // Array of selected methods
  wiringmethodother: "",
  wiringmethod_correct: '',
  wiringmethod_correct_note: "",

  // 5.1.8 Conduit Type
  conduitmetaltype: [], // Array of selected metal types
  conduitnonmetaltype: [], // Array of selected non-metal types
  conduitothertype: "",
  conduittype_correct: '',
  conduittype_correct_note: "",

  // 5.2 Main Switchboard Overcurrent Protection
  mainbreakerstandard_correct: '',
  mainbreakerstandard_correct_note: "",
  mainbreakeramprating: "",
  mainbreakeramprating_correct: '',
  mainbreakeramprating_correct_note: "",
  mainbreakericratingka: "",
  mainbreakericrating_correct: '',
  mainbreakericrating_correct_note: "",
  gfpinstalled: false, // Checkbox for GFP
  gfp_correct: '', // For GFP if it's correct/fix
  gfp_correct_note: "",

  // 5.3 Main Switchboard Grounding System
  groundconductorsizesqmm: "",
  groundconductorsize_correct: '',
  groundconductorsize_correct_note: "",
  groundingonephase_correct: '', // for 1 phase system
  groundingonephase_correct_note: "",
  groundingthreephase_correct: '', // for 3 phase system
  groundingthreephase_correct_note: "",

  // 5.4 Grounding Type at Main Switchboard
  groundingform: "", // "TN-C-S", "TT", "TT-partial", "TN-S"

  // 5.4.1 TN-C-S Full System
  tncsloadbalanceok: false,
  tncsloadbalancenote: "",
  tncsneutralprotectionok: false,
  tncsneutralprotectionnote: "",
  tncstouchvoltageprotectionok: false,
  tncstouchvoltageprotectionnote: "",
  tncsoverall_correct: '',
  tncsoverall_correct_note: "",

  // 5.4.2 TT Full System
  ttrcdinstalled: false,
  ttrcd_correct: '',
  ttrcd_correct_note: "",

  // 5.4.3 TT Partial System
  ttpriskassessmentok: false,
  ttpriskassessment_note: "",
  ttpgroundroddistanceok: false,
  ttpgroundroddistance_note: "",
  ttpwarningsignok: false,
  ttpwarningsign_note: "",
  ttpneutralprotectionok: false,
  ttpneutralprotection_note: "",
  ttptncsgroundresistanceok: false,
  ttptncsgroundresistance_note: "",
  ttpoverall_correct: '',
  ttpoverall_correct_note: "",

  // 5.4.4 TN-S Full System
  tnsgroundresistanceok: false,
  tnsgroundresistance_note: "",
  tnsoverall_correct: '',
  tnsoverall_correct_note: "",

  // 5.5 Feeder Circuit / Panel board (if any)
  // 5.5.1 Feeder Circuit
  feedercablestandard: "",
  feedercablestandard_correct: '',
  feedercablestandard_correct_note: "",
  feedercabletype: "",
  feedercabletypeother: "",
  feedercabletype_correct: '',
  feedercabletype_correct_note: "",
  feederphasecablesizesqmm: "",
  feederphasecablesize_correct: '',
  feederphasecablesize_correct_note: "",
  feederneutralcablesizesqmm: "",
  feederneutralcablesize_correct: '',
  feederneutralcablesize_correct_note: "",
  feedergroundcablesizesqmm: "",
  feedergroundcablesize_correct: '',
  feedergroundcablesize_correct_note: "",
  feederphasemarking_correct: '',
  feederphasemarking_correct_note: "",
  feederconduitcontinuity_correct: '',
  feederconduitcontinuity_correct_note: "",

  // 5.5.2 Wiring Method (Feeder)
  feederwiringmethod: [],
  feederwiringmethodother: "",
  feederwiringmethod_correct: '',
  feederwiringmethod_correct_note: "",

  // 5.5.3 Conduit Type (Feeder)
  feederconduitmetaltype: [],
  feederconduitnonmetaltype: [],
  feederconduitflexiblemetaltype: false,
  feederconduitothertype: "",
  feederconduittype_correct: '',
  feederconduittype_correct_note: "",

  // 5.5.4 Feeder Circuit Breaker
  feederbreakerstandard_correct: '',
  feederbreakerstandard_correct_note: "",
  feederbreakeramprating: "",
  feederbreakeramprating_correct: '',
  feederbreakeramprating_correct_note: "",

  // 5.5.5 Panel Board Installation
  panelboardratingok: false,
  panelboardrating_note: "",
  panelboardgroundneutralseparationok: false,
  panelboardgroundneutralseparation_note: "",

  // Summary and Signatures
  summaryresult: "",
  scopeofinspection: "",
  usersignature: "",
  inspectorsignature: "",
};

function EVChargerHVInspectionFormContent() {
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
  } = useFormManager('ev_charger_hv_inspection_forms', initialFormData, [], '*', 'form-images');

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
    
  // Enhanced checkbox handling for array fields
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const arrayFields = [
      'installationtype', 'wiringmethod', 'conduitmetaltype', 'conduitnonmetaltype',
      'feederwiringmethod', 'feederconduitmetaltype', 'feederconduitnonmetaltype',
      'disconnectingdevicetype' // Added disconnectingdevicetype to array fields
    ];
    
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
      <form onSubmit={handleFormSubmit} id="pea-ev-charger-hv-inspection-form" className="space-y-8 max-w-6xl mx-auto p-4 md:p-8">
        <style jsx global>{`
          .sigCanvas { touch-action: none; }
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
          input[type=number] { -moz-appearance: textfield; }
        `}</style>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            สำหรับผู้ใช้ไฟฟ้าที่รับไฟฟ้าแรงสูงโดยติดตั้งหม้อแปลงเฉพาะราย
          </p>
        </div>

        {/* Header Info */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
          <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">ข้อมูลการตรวจสอบ</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">การไฟฟ้า</label>
              <input
                type="text"
                name="peaoffice"
                value={formData.peaoffice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">การตรวจสอบครั้งที่</label>
              <input
                type="text"
                name="inspectioncount"
                value={formData.inspectioncount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="inspection_date" className="block text-sm font-medium text-gray-900 mb-1">วันที่ตรวจสอบ: <span className="text-xs text-gray-500">(อัตโนมัติ)</span></label>
              <input 
                type="date" 
                id="inspection_date" 
                name="inspection_date" 
                value={formData.inspection_date} 
                onChange={handleChange} 
                readOnly 
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] bg-gray-100 text-gray-700" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">เลขที่คำร้องขอใช้ไฟ</label>
              <input
                type="text"
                name="requestnumber"
                value={formData.requestnumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">วันที่คำร้อง</label>
              <input
                type="date"
                name="requestdate"
                value={formData.requestdate || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                required
              />
            </div>
          </div>
        </div>

        {/* 1. General Information */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
          <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">1. ข้อมูลทั่วไป</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ประเภทผู้ขอใช้ไฟฟ้า</label>
              <div className="flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="usertype"
                    value="individual"
                    checked={formData.usertype === "individual"}
                    onChange={handleChange}
                    className="text-[#5b2d90]"
                  />
                  <span className="text-sm font-medium text-gray-700 ml-2">ชื่อ-นามสกุล ผู้ขอใช้ไฟฟ้า</span>
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="usertype"
                    value="juristic"
                    checked={formData.usertype === "juristic"}
                    onChange={handleChange}
                    className="text-[#5b2d90]"
                  />
                  <span className="text-sm font-medium text-gray-700 ml-2">ชื่อนิติบุคคล ที่ขอใช้ไฟฟ้า</span>
                </label>
              </div>
            </div>

            {formData.usertype === "individual" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    name="individualname"
                    value={formData.individualname || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                  />
                  <label className="block text-sm font-medium text-gray-700">โทรศัพท์</label>
                  <input
                    type="text"
                    name="individualphone"
                    value={formData.individualphone || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
              </div>
            )}

            {formData.usertype === "juristic" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ชื่อนิติบุคคล</label>
                  <input
                    type="text"
                    name="juristicname"
                    value={formData.juristicname || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">โทรศัพท์</label>
                  <input
                    type="text"
                    name="juristicphone"
                    value={formData.juristicphone || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
              <textarea
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md min-h-[80px] text-gray-700"
              ></textarea>
            </div>

             {/* Map Section */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-inner">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-xl">🗺️</span>
                ค้นหาและปักหมุดที่อยู่
              </h3>
              <p className="text-sm text-gray-600 mb-4">ค้นหาหรือลากแผนที่เพื่อเลือกตำแหน่ง จากนั้นพิกัดจะแสดงด้านล่าง</p>
              <div className="relative z-0 h-80 rounded-xl overflow-hidden shadow-lg border-2 border-white"> 
                <OpenStreetMapComponent 
                  onLocationSelect={handleLocationSelect} 
                  initialLatitude={formData.latitude}
                  initialLongitude={formData.longitude}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/70 backdrop-blur p-3 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">ละติจูด:</span>
                  <div className="font-mono text-gray-800 bg-gray-100 p-2 rounded mt-1">{formData.latitude || 'N/A'}</div>
                </div>
                <div className="bg-white/70 backdrop-blur p-3 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">ลองจิจูด:</span>
                  <div className="font-mono text-gray-800 bg-gray-100 p-2 rounded mt-1">{formData.longitude || 'N/A'}</div>
                </div>
              </div>
            </div>
            {/* Image Upload */}
                       <div className="md:col-span-2">
                         <ImageUpload 
                           ref={imageUploadRef}
                           onImageSelected={handleImageUpload} 
                           disabled={isSubmitting}
                           initialImageUrl={formData.address_photo_url}
                         />
                       </div>
                       
                       <div className="space-y-2">
                         <label htmlFor="phasetype" className="block text-sm font-semibold text-gray-700">ชนิดของระบบไฟฟ้า:</label>
                         <select 
                           id="phasetype" 
                           name="phasetype" 
                           value={formData.phasetype || ''} 
                           onChange={handleChange} 
                           className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-700 shadow-sm bg-white"
                         >
                           <option value="">เลือกชนิด</option>
                           <option value="1_phase">1 เฟส</option>
                           <option value="3_phase">3 เฟส</option>
                         </select>
                       </div>
                       <div className="space-y-2">
                         <label htmlFor="estimatedload" className="block text-sm font-semibold text-gray-700">ประมาณการโหลด (แอมแปร์):</label>
                         <input 
                           type="number" 
                           step="any" 
                           id="estimatedload" 
                           name="estimatedload" 
                           value={formData.estimatedload || ''} 
                           onChange={handleChange} 
                           className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-700 shadow-sm" 
                           placeholder="กรอกค่าโหลด"
                         />
                       </div>
                     </div>
                   </section>

        {/* 2. Document Checklist */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
          <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">2. เอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า</h3>

          {/* 2.1 Individual Case */}
          <div className="mb-6 pl-4 border-l-4 border-purple-400">

            <h4 className="text-lg font-semibold mb-2 text-gray-700">
              2.1 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่ส่วนบุคคล
            </h4>
            <div className="space-y-2 mb-4">
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="docspecevcharger"
                  checked={formData.docspecevcharger}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="docsinglelinediagram"
                  checked={formData.docsinglelinediagram}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">แผนผังระบบไฟฟ้า (Single Line Diagram)</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="docloadschedule"
                  checked={formData.docloadschedule}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า</span>
              </label>
            </div>
            <div className="flex gap-4 items-center">
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="docindividualcomplete"
                  value={true}
                  checked={formData.docindividualcomplete === true}
                  onChange={() => handleRadioChange("docindividualcomplete", true, "docindividual_note")}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ครบถ้วน</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="docindividualcomplete"
                  value={false}
                  checked={formData.docindividualcomplete === false}
                  onChange={() => handleRadioChange("docindividualcomplete", false, "docindividual_note")}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ไม่ครบถ้วน</span>
              </label>
            </div>
            {formData.docindividualcomplete === false && (
              <textarea
                name="docindividual_note"
                value={formData.docindividual_note}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-2 min-h-[60px] text-gray-700"
                placeholder="ระบุรายละเอียดที่ไม่ครบถ้วน"
              ></textarea>
            )}
          </div>

          {/* 2.2 Public Case */}
          <div className="mb-6 pl-4 border-l-4 border-purple-400">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">
              2.2 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่สาธารณะ
            </h4>
            <div className="space-y-2 mb-4">
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="docpublicsinglelinediagram"
                  checked={formData.docpublicsinglelinediagram}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">แผนผังระบบไฟฟ้า (Single Line Diagram) ระบุพิกัด</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="docpublicasbuiltdrawing"
                  checked={formData.docpublicasbuiltdrawing}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">แบบติดตั้งระบบไฟฟ้า (As-built Drawing)</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="docpublicloadschedule"
                  checked={formData.docpublicloadschedule}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="docpublicengineerlicense"
                  checked={formData.docpublicengineerlicense}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรมไฟฟ้า</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="docpublicspecevcharger"
                  checked={formData.docpublicspecevcharger}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="docpublicnotificationorlicense"
                  checked={formData.docpublicnotificationorlicense}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">หนังสือจดแจ้ง (พิกัดน้อยกว่า 1,000 kVA) หรือใบอนุญาต</span>
              </label>
            </div>
            <div className="flex gap-4 items-center">
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="docpubliccomplete"
                  value={true}
                  checked={formData.docpubliccomplete === true}
                  onChange={() => handleRadioChange("docpubliccomplete", true, "docpublicnote")}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ครบถ้วน</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="docpubliccomplete"
                  value={false}
                  checked={formData.docpubliccomplete === false}
                  onChange={() => handleRadioChange("docpubliccomplete", false, "docpublicnote")}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ไม่ครบถ้วน</span>
              </label>
            </div>
            {formData.docpubliccomplete === false && (
              <textarea
                name="docpublicnote"
                value={formData.docpublicnote}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-2 min-h-[100px] text-gray-700"
                placeholder="ระบุรายละเอียดที่ไม่ครบถ้วน"
              ></textarea>
            )}
          </div>

          <div className="text-sm text-gray-600 mt-4">
            <p>การตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าอ้างอิงแบบมาตรฐาน ดังนี้</p>
            <ul className="list-disc list-inside ml-4">
              <li>ก) แบบมาตรฐาน “ข้อกำหนดทั่วไปสำหรับการติดตั้งทางไฟฟ้า ระบบอัดประจุยานยนต์ไฟฟ้า” (การประกอบเลขที่ 9807)</li>
              <li>ข) แบบมาตรฐาน “การติดตั้งทางไฟฟ้าการอัดประจุยานยนต์ไฟฟ้าระบบ 1 เฟส สำหรับผู้ใช้ไฟประเภทที่อยู่อาศัยและธุรกิจขนาดเล็ก” (การประกอบเลขที่ 0901)</li>
              <li>ค) แบบมาตรฐาน “การติดตั้งทางไฟฟ้าการอัดประจุยานยนต์ไฟฟ้าระบบ 3 เฟส สำหรับผู้ใช้ไฟประเภทที่อยู่อาศัยและธุรกิจขนาดเล็ก” (การประกอบเลขที่ 0902)</li>
              <li>ง) แบบมาตรฐาน “การติดตั้งทางไฟฟ้าสถานีอัดประจุยานยนต์ไฟฟ้า สำหรับสถานประกอบการ” (การประกอบเลขที่ 0903)</li>
              <li>จ) มาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับล่าสุด)</li>
            </ul>
            <p className="mt-2">* ดาวน์โหลดแบบมาตรฐานและข้อมูลที่เกี่ยวข้องที่ลิงค์หรือ QR Code นี้ <a href="https://qrgo.page.link/ijtvD" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://qrgo.page.link/ijtvD</a></p>
          </div>
        </div>

        {/* 3. High Voltage Distribution System */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
          <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">3. ระบบจำหน่ายแรงสูง</h3>

          {/* 3.1 Overhead Distribution System */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">3.1 ระบบจำหน่ายเหนือดิน</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
            <CorrectiveRadio
              groupName="overheadcabletype_correct"
              label="3.1.1 ชนิดสายตัวนำ..............................เหมาะสมกับพื้นที่และสภาพแวดล้อม"
              currentValue={formData.overheadcabletype_correct}
              currentNote={formData.overheadcabletype_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <input
              type="text"
              name="overheadcabletype"
              value={formData.overheadcabletype}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              placeholder="ชนิดสายตัวนำ"
            />

            <CorrectiveRadio
              groupName="overheadcablesize_correct"
              label="3.1.2 ขนาดสายตัวนำ............................ตร.มม."
              currentValue={formData.overheadcablesize_correct}
              currentNote={formData.overheadcablesize_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <input
              type="text"
              name="overheadcablesizesqmm"
              value={formData.overheadcablesizesqmm}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              placeholder="ขนาดสายตัวนำ (ตร.มม.)"
            />

            <CorrectiveRadio
              groupName="polecondition_correct"
              label="3.1.3 สภาพเสาและระยะห่างระหว่างเสา"
              currentValue={formData.polecondition_correct}
              currentNote={formData.polecondition_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="poleheadassembly_correct"
              label="3.1.4 การประกอบอุปกรณ์หัวเสา"
              currentValue={formData.poleheadassembly_correct}
              currentNote={formData.poleheadassembly_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="guywireassembly_correct"
              label="3.1.5 การประกอบชุดยึดโยง"
              currentValue={formData.guywireassembly_correct}
              currentNote={formData.guywireassembly_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="insulatorcondition_correct"
              label="3.1.6 ลูกถ้วยและฉนวนของอุปกรณ์ไฟฟ้าเหมาะสมกับสภาพแวดล้อม"
              currentValue={formData.insulatorcondition_correct}
              currentNote={formData.insulatorcondition_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="cablespancondition_correct"
              label="3.1.7 การพาดสาย (สภาพสาย, ระยะหย่อนยาน)"
              currentValue={formData.cablespancondition_correct}
              currentNote={formData.cablespancondition_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="cableclearance_correct"
              label="3.1.8 ระยะห่างของสายกับอาคาร สิ่งก่อสร้าง หรือต้นไม้"
              currentValue={formData.cableclearance_correct}
              currentNote={formData.cableclearance_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="hvsurgearrester_correct"
              label="3.1.9 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)"
              currentValue={formData.hvsurgearrester_correct}
              currentNote={formData.hvsurgearrester_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="jointcondition_correct"
              label="3.1.10 สภาพของจุดต่อสาย"
              currentValue={formData.jointcondition_correct}
              currentNote={formData.jointcondition_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="groundingoverhead_correct"
              label="3.1.11 การต่อลงดิน"
              currentValue={formData.groundingoverhead_correct}
              currentNote={formData.groundingoverhead_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* 3.2 Underground Distribution System */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">3.2 ระบบจำหน่ายใต้ดิน</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
            <CorrectiveRadio
              groupName="undergroundcabletype_correct"
              label="3.2.1 ชนิดสายตัวนำ..............................เหมาะสมกับพื้นที่และสภาพแวดล้อม"
              currentValue={formData.undergroundcabletype_correct}
              currentNote={formData.undergroundcabletype_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <input
              type="text"
              name="undergroundcabletype"
              value={formData.undergroundcabletype}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              placeholder="ชนิดสายตัวนำ"
            />

            <CorrectiveRadio
              groupName="undergroundcablesize_correct"
              label="3.2.2 ขนาดสายตัวนำ............................ตร.มม."
              currentValue={formData.undergroundcablesize_correct}
              currentNote={formData.undergroundcablesize_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <input
              type="text"
              name="undergroundcablesizesqmm"
              value={formData.undergroundcablesizesqmm}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              placeholder="ขนาดสายตัวนำ (ตร.มม.)"
            />

            <CorrectiveRadio
              groupName="visiblecablecondition_correct"
              label="3.2.3 สภาพสายส่วนที่มองเห็นได้"
              currentValue={formData.visiblecablecondition_correct}
              currentNote={formData.visiblecablecondition_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="cabletension_correct"
              label="3.2.4 ความตึงของสายช่วงเข้า-ออก อาคารหรือสิ่งก่อสร้าง"
              currentValue={formData.cabletension_correct}
              currentNote={formData.cabletension_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="hvsurgearresterunderground_correct"
              label="3.2.5 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)"
              currentValue={formData.hvsurgearresterunderground_correct}
              currentNote={formData.hvsurgearresterunderground_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="jointconditionunderground_correct"
              label="3.2.6 สภาพของจุดต่อสาย"
              currentValue={formData.jointconditionunderground_correct}
              currentNote={formData.jointconditionunderground_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="groundingunderground_correct"
              label="3.2.7 การต่อลงดิน"
              currentValue={formData.groundingunderground_correct}
              currentNote={formData.groundingunderground_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* 3.3 Upstream Disconnecting Device */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">3.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                <input 
                  type="checkbox" 
                  name="disconnectingdevicetype" 
                  value="ดรอพเอาท์ฟิวส์คัตเอาท์" 
                  checked={Array.isArray(formData.disconnectingdevicetype) && formData.disconnectingdevicetype.includes("ดรอพเอาท์ฟิวส์คัตเอาท์")} 
                  onChange={handleCheckboxChange} 
                  className="text-[#5b2d90]" 
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
              </label>
              {Array.isArray(formData.disconnectingdevicetype) && formData.disconnectingdevicetype.includes("สวิตช์ตัดตอน") ? (
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="disconnectingdevicetype" 
                    value="สวิตช์ตัดตอน" 
                    checked={true}
                    onChange={handleCheckboxChange} 
                    className="text-[#5b2d90]" 
                  />
                  <span className="text-sm font-medium text-gray-700">สวิตช์ตัดตอน ชนิด</span>
                  <input
                    type="text"
                    name="disconnectingdeviceswitchtype"
                    value={formData.disconnectingdeviceswitchtype}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md text-gray-700 ml-2"
                    placeholder="ระบุชนิด"
                  />
                </label>
              ) : (
                <label className="block text-sm font-medium text-gray-700">
                  <input 
                    type="checkbox" 
                    name="disconnectingdevicetype" 
                    value="สวิตช์ตัดตอน" 
                    checked={false}
                    onChange={handleCheckboxChange} 
                    className="text-[#5b2d90]" 
                  />
                  <span className="text-sm font-medium text-gray-700 ml-2">สวิตช์ตัดตอน ชนิด</span>
                </label>
              )}
              <label className="block text-sm font-medium text-gray-700">
                <input 
                  type="checkbox" 
                  name="disconnectingdevicetype" 
                  value="RMU" 
                  checked={Array.isArray(formData.disconnectingdevicetype) && formData.disconnectingdevicetype.includes("RMU")} 
                  onChange={handleCheckboxChange} 
                  className="text-[#5b2d90]" 
                />
                <span className="text-sm font-medium text-gray-700 ml-2">RMU (ไม่รวมถึงฟังก์ชันการทำงาน)</span>
              </label>
            </div>
            <CorrectiveRadio
              groupName="disconnectingdevice_correct"
              label="สถานะการติดตั้งเครื่องปลดวงจรต้นทาง"
              currentValue={formData.disconnectingdevice_correct}
              currentNote={formData.disconnectingdevice_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* 3.4 Others */}
          <div className="mb-6 pl-4 border-l-4 border-purple-400">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.4 อื่นๆ</h4>
            <textarea
              name="otherhvnotes"
              value={formData.otherhvnotes}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md min-h-[80px] text-gray-700"
            ></textarea>
          </div>
        </div>

        {/* 4. Transformer */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
          <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">4. หม้อแปลง</h3>

          {/* 4.1 Transformer General Properties */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">4.1 คุณสมบัติทั่วไปของหม้อแปลง</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
            <div className="flex gap-4 items-center">
              <label className="block text-sm font-medium text-gray-700">ผ่านการทดสอบ:</label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="transformerteststatus" value="pass" checked={formData.transformerteststatus === "pass"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">ผ่านการทดสอบ</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="transformerteststatus" value="fail" checked={formData.transformerteststatus === "fail"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">ไม่ผ่านการทดสอบ</span>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">หม้อแปลงเครื่องที่</label>
                <input type="text" name="transformernum" value={formData.transformernum} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ขนาด (kVA)</label>
                <input type="number" name="transformersizekva" value={formData.transformersizekva} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">พิกัดแรงดันด้านแรงสูง (kV)</label>
                <input type="text" name="hvvoltageratingkv" value={formData.hvvoltageratingkv} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">พิกัดแรงดันด้านแรงต่ำ (V)</label>
                <input type="text" name="lvvoltageratingv" value={formData.lvvoltageratingv} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">% Impedance</label>
                <input type="text" name="impedancepercent" value={formData.impedancepercent} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ชนิด</label>
                <div className="flex gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <input type="radio" name="transformertype" value="Oil" checked={formData.transformertype === "Oil"} onChange={handleChange} className="text-[#5b2d90]" />
                    <span className="text-sm font-medium text-gray-700 ml-2">Oil</span>
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    <input type="radio" name="transformertype" value="Dry" checked={formData.transformertype === "Dry"} onChange={handleChange} className="text-[#5b2d90]" />
                    <span className="text-sm font-medium text-gray-700 ml-2">Dry</span>
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    <input type="radio" name="transformertype" value="Other" checked={formData.transformertype === "Other"} onChange={handleChange} className="text-[#5b2d90]" />
                    <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
                  </label>
                  {formData.transformertype === "Other" && (
                    <input type="text" name="transformerothertype" value={formData.transformerothertype} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ระบุ" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vector Group</label>
                <input type="text" name="vectorgroup" value={formData.vectorgroup} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">พิกัดการทนกระแสลัดวงจรสูงสุด (kA)</label>
                <input type="text" name="shortcircuitratingka" value={formData.shortcircuitratingka} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
              </div>
            </div>
            <CorrectiveRadio
              groupName="transformerproperty_correct"
              label="คุณสมบัติหม้อแปลง"
              currentValue={formData.transformerproperty_correct}
              currentNote={formData.transformerproperty_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* 4.2 Installation Type */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">4.2 ลักษณะการติดตั้ง</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
            <div className="flex flex-wrap gap-4">
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="installationtype" value="แขวน" checked={Array.isArray(formData.installationtype) && formData.installationtype.includes("แขวน")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">แขวน</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="installationtype" value="นั่งร้าน" checked={Array.isArray(formData.installationtype) && formData.installationtype.includes("นั่งร้าน")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">นั่งร้าน</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="installationtype" value="ตั้งพื้น" checked={Array.isArray(formData.installationtype) && formData.installationtype.includes("ตั้งพื้น")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">ตั้งพื้น</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="installationtype" value="ตั้งบนดาดฟ้า" checked={Array.isArray(formData.installationtype) && formData.installationtype.includes("ตั้งบนดาดฟ้า")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">ตั้งบนดาดฟ้า</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="installationtype" value="ห้องหม้อแปลง" checked={Array.isArray(formData.installationtype) && formData.installationtype.includes("ห้องหม้อแปลง")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">ห้องหม้อแปลง</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="installationtype" value="อื่นๆ" checked={Array.isArray(formData.installationtype) && formData.installationtype.includes("อื่นๆ")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
              </label>
              {Array.isArray(formData.installationtype) && formData.installationtype.includes("อื่นๆ") && (
                <input type="text" name="installationtypeother" value={formData.installationtypeother} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ระบุ" />
              )}
            </div>
            <CorrectiveRadio
              groupName="installationtype_correct"
              label="สถานะการติดตั้ง"
              currentValue={formData.installationtype_correct}
              currentNote={formData.installationtype_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* 4.3 Overcurrent Protection (Input Side) */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">4.3 เครื่องป้องกันกระแสเกินด้านไฟเข้า</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
            <CorrectiveRadio
              groupName="overcurrentprotection_correct"
              label="สถานะเครื่องป้องกันกระแสเกิน"
              currentValue={formData.overcurrentprotection_correct}
              currentNote={formData.overcurrentprotection_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="overcurrentprotectiontype" value="ดรอพเอาท์ฟิวส์คัตเอาท์" checked={formData.overcurrentprotectiontype === "ดรอพเอาท์ฟิวส์คัตเอาท์"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="overcurrentprotectiontype" value="เซอร์กิตเบรกเกอร์" checked={formData.overcurrentprotectiontype === "เซอร์กิตเบรกเกอร์"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">เซอร์กิตเบรกเกอร์</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="overcurrentprotectiontype" value="อื่นๆ" checked={formData.overcurrentprotectiontype === "อื่นๆ"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
              </label>
              {formData.overcurrentprotectiontype === "อื่นๆ" && (
                <input type="text" name="overcurrentprotectionothertype" value={formData.overcurrentprotectionothertype} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ระบุ" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">พิกัดกระแสต่อเนื่อง (A)</label>
              <input type="text" name="continuouscurrentratinga" value={formData.continuouscurrentratinga} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">พิกัดตัดกระแสลัดวงจรสูงสุด (IC) (kA)</label>
              <input type="text" name="interruptingcapacityka" value={formData.interruptingcapacityka} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
            </div>
          </div>

          {/* 4.4 HV Surge Arrester Installation */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">4.4 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
            <CorrectiveRadio
              groupName="hvsurgearrestertransformer_correct"
              label="สถานะการติดตั้ง HV Surge Arrester"
              currentValue={formData.hvsurgearrestertransformer_correct}
              currentNote={formData.hvsurgearrestertransformer_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">พิกัดแรงดัน (kV)</label>
              <input type="text" name="hvvoltageratingkv" value={formData.hvvoltageratingkv} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">พิกัดกระแส (kA)</label>
              <input type="text" name="hvsurgearrestercurrentratingka" value={formData.hvsurgearrestercurrentratingka} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" />
            </div>
          </div>

          {/* 4.5 Transformer Body & HV Surge Arrester Grounding */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">4.5 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400">
            <CorrectiveRadio
              groupName="transformergrounding_correct"
              label="สถานะการประกอบสายดิน"
              currentValue={formData.transformergrounding_correct}
              currentNote={formData.transformergrounding_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* 4.6 HV Ground Resistance */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">4.6 ค่าความต้านทานดินของระบบแรงสูง</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400">
            <input
              type="text"
              name="hvgroundresistanceohm"
              value={formData.hvgroundresistanceohm}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              placeholder="ค่าความต้านทาน (โอห์ม)"
            />
            <p className="text-sm text-gray-600 mt-2">* ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม</p>
            <CorrectiveRadio
              groupName="hvgroundresistance_correct"
              label="สถานะค่าความต้านทานดิน"
              currentValue={formData.hvgroundresistance_correct}
              currentNote={formData.hvgroundresistance_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* 4.7 Transformer External Condition (Oil Type Only) */}
          {formData.transformertype === "Oil" && (
            <>
              <h4 className="text-lg font-semibold mb-2 text-gray-700">4.7 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)</h4>
              <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
                <CorrectiveRadio
                  groupName="desiccant_correct"
                  label="4.7.1 สารดูดความชื้น"
                  currentValue={formData.desiccant_correct}
                  currentNote={formData.desiccant_correct_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <CorrectiveRadio
                  groupName="bushingcondition_correct"
                  label="4.7.2 สภาพบุชชิ่ง"
                  currentValue={formData.bushingcondition_correct}
                  currentNote={formData.bushingcondition_correct_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <CorrectiveRadio
                  groupName="oillevel_correct"
                  label="4.7.3 ระดับน้ำมัน"
                  currentValue={formData.oillevel_correct}
                  currentNote={formData.oillevel_correct_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <CorrectiveRadio
                  groupName="oilleakage_correct"
                  label="4.7.4 การรั่วซึมของน้ำมันหม้อแปลง"
                  currentValue={formData.oilleakage_correct}
                  currentNote={formData.oilleakage_correct_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
            </>
          )}

          {/* 4.8 Warning Sign */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">4.8 ป้ายเตือน</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400">
            <CorrectiveRadio
              groupName="warningsign_correct"
              label="ป้ายเตือน: อันตรายไฟฟ้าแรงสูง เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น"
              currentValue={formData.warningsign_correct}
              currentNote={formData.warningsign_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>

          {/* 4.9 Others */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">4.9 อื่นๆ</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400">
            <textarea
              name="othertransformernotes"
              value={formData.othertransformernotes}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md min-h-[80px] text-gray-700"
            ></textarea>
          </div>
        </div>

        {/* 5. Low Voltage System */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
          <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">5. ระบบไฟฟ้าแรงต่ำ</h3>

          {/* 5.1 LV Main Circuit */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">5.1 วงจรประธานแรงต่ำ</h4>
          <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
            {/* 5.1.1 Main Cable Standard */}
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="maincablestandard" value="มอก. 11-2553" checked={formData.maincablestandard === "มอก. 11-2553"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">มอก. 11-2553</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="maincablestandard" value="มอก. 293-2541" checked={formData.maincablestandard === "มอก. 293-2541"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">มอก. 293-2541</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="maincablestandard" value="IEC 60502" checked={formData.maincablestandard === "IEC 60502"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">IEC 60502</span>
              </label>
            </div>
            <CorrectiveRadio
              groupName="maincablestandard_correct"
              label="5.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน"
              currentValue={formData.maincablestandard_correct}
              currentNote={formData.maincablestandard_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 5.1.2 Main Cable Type */}
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="maincabletype" value="IEC01" checked={formData.maincabletype === "IEC01"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">IEC01</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="maincabletype" value="NYY" checked={formData.maincabletype === "NYY"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">NYY</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="maincabletype" value="CV" checked={formData.maincabletype === "CV"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">CV</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="radio" name="maincabletype" value="อื่นๆ" checked={formData.maincabletype === "อื่นๆ"} onChange={handleChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
              </label>
              {formData.maincabletype === "อื่นๆ" && (
                <input type="text" name="maincabletypeother" value={formData.maincabletypeother} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ระบุ" />
              )}
            </div>
            <CorrectiveRadio
              groupName="maincabletype_correct"
              label="5.1.2 ชนิดสายตัวนำ"
              currentValue={formData.maincabletype_correct}
              currentNote={formData.maincabletype_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 5.1.3 Main Phase Cable Size */}
            <h4 className="text-md font-semibold mb-2 text-gray-700">5.1.3 ขนาดสายเฟส......................ตร.มม.</h4>
            <input
              type="text"
              name="mainphasecablesizesqmm"
              value={formData.mainphasecablesizesqmm}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              placeholder="ขนาดสายเฟส (ตร.มม.)"
            />
            <CorrectiveRadio
              groupName="mainphasecablesize_correct"
              label="5.1.3 ขนาดสายเฟส"
              currentValue={formData.mainphasecablesize_correct}
              currentNote={formData.mainphasecablesize_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 5.1.4 Main Neutral Cable Size */}
              <h4 className="text-md font-semibold mb-2 text-gray-700">5.1.4 ขนาดสายนิวทรัล......................ตร.มม.</h4>
            <input
              type="text"
              name="mainneutralcablesizesqmm"
              value={formData.mainneutralcablesizesqmm}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              placeholder="ขนาดสายนิวทรัล (ตร.มม.)"
            />
            <CorrectiveRadio
              groupName="mainneutralcablesize_correct"
              label="5.1.4 ขนาดสายนิวทรัล"
              currentValue={formData.mainneutralcablesize_correct}
              currentNote={formData.mainneutralcablesize_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 5.1.5 Phase Marking */}
            <CorrectiveRadio
              groupName="phasemarking_correct"
              label="5.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ"
              currentValue={formData.phasemarking_correct}
              currentNote={formData.phasemarking_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 5.1.6 Conduit Continuity */}
            <CorrectiveRadio
              groupName="conduitcontinuity_correct"
              label="5.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ"
              currentValue={formData.conduitcontinuity_correct}
              currentNote={formData.conduitcontinuity_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 5.1.7 Wiring Method */}
            <h4 className="text-md font-semibold mb-2">5.1.7 วิธีการเดินสาย</h4>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="wiringmethod" value="เดินสายบนลูกถ้วยฉนวนในอากาศ" checked={Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("เดินสายบนลูกถ้วยฉนวนในอากาศ")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="wiringmethod" value="เดินบนรางเคเบิล" checked={Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("เดินบนรางเคเบิล")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">เดินบนรางเคเบิล (Cable Tray)</span>
              </label>
              {Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("เดินบนรางเคเบิล") && (
                <>
                  <input type="text" name="wiringmethodCableTraySizeW" value={formData.wiringmethodCableTraySizeW} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="กว้าง (มม.)" />
                  <input type="text" name="wiringmethodCableTraySizeH" value={formData.wiringmethodCableTraySizeH} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="สูง (มม.)" />
                </>
              )}
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="wiringmethod" value="เดินสายฝังดินโดยตรง" checked={Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("เดินสายฝังดินโดยตรง")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="wiringmethod" value="เดินสายร้อยท่อฝังดิน" checked={Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("เดินสายร้อยท่อฝังดิน")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
              </label>
              {Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("เดินสายร้อยท่อฝังดิน") && (
                <input type="text" name="wiringmethodConduitUndergroundSize" value={formData.wiringmethodConduitUndergroundSize} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ขนาดท่อ (นิ้ว)" />
              )}
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="wiringmethod" value="เดินร้อยท่อเกาะผนัง" checked={Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("เดินร้อยท่อเกาะผนัง")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">เดินร้อยท่อเกาะผนัง</span>
              </label>
              {Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("เดินร้อยท่อเกาะผนัง") && (
                <input type="text" name="wiringmethodConduitWallSize" value={formData.wiringmethodConduitWallSize} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ขนาดท่อ (นิ้ว)" />
              )}
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="wiringmethod" value="อื่นๆ" checked={Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("อื่นๆ")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
              </label>
              {Array.isArray(formData.wiringmethod) && formData.wiringmethod.includes("อื่นๆ") && (
                <input type="text" name="wiringmethodOther" value={formData.wiringmethodOther} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ระบุ" />
              )}
            </div>
            <CorrectiveRadio
              groupName="wiringmethod_correct"
              label="สถานะวิธีการเดินสาย"
              currentValue={formData.wiringmethod_correct}
              currentNote={formData.wiringmethod_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 5.1.8 Conduit Type */}
            <h4 className="text-md font-semibold mb-2">5.1.8 ประเภทท่อร้อยสาย</h4>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="font-medium text-gray-700">ท่อโลหะ:</span>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="conduitmetaltype" value="หนา (RMC)" checked={Array.isArray(formData.conduitmetaltype) && formData.conduitmetaltype.includes("หนา (RMC)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">หนา (RMC)</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="conduitmetaltype" value="หนาปานกลาง (IMC)" checked={Array.isArray(formData.conduitmetaltype) && formData.conduitmetaltype.includes("หนาปานกลาง (IMC)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">หนาปานกลาง (IMC)</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="conduitmetaltype" value="บาง (EMT)" checked={Array.isArray(formData.conduitmetaltype) && formData.conduitmetaltype.includes("บาง (EMT)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">บาง (EMT)</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="font-medium text-gray-700">ท่ออโลหะ:</span>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="conduitnonmetaltype" value="แข็ง (RNC)" checked={Array.isArray(formData.conduitnonmetaltype) && formData.conduitnonmetaltype.includes("แข็ง (RNC)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">แข็ง (RNC)</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="conduitnonmetaltype" value="อ่อน (ENT)" checked={Array.isArray(formData.conduitnonmetaltype) && formData.conduitnonmetaltype.includes("อ่อน (ENT)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">อ่อน (ENT)</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="conduitnonmetaltype" value="ท่อโลหะอ่อน (Flexible Metal Conduit)" checked={Array.isArray(formData.conduitnonmetaltype) && formData.conduitnonmetaltype.includes("ท่อโลหะอ่อน (Flexible Metal Conduit)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="conduitnonmetaltype" value="อื่นๆ" checked={Array.isArray(formData.conduitnonmetaltype) && formData.conduitnonmetaltype.includes("อื่นๆ")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
              </label>
              {Array.isArray(formData.conduitnonmetaltype) && formData.conduitnonmetaltype.includes("อื่นๆ") && (
                <input type="text" name="conduitnonmetaltypeNote" value={formData.conduitnonmetaltypeNote} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ระบุ" />
              )}
            </div>
            <CorrectiveRadio
              groupName="conduittype_correct"
              label="สถานะประเภทท่อร้อยสาย"
              currentValue={formData.conduittype_correct}
              currentNote={formData.conduittype_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>
        </div>

        {/* 5.2 Main Switchboard Overcurrent Protection */}
        <h4 className="text-lg font-semibold mb-2 text-gray-700">5.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)</h4>
        <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
          <CorrectiveRadio
            groupName="mainbreakerstandard_correct"
            label="5.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2"
            currentValue={formData.mainbreakerstandard_correct}
            currentNote={formData.mainbreakerstandard_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <CorrectiveRadio
            groupName="mainbreakeramprating_correct"
            label="5.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด AT…….……แอมแปร์ (A) สอดคล้องกับพิกัดกระแสสายตัวนำประธาน"
            currentValue={formData.mainbreakeramprating_correct}
            currentNote={formData.mainbreakeramprating_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <CorrectiveRadio
            groupName="mainbreakericrating_correct"
            label="5.2.3 พิกัดทนกระแสลัดวงจร (Ic)…….….………..กิโลแอมแปร์ (kA)"
            currentValue={formData.mainbreakericrating_correct}
            currentNote={formData.mainbreakericrating_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />

          <div className="border-b border-gray-200 pb-4 mb-4">
            <label className="block text-sm font-medium text-gray-700">5.2.4 กรณีเมนเซอร์กิตเบรกเกอร์มีขนาดตั้งแต่ 1,000 แอมแปร์ ขึ้นไป ต้องติดตั้ง Ground Fault Protection (GFP)</label>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="gfpinstalled"
                  checked={formData.gfpinstalled}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ติดตั้ง</span>
              </label>
            </div>
            {formData.gfpinstalled && (
              <CorrectiveRadio
                groupName="gfp_correct"
                label="สถานะ GFP"
                currentValue={formData.gfp_correct}
                currentNote={formData.gfp_correct_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            )}
          </div>
        </div>

        {/* 5.3 Main Switchboard Grounding System */}
        <h4 className="text-lg font-semibold mb-2 text-gray-700">5.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</h4>
        <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
          <CorrectiveRadio
            groupName="groundconductorsize_correct"
            label="5.3.1 สายต่อหลักดิน (ตัวนำทองแดง) ขนาด.......................ตร.มม. สอดคล้องกับขนาดสายตัวนำประธาน ตามตารางที่ 1 ในหน้าที่ 7"
            currentValue={formData.groundconductorsize_correct}
            currentNote={formData.groundconductorsize_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <input
            type="text"
            name="groundconductorsizesqmm"
            value={formData.groundconductorsizesqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
            placeholder="ขนาดสายต่อหลักดิน (ตร.มม.)"
          />

          <h4 className="text-md font-semibold mb-2">5.3.2 การต่อลงดินที่แผงเมนสวิตช์</h4>
          <CorrectiveRadio
            groupName="groundingonephase_correct"
            label="กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด"
            currentValue={formData.groundingonephase_correct}
            currentNote={formData.groundingonephase_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <CorrectiveRadio
            groupName="groundingthreephase_correct"
            label="กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด"
            currentValue={formData.groundingthreephase_correct}
            currentNote={formData.groundingthreephase_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
        </div>

        {/* 5.4 Grounding Type at Main Switchboard */}
        <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">5.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งรูปแบบ)</h3>
        <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="groundingform" value="TN-C-S" checked={formData.groundingform === "TN-C-S"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">TN-C-S ทั้งระบบ</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="groundingform" value="TT" checked={formData.groundingform === "TT"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">TT ทั้งระบบ</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="groundingform" value="TT-partial" checked={formData.groundingform === "TT-partial"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">TT บางส่วน (ต้นทางเป็น TN-C-S และ โหลดเป็น TT)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="groundingform" value="TN-S" checked={formData.groundingform === "TN-S"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">TN-S ทั้งระบบ</span>
            </label>
          </div>

          {/* Conditional rendering based on groundingForm */}
          {formData.groundingform === "TN-C-S" && (
            <div className="space-y-4 mt-4 p-4 border rounded-md bg-white">
              <h4 className="text-lg font-semibold mb-2 text-gray-700">5.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องมีมาตรการอย่างใดอย่างหนึ่ง)</h4>
              <CorrectiveRadio
                groupName="tncsOverallStatus"
                label="ภาพรวม TN-C-S"
                currentValue={formData.tncsOverallStatus}
                currentNote={formData.tncsOverallNote}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="tncsLoadBalanceOk"
                  checked={formData.tncsLoadBalanceOk}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">มีการจัดโหลดไฟฟ้า 3 เฟส ให้สมดุลอย่างเพียงพอ โดยให้มีโหลดต่างกันระหว่างเฟสได้ไม่เกิน 20 แอมแปร์ รวมทั้งค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="tncsNeutralProtectionOk"
                  checked={formData.tncsNeutralProtectionOk}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">มีมาตรการป้องกันไม่ให้สายนิวทรัลจากหม้อแปลงไฟฟ้าไปยังบริภัณฑ์ประธานชำรุดหรือเสียหาย โดยติดตั้งสายไฟฟ้าในรางเคเบิล บัสเวย์ (หรือบัสดัก) หรือช่องเดินสายเท่านั้น</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="tncsTouchVoltageProtectionOk"
                  checked={formData.tncsTouchVoltageProtectionOk}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครงบริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัดประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดินออกพร้อมกันภายในเวลา 5 วินาที</span>
              </label>
            </div>
          )}

          {formData.groundingform === "TT" && (
            <div className="space-y-4 mt-4 p-4 border rounded-md bg-white">
              <h4 className="text-lg font-semibold mb-2 text-gray-700">5.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ</h4>
              <CorrectiveRadio
                groupName="ttrcdStatus"
                label="ต้องติดตั้งเครื่องตัดไฟรั่ว (RCD) ทุกวงจรไฟฟ้าที่จ่ายไฟ หรือทุกเครื่องใช้ไฟฟ้า ไม่ว่าจะเกี่ยวข้องกับการอัดประจุยานยนต์ไฟฟ้าหรือไม่ก็ตาม"
                currentValue={formData.ttrcdStatus}
                currentNote={formData.ttrcdNote}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
          )}

          {formData.groundingform === "TT-partial" && (
            <div className="space-y-4 mt-4 p-4 border rounded-md bg-white">
              <h4 className="text-lg font-semibold mb-2 text-gray-700">5.4.3 กรณีต่อลงดินแบบ TT บางส่วน (ต้องดำเนินการครบทุกข้อ ก) – จ) )</h4>
              <CorrectiveRadio
                groupName="ttpOverallStatus"
                label="ภาพรวม TT บางส่วน"
                currentValue={formData.ttpOverallStatus}
                currentNote={formData.ttpOverallNote}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="ttpRiskAssessmentOk"
                  checked={formData.ttpRiskAssessmentOk}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ก) มีการประเมินความเสี่ยงก่อนว่า ไม่มีโอกาสที่บุคคลจะสัมผัสโครงบริภัณฑ์ไฟฟ้าอื่นที่ต่อลงดินแบบ TN-C-S กับโครงบริภัณฑ์จ่ายไฟยานยนต์ไฟฟ้า หรือโครงยานยนต์ไฟฟ้าที่ต่อลงดินแบบ TT โดยพร้อมกัน หรือมีระยะห่างไม่น้อยกว่า 2.50 เมตร สามารถใช้การห่อหุ้มหรือกั้นได้</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="ttpGroundRodDistanceOk"
                  checked={formData.ttpGroundRodDistanceOk}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ข) ระยะห่างระหว่างหลักดินของระบบ TN-C-S กับระบบ TT ต้องห่างกันอย่างน้อย 2.00 เมตร</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="ttpWarningSignOk"
                  checked={formData.ttpWarningSignOk}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ค) มีการติดตั้งป้ายแสดงข้อความเตือนบริเวณเครื่องอัดประจุยานยนต์ไฟฟ้าตามที่การไฟฟ้าส่วนภูมิภาคกำหนด</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="ttpNeutralProtectionOk"
                  checked={formData.ttpNeutralProtectionOk}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ง) มีมาตรการป้องกันไม่ให้สายนิวทรัลจากหม้อแปลงไฟฟ้าไปยังบริภัณฑ์ประธานชำรุดหรือเสียหาย โดยติดตั้งสายไฟฟ้าในรางเคเบิล บัสเวย์ (หรือบัสดัก) หรือช่องเดินสายเท่านั้น</span>
              </label>
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="ttpTncsGroundResistanceOk"
                  checked={formData.ttpTncsGroundResistanceOk}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">จ) ค่าความต้านทานการต่อลงดินแบบ TN-C-S ต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้อง ไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม</span>
              </label>
            </div>
          )}

          {formData.groundingform === "TN-S" && (
            <div className="space-y-4 mt-4 p-4 border rounded-md bg-white">
              <h4 className="text-lg font-semibold mb-2 text-gray-700">5.4.4 กรณีต่อลงดินแบบ TN-S ทั้งระบบ</h4>
              <CorrectiveRadio
                groupName="tnsOverallStatus"
                label="ภาพรวม TN-S"
                currentValue={formData.tnsOverallStatus}
                currentNote={formData.tnsOverallNote}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <label className="block text-gray-700">
                <input
                  type="checkbox"
                  name="tnsGroundResistanceOk"
                  checked={formData.tnsGroundResistanceOk}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม</span>
              </label>
            </div>
          )}
        </div>

        {/* 5.5 Feeder Circuit / Panel board (if any) */}
        <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">5.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board) (ถ้ามี)</h3>
        <div className="mb-6 pl-4 border-l-4 border-purple-400 space-y-4">
          {/* 5.5.1 Feeder Circuit */}
          <h4 className="text-lg font-semibold mb-2 text-gray-700">5.5.1 วงจรสายป้อน</h4>
          <CorrectiveRadio
            groupName="feedercablestandard_correct"
            label="ก) สายป้อนเป็นไปตามมาตรฐาน"
            currentValue={formData.feedercablestandard_correct}
            currentNote={formData.feedercablestandard_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feedercablestandard" value="มอก. 11-2553" checked={formData.feedercablestandard === "มอก. 11-2553"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">มอก. 11-2553</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feedercablestandard" value="มอก. 293-2541" checked={formData.feedercablestandard === "มอก. 293-2541"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">มอก. 293-2541</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feedercablestandard" value="IEC 60502" checked={formData.feedercablestandard === "IEC 60502"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">IEC 60502</span>
            </label>
          </div>
          

          <CorrectiveRadio
            groupName="feedercabletype_correct"
            label="ข) ชนิดสายตัวนำ"
            currentValue={formData.feedercabletype_correct}
            currentNote={formData.feedercabletype_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feedercabletype" value="IEC01" checked={formData.feedercabletype === "IEC01"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">IEC01</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feedercabletype" value="NYY" checked={formData.feedercabletype === "NYY"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">NYY</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feedercabletype" value="CV" checked={formData.feedercabletype === "CV"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">CV</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feedercabletype" value="อื่นๆ" checked={formData.feedercabletype === "อื่นๆ"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
            </label>
            {formData.feedercabletype === "อื่นๆ" && (
              <input type="text" name="feedercabletypeother" value={formData.feedercabletypeother} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ระบุ" />
            )}
          </div>

          <CorrectiveRadio
            groupName="feederphasecablesize_correct"
            label="ค) ขนาดสายเฟส..........................ตร.มม. (พิกัดกระแสสายป้อนต้องไม่น้อยกว่าขนาดปรับตั้งของเซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน และขนาดสายป้อนต้องไม่เล็กกว่า 4 ตร.มม.)"
            currentValue={formData.feederphasecablesize_correct}
            currentNote={formData.feederphasecablesize_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <input
            type="text"
            name="feederphasecablesizesqmm"
            value={formData.feederphasecablesizesqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
            placeholder="ขนาดสายเฟส (ตร.มม.)"
          />

          <CorrectiveRadio
            groupName="feederneutralcablesize_correct"
            label="ง) ขนาดสายนิวทรัล......................ตร.มม."
            currentValue={formData.feederneutralcablesize_correct}
            currentNote={formData.feederneutralcablesize_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <input
            type="text"
            name="feederneutralcablesizesqmm"
            value={formData.feederneutralcablesizesqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
            placeholder="ขนาดสายนิวทรัล (ตร.มม.)"
          />

          <CorrectiveRadio
            groupName="feedergroundcablesize_correct"
            label="จ) ขนาดสายดิน.............................ตร.มม. สอดคล้องกับขนาดสายเฟสของวงจรสายป้อน ตามตารางที่ 1 ในหน้าที่ 7"
            currentValue={formData.feedergroundcablesize_correct}
            currentNote={formData.feedergroundcablesize_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <input
            type="text"
            name="feedergroundcablesizesqmm"
            value={formData.feedergroundcablesizesqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
            placeholder="ขนาดสายดิน (ตร.มม.)"
          />

          <CorrectiveRadio
            groupName="feederphasemarking_correct"
            label="ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ"
            currentValue={formData.feederphasemarking_correct}
            currentNote={formData.feederphasemarking_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />

          <CorrectiveRadio
            groupName="feederconduitcontinuity_correct"
            label="ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ"
            currentValue={formData.feederconduitcontinuity_correct}
            currentNote={formData.feederconduitcontinuity_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />

          <CorrectiveRadio
            groupName="feederwiringmethod_correct"
            label="สถานะวิธีการเดินสาย (Feeder)"
            currentValue={formData.feederwiringmethod_correct}
            currentNote={formData.feederwiringmethod_correct_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          

          {/* 5.5.3 Conduit Type (Feeder) */}
            <h4 className="text-md font-semibold mb-2">5.5.3 ประเภทท่อร้อยสาย</h4>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="font-medium text-gray-700">ท่อโลหะ:</span>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="feederconduitmetaltype" value="หนา (RMC)" checked={Array.isArray(formData.feederconduitmetaltype) && formData.feederconduitmetaltype.includes("หนา (RMC)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">หนา (RMC)</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="feederconduitmetaltype" value="หนาปานกลาง (IMC)" checked={Array.isArray(formData.feederconduitmetaltype) && formData.feederconduitmetaltype.includes("หนาปานกลาง (IMC)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">หนาปานกลาง (IMC)</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="feederconduitmetaltype" value="บาง (EMT)" checked={Array.isArray(formData.feederconduitmetaltype) && formData.feederconduitmetaltype.includes("บาง (EMT)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">บาง (EMT)</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="font-medium text-gray-700">ท่ออโลหะ:</span>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="feederconduitnonmetaltype" value="แข็ง (RNC)" checked={Array.isArray(formData.feederconduitnonmetaltype) && formData.feederconduitnonmetaltype.includes("แข็ง (RNC)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">แข็ง (RNC)</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="feederconduitnonmetaltype" value="อ่อน (ENT)" checked={Array.isArray(formData.feederconduitnonmetaltype) && formData.feederconduitnonmetaltype.includes("อ่อน (ENT)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">อ่อน (ENT)</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="feederconduitnonmetaltype" value="ท่อโลหะอ่อน (Flexible Metal Conduit)" checked={Array.isArray(formData.feederconduitnonmetaltype) && formData.feederconduitnonmetaltype.includes("ท่อโลหะอ่อน (Flexible Metal Conduit)")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="feederconduitnonmetaltype" value="อื่นๆ" checked={Array.isArray(formData.feederconduitnonmetaltype) && formData.feederconduitnonmetaltype.includes("อื่นๆ")} onChange={handleCheckboxChange} className="text-[#5b2d90]" />
                <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
              </label>
              {Array.isArray(formData.feederconduitnonmetaltype) && formData.feederconduitnonmetaltype.includes("อื่นๆ") && (
                <input type="text" name="feederConduitOtherTypeNote" value={formData.feederConduitOtherTypeNote} onChange={handleChange} className="p-2 border border-gray-300 rounded-md text-gray-700" placeholder="ระบุ" />
              )}

          {/* 5.5.4 Feeder Circuit Breaker */}
          <h4 className="text-md font-semibold mb-2">5.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน</h4>
            <CorrectiveRadio
              groupName="feederbreakerstandard_correct"
              label="ก) เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อนเป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2"
              currentValue={formData.feederbreakerstandard_correct}
              currentNote={formData.feederbreakerstandard_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="feederbreakeramprating_correct"
              label="ข) เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อนขนาด AT..........แอมแปร์ (A) สอดคล้องกับพิกัดกระแสสายป้อน"
              currentValue={formData.feederbreakeramprating_correct}
              currentNote={formData.feederbreakeramprating_correct_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            </div>
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
                          onSave={(dataUrl) => handleSignatureSave('usersignature', dataUrl)} 
                          onClear={() => handleSignatureClear('usersignature')}
                          initialValue={formData.usersignature}
                        />
                        <SignaturePad 
                          title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" 
                          ref={inspectorSigRef} 
                          onSave={(dataUrl) => handleSignatureSave('inspectorsignature', dataUrl)} 
                          onClear={() => handleSignatureClear('inspectorsignature')}
                          initialValue={formData.inspectorsignature}
                        />
                      </div>
                    </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8 mt-12">
          <PDFDownloadLink
            document={<InspectionPDF formData={formData} />}
            fileName={`ev-charger-hv-inspection-form-${formData.inspectioncount || 'form'}.pdf`}
            className="w-full sm:w-auto"
          >
            {({ loading }) => (
              <button
                type="button"
                disabled={loading || isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 font-semibold text-lg text-emerald-700 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 border-2 border-emerald-300 rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-6 h-6"/>
                {loading ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}
              </button>
            )}
          </PDFDownloadLink>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 font-semibold text-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <>
                <Save className="w-6 h-6"/>
                <span>บันทึกข้อมูล</span>
              </>
            )}
          </button>
        </div>
        </div>
      </form>
    </div>
  );
}

// Wrap the component with FormProvider
function FormWrapper() {
  return (
    <FormProvider>
      <EVChargerHVInspectionFormContent />
    </FormProvider>
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

export default function EVChargerHVInspectionPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FormWrapper />
    </Suspense>
  );
}