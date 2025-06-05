"use client";

import React, { useState, useEffect, useRef, useImperativeHandle } from "react";

// --- Supabase Configuration ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helper component for "ถูกต้อง" / "ต้องแก้ไข" radio buttons
const CorrectiveRadio = ({ groupName, label, currentValue, currentNote, onStatusChange, onNoteChange }) => {
  const noteFieldName = `${groupName}_note`;
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-4 mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <input
            type="radio"
            name={groupName}
            value="ถูกต้อง"
            checked={currentValue === 'ถูกต้อง'}
            onChange={() => onStatusChange(groupName, 'ถูกต้อง', noteFieldName)}
            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
          />
          <span className="ml-2">ถูกต้อง</span>
        </label>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <input
            type="radio"
            name={groupName}
            value="ต้องแก้ไข"
            checked={currentValue === 'ต้องแก้ไข'}
            onChange={() => onStatusChange(groupName, 'ต้องแก้ไข', noteFieldName)}
            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
          />
          <span className="ml-2">ต้องแก้ไข</span>
        </label>
      </div>
      {currentValue === 'ต้องแก้ไข' && (
        <input
          type="text"
          name={noteFieldName}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent mt-2"
          value={currentNote || ''}
          onChange={onNoteChange}
          placeholder="โปรดระบุรายละเอียด"
        />
      )}
    </div>
  );
};

