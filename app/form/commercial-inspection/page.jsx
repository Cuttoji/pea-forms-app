"use client";

import { useState, useEffect } from "react";

// Helper component for "ถูกต้อง" / "ต้องแก้ไข" radio buttons
// This should be defined outside the main component to prevent re-creation on every render.
const YesNoRadio = ({ groupName, label, currentValue, currentNote, onStatusChange, onNoteChange }) => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <div className="flex flex-wrap gap-4 mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <input
            type="radio"
            name={groupName}
            value="ถูกต้อง"
            checked={currentValue === 'ถูกต้อง'}
            onChange={() => onStatusChange(groupName, 'ถูกต้อง', `${groupName}_note`)}
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
            onChange={() => onStatusChange(groupName, 'ต้องแก้ไข', `${groupName}_note`)}
            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
          />
          <span className="ml-2">ต้องแก้ไข</span>
        </label>
      </div>
      {currentValue === 'ต้องแก้ไข' && (
        <input
          type="text"
          name={`${groupName}_note`} // The name for the note field
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent mt-2"
          value={currentNote || ''} // Access the correct note value
          onChange={onNoteChange} // Use the main handleChange for note input
          placeholder="โปรดระบุรายละเอียด"
        />
      )}
    </div>
  );
};


export default function ElectricityInspectionForm() {
  const [formData, setFormData] = useState({
    // Header Information
    inspectionNumber: "",
    inspectionDate: "",
    requestNumber: "",
    requestDate: "",

    // 1. ข้อมูลทั่วไป (General Information)
    fullName: "",
    phone: "",
    address: "",
    phaseType: "", // 1_phase, 3_phase
    estimatedLoad: "",

    // 2. การตรวจสอบ (Inspection)
    // 2.1 เอกสารรับรองการออกแบบระบบไฟฟ้า (Design Certification)
    hasDesignCertification: null, // 'yes', 'no'

    // 2.2 ระบบจำหน่ายแรงสูง (High Voltage Distribution System)
    // 2.2.1 ระบบจำหน่ายเหนือดิน (Overhead Distribution System)
    overhead_cableType: "", // เช่น 33kV, 22kV
    overhead_cableType_correct: null, // boolean or null
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

    // 2.2.2 ระบบจำหน่ายใต้ดิน (Underground Distribution System)
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

    // 2.2.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)
    disconnectingDeviceStatus: null, // 'ถูกต้อง', 'ต้องแก้ไข'
    disconnectingDeviceNote: "",
    disconnectingDeviceType: "", // 'ดรอพเอาท์ฟิวส์คัตเอาท์', 'สวิตช์ตัดตอน', 'RMU'
    disconnectingDeviceSwitchType: "", // For 'สวิตช์ตัดตอน' specific type

    // 2.2.4 อื่นๆ (High Voltage Distribution System)
    hvDistributionOther: "",

    // หม้อแปลง (Transformer) - Array of Objects for multiple transformers
    transformers: [],

    // 3. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า
    installationResult: null, // 'pass', 'fail'

    // 4. ขอบเขตและข้อจำกัดในการตรวจสอบ
    scopeAndLimitations: "",

    // 5. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ (Signatures)
    applicantSignature: "",
    peaOfficerSignature: "",
  });

  const [numTransformers, setNumTransformers] = useState(0); // State for number of transformers
  const [openTransformers, setOpenTransformers] = useState({}); // State to manage open/close for each transformer section

  // Function to create a new, empty transformer object
  const createNewTransformer = () => ({
    transformer_tested: null, // 'yes', 'no'
    transformer_number: "",
    transformer_kva: "",
    transformer_hvRating: "",
    transformer_lvRating: "",
    transformer_impedance: "",
    transformer_type: "", // 'oil', 'dry', 'other'
    transformer_type_other: "",
    transformer_vectorGroup: "",
    transformer_shortCircuitRating: "",
    transformer_properties_correct: null,
    transformer_properties_note: "",

    // 2.6 ลักษณะการติดตั้ง (Installation Type)
    transformer_installationType_correct: null,
    transformer_installationType_note: "",
    installationType_suspended: false,
    installationType_onRack: false,
    installationType_onGround: false,
    installationType_onRoof: false,
    installationType_transformerRoom: false,
    installationType_other: false,
    installationType_other_note: "",

    // 2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า (Incoming Overcurrent Protection)
    incomingProtection_correct: null,
    incomingProtection_note: "",
    incomingProtection_dropOutFuseCutOut: false,
    incomingProtection_circuitBreaker: false,
    incomingProtection_other: false,
    incomingProtection_other_note: "",
    incomingProtection_continuousRating: "",
    incomingProtection_icRating: "",

    // 2.8 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)
    transformer_hvSurgeArrester_correct: null,
    transformer_hvSurgeArrester_note: "",
    transformer_hvSurgeArrester_voltageRating: "",
    transformer_hvSurgeArrester_currentRating: "",

    // 2.9 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง
    transformer_groundingAssembly_correct: null,
    transformer_groundingAssembly_note: "",

    // 2.10 ค่าความต้านทานดินของระบบแรงสูง
    hv_groundResistance: "",
    hv_groundResistance_correct: null,
    hv_groundResistance_note: "",

    // 2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)
    transformer_desiccant_correct: null,
    transformer_desiccant_note: "",
    transformer_bushingCondition_correct: null,
    transformer_bushingCondition_note: "",
    transformer_oilLevel_correct: null,
    transformer_oilLevel_note: "",
    transformer_oilLeakage_correct: null,
    transformer_oilLeakage_note: "",

    // 2.12 ป้ายเตือน (Warning Sign)
    warningSign_correct: null,
    warningSign_note: "",

    // 2.13 อื่นๆ (Transformer)
    transformerOther: "",
  });

  // Set initial dates to today's date
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData(prev => ({
      ...prev,
      inspectionDate: formattedDate,
      requestDate: formattedDate,
    }));
  }, []);

  // Effect to manage the `transformers` array based on `numTransformers`
  useEffect(() => {
    if (numTransformers < 0) return;

    setFormData(prevData => {
      const currentTransformers = [...prevData.transformers];
      const newTransformers = [];

      for (let i = 0; i < numTransformers; i++) {
        if (currentTransformers[i]) {
          newTransformers.push(currentTransformers[i]);
        } else {
          newTransformers.push(createNewTransformer());
        }
      }
      return {
        ...prevData,
        transformers: newTransformers,
      };
    });
  }, [numTransformers]);

  // General handler for all form fields (text, number, select, generic checkboxes, and device type radios)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      // Handle specific checkboxes that clear notes (e.g., installationType_other)
      // This is for checkboxes like "อื่นๆ" that have an associated text input for details.
      if (name.endsWith('_other') && type === 'checkbox') {
        const updatedData = { ...prevData, [name]: checked };
        if (!checked) {
          const noteFieldName = `${name}_note`;
          if (prevData.hasOwnProperty(noteFieldName)) {
            updatedData[noteFieldName] = ''; // Clear associated note if unchecked
          }
        }
        return updatedData;
      }

      // Handle other multi-select checkboxes (like installationType, wiringMethod arrays)
      // This part handles checkboxes where multiple options can be selected,
      // and their values are stored in an array.
      if (type === 'checkbox' && (
          name.includes('installationType') ||
          name.includes('wiringMethod') ||
          name.includes('conduitMetalType') ||
          name.includes('conduitNonMetalType') ||
          name.includes('feederWiringMethod') ||
          name.includes('feederConduitMetalType') ||
          name.includes('feederConduitNonMetalType') ||
          name === 'feederConduitFlexibleMetalType' // Added this specific field
      )) {
          const currentArray = Array.isArray(prevData[name]) ? [...prevData[name]] : [];
          if (checked) {
              if (!currentArray.includes(value)) { // Prevent duplicates if already present
                  return { ...prevData, [name]: [...currentArray, value] };
              }
          } else {
              return { ...prevData, [name]: currentArray.filter(item => item !== value) };
          }
          return prevData; // Return prevData if no change in array
      }

      // Handle top-level radio buttons that determine correctness (e.g., hasDesignCertification)
      // These are the radio buttons where the value is 'yes', 'no', 'not_applicable' or 'true', 'false'.
      if ((name.endsWith('_correct') || name === 'hasDesignCertification') && type === 'radio') {
        // If it's a _correct radio, its value will be 'true' or 'false' (string)
        // If it's hasDesignCertification, its value will be 'yes', 'no', 'not_applicable'
        const radioValue = value === "true" ? true : (value === "false" ? false : value);
        const noteFieldName = name.replace('_correct', '_note'); // Only applies to _correct fields

        const newState = { ...prevData, [name]: radioValue };

        // If the status is set to 'correct' (true) or 'yes', clear the associated note.
        if ((radioValue === true || radioValue === 'yes') && prevData.hasOwnProperty(noteFieldName)) {
          newState[noteFieldName] = '';
        }
        return newState;
      }

      // Handle general top-level inputs (text, date, select, generic simple checkboxes)
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  // Handler specifically for YesNoRadio component's status change (e.g., disconnectingDeviceStatus)
  const handleRadioChange = (groupName, statusValue, noteFieldName = null) => {
    setFormData(prev => {
      const newState = { ...prev, [groupName]: statusValue };
      if (noteFieldName && statusValue === 'ถูกต้อง') { // Clear note if 'ถูกต้อง' is selected
        newState[noteFieldName] = "";
      }
      return newState;
    });
  };

  // Handler for changes within the transformers array (nested state)
  const handleTransformerChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => {
      const newTransformers = [...prevData.transformers]; // Create a copy of the array
      const currentTransformer = { ...newTransformers[index] }; // Create a copy of the specific transformer object

      // Handle radio buttons (e.g., transformer_tested, _correct fields within transformer)
      if (name.endsWith("_correct") || name === "transformer_tested") {
        const radioValue = value === "true" ? true : (value === "false" ? false : value);
        currentTransformer[name] = radioValue;
        const noteFieldName = name.replace('_correct', '_note');
        if ((radioValue === true || radioValue === 'yes') && currentTransformer.hasOwnProperty(noteFieldName)) {
          currentTransformer[noteFieldName] = ""; // Clear note if setting to 'correct'
        }
      }
      // Handle 'other' checkboxes in transformer section (e.g., installationType_other)
      else if (name.endsWith('_other') && type === 'checkbox') {
          currentTransformer[name] = checked;
          const noteFieldName = `${name}_note`;
          if (!checked && currentTransformer.hasOwnProperty(noteFieldName)) {
              currentTransformer[noteFieldName] = ''; // Clear associated note if unchecked
          }
      }
      // Handle transformer type select (Oil, Dry, Other)
      else if (name === "transformer_type") {
        currentTransformer[name] = value;
        // Clear 'other' specific type note if type changes away from 'other'
        if (value !== "other" && currentTransformer.hasOwnProperty("transformer_type_other")) {
          currentTransformer["transformer_type_other"] = "";
        }
      }
      // General input for transformer fields
      else {
        currentTransformer[name] = type === "checkbox" ? checked : value;
      }

      newTransformers[index] = currentTransformer; // Update the copied transformer in the copied array
      return {
        ...prevData,
        transformers: newTransformers, // Set the state with the updated array
      };
    });
  };


  const handleNumTransformersChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumTransformers(isNaN(value) ? 0 : value);
  };

  const toggleTransformerDetails = (index) => {
    setOpenTransformers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Here you would typically send formData to a server or process it further
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#5b2d90]">
        แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้า<br />ก่อนติดตั้งมิเตอร์สำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆนอกเหนือจากที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน 
      </h1>

      {/* Header Information */}
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
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
            />
          </div>
          <div>
            <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-700 mb-1">
              วันที่ตรวจสอบ:
            </label>
            <input
              type="date"
              id="inspectionDate"
              name="inspectionDate"
              value={formData.inspectionDate}
              onChange={handleChange}
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
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
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
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
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
            />
          </div>
        </div>
      </section>

      {/* 1. ข้อมูลทั่วไป (General Information) */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-5 text-pea-dark">1. ข้อมูลทั่วไป</h2>
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
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
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
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
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
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
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
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary bg-gray"
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
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
            />
          </div>
        </div>
      </section>

      {/* 2. การตรวจสอบ (Inspection) */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-5 text-pea-dark">2. การตรวจสอบ</h2>

       <div className="mb-6 border-b border-gray-200 pb-6">
        <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
          2.1 เอกสารรับรองการออกแบบระบบไฟฟ้า:
        </h3>
        <div className="flex flex-col gap-4 mt-2"> {/* Changed to flex-col for vertical stacking */}

          {/* Option: มี เอกสารรับรองการออกแบบระบบไฟฟ้า ดังนี้ */}
          <div>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="radio"
                name="hasDesignCertification"
                value="yes"
                checked={formData.hasDesignCertification === "yes"}
                onChange={handleChange}
                className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
              />
              <span className="ml-2">มี เอกสารรับรองการออกแบบระบบไฟฟ้า ดังนี้</span>
            </label>
                    <div className="mt-2 pl-6 border-l-2 border-gray-200 ml-2 text-gray-700 text-sm space-y-2"> {/* Indentation and styling */}
                <p>
                  1. วิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรองในแบบติดตั้งระบบไฟฟ้า (As-built Drawing)
                </p>
                <p>
                  2. สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม
                </p>
              </div>
          </div>

          {/* Option: ไม่มี เอกสารรับรองการออกแบบระบบไฟฟ้า */}
          <div>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="radio"
                name="hasDesignCertification"
                value="no"
                checked={formData.hasDesignCertification === "no"}
                onChange={handleChange}
                className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
              />
              <span className="ml-2">ไม่มี เอกสารรับรองการออกแบบระบบไฟฟ้า</span>
            </label>
          </div>
        </div>
      </div>

        {/* 2.2 ระบบจำหน่ายแรงสูง (High Voltage Distribution System) */}
        <div className="mb-6 border-b border-gray-200 pt-6 pb-6">
          <h3 className="text-xl font-semibold mb-4 text-pea-dark">
            2.2 ระบบจำหน่ายแรงสูง (High Voltage Distribution System)
          </h3>

          {/* 2.2.1 ระบบจำหน่ายเหนือดิน (Overhead Distribution System) */}
          <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
            <h4 className="text-lg font-semibold mb-3 text-gray-700">
              2.2.1 ระบบจำหน่ายเหนือดิน (Overhead Distribution System)
            </h4>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  ชนิดสาย (เช่น 33kV, 22kV):
                  <input
                    type="text"
                    name="overhead_cableType"
                    value={formData.overhead_cableType}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                  />
                </label>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_cableType_correct"
                      value="true"
                      checked={formData.overhead_cableType_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_cableType_correct"
                      value="false"
                      checked={formData.overhead_cableType_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_cableType_correct === false && (
                    <input
                      type="text"
                      name="overhead_cableType_note"
                      value={formData.overhead_cableType_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Cable Size */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  ขนาดสาย (ตร.มม.):
                  <input
                    type="text"
                    name="overhead_cableSizeSqmm"
                    value={formData.overhead_cableSizeSqmm}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                  />
                </label>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_cableSize_correct"
                      value="true"
                      checked={formData.overhead_cableSize_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_cableSize_correct"
                      value="false"
                      checked={formData.overhead_cableSize_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_cableSize_correct === false && (
                    <input
                      type="text"
                      name="overhead_cableSize_note"
                      value={formData.overhead_cableSize_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Pole Condition */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  สภาพเสาและอุปกรณ์ประกอบเสา:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_poleCondition_correct"
                      value="true"
                      checked={formData.overhead_poleCondition_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_poleCondition_correct"
                      value="false"
                      checked={formData.overhead_poleCondition_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_poleCondition_correct === false && (
                    <input
                      type="text"
                      name="overhead_poleCondition_note"
                      value={formData.overhead_poleCondition_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Pole Top Equipment */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  การติดตั้งอุปกรณ์บนยอดเสา:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_poleTopEquipment_correct"
                      value="true"
                      checked={formData.overhead_poleTopEquipment_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_poleTopEquipment_correct"
                      value="false"
                      checked={formData.overhead_poleTopEquipment_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_poleTopEquipment_correct === false && (
                    <input
                      type="text"
                      name="overhead_poleTopEquipment_note"
                      value={formData.overhead_poleTopEquipment_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Guy Wire Assembly */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  การติดตั้งสายยึดโยง (Guy Wire Assembly):
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_guyWireAssembly_correct"
                      value="true"
                      checked={formData.overhead_guyWireAssembly_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_guyWireAssembly_correct"
                      value="false"
                      checked={formData.overhead_guyWireAssembly_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_guyWireAssembly_correct === false && (
                    <input
                      type="text"
                      name="overhead_guyWireAssembly_note"
                      value={formData.overhead_guyWireAssembly_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Insulator Type */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  ชนิดของลูกถ้วยฉนวนและอุปกรณ์ประกอบ:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_insulatorType_correct"
                      value="true"
                      checked={formData.overhead_insulatorType_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_insulatorType_correct"
                      value="false"
                      checked={formData.overhead_insulatorType_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_insulatorType_correct === false && (
                    <input
                      type="text"
                      name="overhead_insulatorType_note"
                      value={formData.overhead_insulatorType_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Cable Sagging */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  การหย่อนของสาย:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_cableSagging_correct"
                      value="true"
                      checked={formData.overhead_cableSagging_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_cableSagging_correct"
                      value="false"
                      checked={formData.overhead_cableSagging_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_cableSagging_correct === false && (
                    <input
                      type="text"
                      name="overhead_cableSagging_note"
                      value={formData.overhead_cableSagging_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Clearance */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  ระยะห่าง (Clearance):
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_clearance_correct"
                      value="true"
                      checked={formData.overhead_clearance_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_clearance_correct"
                      value="false"
                      checked={formData.overhead_clearance_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_clearance_correct === false && (
                    <input
                      type="text"
                      name="overhead_clearance_note"
                      value={formData.overhead_clearance_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* HV Surge Arrester (Overhead) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester):
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_hvSurgeArrester_correct"
                      value="true"
                      checked={formData.overhead_hvSurgeArrester_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_hvSurgeArrester_correct"
                      value="false"
                      checked={formData.overhead_hvSurgeArrester_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_hvSurgeArrester_correct === false && (
                    <input
                      type="text"
                      name="overhead_hvSurgeArrester_note"
                      value={formData.overhead_hvSurgeArrester_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Cable Joint Condition */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  สภาพจุดต่อสาย:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_cableJointCondition_correct"
                      value="true"
                      checked={formData.overhead_cableJointCondition_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_cableJointCondition_correct"
                      value="false"
                      checked={formData.overhead_cableJointCondition_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_cableJointCondition_correct === false && (
                    <input
                      type="text"
                      name="overhead_cableJointCondition_note"
                      value={formData.overhead_cableJointCondition_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Grounding (Overhead) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  การต่อลงดิน:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_grounding_correct"
                      value="true"
                      checked={formData.overhead_grounding_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="overhead_grounding_correct"
                      value="false"
                      checked={formData.overhead_grounding_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.overhead_grounding_correct === false && (
                    <input
                      type="text"
                      name="overhead_grounding_note"
                      value={formData.overhead_grounding_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2.2.2 ระบบจำหน่ายใต้ดิน (Underground Distribution System) */}
          <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
            <h4 className="text-lg font-semibold mb-3 text-gray-700">
              2.2.2 ระบบจำหน่ายใต้ดิน (Underground Distribution System)
            </h4>
            <div className="space-y-4">
              {/* Underground Cable Type */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  ชนิดสาย (เช่น 33kV, 22kV):
                  <input
                    type="text"
                    name="underground_cableType"
                    value={formData.underground_cableType}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                  />
                </label>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_cableType_correct"
                      value="true"
                      checked={formData.underground_cableType_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_cableType_correct"
                      value="false"
                      checked={formData.underground_cableType_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.underground_cableType_correct === false && (
                    <input
                      type="text"
                      name="underground_cableType_note"
                      value={formData.underground_cableType_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Underground Cable Size */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  ขนาดสาย (ตร.มม.):
                  <input
                    type="text"
                    name="underground_cableSizeSqmm"
                    value={formData.underground_cableSizeSqmm}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                  />
                </label>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_cableSize_correct"
                      value="true"
                      checked={formData.underground_cableSize_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_cableSize_correct"
                      value="false"
                      checked={formData.underground_cableSize_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.underground_cableSize_correct === false && (
                    <input
                      type="text"
                      name="underground_cableSize_note"
                      value={formData.underground_cableSize_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Visible Cable Condition */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  สภาพสายที่มองเห็นได้:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_visibleCableCondition_correct"
                      value="true"
                      checked={formData.underground_visibleCableCondition_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_visibleCableCondition_correct"
                      value="false"
                      checked={formData.underground_visibleCableCondition_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.underground_visibleCableCondition_correct === false && (
                    <input
                      type="text"
                      name="underground_visibleCableCondition_note"
                      value={formData.underground_visibleCableCondition_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Cable Tension */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  แรงตึงสาย:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_cableTension_correct"
                      value="true"
                      checked={formData.underground_cableTension_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_cableTension_correct"
                      value="false"
                      checked={formData.underground_cableTension_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.underground_cableTension_correct === false && (
                    <input
                      type="text"
                      name="underground_cableTension_note"
                      value={formData.underground_cableTension_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* HV Surge Arrester (Underground) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester):
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_hvSurgeArrester_correct"
                      value="true"
                      checked={formData.underground_hvSurgeArrester_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_hvSurgeArrester_correct"
                      value="false"
                      checked={formData.underground_hvSurgeArrester_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.underground_hvSurgeArrester_correct === false && (
                    <input
                      type="text"
                      name="underground_hvSurgeArrester_note"
                      value={formData.underground_hvSurgeArrester_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Cable Joint Condition (Underground) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  สภาพจุดต่อสาย:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_cableJointCondition_correct"
                      value="true"
                      checked={formData.underground_cableJointCondition_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_cableJointCondition_correct"
                      value="false"
                      checked={formData.underground_cableJointCondition_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.underground_cableJointCondition_correct === false && (
                    <input
                      type="text"
                      name="underground_cableJointCondition_note"
                      value={formData.underground_cableJointCondition_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>

              {/* Grounding (Underground) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                  การต่อลงดิน:
                </span>
                <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_grounding_correct"
                      value="true"
                      checked={formData.underground_grounding_correct === true}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="underground_grounding_correct"
                      value="false"
                      checked={formData.underground_grounding_correct === false}
                      onChange={handleChange}
                      className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                  </label>
                  {formData.underground_grounding_correct === false && (
                    <input
                      type="text"
                      name="underground_grounding_note"
                      value={formData.underground_grounding_note}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                      placeholder="ระบุรายละเอียดการแก้ไข"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2.2.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า) */}
          <h5 className="text-base sm:text-md font-semibold text-gray-700 mb-3">
            2.2.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)
          </h5>
          <div className="mb-4 pl-4 border-l-4 border-pea-secondary">
            <YesNoRadio
              groupName="disconnectingDeviceStatus"
              label="สถานะการติดตั้งเครื่องปลดวงจรต้นทาง"
              currentValue={formData.disconnectingDeviceStatus}
              currentNote={formData.disconnectingDeviceNote}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input
                  type="radio"
                  name="disconnectingDeviceType"
                  value="ดรอพเอาท์ฟิวส์คัตเอาท์"
                  checked={formData.disconnectingDeviceType === "ดรอพเอาท์ฟิวส์คัตเอาท์"}
                  onChange={handleChange}
                  className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                />
                <span className="ml-2">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input
                  type="radio"
                  name="disconnectingDeviceType"
                  value="สวิตช์ตัดตอน"
                  checked={formData.disconnectingDeviceType === "สวิตช์ตัดตอน"}
                  onChange={handleChange}
                  className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                />
                <span className="ml-2">สวิตช์ตัดตอน ชนิด</span>
              </label>
              {formData.disconnectingDeviceType === "สวิตช์ตัดตอน" && (
                <input
                  type="text"
                  name="disconnectingDeviceSwitchType"
                  value={formData.disconnectingDeviceSwitchType}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="ระบุชนิด"
                />
              )}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input
                  type="radio"
                  name="disconnectingDeviceType"
                  value="RMU"
                  checked={formData.disconnectingDeviceType === "RMU"}
                  onChange={handleChange}
                  className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                />
                <span className="ml-2">RMU (ไม่รวมถึงฟังก์ชันการทำงาน)</span>
              </label>
            </div>
          </div>

          {/* 2.2.4 อื่นๆ (High Voltage Distribution System) */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-700">
              2.2.4 อื่นๆ (High Voltage Distribution System)
            </h4>
            <textarea
              name="hvDistributionOther"
              value={formData.hvDistributionOther}
              onChange={handleChange}
              rows="3"
              placeholder="ระบุรายละเอียดเพิ่มเติมสำหรับระบบจำหน่ายแรงสูง"
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
            ></textarea>
          </div>
        </div>

        {/* หม้อแปลง (Transformer) Section */}
        <div className="mb-8 border-t border-gray-200 pt-6">
          <h3 className="text-2xl font-bold mb-4 text-pea-dark">
            หม้อแปลง (Transformer)
          </h3>
          <div className="mb-4">
            <label htmlFor="numTransformers" className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนหม้อแปลง:
            </label>
            <input
              type="number"
              id="numTransformers"
              value={numTransformers}
              onChange={handleNumTransformersChange}
              min="0"
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
            />
          </div>

          {formData.transformers.map((transformer, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md mb-6 border border-gray-200">
              <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleTransformerDetails(index)}>
                <h4 className="text-xl font-semibold text-gray-800">
                  รายละเอียดหม้อแปลง #{index + 1}
                </h4>
                <span className="text-gray-600 text-lg">
                  {openTransformers[index] ? '▲' : '▼'}
                </span>
              </div>

              {openTransformers[index] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 2.5 คุณสมบัติของหม้อแปลง (Transformer Properties) */}
                  <div className="md:col-span-2 border-b border-gray-200 pb-6 mb-6">
                    <h5 className="font-semibold text-gray-700 mb-3 text-lg">
                      2.5 คุณสมบัติของหม้อแปลง
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ผ่านการทดสอบ:
                        </label>
                        <div className="flex items-center space-x-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <input
                              type="radio"
                              name={`transformers[${index}].transformer_tested`}
                              value="yes"
                              checked={transformer.transformer_tested === "yes"}
                              onChange={(e) => handleTransformerChange(index, e)}
                              className="form-radio text-pea-secondary focus:ring-2 focus:ring-purple-400"
                            />
                            <span className="ml-2">ใช่</span>
                          </label>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <input
                              type="radio"
                              name={`transformers[${index}].transformer_tested`}
                              value="no"
                              checked={transformer.transformer_tested === "no"}
                              onChange={(e) => handleTransformerChange(index, e)}
                              className="form-radio text-pea-secondary focus:ring-2 focus:ring-purple-400"
                            />
                            <span className="ml-2">ไม่</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          หมายเลขหม้อแปลง:
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].transformer_number`}
                          value={transformer.transformer_number}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          พิกัด (kVA):
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].transformer_kva`}
                          value={transformer.transformer_kva}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          แรงดันด้านแรงสูง (kV):
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].transformer_hvRating`}
                          value={transformer.transformer_hvRating}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          แรงดันด้านแรงต่ำ (V):
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].transformer_lvRating`}
                          value={transformer.transformer_lvRating}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          อิมพีแดนซ์ (%):
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].transformer_impedance`}
                          value={transformer.transformer_impedance}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ชนิดของหม้อแปลง:
                        </label>
                        <select
                          name={`transformers[${index}].transformer_type`}
                          value={transformer.transformer_type}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary bg-gray"
                        >
                          <option value="">เลือกชนิด</option>
                          <option value="oil">ชนิดน้ำมัน</option>
                          <option value="dry">ชนิดแห้ง</option>
                          <option value="other">อื่นๆ</option>
                        </select>
                        {transformer.transformer_type === "other" && (
                          <input
                            type="text"
                            name={`transformers[${index}].transformer_type_other`}
                            value={transformer.transformer_type_other}
                            onChange={(e) => handleTransformerChange(index, e)}
                            placeholder="ระบุชนิดอื่นๆ"
                            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vector Group:
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].transformer_vectorGroup`}
                          value={transformer.transformer_vectorGroup}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          พิกัดกระแสลัดวงจร:
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].transformer_shortCircuitRating`}
                          value={transformer.transformer_shortCircuitRating}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                          คุณสมบัติถูกต้อง:
                        </span>
                        <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`transformers[${index}].transformer_properties_correct`}
                              value="true"
                              checked={transformer.transformer_properties_correct === true}
                              onChange={(e) => handleTransformerChange(index, e)}
                              className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                            />
                            <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`transformers[${index}].transformer_properties_correct`}
                              value="false"
                              checked={transformer.transformer_properties_correct === false}
                              onChange={(e) => handleTransformerChange(index, e)}
                              className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                            />
                            <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                          </label>
                          {transformer.transformer_properties_correct === false && (
                            <input
                              type="text"
                              name={`transformers[${index}].transformer_properties_note`}
                              value={transformer.transformer_properties_note}
                              onChange={(e) => handleTransformerChange(index, e)}
                              className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                              placeholder="ระบุรายละเอียดการแก้ไข"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2.6 ลักษณะการติดตั้ง (Installation Type) */}
                  <div className="md:col-span-2 border-b border-gray-200 pb-6 mb-6">
                    <h5 className="font-semibold text-gray-700 mb-3 text-lg">
                      2.6 ลักษณะการติดตั้ง
                    </h5>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                        ถูกต้อง:
                      </span>
                      <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].transformer_installationType_correct`}
                            value="true"
                            checked={transformer.transformer_installationType_correct === true}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].transformer_installationType_correct`}
                            value="false"
                            checked={transformer.transformer_installationType_correct === false}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                        </label>
                        {transformer.transformer_installationType_correct === false && (
                          <input
                            type="text"
                            name={`transformers[${index}].transformer_installationType_note`}
                            value={transformer.transformer_installationType_note}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                            placeholder="ระบุรายละเอียดการแก้ไข"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      <label className="inline-flex items-center text-gray-700">
                        <input
                          type="checkbox"
                          name={`transformers[${index}].installationType_suspended`}
                          checked={transformer.installationType_suspended}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="ml-2">ห้อย</span>
                      </label>
                      <label className="inline-flex items-center text-gray-700">
                        <input
                          type="checkbox"
                          name={`transformers[${index}].installationType_onRack`}
                          checked={transformer.installationType_onRack}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="ml-2">บนนั่งร้าน</span>
                      </label>
                      <label className="inline-flex items-center text-gray-700">
                        <input
                          type="checkbox"
                          name={`transformers[${index}].installationType_onGround`}
                          checked={transformer.installationType_onGround}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="ml-2">บนพื้น</span>
                      </label>
                      <label className="inline-flex items-center text-gray-700">
                        <input
                          type="checkbox"
                          name={`transformers[${index}].installationType_onRoof`}
                          checked={transformer.installationType_onRoof}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="ml-2">บนหลังคา</span>
                      </label>
                      <label className="inline-flex items-center text-gray-700">
                        <input
                          type="checkbox"
                          name={`transformers[${index}].installationType_transformerRoom`}
                          checked={transformer.installationType_transformerRoom}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="ml-2">ห้องหม้อแปลง</span>
                      </label>
                      <label className="inline-flex items-center text-gray-700">
                        <input
                          type="checkbox"
                          name={`transformers[${index}].installationType_other`}
                          checked={transformer.installationType_other}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="ml-2">อื่นๆ</span>
                        {transformer.installationType_other && (
                          <input
                            type="text"
                            name={`transformers[${index}].installationType_other_note`}
                            value={transformer.installationType_other_note}
                            onChange={(e) => handleTransformerChange(index, e)}
                            placeholder="ระบุอื่นๆ"
                            className="ml-2 p-2 border border-gray-300 rounded-md min-w-[150px]"
                          />
                        )}
                      </label>
                    </div>
                  </div>

                  {/* 2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า (Incoming Overcurrent Protection) */}
                  <div className="md:col-span-2 border-b border-gray-200 pb-6 mb-6">
                    <h5 className="font-semibold text-gray-700 mb-3 text-lg">
                      2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า
                    </h5>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                        ถูกต้อง:
                      </span>
                      <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].incomingProtection_correct`}
                            value="true"
                            checked={transformer.incomingProtection_correct === true}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].incomingProtection_correct`}
                            value="false"
                            checked={transformer.incomingProtection_correct === false}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                        </label>
                        {transformer.incomingProtection_correct === false && (
                          <input
                            type="text"
                            name={`transformers[${index}].incomingProtection_note`}
                            value={transformer.incomingProtection_note}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                            placeholder="ระบุรายละเอียดการแก้ไข"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
                      <label className="inline-flex items-center text-gray-700">
                        <input
                          type="checkbox"
                          name={`transformers[${index}].incomingProtection_dropOutFuseCutOut`}
                          checked={transformer.incomingProtection_dropOutFuseCutOut}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="ml-2">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
                      </label>
                      <label className="inline-flex items-center text-gray-700">
                        <input
                          type="checkbox"
                          name={`transformers[${index}].incomingProtection_circuitBreaker`}
                          checked={transformer.incomingProtection_circuitBreaker}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="ml-2">เซอร์กิตเบรกเกอร์</span>
                      </label>
                      <label className="inline-flex items-center text-gray-700">
                        <input
                          type="checkbox"
                          name={`transformers[${index}].incomingProtection_other`}
                          checked={transformer.incomingProtection_other}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="ml-2">อื่นๆ</span>
                        {transformer.incomingProtection_other && (
                          <input
                            type="text"
                            name={`transformers[${index}].incomingProtection_other_note`}
                            value={transformer.incomingProtection_other_note}
                            onChange={(e) => handleTransformerChange(index, e)}
                            placeholder="ระบุอื่นๆ"
                            className="ml-2 p-2 border border-gray-300 rounded-md min-w-[150px]"
                          />
                        )}
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          พิกัดกระแสต่อเนื่อง:
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].incomingProtection_continuousRating`}
                          value={transformer.incomingProtection_continuousRating}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          พิกัดกระแสลัดวงจร (Ic Rating):
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].incomingProtection_icRating`}
                          value={transformer.incomingProtection_icRating}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2.8 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester) */}
                  <div className="md:col-span-2 border-b border-gray-200 pb-6 mb-6">
                    <h5 className="font-semibold text-gray-700 mb-3 text-lg">
                      2.8 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)
                    </h5>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                        ถูกต้อง:
                      </span>
                      <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].transformer_hvSurgeArrester_correct`}
                            value="true"
                            checked={transformer.transformer_hvSurgeArrester_correct === true}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].transformer_hvSurgeArrester_correct`}
                            value="false"
                            checked={transformer.transformer_hvSurgeArrester_correct === false}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                        </label>
                        {transformer.transformer_hvSurgeArrester_correct === false && (
                          <input
                            type="text"
                            name={`transformers[${index}].transformer_hvSurgeArrester_note`}
                            value={transformer.transformer_hvSurgeArrester_note}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                            placeholder="ระบุรายละเอียดการแก้ไข"
                          />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          พิกัดแรงดัน (kV):
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].transformer_hvSurgeArrester_voltageRating`}
                          value={transformer.transformer_hvSurgeArrester_voltageRating}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          พิกัดกระแส (kA):
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].transformer_hvSurgeArrester_currentRating`}
                          value={transformer.transformer_hvSurgeArrester_currentRating}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2.9 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง */}
                  <div className="md:col-span-2 border-b border-gray-200 pb-6 mb-6">
                    <h5 className="font-semibold text-gray-700 mb-3 text-lg">
                      2.9 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง
                    </h5>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].transformer_groundingAssembly_correct`}
                            value="true"
                            checked={transformer.transformer_groundingAssembly_correct === true}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].transformer_groundingAssembly_correct`}
                            value="false"
                            checked={transformer.transformer_groundingAssembly_correct === false}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                        </label>
                        {transformer.transformer_groundingAssembly_correct === false && (
                          <input
                            type="text"
                            name={`transformers[${index}].transformer_groundingAssembly_note`}
                            value={transformer.transformer_groundingAssembly_note}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                            placeholder="ระบุรายละเอียดการแก้ไข"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2.10 ค่าความต้านทานดินของระบบแรงสูง */}
                  <div className="md:col-span-2 border-b border-gray-200 pb-6 mb-6">
                    <h5 className="font-semibold text-gray-700 mb-3 text-lg">
                      2.10 ค่าความต้านทานดินของระบบแรงสูง
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ค่าที่วัดได้ (โอห์ม):
                        </label>
                        <input
                          type="text"
                          name={`transformers[${index}].hv_groundResistance`}
                          value={transformer.hv_groundResistance}
                          onChange={(e) => handleTransformerChange(index, e)}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                          ถูกต้อง:
                        </span>
                        <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`transformers[${index}].hv_groundResistance_correct`}
                              value="true"
                              checked={transformer.hv_groundResistance_correct === true}
                              onChange={(e) => handleTransformerChange(index, e)}
                              className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                            />
                            <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`transformers[${index}].hv_groundResistance_correct`}
                              value="false"
                              checked={transformer.hv_groundResistance_correct === false}
                              onChange={(e) => handleTransformerChange(index, e)}
                              className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                            />
                            <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                          </label>
                          {transformer.hv_groundResistance_correct === false && (
                            <input
                              type="text"
                              name={`transformers[${index}].hv_groundResistance_note`}
                              value={transformer.hv_groundResistance_note}
                              onChange={(e) => handleTransformerChange(index, e)}
                              className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                              placeholder="ระบุรายละเอียดการแก้ไข"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน) */}
                  {transformer.transformer_type === "oil" && (
                    <div className="md:col-span-2 border-b border-gray-200 pb-6 mb-6">
                      <h5 className="font-semibold text-gray-700 mb-3 text-lg">
                        2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)
                      </h5>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                            สารดูดความชื้น (Desiccant):
                          </span>
                          <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`transformers[${index}].transformer_desiccant_correct`}
                                value="true"
                                checked={transformer.transformer_desiccant_correct === true}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`transformers[${index}].transformer_desiccant_correct`}
                                value="false"
                                checked={transformer.transformer_desiccant_correct === false}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                            </label>
                            {transformer.transformer_desiccant_correct === false && (
                              <input
                                type="text"
                                name={`transformers[${index}].transformer_desiccant_note`}
                                value={transformer.transformer_desiccant_note}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                                placeholder="ระบุรายละเอียดการแก้ไข"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                            สภาพบุชชิ่ง (Bushing):
                          </span>
                          <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`transformers[${index}].transformer_bushingCondition_correct`}
                                value="true"
                                checked={transformer.transformer_bushingCondition_correct === true}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`transformers[${index}].transformer_bushingCondition_correct`}
                                value="false"
                                checked={transformer.transformer_bushingCondition_correct === false}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                            </label>
                            {transformer.transformer_bushingCondition_correct === false && (
                              <input
                                type="text"
                                name={`transformers[${index}].transformer_bushingCondition_note`}
                                value={transformer.transformer_bushingCondition_note}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                                placeholder="ระบุรายละเอียดการแก้ไข"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                            ระดับน้ำมัน:
                          </span>
                          <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`transformers[${index}].transformer_oilLevel_correct`}
                                value="true"
                                checked={transformer.transformer_oilLevel_correct === true}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`transformers[${index}].transformer_oilLevel_correct`}
                                value="false"
                                checked={transformer.transformer_oilLevel_correct === false}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                            </label>
                            {transformer.transformer_oilLevel_correct === false && (
                              <input
                                type="text"
                                name={`transformers[${index}].transformer_oilLevel_note`}
                                value={transformer.transformer_oilLevel_note}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                                placeholder="ระบุรายละเอียดการแก้ไข"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                            การรั่วไหลของน้ำมัน:
                          </span>
                          <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`transformers[${index}].transformer_oilLeakage_correct`}
                                value="true"
                                checked={transformer.transformer_oilLeakage_correct === true}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`transformers[${index}].transformer_oilLeakage_correct`}
                                value="false"
                                checked={transformer.transformer_oilLeakage_correct === false}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                            </label>
                            {transformer.transformer_oilLeakage_correct === false && (
                              <input
                                type="text"
                                name={`transformers[${index}].transformer_oilLeakage_note`}
                                value={transformer.transformer_oilLeakage_note}
                                onChange={(e) => handleTransformerChange(index, e)}
                                className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                                placeholder="ระบุรายละเอียดการแก้ไข"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2.12 ป้ายเตือน (Warning Sign) */}
                  <div className="md:col-span-2 border-b border-gray-200 pb-6 mb-6">
                    <h5 className="font-semibold text-gray-700 mb-3 text-lg">
                      2.12 ป้ายเตือน
                    </h5>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-sm sm:text-base font-medium text-gray-700 w-full sm:w-1/3">
                        ถูกต้อง:
                      </span>
                      <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 sm:mt-0 sm:ml-auto">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].warningSign_correct`}
                            value="true"
                            checked={transformer.warningSign_correct === true}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`transformers[${index}].warningSign_correct`}
                            value="false"
                            checked={transformer.warningSign_correct === false}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="block text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
                        </label>
                        {transformer.warningSign_correct === false && (
                          <input
                            type="text"
                            name={`transformers[${index}].warningSign_note`}
                            value={transformer.warningSign_note}
                            onChange={(e) => handleTransformerChange(index, e)}
                            className="flex-1 p-2 border border-gray-300 rounded-md mt-2 sm:mt-0 focus:ring-2 focus:ring-purple-400 focus:border-transparent min-w-[150px] sm:w-auto"
                            placeholder="ระบุรายละเอียดการแก้ไข"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2.13 อื่นๆ (Transformer) */}
                  <div className="md:col-span-2 border-b border-gray-200 pb-6 mb-6">
                    <h5 className="font-semibold text-gray-700 mb-3 text-lg">
                      2.13 อื่นๆ (Transformer)
                    </h5>
                    <textarea
                      name={`transformers[${index}].transformerOther`}
                      value={transformer.transformerOther}
                      onChange={(e) => handleTransformerChange(index, e)}
                      rows="3"
                      placeholder="ระบุรายละเอียดเพิ่มเติมสำหรับหม้อแปลง"
                      className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 3. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า (Summary of Electrical System Installation Inspection Results) */}
        <div className="mb-8 border-t border-gray-200 pt-6">
          <h3 className="text-2xl font-bold mb-4 text-pea-dark">
            3. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า
          </h3>
          <div className="flex items-center space-x-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="radio"
                name="installationResult"
                value="pass"
                checked={formData.installationResult === "pass"}
                onChange={handleChange}
                className="form-radio text-green-600 focus:ring-2 focus:ring-green-400"
              />
              <span className="ml-2">ผ่าน</span>
            </label>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="radio"
                name="installationResult"
                value="fail"
                checked={formData.installationResult === "fail"}
                onChange={handleChange}
                className="form-radio text-red-600 focus:ring-2 focus:ring-red-400"
              />
              <span className="ml-2">ไม่ผ่าน</span>
            </label>
          </div>
        </div>

        {/* 4. ขอบเขตและข้อจำกัดในการตรวจสอบ (Scope and Limitations of Inspection) */}
        <div className="mb-8 border-t border-gray-200 pt-6">
          <h3 className="text-2xl font-bold mb-4 text-pea-dark">
            4. ขอบเขตและข้อจำกัดในการตรวจสอบ
          </h3>
          <textarea
            name="scopeAndLimitations"
            value={formData.scopeAndLimitations}
            onChange={handleChange}
            rows="4"
            placeholder="ระบุขอบเขตและข้อจำกัดในการตรวจสอบ"
            className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-pea-secondary focus:ring-pea-secondary"
          ></textarea>
        </div>

<section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignaturePad title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" ref={userSigRef} onSave={(dataUrl) => handleSignatureSave('userSignature', dataUrl)} onClear={() => handleSignatureClear('userSignature')}/>
          <SignaturePad title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" ref={inspectorSigRef} onSave={(dataUrl) => handleSignatureSave('inspectorSignature', dataUrl)} onClear={() => handleSignatureClear('inspectorSignature')}/>
        </div>
      </section>
      </section>

      <div className="text-center mt-10">
        <button
          type="submit"
          className="px-8 py-4 bg-pea-primary text-white font-semibold text-lg rounded-full shadow-lg hover:bg-pea-dark focus:outline-none focus:ring-4 focus:ring-pea-secondary focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          บันทึกข้อมูล
        </button>
      </div>
    </form>
  );
}