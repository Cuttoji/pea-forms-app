"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from "react-hot-toast";
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';
import { useFormManager } from "@/lib/hooks/useFormManager"; 


export default function ElectricityInspectionForm() {
  // สถานะเพื่อจัดการข้อมูลฟอร์มทั้งหมด
  const [formData, setFormData] = useState({
    // ข้อมูลส่วนหัว
    inspectionNumber: "",
    inspectionDate: "",
    requestNumber: "",
    requestDate: "",
    peaOffice: "", // เพิ่มสำหรับ "การไฟฟ้า"

    // 1. ข้อมูลทั่วไป
    fullName: "",
    phone: "",
    isCorporateApplicant: false,
    corporateName: "",
    corporatePhone: "",
    address: "",
    systemType: "", // เปลี่ยนจาก phaseType เป็น systemType เพื่อให้ตรงกับ PDF (3 เฟส / 1 เฟส)
    estimatedLoadAmp: "", // เปลี่ยนจาก estimatedLoad เป็น estimatedLoadAmp สำหรับแอมแปร์
    evChargerCount: "", // เพิ่มสำหรับ "ติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้ารวม"
    evChargerPowerKw: "", // เพิ่มสำหรับ "พิกัดกำลังไฟฟ้ารวมของเครื่องอัดประจุยานยนต์ไฟฟ้า"

    // 2. เอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
    // 2.1 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่ส่วนบุคคล
    personal_specSheetChecked: false,
    personal_singleLineDiagramChecked: false,
    personal_loadScheduleChecked: false,
    personal_documentsComplete: "", // "ครบถ้วน", "ไม่ครบถ้วน"
    personal_documentsIncompleteNote: "",

    // 2.2 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่สาธารณะ
    public_singleLineDiagramChecked: false,
    public_asBuiltDrawingChecked: false,
    public_loadScheduleCalculationChecked: false,
    public_engineerLicenseCopyChecked: false,
    public_specSheetChecked: false,
    public_notificationLicenseChecked: false,
    public_documentsComplete: "", // "ครบถ้วน", "ไม่ครบถ้วน"
    public_documentsIncompleteNote: "",

    // 3. ระบบไฟฟ้าแรงต่ำ
    // 3.1 วงจรประธานแรงต่ำ
    mainCableStandard: "", // มอก. 11-2553, มอก. 293-2541, IEC 60502
    mainCableStandard_correct: "",
    mainCableStandard_note: "",

    mainCableType: "", // IEC01, NYY, CV, อื่นๆ
    mainCableOtherType: "",
    mainCableType_correct: "",
    mainCableType_note: "",

    mainCablePhaseSizeSqmm: "",
    mainCablePhaseSize_correct: "",
    mainCablePhaseSize_note: "",

    mainCableNeutralSizeSqmm: "",
    mainCableNeutralSize_correct: "",
    mainCableNeutralSize_note: "",

    mainCablePhaseMarking_correct: "",
    mainCablePhaseMarking_note: "",

    mainConduitContinuity_correct: "",
    mainConduitContinuity_note: "",

    mainWiringMethodOverhead: false,
    mainWiringMethodCableTray: false,
    mainWiringMethodCableTraySizeX: "",
    mainWiringMethodCableTraySizeY: "",
    mainWiringMethodDirectBurial: false,
    mainWiringMethodConduitBurial: false,
    mainWiringMethodConduitBurialSize: "",
    mainWiringMethodConduitWall: false,
    mainWiringMethodConduitWallSize: "",
    mainWiringMethodOther: false,
    mainWiringMethodOtherText: "",
    mainWiringMethod_correct: "",
    mainWiringMethod_note: "",

    mainConduitTypeRMC: false,
    mainConduitTypeIMC: false,
    mainConduitTypeEMT: false,
    mainConduitTypeRNC: false,
    mainConduitTypeENT: false,
    mainConduitTypeFlexibleMetal: false,
    mainConduitTypeOther: false,
    mainConduitTypeOtherText: "",
    mainConduitType_correct: "",
    mainConduitType_note: "",

    // 3.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)
    mainBreakerStandard_correct: "",
    mainBreakerStandard_note: "",
    mainBreakerAmpRating: "",
    mainBreakerAmpRating_correct: "",
    mainBreakerAmpRating_note: "",
    mainBreakerShortCircuitRating: "",
    mainBreakerShortCircuitRating_correct: "",
    mainBreakerShortCircuitRating_note: "",

    // 3.3 ระบบการต่อลงดินที่แผงเมนสวิตช์
    mainGroundWireSizeSqmm: "",
    mainGroundWireSize_correct: "",
    mainGroundWireSize_note: "",
    mainGrounding1Phase_correct: "",
    mainGrounding1Phase_note: "",
    mainGrounding3Phase_correct: "",
    mainGrounding3Phase_note: "",

    // 3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์
    groundingSystemType: "", // TN-C-S, TT, TT บางส่วน

    // 3.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ
    tncs_groundResistanceOhm: "",
    tncs_groundResistance_correct: "",
    tncs_groundResistance_note: "",
    tncs_overUnderVoltageProtection: false,
    tncs_overUnderVoltageProtection_correct: "",
    tncs_overUnderVoltageProtection_note: "",
    tncs_evChargerBuiltInProtection: false,
    tncs_evChargerBuiltInProtection_correct: "",
    tncs_evChargerBuiltInProtection_note: "",
    tncs_touchVoltageProtection: false,
    tncs_touchVoltageProtection_correct: "",
    tncs_touchVoltageProtection_note: "",

    // 3.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ
    tt_rcdAllCircuits: false,
    tt_rcdAllCircuits_correct: "",
    tt_rcdAllCircuits_note: "",
    tt_overUnderVoltageProtection: false,
    tt_overUnderVoltageProtection_correct: "",
    tt_overUnderVoltageProtection_note: "",

    // 3.4.3 กรณีต่อลงดินแบบ TT บางส่วน
    ttPartial_riskAssessment: false,
    ttPartial_riskAssessment_correct: "",
    ttPartial_riskAssessment_note: "",
    ttPartial_groundDistance: false,
    ttPartial_groundDistance_correct: "",
    ttPartial_groundDistance_note: "",
    ttPartial_warningSign: false,
    ttPartial_warningSign_correct: "",
    ttPartial_warningSign_note: "",

    ttPartial_groundResistanceOhm: "",
    ttPartial_groundResistance_correct: "",
    ttPartial_groundResistance_note: "",
    ttPartial_overUnderVoltageProtection: false,
    ttPartial_overUnderVoltageProtection_correct: "",
    ttPartial_overUnderVoltageProtection_note: "",
    ttPartial_evChargerBuiltInProtection: false,
    ttPartial_evChargerBuiltInProtection_correct: "",
    ttPartial_evChargerBuiltInProtection_note: "",
    ttPartial_touchVoltageProtection: false,
    ttPartial_touchVoltageProtection_correct: "",
    ttPartial_touchVoltageProtection_note: "",

    // 3.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board) (ถ้ามี)
    // 3.5.1 วงจรสายป้อน
    feederCableStandard: "", // มอก. 11-2553, มอก. 293-2541, IEC 60502
    feederCableStandard_correct: "",
    feederCableStandard_note: "",

    feederCableType: "", // IEC01, NYY, CV, อื่นๆ
    feederCableOtherType: "",
    feederCableType_correct: "",
    feederCableType_note: "",

    feederCablePhaseSizeSqmm: "",
    feederCablePhaseSize_correct: "",
    feederCablePhaseSize_note: "",

    feederCableNeutralSizeSqmm: "",
    feederCableNeutralSize_correct: "",
    feederCableNeutralSize_note: "",

    feederCableGroundSizeSqmm: "",
    feederCableGroundSize_correct: "",
    feederCableGroundSize_note: "",

    feederCablePhaseMarking_correct: "",
    feederCablePhaseMarking_note: "",

    feederConduitContinuity_correct: "",
    feederConduitContinuity_note: "",

    // 3.5.2 วิธีการเดินสาย
    feederWiringWireway: false,
    feederWiringWirewaySizeX: "",
    feederWiringWirewaySizeY: "",
    feederWiringWireway_correct: "",
    feederWiringWireway_note: "",

    feederWiringCableTray: false,
    feederWiringCableTraySizeX: "",
    feederWiringCableTraySizeY: "",
    feederWiringCableTray_correct: "",
    feederWiringCableTray_note: "",

    feederWiringBusway: false,
    feederWiringBuswaySizeX: "",
    feederWiringBuswaySizeY: "",
    feederWiringBusway_correct: "",
    feederWiringBusway_note: "",

    feederWiringConduitWall: false,
    feederWiringConduitWallSize: "",
    feederWiringConduitWall_correct: "",
    feederWiringConduitWall_note: "",

    feederWiringDirectBurial: false,
    feederWiringDirectBurial_correct: "",
    feederWiringDirectBurial_note: "",

    feederWiringConduitBurial: false,
    feederWiringConduitBurialSize: "",
    feederWiringConduitBurial_correct: "",
    feederWiringConduitBurial_note: "",

    feederWiringOther: false,
    feederWiringOtherText: "",
    feederWiringOther_correct: "",
    feederWiringOther_note: "",

    // 3.5.3 ประเภทท่อร้อยสาย
    feederConduitTypeRMC: false,
    feederConduitTypeIMC: false,
    feederConduitTypeEMT: false,
    feederConduitTypeRNC: false,
    feederConduitTypeENT: false,
    feederConduitTypeFlexibleMetal: false,
    feederConduitTypeOther: false,
    feederConduitTypeOtherText: "",
    feederConduitType_correct: "",
    feederConduitType_note: "",

    // 3.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน
    feederBreakerStandard_correct: "",
    feederBreakerStandard_note: "",
    feederBreakerAmpRating: "",
    feederBreakerAmpRating_correct: "",
    feederBreakerAmpRating_note: "",

    // 3.5.5 การติดตั้งแผงวงจรย่อย (Panel board)
    panelBoardRating_correct: "",
    panelBoardRating_note: "",
    panelBoardNoBridging_correct: "",
    panelBoardNoBridging_note: "",

    // 3.6 วงจรย่อย (Branch Circuit)
    branchCircuitNumber: "", // วงจรที่...

    // 3.6.1 วงจรย่อยของเครื่องอัดประจุยานยนต์ไฟฟ้า
    evDedicatedCircuit_correct: "",
    evDedicatedCircuit_note: "",
    evOneChargerPerCircuit_correct: "",
    evOneChargerPerCircuit_note: "",

    // 3.6.2 วงจรย่อย
    branchCableStandard: "", // มอก. 11-2553, มอก. 293-2541, IEC 60502
    branchCableStandard_correct: "",
    branchCableStandard_note: "",

    branchCableType: "", // IEC01, NYY, CV, อื่นๆ
    branchCableOtherType: "",
    branchCableType_correct: "",
    branchCableType_note: "",

    branchCablePhaseSizeSqmm: "",
    branchCablePhaseSize_correct: "",
    branchCablePhaseSize_note: "",

    branchCableNeutralSizeSqmm: "",
    branchCableNeutralSize_correct: "",
    branchCableNeutralSize_note: "",

    branchCableGroundSizeSqmm: "",
    branchCableGroundSize_correct: "",
    branchCableGroundSize_note: "",

    branchCablePhaseMarking_correct: "",
    branchCablePhaseMarking_note: "",

    branchConduitContinuity_correct: "",
    branchConduitContinuity_note: "",

    // 3.6.3 วิธีการเดินสาย
    branchWiringConduitWall: false,
    branchWiringConduitWallSize: "",
    branchWiringConduitWall_correct: "",
    branchWiringConduitWall_note: "",

    branchWiringConduitBurial: false,
    branchWiringConduitBurialSize: "",
    branchWiringConduitBurial_correct: "",
    branchWiringConduitBurial_note: "",

    branchWiringDirectBurial: false,
    branchWiringDirectBurial_correct: "",
    branchWiringDirectBurial_note: "",

    branchWiringWireway: false,
    branchWiringWirewaySizeX: "",
    branchWiringWirewaySizeY: "",
    branchWiringWireway_correct: "",
    branchWiringWireway_note: "",

    branchWiringCableTray: false,
    branchWiringCableTraySizeX: "",
    branchWiringCableTraySizeY: "",
    branchWiringCableTray_correct: "",
    branchWiringCableTray_note: "",

    branchWiringOther: false,
    branchWiringOtherText: "",
    branchWiringOther_correct: "",
    branchWiringOther_note: "",

    // 3.6.4 ประเภทท่อร้อยสาย
    branchConduitTypeRMC: false,
    branchConduitTypeIMC: false,
    branchConduitTypeEMT: false,
    branchConduitTypeRNC: false,
    branchConduitTypeENT: false,
    branchConduitTypeFlexibleMetal: false,
    branchConduitTypeOther: false,
    branchConduitTypeOtherText: "",
    branchConduitType_correct: "",
    branchConduitType_note: "",

    // 3.6.5 เซอร์กิตเบรกเกอร์ป้องกันวงจรย่อย
    branchBreakerStandard_correct: "",
    branchBreakerStandard_note: "",
    branchBreakerMode3_4AmpRating: "",
    branchBreakerMode3_4AmpRating_correct: "",
    branchBreakerMode3_4AmpRating_note: "",
    branchBreakerMode2AmpRating: "",
    branchBreakerMode2AmpRating_correct: "",
    branchBreakerMode2AmpRating_note: "",

    // 3.6.6 ต้องติดตั้งระบบป้องกันอันตรายต่อบุคคล
    personnelProtectionRCDTypeB: false,
    personnelProtectionRCDTypeBAmp: "",
    personnelProtectionRCDTypeB_correct: "",
    personnelProtectionRCDTypeB_note: "",

    personnelProtectionRCDTypeAF_RDC_DD: false,
    personnelProtectionRCDTypeAF_RDC_DD_correct: "",
    personnelProtectionRCDTypeAF_RDC_DD_note: "",

    personnelProtectionRCDTypeBBuiltIn: false,
    personnelProtectionRCDTypeBBuiltInAmp: "",
    personnelProtectionRCDTypeBBuiltIn_correct: "",
    personnelProtectionRCDTypeBBuiltIn_note: "",

    personnelProtectionIsolatingTransformer: false,
    personnelProtectionIsolatingTransformer_correct: "",
    personnelProtectionIsolatingTransformer_note: "",

    // 3.6.7 กรณีติดตั้งเครื่องตัดไฟรั่ว (RCD) Type B
    rcdTypeBInstallation_correct: "",
    rcdTypeBInstallation_note: "",

    // 3.6.8 การตรวจสอบกรณีติดตั้งมิเตอร์เครื่องที่สอง
    secondMeterSeparation_correct: "",
    secondMeterSeparation_note: "",
    secondMeterDedicatedCircuit_correct: "",
    secondMeterDedicatedCircuit_note: "",

    // 3.7 การตรวจสอบเครื่องอัดประจุยานยนต์ไฟฟ้า
    evChargerInspectionNumber: "", // เครื่องที่...

    // 3.7.1 ข้อมูลเครื่องอัดประจุยานยนต์ไฟฟ้า
    evChargerProduct: "",
    evChargerModel: "",
    evChargerSerialNumber: "",
    evChargerIPRating: "",
    evChargerPhase: "", // 1 เฟส, 3 เฟส
    evChargerHeadCount: "",
    evChargerTotalPowerKw: "",
    evChargerTotalCurrentAmp: "",
    evChargerChargingMode: "", // โหมด 2 (AC), โหมด 3 (AC), โหมด 4 (DC)
    evChargerInfo_correct: "",
    evChargerInfo_note: "",

    // 3.7.2 ลักษณะหัวชาร์จ / การชาร์จ
    chargerHeadACType2: false,
    chargerHeadACType2Current: "",
    chargerHeadACType2Voltage: "",
    chargerHeadACType2Power: "",

    chargerHeadDCCHAdeMO: false,
    chargerHeadDCCHAdeMOCurrent: "",
    chargerHeadDCCHAdeMOVoltage: "",
    chargerHeadDCCHAdeMOPower: "",

    chargerHeadDCCCS: false,
    chargerHeadDCCCSCurrent: "",
    chargerHeadDCCCSVoltage: "",
    chargerHeadDCCCSPower: "",

    chargerHeadOther: false,
    chargerHeadOtherText: "",
    chargerHeadOtherCurrent: "",
    chargerHeadOtherVoltage: "",
    chargerHeadOtherPower: "",

    chargerHeadSimultaneousCount: "",
    chargerHeadSimultaneousDetails: "",
    chargerHead_correct: "",
    chargerHead_note: "",

    // 3.7.3 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 2
    mode2ReceptacleStandard_correct: "",
    mode2ReceptacleStandard_note: "",
    mode2ReceptacleNonRemovable_correct: "",
    mode2ReceptacleNonRemovable_note: "",
    mode2WarningSign_correct: "",
    mode2WarningSign_note: "",

    // 3.7.4 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 3 และโหมด 4
    mode3_4WarningSign_correct: "",
    mode3_4WarningSign_note: "",
    mode3_4EmergencySwitch_correct: "",
    mode3_4EmergencySwitch_note: "",
    mode3_4Ventilation_correct: "",
    mode3_4Ventilation_note: "",
    mode3_4CableLength_correct: "",
    mode3_4CableLength_note: "",

    // 3.7.5 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้าอยู่ในบริเวณสถานีบริการน้ำมัน, LPG และ CNG
    fuelStationMode_correct: "",
    fuelStationMode_note: "",
    fuelStationFixedCable_correct: "",
    fuelStationFixedCable_note: "",
    fuelStationEmergencySwitchMain_correct: "",
    fuelStationEmergencySwitchMain_note: "",
    fuelStationEmergencySwitchDistance_correct: "",
    fuelStationEmergencySwitchDistance_note: "",
    fuelStationElectricalEquipmentHazard_correct: "",
    fuelStationElectricalEquipmentHazard_note: "",
    fuelStationChargerDistance_correct: "",
    fuelStationChargerDistance_note: "",

    // 3.7.6 ข้อแนะนำในการป้องกันเครื่องอัดประจุยานยนต์ไฟฟ้า
    chargerProtectionCollision: "", // "ติดตั้งแล้ว", "ยังไม่ติดตั้ง"
    chargerProtectionFire: "", // "ติดตั้งแล้ว", "ยังไม่ติดตั้ง"
    chargerProtectionLightning: "", // "ติดตั้งแล้ว", "ยังไม่ติดตั้ง"

    // 4. สรุปผลการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
    summaryResult: "", // "ติดตั้งมิเตอร์ถาวร", "ติดตั้งมิเตอร์ชั่วคราว", "ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์"

    // 5. ขอบเขตและข้อจำกัดในการตรวจสอบ
    scopeOfInspection: "",

    // 6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ (Signatures)
    userSignature: "",
    inspectorSignature: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const { formId } = searchParams; // ดึง formId จากพารามิเตอร์ URL
  const { saveForm, loadForm } = useFormManager(); // ใช้ hook สำหรับจัดการฟอร์ม
  const [isLoading, setIsLoading] = useState(false); // สถานะการโหลดสำหรับการบันทึกฟอร์ม
  // useRef สำหรับเก็บข้อมูลฟอร์มก่อนหน้า
  const previousFormDataRef = useRef(null);
  const userSigRef = useRef(null);
  const inspectorSigRef = useRef(null);

  // จัดการการเปลี่ยนแปลงสำหรับช่องป้อนข้อมูลทั้งหมด (ข้อความ, ตัวเลข, เลือก, ตัวเลือก, กล่องกาเครื่องหมาย)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // กำหนดค่า checked สำหรับกล่องกาเครื่องหมาย, ค่าสำหรับอื่นๆ
    }));
  };
  const handleSignatureSave = (name, dataUrl) => {
  setFormData((prev) => ({
    ...prev,
    [name]: dataUrl,
  }));
};

