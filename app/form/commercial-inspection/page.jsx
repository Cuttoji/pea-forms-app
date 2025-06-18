"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { Save } from "lucide-react";
import { toast } from "sonner";
import dynamic from 'next/dynamic';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";

export default function CommercialInspectionForm() {
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
    hasDesignCertification: null,
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
    disconnectingDeviceStatus: null,
    disconnectingDeviceNote: "",
    disconnectingDeviceType: "",
    disconnectingDeviceSwitchType: "",
    hvDistributionOther: "",
    transformers: [],
    installationResult: null,
    scopeAndLimitations: "",
    applicantSignature: "",
    peaOfficerSignature: "",
    latitude: null,
    longitude: null,
    photos: [],
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [numTransformers, setNumTransformers] = useState(0);
  const [openTransformers, setOpenTransformers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const applicantSigRef = useRef(null);
  const peaOfficerSigRef = useRef(null);

  const createNewTransformer = useCallback(() => ({
    transformer_tested: null,
    transformer_number: "",
    transformer_kva: "",
    transformer_hvRating: "",
    transformer_lvRating: "",
    transformer_impedance: "",
    transformer_type: "",
    transformer_type_other: "",
    transformer_vectorGroup: "",
    transformer_shortCircuitRating: "",
    transformer_properties_correct: null,
    transformer_properties_note: "",
    transformer_installationType_correct: null,
    transformer_installationType_note: "",
    installationType_suspended: false,
    installationType_onRack: false,
    installationType_onGround: false,
    installationType_onRoof: false,
    installationType_transformerRoom: false,
    installationType_other: false,
    installationType_other_note: "",
    incomingProtection_correct: null,
    incomingProtection_note: "",
    incomingProtection_dropOutFuseCutOut: false,
    incomingProtection_circuitBreaker: false,
    incomingProtection_other: false,
    incomingProtection_other_note: "",
    incomingProtection_continuousRating: "",
    incomingProtection_icRating: "",
    transformer_hvSurgeArrester_correct: null,
    transformer_hvSurgeArrester_note: "",
    transformer_hvSurgeArrester_voltageRating: "",
    transformer_hvSurgeArrester_currentRating: "",
    transformer_groundingAssembly_correct: null,
    transformer_groundingAssembly_note: "",
    hv_groundResistance: "",
    hv_groundResistance_correct: null,
    hv_groundResistance_note: "",
    transformer_desiccant_correct: null,
    transformer_desiccant_note: "",
    transformer_bushingCondition_correct: null,
    transformer_bushingCondition_note: "",
    transformer_oilLevel_correct: null,
    transformer_oilLevel_note: "",
    transformer_oilLeakage_correct: null,
    transformer_oilLeakage_note: "",
    warningSign_correct: null,
    warningSign_note: "",
    transformerOther: "",
  }), []);

  useEffect(() => {
    const fetchForm = async () => {
        if (id) {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('commercial_inspection')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching data:", error);
                toast.error("ไม่สามารถโหลดข้อมูลฟอร์มได้");
                router.push('/dashboard');
            } else if (data) {
                setFormData(data);
                if (data.transformers && Array.isArray(data.transformers)) {
                    setNumTransformers(data.transformers.length);
                }
            }
            setIsLoading(false);
        } else {
            const today = new Date().toISOString().split('T')[0];
            setFormData(prev => ({
                ...initialFormData,
                inspectionDate: today,
                requestDate: today,
            }));
            setIsLoading(false);
        }
    };

    fetchForm();
  }, [id, router, supabase]);

  useEffect(() => {
    if (numTransformers < 0) return;
    setFormData(prevData => {
      const currentTransformers = [...(prevData.transformers || [])];
      const newTransformers = [];
      for (let i = 0; i < numTransformers; i++) {
        newTransformers.push(currentTransformers[i] || createNewTransformer());
      }
      return { ...prevData, transformers: newTransformers };
    });
  }, [numTransformers, createNewTransformer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCorrectiveRadioChange = (groupName, value, noteFieldName) => {
    const isCorrectValue = value === 'true';
    setFormData(prev => {
        const newState = { ...prev, [groupName]: isCorrectValue };
        if (isCorrectValue && noteFieldName && newState.hasOwnProperty(noteFieldName)) {
            newState[noteFieldName] = '';
        }
        return newState;
    });
  };

  const handleTransformerChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => {
        const newTransformers = JSON.parse(JSON.stringify(prevData.transformers));
        const currentTransformer = newTransformers[index];
        const radioValue = value === "true" ? true : (value === "false" ? false : value);

        if (type === 'radio' && name.endsWith('_correct')) {
            currentTransformer[name] = radioValue;
            if (radioValue) {
                const noteField = name.replace('_correct', '_note');
                if (currentTransformer.hasOwnProperty(noteField)) {
                    currentTransformer[noteField] = '';
                }
            }
        } else {
            currentTransformer[name] = type === "checkbox" ? checked : value;
        }

        newTransformers[index] = currentTransformer;
        return { ...prevData, transformers: newTransformers };
    });
  };

  const handleSignatureSave = (fieldName, dataUrl) => {
    setFormData(prev => ({ ...prev, [fieldName]: dataUrl }));
  };

  const handleNumTransformersChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumTransformers(isNaN(value) ? 0 : value);
  };

  const toggleTransformerDetails = (index) => {
    setOpenTransformers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล");
            return;
        }

        let dataToSubmit = { ...formData, user_id: user.id };

        // Handle Image Uploads
        if (imageFiles.length > 0) {
            const uploadPromises = imageFiles.map(file => {
                const fileName = `${user.id}/${Date.now()}_commercial_${file.name}`;
                return supabase.storage.from('form-images').upload(fileName, file);
            });
            const uploadResults = await Promise.all(uploadPromises);
            
            const urls = [];
            for (const result of uploadResults) {
                if (result.error) throw result.error;
                const { data: publicUrlData } = supabase.storage.from('form-images').getPublicUrl(result.data.path);
                urls.push(publicUrlData.publicUrl);
            }
            dataToSubmit.photos = [...(dataToSubmit.photos || []), ...urls];
        }

        // Handle Signatures
        if (applicantSigRef.current && !applicantSigRef.current.isEmpty()) {
            dataToSubmit.applicantSignature = applicantSigRef.current.toDataURL();
        }
        if (peaOfficerSigRef.current && !peaOfficerSigRef.current.isEmpty()) {
            dataToSubmit.peaOfficerSignature = peaOfficerSigRef.current.toDataURL();
        }
        
        // Clean up data types before submission
        const numericFields = ['estimatedLoad', 'latitude', 'longitude'];
        // You might need to add more numeric fields from the transformer part here
        
        const cleanData = (obj) => {
            const newObj = { ...obj };
            for(const key in newObj) {
                if(numericFields.includes(key)) {
                    const value = newObj[key];
                    newObj[key] = (value === '' || value === null || isNaN(parseFloat(value))) ? null : parseFloat(value);
                }
            }
            return newObj;
        }
        dataToSubmit = cleanData(dataToSubmit);
        if (dataToSubmit.transformers) {
            dataToSubmit.transformers = dataToSubmit.transformers.map(cleanData);
        }

        const dateFields = ['inspectionDate', 'requestDate'];
        dateFields.forEach(field => {
            if (dataToSubmit[field] === '') dataToSubmit[field] = null;
        });

        const { error } = await (id 
          ? supabase.from('commercial_inspection').update(dataToSubmit).eq('id', id)
          : supabase.from('commercial_inspection').insert([dataToSubmit]));
        
        if (error) throw error;

        toast.success('บันทึกข้อมูลเรียบร้อยแล้ว!');
        router.push('/dashboard');

    } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-lg text-gray-600">กำลังโหลดข้อมูลฟอร์ม...</p>
        </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#5b2d90]">
        แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้า<br />ก่อนติดตั้งมิเตอร์สำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆนอกเหนือจากที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน 
      </h1>
      
      {/* Header Information */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inspection Number, Inspection Date, etc. */}
          <div>
            <label htmlFor="inspectionNumber" className="block text-sm font-medium text-gray-700 mb-1">เลขที่บันทึกตรวจสอบ:</label>
            <input type="text" id="inspectionNumber" name="inspectionNumber" value={formData.inspectionNumber} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-700 mb-1">วันที่ตรวจสอบ:</label>
            <input type="date" id="inspectionDate" name="inspectionDate" value={formData.inspectionDate} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm" />
          </div>
        </div>
      </section>

      {/* 1. General Information */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-5 text-pea-dark">1. ข้อมูลทั่วไป</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล/ชื่อผู้ขอใช้ไฟฟ้า:</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">โทรศัพท์:</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm" />
          </div>
          {/* ... other general info fields ... */}
        </div>
      </section>

      {/* 2. Inspection */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-5 text-pea-dark">2. การตรวจสอบ</h2>
        
        {/* 2.2.1 Overhead System */}
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
          <h4 className="text-lg font-semibold mb-3 text-gray-700">2.2.1 ระบบจำหน่ายเหนือดิน</h4>
          <div className="space-y-4">
            <CorrectiveRadio
                groupName="overhead_cableType_correct"
                label="ชนิดสาย"
                currentValue={formData.overhead_cableType_correct}
                currentNote={formData.overhead_cableType_note}
                onStatusChange={handleCorrectiveRadioChange}
                onNoteChange={handleChange}
            />
            {/* ... other CorrectiveRadio components for Overhead section ... */}
            <CorrectiveRadio groupName="overhead_poleCondition_correct" label="สภาพเสาและอุปกรณ์ประกอบเสา" currentValue={formData.overhead_poleCondition_correct} currentNote={formData.overhead_poleCondition_note} onStatusChange={handleCorrectiveRadioChange} onNoteChange={handleChange} />
            <CorrectiveRadio groupName="overhead_poleTopEquipment_correct" label="การติดตั้งอุปกรณ์บนยอดเสา" currentValue={formData.overhead_poleTopEquipment_correct} currentNote={formData.overhead_poleTopEquipment_note} onStatusChange={handleCorrectiveRadioChange} onNoteChange={handleChange} />
          </div>
        </div>
        {/* ... other inspection sections ... */}
      </section>

      {/* Map and Image Upload */}
       <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
         <h2 className="text-2xl font-bold mb-5 text-pea-dark">ข้อมูลเพิ่มเติม</h2>
         <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[#3a1a5b] mb-3">ตำแหน่งที่ตั้ง</h3>
                {/* <GoogleMapComponent 
                  onLocationSelect={handleLocationSelect} 
                  initialPosition={formData.latitude && formData.longitude ? { lat: formData.latitude, lng: formData.longitude } : undefined}
                /> */}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-[#3a1a5b] mb-3">รูปภาพประกอบ</h3>
                <ImageUpload 
                  onImageSelected={(files) => setImageFiles(files)}
                  disabled={isSubmitting}
                />
            </div>
         </div>
      </section>

      {/* Signatures */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">ลายเซ็น</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SignaturePad title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" ref={applicantSigRef} />
            <SignaturePad title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" ref={peaOfficerSigRef} />
        </div>
      </section>

      <div className="text-center mt-10">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-[#5b2d90] text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#3a1a5b] focus:outline-none focus:ring-4 focus:ring-[#a78bfa] focus:ring-offset-2 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Save size={24} />
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </div>
    </form>
  );
}