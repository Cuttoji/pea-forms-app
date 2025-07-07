"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InspectionPDF from '@/components/forms/InspectionPDF';
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';

export default function EvChargerHvForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userSigRef = useRef(null);
  const inspectorSigRef = useRef(null);

  const [formData, setFormData] = useState({
    // Header Info
    peaOffice: "",
    inspectionCount: "",
    inspectionDate: "",
    requestNumber: "",
    requestDate: "",

    // 1. General Information
    userType: "", // "individual" or "juristic"
    individualName: "",
    individualPhone: "",
    juristicName: "",
    juristicPhone: "",
    address: "",
    voltageSystem: "", // "22 kV" or "33 kV"
    totalLoadAmp: "",
    numChargers: "",
    totalChargerPowerKw: "",

    // 2. Document Checklist - Individual
    docSpecEvCharger: false,
    docSingleLineDiagram: false,
    docLoadSchedule: false,
    docIndividualComplete: false,
    docIndividualNote: "",

    // 2. Document Checklist - Public
    docPublicSingleLineDiagram: false,
    docPublicAsBuiltDrawing: false,
    docPublicLoadSchedule: false,
    docPublicEngineerLicense: false,
    docPublicSpecEvCharger: false,
    docPublicNotificationOrLicense: false,
    docPublicComplete: false,
    docPublicNote: "",

    // 3. High Voltage Distribution System
    // 3.1 Overhead Distribution System
    overheadCableType: "",
    overheadCableTypeStatus: "", // "correct" or "fix"
    overheadCableTypeNote: "",
    overheadCableSizeSqmm: "",
    overheadCableSizeStatus: "",
    overheadCableSizeNote: "",
    poleConditionStatus: "",
    poleConditionNote: "",
    poleHeadAssemblyStatus: "",
    poleHeadAssemblyNote: "",
    guyWireAssemblyStatus: "",
    guyWireAssemblyNote: "",
    insulatorConditionStatus: "",
    insulatorConditionNote: "",
    cableSpanConditionStatus: "",
    cableSpanConditionNote: "",
    cableClearanceStatus: "",
    cableClearanceNote: "",
    hvSurgeArresterStatus: "",
    hvSurgeArresterNote: "",
    jointConditionStatus: "",
    jointConditionNote: "",
    groundingOverheadStatus: "",
    groundingOverheadNote: "",

    // 3.2 Underground Distribution System
    undergroundCableType: "",
    undergroundCableTypeStatus: "",
    undergroundCableTypeNote: "",
    undergroundCableSizeSqmm: "",
    undergroundCableSizeStatus: "",
    undergroundCableSizeNote: "",
    visibleCableConditionStatus: "",
    visibleCableConditionNote: "",
    cableTensionStatus: "",
    cableTensionNote: "",
    hvSurgeArresterUndergroundStatus: "",
    hvSurgeArresterUndergroundNote: "",
    jointConditionUndergroundStatus: "",
    jointConditionUndergroundNote: "",
    groundingUndergroundStatus: "",
    groundingUndergroundNote: "",

    // 3.3 Upstream Disconnecting Device
    disconnectingDeviceType: "", // dropdown: "dropout-fuse-cutout", "switch-disconnect", "rmu"
    disconnectingDeviceSwitchType: "", // for switch-disconnect
    disconnectingDeviceStatus: "",
    disconnectingDeviceNote: "",

    // 3.4 Others
    otherHvNotes: "",

    // 4. Transformer
    transformerTestStatus: "", // "pass" or "fail"
    transformerNum: "",
    transformerSizeKva: "",
    hvVoltageRatingKv: "",
    lvVoltageRatingV: "",
    impedancePercent: "",
    transformerType: "", // "Oil", "Dry", "Other"
    transformerOtherType: "",
    vectorGroup: "",
    shortCircuitRatingKa: "",
    transformerPropertyStatus: "",
    transformerPropertyNote: "",

    // 4.2 Installation Type
    installationType: [], // Array of selected types
    installationTypeOther: "",
    installationTypeStatus: "",
    installationTypeNote: "",

    // 4.3 Overcurrent Protection (Input Side)
    overcurrentProtectionType: "", // "dropout-fuse-cutout", "circuit-breaker", "other"
    overcurrentProtectionOtherType: "",
    continuousCurrentRatingA: "",
    interruptingCapacityKa: "",
    overcurrentProtectionStatus: "",
    overcurrentProtectionNote: "",

    // 4.4 HV Surge Arrester Installation
    hvSurgeArresterTransformerStatus: "",
    hvSurgeArresterTransformerNote: "",
    hvSurgeArresterVoltageRatingKv: "",
    hvSurgeArresterCurrentRatingKa: "",

    // 4.5 Transformer Body & HV Surge Arrester Grounding
    transformerGroundingStatus: "",
    transformerGroundingNote: "",

    // 4.6 HV Ground Resistance
    hvGroundResistanceOhm: "",
    hvGroundResistanceStatus: "",
    hvGroundResistanceNote: "",

    // 4.7 Transformer External Condition (Oil Type Only)
    desiccantStatus: "",
    desiccantNote: "",
    bushingConditionStatus: "",
    bushingConditionNote: "",
    oilLevelStatus: "",
    oilLevelNote: "",
    oilLeakageStatus: "",
    oilLeakageNote: "",

    // 4.8 Warning Sign
    warningSignStatus: "",
    warningSignNote: "",

    // 4.9 Others
    otherTransformerNotes: "",

    // 5. Low Voltage System
    // 5.1 LV Main Circuit
    mainCableStandard: "", // "มอก. 11-2553", "มอก. 293-2541", "IEC 60502"
    mainCableStandardStatus: "",
    mainCableStandardNote: "",
    mainCableType: "", // "IEC01", "NYY", "CV", "Other"
    mainCableTypeOther: "",
    mainCableTypeStatus: "",
    mainCableTypeNote: "",
    mainPhaseCableSizeSqmm: "", // Phase cable size
    mainPhaseCableSizeStatus: "",
    mainPhaseCableSizeNote: "",
    mainNeutralCableSizeSqmm: "", // Neutral cable size
    mainNeutralCableSizeStatus: "",
    mainNeutralCableSizeNote: "",
    phaseMarkingStatus: "",
    phaseMarkingNote: "",
    conduitContinuityStatus: "",
    conduitContinuityNote: "",

    // 5.1.7 Wiring Method
    wiringMethod: [], // Array of selected methods
    wiringMethodOther: "",
    wiringMethodStatus: "",
    wiringMethodNote: "",

    // 5.1.8 Conduit Type
    conduitMetalType: [], // Array of selected metal types
    conduitNonMetalType: [], // Array of selected non-metal types
    conduitOtherType: "",
    conduitTypeStatus: "",
    conduitTypeNote: "",

    // 5.2 Main Switchboard Overcurrent Protection
    mainBreakerStandardStatus: "",
    mainBreakerStandardNote: "",
    mainBreakerAmpRating: "",
    mainBreakerAmpRatingStatus: "",
    mainBreakerAmpRatingNote: "",
    mainBreakerIcRatingKa: "",
    mainBreakerIcRatingStatus: "",
    mainBreakerIcRatingNote: "",
    gfpInstalled: false, // Checkbox for GFP
    gfpStatus: "", // For GFP if it's correct/fix
    gfpNote: "",

    // 5.3 Main Switchboard Grounding System
    groundConductorSizeSqmm: "",
    groundConductorSizeStatus: "",
    groundConductorSizeNote: "",
    groundingOnePhaseStatus: "", // for 1 phase system
    groundingOnePhaseNote: "",
    groundingThreePhaseStatus: "", // for 3 phase system
    groundingThreePhaseNote: "",

    // 5.4 Grounding Type at Main Switchboard
    groundingForm: "", // "TN-C-S", "TT", "TT-partial", "TN-S"

    // 5.4.1 TN-C-S Full System
    tncsLoadBalanceOk: false,
    tncsLoadBalanceNote: "",
    tncsNeutralProtectionOk: false,
    tncsNeutralProtectionNote: "",
    tncsTouchVoltageProtectionOk: false,
    tncsTouchVoltageProtectionNote: "",
    tncsOverallStatus: "",
    tncsOverallNote: "",

    // 5.4.2 TT Full System
    ttRcdInstalled: false,
    ttRcdStatus: "",
    ttRcdNote: "",

    // 5.4.3 TT Partial System
    ttpRiskAssessmentOk: false,
    ttpRiskAssessmentNote: "",
    ttpGroundRodDistanceOk: false,
    ttpGroundRodDistanceNote: "",
    ttpWarningSignOk: false,
    ttpWarningSignNote: "",
    ttpNeutralProtectionOk: false,
    ttpNeutralProtectionNote: "",
    ttpTncsGroundResistanceOk: false,
    ttpTncsGroundResistanceNote: "",
    ttpOverallStatus: "",
    ttpOverallNote: "",

    // 5.4.4 TN-S Full System
    tnsGroundResistanceOk: false,
    tnsGroundResistanceNote: "",
    tnsOverallStatus: "",
    tnsOverallNote: "",

    // 5.5 Feeder Circuit / Panel board (if any)
    // 5.5.1 Feeder Circuit
    feederCableStandard: "",
    feederCableStandardStatus: "",
    feederCableStandardNote: "",
    feederCableType: "",
    feederCableTypeOther: "",
    feederCableTypeStatus: "",
    feederCableTypeNote: "",
    feederPhaseCableSizeSqmm: "",
    feederPhaseCableSizeStatus: "",
    feederPhaseCableSizeNote: "",
    feederNeutralCableSizeSqmm: "",
    feederNeutralCableSizeStatus: "",
    feederNeutralCableSizeNote: "",
    feederGroundCableSizeSqmm: "",
    feederGroundCableSizeStatus: "",
    feederGroundCableSizeNote: "",
    feederPhaseMarkingStatus: "",
    feederPhaseMarkingNote: "",
    feederConduitContinuityStatus: "",
    feederConduitContinuityNote: "",

    // 5.5.2 Wiring Method (Feeder)
    feederWiringMethod: [],
    feederWiringMethodOther: "",
    feederWiringMethodStatus: "",
    feederWiringMethodNote: "",

    // 5.5.3 Conduit Type (Feeder)
    feederConduitMetalType: [],
    feederConduitNonMetalType: [],
    feederConduitFlexibleMetalType: false,
    feederConduitOtherType: "",
    feederConduitTypeStatus: "",
    feederConduitTypeNote: "",

    // 5.5.4 Feeder Circuit Breaker
    feederBreakerStandardStatus: "",
    feederBreakerStandardNote: "",
    feederBreakerAmpRating: "",
    feederBreakerAmpRatingStatus: "",
    feederBreakerAmpRatingNote: "",

    // 5.5.5 Panel Board Installation
    panelBoardRatingOk: false,
    panelBoardRatingNote: "",
    panelBoardGroundNeutralSeparationOk: false,
    panelBoardGroundNeutralSeparationNote: "",

    // Signatures
    userSignature: "",
    inspectorSignature: "",
  });

  // Automatically set inspectionDate and requestDate
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle array values for checkboxes (multi-select)
    if (type === 'checkbox' && (name.includes('installationType') || name.includes('wiringMethod') || name.includes('conduitMetalType') || name.includes('conduitNonMetalType') || name.includes('feederWiringMethod') || name.includes('feederConduitMetalType') || name.includes('feederConduitNonMetalType'))) {
      setFormData(prev => {
        const currentArray = prev[name];
        if (checked) {
          return { ...prev, [name]: [...currentArray, value] };
        } else {
          return { ...prev, [name]: currentArray.filter(item => item !== value) };
        }
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleRadioChange = (groupName, value, noteName = null) => {
    setFormData(prev => ({
      ...prev,
      [groupName]: value,
      ...(noteName && { [noteName]: value === 'ถูกต้อง' ? '' : prev[noteName] || '' }) // Clear note if "ถูกต้อง" is selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Your form submission logic here
      console.log("ส่งข้อมูล:", formData);
      
      // Add a small delay to simulate submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message or redirect
      alert('บันทึกข้อมูลสำเร็จ');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component for Yes/No radio buttons with note
  const YesNoRadio = ({ name, label, value, noteName, onChange }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-4 mt-2">
        <label className="block text-sm font-medium text-gray-700">
          <input
            type="radio"
            name={name}
            value="ถูกต้อง"
            checked={value === 'ถูกต้อง'}
            onChange={() => onChange(name, 'ถูกต้อง', noteName)}
            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
          />
          <span className="text-sm font-medium text-gray-700 ml-2">ถูกต้อง</span>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          <input
            type="radio"
            name={name}
            value="ต้องแก้ไข"
            checked={value === 'ต้องแก้ไข'}
            onChange={() => onChange(name, 'ต้องแก้ไข', noteName)}
            className="text-[#5b2d90] focus:ring-2 focus:ring-purple-400"
          />
          <span className="text-sm font-medium text-gray-700 ml-2">ต้องแก้ไข</span>
        </label>
      </div>
      {value === 'ต้องแก้ไข' && (
        <input
          type="text"
          name={noteName}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent mt-2"
          value={formData[noteName] || ''}
          onChange={handleChange}
          placeholder="โปรดระบุรายละเอียด"
        />
      )}
    </div>
  );


  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#5b2d90]">
        แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
        <br />
        สำหรับผู้ใช้ไฟฟ้าที่รับไฟฟ้าแรงสูงโดยติดตั้งหม้อแปลงเฉพาะราย
      </h2>

      {/* Header Info */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
        <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">ข้อมูลการตรวจสอบ</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">การไฟฟ้า</label>
            <input
              type="text"
              name="peaOffice"
              value={formData.peaOffice}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">การตรวจสอบครั้งที่</label>
            <input
              type="text"
              name="inspectionCount"
              value={formData.inspectionCount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">วันที่ตรวจสอบ</label>
            <input
              type="date"
              name="inspectionDate"
              value={formData.inspectionDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">เลขที่คำร้องขอใช้ไฟ</label>
            <input
              type="text"
              name="requestNumber"
              value={formData.requestNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">วันที่คำร้อง</label>
            <input
              type="date"
              name="requestDate"
              value={formData.requestDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
      </div>

      {/* 1. General Information */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
        <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">1. ข้อมูลทั่วไป</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ประเภทผู้ขอใช้ไฟฟ้า</label>
            <div className="flex gap-4">
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="userType"
                  value="individual"
                  checked={formData.userType === "individual"}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ชื่อ-นามสกุล ผู้ขอใช้ไฟฟ้า</span>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="userType"
                  value="juristic"
                  checked={formData.userType === "juristic"}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ชื่อนิติบุคคล ที่ขอใช้ไฟฟ้า</span>
              </label>
            </div>
          </div>

          {formData.userType === "individual" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  name="individualName"
                  value={formData.individualName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <label className="block text-sm font-medium text-gray-700">โทรศัพท์</label>
                <input
                  type="text"
                  name="individualPhone"
                  value={formData.individualPhone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {formData.userType === "juristic" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อนิติบุคคล</label>
                <input
                  type="text"
                  name="juristicName"
                  value={formData.juristicName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">โทรศัพท์</label>
                <input
                  type="text"
                  name="juristicPhone"
                  value={formData.juristicPhone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md min-h-[80px]"
            ></textarea>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">ระบบไฟฟ้า</label>
              <div className="flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="voltageSystem"
                    value="22 kV"
                    checked={formData.voltageSystem === "22 kV"}
                    onChange={handleChange}
                    className="text-[#5b2d90]"
                  />
                  <span className="text-sm font-medium text-gray-700 ml-2">22 kV</span>
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="voltageSystem"
                    value="33 kV"
                    checked={formData.voltageSystem === "33 kV"}
                    onChange={handleChange}
                    className="text-[#5b2d90]"
                  />
                  <span className="text-sm font-medium text-gray-700 ml-2">33 kV</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">กระแสโหลด (ด้านแรงต่ำ) รวมโดยประมาณ (แอมแปร์)</label>
              <input
                type="number"
                name="totalLoadAmp"
                value={formData.totalLoadAmp}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้ารวม (เครื่อง)</label>
              <input
                type="number"
                name="numChargers"
                value={formData.numChargers}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">พิกัดกำลังไฟฟ้ารวมของเครื่องอัดประจุยานยนต์ไฟฟ้า (kW)</label>
              <input
                type="number"
                name="totalChargerPowerKw"
                value={formData.totalChargerPowerKw}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Document Checklist */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
        <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">2. เอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า</h3>

        {/* 2.1 Individual Case */}
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
          <h4 className="text-lg font-semibold mb-2">
            2.1 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่ส่วนบุคคล
          </h4>
          <div className="space-y-2 mb-4">
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="docSpecEvCharger"
                checked={formData.docSpecEvCharger}
                onChange={handleChange}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
            </label>
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="docSingleLineDiagram"
                checked={formData.docSingleLineDiagram}
                onChange={handleChange}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">แผนผังระบบไฟฟ้า (Single Line Diagram)</span>
            </label>
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="docLoadSchedule"
                checked={formData.docLoadSchedule}
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
                name="docIndividualComplete"
                value={true}
                checked={formData.docIndividualComplete === true}
                onChange={() => handleRadioChange("docIndividualComplete", true, "docIndividualNote")}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">ครบถ้วน</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="docIndividualComplete"
                value={false}
                checked={formData.docIndividualComplete === false}
                onChange={() => handleRadioChange("docIndividualComplete", false, "docIndividualNote")}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">ไม่ครบถ้วน</span>
            </label>
          </div>
          {formData.docIndividualComplete === false && (
            <textarea
              name="docIndividualNote"
              value={formData.docIndividualNote}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-2 min-h-[60px]"
              placeholder="ระบุรายละเอียดที่ไม่ครบถ้วน"
            ></textarea>
          )}
        </div>

        {/* 2.2 Public Case */}
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
          <h4 className="text-lg font-semibold mb-2">
            2.2 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่สาธารณะ
          </h4>
          <div className="space-y-2 mb-4">
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="docPublicSingleLineDiagram"
                checked={formData.docPublicSingleLineDiagram}
                onChange={handleChange}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">แผนผังระบบไฟฟ้า (Single Line Diagram) ระบุพิกัด...</span>
            </label>
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="docPublicAsBuiltDrawing"
                checked={formData.docPublicAsBuiltDrawing}
                onChange={handleChange}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">แบบติดตั้งระบบไฟฟ้า (As-built Drawing)...</span>
            </label>
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="docPublicLoadSchedule"
                checked={formData.docPublicLoadSchedule}
                onChange={handleChange}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า...</span>
            </label>
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="docPublicEngineerLicense"
                checked={formData.docPublicEngineerLicense}
                onChange={handleChange}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรมไฟฟ้า</span>
            </label>
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="docPublicSpecEvCharger"
                checked={formData.docPublicSpecEvCharger}
                onChange={handleChange}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า...</span>
            </label>
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="docPublicNotificationOrLicense"
                checked={formData.docPublicNotificationOrLicense}
                onChange={handleChange}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">หนังสือจดแจ้ง (พิกัดน้อยกว่า 1,000 kVA) หรือใบอนุญาต...</span>
            </label>
          </div>
          <div className="flex gap-4 items-center">
            <label className="block text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="docPublicComplete"
                value={true}
                checked={formData.docPublicComplete === true}
                onChange={() => handleRadioChange("docPublicComplete", true, "docPublicNote")}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">ครบถ้วน</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="docPublicComplete"
                value={false}
                checked={formData.docPublicComplete === false}
                onChange={() => handleRadioChange("docPublicComplete", false, "docPublicNote")}
                className="text-[#5b2d90]"
              />
              <span className="text-sm font-medium text-gray-700 ml-2">ไม่ครบถ้วน</span>
            </label>
          </div>
          {formData.docPublicComplete === false && (
            <textarea
              name="docPublicNote"
              value={formData.docPublicNote}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-2 min-h-[100px]"
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
        <h4 className="text-lg font-semibold mb-2">3.1 ระบบจำหน่ายเหนือดิน</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <YesNoRadio
            name="overheadCableTypeStatus"
            label="3.1.1 ชนิดสายตัวนำ..............................เหมาะสมกับพื้นที่และสภาพแวดล้อม"
            value={formData.overheadCableTypeStatus}
            noteName="overheadCableTypeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="overheadCableType"
            value={formData.overheadCableType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ชนิดสายตัวนำ"
          />

          <YesNoRadio
            name="overheadCableSizeStatus"
            label="3.1.2 ขนาดสายตัวนำ............................ตร.มม."
            value={formData.overheadCableSizeStatus}
            noteName="overheadCableSizeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="overheadCableSizeSqmm"
            value={formData.overheadCableSizeSqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาดสายตัวนำ (ตร.มม.)"
          />

          <YesNoRadio
            name="poleConditionStatus"
            label="3.1.3 สภาพเสาและระยะห่างระหว่างเสา"
            value={formData.poleConditionStatus}
            noteName="poleConditionNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="poleHeadAssemblyStatus"
            label="3.1.4 การประกอบอุปกรณ์หัวเสา"
            value={formData.poleHeadAssemblyStatus}
            noteName="poleHeadAssemblyNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="guyWireAssemblyStatus"
            label="3.1.5 การประกอบชุดยึดโยง"
            value={formData.guyWireAssemblyStatus}
            noteName="guyWireAssemblyNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="insulatorConditionStatus"
            label="3.1.6 ลูกถ้วยและฉนวนของอุปกรณ์ไฟฟ้าเหมาะสมกับสภาพแวดล้อม"
            value={formData.insulatorConditionStatus}
            noteName="insulatorConditionNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="cableSpanConditionStatus"
            label="3.1.7 การพาดสาย (สภาพสาย, ระยะหย่อนยาน)"
            value={formData.cableSpanConditionStatus}
            noteName="cableSpanConditionNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="cableClearanceStatus"
            label="3.1.8 ระยะห่างของสายกับอาคาร สิ่งก่อสร้าง หรือต้นไม้"
            value={formData.cableClearanceStatus}
            noteName="cableClearanceNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="hvSurgeArresterStatus"
            label="3.1.9 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)"
            value={formData.hvSurgeArresterStatus}
            noteName="hvSurgeArresterNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="jointConditionStatus"
            label="3.1.10 สภาพของจุดต่อสาย"
            value={formData.jointConditionStatus}
            noteName="jointConditionNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="groundingOverheadStatus"
            label="3.1.11 การต่อลงดิน"
            value={formData.groundingOverheadStatus}
            noteName="groundingOverheadNote"
            onChange={handleRadioChange}
          />
        </div>

        {/* 3.2 Underground Distribution System */}
        <h4 className="text-lg font-semibold mb-2">3.2 ระบบจำหน่ายใต้ดิน</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <YesNoRadio
            name="undergroundCableTypeStatus"
            label="3.2.1 ชนิดสายตัวนำ..............................เหมาะสมกับพื้นที่และสภาพแวดล้อม"
            value={formData.undergroundCableTypeStatus}
            noteName="undergroundCableTypeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="undergroundCableType"
            value={formData.undergroundCableType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ชนิดสายตัวนำ"
          />

          <YesNoRadio
            name="undergroundCableSizeStatus"
            label="3.2.2 ขนาดสายตัวนำ............................ตร.มม."
            value={formData.undergroundCableSizeStatus}
            noteName="undergroundCableSizeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="undergroundCableSizeSqmm"
            value={formData.undergroundCableSizeSqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาดสายตัวนำ (ตร.มม.)"
          />

          <YesNoRadio
            name="visibleCableConditionStatus"
            label="3.2.3 สภาพสายส่วนที่มองเห็นได้"
            value={formData.visibleCableConditionStatus}
            noteName="visibleCableConditionNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="cableTensionStatus"
            label="3.2.4 ความตึงของสายช่วงเข้า-ออก อาคารหรือสิ่งก่อสร้าง"
            value={formData.cableTensionStatus}
            noteName="cableTensionNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="hvSurgeArresterUndergroundStatus"
            label="3.2.5 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)"
            value={formData.hvSurgeArresterUndergroundStatus}
            noteName="hvSurgeArresterUndergroundNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="jointConditionUndergroundStatus"
            label="3.2.6 สภาพของจุดต่อสาย"
            value={formData.jointConditionUndergroundStatus}
            noteName="jointConditionUndergroundNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="groundingUndergroundStatus"
            label="3.2.7 การต่อลงดิน"
            value={formData.groundingUndergroundStatus}
            noteName="groundingUndergroundNote"
            onChange={handleRadioChange}
          />
        </div>

        {/* 3.3 Upstream Disconnecting Device */}
        <h4 className="text-lg font-semibold mb-2">3.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <YesNoRadio
            name="disconnectingDeviceStatus"
            label="สถานะการติดตั้งเครื่องปลดวงจรต้นทาง"
            value={formData.disconnectingDeviceStatus}
            noteName="disconnectingDeviceNote"
            onChange={handleRadioChange}
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="disconnectingDeviceType" value="ดรอพเอาท์ฟิวส์คัตเอาท์" checked={formData.disconnectingDeviceType === "ดรอพเอาท์ฟิวส์คัตเอาท์"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="disconnectingDeviceType" value="สวิตช์ตัดตอน" checked={formData.disconnectingDeviceType === "สวิตช์ตัดตอน"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">สวิตช์ตัดตอน ชนิด</span>
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
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="disconnectingDeviceType" value="RMU" checked={formData.disconnectingDeviceType === "RMU"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">RMU (ไม่รวมถึงฟังก์ชันการทำงาน)</span>
            </label>
          </div>
        </div>

        {/* 3.4 Others */}
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
          <h4 className="text-lg font-semibold mb-2">3.4 อื่นๆ</h4>
          <textarea
            name="otherHvNotes"
            value={formData.otherHvNotes}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md min-h-[80px]"
          ></textarea>
        </div>
      </div>

      {/* 4. Transformer */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
        <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">4. หม้อแปลง</h3>

        {/* 4.1 Transformer General Properties */}
        <h4 className="text-lg font-semibold mb-2">4.1 คุณสมบัติทั่วไปของหม้อแปลง</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <div className="flex gap-4 items-center">
            <label className="block text-sm font-medium text-gray-700">ผ่านการทดสอบ:</label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="transformerTestStatus" value="pass" checked={formData.transformerTestStatus === "pass"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">ผ่านการทดสอบ</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="transformerTestStatus" value="fail" checked={formData.transformerTestStatus === "fail"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">ไม่ผ่านการทดสอบ</span>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">หม้อแปลงเครื่องที่</label>
              <input type="text" name="transformerNum" value={formData.transformerNum} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ขนาด (kVA)</label>
              <input type="number" name="transformerSizeKva" value={formData.transformerSizeKva} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">พิกัดแรงดันด้านแรงสูง (kV)</label>
              <input type="text" name="hvVoltageRatingKv" value={formData.hvVoltageRatingKv} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">พิกัดแรงดันด้านแรงต่ำ (V)</label>
              <input type="text" name="lvVoltageRatingV" value={formData.lvVoltageRatingV} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">% Impedance</label>
              <input type="text" name="impedancePercent" value={formData.impedancePercent} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ชนิด</label>
              <div className="flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  <input type="radio" name="transformerType" value="Oil" checked={formData.transformerType === "Oil"} onChange={handleChange} className="text-[#5b2d90]" />
                  <span className="text-sm font-medium text-gray-700 ml-2">Oil</span>
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  <input type="radio" name="transformerType" value="Dry" checked={formData.transformerType === "Dry"} onChange={handleChange} className="text-[#5b2d90]" />
                  <span className="text-sm font-medium text-gray-700 ml-2">Dry</span>
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  <input type="radio" name="transformerType" value="Other" checked={formData.transformerType === "Other"} onChange={handleChange} className="text-[#5b2d90]" />
                  <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
                </label>
                {formData.transformerType === "Other" && (
                  <input type="text" name="transformerOtherType" value={formData.transformerOtherType} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ระบุ" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vector Group</label>
              <input type="text" name="vectorGroup" value={formData.vectorGroup} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">พิกัดการทนกระแสลัดวงจรสูงสุด (kA)</label>
              <input type="text" name="shortCircuitRatingKa" value={formData.shortCircuitRatingKa} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>
          <YesNoRadio
            name="transformerPropertyStatus"
            label="คุณสมบัติหม้อแปลง"
            value={formData.transformerPropertyStatus}
            noteName="transformerPropertyNote"
            onChange={handleRadioChange}
          />
        </div>

        {/* 4.2 Installation Type */}
        <h4 className="text-lg font-semibold mb-2">4.2 ลักษณะการติดตั้ง</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="installationType" value="แขวน" checked={formData.installationType.includes("แขวน")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">แขวน</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="installationType" value="นั่งร้าน" checked={formData.installationType.includes("นั่งร้าน")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">นั่งร้าน</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="installationType" value="ตั้งพื้น" checked={formData.installationType.includes("ตั้งพื้น")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">ตั้งพื้น</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="installationType" value="ตั้งบนดาดฟ้า" checked={formData.installationType.includes("ตั้งบนดาดฟ้า")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">ตั้งบนดาดฟ้า</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="installationType" value="ห้องหม้อแปลง" checked={formData.installationType.includes("ห้องหม้อแปลง")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">ห้องหม้อแปลง</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="installationType" value="อื่นๆ" checked={formData.installationType.includes("อื่นๆ")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
            </label>
            {formData.installationType.includes("อื่นๆ") && (
              <input type="text" name="installationTypeOther" value={formData.installationTypeOther} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ระบุ" />
            )}
          </div>
          <YesNoRadio
            name="installationTypeStatus"
            label="สถานะการติดตั้ง"
            value={formData.installationTypeStatus}
            noteName="installationTypeNote"
            onChange={handleRadioChange}
          />
        </div>

        {/* 4.3 Overcurrent Protection (Input Side) */}
        <h4 className="text-lg font-semibold mb-2">4.3 เครื่องป้องกันกระแสเกินด้านไฟเข้า</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <YesNoRadio
            name="overcurrentProtectionStatus"
            label="สถานะเครื่องป้องกันกระแสเกิน"
            value={formData.overcurrentProtectionStatus}
            noteName="overcurrentProtectionNote"
            onChange={handleRadioChange}
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="overcurrentProtectionType" value="ดรอพเอาท์ฟิวส์คัตเอาท์" checked={formData.overcurrentProtectionType === "ดรอพเอาท์ฟิวส์คัตเอาท์"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="overcurrentProtectionType" value="เซอร์กิตเบรกเกอร์" checked={formData.overcurrentProtectionType === "เซอร์กิตเบรกเกอร์"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เซอร์กิตเบรกเกอร์</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="overcurrentProtectionType" value="อื่นๆ" checked={formData.overcurrentProtectionType === "อื่นๆ"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
            </label>
            {formData.overcurrentProtectionType === "อื่นๆ" && (
              <input type="text" name="overcurrentProtectionOtherType" value={formData.overcurrentProtectionOtherType} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ระบุ" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">พิกัดกระแสต่อเนื่อง (A)</label>
            <input type="text" name="continuousCurrentRatingA" value={formData.continuousCurrentRatingA} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">พิกัดตัดกระแสลัดวงจรสูงสุด (IC) (kA)</label>
            <input type="text" name="interruptingCapacityKa" value={formData.interruptingCapacityKa} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
          </div>
        </div>

        {/* 4.4 HV Surge Arrester Installation */}
        <h4 className="text-lg font-semibold mb-2">4.4 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <YesNoRadio
            name="hvSurgeArresterTransformerStatus"
            label="สถานะการติดตั้ง HV Surge Arrester"
            value={formData.hvSurgeArresterTransformerStatus}
            noteName="hvSurgeArresterTransformerNote"
            onChange={handleRadioChange}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">พิกัดแรงดัน (kV)</label>
            <input type="text" name="hvSurgeArresterVoltageRatingKv" value={formData.hvSurgeArresterVoltageRatingKv} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">พิกัดกระแส (kA)</label>
            <input type="text" name="hvSurgeArresterCurrentRatingKa" value={formData.hvSurgeArresterCurrentRatingKa} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
          </div>
        </div>

        {/* 4.5 Transformer Body & HV Surge Arrester Grounding */}
        <h4 className="text-lg font-semibold mb-2">4.5 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
          <YesNoRadio
            name="transformerGroundingStatus"
            label="สถานะการประกอบสายดิน"
            value={formData.transformerGroundingStatus}
            noteName="transformerGroundingNote"
            onChange={handleRadioChange}
          />
        </div>

        {/* 4.6 HV Ground Resistance */}
        <h4 className="text-lg font-semibold mb-2">4.6 ค่าความต้านทานดินของระบบแรงสูง</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
          <input
            type="text"
            name="hvGroundResistanceOhm"
            value={formData.hvGroundResistanceOhm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ค่าความต้านทาน (โอห์ม)"
          />
          <p className="text-sm text-gray-600 mt-2">* ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม</p>
          <YesNoRadio
            name="hvGroundResistanceStatus"
            label="สถานะค่าความต้านทานดิน"
            value={formData.hvGroundResistanceStatus}
            noteName="hvGroundResistanceNote"
            onChange={handleRadioChange}
          />
        </div>

        {/* 4.7 Transformer External Condition (Oil Type Only) */}
        {formData.transformerType === "Oil" && (
          <>
            <h4 className="text-lg font-semibold mb-2">4.7 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)</h4>
            <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
              <YesNoRadio
                name="desiccantStatus"
                label="4.7.1 สารดูดความชื้น"
                value={formData.desiccantStatus}
                noteName="desiccantNote"
                onChange={handleRadioChange}
              />
              <YesNoRadio
                name="bushingConditionStatus"
                label="4.7.2 สภาพบุชชิ่ง"
                value={formData.bushingConditionStatus}
                noteName="bushingConditionNote"
                onChange={handleRadioChange}
              />
              <YesNoRadio
                name="oilLevelStatus"
                label="4.7.3 ระดับน้ำมัน"
                value={formData.oilLevelStatus}
                noteName="oilLevelNote"
                onChange={handleRadioChange}
              />
              <YesNoRadio
                name="oilLeakageStatus"
                label="4.7.4 การรั่วซึมของน้ำมันหม้อแปลง"
                value={formData.oilLeakageStatus}
                noteName="oilLeakageNote"
                onChange={handleRadioChange}
              />
            </div>
          </>
        )}

        {/* 4.8 Warning Sign */}
        <h4 className="text-lg font-semibold mb-2">4.8 ป้ายเตือน</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
          <YesNoRadio
            name="warningSignStatus"
            label="ป้ายเตือน: “อันตรายไฟฟ้าแรงสูง เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น”"
            value={formData.warningSignStatus}
            noteName="warningSignNote"
            onChange={handleRadioChange}
          />
        </div>

        {/* 4.9 Others */}
        <h4 className="text-lg font-semibold mb-2">4.9 อื่นๆ</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary">
          <textarea
            name="otherTransformerNotes"
            value={formData.otherTransformerNotes}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md min-h-[80px]"
          ></textarea>
        </div>
      </div>

      {/* 5. Low Voltage System */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
        <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">5. ระบบไฟฟ้าแรงต่ำ</h3>

        {/* 5.1 LV Main Circuit */}
        <h4 className="text-lg font-semibold mb-2">5.1 วงจรประธานแรงต่ำ</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          {/* 5.1.1 Main Cable Standard */}
          <YesNoRadio
            name="mainCableStandardStatus"
            label="5.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน"
            value={formData.mainCableStandardStatus}
            noteName="mainCableStandardNote"
            onChange={handleRadioChange}
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="mainCableStandard" value="มอก. 11-2553" checked={formData.mainCableStandard === "มอก. 11-2553"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">มอก. 11-2553</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="mainCableStandard" value="มอก. 293-2541" checked={formData.mainCableStandard === "มอก. 293-2541"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">มอก. 293-2541</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="mainCableStandard" value="IEC 60502" checked={formData.mainCableStandard === "IEC 60502"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">IEC 60502</span>
            </label>
          </div>

          {/* 5.1.2 Main Cable Type */}
          <YesNoRadio
            name="mainCableTypeStatus"
            label="5.1.2 ชนิดสายตัวนำ"
            value={formData.mainCableTypeStatus}
            noteName="mainCableTypeNote"
            onChange={handleRadioChange}
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="mainCableType" value="IEC01" checked={formData.mainCableType === "IEC01"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">IEC01</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="mainCableType" value="NYY" checked={formData.mainCableType === "NYY"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">NYY</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="mainCableType" value="CV" checked={formData.mainCableType === "CV"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">CV</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="mainCableType" value="อื่นๆ" checked={formData.mainCableType === "อื่นๆ"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
            </label>
            {formData.mainCableType === "อื่นๆ" && (
              <input type="text" name="mainCableTypeOther" value={formData.mainCableTypeOther} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ระบุ" />
            )}
          </div>

          {/* 5.1.3 Main Phase Cable Size */}
          <YesNoRadio
            name="mainPhaseCableSizeStatus"
            label="5.1.3 ขนาดสายเฟส..........................ตร.มม. (พิกัดกระแสสายตัวนำประธานต้องไม่น้อยกว่าขนาดปรับตั้งของเมนเซอร์กิตเบรกเกอร์ และสอดคล้องกับขนาดมิเตอร์ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด)"
            value={formData.mainPhaseCableSizeStatus}
            noteName="mainPhaseCableSizeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="mainPhaseCableSizeSqmm"
            value={formData.mainPhaseCableSizeSqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาดสายเฟส (ตร.มม.)"
          />

          {/* 5.1.4 Main Neutral Cable Size */}
          <YesNoRadio
            name="mainNeutralCableSizeStatus"
            label="5.1.4 ขนาดสายนิวทรัล......................ตร.มม."
            value={formData.mainNeutralCableSizeStatus}
            noteName="mainNeutralCableSizeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="mainNeutralCableSizeSqmm"
            value={formData.mainNeutralCableSizeSqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาดสายนิวทรัล (ตร.มม.)"
          />

          {/* 5.1.5 Phase Marking */}
          <YesNoRadio
            name="phaseMarkingStatus"
            label="5.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ"
            value={formData.phaseMarkingStatus}
            noteName="phaseMarkingNote"
            onChange={handleRadioChange}
          />

          {/* 5.1.6 Conduit Continuity */}
          <YesNoRadio
            name="conduitContinuityStatus"
            label="5.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ"
            value={formData.conduitContinuityStatus}
            noteName="conduitContinuityNote"
            onChange={handleRadioChange}
          />

          {/* 5.1.7 Wiring Method */}
          <h4 className="text-md font-semibold mb-2">5.1.7 วิธีการเดินสาย</h4>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="wiringMethod" value="เดินสายบนลูกถ้วยฉนวนในอากาศ" checked={formData.wiringMethod.includes("เดินสายบนลูกถ้วยฉนวนในอากาศ")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="wiringMethod" value="เดินบนรางเคเบิล" checked={formData.wiringMethod.includes("เดินบนรางเคเบิล")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินบนรางเคเบิล (Cable Tray)</span>
            </label>
            {formData.wiringMethod.includes("เดินบนรางเคเบิล") && (
              <>
                <input type="text" name="wiringMethodCableTraySizeW" value={formData.wiringMethodCableTraySizeW} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="กว้าง (มม.)" />
                <input type="text" name="wiringMethodCableTraySizeH" value={formData.wiringMethodCableTraySizeH} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="สูง (มม.)" />
              </>
            )}
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="wiringMethod" value="เดินสายฝังดินโดยตรง" checked={formData.wiringMethod.includes("เดินสายฝังดินโดยตรง")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="wiringMethod" value="เดินสายร้อยท่อฝังดิน" checked={formData.wiringMethod.includes("เดินสายร้อยท่อฝังดิน")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
            </label>
            {formData.wiringMethod.includes("เดินสายร้อยท่อฝังดิน") && (
              <input type="text" name="wiringMethodConduitUndergroundSize" value={formData.wiringMethodConduitUndergroundSize} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ขนาดท่อ (นิ้ว)" />
            )}
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="wiringMethod" value="เดินร้อยท่อเกาะผนัง" checked={formData.wiringMethod.includes("เดินร้อยท่อเกาะผนัง")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินร้อยท่อเกาะผนัง</span>
            </label>
            {formData.wiringMethod.includes("เดินร้อยท่อเกาะผนัง") && (
              <input type="text" name="wiringMethodConduitWallSize" value={formData.wiringMethodConduitWallSize} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ขนาดท่อ (นิ้ว)" />
            )}
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="wiringMethod" value="อื่นๆ" checked={formData.wiringMethod.includes("อื่นๆ")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
            </label>
            {formData.wiringMethod.includes("อื่นๆ") && (
              <input type="text" name="wiringMethodOther" value={formData.wiringMethodOther} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ระบุ" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">* การไฟฟ้าส่วนภูมิภาคกำหนดให้ใช้สายตัวนำทองแดงสำหรับการเดินสายภายในและภายนอกอาคาร ส่วนสายตัวนำอะลูมิเนียมอนุญาตให้ใช้เป็นตัวนำประธานได้เฉพาะการเดินสายบนลูกถ้วยฉนวนภายนอกอาคาร</p>
          <YesNoRadio
            name="wiringMethodStatus"
            label="สถานะวิธีการเดินสาย"
            value={formData.wiringMethodStatus}
            noteName="wiringMethodNote"
            onChange={handleRadioChange}
          />

          {/* 5.1.8 Conduit Type */}
          <h4 className="text-md font-semibold mb-2">5.1.8 ประเภทท่อร้อยสาย</h4>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="font-medium text-gray-700">ท่อโลหะ:</span>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="conduitMetalType" value="หนา (RMC)" checked={formData.conduitMetalType.includes("หนา (RMC)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">หนา (RMC)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="conduitMetalType" value="หนาปานกลาง (IMC)" checked={formData.conduitMetalType.includes("หนาปานกลาง (IMC)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">หนาปานกลาง (IMC)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="conduitMetalType" value="บาง (EMT)" checked={formData.conduitMetalType.includes("บาง (EMT)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">บาง (EMT)</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="font-medium text-gray-700">ท่ออโลหะ:</span>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="conduitNonMetalType" value="แข็ง (RNC)" checked={formData.conduitNonMetalType.includes("แข็ง (RNC)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">แข็ง (RNC)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="conduitNonMetalType" value="อ่อน (ENT)" checked={formData.conduitNonMetalType.includes("อ่อน (ENT)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อ่อน (ENT)</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="conduitNonMetalType" value="ท่อโลหะอ่อน (Flexible Metal Conduit)" checked={formData.conduitNonMetalType.includes("ท่อโลหะอ่อน (Flexible Metal Conduit)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="conduitNonMetalType" value="อื่นๆ" checked={formData.conduitNonMetalType.includes("อื่นๆ")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
            </label>
            {formData.conduitNonMetalType.includes("อื่นๆ") && (
              <input type="text" name="conduitOtherType" value={formData.conduitOtherType} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ระบุ" />
            )}
          </div>
          <YesNoRadio
            name="conduitTypeStatus"
            label="สถานะประเภทท่อร้อยสาย"
            value={formData.conduitTypeStatus}
            noteName="conduitTypeNote"
            onChange={handleRadioChange}
          />
        </div>

        {/* 5.2 Main Switchboard Overcurrent Protection */}
        <h4 className="text-lg font-semibold mb-2">5.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <YesNoRadio
            name="mainBreakerStandardStatus"
            label="5.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2"
            value={formData.mainBreakerStandardStatus}
            noteName="mainBreakerStandardNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="mainBreakerAmpRatingStatus"
            label="5.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด AT…….……แอมแปร์ (A) สอดคล้องกับพิกัดกระแสสายตัวนำประธาน"
            value={formData.mainBreakerAmpRatingStatus}
            noteName="mainBreakerAmpRatingNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="mainBreakerAmpRating"
            value={formData.mainBreakerAmpRating}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาด AT (A)"
          />
          <YesNoRadio
            name="mainBreakerIcRatingStatus"
            label="5.2.3 พิกัดทนกระแสลัดวงจร (Ic)…….….………..กิโลแอมแปร์ (kA)"
            value={formData.mainBreakerIcRatingStatus}
            noteName="mainBreakerIcRatingNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="mainBreakerIcRatingKa"
            value={formData.mainBreakerIcRatingKa}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="พิกัด Ic (kA)"
          />
          <div className="border-b border-gray-200 pb-4 mb-4">
            <label className="block text-sm font-medium text-gray-700">5.2.4 กรณีเมนเซอร์กิตเบรกเกอร์มีขนาดตั้งแต่ 1,000 แอมแปร์ ขึ้นไป ต้องติดตั้ง Ground Fault Protection (GFP)</label>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="gfpInstalled"
                  checked={formData.gfpInstalled}
                  onChange={handleChange}
                  className="text-[#5b2d90]"
                />
                <span className="text-sm font-medium text-gray-700 ml-2">ติดตั้ง</span>
              </label>
            </div>
            {formData.gfpInstalled && (
              <YesNoRadio
                name="gfpStatus"
                label="สถานะ GFP"
                value={formData.gfpStatus}
                noteName="gfpNote"
                onChange={handleRadioChange}
              />
            )}
          </div>
        </div>

        {/* 5.3 Main Switchboard Grounding System */}
        <h4 className="text-lg font-semibold mb-2">5.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</h4>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <YesNoRadio
            name="groundConductorSizeStatus"
            label="5.3.1 สายต่อหลักดิน (ตัวนำทองแดง) ขนาด.......................ตร.มม. สอดคล้องกับขนาดสายตัวนำประธาน ตามตารางที่ 1 ในหน้าที่ 7"
            value={formData.groundConductorSizeStatus}
            noteName="groundConductorSizeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="groundConductorSizeSqmm"
            value={formData.groundConductorSizeSqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาดสายต่อหลักดิน (ตร.มม.)"
          />

          <h4 className="text-md font-semibold mb-2">5.3.2 การต่อลงดินที่แผงเมนสวิตช์</h4>
          <YesNoRadio
            name="groundingOnePhaseStatus"
            label="กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด"
            value={formData.groundingOnePhaseStatus}
            noteName="groundingOnePhaseNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="groundingThreePhaseStatus"
            label="กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด"
            value={formData.groundingThreePhaseStatus}
            noteName="groundingThreePhaseNote"
            onChange={handleRadioChange}
          />
        </div>

        {/* 5.4 Grounding Type at Main Switchboard */}
        <h3 className="text-xl font-bold mb-4 text-[#5b2d90]">5.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งรูปแบบ)</h3>
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="groundingForm" value="TN-C-S" checked={formData.groundingForm === "TN-C-S"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">TN-C-S ทั้งระบบ</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="groundingForm" value="TT" checked={formData.groundingForm === "TT"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">TT ทั้งระบบ</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="groundingForm" value="TT-partial" checked={formData.groundingForm === "TT-partial"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">TT บางส่วน (ต้นทางเป็น TN-C-S และ โหลดเป็น TT)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="groundingForm" value="TN-S" checked={formData.groundingForm === "TN-S"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">TN-S ทั้งระบบ</span>
            </label>
          </div>

          {/* Conditional rendering based on groundingForm */}
          {formData.groundingForm === "TN-C-S" && (
            <div className="space-y-4 mt-4 p-4 border rounded-md bg-white">
              <h4 className="text-lg font-semibold mb-2">5.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องมีมาตรการอย่างใดอย่างหนึ่ง)</h4>
              <YesNoRadio
                name="tncsOverallStatus"
                label="ภาพรวม TN-C-S"
                value={formData.tncsOverallStatus}
                noteName="tncsOverallNote"
                onChange={handleRadioChange}
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

          {formData.groundingForm === "TT" && (
            <div className="space-y-4 mt-4 p-4 border rounded-md bg-white">
              <h4 className="text-lg font-semibold mb-2">5.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ</h4>
              <YesNoRadio
                name="ttRcdStatus"
                label="ต้องติดตั้งเครื่องตัดไฟรั่ว (RCD) ทุกวงจรไฟฟ้าที่จ่ายไฟ หรือทุกเครื่องใช้ไฟฟ้า ไม่ว่าจะเกี่ยวข้องกับการอัดประจุยานยนต์ไฟฟ้าหรือไม่ก็ตาม"
                value={formData.ttRcdStatus}
                noteName="ttRcdNote"
                onChange={handleRadioChange}
              />
            </div>
          )}

          {formData.groundingForm === "TT-partial" && (
            <div className="space-y-4 mt-4 p-4 border rounded-md bg-white">
              <h4 className="text-lg font-semibold mb-2">5.4.3 กรณีต่อลงดินแบบ TT บางส่วน (ต้องดำเนินการครบทุกข้อ ก) – จ) )</h4>
              <YesNoRadio
                name="ttpOverallStatus"
                label="ภาพรวม TT บางส่วน"
                value={formData.ttpOverallStatus}
                noteName="ttpOverallNote"
                onChange={handleRadioChange}
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

          {formData.groundingForm === "TN-S" && (
            <div className="space-y-4 mt-4 p-4 border rounded-md bg-white">
              <h4 className="text-lg font-semibold mb-2">5.4.4 กรณีต่อลงดินแบบ TN-S ทั้งระบบ</h4>
              <YesNoRadio
                name="tnsOverallStatus"
                label="ภาพรวม TN-S"
                value={formData.tnsOverallStatus}
                noteName="tnsOverallNote"
                onChange={handleRadioChange}
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
        <div className="mb-6 pl-4 border-l-4 border-pea-secondary space-y-4">
          {/* 5.5.1 Feeder Circuit */}
          <h4 className="text-lg font-semibold mb-2">5.5.1 วงจรสายป้อน</h4>
          <YesNoRadio
            name="feederCableStandardStatus"
            label="ก) สายป้อนเป็นไปตามมาตรฐาน"
            value={formData.feederCableStandardStatus}
            noteName="feederCableStandardNote"
            onChange={handleRadioChange}
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feederCableStandard" value="มอก. 11-2553" checked={formData.feederCableStandard === "มอก. 11-2553"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">มอก. 11-2553</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feederCableStandard" value="มอก. 293-2541" checked={formData.feederCableStandard === "มอก. 293-2541"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">มอก. 293-2541</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feederCableStandard" value="IEC 60502" checked={formData.feederCableStandard === "IEC 60502"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">IEC 60502</span>
            </label>
          </div>

          <YesNoRadio
            name="feederCableTypeStatus"
            label="ข) ชนิดสายตัวนำ"
            value={formData.feederCableTypeStatus}
            noteName="feederCableTypeNote"
            onChange={handleRadioChange}
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feederCableType" value="IEC01" checked={formData.feederCableType === "IEC01"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">IEC01</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feederCableType" value="NYY" checked={formData.feederCableType === "NYY"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">NYY</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feederCableType" value="CV" checked={formData.feederCableType === "CV"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">CV</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="radio" name="feederCableType" value="อื่นๆ" checked={formData.feederCableType === "อื่นๆ"} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
            </label>
            {formData.feederCableType === "อื่นๆ" && (
              <input type="text" name="feederCableTypeOther" value={formData.feederCableTypeOther} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ระบุ" />
            )}
          </div>

          <YesNoRadio
            name="feederPhaseCableSizeStatus"
            label="ค) ขนาดสายเฟส..........................ตร.มม. (พิกัดกระแสสายป้อนต้องไม่น้อยกว่าขนาดปรับตั้งของเซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน และขนาดสายป้อนต้องไม่เล็กกว่า 4 ตร.มม.)"
            value={formData.feederPhaseCableSizeStatus}
            noteName="feederPhaseCableSizeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="feederPhaseCableSizeSqmm"
            value={formData.feederPhaseCableSizeSqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาดสายเฟส (ตร.มม.)"
          />

          <YesNoRadio
            name="feederNeutralCableSizeStatus"
            label="ง) ขนาดสายนิวทรัล......................ตร.มม."
            value={formData.feederNeutralCableSizeStatus}
            noteName="feederNeutralCableSizeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="feederNeutralCableSizeSqmm"
            value={formData.feederNeutralCableSizeSqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาดสายนิวทรัล (ตร.มม.)"
          />

          <YesNoRadio
            name="feederGroundCableSizeStatus"
            label="จ) ขนาดสายดิน.............................ตร.มม. สอดคล้องกับขนาดสายเฟสของวงจรสายป้อน ตามตารางที่ 1 ในหน้าที่ 7"
            value={formData.feederGroundCableSizeStatus}
            noteName="feederGroundCableSizeNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="feederGroundCableSizeSqmm"
            value={formData.feederGroundCableSizeSqmm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาดสายดิน (ตร.มม.)"
          />

          <YesNoRadio
            name="feederPhaseMarkingStatus"
            label="ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ"
            value={formData.feederPhaseMarkingStatus}
            noteName="feederPhaseMarkingNote"
            onChange={handleRadioChange}
          />

          <YesNoRadio
            name="feederConduitContinuityStatus"
            label="ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ"
            value={formData.feederConduitContinuityStatus}
            noteName="feederConduitContinuityNote"
            onChange={handleRadioChange}
          />

          {/* 5.5.2 Wiring Method (Feeder) */}
          <h4 className="text-md font-semibold mb-2">5.5.2 วิธีการเดินสาย</h4>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederWiringMethod" value="เดินในรางเดินสาย (Wireway)" checked={formData.feederWiringMethod.includes("เดินในรางเดินสาย (Wireway)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินในรางเดินสาย (Wireway)</span>
            </label>
            {formData.feederWiringMethod.includes("เดินในรางเดินสาย (Wireway)") && (
              <>
                <input type="text" name="feederWiringMethodWirewaySizeW" value={formData.feederWiringMethodWirewaySizeW} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="กว้าง (มม.)" />
                <input type="text" name="feederWiringMethodWirewaySizeH" value={formData.feederWiringMethodWirewaySizeH} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="สูง (มม.)" />
              </>
            )}
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederWiringMethod" value="เดินบนรางเคเบิล (Cable Tray)" checked={formData.feederWiringMethod.includes("เดินบนรางเคเบิล (Cable Tray)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินบนรางเคเบิล (Cable Tray)</span>
            </label>
            {formData.feederWiringMethod.includes("เดินบนรางเคเบิล (Cable Tray)") && (
              <>
                <input type="text" name="feederWiringMethodCableTraySizeW" value={formData.feederWiringMethodCableTraySizeW} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="กว้าง (มม.)" />
                <input type="text" name="feederWiringMethodCableTraySizeH" value={formData.feederWiringMethodCableTraySizeH} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="สูง (มม.)" />
              </>
            )}
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederWiringMethod" value="บัสเวย์ (Busway) หรือบัสดัก (Bus duct)" checked={formData.feederWiringMethod.includes("บัสเวย์ (Busway) หรือบัสดัก (Bus duct)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">บัสเวย์ (Busway) หรือบัสดัก (Bus duct)</span>
            </label>
            {formData.feederWiringMethod.includes("บัสเวย์ (Busway) หรือบัสดัก (Bus duct)") && (
              <>
                <input type="text" name="feederWiringMethodBuswaySizeW" value={formData.feederWiringMethodBuswaySizeW} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="กว้าง (มม.)" />
                <input type="text" name="feederWiringMethodBuswaySizeH" value={formData.feederWiringMethodBuswaySizeH} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="สูง (มม.)" />
              </>
            )}
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederWiringMethod" value="เดินร้อยท่อเกาะผนัง" checked={formData.feederWiringMethod.includes("เดินร้อยท่อเกาะผนัง")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินร้อยท่อเกาะผนัง</span>
            </label>
            {formData.feederWiringMethod.includes("เดินร้อยท่อเกาะผนัง") && (
              <input type="text" name="feederWiringMethodConduitWallSize" value={formData.feederWiringMethodConduitWallSize} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ขนาดท่อ (นิ้ว)" />
            )}
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederWiringMethod" value="เดินสายฝังดินโดยตรง" checked={formData.feederWiringMethod.includes("เดินสายฝังดินโดยตรง")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederWiringMethod" value="เดินสายร้อยท่อฝังดิน" checked={formData.feederWiringMethod.includes("เดินสายร้อยท่อฝังดิน")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
            </label>
            {formData.feederWiringMethod.includes("เดินสายร้อยท่อฝังดิน") && (
              <input type="text" name="feederWiringMethodConduitUndergroundSize" value={formData.feederWiringMethodConduitUndergroundSize} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ขนาดท่อ (นิ้ว)" />
            )}
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederWiringMethod" value="อื่นๆ" checked={formData.feederWiringMethod.includes("อื่นๆ")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
            </label>
            {formData.feederWiringMethod.includes("อื่นๆ") && (
              <input type="text" name="feederWiringMethodOther" value={formData.feederWiringMethodOther} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ระบุ" />
            )}
          </div>
          <YesNoRadio
            name="feederWiringMethodStatus"
            label="สถานะวิธีการเดินสาย"
            value={formData.feederWiringMethodStatus}
            noteName="feederWiringMethodNote"
            onChange={handleRadioChange}
          />

          {/* 5.5.3 Conduit Type (Feeder) */}
          <h4 className="text-md font-semibold mb-2">5.5.3 ประเภทท่อร้อยสาย</h4>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="font-medium text-gray-700">ท่อโลหะ:</span>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederConduitMetalType" value="หนา (RMC)" checked={formData.feederConduitMetalType.includes("หนา (RMC)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">หนา (RMC)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederConduitMetalType" value="หนาปานกลาง (IMC)" checked={formData.feederConduitMetalType.includes("หนาปานกลาง (IMC)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">หนาปานกลาง (IMC)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederConduitMetalType" value="บาง (EMT)" checked={formData.feederConduitMetalType.includes("บาง (EMT)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">บาง (EMT)</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="font-medium text-gray-700">ท่ออโลหะ:</span>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederConduitNonMetalType" value="แข็ง (RNC)" checked={formData.feederConduitNonMetalType.includes("แข็ง (RNC)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">แข็ง (RNC)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederConduitNonMetalType" value="อ่อน (ENT)" checked={formData.feederConduitNonMetalType.includes("อ่อน (ENT)")} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อ่อน (ENT)</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederConduitFlexibleMetalType" checked={formData.feederConduitFlexibleMetalType} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              <input type="checkbox" name="feederConduitOtherType" value="อื่นๆ" checked={formData.feederConduitOtherType} onChange={handleChange} className="text-[#5b2d90]" />
              <span className="text-sm font-medium text-gray-700 ml-2">อื่นๆ</span>
            </label>
            {formData.feederConduitOtherType && (
              <input type="text" name="feederConduitOtherTypeNote" value={formData.feederConduitOtherTypeNote} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" placeholder="ระบุ" />
            )}
          </div>
          <YesNoRadio
            name="feederConduitTypeStatus"
            label="สถานะประเภทท่อร้อยสาย"
            value={formData.feederConduitTypeStatus}
            noteName="feederConduitTypeNote"
            onChange={handleRadioChange}
          />

          {/* 5.5.4 Feeder Circuit Breaker */}
          <h4 className="text-md font-semibold mb-2">5.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน</h4>
          <YesNoRadio
            name="feederBreakerStandardStatus"
            label="ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2"
            value={formData.feederBreakerStandardStatus}
            noteName="feederBreakerStandardNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="feederBreakerAmpRatingStatus"
            label="ข) เซอร์กิตเบรกเกอร์ขนาด AT…….……แอมแปร์ (A) ไม่เกินพิกัดกระแสสายป้อน และไม่ต่ำกว่าโหลดสูงสุดของสายป้อน"
            value={formData.feederBreakerAmpRatingStatus}
            noteName="feederBreakerAmpRatingNote"
            onChange={handleRadioChange}
          />
          <input
            type="text"
            name="feederBreakerAmpRating"
            value={formData.feederBreakerAmpRating}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="ขนาด AT (A)"
          />

          {/* 5.5.5 Panel Board Installation */}
          <h4 className="text-md font-semibold mb-2">5.5.5 การติดตั้งแผงวงจรย่อย (Panel board)</h4>
          <YesNoRadio
            name="panelBoardRatingOk"
            label="ก) ต้องมีพิกัดไม่ต่ำกว่าขนาดสายป้อน"
            value={formData.panelBoardRatingOk}
            noteName="panelBoardRatingNote"
            onChange={handleRadioChange}
          />
          <YesNoRadio
            name="panelBoardGroundNeutralSeparationOk"
            label="ข) ไม่มีการต่อฝาก เชื่อมระหว่างขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) ที่แผงวงจรย่อย"
            value={formData.panelBoardGroundNeutralSeparationOk}
            noteName="panelBoardGroundNeutralSeparationNote"
            onChange={handleRadioChange}
          />
        </div>
      </div>

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-5">
        <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</h3>
        <div className="text-gray-900 text-sm mb-6 space-y-3">
            <p>6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนสิ่งก่อสร้างอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงอยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว</p>
            <p>6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหลัง หรืออุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
            <p>6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
            <p>6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignaturePad title="ลงชื่อผู้ขอใช้ไฟฟ้าหรือผู้แทน" ref={userSigRef} onSave={(dataUrl) => handleSignatureSave('userSignature', dataUrl)} onClear={() => handleSignatureClear('userSignature')}/>
          <SignaturePad title="ลงชื่อเจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค" ref={inspectorSigRef} onSave={(dataUrl) => handleSignatureSave('inspectorSignature', dataUrl)} onClear={() => handleSignatureClear('inspectorSignature')}/>
        </div>
      </section>
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
    </form>
  );
}