// Signature Pad Component (Manual Canvas Implementation)
const SignaturePad = React.forwardRef(({ title, onSave, onClear }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  const getPosition = (event) => {
    if (!canvasRef.current) return { x: 0, y: 0 }; // Guard clause
    const rect = canvasRef.current.getBoundingClientRect();
    if (event.touches && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    if (!canvasRef.current) return;
    if (event.type === 'touchstart') {
        event.preventDefault();
    }
    const { x, y } = getPosition(event);
    const context = canvasRef.current.getContext('2d');
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawing(true);
  };

  const draw = (event) => {
    if (!canvasRef.current) return;
    if (event.type === 'touchmove') {
        event.preventDefault();
    }
    if (!isDrawing) return;
    const { x, y } = getPosition(event);
    const context = canvasRef.current.getContext('2d');
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current || !isDrawing) return;
    const context = canvasRef.current.getContext('2d');
    context.closePath();
    setIsDrawing(false);
    if (typeof onSave === 'function' && hasDrawing) {
      onSave(canvasRef.current.toDataURL('image/png'));
    } else if (typeof onSave === 'function' && !hasDrawing) {
      onSave(""); 
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = canvasRef.current.offsetWidth;
    canvasRef.current.height = canvasRef.current.offsetHeight;
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasDrawing(false);
    if (typeof onClear === 'function') {
      onClear(); 
    }
    if (typeof onSave === 'function') {
        onSave("");
    }
  };

  useImperativeHandle(ref, () => ({
    clear: clearCanvas,
    toDataURL: (type = 'image/png') => {
      if (canvasRef.current && hasDrawing) {
        return canvasRef.current.toDataURL(type);
      }
      return "";
    },
    isEmpty: () => !hasDrawing,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const setCanvasDimensionsAndContext = () => {
        if (!canvas.offsetWidth || !canvas.offsetHeight) return; // Ensure dimensions are available
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const context = canvas.getContext('2d');
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
    };
    
    // Use a timeout to ensure the layout is stable before getting dimensions
    const timer = setTimeout(setCanvasDimensionsAndContext, 0);
    
    // Optional: ResizeObserver for more robust dynamic resizing
    // const resizeObserver = new ResizeObserver(setCanvasDimensionsAndContext);
    // resizeObserver.observe(canvas);

    return () => {
      clearTimeout(timer);
      // if (resizeObserver && canvas) {
      //   resizeObserver.unobserve(canvas);
      // }
    };
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{title}:</label>
      <div className="border border-gray-300 rounded-md p-1">
        <canvas
          ref={canvasRef}
          className="w-full h-32 rounded-md sigCanvas bg-gray-50 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <button
        type="button"
        onClick={clearCanvas}
        className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
      >
        ล้างลายเซ็น
      </button>
    </div>
  );
});
SignaturePad.displayName = 'SignaturePad';


export default function HomeForm() {
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
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);
  const [showSupabaseConfigWarning, setShowSupabaseConfigWarning] = useState(false);


  const userSigRef = useRef(null);
  const inspectorSigRef = useRef(null);

  // Effect for loading Supabase client from CDN
  useEffect(() => {
    // Check if Supabase is already loaded by a previous instance or another script
    if (window.supabase) {
      console.log("Supabase already available on window.");
      if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
        try {
          setSupabaseClient(window.supabase.createClient(supabaseUrl, supabaseKey));
          console.log("Supabase client initialized from existing window.supabase.");
        } catch (e) {
          console.error("Error initializing Supabase client from existing window.supabase:", e);
        }
      } else {
        console.warn("Supabase URL or Key is not configured (using existing window.supabase).");
        setShowSupabaseConfigWarning(true);
      }
      setSupabaseLoaded(true);
      return;
    }

    // If not already loaded, create script tag
    const scriptId = 'supabase-js-cdn';
    if (document.getElementById(scriptId)) { // Avoid appending multiple times
        console.log("Supabase script tag already exists.");
        // It might exist but not loaded yet, or window.supabase not set.
        // Rely on its onload or check window.supabase periodically if needed.
        // For simplicity, if script tag exists, we assume it will handle loading.
        // A more robust solution might involve promises or event listeners on the script tag.
        return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; // CDN for Supabase v2
    script.async = true;

    script.onload = () => {
      console.log("Supabase script loaded from CDN.");
      if (window.supabase) {
        if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
          try {
            setSupabaseClient(window.supabase.createClient(supabaseUrl, supabaseKey));
            console.log("Supabase client initialized after CDN load.");
            setShowSupabaseConfigWarning(false);
          } catch (e) {
             console.error("Error initializing Supabase client after CDN load:", e);
             setShowSupabaseConfigWarning(true);
          }
        } else {
          console.warn("Supabase URL or Key is not configured after CDN load.");
          setShowSupabaseConfigWarning(true);
        }
      } else {
        console.error("Supabase object (window.supabase) not found after script load.");
        setShowSupabaseConfigWarning(true); // Indicate a problem
      }
      setSupabaseLoaded(true);
    };

    script.onerror = () => {
      console.error("Error loading Supabase script from CDN.");
      setSupabaseLoaded(true); // Still set to true to allow UI to update
      setShowSupabaseConfigWarning(true); // Indicate a problem
    };

    document.head.appendChild(script);

    // Cleanup function for when the component unmounts
    return () => {
      // Optional: remove the script if it's only needed by this component instance
      // const existingScript = document.getElementById(scriptId);
      // if (existingScript) {
      //   document.head.removeChild(existingScript);
      // }
    };
  }, []); // Empty dependency array: run once on mount

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRadioChange = (groupName, value, noteFieldName) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: value,
      ...(value === 'ถูกต้อง' && { [noteFieldName]: '' }),
    }));
  };

  const handleSignatureSave = (fieldName, dataUrl) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: dataUrl,
    }));
  };
  
  const handleSignatureClear = (fieldName) => {
    setFormData(prev => ({
        ...prev,
        [fieldName]: "",
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!supabaseLoaded) {
        alert("Supabase library is still loading. Please wait a moment and try again.");
        setIsSubmitting(false);
        return;
    }

    if (!supabaseClient) {
        alert("Supabase client is not initialized. Please check your Supabase URL/Key configuration. Data will be logged to console only.");
        // Log data to console as a fallback
        let fallbackData = { ...formData };
        if (userSigRef.current && !userSigRef.current.isEmpty()) {
            fallbackData.userSignature = userSigRef.current.toDataURL('image/png');
        } else {
            fallbackData.userSignature = "";
        }
        if (inspectorSigRef.current && !inspectorSigRef.current.isEmpty()) {
            fallbackData.inspectorSignature = inspectorSigRef.current.toDataURL('image/png');
        } else {
            fallbackData.inspectorSignature = "";
        }
        console.log("Form Data (Supabase not initialized):", fallbackData);
        setIsSubmitting(false);
        setShowSupabaseConfigWarning(true); // Ensure warning is visible
        return;
    }

    let dataToSubmit = { ...formData };
    if (userSigRef.current) {
        dataToSubmit.userSignature = userSigRef.current.toDataURL('image/png');
    }
    if (inspectorSigRef.current) {
        dataToSubmit.inspectorSignature = inspectorSigRef.current.toDataURL('image/png');
    }
    
    console.log("Submitting to Supabase:", dataToSubmit);
    const tableName = 'inspection_forms';

    try {
      const { data, error } = await supabaseClient
        .from(tableName)
        .insert([dataToSubmit])
        .select(); 

      if (error) {
        console.error('Error saving to Supabase:', error);
        alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
      } else {
        console.log('Data saved to Supabase:', data);
        alert('ข้อมูลถูกบันทึกเรียบร้อยแล้ว!');
        setFormData(initialFormData); 
        if (userSigRef.current) userSigRef.current.clear();
        if (inspectorSigRef.current) inspectorSigRef.current.clear();
      }
    } catch (error) {
      console.error('An unexpected error occurred during Supabase operation:', error);
      alert('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <style jsx global>{`
        .sigCanvas {
          touch-action: none; 
        }
      `}</style>
      <h2 className="text-2xl font-bold mb-6 text-center text-[#5b2d90]">
        แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน
      </h2>

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
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

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
          1. ข้อมูลทั่วไป
        </h2>
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
              rows="3"
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

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
          2. การตรวจสอบ
        </h2>
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            2.1 สายตัวนำประธานเข้าอาคาร
          </h3>
          <div className="mb-6 pl-4 border-l-4 border-purple-300">
          <CorrectiveRadio
            groupName="cableStandard_correct"
            label="ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502"
            currentValue={formData.cableStandard_correct}
            currentNote={formData.cableStandard_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ข) ชนิดและขนาด:
            </label>
            <div className="flex flex-wrap gap-4 mt-2 mb-2">
              <label className="inline-flex items-center text-gray-800">
                <input type="radio" name="cableType" value="IEC 01" checked={formData.cableType === 'IEC 01'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                <span className="block text-sm font-medium text-gray-700 ml-2">IEC 01</span>
              </label>
              <label className="inline-flex items-center text-gray-800">
                <input type="radio" name="cableType" value="NYY" checked={formData.cableType === 'NYY'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                <span className="block text-sm font-medium text-gray-700 ml-2">NYY</span>
              </label>
              <label className="inline-flex items-center text-gray-800">
                <input type="radio" name="cableType" value="CV" checked={formData.cableType === 'CV'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                <span className="block text-sm font-medium text-gray-700 ml-2">CV</span>
              </label>
              <label className="inline-flex items-center text-gray-800">
                <input type="radio" name="cableType" value="อื่นๆ" checked={formData.cableType === 'อื่นๆ'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
                <span className="block text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
              </label>
              {formData.cableType === 'อื่นๆ' && (
                <input type="text" name="cableOtherType" value={formData.cableOtherType} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ"/>
              )}
            </div>
            <label htmlFor="cableSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">ขนาด (ตร.มม.):</label>
            <input type="number" id="cableSizeSqmm" name="cableSizeSqmm" value={formData.cableSizeSqmm} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"/>
          </div>
          <CorrectiveRadio groupName="cableTypeSize_correct" label="ถูกต้องหรือไม่" currentValue={formData.cableTypeSize_correct} currentNote={formData.cableTypeSize_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">ค) วิธีการเดินสาย:</label>
            <div className="mt-2 space-y-4">
              <div>
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="wiringMethodOverheadChecked" checked={formData.wiringMethodOverheadChecked} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"/>
                  <span className="block text-sm font-medium text-gray-700 ml-2">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
                </label>
                {formData.wiringMethodOverheadChecked && (
                  <div className="mt-2 pl-6 border-l-2 border-gray-200 ml-2">
                    <CorrectiveRadio groupName="overhead_height_correct" label="1) สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตร ถ้ายานพาหนะลอดผ่าน" currentValue={formData.overhead_height_correct} currentNote={formData.overhead_height_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
                    <CorrectiveRadio groupName="overhead_neutralMarked_correct" label="2) สายตัวนำประธานทำเครื่องหมายที่สาย Neutral" currentValue={formData.overhead_neutralMarked_correct} currentNote={formData.overhead_neutralMarked_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
                  </div>
                )}
              </div>
              <div>
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="wiringMethodUndergroundChecked" checked={formData.wiringMethodUndergroundChecked} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"/>
                  <span className="block text-sm font-medium text-gray-700 ml-2">เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
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
        <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
          2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)
        </h3>
        <div className="mb-6 pl-4 border-l-4 border-purple-300">
          <CorrectiveRadio groupName="breakerStandard_correct" label="ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898" currentValue={formData.breakerStandard_correct} currentNote={formData.breakerStandard_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
          <div className="mb-4">
            <label htmlFor="breakerAmpRating" className="block text-sm font-medium text-gray-700 mb-1">ขนาด AT:</label>
            <input type="number" id="breakerAmpRating" name="breakerAmpRating" value={formData.breakerAmpRating} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"/>
          </div>
          <CorrectiveRadio groupName="breakerMeterMatch_correct" label="ข) เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์" currentValue={formData.breakerMeterMatch_correct} currentNote={formData.breakerMeterMatch_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
          <CorrectiveRadio groupName="breakerShortCircuitRating_correct" label="ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)" currentValue={formData.breakerShortCircuitRating_correct} currentNote={formData.breakerShortCircuitRating_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
          2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์
        </h3>
        <div className="mb-6 pl-4 border-l-4 border-purple-300">
          <div className="mb-4">
            <label htmlFor="groundWireSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">ขนาดสายต่อหลักดิน (ตร.มม.):</label>
            <input type="number" id="groundWireSizeSqmm" name="groundWireSizeSqmm" value={formData.groundWireSizeSqmm} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"/>
          </div>
          <CorrectiveRadio groupName="groundWireSize_correct" label="ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน" currentValue={formData.groundWireSize_correct} currentNote={formData.groundWireSize_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
          <div className="mb-4">
            <label htmlFor="groundResistanceOhm" className="block text-sm font-medium text-gray-700 mb-1">ค่าความต้านทานการต่อลงดิน (โอห์ม):</label>
            <input type="number" step="0.01" id="groundResistanceOhm" name="groundResistanceOhm" value={formData.groundResistanceOhm} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"/>
          </div>
          <CorrectiveRadio groupName="groundResistance_correct" label="ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากในการปฏิบัติและการไฟฟ้าส่วนภูมิภาคเห็นชอบ ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีก 1 แท่ง" currentValue={formData.groundResistance_correct} currentNote={formData.groundResistance_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
          <CorrectiveRadio groupName="onePhaseGroundConnection_correct" label="ค) กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสาย Neutral (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่ กฟภ. กำหนด" currentValue={formData.onePhaseGroundConnection_correct} currentNote={formData.onePhaseGroundConnection_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
          <CorrectiveRadio groupName="threePhaseGroundConnection_correct" label="ง) กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสาย Neutral (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่ กฟภ. กำหนด" currentValue={formData.threePhaseGroundConnection_correct} currentNote={formData.threePhaseGroundConnection_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
          2.4 เครื่องตัดไฟรั่ว (RCD)
        </h3>
        <div className="mb-6 pl-4 border-l-4 border-purple-300">
          <label className="block text-sm font-medium text-gray-700 mb-1">ติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดพิกัดกระแสรั่ว (I∆n) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง</label>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="inline-flex items-center text-gray-800">
              <input type="radio" name="rcdInstalledOption" value="ถูกต้อง" checked={formData.rcdInstalledOption === 'ถูกต้อง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
              <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input type="radio" name="rcdInstalledOption" value="ไม่ประสงค์ติดตั้ง" checked={formData.rcdInstalledOption === 'ไม่ประสงค์ติดตั้ง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
              <span className="block text-sm font-medium text-gray-700 ml-2">ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว และผู้ตรวจสอบมาตรฐานได้แจ้งให้ผู้ขอใช้ไฟฟ้าหรือผู้แทนทราบถึงความเสี่ยงจากการไม่ติดตั้งเครื่องตัดไฟรั่วแล้ว</span>
            </label>
          </div>
          {formData.rcdInstalledOption === 'ถูกต้อง' && (
             <div className="mt-4">
              <CorrectiveRadio groupName="rcdInstalled_correct" label="การทำงานของ RCD ถูกต้อง" currentValue={formData.rcdInstalled_correct} currentNote={formData.rcdInstalled_note} onStatusChange={handleRadioChange} onNoteChange={handleChange}/>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="block text-sm font-medium text-gray-700">
          3. กรณีผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ติดตั้งหม้อแปลงไฟฟ้าเพื่อรับไฟแรงสูง ให้ตรวจสอบมาตรฐานการติดตั้งระบบไฟฟ้าแรงสูงเพิ่มเติมโดยใช้แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆ นอกเหนือจากที่อยู่อาศัย
        </h3>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
          4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า
        </h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <label className="inline-flex items-center text-sm font-medium text-gray-700">
            <input type="radio" name="summaryResult" value="ติดตั้งมิเตอร์ถาวร" checked={formData.summaryResult === 'ติดตั้งมิเตอร์ถาวร'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
            <span className="ml-2">ติดตั้งมิเตอร์ถาวร</span>
          </label>
          <label className="inline-flex items-center text-sm font-medium text-gray-700">
            <input type="radio" name="summaryResult" value="ติดตั้งมิเตอร์ชั่วคราว" checked={formData.summaryResult === 'ติดตั้งมิเตอร์ชั่วคราว'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
            <span className="ml-2">ติดตั้งมิเตอร์ชั่วคราว</span>
          </label>
          <label className="inline-flex items-center text-sm font-medium text-gray-700">
            <input type="radio" name="summaryResult" value="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" checked={formData.summaryResult === 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"/>
            <span className="ml-2">ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์</span>
          </label>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
          5. ขอบเขตและข้อจำกัดในการตรวจสอบ
        </h3>
        <textarea id="scopeOfInspection" name="scopeOfInspection" value={formData.scopeOfInspection} onChange={handleChange} rows="4" className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"></textarea>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
          6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ
        </h3>
        <div className="text-gray-700 text-sm mb-4 space-y-3">
          <p>
            6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนสิ่งก่อสร้างอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงอยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว
          </p>
          <p>
            6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหลัง หรืออุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว
          </p>
          <p>
            6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว
          </p>
          <p>
            6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignaturePad title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" ref={userSigRef} onSave={(dataUrl) => handleSignatureSave('userSignature', dataUrl)} onClear={() => handleSignatureClear('userSignature')}/>
          <SignaturePad title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" ref={inspectorSigRef} onSave={(dataUrl) => handleSignatureSave('inspectorSignature', dataUrl)} onClear={() => handleSignatureClear('inspectorSignature')}/>
        </div>
      </section>

      <div className="flex justify-center mt-10">
        <button
          type="submit"
          disabled={isSubmitting || !supabaseClient}
          className={`px-8 py-4 bg-[#5b2d90] text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#3a1a5b] focus:outline-none focus:ring-4 focus:ring-[#a78bfa] focus:ring-offset-2 transition duration-300 ease-in-out ${
            (isSubmitting || !supabaseClient) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </div>
      {showSupabaseConfigWarning && (
        <p className="text-center text-red-500 mt-4">
          Supabase ยังไม่ได้ตั้งค่าอย่างถูกต้อง หรือเกิดปัญหาในการโหลดไลบรารี กรุณาตรวจสอบ Supabase URL และ Key ในโค้ด และดูข้อความใน Console
        </p>
      )}
    </form>
  );
}