// จัดการการลบลายเซ็น
const handleSignatureClear = (name) => {
  setFormData((prev) => ({
    ...prev,
    [name]: "",
  }));
};

  // จัดการการเปลี่ยนแปลงเฉพาะสำหรับสถานะของส่วนประกอบ CorrectiveRadio
  const handleRadioChange = (groupName, value, noteFieldName) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: value, // อัปเดตสถานะ (เช่น 'ถูกต้อง' หรือ 'ต้องแก้ไข')
      ...(value === 'ถูกต้อง' && { [noteFieldName]: '' }), // ล้างบันทึกหากสถานะถูกตั้งค่าเป็น 'ถูกต้อง'
    }));
  };

  // useEffect เพื่อตั้งค่าวันที่เริ่มต้นเป็นวันที่ปัจจุบันเมื่อส่วนประกอบถูกเมานต์
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // เดือนเป็นแบบ 0-indexed ดังนั้นต้องบวก 1
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`; // รูปแบบ YYYY-MM-DD สำหรับประเภท input date

    setFormData(prev => ({
      ...prev,
      inspectionDate: formattedDate,
      requestDate: formattedDate,
    }));
  }, []); // อาร์เรย์ dependency ว่างเปล่าหมายความว่าโค้ดนี้จะทำงานเพียงครั้งเดียวเมื่อเมานต์

  // จัดการการส่งฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault(); // ป้องกันพฤติกรรมการส่งฟอร์มเริ่มต้น
    console.log("Form Data Submitted:", formData); // บันทึกข้อมูลฟอร์มปัจจุบันลงในคอนโซล
    // TODO: ผสานรวมกับแบ็กเอนด์สำหรับการส่งฟอร์ม (เช่น การเรียก API)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
      {/* ชื่อฟอร์มหลัก */}
      <h2 className="text-3xl font-extrabold mb-8 text-center text-[#5b2d90]">
        การไฟฟ้าส่วนภูมิภาค
        <br />
        แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าก่อนติดตั้งมิเตอร์
        <br />
        สำหรับผู้ใช้ไฟฟ้าที่รับไฟฟ้าแรงต่ำจากหม้อแปลงจำหน่ายของการไฟฟ้าส่วนภูมิภาค (PEA)
      </h2>

      {/* ส่วนข้อมูลส่วนหัว */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">ข้อมูลส่วนหัว</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ช่องป้อนข้อมูลการไฟฟ้า */}
          <div className="md:col-span-2">
            <label htmlFor="peaOffice" className="block text-sm font-medium text-gray-700 mb-1">การไฟฟ้า: </label>
            <input type="text" id="peaOffice" name="peaOffice" value={formData.peaOffice} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
          </div>
          {/* ช่องป้อนข้อมูลเลขที่บันทึกตรวจสอบ */}
          <div>
            <label htmlFor="inspectionNumber" className="block text-sm font-medium text-gray-700 mb-1">การตรวจสอบครั้งที่: </label>
            <input type="text" id="inspectionNumber" name="inspectionNumber" value={formData.inspectionNumber} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]" />
          </div>
          {/* ช่องป้อนข้อมูลวันที่ตรวจสอบ */}
          <div>
              <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-900 mb-1">วันที่ตรวจสอบ: <span className="text-xs text-gray-500">(อัตโนมัติ)</span></label>
              <input type="date" id="inspectionDate" name="inspectionDate" value={formData.inspectionDate} onChange={handleChange} readOnly className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] bg-gray-100 text-gray-900" />
            </div>
          {/* ช่องป้อนข้อมูลเลขที่คำร้องขอใช้ไฟฟ้า */}
          <div>
            <label htmlFor="requestNumber" className="block text-sm font-medium text-gray-700 mb-1">
              การตรวจสอบตามคำร้องขอใช้ไฟเลขที่:
            </label>
            <input type="text" id="requestNumber" name="requestNumber" value={formData.requestNumber} onChange={handleChange} className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
            />
          </div>
          {/* ช่องป้อนข้อมูลวันที่ยื่นคำร้อง */}
          <div>
            <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700 mb-1">
              วันที่:
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

      {/* 1. ส่วนข้อมูลทั่วไป */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
          1. ข้อมูลทั่วไป
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ช่องป้อนข้อมูลชื่อ-นามสกุล */}
          <div className="md:col-span-2">
            <label className="inline-flex items-center text-gray-800 mb-1">
              <input
                type="checkbox"
                name="isIndividualApplicant" // สมมติว่าเป็นกล่องกาเครื่องหมายเพื่อเลือกระหว่างบุคคลธรรมดาหรือนิติบุคคล
                checked={formData.isIndividualApplicant}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">ชื่อ-นามสกุล ผู้ขอใช้ไฟฟ้า (นาย/นาง/นางสาว):</span>
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
          {/* ช่องป้อนข้อมูลโทรศัพท์ */}
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
          {/* ช่องป้อนข้อมูลชื่อนิติบุคคล */}
          <div className="md:col-span-2">
            <label className="inline-flex items-center text-gray-800 mb-1">
              <input
                type="checkbox"
                name="isCorporateApplicant" // สมมติว่าเป็นกล่องกาเครื่องหมายเพื่อเลือกระหว่างบุคคลธรรมดาหรือนิติบุคคล
                checked={formData.isCorporateApplicant}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">ชื่อนิติบุคคล ที่ขอใช้ไฟฟ้า:</span>
            </label>
            <input
              type="text"
              id="corporateName"
              name="corporateName"
              value={formData.corporateName}
              onChange={handleChange}
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
            />
          </div>
          {/* ช่องป้อนข้อมูลโทรศัพท์นิติบุคคล */}
          <div>
            <label htmlFor="corporatePhone" className="block text-sm font-medium text-gray-700 mb-1">
              โทรศัพท์:
            </label>
            <input
              type="text"
              id="corporatePhone"
              name="corporatePhone"
              value={formData.corporatePhone}
              onChange={handleChange}
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
            />
          </div>
          {/* ช่องข้อความที่อยู่ */}
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
          {/* ประเภทระบบไฟฟ้า */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ระบบไฟฟ้า:
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="inline-flex items-center text-gray-800">
                <input
                  type="radio"
                  name="systemType"
                  value="3_phase"
                  checked={formData.systemType === '3_phase'}
                  onChange={handleChange}
                  className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
                />
                <span className="ml-3">3 เฟส (400/230 โวลต์)</span>
              </label>
              <label className="inline-flex items-center text-gray-800">
                <input
                  type="radio"
                  name="systemType"
                  value="1_phase"
                  checked={formData.systemType === '1_phase'}
                  onChange={handleChange}
                  className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
                />
                <span className="ml-3">1 เฟส (230 โวลต์)</span>
              </label>
            </div>
          </div>
          {/* โหลดโดยประมาณ */}
          <div>
            <label htmlFor="estimatedLoadAmp" className="block text-sm font-medium text-gray-700 mb-1">
              กระแสโหลดรวมโดยประมาณ (A):
            </label>
            <input
              type="number"
              id="estimatedLoadAmp"
              name="estimatedLoadAmp"
              value={formData.estimatedLoadAmp}
              onChange={handleChange}
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
            />
          </div>
          {/* จำนวนเครื่องชาร์จ EV */}
          <div>
            <label htmlFor="evChargerCount" className="block text-sm font-medium text-gray-700 mb-1">
              ติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้ารวม (เครื่อง):
            </label>
            <input
              type="number"
              id="evChargerCount"
              name="evChargerCount"
              value={formData.evChargerCount}
              onChange={handleChange}
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
            />
          </div>
          {/* กำลังไฟฟ้ารวมของเครื่องชาร์จ EV */}
          <div>
            <label htmlFor="evChargerPowerKw" className="block text-sm font-medium text-gray-700 mb-1">
              พิกัดกำลังไฟฟ้ารวมของเครื่องอัดประจุยานยนต์ไฟฟ้า (kW):
            </label>
            <input
              type="number"
              step="0.01"
              id="evChargerPowerKw"
              name="evChargerPowerKw"
              value={formData.evChargerPowerKw}
              onChange={handleChange}
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
            />
          </div>
        </div>
      </section>

      {/* 2. ส่วนเอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
          2. เอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
        </h2>

        {/* 2.1 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่ส่วนบุคคล */}
        <div className="mb-6 pl-4 border-l-4 border-[#a78bfa]">
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            2.1 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่ส่วนบุคคล (เช่น บ้านอยู่อาศัย กิจการขนาดเล็ก หรืออาคารที่คล้ายคลึงกัน)
          </h3>
          <div className="space-y-3 mb-4">
            <label className="inline-flex items-center text-gray-800">
              <input
                type="checkbox"
                name="personal_specSheetChecked"
                checked={formData.personal_specSheetChecked}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า ที่แสดงรายละเอียดข้อมูลทั่วไปและอุปกรณ์ป้องกันต่างๆ</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="checkbox"
                name="personal_singleLineDiagramChecked"
                checked={formData.personal_singleLineDiagramChecked}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">แผนผังระบบไฟฟ้า (Single Line Diagram) (ถ้ามี)</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="checkbox"
                name="personal_loadScheduleChecked"
                checked={formData.personal_loadScheduleChecked}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">ตารางโหลด (Load Schedule) (ถ้ามี)</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="inline-flex items-center text-gray-800">
              <input
                type="radio"
                name="personal_documentsComplete"
                value="ครบถ้วน"
                checked={formData.personal_documentsComplete === 'ครบถ้วน'}
                onChange={handleChange}
                className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
              />
              <span className="ml-3">ครบถ้วน</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="radio"
                name="personal_documentsComplete"
                value="ไม่ครบถ้วน"
                checked={formData.personal_documentsComplete === 'ไม่ครบถ้วน'}
                onChange={handleChange}
                className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
              />
              <span className="ml-3">ไม่ครบถ้วน</span>
            </label>
            {formData.personal_documentsComplete === 'ไม่ครบถ้วน' && (
              <input
                type="text"
                name="personal_documentsIncompleteNote"
                value={formData.personal_documentsIncompleteNote}
                onChange={handleChange}
                className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-full md:w-auto flex-grow"
                placeholder="ระบุ"
              />
            )}
          </div>
        </div>

        {/* 2.2 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่สาธารณะ */}
        <div className="mb-6 pl-4 border-l-4 border-[#a78bfa]">
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            2.2 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่สาธารณะ (สถานีอัดประจุยานยนต์ไฟฟ้า ร้านอาหาร ร้านค้า ร้านสะดวกซื้อ ถนนสาธารณะ หรืออาคารที่คล้ายคลึงกัน) ต้องมีเอกสารประกอบการตรวจสอบดังต่อไปนี้
          </h3>
          <div className="space-y-3 mb-4">
            <label className="inline-flex items-center text-gray-800">
              <input
                type="checkbox"
                name="public_singleLineDiagramChecked"
                checked={formData.public_singleLineDiagramChecked}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">แผนผังระบบไฟฟ้า (Single Line Diagram) ระบุพิกัดของอุปกรณ์ต่างๆ วิธีการเดินสาย รายละเอียดท่อร้อยสาย รวมถึงระบบต่อลงดิน อย่างครบถ้วน โดยมีวิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="checkbox"
                name="public_asBuiltDrawingChecked"
                checked={formData.public_asBuiltDrawingChecked}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่มีวิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="checkbox"
                name="public_loadScheduleCalculationChecked"
                checked={formData.public_loadScheduleCalculationChecked}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า ที่มีวิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="checkbox"
                name="public_engineerLicenseCopyChecked"
                checked={formData.public_engineerLicenseCopyChecked}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรมไฟฟ้า</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="checkbox"
                name="public_specSheetChecked"
                checked={formData.public_specSheetChecked}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า ที่แสดงรายละเอียดข้อมูลทั่วไปและอุปกรณ์ป้องกันต่างๆ</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="checkbox"
                name="public_notificationLicenseChecked"
                checked={formData.public_notificationLicenseChecked}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">หนังสือจดแจ้ง (พิกัดน้อยกว่า 1,000 kVA) หรือใบอนุญาต (พิกัดตั้งแต่ 1,000 kVA ขึ้นไป) เพื่อประกอบกิจการสถานีอัดประจุยานยนต์ไฟฟ้าจากสำนักงานกำกับกิจการพลังงาน (สกพ.)</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="inline-flex items-center text-gray-800">
              <input
                type="radio"
                name="public_documentsComplete"
                value="ครบถ้วน"
                checked={formData.public_documentsComplete === 'ครบถ้วน'}
                onChange={handleChange}
                className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
              />
              <span className="ml-3">ครบถ้วน</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input
                type="radio"
                name="public_documentsComplete"
                value="ไม่ครบถ้วน"
                checked={formData.public_documentsComplete === 'ไม่ครบถ้วน'}
                onChange={handleChange}
                className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
              />
              <span className="ml-3">ไม่ครบถ้วน</span>
            </label>
            {formData.public_documentsComplete === 'ไม่ครบถ้วน' && (
              <textarea
                name="public_documentsIncompleteNote"
                value={formData.public_documentsIncompleteNote}
                onChange={handleChange}
                rows="3"
                className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-full"
                placeholder="ระบุ"
              ></textarea>
            )}
          </div>
        </div>
      </section>

      {/* ส่วนมาตรฐานอ้างอิง */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
          การตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าอ้างอิงแบบมาตรฐาน ดังนี้
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm font-medium">
          <li>ก) แบบมาตรฐาน “ข้อกำหนดทั่วไปสำหรับการติดตั้งทางไฟฟ้า ระบบอัดประจุยานยนต์ไฟฟ้า” (การประกอบเลขที่ 9807)</li>
          <li>ข) แบบมาตรฐาน “การติดตั้งทางไฟฟ้าการอัดประจุยานยนต์ไฟฟ้าระบบ 1 เฟส สำหรับผู้ใช้ไฟประเภทที่อยู่อาศัยและธุรกิจขนาดเล็ก” (การประกอบเลขที่ 0901)</li>
          <li>ค) แบบมาตรฐาน “การติดตั้งทางไฟฟ้าการอัดประจุยานยนต์ไฟฟ้าระบบ 3 เฟส สำหรับผู้ใช้ไฟประเภทที่อยู่อาศัยและธุรกิจขนาดเล็ก” (การประกอบเลขที่ 0902)</li>
          <li>ง) แบบมาตรฐาน “การติดตั้งทางไฟฟ้าสถานีอัดประจุยานยนต์ไฟฟ้า สำหรับสถานประกอบการ” (การประกอบเลขที่ 0903)</li>
          <li>จ) มาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับล่าสุด)</li>
        </ul>
        <p className="text-gray-600 text-xs mt-4">
          * ดาวน์โหลดแบบมาตรฐานและข้อมูลที่เกี่ยวข้องที่ลิงค์หรือ QR Code นี้ <a href="https://qrgo.page.link/ijtvD" target="_blank" rel="noopener noreferrer" className="text-[#5b2d90] hover:underline">https://qrgo.page.link/ijtvD</a>
        </p>
      </section>

      {/* 3. ส่วนระบบไฟฟ้าแรงต่ำ */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
        <h2 className="text-2xl font-bold mb-5 text-[#3a1a5b]">
          3. ระบบไฟฟ้าแรงต่ำ
        </h2>

        {/* 3.1 วงจรประธานแรงต่ำ */}
        <div className="mb-6 pl-4 border-l-4 border-[#a78bfa]">
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            3.1 วงจรประธานแรงต่ำ
          </h3>
          <div className="space-y-4">
            {/* 3.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                3.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน:
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="mainCableStandard" value="มอก. 11-2553" checked={formData.mainCableStandard === 'มอก. 11-2553'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">มอก. 11-2553</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="mainCableStandard" value="มอก. 293-2541" checked={formData.mainCableStandard === 'มอก. 293-2541'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">มอก. 293-2541</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="mainCableStandard" value="IEC 60502" checked={formData.mainCableStandard === 'IEC 60502'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">IEC 60502</span>
                </label>
              </div>
              <CorrectiveRadio
                groupName="mainCableStandard_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.mainCableStandard_correct}
                currentNote={formData.mainCableStandard_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            {/* 3.1.2 ชนิดสายตัวนำ */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                3.1.2 ชนิดสายตัวนำ:
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="mainCableType" value="IEC01" checked={formData.mainCableType === 'IEC01'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">IEC01</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="mainCableType" value="NYY" checked={formData.mainCableType === 'NYY'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">NYY</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="mainCableType" value="CV" checked={formData.mainCableType === 'CV'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">CV</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="mainCableType" value="อื่นๆ" checked={formData.mainCableType === 'อื่นๆ'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">อื่นๆ</span>
                </label>
                {formData.mainCableType === 'อื่นๆ' && (
                  <input type="text" name="mainCableOtherType" value={formData.mainCableOtherType} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                )}
              </div>
              <CorrectiveRadio
                groupName="mainCableType_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.mainCableType_correct}
                currentNote={formData.mainCableType_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            {/* 3.1.3 ขนาดสายเฟส */}
            <div className="mb-4">
              <label htmlFor="mainCablePhaseSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
                3.1.3 ขนาดสายเฟส (ตร.มม.):
              </label>
              <input
                type="number"
                id="mainCablePhaseSizeSqmm"
                name="mainCablePhaseSizeSqmm"
                value={formData.mainCablePhaseSizeSqmm}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                พิกัดกระแสสายตัวนำประธานต้องไม่น้อยกว่าขนาดปรับตั้งของเมนเซอร์กิตเบรกเกอร์ และสอดคล้องกับขนาดมิเตอร์ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด
              </p>
              <CorrectiveRadio
                groupName="mainCablePhaseSize_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.mainCablePhaseSize_correct}
                currentNote={formData.mainCablePhaseSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            {/* 3.1.4 ขนาดสายนิวทรัล */}
            <div className="mb-4">
              <label htmlFor="mainCableNeutralSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
                3.1.4 ขนาดสายนิวทรัล (ตร.มม.):
              </label>
              <input
                type="number"
                id="mainCableNeutralSizeSqmm"
                name="mainCableNeutralSizeSqmm"
                value={formData.mainCableNeutralSizeSqmm}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <CorrectiveRadio
                groupName="mainCableNeutralSize_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.mainCableNeutralSize_correct}
                currentNote={formData.mainCableNeutralSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            {/* 3.1.5 ระบุเฟสสายตัวนำ */}
            <CorrectiveRadio
              groupName="mainCablePhaseMarking_correct"
              label="3.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ"
              currentValue={formData.mainCablePhaseMarking_correct}
              currentNote={formData.mainCablePhaseMarking_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 3.1.6 ช่องเดินสายมีความต่อเนื่องทางกล */}
            <CorrectiveRadio
              groupName="mainConduitContinuity_correct"
              label="3.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ"
              currentValue={formData.mainConduitContinuity_correct}
              currentNote={formData.mainConduitContinuity_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 3.1.7 วิธีการเดินสาย */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3.1.7 วิธีการเดินสาย:
              </label>
              <div className="mt-2 space-y-3">
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="mainWiringMethodOverhead" checked={formData.mainWiringMethodOverhead} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="mainWiringMethodCableTray" checked={formData.mainWiringMethodCableTray} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                  {formData.mainWiringMethodCableTray && (
                    <>
                      <input type="number" name="mainWiringMethodCableTraySizeX" value={formData.mainWiringMethodCableTraySizeX} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">มม. x</span>
                      <input type="number" name="mainWiringMethodCableTraySizeY" value={formData.mainWiringMethodCableTraySizeY} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-1 w-20" />
                      <span className="ml-1">มม.</span>
                    </>
                  )}
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="mainWiringMethodDirectBurial" checked={formData.mainWiringMethodDirectBurial} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="mainWiringMethodConduitBurial" checked={formData.mainWiringMethodConduitBurial} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ ท่อร้อยสายขนาด</span>
                  {formData.mainWiringMethodConduitBurial && (
                    <>
                      <input type="number" step="0.01" name="mainWiringMethodConduitBurialSize" value={formData.mainWiringMethodConduitBurialSize} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">นิ้ว</span>
                    </>
                  )}
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="mainWiringMethodConduitWall" checked={formData.mainWiringMethodConduitWall} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                  {formData.mainWiringMethodConduitWall && (
                    <>
                      <input type="number" step="0.01" name="mainWiringMethodConduitWallSize" value={formData.mainWiringMethodConduitWallSize} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">นิ้ว</span>
                    </>
                  )}
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="mainWiringMethodOther" checked={formData.mainWiringMethodOther} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">อื่นๆ ระบุ</span>
                  {formData.mainWiringMethodOther && (
                    <input type="text" name="mainWiringMethodOtherText" value={formData.mainWiringMethodOtherText} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * การไฟฟ้าส่วนภูมิภาคกำหนดให้ใช้สายตัวนำทองแดงสำหรับการเดินสายภายในและภายนอกอาคาร ส่วนสายตัวนำอะลูมิเนียมอนุญาตให้ใช้เป็นตัวนำประธานได้เฉพาะการเดินสายบนลูกถ้วยฉนวนภายนอกอาคาร
              </p>
              <CorrectiveRadio
                groupName="mainWiringMethod_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.mainWiringMethod_correct}
                currentNote={formData.mainWiringMethod_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            {/* 3.1.8 ประเภทท่อร้อยสาย */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3.1.8 ประเภทท่อร้อยสาย:
              </label>
              <div className="mt-2 space-y-3">
                <p className="text-gray-800 font-bold">ท่อโลหะ</p>
                <div className="flex flex-wrap gap-4 ml-4">
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="mainConduitTypeRMC" checked={formData.mainConduitTypeRMC} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">หนา (RMC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="mainConduitTypeIMC" checked={formData.mainConduitTypeIMC} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">หนาปานกลาง (IMC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="mainConduitTypeEMT" checked={formData.mainConduitTypeEMT} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">บาง (EMT)</span>
                  </label>
                </div>
                <p className="text-gray-800 font-bold mt-2">ท่ออโลหะ</p>
                <div className="flex flex-wrap gap-4 ml-4">
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="mainConduitTypeRNC" checked={formData.mainConduitTypeRNC} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">แข็ง (RNC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="mainConduitTypeENT" checked={formData.mainConduitTypeENT} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">อ่อน (ENT)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="mainConduitTypeFlexibleMetal" checked={formData.mainConduitTypeFlexibleMetal} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
                  </label>
                </div>
                <label className="inline-flex items-center text-gray-800 mt-2">
                  <input type="checkbox" name="mainConduitTypeOther" checked={formData.mainConduitTypeOther} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">อื่นๆ ระบุ</span>
                  {formData.mainConduitTypeOther && (
                    <input type="text" name="mainConduitTypeOtherText" value={formData.mainConduitTypeOtherText} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                  )}
                </label>
              </div>
              <CorrectiveRadio
                groupName="mainConduitType_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.mainConduitType_correct}
                currentNote={formData.mainConduitType_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* 3.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน) */}
        <div className="mb-6 pl-4 border-l-4 border-[#a78bfa]">
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            3.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)
          </h3>
          <CorrectiveRadio
            groupName="mainBreakerStandard_correct"
            label="3.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2"
            currentValue={formData.mainBreakerStandard_correct}
            currentNote={formData.mainBreakerStandard_note}
            onStatusChange={handleRadioChange}
            onNoteChange={handleChange}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3.2.2 พิกัดกระแสเมนเซอร์กิตเบรกเกอร์ (A):
            </label>
            <input
              type="number"
              id="mainBreakerAmpRating"
              name="mainBreakerAmpRating"
              value={formData.mainBreakerAmpRating}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              สอดคล้องกับพิกัดกระแสสายตัวนำประธาน
            </p>
            <CorrectiveRadio
              groupName="mainBreakerAmpRating_correct"
              label="ถูกต้องหรือไม่"
              currentValue={formData.mainBreakerAmpRating_correct}
              currentNote={formData.mainBreakerAmpRating_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mainBreakerShortCircuitRating" className="block text-sm font-medium text-gray-700 mb-1">
              3.2.3 พิกัดทนกระแสลัดวงจร (kA):
            </label>
            <input
              type="number"
              step="0.01"
              id="mainBreakerShortCircuitRating"
              name="mainBreakerShortCircuitRating"
              value={formData.mainBreakerShortCircuitRating}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <CorrectiveRadio
              groupName="mainBreakerShortCircuitRating_correct"
              label="ถูกต้องหรือไม่
              currentValue={formData.mainBreakerShortCircuitRating_correct}
              currentNote={formData.mainBreakerShortCircuitRating_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>
        </div>

        {/* 3.3 ระบบการต่อลงดินที่แผงเมนสวิตช์ */}
        <div className="mb-6 pl-4 border-l-4 border-[#a78bfa]">
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            3.3 ระบบการต่อลงดินที่แผงเมนสวิตช์
          </h3>
          <div className="mb-4">
            <label htmlFor="mainGroundWireSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
              3.3.1 สายต่อหลักดิน (ตัวนำทองแดง) ขนาด (ตร.มม.):
            </label>
            <input
              type="number"
              id="mainGroundWireSizeSqmm"
              name="mainGroundWireSizeSqmm"
              value={formData.mainGroundWireSizeSqmm}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              สอดคล้องกับขนาดสายตัวนำประธาน ตามตารางที่ 1 ในหน้าที่ 5
            </p>
            <CorrectiveRadio
              groupName="mainGroundWireSize_correct"
              label="ถูกต้องหรือไม่"
              currentValue={formData.mainGroundWireSize_correct}
              currentNote={formData.mainGroundWireSize_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3.3.2 การต่อลงดินที่แผงเมนสวิตช์:
            </label>
            <div className="space-y-3 mt-2">
              <label className="inline-flex items-center text-gray-800">
                <input
                  type="radio"
                  name="mainGrounding1Phase_correct"
                  value="ถูกต้อง"
                  checked={formData.mainGrounding1Phase_correct === 'ถูกต้อง'}
                  onChange={handleChange}
                  className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
                />
                <span className="ml-3">กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด</span>
              </label>
              <label className="inline-flex items-center text-gray-800">
                <input
                  type="radio"
                  name="mainGrounding3Phase_correct"
                  value="ถูกต้อง"
                  checked={formData.mainGrounding3Phase_correct === 'ถูกต้อง'}
                  onChange={handleChange}
                  className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
                />
                <span className="ml-3">กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด</span>
              </label>
            </div>
            <CorrectiveRadio
              groupName="mainGrounding1Phase_correct" // This needs to be a separate state for each radio, or a single one for the whole group.
              label="ถูกต้องหรือไม่ (1 เฟส)" // Re-labeling for clarity
              currentValue={formData.mainGrounding1Phase_correct}
              currentNote={formData.mainGrounding1Phase_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="mainGrounding3Phase_correct" // This needs to be a separate state for each radio, or a single one for the whole group.
              label="ถูกต้องหรือไม่ (3 เฟส)" // Re-labeling for clarity
              currentValue={formData.mainGrounding3Phase_correct}
              currentNote={formData.mainGrounding3Phase_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>
        </div>

        {/* 3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ */}
        <div className="mb-6 pl-4 border-l-4 border-[#a78bfa]">
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งรูปแบบ)
          </h3>
          <div className="flex flex-wrap gap-4 mt-2 mb-4">
            <label className="inline-flex items-center text-gray-800">
              <input type="radio" name="groundingSystemType" value="TN-C-S" checked={formData.groundingSystemType === 'TN-C-S'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
              <span className="ml-3">TN-C-S ทั้งระบบ</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input type="radio" name="groundingSystemType" value="TT" checked={formData.groundingSystemType === 'TT'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
              <span className="ml-3">TT ทั้งระบบ</span>
            </label>
            <label className="inline-flex items-center text-gray-800">
              <input type="radio" name="groundingSystemType" value="TT_partial" checked={formData.groundingSystemType === 'TT_partial'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
              <span className="ml-3">TT บางส่วน (ต้นทางเป็น TN-C-S และ โหลดเป็น TT)</span>
            </label>
          </div>

          {/* การแสดงผลแบบมีเงื่อนไขตาม groundingSystemType */}
          {formData.groundingSystemType === 'TN-C-S' && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="text-lg font-semibold mb-3 text-[#3a1a5b]">3.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องมีมาตรการอย่างใดอย่างหนึ่ง)</h4>
              <div className="space-y-3">
                <div className="mb-4">
                  <label htmlFor="tncs_groundResistanceOhm" className="block text-sm font-medium text-gray-700 mb-1">
                    ค่าความต้านทานการต่อลงดิน (Ω):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="tncs_groundResistanceOhm"
                    name="tncs_groundResistanceOhm"
                    value={formData.tncs_groundResistanceOhm}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    กรณีมิเตอร์ 15(45), 5(45) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 2.5 Ω<br />
                    กรณีมิเตอร์ 30(100), 5(100) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 1.25 Ω
                  </p>
                  <CorrectiveRadio
                    groupName="tncs_groundResistance_correct"
                    label="ถูกต้องหรือไม่"
                    currentValue={formData.tncs_groundResistance_correct}
                    currentNote={formData.tncs_groundResistance_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                </div>
                <label className="inline-flex items-center text-gray-800 block mb-2">
                  <input type="checkbox" name="tncs_overUnderVoltageProtection" checked={formData.tncs_overUnderVoltageProtection} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">ติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกินเพิ่มเติม ในตำแหน่งก่อนเข้าเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
                </label>
                <CorrectiveRadio
                  groupName="tncs_overUnderVoltageProtection_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.tncs_overUnderVoltageProtection_correct}
                  currentNote={formData.tncs_overUnderVoltageProtection_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <label className="inline-flex items-center text-gray-800 block mb-2">
                  <input type="checkbox" name="tncs_evChargerBuiltInProtection" checked={formData.tncs_evChargerBuiltInProtection} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">มีระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกิน ติดตั้งมาภายในเครื่องอัดประจุยานยนต์ไฟฟ้าแล้ว</span>
                </label>
                <CorrectiveRadio
                  groupName="tncs_evChargerBuiltInProtection_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.tncs_evChargerBuiltInProtection_correct}
                  currentNote={formData.tncs_evChargerBuiltInProtection_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <label className="inline-flex items-center text-gray-800 block">
                  <input type="checkbox" name="tncs_touchVoltageProtection" checked={formData.tncs_touchVoltageProtection} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครงบริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัดประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดิน ออกพร้อมกันภายในเวลา 5 วินาที</span>
                </label>
                <CorrectiveRadio
                  groupName="tncs_touchVoltageProtection_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.tncs_touchVoltageProtection_correct}
                  currentNote={formData.tncs_touchVoltageProtection_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
            </div>
          )}

          {formData.groundingSystemType === 'TT' && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="text-lg font-semibold mb-3 text-[#3a1a5b]">3.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ (ต้องดำเนินการครบทั้ง ก) และ ข))</h4>
              <div className="space-y-3">
                <label className="inline-flex items-center text-gray-800 block mb-2">
                  <input type="checkbox" name="tt_rcdAllCircuits" checked={formData.tt_rcdAllCircuits} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">ก) ติดตั้งเครื่องตัดไฟรั่ว (RCD) ทุกวงจรไฟฟ้าที่จ่ายไฟ หรือทุกเครื่องใช้ไฟฟ้า ไม่ว่าจะเกี่ยวข้องกับการอัดประจุยานยนต์ไฟฟ้าหรือไม่ก็ตาม</span>
                </label>
                <CorrectiveRadio
                  groupName="tt_rcdAllCircuits_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.tt_rcdAllCircuits_correct}
                  currentNote={formData.tt_rcdAllCircuits_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <label className="inline-flex items-center text-gray-800 block">
                  <input type="checkbox" name="tt_overUnderVoltageProtection" checked={formData.tt_overUnderVoltageProtection} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">ข) ติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกิน สำหรับวงจรที่จ่ายไฟให้เครื่องอัดประจุยานยนต์ไฟฟ้า หรือมีระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกินที่ติดตั้งมาภายในเครื่องอัดประจุยานยนต์ไฟฟ้าแล้ว</span>
                </label>
                <CorrectiveRadio
                  groupName="tt_overUnderVoltageProtection_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.tt_overUnderVoltageProtection_correct}
                  currentNote={formData.tt_overUnderVoltageProtection_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
            </div>
          )}

          {formData.groundingSystemType === 'TT_partial' && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="text-lg font-semibold mb-3 text-[#3a1a5b]">3.4.3 กรณีต่อลงดินแบบ TT บางส่วน</h4>
              <h5 className="text-base font-semibold mb-2 text-gray-700">3.4.3.1 มาตรการที่ต้องดำเนินการให้ครบทุกข้อ (ก – ค)</h5>
              <div className="space-y-3 mb-4">
                <label className="inline-flex items-center text-gray-800 block mb-2">
                  <input type="checkbox" name="ttPartial_riskAssessment" checked={formData.ttPartial_riskAssessment} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">ก) มีการประเมินความเสี่ยงก่อนว่า ไม่มีโอกาสที่บุคคลจะสัมผัสโครงบริภัณฑ์ไฟฟ้าอื่นที่ต่อลงดินแบบ TN-C-S กับโครงบริภัณฑ์จ่ายไฟยานยนต์ไฟฟ้า หรือโครงยานยนต์ไฟฟ้าที่ต่อลงดินแบบ TT โดยพร้อมกัน หรือมีระยะห่างไม่น้อยกว่า 2.50 เมตร สามารถใช้การห่อหุ้มหรือกั้นได้</span>
                </label>
                <CorrectiveRadio
                  groupName="ttPartial_riskAssessment_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.ttPartial_riskAssessment_correct}
                  currentNote={formData.ttPartial_riskAssessment_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <label className="inline-flex items-center text-gray-800 block mb-2">
                  <input type="checkbox" name="ttPartial_groundDistance" checked={formData.ttPartial_groundDistance} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">ข) ระยะห่างระหว่างหลักดินของระบบ TN-C-S กับระบบ TT ต้องห่างกันอย่างน้อย 2.00 เมตร</span>
                </label>
                <CorrectiveRadio
                  groupName="ttPartial_groundDistance_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.ttPartial_groundDistance_correct}
                  currentNote={formData.ttPartial_groundDistance_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <label className="inline-flex items-center text-gray-800 block">
                  <input type="checkbox" name="ttPartial_warningSign" checked={formData.ttPartial_warningSign} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">ค) มีการติดตั้งป้ายแสดงข้อความเตือนบริเวณเครื่องอัดประจุยานยนต์ไฟฟ้า ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด</span>
                </label>
                <CorrectiveRadio
                  groupName="ttPartial_warningSign_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.ttPartial_warningSign_correct}
                  currentNote={formData.ttPartial_warningSign_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>

              <h5 className="text-base font-semibold mb-2 text-gray-700 mt-6">3.4.3.2 มาตรการที่ต้องเลือกทำอย่างใดอย่างหนึ่ง</h5>
              <div className="space-y-3">
                <div className="mb-4">
                  <label htmlFor="ttPartial_groundResistanceOhm" className="block text-sm font-medium text-gray-700 mb-1">
                    ค่าความต้านทานการต่อลงดิน (Ω):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="ttPartial_groundResistanceOhm"
                    name="ttPartial_groundResistanceOhm"
                    value={formData.ttPartial_groundResistanceOhm}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    กรณีมิเตอร์ 15(45), 5(45) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 2.5 Ω<br />
                    กรณีมิเตอร์ 30(100), 5(100) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 1.25 Ω
                  </p>
                  <CorrectiveRadio
                    groupName="ttPartial_groundResistance_correct"
                    label="ถูกต้องหรือไม่"
                    currentValue={formData.ttPartial_groundResistance_correct}
                    currentNote={formData.ttPartial_groundResistance_note}
                    onStatusChange={handleRadioChange}
                    onNoteChange={handleChange}
                  />
                </div>
                <label className="inline-flex items-center text-gray-800 block mb-2">
                  <input type="checkbox" name="ttPartial_overUnderVoltageProtection" checked={formData.ttPartial_overUnderVoltageProtection} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">ติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกินเพิ่มเติม ในตำแหน่งก่อนเข้าเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
                </label>
                <CorrectiveRadio
                  groupName="ttPartial_overUnderVoltageProtection_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.ttPartial_overUnderVoltageProtection_correct}
                  currentNote={formData.ttPartial_overUnderVoltageProtection_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <label className="inline-flex items-center text-gray-800 block mb-2">
                  <input type="checkbox" name="ttPartial_evChargerBuiltInProtection" checked={formData.ttPartial_evChargerBuiltInProtection} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">มีระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกิน ติดตั้งมาภายในเครื่องอัดประจุยานยนต์ไฟฟ้าแล้ว</span>
                </label>
                <CorrectiveRadio
                  groupName="ttPartial_evChargerBuiltInProtection_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.ttPartial_evChargerBuiltInProtection_correct}
                  currentNote={formData.ttPartial_evChargerBuiltInProtection_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
                <label className="inline-flex items-center text-gray-800 block">
                  <input type="checkbox" name="ttPartial_touchVoltageProtection" checked={formData.ttPartial_touchVoltageProtection} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครงบริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัดประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดิน ออกพร้อมกันภายในเวลา 5 วินาที</span>
                </label>
                <CorrectiveRadio
                  groupName="ttPartial_touchVoltageProtection_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.ttPartial_touchVoltageProtection_correct}
                  currentNote={formData.ttPartial_touchVoltageProtection_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* 3.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board) (ถ้ามี) */}
        <div className="mb-6 pl-4 border-l-4 border-[#a78bfa]">
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            3.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board) (ถ้ามี)
          </h3>
          <div className="space-y-4">
            {/* 3.5.1 วงจรสายป้อน */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.5.1 วงจรสายป้อน</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ก) สายป้อนเป็นไปตามมาตรฐาน:
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="feederCableStandard" value="มอก. 11-2553" checked={formData.feederCableStandard === 'มอก. 11-2553'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">มอก. 11-2553</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="feederCableStandard" value="มอก. 293-2541" checked={formData.feederCableStandard === 'มอก. 293-2541'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">มอก. 293-2541</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="feederCableStandard" value="IEC 60502" checked={formData.feederCableStandard === 'IEC 60502'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">IEC 60502</span>
                </label>
              </div>
              <CorrectiveRadio
                groupName="feederCableStandard_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.feederCableStandard_correct}
                currentNote={formData.feederCableStandard_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ข) ชนิดสายตัวนำ:
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="feederCableType" value="IEC01" checked={formData.feederCableType === 'IEC01'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">IEC01</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="feederCableType" value="NYY" checked={formData.feederCableType === 'NYY'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">NYY</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="feederCableType" value="CV" checked={formData.feederCableType === 'CV'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">CV</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="feederCableType" value="อื่นๆ" checked={formData.feederCableType === 'อื่นๆ'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">อื่นๆ</span>
                </label>
                {formData.feederCableType === 'อื่นๆ' && (
                  <input type="text" name="feederCableOtherType" value={formData.feederCableOtherType} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                )}
              </div>
              <CorrectiveRadio
                groupName="feederCableType_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.feederCableType_correct}
                currentNote={formData.feederCableType_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="feederCablePhaseSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
                ค) ขนาดสายเฟส (ตร.มม.):
              </label>
              <input
                type="number"
                id="feederCablePhaseSizeSqmm"
                name="feederCablePhaseSizeSqmm"
                value={formData.feederCablePhaseSizeSqmm}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                (พิกัดกระแสสายป้อนต้องไม่น้อยกว่าขนาดปรับตั้งของเซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน และขนาดสายป้อนต้องไม่เล็กกว่า 4 ตร.มม.)
              </p>
              <CorrectiveRadio
                groupName="feederCablePhaseSize_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.feederCablePhaseSize_correct}
                currentNote={formData.feederCablePhaseSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="feederCableNeutralSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
                ง) ขนาดสายนิวทรัล (ตร.มม.):
              </label>
              <input
                type="number"
                id="feederCableNeutralSizeSqmm"
                name="feederCableNeutralSizeSqmm"
                value={formData.feederCableNeutralSizeSqmm}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <CorrectiveRadio
                groupName="feederCableNeutralSize_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.feederCableNeutralSize_correct}
                currentNote={formData.feederCableNeutralSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="feederCableGroundSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
                จ) ขนาดสายดิน (ตร.มม.):
              </label>
              <input
                type="number"
                id="feederCableGroundSizeSqmm"
                name="feederCableGroundSizeSqmm"
                value={formData.feederCableGroundSizeSqmm}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                สอดคล้องกับขนาดสายเฟสของวงจรสายป้อน ตามตารางที่ 1 ในหน้าที่ 5
              </p>
              <CorrectiveRadio
                groupName="feederCableGroundSize_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.feederCableGroundSize_correct}
                currentNote={formData.feederCableGroundSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <CorrectiveRadio
              groupName="feederCablePhaseMarking_correct"
              label="ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ"
              currentValue={formData.feederCablePhaseMarking_correct}
              currentNote={formData.feederCablePhaseMarking_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            <CorrectiveRadio
              groupName="feederConduitContinuity_correct"
              label="ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ"
              currentValue={formData.feederConduitContinuity_correct}
              currentNote={formData.feederConduitContinuity_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 3.5.2 วิธีการเดินสาย */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3.5.2 วิธีการเดินสาย:
              </label>
              <div className="mt-2 space-y-3">
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="feederWiringWireway" checked={formData.feederWiringWireway} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินในรางเดินสาย (Wireway) ขนาด</span>
                  {formData.feederWiringWireway && (
                    <>
                      <input type="number" name="feederWiringWirewaySizeX" value={formData.feederWiringWirewaySizeX} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">มม. x</span>
                      <input type="number" name="feederWiringWirewaySizeY" value={formData.feederWiringWirewaySizeY} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-1 w-20" />
                      <span className="ml-1">มม.</span>
                    </>
                  )}
                </label>
                <CorrectiveRadio
                  groupName="feederWiringWireway_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.feederWiringWireway_correct}
                  currentNote={formData.feederWiringWireway_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="feederWiringCableTray" checked={formData.feederWiringCableTray} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                  {formData.feederWiringCableTray && (
                    <>
                      <input type="number" name="feederWiringCableTraySizeX" value={formData.feederWiringCableTraySizeX} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">มม. x</span>
                      <input type="number" name="feederWiringCableTraySizeY" value={formData.feederWiringCableTraySizeY} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-1 w-20" />
                      <span className="ml-1">มม.</span>
                    </>
                  )}
                </label>
                <CorrectiveRadio
                  groupName="feederWiringCableTray_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.feederWiringCableTray_correct}
                  currentNote={formData.feederWiringCableTray_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="feederWiringBusway" checked={formData.feederWiringBusway} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">บัสเวย์ (Busway) หรือบัสดัก (Bus duct) ขนาด</span>
                  {formData.feederWiringBusway && (
                    <>
                      <input type="number" name="feederWiringBuswaySizeX" value={formData.feederWiringBuswaySizeX} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">มม. x</span>
                      <input type="number" name="feederWiringBuswaySizeY" value={formData.feederWiringBuswaySizeY} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-1 w-20" />
                      <span className="ml-1">มม.</span>
                    </>
                  )}
                </label>
                <CorrectiveRadio
                  groupName="feederWiringBusway_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.feederWiringBusway_correct}
                  currentNote={formData.feederWiringBusway_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="feederWiringConduitWall" checked={formData.feederWiringConduitWall} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                  {formData.feederWiringConduitWall && (
                    <>
                      <input type="number" step="0.01" name="feederWiringConduitWallSize" value={formData.feederWiringConduitWallSize} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">นิ้ว</span>
                    </>
                  )}
                </label>
                <CorrectiveRadio
                  groupName="feederWiringConduitWall_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.feederWiringConduitWall_correct}
                  currentNote={formData.feederWiringConduitWall_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="feederWiringDirectBurial" checked={formData.feederWiringDirectBurial} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                </label>
                <CorrectiveRadio
                  groupName="feederWiringDirectBurial_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.feederWiringDirectBurial_correct}
                  currentNote={formData.feederWiringDirectBurial_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="feederWiringConduitBurial" checked={formData.feederWiringConduitBurial} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ ท่อร้อยสายขนาด</span>
                  {formData.feederWiringConduitBurial && (
                    <>
                      <input type="number" step="0.01" name="feederWiringConduitBurialSize" value={formData.feederWiringConduitBurialSize} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">นิ้ว</span>
                    </>
                  )}
                </label>
                <CorrectiveRadio
                  groupName="feederWiringConduitBurial_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.feederWiringConduitBurial_correct}
                  currentNote={formData.feederWiringConduitBurial_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="feederWiringOther" checked={formData.feederWiringOther} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">อื่นๆ ระบุ</span>
                  {formData.feederWiringOther && (
                    <input type="text" name="feederWiringOtherText" value={formData.feederWiringOtherText} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                  )}
                </label>
                <CorrectiveRadio
                  groupName="feederWiringOther_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.feederWiringOther_correct}
                  currentNote={formData.feederWiringOther_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
            </div>

            {/* 3.5.3 ประเภทท่อร้อยสาย */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3.5.3 ประเภทท่อร้อยสาย:
              </label>
              <div className="mt-2 space-y-3">
                <p className="text-gray-800 font-bold">ท่อโลหะ</p>
                <div className="flex flex-wrap gap-4 ml-4">
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="feederConduitTypeRMC" checked={formData.feederConduitTypeRMC} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">หนา (RMC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="feederConduitTypeIMC" checked={formData.feederConduitTypeIMC} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">หนาปานกลาง (IMC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="feederConduitTypeEMT" checked={formData.feederConduitTypeEMT} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">บาง (EMT)</span>
                  </label>
                </div>
                <p className="text-gray-800 font-bold mt-2">ท่ออโลหะ</p>
                <div className="flex flex-wrap gap-4 ml-4">
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="feederConduitTypeRNC" checked={formData.feederConduitTypeRNC} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">แข็ง (RNC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="feederConduitTypeENT" checked={formData.feederConduitTypeENT} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">อ่อน (ENT)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="feederConduitTypeFlexibleMetal" checked={formData.feederConduitTypeFlexibleMetal} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
                  </label>
                </div>
                <label className="inline-flex items-center text-gray-800 mt-2">
                  <input type="checkbox" name="feederConduitTypeOther" checked={formData.feederConduitTypeOther} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">อื่นๆ ระบุ</span>
                  {formData.feederConduitTypeOther && (
                    <input type="text" name="feederConduitTypeOtherText" value={formData.feederConduitTypeOtherText} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                  )}
                </label>
              </div>
              <CorrectiveRadio
                groupName="feederConduitType_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.feederConduitType_correct}
                currentNote={formData.feederConduitType_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            {/* 3.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน</h4>
            <CorrectiveRadio
              groupName="feederBreakerStandard_correct"
              label="ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2"
              currentValue={formData.feederBreakerStandard_correct}
              currentNote={formData.feederBreakerStandard_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <div className="mb-4">
              <label htmlFor="feederBreakerAmpRating" className="block text-sm font-medium text-gray-700 mb-1">
                ข) เซอร์กิตเบรกเกอร์ขนาด AT (A):
              </label>
              <input
                type="number"
                id="feederBreakerAmpRating"
                name="feederBreakerAmpRating"
                value={formData.feederBreakerAmpRating}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                ไม่เกินพิกัดกระแสสายป้อน และไม่ต่ำกว่าโหลดสูงสุดของสายป้อน
              </p>
              <CorrectiveRadio
                groupName="feederBreakerAmpRating_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.feederBreakerAmpRating_correct}
                currentNote={formData.feederBreakerAmpRating_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            {/* 3.5.5 การติดตั้งแผงวงจรย่อย (Panel board) */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.5.5 การติดตั้งแผงวงจรย่อย (Panel board)</h4>
            <CorrectiveRadio
              groupName="panelBoardRating_correct"
              label="ก) ต้องมีพิกัดไม่ต่ำกว่าขนาดสายป้อน"
              currentValue={formData.panelBoardRating_correct}
              currentNote={formData.panelBoardRating_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="panelBoardNoBridging_correct"
              label="ข) ไม่มีการต่อฝาก เชื่อมระหว่างขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) ที่แผงวงจรย่อย"
              currentValue={formData.panelBoardNoBridging_correct}
              currentNote={formData.panelBoardNoBridging_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>
        </div>

        {/* 3.6 วงจรย่อย (Branch Circuit) */}
        <div className="mb-6 pl-4 border-l-4 border-[#a78bfa]">
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            3.6 วงจรย่อย
          </h3>
          <div className="mb-4">
            <label htmlFor="branchCircuitNumber" className="block text-sm font-medium text-gray-700 mb-1">
              วงจรที่:
            </label>
            <input
              type="text"
              id="branchCircuitNumber"
              name="branchCircuitNumber"
              value={formData.branchCircuitNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-4">
            {/* 3.6.1 วงจรย่อยของเครื่องอัดประจุยานยนต์ไฟฟ้า */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.6.1 วงจรย่อยของเครื่องอัดประจุยานยนต์ไฟฟ้า</h4>
            <CorrectiveRadio
              groupName="evDedicatedCircuit_correct"
              label="ก) วงจรย่อยจ่ายไฟให้เครื่องอัดประจุยานยนต์ไฟฟ้าเท่านั้น (ไม่รวมกับโหลดอื่น)"
              currentValue={formData.evDedicatedCircuit_correct}
              currentNote={formData.evDedicatedCircuit_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="evOneChargerPerCircuit_correct"
              label="ข) วงจรย่อยจ่ายไฟให้เครื่องอัดประจุยานยนต์ไฟฟ้า 1 เครื่อง ต่อ 1 วงจรย่อย"
              currentValue={formData.evOneChargerPerCircuit_correct}
              currentNote={formData.evOneChargerPerCircuit_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 3.6.2 วงจรย่อย */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.6.2 วงจรย่อย</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ก) สายตัวนำวงจรย่อยเป็นไปตามมาตรฐาน:
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="branchCableStandard" value="มอก. 11-2553" checked={formData.branchCableStandard === 'มอก. 11-2553'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">มอก. 11-2553</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="branchCableStandard" value="มอก. 293-2541" checked={formData.branchCableStandard === 'มอก. 293-2541'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">มอก. 293-2541</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="branchCableStandard" value="IEC 60502" checked={formData.branchCableStandard === 'IEC 60502'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">IEC 60502</span>
                </label>
              </div>
              <CorrectiveRadio
                groupName="branchCableStandard_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.branchCableStandard_correct}
                currentNote={formData.branchCableStandard_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ข) ชนิดสายตัวนำ:
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="branchCableType" value="IEC01" checked={formData.branchCableType === 'IEC01'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">IEC01</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="branchCableType" value="NYY" checked={formData.branchCableType === 'NYY'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">NYY</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="branchCableType" value="CV" checked={formData.branchCableType === 'CV'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">CV</span>
                </label>
                <label className="inline-flex items-center text-gray-800">
                  <input type="radio" name="branchCableType" value="อื่นๆ" checked={formData.branchCableType === 'อื่นๆ'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                  <span className="ml-3">อื่นๆ</span>
                </label>
                {formData.branchCableType === 'อื่นๆ' && (
                  <input type="text" name="branchCableOtherType" value={formData.branchCableOtherType} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                )}
              </div>
              <CorrectiveRadio
                groupName="branchCableType_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.branchCableType_correct}
                currentNote={formData.branchCableType_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="branchCablePhaseSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
                ค) ขนาดสายเฟส (ตร.มม.):
              </label>
              <input
                type="number"
                id="branchCablePhaseSizeSqmm"
                name="branchCablePhaseSizeSqmm"
                value={formData.branchCablePhaseSizeSqmm}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                (พิกัดกระแสสายตัวนำวงจรย่อยต้องไม่น้อยกว่า 1.25 เท่าของพิกัดกระแสด้านไฟเข้าของเครื่องอัดประจุยานยนต์ไฟฟ้า และไม่ต่ำกว่าพิกัดกระแสของเครื่องป้องกันกระแสเกิน รวมทั้งขนาดสายตัวนำวงจรย่อยต้องไม่เล็กกว่า 2.5 ตร.มม.)
              </p>
              <CorrectiveRadio
                groupName="branchCablePhaseSize_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.branchCablePhaseSize_correct}
                currentNote={formData.branchCablePhaseSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="branchCableNeutralSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
                ง) ขนาดสายนิวทรัล (ตร.มม.):
              </label>
              <input
                type="number"
                id="branchCableNeutralSizeSqmm"
                name="branchCableNeutralSizeSqmm"
                value={formData.branchCableNeutralSizeSqmm}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <CorrectiveRadio
                groupName="branchCableNeutralSize_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.branchCableNeutralSize_correct}
                currentNote={formData.branchCableNeutralSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="branchCableGroundSizeSqmm" className="block text-sm font-medium text-gray-700 mb-1">
                จ) ขนาดสายดิน (ตร.มม.):
              </label>
              <input
                type="number"
                id="branchCableGroundSizeSqmm"
                name="branchCableGroundSizeSqmm"
                value={formData.branchCableGroundSizeSqmm}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                สอดคล้องกับขนาดสายเฟสของวงจรย่อย ตามตารางที่ 1 ในหน้าที่ 5
              </p>
              <CorrectiveRadio
                groupName="branchCableGroundSize_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.branchCableGroundSize_correct}
                currentNote={formData.branchCableGroundSize_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            <CorrectiveRadio
              groupName="branchCablePhaseMarking_correct"
              label="ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ"
              currentValue={formData.branchCablePhaseMarking_correct}
              currentNote={formData.branchCablePhaseMarking_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            <CorrectiveRadio
              groupName="branchConduitContinuity_correct"
              label="ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ"
              currentValue={formData.branchConduitContinuity_correct}
              currentNote={formData.branchConduitContinuity_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 3.6.3 วิธีการเดินสาย */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3.6.3 วิธีการเดินสาย:
              </label>
              <div className="mt-2 space-y-3">
                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="branchWiringConduitWall" checked={formData.branchWiringConduitWall} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                  {formData.branchWiringConduitWall && (
                    <>
                      <input type="number" step="0.01" name="branchWiringConduitWallSize" value={formData.branchWiringConduitWallSize} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">นิ้ว</span>
                    </>
                  )}
                </label>
                <CorrectiveRadio
                  groupName="branchWiringConduitWall_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.branchWiringConduitWall_correct}
                  currentNote={formData.branchWiringConduitWall_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="branchWiringConduitBurial" checked={formData.branchWiringConduitBurial} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ ท่อร้อยสายขนาด</span>
                  {formData.branchWiringConduitBurial && (
                    <>
                      <input type="number" step="0.01" name="branchWiringConduitBurialSize" value={formData.branchWiringConduitBurialSize} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">นิ้ว</span>
                    </>
                  )}
                </label>
                <CorrectiveRadio
                  groupName="branchWiringConduitBurial_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.branchWiringConduitBurial_correct}
                  currentNote={formData.branchWiringConduitBurial_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="branchWiringDirectBurial" checked={formData.branchWiringDirectBurial} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                </label>
                <CorrectiveRadio
                  groupName="branchWiringDirectBurial_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.branchWiringDirectBurial_correct}
                  currentNote={formData.branchWiringDirectBurial_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="branchWiringWireway" checked={formData.branchWiringWireway} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินในรางเดินสาย (Wireway) ขนาด</span>
                  {formData.branchWiringWireway && (
                    <>
                      <input type="number" name="branchWiringWirewaySizeX" value={formData.branchWiringWirewaySizeX} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">มม. x</span>
                      <input type="number" name="branchWiringWirewaySizeY" value={formData.branchWiringWirewaySizeY} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-1 w-20" />
                      <span className="ml-1">มม.</span>
                    </>
                  )}
                </label>
                <CorrectiveRadio
                  groupName="branchWiringWireway_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.branchWiringWireway_correct}
                  currentNote={formData.branchWiringWireway_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="branchWiringCableTray" checked={formData.branchWiringCableTray} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                  {formData.branchWiringCableTray && (
                    <>
                      <input type="number" name="branchWiringCableTraySizeX" value={formData.branchWiringCableTraySizeX} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                      <span className="ml-1">มม. x</span>
                      <input type="number" name="branchWiringCableTraySizeY" value={formData.branchWiringCableTraySizeY} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-1 w-20" />
                      <span className="ml-1">มม.</span>
                    </>
                  )}
                </label>
                <CorrectiveRadio
                  groupName="branchWiringCableTray_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.branchWiringCableTray_correct}
                  currentNote={formData.branchWiringCableTray_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />

                <label className="inline-flex items-center text-gray-800">
                  <input type="checkbox" name="branchWiringOther" checked={formData.branchWiringOther} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">อื่นๆ ระบุ</span>
                  {formData.branchWiringOther && (
                    <input type="text" name="branchWiringOtherText" value={formData.branchWiringOtherText} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                  )}
                </label>
                <CorrectiveRadio
                  groupName="branchWiringOther_correct"
                  label="ถูกต้องหรือไม่"
                  currentValue={formData.branchWiringOther_correct}
                  currentNote={formData.branchWiringOther_note}
                  onStatusChange={handleRadioChange}
                  onNoteChange={handleChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * วงจรย่อยของเครื่องอัดประจุยานยนต์ไฟฟ้าที่ติดตั้งภายนอกอาคารกำหนดให้ใช้วิธีร้อยท่อฝังดิน หรือร้อยท่อเกาะผนังเท่านั้น
              </p>
            </div>

            {/* 3.6.4 ประเภทท่อร้อยสาย */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3.6.4 ประเภทท่อร้อยสาย:
              </label>
              <div className="mt-2 space-y-3">
                <p className="text-gray-800 font-bold">ท่อโลหะ</p>
                <div className="flex flex-wrap gap-4 ml-4">
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="branchConduitTypeRMC" checked={formData.branchConduitTypeRMC} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">หนา (RMC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="branchConduitTypeIMC" checked={formData.branchConduitTypeIMC} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">หนาปานกลาง (IMC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="branchConduitTypeEMT" checked={formData.branchConduitTypeEMT} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">บาง (EMT)</span>
                  </label>
                </div>
                <p className="text-gray-800 font-bold mt-2">ท่ออโลหะ</p>
                <div className="flex flex-wrap gap-4 ml-4">
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="branchConduitTypeRNC" checked={formData.branchConduitTypeRNC} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">แข็ง (RNC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="branchConduitTypeENT" checked={formData.branchConduitTypeENT} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">อ่อน (ENT)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="checkbox" name="branchConduitTypeFlexibleMetal" checked={formData.branchConduitTypeFlexibleMetal} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                    <span className="ml-3">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
                  </label>
                </div>
                <label className="inline-flex items-center text-gray-800 mt-2">
                  <input type="checkbox" name="branchConduitTypeOther" checked={formData.branchConduitTypeOther} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-3">อื่นๆ ระบุ</span>
                  {formData.branchConduitTypeOther && (
                    <input type="text" name="branchConduitTypeOtherText" value={formData.branchConduitTypeOtherText} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                  )}
                </label>
              </div>
              <CorrectiveRadio
                groupName="branchConduitType_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.branchConduitType_correct}
                currentNote={formData.branchConduitType_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            {/* 3.6.5 เซอร์กิตเบรกเกอร์ป้องกันวงจรย่อย */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.6.5 เซอร์กิตเบรกเกอร์ป้องกันวงจรย่อย</h4>
            <CorrectiveRadio
              groupName="branchBreakerStandard_correct"
              label="เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2"
              currentValue={formData.branchBreakerStandard_correct}
              currentNote={formData.branchBreakerStandard_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <div className="mb-4">
              <label htmlFor="branchBreakerMode3_4AmpRating" className="block text-sm font-medium text-gray-700 mb-1">
                กรณีอัดประจุโหมด 3 หรือ 4 เซอร์กิตเบรกเกอร์ขนาด AT (A):
              </label>
              <input
                type="number"
                id="branchBreakerMode3_4AmpRating"
                name="branchBreakerMode3_4AmpRating"
                value={formData.branchBreakerMode3_4AmpRating}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                ไม่เกินพิกัดกระแสสายตัวนำวงจรย่อย และไม่ต่ำกว่าโหลดสูงสุดของวงจรย่อย
              </p>
              <CorrectiveRadio
                groupName="branchBreakerMode3_4AmpRating_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.branchBreakerMode3_4AmpRating_correct}
                currentNote={formData.branchBreakerMode3_4AmpRating_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="branchBreakerMode2AmpRating" className="block text-sm font-medium text-gray-700 mb-1">
                กรณีอัดประจุโหมด 2 เซอร์กิตเบรกเกอร์ขนาด AT (A):
              </label>
              <input
                type="number"
                id="branchBreakerMode2AmpRating"
                name="branchBreakerMode2AmpRating"
                value={formData.branchBreakerMode2AmpRating}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                ไม่เกินพิกัดกระแสของเต้ารับ
              </p>
              <CorrectiveRadio
                groupName="branchBreakerMode2AmpRating_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.branchBreakerMode2AmpRating_correct}
                currentNote={formData.branchBreakerMode2AmpRating_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
            </div>

            {/* 3.6.6 ต้องติดตั้งระบบป้องกันอันตรายต่อบุคคล */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.6.6 ต้องติดตั้งระบบป้องกันอันตรายต่อบุคคล (เลือกติดตั้งอย่างใดอย่างหนึ่ง)</h4>
            <div className="space-y-3">
              <label className="inline-flex items-center text-gray-800 block mb-2">
                <input type="checkbox" name="personnelProtectionRCDTypeB" checked={formData.personnelProtectionRCDTypeB} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">เครื่องตัดไฟรั่ว (RCD) Type B ตามมาตรฐาน มอก. 2955 หรือ IEC 62423 พิกัดกระแสรั่ว IΔN ≤ 30 มิลลิแอมแปร์ (mA) พิกัดกระแส (In)</span>
                {formData.personnelProtectionRCDTypeB && (
                  <>
                    <input type="number" name="personnelProtectionRCDTypeBAmp" value={formData.personnelProtectionRCDTypeBAmp} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">แอมแปร์ (A) เป็น RCD ชนิดตัดกระแสไฟฟ้าทุกเส้นรวมถึงนิวทรัลออกพร้อมกัน และมีขนาดพิกัดกระแสไม่น้อยกว่าพิกัดกระแสของเครื่องป้องกันกระแสเกิน</span>
                  </>
                )}
              </label>
              <CorrectiveRadio
                groupName="personnelProtectionRCDTypeB_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.personnelProtectionRCDTypeB_correct}
                currentNote={formData.personnelProtectionRCDTypeB_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />

              <label className="inline-flex items-center text-gray-800 block mb-2">
                <input type="checkbox" name="personnelProtectionRCDTypeAF_RDC_DD" checked={formData.personnelProtectionRCDTypeAF_RDC_DD} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">เครื่องตัดไฟรั่ว (RCD) Type A หรือ F ร่วมกับอุปกรณ์ตัดไฟฟ้ารั่วกระแสตรง (RDC-DD) ขนาดพิกัด IΔN,DC ≥ 6 mA</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-9">* อุปกรณ์ RDC-DD อ้างอิงตาม IEC 62955</p>
              <CorrectiveRadio
                groupName="personnelProtectionRCDTypeAF_RDC_DD_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.personnelProtectionRCDTypeAF_RDC_DD_correct}
                currentNote={formData.personnelProtectionRCDTypeAF_RDC_DD_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />

              <label className="inline-flex items-center text-gray-800 block mb-2">
                <input type="checkbox" name="personnelProtectionRCDTypeBBuiltIn" checked={formData.personnelProtectionRCDTypeBBuiltIn} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">มีเครื่องตัดไฟรั่ว (RCD) Type B ตามมาตรฐาน มอก. 2955 หรือ IEC 62423 พิกัดกระแสรั่ว IΔN ≤ 30 มิลลิแอมแปร์ (mA) พิกัดกระแส (In)</span>
                {formData.personnelProtectionRCDTypeBBuiltIn && (
                  <>
                    <input type="number" name="personnelProtectionRCDTypeBBuiltInAmp" value={formData.personnelProtectionRCDTypeBBuiltInAmp} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">แอมแปร์ (A) เป็น RCD ชนิดตัดกระแสไฟฟ้าทุกเส้นรวมถึงนิวทรัลออกพร้อมกัน และมีขนาพิกัดกระแสไม่น้อยกว่าพิกัดกระแสของเครื่องป้องกันกระแสเกิน ติดตั้งมาภายในเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
                  </>
                )}
              </label>
              <CorrectiveRadio
                groupName="personnelProtectionRCDTypeBBuiltIn_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.personnelProtectionRCDTypeBBuiltIn_correct}
                currentNote={formData.personnelProtectionRCDTypeBBuiltIn_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />

              <label className="inline-flex items-center text-gray-800 block">
                <input type="checkbox" name="personnelProtectionIsolatingTransformer" checked={formData.personnelProtectionIsolatingTransformer} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">มีหม้อแปลงแยกขดลวด (Isolating Transformer) ติดตั้งมากับเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
              </label>
              <CorrectiveRadio
                groupName="personnelProtectionIsolatingTransformer_correct"
                label="ถูกต้องหรือไม่"
                currentValue={formData.personnelProtectionIsolatingTransformer_correct}
                currentNote={formData.personnelProtectionIsolatingTransformer_note}
                onStatusChange={handleRadioChange}
                onNoteChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-2 ml-9">
                * กรณีการอัดประจุโหมด 2 ให้ติดตั้งเครื่องตัดไฟรั่วบริเวณแผงวงจร หรือก่อนเข้าเต้ารับ หากไม่มั่นใจว่ามี RCD Type B หรือเทียบเท่าติดตั้งมากับ IC-CPD (In-Cable Control and Protection Device)
              </p>
            </div>

            {/* 3.6.7 กรณีติดตั้งเครื่องตัดไฟรั่ว (RCD) Type B */}
            <CorrectiveRadio
              groupName="rcdTypeBInstallation_correct"
              label="3.6.7 กรณีติดตั้งเครื่องตัดไฟรั่ว (RCD) Type B สำหรับเครื่องอัดประจุยานยนต์ไฟฟ้า โดย RCD Type B ต้องไม่ติดตั้งภายใต้วงจรที่มี RCD Type อื่นๆ อยู่ที่เมนของวงจรนั้นๆ"
              currentValue={formData.rcdTypeBInstallation_correct}
              currentNote={formData.rcdTypeBInstallation_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 3.6.8 การตรวจสอบกรณีติดตั้งมิเตอร์เครื่องที่สอง */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.6.8 การตรวจสอบกรณีติดตั้งมิเตอร์เครื่องที่สองเพื่ออัดประจุยานยนต์ไฟฟ้า โดยไม่มีวัตถุประสงค์เพื่อการอัดประจุในเชิงพาณิชย์</h4>
            <CorrectiveRadio
              groupName="secondMeterSeparation_correct"
              label="ก) มีการแยกระบบไฟฟ้าของมิเตอร์เครื่องที่สองออกจากมิเตอร์เครื่องแรก"
              currentValue={formData.secondMeterSeparation_correct}
              currentNote={formData.secondMeterSeparation_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="secondMeterDedicatedCircuit_correct"
              label="ข) วงจรย่อยของมิเตอร์เครื่องที่สองจ่ายไฟให้กับเครื่องอัดประจุยานยนต์ไฟฟ้าเท่านั้น โดยไม่จ่ายไฟให้กับเต้ารับ แสงสว่าง หรือโหลดอื่นใด"
              currentValue={formData.secondMeterDedicatedCircuit_correct}
              currentNote={formData.secondMeterDedicatedCircuit_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
          </div>
        </div>

        {/* 3.7 การตรวจสอบเครื่องอัดประจุยานยนต์ไฟฟ้า */}
        <div className="mb-6 pl-4 border-l-4 border-[#a78bfa]">
          <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
            3.7 การตรวจสอบเครื่องอัดประจุยานยนต์ไฟฟ้า
          </h3>
          <div className="mb-4">
            <label htmlFor="evChargerInspectionNumber" className="block text-sm font-medium text-gray-700 mb-1">
              เครื่องที่:
            </label>
            <input
              type="text"
              id="evChargerInspectionNumber"
              name="evChargerInspectionNumber"
              value={formData.evChargerInspectionNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-4">
            {/* 3.7.1 ข้อมูลเครื่องอัดประจุยานยนต์ไฟฟ้า */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.7.1 ข้อมูลเครื่องอัดประจุยานยนต์ไฟฟ้า</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="evChargerProduct" className="block text-sm font-medium text-gray-700 mb-1">
                  ผลิตภัณฑ์:
                </label>
                <input type="text" id="evChargerProduct" name="evChargerProduct" value={formData.evChargerProduct} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="evChargerModel" className="block text-sm font-medium text-gray-700 mb-1">
                  รุ่น:
                </label>
                <input type="text" id="evChargerModel" name="evChargerModel" value={formData.evChargerModel} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="evChargerSerialNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number:
                </label>
                <input type="text" id="evChargerSerialNumber" name="evChargerSerialNumber" value={formData.evChargerSerialNumber} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="evChargerIPRating" className="block text-sm font-medium text-gray-700 mb-1">
                  IP:
                </label>
                <input type="text" id="evChargerIPRating" name="evChargerIPRating" value={formData.evChargerIPRating} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ระบบ:
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="inline-flex items-center text-gray-800">
                    <input type="radio" name="evChargerPhase" value="1_phase" checked={formData.evChargerPhase === '1_phase'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                    <span className="ml-3">1 เฟส</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="radio" name="evChargerPhase" value="3_phase" checked={formData.evChargerPhase === '3_phase'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                    <span className="ml-3">3 เฟส</span>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="evChargerHeadCount" className="block text-sm font-medium text-gray-700 mb-1">
                  จำนวนหัวชาร์จ (หัว):
                </label>
                <input type="number" id="evChargerHeadCount" name="evChargerHeadCount" value={formData.evChargerHeadCount} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="evChargerTotalPowerKw" className="block text-sm font-medium text-gray-700 mb-1">
                  พิกัดกำลังไฟฟ้ารวม (kW):
                </label>
                <input type="number" step="0.01" id="evChargerTotalPowerKw" name="evChargerTotalPowerKw" value={formData.evChargerTotalPowerKw} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="evChargerTotalCurrentAmp" className="block text-sm font-medium text-gray-700 mb-1">
                  พิกัดกระแสรวม (Input) (A):
                </label>
                <input type="number" id="evChargerTotalCurrentAmp" name="evChargerTotalCurrentAmp" value={formData.evChargerTotalCurrentAmp} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  การอัดประจุไฟฟ้า:
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="inline-flex items-center text-gray-800">
                    <input type="radio" name="evChargerChargingMode" value="โหมด 2 (AC)" checked={formData.evChargerChargingMode === 'โหมด 2 (AC)'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                    <span className="ml-3">โหมด 2 (AC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="radio" name="evChargerChargingMode" value="โหมด 3 (AC)" checked={formData.evChargerChargingMode === 'โหมด 3 (AC)'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                    <span className="ml-3">โหมด 3 (AC)</span>
                  </label>
                  <label className="inline-flex items-center text-gray-800">
                    <input type="radio" name="evChargerChargingMode" value="โหมด 4 (DC)" checked={formData.evChargerChargingMode === 'โหมด 4 (DC)'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                    <span className="ml-3">โหมด 4 (DC)</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">* AC คือ ไฟฟ้ากระแสสลับ DC คือ ไฟฟ้ากระแสตรง</p>
              </div>
            </div>
            <CorrectiveRadio
              groupName="evChargerInfo_correct"
              label="ถูกต้องหรือไม่"
              currentValue={formData.evChargerInfo_correct}
              currentNote={formData.evChargerInfo_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 3.7.2 ลักษณะหัวชาร์จ / การชาร์จ */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.7.2 ลักษณะหัวชาร์จ / การชาร์จ</h4>
            <div className="space-y-3 mb-4">
              <label className="inline-flex items-center text-gray-800 block">
                <input type="checkbox" name="chargerHeadACType2" checked={formData.chargerHeadACType2} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">AC Type 2 พิกัดกระแส</span>
                {formData.chargerHeadACType2 && (
                  <>
                    <input type="number" step="0.01" name="chargerHeadACType2Current" value={formData.chargerHeadACType2Current} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">AAC พิกัดแรงดัน</span>
                    <input type="number" step="0.01" name="chargerHeadACType2Voltage" value={formData.chargerHeadACType2Voltage} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">VAC พิกัดกำลัง</span>
                    <input type="number" step="0.01" name="chargerHeadACType2Power" value={formData.chargerHeadACType2Power} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">kW</span>
                  </>
                )}
              </label>
              <label className="inline-flex items-center text-gray-800 block">
                <input type="checkbox" name="chargerHeadDCCHAdeMO" checked={formData.chargerHeadDCCHAdeMO} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">DC CHAdeMO พิกัดกระแส</span>
                {formData.chargerHeadDCCHAdeMO && (
                  <>
                    <input type="number" step="0.01" name="chargerHeadDCCHAdeMOCurrent" value={formData.chargerHeadDCCHAdeMOCurrent} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">ADC พิกัดแรงดัน</span>
                    <input type="number" step="0.01" name="chargerHeadDCCHAdeMOVoltage" value={formData.chargerHeadDCCHAdeMOVoltage} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">VDC พิกัดกำลัง</span>
                    <input type="number" step="0.01" name="chargerHeadDCCHAdeMOPower" value={formData.chargerHeadDCCHAdeMOPower} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">kW</span>
                  </>
                )}
              </label>
              <label className="inline-flex items-center text-gray-800 block">
                <input type="checkbox" name="chargerHeadDCCCS" checked={formData.chargerHeadDCCCS} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">DC CCS พิกัดกระแส</span>
                {formData.chargerHeadDCCCS && (
                  <>
                    <input type="number" step="0.01" name="chargerHeadDCCCSCurrent" value={formData.chargerHeadDCCCSCurrent} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">ADC พิกัดแรงดัน</span>
                    <input type="number" step="0.01" name="chargerHeadDCCCSVoltage" value={formData.chargerHeadDCCCSVoltage} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">VDC พิกัดกำลัง</span>
                    <input type="number" step="0.01" name="chargerHeadDCCCSPower" value={formData.chargerHeadDCCCSPower} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">kW</span>
                  </>
                )}
              </label>
              <label className="inline-flex items-center text-gray-800 block">
                <input type="checkbox" name="chargerHeadOther" checked={formData.chargerHeadOther} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">อื่นๆ ระบุ</span>
                {formData.chargerHeadOther && (
                  <>
                    <input type="text" name="chargerHeadOtherText" value={formData.chargerHeadOtherText} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุ" />
                    <span className="ml-1">พิกัดกระแส</span>
                    <input type="number" step="0.01" name="chargerHeadOtherCurrent" value={formData.chargerHeadOtherCurrent} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">A พิกัดแรงดัน</span>
                    <input type="number" step="0.01" name="chargerHeadOtherVoltage" value={formData.chargerHeadOtherVoltage} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">V พิกัดกำลัง</span>
                    <input type="number" step="0.01" name="chargerHeadOtherPower" value={formData.chargerHeadOtherPower} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">kW</span>
                  </>
                )}
              </label>
              <label className="inline-flex items-center text-gray-800 block">
                <input type="checkbox" name="chargerHeadSimultaneousCount" checked={formData.chargerHeadSimultaneousCount} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">หัวชาร์จสามารถชาร์จได้พร้อมกัน</span>
                {formData.chargerHeadSimultaneousCount && (
                  <>
                    <input type="number" name="chargerHeadSimultaneousCount" value={formData.chargerHeadSimultaneousCount} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-20" />
                    <span className="ml-1">หัว คือ</span>
                    <input type="text" name="chargerHeadSimultaneousDetails" value={formData.chargerHeadSimultaneousDetails} onChange={handleChange} className="shadow-sm appearance-none border border-gray-300 rounded-md py-1 px-2 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ml-2 w-32" placeholder="ระบุรายละเอียด" />
                  </>
                )}
              </label>
            </div>
            <CorrectiveRadio
              groupName="chargerHead_correct"
              label="ถูกต้องหรือไม่"
              currentValue={formData.chargerHead_correct}
              currentNote={formData.chargerHead_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 3.7.3 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 2 */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.7.3 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 2</h4>
            <CorrectiveRadio
              groupName="mode2ReceptacleStandard_correct"
              label="ก) เต้ารับและเต้าเสียบต้องเป็นชนิดมีขั้วสายดินตามมาตรฐาน"
              currentValue={formData.mode2ReceptacleStandard_correct}
              currentNote={formData.mode2ReceptacleStandard_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="mode2ReceptacleNonRemovable_correct"
              label="ข) เต้ารับต้องไม่ใช่ชนิดหยิบยกได้"
              currentValue={formData.mode2ReceptacleNonRemovable_correct}
              currentNote={formData.mode2ReceptacleNonRemovable_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="mode2WarningSign_correct"
              label="ค) ต้องมีป้ายข้อความเตือน “จุดเชื่อมต่อยานยนต์ไฟฟ้า” บริเวณเต้ารับ"
              currentValue={formData.mode2WarningSign_correct}
              currentNote={formData.mode2WarningSign_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-2 ml-9">
              * ข้อแนะนำ : ตำแหน่งติดตั้งเต้ารับควรอยู่สูงจากพื้นผิวการจอดของยานยนต์ ไม่น้อยกว่า 0.75 เมตร แต่ไม่เกิน 1.20 เมตร
            </p>

            {/* 3.7.4 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 3 และโหมด 4 */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.7.4 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 3 และโหมด 4</h4>
            <CorrectiveRadio
              groupName="mode3_4WarningSign_correct"
              label="ก) สำหรับอาคารชุด อาคารสำนักงาน อาคารลักษณะที่คล้ายกัน และสถานีอัดประจุยานยนต์ไฟฟ้า ต้องมีป้ายเตือน “ระวังอันตรายจากไฟฟ้าช็อก” ที่เครื่องอัดประจุยานยนต์ไฟฟ้า ยกเว้นกรณีบ้านอยู่อาศัยไม่ต้องมีป้ายเตือน"
              currentValue={formData.mode3_4WarningSign_correct}
              currentNote={formData.mode3_4WarningSign_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="mode3_4EmergencySwitch_correct"
              label="ข) กรณีเครื่องอัดประจุยานยนต์ไฟฟ้ามีพิกัดกระแสด้านไฟเข้ามากกว่า 60 A ต้องติดตั้งสวิตช์ควบคุมฉุกเฉิน (Emergency Switch) ที่ตำแหน่งด้านหน้าของเครื่องอัดประจุยานยนต์ไฟฟ้า ภายในระยะ 15 เมตร สามารถมองเห็นสวิตช์ควบคุมฉุกเฉินได้ เข้าถึงได้อย่างสะดวก และเป็นชนิดที่ตัดกระแสไฟฟ้าในสายไฟฟ้าทุกเส้นรวมถึงสายนิวทรัลออกพร้อมกัน (ยกเว้น เครื่องอัดประจุยานยนต์ไฟฟ้ามีสวิตช์ควบคุมฉุกเฉินอยู่แล้ว)"
              currentValue={formData.mode3_4EmergencySwitch_correct}
              currentNote={formData.mode3_4EmergencySwitch_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="mode3_4Ventilation_correct"
              label="ค) กรณีเครื่องอัดประจุยานยนต์ไฟฟ้าต้องการการระบายอากาศ ต้องจัดให้มีการระบายอากาศอย่างเหมาะสม และติดตั้งป้ายเตือน “ต้องการการระบายอากาศ” ที่เครื่องอัดประจุยานยนต์ไฟฟ้า"
              currentValue={formData.mode3_4Ventilation_correct}
              currentNote={formData.mode3_4Ventilation_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="mode3_4CableLength_correct"
              label="ง) ความยาวสายชาร์จไม่ควรเกิน 7.50 เมตร (ข้อแนะนำ)"
              currentValue={formData.mode3_4CableLength_correct}
              currentNote={formData.mode3_4CableLength_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-2 ml-9">
              * ข้อแนะนำ : กรณีอัดประจุโหมด 3 แบบมีเต้ารับ ตำแหน่งติดตั้งควรอยู่สูงจากพื้นผิวการจอดของยานยนต์ ไม่น้อยกว่า 0.75 เมตร แต่ไม่เกิน 1.20 เมตร
            </p>

            {/* 3.7.5 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้าอยู่ในบริเวณสถานีบริการน้ำมัน, LPG และ CNG */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.7.5 กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้าอยู่ในบริเวณสถานีบริการน้ำมัน, LPG และ CNG</h4>
            <CorrectiveRadio
              groupName="fuelStationMode_correct"
              label="ก) เครื่องอัดประจุยานยนต์ไฟฟ้าต้องเป็นการอัดประจุโหมด 3 หรือโหมด 4"
              currentValue={formData.fuelStationMode_correct}
              currentNote={formData.fuelStationMode_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="fuelStationFixedCable_correct"
              label="ข) เครื่องอัดประจุยานยนต์ไฟฟ้าต้องเป็นแบบมีสายชาร์จยึดติดกับเครื่องอัดประจุยานยนต์ไฟฟ้าเท่านั้น"
              currentValue={formData.fuelStationFixedCable_correct}
              currentNote={formData.fuelStationFixedCable_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="fuelStationEmergencySwitchMain_correct"
              label="ค) ต้องติดตั้งสวิตช์ควบคุมฉุกเฉิน (Emergency Switch) สำหรับปลดวงจรเมนสวิตช์ที่จ่ายไฟให้กับตู้จ่ายวัตถุอันตรายและจ่ายไฟให้เครื่องอัดประจุยานยนต์ไฟฟ้า พิกัดไม่ต่ำกว่าพิกัดกระแสของเมนสวิตช์แรงต่ำ และเป็นชนิดที่ตัดกระแสไฟฟ้าในสายไฟฟ้าทุกเส้นรวมถึงสายนิวทรัลออกพร้อมกัน"
              currentValue={formData.fuelStationEmergencySwitchMain_correct}
              currentNote={formData.fuelStationEmergencySwitchMain_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="fuelStationEmergencySwitchDistance_correct"
              label="ง) ต้องติดตั้งสวิตช์ควบคุมฉุกเฉิน อยู่ห่างในแนวระดับจากตู้จ่ายวัตถุอันตราย ไม่น้อยกว่า 6 เมตร แต่ไม่เกิน 30 เมตร และต้องสามารถเข้าถึงได้อย่างสะดวก"
              currentValue={formData.fuelStationEmergencySwitchDistance_correct}
              currentNote={formData.fuelStationEmergencySwitchDistance_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="fuelStationElectricalEquipmentHazard_correct"
              label="จ) อุปกรณ์ไฟฟ้าที่เกี่ยวข้องกับการจ่ายไฟฟ้าให้กับเครื่องอัดประจุยานยนต์ไฟฟ้า เช่น กล่องต่อสาย แผงสวิตช์ ช่องเดินสาย หากจำเป็นต้องมีการติดตั้งหรือเดินผ่านภายในบริเวณอันตรายของสถานีบริการ (รวมถึงบริเวณอันตรายนอกสถานีบริการ) ให้ปฏิบัติตามมาตรฐานที่กำหนดในกฎหมายของกรมธุรกิจพลังงาน"
              currentValue={formData.fuelStationElectricalEquipmentHazard_correct}
              currentNote={formData.fuelStationElectricalEquipmentHazard_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />
            <CorrectiveRadio
              groupName="fuelStationChargerDistance_correct"
              label="ฉ) เครื่องอัดประจุยานยนต์ไฟฟ้า รวมถึงสายยึดติดเครื่องและหัวจ่ายอัดประจุ ในขณะทำการอัดประจุยานยนต์ไฟฟ้าที่อยู่ภายในเขตสถานีบริการ และนอกเขตสถานีบริการแต่ยังอยู่ในบริเวณอันตราย ให้ใช้ข้อกำหนดว่าด้วยระยะห่างของบริเวณอันตราย ตามที่กฎหมายของกรมธุรกิจพลังงานกำหนด"
              currentValue={formData.fuelStationChargerDistance_correct}
              currentNote={formData.fuelStationChargerDistance_note}
              onStatusChange={handleRadioChange}
              onNoteChange={handleChange}
            />

            {/* 3.7.6 ข้อแนะนำในการป้องกันเครื่องอัดประจุยานยนต์ไฟฟ้า */}
            <h4 className="text-lg font-semibold mb-2 text-gray-700">3.7.6 ข้อแนะนำในการป้องกันเครื่องอัดประจุยานยนต์ไฟฟ้า</h4>
            <div className="space-y-3">
              <label className="inline-flex items-center text-gray-800 block">
                <input type="radio" name="chargerProtectionCollision" value="ติดตั้งแล้ว" checked={formData.chargerProtectionCollision === 'ติดตั้งแล้ว'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                <span className="ml-3">มีการป้องกันความเสียหายของเครื่องอัดประจุไฟฟ้าจากการชนของยานยนต์</span>
              </label>
              <label className="inline-flex items-center text-gray-800 block">
                <input type="radio" name="chargerProtectionCollision" value="ยังไม่ติดตั้ง" checked={formData.chargerProtectionCollision === 'ยังไม่ติดตั้ง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                <span className="ml-3">ยังไม่ติดตั้ง</span>
              </label>

              <label className="inline-flex items-center text-gray-800 block">
                <input type="radio" name="chargerProtectionFire" value="ติดตั้งแล้ว" checked={formData.chargerProtectionFire === 'ติดตั้งแล้ว'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                <span className="ml-3">มีการป้องกันและระงับอัคคีภัย โดยการติดตั้งถังดับเพลิง</span>
              </label>
              <label className="inline-flex items-center text-gray-800 block">
                <input type="radio" name="chargerProtectionFire" value="ยังไม่ติดตั้ง" checked={formData.chargerProtectionFire === 'ยังไม่ติดตั้ง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                <span className="ml-3">ยังไม่ติดตั้ง</span>
              </label>

              <label className="inline-flex items-center text-gray-800 block">
                <input type="radio" name="chargerProtectionLightning" value="ติดตั้งแล้ว" checked={formData.chargerProtectionLightning === 'ติดตั้งแล้ว'} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-3">กรณีติดตั้งอยู่ภายนอกอาคาร มีการติดตั้งระบบป้องกันฟ้าผ่า</span>
              </label>
              <label className="inline-flex items-center text-gray-800 block">
                <input type="radio" name="chargerProtectionLightning" value="ยังไม่ติดตั้ง" checked={formData.chargerProtectionLightning === 'ยังไม่ติดตั้ง'} onChange={handleChange} className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4" />
                <span className="ml-3">ยังไม่ติดตั้ง</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 4. สรุปผลการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า ส่วน */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
        <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
          4. สรุปผลการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
        </h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <label className="inline-flex items-center text-gray-800">
            <input
              type="radio"
              name="summaryResult"
              value="ติดตั้งมิเตอร์ถาวร"
              checked={formData.summaryResult === 'ติดตั้งมิเตอร์ถาวร'}
              onChange={handleChange}
              className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
            />
            <span className="ml-3">ติดตั้งมิเตอร์ถาวร</span>
          </label>
          <label className="inline-flex items-center text-gray-800">
            <input
              type="radio"
              name="summaryResult"
              value="ติดตั้งมิเตอร์ชั่วคราว"
              checked={formData.summaryResult === 'ติดตั้งมิเตอร์ชั่วคราว'}
              onChange={handleChange}
              className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
            />
            <span className="ml-3">ติดตั้งมิเตอร์ชั่วคราว</span>
          </label>
          <label className="inline-flex items-center text-gray-800">
            <input
              type="radio"
              name="summaryResult"
              value="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์"
              checked={formData.summaryResult === 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'}
              onChange={handleChange}
              className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-4 w-4"
            />
            <span className="ml-3">ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์</span>
          </label>
        </div>
      </section>

      {/* 5. ขอบเขตและข้อจำกัดในการตรวจสอบ ส่วน */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mt-10">
        <h3 className="text-xl font-semibold mb-3 text-[#3a1a5b]">
          5. ขอบเขตและข้อจำกัดในการตรวจสอบ
        </h3>
        <textarea
          id="scopeOfInspection"
          name="scopeOfInspection"
          value={formData.scopeOfInspection}
          onChange={handleChange}
          rows="4"
          className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa]"
        ></textarea>
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

      {/* ปุ่มส่งข้อมูล */}
      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="px-8 py-4 bg-[#5b2d90] text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#3a1a5b] focus:outline-none focus:ring-4 focus:ring-[#a78bfa] focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          บันทึกข้อมูล
        </button>
      </div>
    </form>
  );
}
