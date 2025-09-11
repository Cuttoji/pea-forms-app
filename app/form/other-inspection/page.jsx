"use client";

import React, { useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OtherInspectionPDF from "@/components/pdf/OtherInspectionPDF";
import { Download, Save } from "lucide-react";
import { useFormManager } from "@/lib/hooks/useFormManager";
import initialCommercialInspectionItems from "@/lib/constants/initialotherItems";

const OpenStreetMapComponent = dynamic(
  () => import("@/components/forms/OpenStreetMapComponent"),
  { ssr: false }
);

// Create initial transformer data - moved before usage
const createInitialTransformer = (index) => ({
  id: index + 1,
  // 2.5 คุณสมบัติทั่วไปของหม้อแปลง
  general_test_result: "", // ผ่านการทดสอบ/ไม่ผ่านการทดสอบ
  transformer_number: "",
  capacity_kva: "",
  hv_rating_kv: "",
  lv_rating_v: "",
  impedance_percent: "",
  type: "", // Oil/Dry/อื่นๆ
  type_other: "",
  vector_group: "",
  max_short_circuit_ka: "",
  general_result: "", // ถูกต้อง/ต้องแก้ไข
  general_detail: "",

  // 2.6 ลักษณะการติดตั้ง
  installation_type: "", // แขวน/นั่งร้าน/ตั้งพื้น/ตั้งบนดาดฟ้า/ห้องหม้อแปลง/อื่นๆ
  installation_other: "",
  installation_result: "",
  installation_detail: "",

  // 2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า
  protection_type: "", // ดรอพเอาท์ฟิวส์คัตเอาท์/เซอร์กิตเบรกเกอร์/อื่นๆ
  protection_other: "",
  continuous_current_a: "",
  interrupting_capacity_ka: "",
  protection_result: "",
  protection_detail: "",

  // 2.8 การติดตั้งกับดักเสิร์จแรงสูง
  surge_arrester_voltage_kv: "",
  surge_arrester_current_ka: "",
  surge_arrester_result: "",
  surge_arrester_detail: "",

  // 2.9 การประกอบสายดินกับตัวถังหม้อแปลง
  grounding_result: "",
  grounding_detail: "",

  // 2.10 ค่าความต้านทานดินของระบบแรงสูง
  hv_ground_resistance: "",
  hv_ground_result: "",
  hv_ground_detail: "",

  // 2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)
  moisture_absorber_result: "",
  moisture_absorber_detail: "",
  bushing_condition_result: "",
  bushing_condition_detail: "",
  oil_level_result: "",
  oil_level_detail: "",
  oil_leakage_result: "",
  oil_leakage_detail: "",

  // 2.12 ป้ายเตือน
  warning_sign_result: "",
  warning_sign_detail: "",

  // 2.13 อื่นๆ
  other_notes: "",
});

const initialCommercialInspectionFormData = {
  id: null,
  user_id: null,
  inspection_round: 1,
  inspection_date: new Date().toISOString().split("T")[0],
  request_number: "",
  request_date: "",
  applicant_name: "",
  applicant_phone: "",
  applicant_address: "",
  map_latitude: null,
  map_longitude: null,
  front_photo_url: "",
  electrical_system: "",
  approximate_load_amp: "",
  has_design_certificate: false,
  inspection_result: "",
  inspection_scope: "",
  applicant_signature: "",
  applicant_signature_name: "",
  officer_signature: "",
  officer_signature_name: "",
  inspection_items: initialCommercialInspectionItems,
  transformers: [createInitialTransformer(0)], // Add transformer data
  created_at: new Date().toISOString(),
};

function CommercialInspectionFormContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const imageUploadRef = useRef(null);

  const {
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleSignatureSave,
    handleSignatureClear,
  } = useFormManager(
    "commercial_inspection",
    initialCommercialInspectionFormData,
    [],
    "*",
    "form-images",
    id
  );

  const applicantSigRef = useRef(null);
  const officerSigRef = useRef(null);

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      map_latitude: location.lat.toFixed(6),
      map_longitude: location.lng.toFixed(6),
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      front_photo_url: imageUrl,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await handleSubmit(e);
      if (result && result.success) {
        toast.success("บันทึกข้อมูลสำเร็จ");
      } else if (result && !result.success) {
        toast.error("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  // Add transformer management functions
  const handleAddTransformer = () => {
    setFormData((prev) => ({
      ...prev,
      transformers: [...prev.transformers, createInitialTransformer(prev.transformers.length)],
    }));
  };

  const handleRemoveTransformer = (indexToRemove) => {
    if (formData.transformers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        transformers: prev.transformers.filter((_, index) => index !== indexToRemove),
      }));
    }
  };

  const handleTransformerChange = (transformerIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      transformers: prev.transformers.map((transformer, index) =>
        index === transformerIndex ? { ...transformer, [field]: value } : transformer
      ),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5b2d90] mb-4"></div>
        <p className="text-lg text-gray-600">กำลังโหลดข้อมูลฟอร์ม...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <form
        onSubmit={handleFormSubmit}
        className="space-y-8 max-w-4xl mx-auto p-4 md:p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            แบบฟอร์มตรวจสอบระบบไฟฟ้า (สถานประกอบการ/เชิงพาณิชย์)
          </h1>
          <p className="text-gray-600">
            กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง
          </p>
        </div>

        {/* SECTION 1: ข้อมูลทั่วไป */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ข้อมูลทั่วไป</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ฟิลด์ทั่วไป */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รอบที่ตรวจสอบ:
              </label>
              <input
                type="number"
                name="inspection_round"
                value={formData.inspection_round || 1}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่ตรวจสอบ:
              </label>
              <input
                type="date"
                name="inspection_date"
                value={formData.inspection_date || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลขที่คำร้องขอใช้ไฟ:
              </label>
              <input
                type="text"
                name="request_number"
                value={formData.request_number || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรอกเลขที่คำร้อง"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่ในคำร้องขอใช้ไฟ:
              </label>
              <input
                type="date"
                name="request_date"
                value={formData.request_date || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า:
              </label>
              <input
                type="text"
                name="applicant_name"
                value={formData.applicant_name || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                โทรศัพท์:
              </label>
              <input
                type="text"
                name="applicant_phone"
                value={formData.applicant_phone || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="เบอร์โทรศัพท์"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ที่อยู่:
              </label>
              <textarea
                name="applicant_address"
                value={formData.applicant_address || ""}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="ที่อยู่"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: แผนที่และรูปหน้าบ้าน */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🗺️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ตำแหน่งบ้านและรูปถ่าย</h2>
          </div>
          <div className="relative z-0  rounded-lg overflow-hidden">
            <OpenStreetMapComponent 
              onLocationSelect={handleLocationSelect} 
              initialLatitude={formData.map_latitude}
              initialLongitude={formData.map_longitude}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm font-semibold text-gray-700">ละติจูด:</span>
                <div className="font-mono text-gray-700">{formData.map_latitude || 'N/A'}</div>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700">ลองจิจูด:</span>
                <div className="font-mono text-gray-700">{formData.map_longitude || 'N/A'}</div>
              </div>
            </div>
          </div>
          <ImageUpload 
            ref={imageUploadRef}
            onImageSelected={handleImageUpload} 
            disabled={isSubmitting}
            initialImageUrl={formData.front_photo_url}
            label="รูปหน้าบ้าน"
          />
        </section>

        {/* SECTION 3: ระบบไฟฟ้า */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ระบบไฟฟ้า</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                แรงดันไฟฟ้า:
              </label>
              <select
                name="electrical_system"
                value={formData.electrical_system || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">-- เลือกแรงดันไฟฟ้า --</option>
                <option value="22 kV">22 kV</option>
                <option value="33 kV">33 kV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                โหลดโดยประมาณ (แอมป์):
              </label>
              <input
                type="number"
                name="approximate_load_amp"
                value={formData.approximate_load_amp || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                min={0}
                placeholder="กรอกโหลดแอมป์"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                เอกสารรับรองการออกแบบระบบไฟฟ้า:
              </label>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="has_design_certificate"
                    value={true}
                    checked={!!formData.has_design_certificate}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        has_design_certificate: true,
                      }))
                    }
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">
                      มี เอกสารรับรองการออกแบบระบบไฟฟ้า
                    </span>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <div>
                        • วิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรองในแบบติดตั้งระบบไฟฟ้า (As-built Drawing)
                      </div>
                      <div>
                        • สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม
                      </div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="has_design_certificate"
                    value={false}
                    checked={!formData.has_design_certificate}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        has_design_certificate: false,
                      }))
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900">
                    ไม่มี เอกสารรับรองการออกแบบระบบไฟฟ้า
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: เลือกประเภทระบบจำหน่าย */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🔌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">เลือกประเภทระบบจำหน่าย</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="distribution_system_type"
                value="2.1"
                checked={formData.distribution_system_type === "2.1"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <div className="ml-3">
                <span className="text-gray-900 font-medium">2.1 ระบบจำหน่ายเหนือดิน</span>
                <div className="text-sm text-gray-600">(รายการตรวจสอบ 2.1.1 - 2.1.11)</div>
              </div>
            </label>
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="distribution_system_type"
                value="2.2"
                checked={formData.distribution_system_type === "2.2"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <div className="ml-3">
                <span className="text-gray-900 font-medium">2.2 ระบบจำหน่ายใต้ดิน</span>
                <div className="text-sm text-gray-600">(รายการตรวจสอบ 2.2.1 - 2.2.7)</div>
              </div>
            </label>
          </div>
        </section>


        {/* SECTION 5: รายการตรวจสอบ */}
          {formData.distribution_system_type && (
            <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🔎</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
            รายการตรวจสอบ - {formData.distribution_system_type === "2.1" ? "ระบบจำหน่ายเหนือดิน" : "ระบบจำหน่ายใต้ดิน"}
                </h2>
              </div>
              <CorrectiveRadio
                items={initialCommercialInspectionItems.filter(item => 
            formData.distribution_system_type === "2.1" 
              ? item.id.startsWith("2.1")
              : item.id.startsWith("2.2")
                )}
                values={formData.inspection_items}
                onChange={(items) =>
            setFormData((prev) => ({
              ...prev,
              inspection_items: items,
            }))
                }
                disabled={isSubmitting}
              />
            </section>
          )}

          {/* SECTION 5.1: การติดตั้งเครื่องปลดวงจรต้นทาง */}
          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">2.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)</h2>
            </div>
            <div className="mb-6 space-y-4">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
            type="checkbox"
            name="equipment_dropout_fuse"
            checked={formData.equipment_dropout_fuse || false}
            onChange={handleChange}
            className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-gray-900">ดรอพเอาท์ฟิวส์คัตเอาท์</span>
              </label>
              
              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                <label className="flex items-center cursor-pointer mb-2">
            <input
              type="checkbox"
              name="equipment_switch"
              checked={formData.equipment_switch || false}
              onChange={handleChange}
              className="text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="ml-2 text-gray-900">สวิตช์ตัดตอน ชนิด</span>
                </label>
                <input
            type="text"
            name="switch_type"
            value={formData.switch_type || ""}
            onChange={handleChange}
            className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ml-6"
            placeholder="ระบุชนิด"
                />
              </div>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
            type="checkbox"
            name="equipment_rmu"
            checked={formData.equipment_rmu || false}
            onChange={handleChange}
            className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-gray-900">RMU (ไม่รวมถึงฟังก์ชั่นการทำงาน)</span>
              </label>
            </div>
            <CorrectiveRadio
              items={initialCommercialInspectionItems.filter(item => item.id === "2.3")}
              values={formData.inspection_items}
              onChange={(items) =>
                setFormData((prev) => ({
            ...prev,
            inspection_items: items,
                }))
              }
              disabled={isSubmitting}
            />
          </section>

          {/* SECTION 5.2: อื่นๆ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">2.4 อื่นๆ</h2>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียดเพิ่มเติม:
            </label>
            <textarea
              name="other_details"
              value={formData.other_details || ""}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="ระบุรายละเอียดอื่นๆ (ถ้ามี)"
            />
          </div>
        </section>

        {/* SECTION 4.5: หม้อแปลง */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🔧</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">หม้อแปลง</h2>
          </div>

          {formData.transformers && formData.transformers.map((transformer, transformerIndex) => (
            <div key={transformerIndex} className="border border-gray-300 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">หม้อแปลงเครื่องที่ {transformerIndex + 1}</h3>
                {formData.transformers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTransformer(transformerIndex)}
                    className="flex items-center gap-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <span className="text-lg">✕</span>
                    <span className="text-sm">ลบ</span>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* 2.5 คุณสมบัติทั่วไปของหม้อแปลง */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">2.5 คุณสมบัติทั่วไปของหม้อแปลง</h4>

                  <div className="flex items-center gap-4 mb-4">
                    <label className="inline-flex items-center text-gray-700">
                      <input
                        type="radio"
                        name={`general_test_result_${transformerIndex}`}
                        value="ผ่านการทดสอบ"
                        checked={transformer.general_test_result === "ผ่านการทดสอบ"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'general_test_result', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">ผ่านการทดสอบ</span>
                    </label>
                    <label className="inline-flex items-center text-gray-700">
                      <input
                        type="radio"
                        name={`general_test_result_${transformerIndex}`}
                        value="ไม่ผ่านการทดสอบ"
                        checked={transformer.general_test_result === "ไม่ผ่านการทดสอบ"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'general_test_result', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">ไม่ผ่านการทดสอบ</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">หม้อแปลงเครื่องที่:</label>
                      <input
                        type="text"
                        value={transformer.transformer_number || ""}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'transformer_number', e.target.value)}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ขนาด (kVA):</label>
                      <input
                        type="number"
                        value={transformer.capacity_kva || ""}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'capacity_kva', e.target.value)}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">% Impedance:</label>
                      <input
                        type="number"
                        step="0.01"
                        value={transformer.impedance_percent || ""}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'impedance_percent', e.target.value)}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">พิกัดแรงดันด้านแรงสูง (kV):</label>
                      <input
                        type="number"
                        value={transformer.hv_rating_kv || ""}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'hv_rating_kv', e.target.value)}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">พิกัดแรงดันด้านแรงต่ำ (V):</label>
                      <input
                        type="number"
                        value={transformer.lv_rating_v || ""}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'lv_rating_v', e.target.value)}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ชนิด:</label>
                      <div className="flex flex-wrap gap-4 text-gray-700">
                        {["Oil", "Dry", "อื่นๆ"].map((type) => (
                          <label key={type} className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`type_${transformerIndex}`}
                              value={type}
                              checked={transformer.type === type}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'type', e.target.value)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2">{type}</span>
                          </label>
                        ))}
                      </div>
                      {transformer.type === "อื่นๆ" && (
                        <input
                          type="text"
                          value={transformer.type_other || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'type_other', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md mt-2"
                          placeholder="ระบุชนิดอื่นๆ"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vector Group:</label>
                      <input
                        type="text"
                        value={transformer.vector_group || ""}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'vector_group', e.target.value)}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">พิกัดการทนกระแสลัดวงจรสูงสุด (kA):</label>
                    <input
                      type="number"
                      value={transformer.max_short_circuit_ka || ""}
                      onChange={(e) => handleTransformerChange(transformerIndex, 'max_short_circuit_ka', e.target.value)}
                      className="text-gray-700 w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`general_result_${transformerIndex}`}
                        value="ถูกต้อง"
                        checked={transformer.general_result === "ถูกต้อง"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'general_result', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`general_result_${transformerIndex}`}
                        value="ต้องแก้ไข"
                        checked={transformer.general_result === "ต้องแก้ไข"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'general_result', e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                    </label>
                  </div>

                  {transformer.general_result === "ต้องแก้ไข" && (
                    <textarea
                      value={transformer.general_detail || ""}
                      onChange={(e) => handleTransformerChange(transformerIndex, 'general_detail', e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded-md resize-none"
                      placeholder="รายละเอียดการแก้ไข"
                    />
                  )}
                </div>

                {/* 2.6 ลักษณะการติดตั้ง */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">2.6 ลักษณะการติดตั้ง</h4>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-gray-700">
                    {["แขวน", "นั่งร้าน", "ตั้งพื้น", "ตั้งบนดาดฟ้า", "ห้องหม้อแปลง", "อื่นๆ"].map((type) => (
                      <label key={type} className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`installation_type_${transformerIndex}`}
                          value={type}
                          checked={transformer.installation_type === type}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'installation_type', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">{type}</span>
                      </label>
                    ))}
                  </div>

                  {transformer.installation_type === "อื่นๆ" && (
                    <input
                      type="text"
                      value={transformer.installation_other || ""}
                      onChange={(e) => handleTransformerChange(transformerIndex, 'installation_other', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-700"
                      placeholder="ระบุประเภทการติดตั้งอื่นๆ"
                    />
                  )}

                  <div className="flex items-center gap-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`installation_result_${transformerIndex}`}
                        value="ถูกต้อง"
                        checked={transformer.installation_result === "ถูกต้อง"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'installation_result', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`installation_result_${transformerIndex}`}
                        value="ต้องแก้ไข"
                        checked={transformer.installation_result === "ต้องแก้ไข"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'installation_result', e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                    </label>
                  </div>

                  {transformer.installation_result === "ต้องแก้ไข" && (
                    <textarea
                      value={transformer.installation_detail || ""}
                      onChange={(e) => handleTransformerChange(transformerIndex, 'installation_detail', e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded-md resize-none"
                      placeholder="รายละเอียดการแก้ไข"
                    />
                  )}
                </div>

                {/* 2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ชนิด:</label>
                      <div className="space-y-2 text-gray-700">
                        {["ดรอพเอาท์ฟิวส์คัตเอาท์", "เซอร์กิตเบรกเกอร์", "อื่นๆ"].map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="radio"
                              name={`protection_type_${transformerIndex}`}
                              value={type}
                              checked={transformer.protection_type === type}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'protection_type', e.target.value)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2">{type}</span>
                          </label>
                        ))}
                      </div>
                      {transformer.protection_type === "อื่นๆ" && (
                        <input
                          type="text"
                          value={transformer.protection_other || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'protection_other', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md mt-2 text-gray-700"
                          placeholder="ระบุชนิดอื่นๆ"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm text-gray-600">พิกัดกระแสต่อเนื่อง (A):</label>
                        <input
                          type="number"
                          value={transformer.continuous_current_a || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'continuous_current_a', e.target.value)}
                          className="text-gray-700 w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">พิกัดตัดกระแสลัดวงจรสูงสุด (IC) (kA):</label>
                        <input
                          type="number"
                          value={transformer.interrupting_capacity_ka || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'interrupting_capacity_ka', e.target.value)}
                          className="text-gray-700 w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`protection_result_${transformerIndex}`}
                        value="ถูกต้อง"
                        checked={transformer.protection_result === "ถูกต้อง"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'protection_result', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`protection_result_${transformerIndex}`}
                        value="ต้องแก้ไข"
                        checked={transformer.protection_result === "ต้องแก้ไข"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'protection_result', e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                    </label>
                  </div>

                  {transformer.protection_result === "ต้องแก้ไข" && (
                    <textarea
                      value={transformer.protection_detail || ""}
                      onChange={(e) => handleTransformerChange(transformerIndex, 'protection_detail', e.target.value)}
                      rows={2}
                      className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none"
                      placeholder="รายละเอียดการแก้ไข"
                    />
                  )}
                </div>

                {/* 2.8 การติดตั้งกับดักเสิร์จแรงสูง */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">2.8 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">พิกัดแรงดัน (kV):</label>
                      <input
                        type="number"
                        value={transformer.surge_arrester_voltage_kv || ""}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'surge_arrester_voltage_kv', e.target.value)}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">พิกัดกระแส (kA):</label>
                      <input
                        type="number"
                        value={transformer.surge_arrester_current_ka || ""}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'surge_arrester_current_ka', e.target.value)}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`surge_arrester_result_${transformerIndex}`}
                        value="ถูกต้อง"
                        checked={transformer.surge_arrester_result === "ถูกต้อง"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'surge_arrester_result', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`surge_arrester_result_${transformerIndex}`}
                        value="ต้องแก้ไข"
                        checked={transformer.surge_arrester_result === "ต้องแก้ไข"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'surge_arrester_result', e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                    </label>
                  </div>
                  
                  {transformer.surge_arrester_result === "ต้องแก้ไข" && (
                    <textarea
                      value={transformer.surge_arrester_detail || ""}
                      onChange={(e) => handleTransformerChange(transformerIndex, 'surge_arrester_detail', e.target.value)}
                      rows={2}
                      className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none"
                      placeholder="รายละเอียดการแก้ไข"
                    />
                  )}
                </div>

                {/* 2.9 การประกอบสายดินกับตัวถังหม้อแปลง */}
                <div className="border-l-4 border-pink-500 pl-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">2.9 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง</h4>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`grounding_result_${transformerIndex}`}
                        value="ถูกต้อง"
                        checked={transformer.grounding_result === "ถูกต้อง"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'grounding_result', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`grounding_result_${transformerIndex}`}
                        value="ต้องแก้ไข"
                        checked={transformer.grounding_result === "ต้องแก้ไข"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'grounding_result', e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                    </label>
                  </div>
                  
                  {transformer.grounding_result === "ต้องแก้ไข" && (
                    <textarea
                      value={transformer.grounding_detail || ""}
                      onChange={(e) => handleTransformerChange(transformerIndex, 'grounding_detail', e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded-md resize-none"
                      placeholder="รายละเอียดการแก้ไข"
                    />
                  )}
                </div>

                {/* 2.10 ค่าความต้านทานดินของระบบแรงสูง */}
                <div className="border-l-4 border-gray-500 pl-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">2.10 ค่าความต้านทานดินของระบบแรงสูง</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ค่าความต้านทานดิน (โอห์ม):</label>
                      <input
                        type="number"
                        value={transformer.hv_ground_resistance || ""}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'hv_ground_resistance', e.target.value)}
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`hv_ground_result_${transformerIndex}`}
                        value="ถูกต้อง"
                        checked={transformer.hv_ground_result === "ถูกต้อง"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'hv_ground_result', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`hv_ground_result_${transformerIndex}`}
                        value="ต้องแก้ไข"
                        checked={transformer.hv_ground_result === "ต้องแก้ไข"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'hv_ground_result', e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                    </label>
                  </div>
                  
                  {transformer.hv_ground_result === "ต้องแก้ไข" && (
                    <textarea
                      value={transformer.hv_ground_detail || ""}
                      onChange={(e) => handleTransformerChange(transformerIndex, 'hv_ground_detail', e.target.value)}
                      rows={2}
                      className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none"
                      placeholder="รายละเอียดการแก้ไข"
                    />
                  )}
                </div>

                {/* 2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน) */}
                {transformer.type === "Oil" && (
                  <div className="border-l-4 border-teal-500 pl-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">2.11.1 สารดูดความชื้น:</label>
                        <div className="flex items-center gap-4 mb-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`moisture_absorber_result_${transformerIndex}`}
                              value="ถูกต้อง"
                              checked={transformer.moisture_absorber_result === "ถูกต้อง"}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'moisture_absorber_result', e.target.value)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-green-700">ถูกต้อง</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`moisture_absorber_result_${transformerIndex}`}
                              value="ต้องแก้ไข"
                              checked={transformer.moisture_absorber_result === "ต้องแก้ไข"}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'moisture_absorber_result', e.target.value)}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                          </label>
                        </div>
                        {transformer.moisture_absorber_result === "ต้องแก้ไข" && (
                          <textarea
                            value={transformer.moisture_absorber_detail || ""}
                            onChange={(e) => handleTransformerChange(transformerIndex, 'moisture_absorber_detail', e.target.value)}
                            rows={2}
                            className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none"
                            placeholder="รายละเอียดการแก้ไข"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">2.11.2 สภาพบุชชิ่ง:</label>
                        <div className="flex items-center gap-4 mb-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`bushing_condition_result_${transformerIndex}`}
                              value="ถูกต้อง"
                              checked={transformer.bushing_condition_result === "ถูกต้อง"}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'bushing_condition_result', e.target.value)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-green-700">ถูกต้อง</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`bushing_condition_result_${transformerIndex}`}
                              value="ต้องแก้ไข"
                              checked={transformer.bushing_condition_result === "ต้องแก้ไข"}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'bushing_condition_result', e.target.value)}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                          </label>
                        </div>
                        {transformer.bushing_condition_result === "ต้องแก้ไข" && (
                          <textarea
                            value={transformer.bushing_condition_detail || ""}
                            onChange={(e) => handleTransformerChange(transformerIndex, 'bushing_condition_detail', e.target.value)}
                            rows={2}
                            className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none"
                            placeholder="รายละเอียดการแก้ไข"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">2.11.3 ระดับน้ำมัน:</label>
                        <div className="flex items-center gap-4 mb-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`oil_level_result_${transformerIndex}`}
                              value="ถูกต้อง"
                              checked={transformer.oil_level_result === "ถูกต้อง"}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'oil_level_result', e.target.value)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-green-700">ถูกต้อง</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`oil_level_result_${transformerIndex}`}
                              value="ต้องแก้ไข"
                              checked={transformer.oil_level_result === "ต้องแก้ไข"}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'oil_level_result', e.target.value)}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                          </label>
                        </div>
                        {transformer.oil_level_result === "ต้องแก้ไข" && (
                          <textarea
                            value={transformer.oil_level_detail || ""}
                            onChange={(e) => handleTransformerChange(transformerIndex, 'oil_level_detail', e.target.value)}
                            rows={2}
                            className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none"
                            placeholder="รายละเอียดการแก้ไข"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">2.11.4 การรั่วซึมของน้ำมันหม้อแปลง:</label>
                        <div className="flex items-center gap-4 mb-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`oil_leakage_result_${transformerIndex}`}
                              value="ถูกต้อง"
                              checked={transformer.oil_leakage_result === "ถูกต้อง"}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'oil_leakage_result', e.target.value)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-green-700">ถูกต้อง</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`oil_leakage_result_${transformerIndex}`}
                              value="ต้องแก้ไข"
                              checked={transformer.oil_leakage_result === "ต้องแก้ไข"}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'oil_leakage_result', e.target.value)}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                          </label>
                        </div>
                        {transformer.oil_leakage_result === "ต้องแก้ไข" && (
                          <textarea
                            value={transformer.oil_leakage_detail || ""}
                            onChange={(e) => handleTransformerChange(transformerIndex, 'oil_leakage_detail', e.target.value)}
                            rows={2}
                            className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none"
                            placeholder="รายละเอียดการแก้ไข"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2.12 ป้ายเตือน */}
                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">2.12 ป้ายเตือน</h4>
                  <p className="text-sm text-gray-600 mb-3">"อันตรายไฟฟ้าแรงสูง เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น"</p>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`warning_sign_result_${transformerIndex}`}
                        value="ถูกต้อง"
                        checked={transformer.warning_sign_result === "ถูกต้อง"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'warning_sign_result', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-green-700">ถูกต้อง</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`warning_sign_result_${transformerIndex}`}
                        value="ต้องแก้ไข"
                        checked={transformer.warning_sign_result === "ต้องแก้ไข"}
                        onChange={(e) => handleTransformerChange(transformerIndex, 'warning_sign_result', e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-red-700">ต้องแก้ไข</span>
                    </label>
                  </div>
                  
                  {transformer.warning_sign_result === "ต้องแก้ไข" && (
                    <textarea
                      value={transformer.warning_sign_detail || ""}
                      onChange={(e) => handleTransformerChange(transformerIndex, 'warning_sign_detail', e.target.value)}
                      rows={2}
                      className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none"
                      placeholder="รายละเอียดการแก้ไข"
                    />
                  )}
                </div>

                {/* 2.13 อื่นๆ */}
                <div className="border-l-4 border-red-300 pl-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">2.13 อื่นๆ</h4>
                  
                  <textarea
                    value={transformer.other_notes || ""}
                    onChange={(e) => handleTransformerChange(transformerIndex, 'other_notes', e.target.value)}
                    rows={3}
                    className="text-gray-700 w-full p-2 border border-gray-300 rounded-md resize-none"
                    placeholder="หมายเหตุเพิ่มเติม"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Transformer Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAddTransformer}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                <span className="text-xl">+</span>
                <span>เพิ่มหม้อแปลง</span>
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">
                จำนวนหม้อแปลงทั้งหมด: {formData.transformers.length} เครื่อง
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 6: สรุปผลการตรวจสอบ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">✔️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ผลการตรวจสอบ</h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              "ติดตั้งมิเตอร์ถาวร",
              "ติดตั้งมิเตอร์ชั่วคราว",
              "ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์",
            ].map((opt) => (
              <label
                key={opt}
                className="inline-flex items-center text-gray-900"
              >
                <input
                  type="radio"
                  name="inspection_result"
                  value={opt}
                  checked={formData.inspection_result === opt}
                  onChange={handleChange}
                  className="form-radio text-[#5b2d90] focus:ring-2 focus:ring-purple-400 h-5 w-5"
                />
                <span className="ml-2">{opt}</span>
              </label>
            ))}
          </div>
        </section>

        {/* SECTION 7: ขอบเขตและข้อจำกัดในการตรวจสอบ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              ขอบเขตและข้อจำกัดในการตรวจสอบ
            </h2>
          </div>
          <textarea
            name="inspection_scope"
            value={formData.inspection_scope || ""}
            onChange={handleChange}
            rows="4"
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-gray-400 focus:ring-4 focus:ring-gray-100 text-gray-900 shadow-sm resize-none"
            placeholder="ระบุขอบเขต/ข้อจำกัด (ถ้ามี)"
          />
        </section>

        {/* SECTION 8: ลายเซ็น */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">✍️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ลายเซ็นรับรอง</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้ขอใช้ไฟฟ้า:
                </label>
                <input
                  type="text"
                  name="applicant_signature_name"
                  value={formData.applicant_signature_name || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ชื่อ-นามสกุล"
                />
              </div>
              <SignaturePad
                title="ลงชื่อผู้ขอใช้ไฟฟ้า"
                ref={applicantSigRef}
                onSave={(dataUrl) =>
                  handleSignatureSave("applicant_signature", dataUrl)
                }
                onClear={() => handleSignatureClear("applicant_signature")}
                initialValue={formData.applicant_signature}
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อเจ้าหน้าที่ผู้ตรวจสอบ:
                </label>
                <input
                  type="text"
                  name="officer_signature_name"
                  value={formData.officer_signature_name || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ชื่อ-นามสกุล"
                />
              </div>
              <SignaturePad
                title="ลงชื่อเจ้าหน้าที่ผู้ตรวจสอบ"
                ref={officerSigRef}
                onSave={(dataUrl) =>
                  handleSignatureSave("officer_signature", dataUrl)
                }
                onClear={() => handleSignatureClear("officer_signature")}
                initialValue={formData.officer_signature}
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
          <PDFDownloadLink
            document={<OtherInspectionPDF formData={formData} />}
            fileName={`other-inspection-form-${formData.request_number || "form"}.pdf`}
            className="w-full sm:w-auto"
          >
            {({ loading }) => (
              <button
                type="button"
                disabled={loading || isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-5 h-5" />
                {loading ? "กำลังสร้าง..." : "ดาวน์โหลด PDF"}
              </button>
            )}
          </PDFDownloadLink>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>บันทึกข้อมูล</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
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

export default function CommercialInspectionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingFallback />}>
        <CommercialInspectionFormContent />
      </Suspense>
    </div>
  );
}