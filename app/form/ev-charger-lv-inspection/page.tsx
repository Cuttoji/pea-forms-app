"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InspectionPDF from '@/components/pdf/EvChargerLvFormPDF';
import { Download, Save } from "lucide-react";
import dynamic from 'next/dynamic';
import { useFormManager } from "@/lib/hooks/useFormManager";
import { FormProvider } from '@/lib/contexts/FormContext';
import { publicDecrypt } from "crypto";
import { on } from "events";

const OpenStreetMapComponent = dynamic(() => import('@/components/forms/OpenStreetMapComponent'), {
  ssr: false
});


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

  //2.1 personal
  personalspace: false,
  personalsinglelinediagram: false,
  personalload: false,
  personalcorrect: false,
  personalcorrect_note: "",
  //2.2 public space
  publicsinglelinediagram: false,
  publicasbuilt: false,
  publicload: false,
  publiccopy: false,
  publicspecification: false,
  publicpaper: false,
  publiccorrect: false,
  publiccorrect_note: "",

  //3. ระบบไฟฟ้าแรงต่ำ
  lowvol_main: "",
  lowvol_main_correct: false,
  lowvol_main_correct_note: "",
  lowvol_type: "",
  lowvol_type_other: "",
  lowvol_type_correct: false,
  lowvol_type_correct_note: "",
  lowvol_size: "",
  lowvol_size_correct: false,
  lowvol_size_correct_note: "",
  lowvol_neutralsize: "",
  lowvol_neutralsize_correct: false,
  lowvol_neutralsize_correct_note: "",
  lowvol_color: "",
  lowvol_color_note: "",
  lowvol_strong: "",
  lowvol_strong_note: "",

  // 3.1.7. วิธีการเดินสาย (Wiring Methods)
  main_wiring_air_insulator: false,
  main_wiring_cable_tray: false,
  main_wiring_cable_tray_size: "",
  main_wiring_direct_buried: false,
  main_wiring_conduit_buried: false,
  main_wiring_conduit_buried_size: "",
  main_wiring_conduit_wall: false,
  main_wiring_conduit_wall_size: "",
  main_wiring_other: false,
  main_wiring_other_detail: "",
  main_wiring_correct: false,
  main_wiring_correct_note: "",

  // 3.1.8 ประเภทท่อร้อยสาย (Conduit Type)
  main_conduit_metal: "",
  main_conduit_nonmetal_rnc: "",
  main_conduit_other: false,
  main_conduit_other_detail: "",
  main_conduit_correct: false,
  main_conduit_correct_note: "",

  // 3.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (Main Switch Overcurrent Protection)
  main_breaker: "",
  main_breaker_note: "",
  main_breaker_amp_rating: "",
  main_breaker_amp_correct: false,
  main_breaker_amp_correct_note: "",
  main_breaker_ic_rating: "",
  main_breaker_ic_correct: false,
  main_breaker_ic_correct_note: "",
  
  // 3.3 ระบบการต่อลงดินที่แผงเมนสวิตช์
  ground_copper_size: "",
  ground_copper_size_correct: false,
  ground_copper_size_correct_note: "",
  ground_connection_type: "", // "single_phase" | "three_phase"
  ground_connection_correct: false,
  ground_connection_correct_note: "",

  // 3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์
  ground_system_type: "", // "tn-c-s" | "tt" | "tt_partial"

  // 3.4.1 TN-C-S Earthing System
  tncs_earthing_resistance: false,
  tncs_earthing_om: "",
  tncs_undervoltage_protection_installed: false,
  tncs_undervoltage_protection_in_charger: false,
  tncs_touch_voltage_protection: false,
  tncs_correct: false,
  tncs_correct_note: "",

  // 3.4.2 TT Earthing System
  tt_correct: false,
  tt_correct_note: "",

  // 3.4.3 TT Partial Earthing System
  tt_partial_risk_assessment: "",
  tt_partial_risk_assessment_note: "",

  // 3.4.3.2 Measures (choose one)
  tt_partial_measure_resistance: false,
  tt_partial_measure_resistance_value: "",
  tt_partial_measure_undervoltage_before_charger: false,
  tt_partial_measure_undervoltage_in_charger: false,
  tt_partial_measure_touch_voltage_protection: false,
  tt_partial_measure_correct: false,
  tt_partial_correct_note: "",

  // 3.5.1 วงจรสายป้อน (Feeder Circuit)
  feeder_standard: "",
  feeder_standard_correct: false,
  feeder_standard_correct_note: "",
  feeder_conductor: "",
  feeder_conductor_type_other: false,
  feeder_conductor_type_other_detail: "",
  feeder_conductor_type_correct: false,
  feeder_conductor_type_correct_note: "",  
  feeder_phase_size: "",
  feeder_phase_size_correct: false,
  feeder_phase_size_correct_note: "",
  feeder_neutral_size: "",
  feeder_neutral_size_correct: false,
  feeder_neutral_size_correct_note: "",
  feeder_ground_size: "",
  feeder_ground_size_correct: false,
  feeder_ground_size_correct_note: "",
  feeder_phase_color_marking: "",
  feeder_phase_color_marking_note: "",
  feeder_mechanical: "",
  feeder_mechanical_note: "",

  // 3.5.2 วิธีการเดินสาย (Wiring Methods)
  feeder_wiring_wireway: false,
  feeder_wiring_wireway_size: "",
  feeder_wiring_wireway_correct: false,
  feeder_wiring_wireway_correct_note: "",
  feeder_wiring_cable_tray: false,
  feeder_wiring_cable_tray_size: "",
  feeder_wiring_cable_tray_correct: false,
  feeder_wiring_cable_tray_correct_note: "",
  feeder_wiring_busway: false,
  feeder_wiring_busway_size: "",
  feeder_wiring_busway_correct: false,
  feeder_wiring_busway_correct_note: "",
  feeder_wiring_conduit_wall: false,
  feeder_wiring_conduit_wall_size: "",
  feeder_wiring_conduit_wall_correct: false,
  feeder_wiring_conduit_wall_correct_note: "",
  feeder_wiring_direct_buried: false,
  feeder_wiring_direct_buried_note: "",
  feeder_wiring_conduit_buried: false,
  feeder_wiring_conduit_buried_size: "",
  feeder_wiring_conduit_buried_correct: false,
  feeder_wiring_conduit_buried_correct_note: "",
  feeder_wiring_other_method: false,
  feeder_wiring_other_method_detail: "",
  feeder_wiring_other_method_correct: false,
  feeder_wiring_other_method_correct_note: "",

  // 3.5.3 ประเภทท่อร้อยสาย (Conduit Type)
  feeder_conduit_metal: "",
  feeder_conduit_nonmetal: "",
  feeder_conduit_flexible_metal: false,
  feeder_conduit_other_type: false,
  feeder_conduit_other_type_detail: "",
  feeder_conduit_type_correct: false,
  feeder_conduit_type_correct_note: "",

  // 3.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน (Feeder Circuit Breaker)
  feeder_cb_standard_correct: false,
  feeder_cb_standard_correct_note: "",
  feeder_cb_amp_rating: "",
  feeder_cb_amp_correct: false,
  feeder_cb_amp_correct_note: "",

  // 3.5.5 การติดตั้งแผงวงจรย่อย (Panel Board Installation)
  panel_board_rating: "",
  panel_board_rating_correct: false,
  panel_board_rating_correct_note: "",
  panel_board_no_ground_neutral_bond: false,
  panel_board_no_ground_neutral_bond_correct: false,
  panel_board_no_ground_neutral_bond_correct_note: "",

  subcircuits: [
    {
      circuit_number: "",
      sub_only_for_ev_correct: false,
      sub_only_for_ev_correct_note: "",
      sub_one_ev_per_circuit_correct: false,
      sub_one_ev_per_circuit_correct_note: "",

      sub_conductor_standard: "",
      sub_conductor_standard_correct: false,
      sub_conductor_standard_correct_note: "",
      sub_conductor_type: "",
      sub_conductor_type_other: false,
      sub_conductor_type_other_detail: "",
      sub_conductor_type_correct: false,
      sub_conductor_type_correct_note: "",
      sub_phase_size: "",
      sub_phase_size_correct: false,
      sub_phase_size_correct_note: "",
      sub_neutral_size: "",
      sub_neutral_size_correct: false,
      sub_neutral_size_correct_note: "",
      sub_ground_size: "",
      sub_ground_size_correct: false,
      sub_ground_size_correct_note: "",
      sub_phase_color_marking_correct: false,
      sub_phase_color_marking_correct_note: "",
      sub_mechanical_continuity_correct: false,
      sub_mechanical_continuity_correct_note: "",

      sub_wiring_conduit_wall: false,
      sub_wiring_conduit_wall_size: "",
      sub_wiring_conduit_wall_correct: false,
      sub_wiring_conduit_wall_correct_note: "",
      sub_wiring_conduit_buried: false,
      sub_wiring_conduit_buried_size: "",
      sub_wiring_conduit_buried_correct: false,
      sub_wiring_conduit_buried_correct_note: "",
      sub_wiring_direct_buried: false,
      sub_wiring_direct_buried_correct: false,
      sub_wiring_direct_buried_correct_note: "",
      sub_wiring_wireway: false,
      sub_wiring_wireway_size: "",
      sub_wiring_wireway_correct: false,
      sub_wiring_wireway_correct_note: "",
      sub_wiring_cable_tray: false,
      sub_wiring_cable_tray_size: "",
      sub_wiring_cable_tray_correct: false,
      sub_wiring_cable_tray_correct_note: "",
      sub_wiring_other: false,
      sub_wiring_other_detail: "",
      sub_wiring_other_correct: false,
      sub_wiring_other_correct_note: "",

      sub_conduit_metal: "",
      sub_conduit_metal_correct: false,
      sub_conduit_metal_correct_note: "",
      sub_conduit_nonmetal: "",
      sub_conduit_nonmetal_correct: false,
      sub_conduit_nonmetal_correct_note: "",
      sub_conduit_flexible_metal: false,
      sub_conduit_flexible_metal_correct: false,
      sub_conduit_flexible_metal_correct_note: "",
      sub_conduit_other: false,
      sub_conduit_other_detail: "",
      sub_conduit_other_correct: false,
      sub_conduit_other_correct_note: "",

      sub_feeder_cb_standard: false,
      sub_feeder_cb_standard_correct: false,
      sub_feeder_cb_standard_correct_note: "",
      sub_feeder_cb_amp_mode3_4: "",
      sub_feeder_cb_amp_mode3_4_correct: false,
      sub_feeder_cb_amp_mode3_4_correct_note: "",
      sub_feeder_cb_amp_mode2: "",
      sub_feeder_cb_amp_mode2_correct: false,
      sub_feeder_cb_amp_mode2_correct_note: "",

      sub_rcd_protection_b: false,
      sub_rcd_protection_b_amp: "",
      sub_rcd_protection_a: false,
      sub_rcd_protection_b2: false,
      sub_rcd_protection_b2_amp: "",
      sub_isolating_transformer: false,

      sub_protection_correct: false,
      sub_protection_correct_note: "",

      sub_rcd_only_btype_correct: false,
      sub_rcd_only_btype_correct_note: "",

      sub_separate_meter_correct: false,
      sub_separate_meter_correct_note: "",
      sub_subcircuit_only_for_ev_correct: false,
      sub_subcircuit_only_for_ev_correct_note: "",
    }
  ],
  ev_chargers: [
    {
      charger_number: "",
      charger_product: "",
      charger_model: "",
      charger_serial_number: "",
      charger_ip_rating: "",
      charger_system: "", // "1_phase" | "3_phase"
      charger_num_ports: "",
      charger_total_power_kw: "",
      charger_total_input_current_a: "",
      charger_charge_modes: {
        mode2_ac: false,
        mode3_ac: false,
        mode4_dc: false,
      },
      charger_correct: false,
      charger_correct_note: "",

      // 3.7.2
      charger_connectors: [
        {
          connector_type: "", // "ac_type2" | "dc_chademo" | "dc_ccs" | "other"
          connector_current: "",
          connector_voltage: "",
          connector_power: "",
          connector_other_detail: "",
        }
      ],
      charger_simultaneous_ports: "",
      charger_simultaneous_ports_detail: "",
      charger_connectors_correct: false,
      charger_connectors_correct_note: "",

      // 3.7.3 (Mode 2)
      charger_mode2: {
        charger_has_grounded_socket: false,
        charger_has_grounded_socket_note: "",
        charger_not_portable_socket: false,
        charger_not_portable_socket_note: "",
        charger_has_ev_warning_sign: false,
        charger_has_ev_warning_sign_note: "",
      },

      // 3.7.4 (Mode 3/4)
      charger_mode3_4: {
        charger_has_shock_warning_sign: false,
        charger_has_shock_warning_sign_note: "",
        charger_has_emergency_switch: false,
        charger_has_emergency_switch_note: "",
        charger_has_ventilation: false,
        charger_has_ventilation_note: "",
        charger_cable_length_ok: false,
        charger_cable_length_note: "",
      },

      // 3.7.5 (Gas Station)
      charger_gas_station: {
        charger_only_mode3_4: false,
        charger_only_mode3_4_note: "",
        charger_fixed_cable: false,
        charger_fixed_cable_note: "",
        charger_gas_has_emergency_switch: false,
        charger_gas_has_emergency_switch_note: "",
        charger_emergency_switch_distance_ok: false,
        charger_emergency_switch_distance_note: "",
        charger_electrical_equipment_standard: false,
        charger_electrical_equipment_standard_note: "",
        charger_hazardous_area_distance_ok: false,
        charger_hazardous_area_distance_note: "",
      },

      // 3.7.6 (Protection Recommendations)
      charger_protection: {
        charger_collision_protection: false,
        charger_collision_protection_note: "",
        charger_fire_extinguisher: false,
        charger_fire_extinguisher_note: "",
        charger_lightning_protection: false,
        charger_lightning_protection_note: "",
      }
    }
  ],
  summaryresult: "",
  scopeofinspection: "",
  userSignature: "",
  inspectorSignature: "",
  user_id: null,

}

  function EvChargerLvForm() {
    const router = useRouter();
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
    } = useFormManager('inspection_forms', initialFormData, [], '*', 'form-images'); // ใช้ '*' เพื่อดึงข้อมูลทั้งหมด
  
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
    
    // Enhanced handleChange to properly handle date fields
    const handleDateChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value || null // Convert empty string to null for dates
      }));
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
    <FormProvider>
      <div className="container mx-auto p-6 max-w-4xl">
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
                <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  สำหรับผู้ใช้ไฟฟ้าที่รับไฟฟ้าแรงต่ำโดยติดตั้งหม้อแปลงเฉพาะราย
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
                    <label htmlFor="inspection_date" className="block text-sm font-medium text-gray-700 mb-1">วันที่ตรวจสอบ: <span className="text-xs text-gray-500">(อัตโนมัติ)</span></label>
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
                    <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="text-xl">🗺️</span>
                      ค้นหาและปักหมุดที่อยู่
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">ค้นหาหรือลากแผนที่เพื่อเลือกตำแหน่ง จากนั้นพิกัดจะแสดงด้านล่าง</p>
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
                        <div className="font-mono text-gray-700 bg-gray-100 p-2 rounded mt-1">{formData.latitude || 'N/A'}</div>
                      </div>
                      <div className="bg-white/70 backdrop-blur p-3 rounded-lg">
                        <span className="text-sm font-semibold text-gray-700">ลองจิจูด:</span>
                        <div className="font-mono text-gray-700 bg-gray-100 p-2 rounded mt-1">{formData.longitude || 'N/A'}</div>
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

          {/* Section 2: เอกสารประกอบการตรวจสอบ */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
              2. เอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
            </h2>

            {/* 2.1 Personal Space Documents */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                2.1 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่ส่วนบุคคล
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                (เช่น บ้านอยู่อาศัย กิจการขนาดเล็ก หรืออาคารที่คล้ายคลึงกัน)
              </p>
              
              <div className="space-y-4 pl-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.personalspace}
                    onChange={(e) => handleChange({ target: { name: 'personalspace', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.personalsinglelinediagram}
                    onChange={(e) => handleChange({ target: { name: 'personalsinglelinediagram', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">แผนผังระบบไฟฟ้า (Single Line Diagram) (ถ้ามี)</span>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.personalload}
                    onChange={(e) => handleChange({ target: { name: 'personalload', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">ตารางโหลด (Load Schedule) (ถ้ามี)</span>
                </div>
              </div>

              <CorrectiveRadio
                name="personalcorrect"
                value={formData.personalcorrect}
                noteValue={formData.personalcorrect_note}
                noteName="personalcorrect_note"
                onChange={handleRadioChange}
                label="สถานะเอกสาร"
                className="mt-4"
              />
            </div>

            {/* 2.2 Public Space Documents */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                2.2 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่สาธารณะ
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                (สถานีอัดประจุยานยนต์ไฟฟ้า ร้านอาหาร ร้านค้า ร้านสะดวกซื้อ ถนนสาธารณะ หรืออาคารที่คล้ายคลึงกัน)
              </p>
              
              <div className="space-y-4 pl-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.publicsinglelinediagram}
                    onChange={(e) => handleChange({ target: { name: 'publicsinglelinediagram', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">แผนผังระบบไฟฟ้า (Single Line Diagram) ที่มีวิศวกรลงนามรับรอง</span>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.publicasbuilt}
                    onChange={(e) => handleChange({ target: { name: 'publicasbuilt', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่มีวิศวกรลงนามรับรอง</span>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.publicload}
                    onChange={(e) => handleChange({ target: { name: 'publicload', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า ที่มีวิศวกรลงนามรับรอง</span>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.publiccopy}
                    onChange={(e) => handleChange({ target: { name: 'publiccopy', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรมไฟฟ้า</span>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.publicspecification}
                    onChange={(e) => handleChange({ target: { name: 'publicspecification', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.publicpaper}
                    onChange={(e) => handleChange({ target: { name: 'publicpaper', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">หนังสือจดแจ้ง (พิกัดน้อยกว่า 1,000 kVA) หรือใบอนุญาต (พิกัดตั้งแต่ 1,000 kVA ขึ้นไป) จาก สกพ.</span>
                </div>
              </div>

              <CorrectiveRadio
                name="publiccorrect"
                value={formData.publiccorrect}
                noteValue={formData.publiccorrect_note}
                noteName="publiccorrect_note"
                onChange={handleRadioChange}
                label="สถานะเอกสาร"
                className="mt-4"
              />
            </div>
          </div>

          {/* Section 3: ระบบไฟฟ้าแรงต่ำ */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
              3. ระบบไฟฟ้าแรงต่ำ
            </h2>

            {/* 3.1 วงจรประธานแรงต่ำ */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 bg-gray-50 p-3 rounded">
                3.1 วงจรประธานแรงต่ำ
              </h3>

              {/* 3.1.1 สายตัวนำประธาน */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      name="lowvol_main"
                      value="มอก. 11-2553"
                      checked={formData.lowvol_main === "มอก. 11-2553"}
                      onChange={handleChange}
                      className="text-gray-700 mr-2"
                    />
                    <span className="text-gray-700">มอก. 11-2553</span>
                  </label>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      name="lowvol_main"
                      value="มอก. 293-2541"
                      checked={formData.lowvol_main === "มอก. 293-2541"}
                      onChange={handleChange}
                      className="text-gray-700 mr-2"
                    />
                    <span className="text-gray-700">มอก. 293-2541</span>
                  </label>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      name="lowvol_main"
                      value="IEC 60502"
                      checked={formData.lowvol_main === "IEC 60502"}
                      onChange={handleChange}
                      className="text-gray-700 mr-2"
                    />
                    <span className="text-gray-700">IEC 60502</span>
                  </label>
                </div>
                <CorrectiveRadio
                  name="lowvol_main_correct"
                  value={formData.lowvol_main_correct}
                  noteValue={formData.lowvol_main_correct_note}
                  noteName="lowvol_main_correct_note"
                  onChange={handleRadioChange}
                  className="mt-2 text-gray-700"
                />
              </div>

              {/* 3.1.2 ชนิดสายตัวนำ */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.1.2 ชนิดสายตัวนำ
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      name="lowvol_type"
                      value="IEC01"
                      checked={formData.lowvol_type === "IEC01"}
                      onChange={handleChange}
                      className="text-gray-700 mr-2"
                    />
                    <span className="text-gray-700">IEC01</span>
                  </label>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      name="lowvol_type"
                      value="NYY"
                      checked={formData.lowvol_type === "NYY"}
                      onChange={handleChange}
                      className="text-gray-700 mr-2"
                    />
                    <span className="text-gray-700">NYY</span>
                  </label>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      name="lowvol_type"
                      value="CV"
                      checked={formData.lowvol_type === "CV"}
                      onChange={handleChange}
                      className="text-gray-700 mr-2"
                    />
                    <span className="text-gray-700">CV</span>
                  </label>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      name="lowvol_type"
                      value="อื่นๆ"
                      checked={formData.lowvol_type === "อื่นๆ"}
                      onChange={handleChange}
                      className="text-gray-700 mr-2"
                    />
                    <span className="text-gray-700">อื่นๆ</span>
                  </label>
                </div>
                {formData.lowvol_type === "อื่นๆ" && (
                  <input
                    type="text"
                    name="lowvol_type_other"
                    value={formData.lowvol_type_other}
                    onChange={handleChange}
                    placeholder="ระบุ..."
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                )}
                <CorrectiveRadio
                  name="lowvol_type_correct"
                  value={formData.lowvol_type_correct}
                  noteValue={formData.lowvol_type_correct_note}
                  noteName="lowvol_type_correct_note"
                  onChange={handleRadioChange}
                  className="mt-2 text-gray-700"
                />
              </div>

              {/* 3.1.3 ขนาดสายเฟส */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.1.3 ขนาดสายเฟส (ตร.มม.)
                </label>
                <input
                  type="text"
                  name="lowvol_size"
                  value={formData.lowvol_size}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">
                  พิกัดกระแสสายตัวนำประธานต้องไม่น้อยกว่าขนาดปรับตั้งของเมนเซอร์กิตเบรกเกอร์ และสอดคล้องกับขนาดมิเตอร์ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด
                </p>
                <CorrectiveRadio
                  name="lowvol_size_correct"
                  value={formData.lowvol_size_correct}
                  noteValue={formData.lowvol_size_correct_note}
                  noteName="lowvol_size_correct_note"
                  onChange={handleRadioChange}
                  className="mt-2 text-gray-700"
                />
              </div>

              {/* 3.1.4 ขนาดสายนิวทรัล */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.1.4 ขนาดสายนิวทรัล (ตร.มม.)
                </label>
                <input
                  type="text"
                  name="lowvol_neutralsize"
                  value={formData.lowvol_neutralsize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
                <CorrectiveRadio
                  name="lowvol_neutralsize_correct"
                  value={formData.lowvol_neutralsize_correct}
                  noteValue={formData.lowvol_neutralsize_correct_note}
                  noteName="lowvol_neutralsize_correct_note"
                  onChange={handleRadioChange}
                  className="mt-2 text-gray-700"
                />
              </div>

              {/* 3.1.5 ระบุเฟสสายตัวนำ */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ
                </label>
                <input
                  type="text"
                  name="lowvol_color"
                  value={formData.lowvol_color}
                  onChange={handleChange}
                  placeholder="ระบุสีหรือเครื่องหมาย"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
                <textarea
                  name="lowvol_color_note"
                  value={formData.lowvol_color_note}
                  onChange={handleChange}
                  placeholder="หมายเหตุ..."
                  rows="2"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
              </div>

              {/* 3.1.6 ช่องเดินสาย */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ
                </label>
                <input
                  type="text"
                  name="lowvol_strong"
                  value={formData.lowvol_strong}
                  onChange={handleChange}
                  placeholder="รายละเอียด"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
                <textarea
                  name="lowvol_strong_note"
                  value={formData.lowvol_strong_note}
                  onChange={handleChange}
                  placeholder="หมายเหตุ..."
                  rows="2"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
              </div>

              {/* 3.1.7 วิธีการเดินสาย */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  3.1.7 วิธีการเดินสาย
                </label>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      name="main_wiring_air_insulator"
                      checked={formData.main_wiring_air_insulator}
                      onChange={(e) => handleChange({ target: { name: 'main_wiring_air_insulator', value: e.target.checked } })}
                      className="text-gray-700 mr-2"
                    />
                    <span>เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700">
                    <input
                      type="checkbox"
                      name="main_wiring_cable_tray"
                      checked={formData.main_wiring_cable_tray}
                      onChange={(e) => handleChange({ target: { name: 'main_wiring_cable_tray', value: e.target.checked } })}
                      className="text-gray-700 mr-2"
                    />
                    <span>เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                    <input
                      type="text"
                      name="main_wiring_cable_tray_size"
                      value={formData.main_wiring_cable_tray_size}
                      onChange={handleChange}
                      placeholder="มม. x มม."
                      className="px-2 py-1 border border-gray-300 rounded"
                      disabled={!formData.main_wiring_cable_tray}
                    />
                  </div>

                  <div className="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      name="main_wiring_direct_buried"
                      checked={formData.main_wiring_direct_buried}
                      onChange={(e) => handleChange({ target: { name: 'main_wiring_direct_buried', value: e.target.checked } })}
                      className="text-gray-700 mr-2"
                    />
                    <span>เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700">
                    <input
                      type="checkbox"
                      name="main_wiring_conduit_buried"
                      checked={formData.main_wiring_conduit_buried}
                      onChange={(e) => handleChange({ target: { name: 'main_wiring_conduit_buried', value: e.target.checked } })}
                      className="text-gray-700 mr-2"
                    />
                    <span>เดินสายร้อยท่อฝังดิน โดยใช้ท่อร้อยสายขนาด</span>
                    <input
                      type="text"
                      name="main_wiring_conduit_buried_size"
                      value={formData.main_wiring_conduit_buried_size}
                      onChange={handleChange}
                      placeholder="นิ้ว"
                      className="px-2 py-1 border border-gray-300 rounded"
                      disabled={!formData.main_wiring_conduit_buried}
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700">
                    <input
                      type="checkbox"
                      name="main_wiring_conduit_wall"
                      checked={formData.main_wiring_conduit_wall}
                      onChange={(e) => handleChange({ target: { name: 'main_wiring_conduit_wall', value: e.target.checked } })}
                      className="text-gray-700 mr-2"
                    />
                    <span>เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                    <input
                      type="text"
                      name="main_wiring_conduit_wall_size"
                      value={formData.main_wiring_conduit_wall_size}
                      onChange={handleChange}
                      placeholder="นิ้ว"
                      className="px-2 py-1 border border-gray-300 rounded"
                      disabled={!formData.main_wiring_conduit_wall}
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700">
                    <input
                      type="checkbox"
                      name="main_wiring_other"
                      checked={formData.main_wiring_other}
                      onChange={(e) => handleChange({ target: { name: 'main_wiring_other', value: e.target.checked } })}
                      className="text-gray-700 mr-2"
                    />
                    <span>อื่นๆ ระบุ</span>
                    <input
                      type="text"
                      name="main_wiring_other_detail"
                      value={formData.main_wiring_other_detail}
                      onChange={handleChange}
                      placeholder="รายละเอียด"
                      className="px-2 py-1 border border-gray-300 rounded flex-1"
                      disabled={!formData.main_wiring_other}
                    />
                  </div>
                </div>
                
                <CorrectiveRadio
                  name="main_wiring_correct"
                  value={formData.main_wiring_correct}
                  noteValue={formData.main_wiring_correct_note}
                  noteName="main_wiring_correct_note"
                  onChange={handleRadioChange}
                  className="mt-4"
                />
                
                <div className="mt-3 text-xs text-gray-600 bg-yellow-50 p-3 rounded">
                  <strong>หมายเหตุ:</strong> การไฟฟ้าส่วนภูมิภาคกำหนดให้ใช้สายตัวนำทองแดงสำหรับการเดินสายภายในและภายนอกอาคาร ส่วนสายตัวนำอะลูมิเนียมอนุญาตให้ใช้เป็นตัวนำประธานได้เฉพาะการเดินสายบนลูกถ้วยฉนวนภายนอกอาคาร
                </div>
              </div>

              {/* 3.1.8 ประเภทท่อร้อยสาย */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  3.1.8 ประเภทท่อร้อยสาย
                </label>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">ท่อโลหะ:</span>
                    <div className="flex flex-wrap gap-4 mt-1">
                      <label className="flex items-center text-gray-700">
                        <input
                          type="radio"
                          name="main_conduit_metal"
                          value="หนา (RMC)"
                          checked={formData.main_conduit_metal === "หนา (RMC)"}
                          onChange={handleChange}
                          className="text-gray-700 mr-2"
                        />
                        หนา (RMC)
                      </label>
                      <label className="flex items-center text-gray-700">
                        <input
                          type="radio"
                          name="main_conduit_metal"
                          value="หนาปานกลาง (IMC)"
                          checked={formData.main_conduit_metal === "หนาปานกลาง (IMC)"}
                          onChange={handleChange}
                          className="text-gray-700 mr-2"
                        />
                        หนาปานกลาง (IMC)
                      </label>
                      <label className="flex items-center text-gray-700">
                        <input
                          type="radio"
                          name="main_conduit_metal"
                          value="บาง (EMT)"
                          checked={formData.main_conduit_metal === "บาง (EMT)"}
                          onChange={handleChange}
                          className="text-gray-700 mr-2"
                        />
                        บาง (EMT)
                      </label>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">ท่ออโลหะ:</span>
                    <div className="flex flex-wrap gap-4 mt-1">
                      <label className="flex items-center text-gray-700">
                        <input
                          type="radio"
                          name="main_conduit_nonmetal_rnc"
                          value="แข็ง (RNC)"
                          checked={formData.main_conduit_nonmetal_rnc === "แข็ง (RNC)"}
                          onChange={handleChange}
                          className="text-gray-700 mr-2"
                        />
                        แข็ง (RNC)
                      </label>
                      <label className="flex items-center text-gray-700">
                        <input
                          type="radio"
                          name="main_conduit_nonmetal_rnc"
                          value="อ่อน (ENT)"
                          checked={formData.main_conduit_nonmetal_rnc === "อ่อน (ENT)"}
                          onChange={handleChange}
                          className="text-gray-700 mr-2"
                        />
                        อ่อน (ENT)
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700">
                    <input
                      type="checkbox"
                      name="main_conduit_other"
                      checked={formData.main_conduit_other}
                      onChange={(e) => handleChange({ target: { name: 'main_conduit_other', value: e.target.checked } })}
                      className="text-gray-700 mr-2"
                    />
                    <span>อื่นๆ ระบุ</span>
                    <input
                      type="text"
                      name="main_conduit_other_detail"
                      value={formData.main_conduit_other_detail}
                      onChange={handleChange}
                      placeholder="รายละเอียด"
                      className="px-2 py-1 border border-gray-300 rounded flex-1"
                      disabled={!formData.main_conduit_other}
                    />
                  </div>
                </div>

                <CorrectiveRadio
                  name="main_conduit_correct"
                  value={formData.main_conduit_correct}
                  noteValue={formData.main_conduit_correct_note}
                  noteName="main_conduit_correct_note"
                  onChange={handleRadioChange}
                  className="mt-4"
                />
              </div>
            </div>

            {/* 3.2 เครื่องป้องกันกระแสเกิน */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 bg-gray-50 p-3 rounded">
                3.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2
                </label>
                <input
                  type="text"
                  name="main_breaker"
                  value={formData.main_breaker}
                  onChange={handleChange}
                  placeholder="รายละเอียดมาตรฐาน"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
                <textarea
                  name="main_breaker_note"
                  value={formData.main_breaker_note}
                  onChange={handleChange}
                  placeholder="หมายเหตุ..."
                  rows="2"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด (แอมแปร์)
                </label>
                <input
                  type="text"
                  name="main_breaker_amp_rating"
                  value={formData.main_breaker_amp_rating}
                  onChange={handleChange}
                  placeholder="แอมแปร์ (A)"
                  className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">สอดคล้องกับพิกัดกระแสสายตัวนำประธาน</p>
                <CorrectiveRadio
                  name="main_breaker_amp_correct"
                  value={formData.main_breaker_amp_correct}
                  noteValue={formData.main_breaker_amp_correct_note}
                  noteName="main_breaker_amp_correct_note"
                  onChange={handleRadioChange}
                  className="mt-2 text-gray-700"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.2.3 พิกัดทนกระแสลัดวงจร (Ic)
                </label>
                <input
                  type="text"
                  name="main_breaker_ic_rating"
                  value={formData.main_breaker_ic_rating}
                  onChange={handleChange}
                  placeholder="กิโลแอมแปร์ (kA)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
                <CorrectiveRadio
                  name="main_breaker_ic_correct"
                  value={formData.main_breaker_ic_correct}
                  noteValue={formData.main_breaker_ic_correct_note}
                  noteName="main_breaker_ic_correct_note"
                  onChange={handleRadioChange}
                  className="mt-2 text-gray-700"
                />
              </div>
            </div>

            {/* 3.3 ระบบการต่อลงดิน */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 bg-gray-50 p-3 rounded">
                3.3 ระบบการต่อลงดินที่แผงเมนสวิตช์
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3.3.1 สายต่อหลักดิน (ตัวนำทองแดง) ขนาด (ตร.มม.)
                </label>
                <input
                  type="text"
                  name="ground_copper_size"
                  value={formData.ground_copper_size}
                  onChange={handleChange}
                  placeholder="ตร.มม."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">สอดคล้องกับขนาดสายตัวนำประธาน ตามตารางที่ 1 ในหน้าที่ 5</p>
                <CorrectiveRadio
                  name="ground_copper_size_correct"
                  value={formData.ground_copper_size_correct}
                  noteValue={formData.ground_copper_size_correct_note}
                  noteName="ground_copper_size_correct_note"
                  onChange={handleRadioChange}
                  className="mt-2 text-gray-700"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  3.3.2 การต่อลงดินที่แผงเมนสวิตช์
                </label>
                <div className="space-y-3">
                  <label className="flex items-start text-gray-700">
                    <input
                      type="radio"
                      name="ground_connection_type"
                      value="single_phase"
                      checked={formData.ground_connection_type === "single_phase"}
                      onChange={handleChange}
                      className="mr-2 mt-1 text-gray-700"
                    />
                    <div className="text-sm">
                      <strong>กรณีระบบไฟฟ้า 1 เฟส</strong> แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด
                    </div>
                  </label>
                  <label className="flex items-start text-gray-700">
                    <input
                      type="radio"
                      name="ground_connection_type"
                      value="three_phase"
                      checked={formData.ground_connection_type === "three_phase"}
                      onChange={handleChange}
                      className="mr-2 mt-1 text-gray-700"
                    />
                    <div className="text-sm text-gray-700">
                      <strong>กรณีระบบไฟฟ้า 3 เฟส</strong> แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด
                    </div>
                  </label>
                </div>
                <CorrectiveRadio
                  name="ground_connection_correct"
                  value={formData.ground_connection_correct}
                  noteValue={formData.ground_connection_correct_note}
                  noteName="ground_connection_correct_note"
                  onChange={handleRadioChange}
                  className="mt-4 text-gray-700"
                />
              </div>
            </div>
        
          {/* 3.4 รูปแบบการต่อลงดิน */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4 bg-gray-50 p-3 rounded">
              3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งรูปแบบ)
            </h3>

            <div className="mb-4">
              <div className="space-y-3">
                <label className="flex items-center text-gray-700">
                  <input
                    type="radio"
                    name="ground_system_type"
                    value="tn-c-s"
                    checked={formData.ground_system_type === "tn-c-s"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="font-medium">TN-C-S ทั้งระบบ</span>
                </label>
                <label className="flex items-center text-gray-700">
                  <input
                    type="radio"
                    name="ground_system_type"
                    value="tt"
                    checked={formData.ground_system_type === "tt"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="font-medium">TT ทั้งระบบ</span>
                </label>
                <label className="flex items-center text-gray-700">
                  <input
                    type="radio"
                    name="ground_system_type"
                    value="tt_partial"
                    checked={formData.ground_system_type === "tt_partial"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="font-medium">TT บางส่วน (ต้นทางเป็น TN-C-S และ โหลดเป็น TT)</span>
                </label>
              </div>
            </div>

            {/* 3.4.1 TN-C-S System */}
            {formData.ground_system_type === "tn-c-s" && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  3.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องมีมาตรการอย่างใดอย่างหนึ่ง)
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="tncs_earthing_resistance"
                      checked={formData.tncs_earthing_resistance}
                      onChange={(e) => handleChange({ target: { name: 'tncs_earthing_resistance', value: e.target.checked } })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">ค่าความต้านทานการต่อลงดิน</span>
                    <input
                      type="text"
                      name="tncs_earthing_om"
                      value={formData.tncs_earthing_om}
                      onChange={handleChange}
                      placeholder="โอห์ม (Ω)"
                      className="px-2 py-1 border border-gray-300 rounded"
                      disabled={!formData.tncs_earthing_resistance}
                    />
                    <span className="text-xs text-gray-500">โอห์ม (Ω)</span>
                  </div>
                  
                  <div className="text-xs text-gray-600 ml-6">
                    <p>กรณีมิเตอร์ 15(45), 5(45) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 2.5 Ω</p>
                    <p>กรณีมิเตอร์ 30(100), 5(100) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 1.25 Ω</p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      name="tncs_undervoltage_protection_installed"
                      checked={formData.tncs_undervoltage_protection_installed}
                      onChange={(e) => handleChange({ target: { name: 'tncs_undervoltage_protection_installed', value: e.target.checked } })}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">ติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกินเพิ่มเติม ในตำแหน่งก่อนเข้าเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      name="tncs_undervoltage_protection_in_charger"
                      checked={formData.tncs_undervoltage_protection_in_charger}
                      onChange={(e) => handleChange({ target: { name: 'tncs_undervoltage_protection_in_charger', value: e.target.checked } })}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">มีระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกิน ติดตั้งมาภายในเครื่องอัดประจุยานยนต์ไฟฟ้าแล้ว</span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      name="tncs_touch_voltage_protection"
                      checked={formData.tncs_touch_voltage_protection}
                      onChange={(e) => handleChange({ target: { name: 'tncs_touch_voltage_protection', value: e.target.checked } })}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครงบริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัดประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดิน ออกพร้อมกันภายในเวลา 5 วินาที</span>
                  </div>
                </div>

                <CorrectiveRadio
                  name="tncs_correct"
                  value={formData.tncs_correct}
                  noteValue={formData.tncs_correct_note}
                  noteName="tncs_correct_note"
                  onChange={handleRadioChange}
                  className="mt-4"
                />
              </div>
            )}

            {/* 3.4.2 TT System */}
            {formData.ground_system_type === "tt" && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  3.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ (ต้องดำเนินการครบทั้ง ก) และ ข))
                </h4>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <p>ก) ติดตั้งเครื่องตัดไฟรั่ว (RCD) ทุกวงจรไฟฟ้าที่จ่ายไฟ หรือทุกเครื่องใช้ไฟฟ้า ไม่ว่าจะเกี่ยวข้องกับการอัดประจุยานยนต์ไฟฟ้าหรือไม่ก็ตาม</p>
                  <p>ข) ติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกิน สำหรับวงจรที่จ่ายไฟให้เครื่องอัดประจุยานยนต์ไฟฟ้า หรือมีระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกินที่ติดตั้งมาภายในเครื่องอัดประจุยานยนต์ไฟฟ้าแล้ว</p>
                </div>

                <CorrectiveRadio
                  name="tt_correct"
                  value={formData.tt_correct}
                  noteValue={formData.tt_correct_note}
                  noteName="tt_correct_note"
                  onChange={handleRadioChange}
                  className="mt-4"
                />
              </div>
            )}

            {/* 3.4.3 TT Partial System */}
            {formData.ground_system_type === "tt_partial" && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  3.4.3 กรณีต่อลงดินแบบ TT บางส่วน
                </h4>
                
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    3.4.3.1 มาตรการที่ต้องดำเนินการให้ครบทุกข้อ (ก – ค)
                  </h5>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>ก) มีการประเมินความเสี่ยงก่อนว่า ไม่มีโอกาสที่บุคคลจะสัมผัสโครงบริภัณฑ์ไฟฟ้าอื่นที่ต่อลงดินแบบ TN-C-S กับโครงบริภัณฑ์จ่ายไฟยานยนต์ไฟฟ้า หรือโครงยานยนต์ไฟฟ้าที่ต่อลงดินแบบ TT โดยพร้อมกัน หรือมีระยะห่างไม่น้อยกว่า 2.50 เมตร สามารถใช้การห่อหุ้มหรือกั้นได้</p>
                    <p>ข) ระยะห่างระหว่างหลักดินของระบบ TN-C-S กับระบบ TT ต้องห่างกันอย่างน้อย 2.00 เมตร</p>
                    <p>ค) มีการติดตั้งป้ายแสดงข้อความเตือนบริเวณเครื่องอัดประจุยานยนต์ไฟฟ้า ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด</p>
                  </div>
                  
                  <div className="mt-3">
                    <textarea
                      name="tt_partial_risk_assessment"
                      value={formData.tt_partial_risk_assessment}
                      onChange={handleChange}
                      placeholder="รายละเอียดการประเมินความเสี่ยง..."
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                    />
                    <textarea
                      name="tt_partial_risk_assessment_note"
                      value={formData.tt_partial_risk_assessment_note}
                      onChange={handleChange}
                      placeholder="หมายเหตุ..."
                      rows="2"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    3.4.3.2 มาตรการที่ต้องเลือกทำอย่างใดอย่างหนึ่ง
                  </h5>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="tt_partial_measure_resistance"
                        checked={formData.tt_partial_measure_resistance}
                        onChange={(e) => handleChange({ target: { name: 'tt_partial_measure_resistance', value: e.target.checked } })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">ค่าความต้านทานการต่อลงดิน</span>
                      <input
                        type="text"
                        name="tt_partial_measure_resistance_value"
                        value={formData.tt_partial_measure_resistance_value}
                        onChange={handleChange}
                        placeholder="โอห์ม (Ω)"
                        className="px-2 py-1 border border-gray-300 rounded"
                        disabled={!formData.tt_partial_measure_resistance}
                      />
                      <span className="text-xs text-gray-500">โอห์ม (Ω)</span>
                    </div>
                    
                    <div className="text-xs text-gray-600 ml-6">
                      <p>กรณีมิเตอร์ 15(45), 5(45) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 2.5 Ω</p>
                      <p>กรณีมิเตอร์ 30(100), 5(100) A ต้องมีค่าความต้านทานการต่อลงดินไม่เกิน 1.25 Ω</p>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        name="tt_partial_measure_undervoltage_before_charger"
                        checked={formData.tt_partial_measure_undervoltage_before_charger}
                        onChange={(e) => handleChange({ target: { name: 'tt_partial_measure_undervoltage_before_charger', value: e.target.checked } })}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">ติดตั้งระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกินเพิ่มเติม ในตำแหน่งก่อนเข้าเครื่องอัดประจุยานยนต์ไฟฟ้า</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        name="tt_partial_measure_undervoltage_in_charger"
                        checked={formData.tt_partial_measure_undervoltage_in_charger}
                        onChange={(e) => handleChange({ target: { name: 'tt_partial_measure_undervoltage_in_charger', value: e.target.checked } })}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">มีระบบป้องกันแรงดันไฟฟ้าตกและแรงดันไฟฟ้าเกิน ติดตั้งมาภายในเครื่องอัดประจุยานยนต์ไฟฟ้าแล้ว</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        name="tt_partial_measure_touch_voltage_protection"
                        checked={formData.tt_partial_measure_touch_voltage_protection}
                        onChange={(e) => handleChange({ target: { name: 'tt_partial_measure_touch_voltage_protection', value: e.target.checked } })}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครงบริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัดประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดิน ออกพร้อมกันภายในเวลา 5 วินาที</span>
                    </div>
                  </div>

                  <CorrectiveRadio
                    name="tt_partial_measure_correct"
                    value={formData.tt_partial_measure_correct}
                    noteValue={formData.tt_partial_correct_note}
                    noteName="tt_partial_correct_note"
                    onChange={handleRadioChange}
                    className="mt-4"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3.5 วงจรสายป้อน/แผงวงจรย่อย */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4 bg-gray-50 p-3 rounded">
              3.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board) (ถ้ามี)
            </h3>

            {/* 3.5.1 วงจรสายป้อน */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">3.5.1 วงจรสายป้อน</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ก) สายป้อนเป็นไปตามมาตรฐาน
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_standard"
                        value="มอก. 11-2553"
                        checked={formData.feeder_standard === "มอก. 11-2553"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      มอก. 11-2553
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_standard"
                        value="มอก. 293-2541"
                        checked={formData.feeder_standard === "มอก. 293-2541"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      มอก. 293-2541
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_standard"
                        value="IEC 60502"
                        checked={formData.feeder_standard === "IEC 60502"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      IEC 60502
                    </label>
                  </div>
                  <CorrectiveRadio
                    name="feeder_standard_correct"
                    value={formData.feeder_standard_correct}
                    noteValue={formData.feeder_standard_correct_note}
                    noteName="feeder_standard_correct_note"
                    onChange={handleRadioChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข) ชนิดสายตัวนำ
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_conductor"
                        value="IEC01"
                        checked={formData.feeder_conductor === "IEC01"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      IEC01
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_conductor"
                        value="NYY"
                        checked={formData.feeder_conductor === "NYY"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      NYY
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_conductor"
                        value="CV"
                        checked={formData.feeder_conductor === "CV"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      CV
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_conductor"
                        value="อื่นๆ"
                        checked={formData.feeder_conductor === "อื่นๆ"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      อื่นๆ
                    </label>
                  </div>
                  {formData.feeder_conductor === "อื่นๆ" && (
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        name="feeder_conductor_type_other"
                        checked={formData.feeder_conductor_type_other}
                        onChange={(e) => handleChange({ target: { name: 'feeder_conductor_type_other', value: e.target.checked } })}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        name="feeder_conductor_type_other_detail"
                        value={formData.feeder_conductor_type_other_detail}
                        onChange={handleChange}
                        placeholder="ระบุ..."
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                        disabled={!formData.feeder_conductor_type_other}
                      />
                    </div>
                  )}
                  <CorrectiveRadio
                    name="feeder_conductor_type_correct"
                    value={formData.feeder_conductor_type_correct}
                    noteValue={formData.feeder_conductor_type_correct_note}
                    noteName="feeder_conductor_type_correct_note"
                    onChange={handleRadioChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ค) ขนาดสายเฟส (ตร.มม.)
                  </label>
                  <input
                    type="text"
                    name="feeder_phase_size"
                    value={formData.feeder_phase_size}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    พิกัดกระแสสายป้อนต้องไม่น้อยกว่าขนาดปรับตั้งของเซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน และขนาดสายป้อนต้องไม่เล็กกว่า 4 ตร.มม.
                  </p>
                  <CorrectiveRadio
                    name="feeder_phase_size_correct"
                    value={formData.feeder_phase_size_correct}
                    noteValue={formData.feeder_phase_size_correct_note}
                    noteName="feeder_phase_size_correct_note"
                    onChange={handleRadioChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ง) ขนาดสายนิวทรัล (ตร.มม.)
                  </label>
                  <input
                    type="text"
                    name="feeder_neutral_size"
                    value={formData.feeder_neutral_size}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                  <CorrectiveRadio
                    name="feeder_neutral_size_correct"
                    value={formData.feeder_neutral_size_correct}
                    noteValue={formData.feeder_neutral_size_correct_note}
                    noteName="feeder_neutral_size_correct_note"
                    onChange={handleRadioChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    จ) ขนาดสายดิน (ตร.มม.)
                  </label>
                  <input
                    type="text"
                    name="feeder_ground_size"
                    value={formData.feeder_ground_size}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    สอดคล้องกับขนาดสายเฟสของวงจรสายป้อน ตามตารางที่ 1 ในหน้าที่ 5
                  </p>
                  <CorrectiveRadio
                    name="feeder_ground_size_correct"
                    value={formData.feeder_ground_size_correct}
                    noteValue={formData.feeder_ground_size_correct_note}
                    noteName="feeder_ground_size_correct_note"
                    onChange={handleRadioChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ
                  </label>
                  <input
                    type="text"
                    name="feeder_phase_color_marking"
                    value={formData.feeder_phase_color_marking}
                    onChange={handleChange}
                    placeholder="ระบุสีหรือเครื่องหมาย"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                  <textarea
                    name="feeder_phase_color_marking_note"
                    value={formData.feeder_phase_color_marking_note}
                    onChange={handleChange}
                    placeholder="หมายเหตุ..."
                    rows="2"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ
                  </label>
                  <input
                    type="text"
                    name="feeder_mechanical"
                    value={formData.feeder_mechanical}
                    onChange={handleChange}
                    placeholder="รายละเอียด"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                  <textarea
                    name="feeder_mechanical_note"
                    value={formData.feeder_mechanical_note}
                    onChange={handleChange}
                    placeholder="หมายเหตุ..."
                    rows="2"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* 3.5.2 วิธีการเดินสาย */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">3.5.2 วิธีการเดินสาย</h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="feeder_wiring_wireway"
                    checked={formData.feeder_wiring_wireway}
                    onChange={(e) => handleChange({ target: { name: 'feeder_wiring_wireway', value: e.target.checked } })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">เดินในรางเดินสาย (Wireway) ขนาด</span>
                  <input
                    type="text"
                    name="feeder_wiring_wireway_size"
                    value={formData.feeder_wiring_wireway_size}
                    onChange={handleChange}
                    placeholder="มม. x มม."
                    className="px-2 py-1 border border-gray-300 rounded"
                    disabled={!formData.feeder_wiring_wireway}
                  />
                </div>
                <CorrectiveRadio
                  name="feeder_wiring_wireway_correct"
                  value={formData.feeder_wiring_wireway_correct}
                  noteValue={formData.feeder_wiring_wireway_correct_note}
                  noteName="feeder_wiring_wireway_correct_note"
                  onChange={handleRadioChange}
                  className="ml-6"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="feeder_wiring_cable_tray"
                    checked={formData.feeder_wiring_cable_tray}
                    onChange={(e) => handleChange({ target: { name: 'feeder_wiring_cable_tray', value: e.target.checked } })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                  <input
                    type="text"
                    name="feeder_wiring_cable_tray_size"
                    value={formData.feeder_wiring_cable_tray_size}
                    onChange={handleChange}
                    placeholder="มม. x มม."
                    className="px-2 py-1 border border-gray-300 rounded"
                    disabled={!formData.feeder_wiring_cable_tray}
                  />
                </div>
                <CorrectiveRadio
                  name="feeder_wiring_cable_tray_correct"
                  value={formData.feeder_wiring_cable_tray_correct}
                  noteValue={formData.feeder_wiring_cable_tray_correct_note}
                  noteName="feeder_wiring_cable_tray_correct_note"
                  onChange={handleRadioChange}
                  className="ml-6"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="feeder_wiring_busway"
                    checked={formData.feeder_wiring_busway}
                    onChange={(e) => handleChange({ target: { name: 'feeder_wiring_busway', value: e.target.checked } })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">บัสเวย์ (Busway) หรือบัสดัก (Bus duct) ขนาด</span>
                  <input
                    type="text"
                    name="feeder_wiring_busway_size"
                    value={formData.feeder_wiring_busway_size}
                    onChange={handleChange}
                    placeholder="มม. x มม."
                    className="px-2 py-1 border border-gray-300 rounded"
                    disabled={!formData.feeder_wiring_busway}
                  />
                </div>
                <CorrectiveRadio
                  name="feeder_wiring_busway_correct"
                  value={formData.feeder_wiring_busway_correct}
                  noteValue={formData.feeder_wiring_busway_correct_note}
                  noteName="feeder_wiring_busway_correct_note"
                  onChange={handleRadioChange}
                  className="ml-6"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="feeder_wiring_conduit_wall"
                    checked={formData.feeder_wiring_conduit_wall}
                    onChange={(e) => handleChange({ target: { name: 'feeder_wiring_conduit_wall', value: e.target.checked } })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                  <input
                    type="text"
                    name="feeder_wiring_conduit_wall_size"
                    value={formData.feeder_wiring_conduit_wall_size}
                    onChange={handleChange}
                    placeholder="นิ้ว"
                    className="px-2 py-1 border border-gray-300 rounded"
                    disabled={!formData.feeder_wiring_conduit_wall}
                  />
                </div>
                <CorrectiveRadio
                  name="feeder_wiring_conduit_wall_correct"
                  value={formData.feeder_wiring_conduit_wall_correct}
                  noteValue={formData.feeder_wiring_conduit_wall_correct_note}
                  noteName="feeder_wiring_conduit_wall_correct_note"
                  onChange={handleRadioChange}
                  className="ml-6"
                />

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    name="feeder_wiring_direct_buried"
                    checked={formData.feeder_wiring_direct_buried}
                    onChange={(e) => handleChange({ target: { name: 'feeder_wiring_direct_buried', value: e.target.checked } })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                </div>
                <textarea
                  name="feeder_wiring_direct_buried_note"
                  value={formData.feeder_wiring_direct_buried_note}
                  onChange={handleChange}
                  placeholder="หมายเหตุ..."
                  rows="2"
                  className="ml-6 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  disabled={!formData.feeder_wiring_direct_buried}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="feeder_wiring_conduit_buried"
                    checked={formData.feeder_wiring_conduit_buried}
                    onChange={(e) => handleChange({ target: { name: 'feeder_wiring_conduit_buried', value: e.target.checked } })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
                  <input
                    type="text"
                    name="feeder_wiring_conduit_buried_size"
                    value={formData.feeder_wiring_conduit_buried_size}
                    onChange={handleChange}
                    placeholder="นิ้ว"
                    className="px-2 py-1 border border-gray-300 rounded"
                    disabled={!formData.feeder_wiring_conduit_buried}
                  />
                </div>
                <CorrectiveRadio
                  name="feeder_wiring_conduit_buried_correct"
                  value={formData.feeder_wiring_conduit_buried_correct}
                  noteValue={formData.feeder_wiring_conduit_buried_correct_note}
                  noteName="feeder_wiring_conduit_buried_correct_note"
                  onChange={handleRadioChange}
                  className="ml-6"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="feeder_wiring_other_method"
                    checked={formData.feeder_wiring_other_method}
                    onChange={(e) => handleChange({ target: { name: 'feeder_wiring_other_method', value: e.target.checked } })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">อื่นๆ ระบุ</span>
                  <input
                    type="text"
                    name="feeder_wiring_other_method_detail"
                    value={formData.feeder_wiring_other_method_detail}
                    onChange={handleChange}
                    placeholder="รายละเอียด"
                    className="px-2 py-1 border border-gray-300 rounded flex-1"
                    disabled={!formData.feeder_wiring_other_method}
                  />
                </div>
                <CorrectiveRadio
                  name="feeder_wiring_other_method_correct"
                  value={formData.feeder_wiring_other_method_correct}
                  noteValue={formData.feeder_wiring_other_method_correct_note}
                  noteName="feeder_wiring_other_method_correct_note"
                  onChange={handleRadioChange}
                  className="ml-6"
                />
              </div>
            </div>

            {/* 3.5.3 ประเภทท่อร้อยสาย */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">3.5.3 ประเภทท่อร้อยสาย</h4>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">ท่อโลหะ:</span>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_conduit_metal"
                        value="หนา (RMC)"
                        checked={formData.feeder_conduit_metal === "หนา (RMC)"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      หนา (RMC)
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_conduit_metal"
                        value="หนาปานกลาง (IMC)"
                        checked={formData.feeder_conduit_metal === "หนาปานกลาง (IMC)"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      หนาปานกลาง (IMC)
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_conduit_metal"
                        value="บาง (EMT)"
                        checked={formData.feeder_conduit_metal === "บาง (EMT)"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      บาง (EMT)
                    </label>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">ท่ออโลหะ:</span>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_conduit_nonmetal"
                        value="แข็ง (RNC)"
                        checked={formData.feeder_conduit_nonmetal === "แข็ง (RNC)"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      แข็ง (RNC)
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="feeder_conduit_nonmetal"
                        value="อ่อน (ENT)"
                        checked={formData.feeder_conduit_nonmetal === "อ่อน (ENT)"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      อ่อน (ENT)
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="feeder_conduit_flexible_metal"
                    checked={formData.feeder_conduit_flexible_metal}
                    onChange={(e) => handleChange({ target: { name: 'feeder_conduit_flexible_metal', value: e.target.checked } })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">ท่อโลหะอ่อน (Flexible Metal Conduit)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="feeder_conduit_other_type"
                    checked={formData.feeder_conduit_other_type}
                    onChange={(e) => handleChange({ target: { name: 'feeder_conduit_other_type', value: e.target.checked } })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">อื่นๆ ระบุ</span>
                  <input
                    type="text"
                    name="feeder_conduit_other_type_detail"
                    value={formData.feeder_conduit_other_type_detail}
                    onChange={handleChange}
                    placeholder="รายละเอียด"
                    className="px-2 py-1 border border-gray-300 rounded flex-1"
                    disabled={!formData.feeder_conduit_other_type}
                  />
                </div>

                <CorrectiveRadio
                  name="feeder_conduit_type_correct"
                  value={formData.feeder_conduit_type_correct}
                  noteValue={formData.feeder_conduit_type_correct_note}
                  noteName="feeder_conduit_type_correct_note"
                  onChange={handleRadioChange}
                  className="mt-4"
                />
              </div>
            </div>

            {/* 3.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">3.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2
                  </label>
                  <CorrectiveRadio
                    name="feeder_cb_standard_correct"
                    value={formData.feeder_cb_standard_correct}
                    noteValue={formData.feeder_cb_standard_correct_note}
                    noteName="feeder_cb_standard_correct_note"
                    onChange={handleRadioChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข) เซอร์กิตเบรกเกอร์ขนาด AT (แอมแปร์)
                  </label>
                  <input
                    type="text"
                    name="feeder_cb_amp_rating"
                    value={formData.feeder_cb_amp_rating}
                    onChange={handleChange}
                    placeholder="แอมแปร์ (A)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">ไม่เกินพิกัดกระแสสายป้อน และไม่ต่ำกว่าโหลดสูงสุดของสายป้อน</p>
                  <CorrectiveRadio
                    name="feeder_cb_amp_correct"
                    value={formData.feeder_cb_amp_correct}
                    noteValue={formData.feeder_cb_amp_correct_note}
                    noteName="feeder_cb_amp_correct_note"
                    onChange={handleRadioChange}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* 3.5.5 การติดตั้งแผงวงจรย่อย */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">3.5.5 การติดตั้งแผงวงจรย่อย (Panel board)</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ก) ต้องมีพิกัดไม่ต่ำกว่าขนาดสายป้อน
                  </label>
                  <input
                    type="text"
                    name="panel_board_rating"
                    value={formData.panel_board_rating}
                    onChange={handleChange}
                    placeholder="พิกัดแผงวงจรย่อย"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  />
                  <CorrectiveRadio
                    name="panel_board_rating_correct"
                    value={formData.panel_board_rating_correct}
                    noteValue={formData.panel_board_rating_correct_note}
                    noteName="panel_board_rating_correct_note"
                    onChange={handleRadioChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข) ไม่มีการต่อฝาก เชื่อมระหว่างขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) ที่แผงวงจรย่อย
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="panel_board_no_ground_neutral_bond"
                      checked={formData.panel_board_no_ground_neutral_bond}
                      onChange={(e) => handleChange({ target: { name: 'panel_board_no_ground_neutral_bond', value: e.target.checked } })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">ไม่มีการต่อฝาก เชื่อมระหว่าง Ground Bus และ Neutral Bus</span>
                  </div>
                  <CorrectiveRadio
                    name="panel_board_no_ground_neutral_bond_correct"
                    value={formData.panel_board_no_ground_neutral_bond_correct}
                    noteValue={formData.panel_board_no_ground_neutral_bond_correct_note}
                    noteName="panel_board_no_ground_neutral_bond_correct_note"
                    onChange={handleRadioChange}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
          

          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</h3>
            <div className="text-gray-700 text-sm mb-6 space-y-3">
                <p>6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนสิ่งก่อสร้างอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงอยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว</p>
                <p>6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหลัง หรืออุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
                <p>6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
                <p>6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</p>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-[#5b2d90] text-white px-6 py-2 rounded-lg hover:bg-[#4a2470] transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
              
              {formData.id && (
                <PDFDownloadLink
                  document={<InspectionPDF data={formData} />}
                  fileName={`inspection-report-${formData.id}.pdf`}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {({ loading }) => (
                    <>
                      <Download size={20} />
                      {loading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}
                    </>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </div>
        </form>
        </div>
      </div>
    </FormProvider>
  )
}

export default EvChargerLvForm;
