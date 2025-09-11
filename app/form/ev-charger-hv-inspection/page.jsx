"use client";

import React, { useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import SignaturePad from "@/components/forms/SignaturePad";
import ImageUpload from "@/components/forms/ImageUpload";
import { PDFDownloadLink } from "@react-pdf/renderer";
import EVChargerHVInspectionPDF from "@/components/pdf/EVChargerHVInspectionPDF";
import { Download, Save } from "lucide-react";
import { useFormManager } from "@/lib/hooks/useFormManager";
import CorrectiveRadio from "@/components/forms/CorrectiveRadio";
import SubCircuitSection from "@/components/forms/SubCircuitSection";
import initialEvChargerHVInspectionItems3 from "@/lib/constants/initialEvChargerHVInspectionItems3";
import initialEvChargerHVPanelBoardItems from "@/lib/constants/initialEvChargerHVPanelBoardItems";
import RadioEV from "@/components/forms/RadioEV";

// Dynamic import for OpenStreetMapComponent
const OpenStreetMapComponent = dynamic(
  () => import("@/components/forms/OpenStreetMapComponent"),
  { ssr: false }
);

// Helper functions for creating initial objects
function createInitialTransformer(index) {
  return {
    id: index,
    transformer_number: "",
    capacity_kva: "",
    impedance_percent: "",
    general_test_result: "",
    general_result: "",
    general_detail: "",
    lv_conductor_standard: "",
    lv_conductor_standard_result: "",
    lv_conductor_standard_detail: "",
    lv_conductor_type: "",
    lv_conductor_type_other: "",
    lv_conductor_size: "",
    lv_neutral_size: "",
    lv_result: "",
    lv_detail: "",
    show_panel_boards: false,
    panel_boards: [createInitialPanelBoard(0)]
  };
}

function createInitialPanelBoard(index) {
  return {
    id: index,
    panel_name: "",
    panel_location: "",
    inspection_items: [],
    sub_circuits: [createInitialSubCircuit(0)]
  };
}

function createInitialSubCircuit(index) {
  return {
    id: index,
    circuit_name: "",
    circuit_type: "",
    circuit_breaker_at: "",
    result: "",
    detail: "",
    chargers: []
  };
}

function createInitialCharger(index) {
  return {
    id: index,
    charger_brand: "",
    charger_model: "",
    charger_power_kw: "",
    charger_type: "",
    result: "",
    detail: ""
  };
}

const initialEvChargerHVInspectionFormData = {
  id: null,
  user_id: null,
  inspection_round: "",
  inspection_date: new Date().toISOString().split("T")[0],
  request_number: "",
  request_date: "",
  utility_name: "",
  applicant_name: "",
  applicant_phone: "",
  corporate_name: "",
  corporate_phone: "",
  address: "",
  front_photo_url: "",
  electrical_system: "",
  approximate_load_amp: "",
  charger_count: "",
  total_charger_kw: "",
  map_latitude: null,
  map_longitude: null,
  document_specification: false,
  document_single_line: false,
  document_load_schedule: false,
  document_complete: "",
  document_incomplete_detail: "",
  document_public_single_line: false,
  document_public_as_built: false,
  document_public_load_schedule: false,
  document_public_license_copy: false,
  document_public_specification: false,
  document_public_energy_license: false,
  document_public_complete: "",
  document_public_incomplete_detail: "",
  distribution_system_type: "",
  inspection_items: initialEvChargerHVInspectionItems3,
  transformers: [createInitialTransformer(0)],
  applicant_signature: "",
  applicant_signature_name: "",
  officer_signature: "",
  officer_signature_name: "",
  created_at: new Date().toISOString(),
};

function EVChargerHVInspectionFormContent() {
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
    "ev_charger_hv_inspection",
    initialEvChargerHVInspectionFormData,
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

  // Transformer management functions
  const handleAddTransformer = () => {
    setFormData(prev => ({
      ...prev,
      transformers: [...prev.transformers, createInitialTransformer(prev.transformers.length)]
    }));
  };

  const handleRemoveTransformer = (transformerIndex) => {
    if (formData.transformers.length > 1) {
      setFormData(prev => ({
        ...prev,
        transformers: prev.transformers.filter((_, index) => index !== transformerIndex)
      }));
    }
  };

  const handleTransformerChange = (transformerIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      transformers: prev.transformers.map((transformer, index) => 
        index === transformerIndex ? { ...transformer, [field]: value } : transformer
      )
    }));
  };

  // Sub Circuit management functions
  const handleAddSubCircuit = (transformerIndex, panelIndex) => {
    setFormData(prev => ({
      ...prev,
      transformers: prev.transformers.map((transformer, tIndex) => 
        tIndex === transformerIndex 
          ? { 
              ...transformer, 
              panel_boards: transformer.panel_boards.map((panel, pIndex) =>
                pIndex === panelIndex 
                  ? { 
                      ...panel, 
                      sub_circuits: [...(panel.sub_circuits || []), createInitialSubCircuit((panel.sub_circuits || []).length)]
                    }
                  : panel
              )
            }
          : transformer
      )
    }));
  };

  const handleRemoveSubCircuit = (transformerIndex, panelIndex, circuitIndex) => {
    setFormData(prev => ({
      ...prev,
      transformers: prev.transformers.map((transformer, tIndex) => 
        tIndex === transformerIndex 
          ? { 
              ...transformer, 
              panel_boards: transformer.panel_boards.map((panel, pIndex) =>
                pIndex === panelIndex 
                  ? { 
                      ...panel, 
                      sub_circuits: (panel.sub_circuits || []).filter((_, cIndex) => cIndex !== circuitIndex)
                    }
                  : panel
              )
            }
          : transformer
      )
    }));
  };

  const handleSubCircuitChange = (transformerIndex, panelIndex, circuitIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      transformers: prev.transformers.map((transformer, tIndex) => 
        tIndex === transformerIndex 
          ? { 
              ...transformer, 
              panel_boards: transformer.panel_boards.map((panel, pIndex) =>
                pIndex === panelIndex 
                  ? { 
                      ...panel, 
                      sub_circuits: (panel.sub_circuits || []).map((circuit, cIndex) =>
                        cIndex === circuitIndex ? { ...circuit, [field]: value } : circuit
                      )
                    }
                  : panel
              )
            }
          : transformer
      )
    }));
  };

  // Charger management functions
  const handleAddCharger = (transformerIndex, panelIndex, circuitIndex) => {
    setFormData(prev => ({
      ...prev,
      transformers: prev.transformers.map((transformer, tIndex) => 
        tIndex === transformerIndex 
          ? { 
              ...transformer, 
              panel_boards: transformer.panel_boards.map((panel, pIndex) =>
                pIndex === panelIndex 
                  ? { 
                      ...panel, 
                      sub_circuits: (panel.sub_circuits || []).map((circuit, cIndex) =>
                        cIndex === circuitIndex 
                          ? { 
                              ...circuit, 
                              chargers: [...(circuit.chargers || []), createInitialCharger((circuit.chargers || []).length)]
                            }
                          : circuit
                      )
                    }
                  : panel
              )
            }
          : transformer
      )
    }));
  };

  const handleRemoveCharger = (transformerIndex, panelIndex, circuitIndex, chargerIndex) => {
    setFormData(prev => ({
      ...prev,
      transformers: prev.transformers.map((transformer, tIndex) => 
        tIndex === transformerIndex 
          ? { 
              ...transformer, 
              panel_boards: transformer.panel_boards.map((panel, pIndex) =>
                pIndex === panelIndex 
                  ? { 
                      ...panel, 
                      sub_circuits: (panel.sub_circuits || []).map((circuit, cIndex) =>
                        cIndex === circuitIndex 
                          ? { 
                              ...circuit, 
                              chargers: (circuit.chargers || []).filter((_, chIndex) => chIndex !== chargerIndex)
                            }
                          : circuit
                      )
                    }
                  : panel
              )
            }
          : transformer
      )
    }));
  };

  const handleChargerChange = (transformerIndex, panelIndex, circuitIndex, chargerIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      transformers: prev.transformers.map((transformer, tIndex) => 
        tIndex === transformerIndex 
          ? { 
              ...transformer, 
              panel_boards: transformer.panel_boards.map((panel, pIndex) =>
                pIndex === panelIndex 
                  ? { 
                      ...panel, 
                      sub_circuits: (panel.sub_circuits || []).map((circuit, cIndex) =>
                        cIndex === circuitIndex 
                          ? { 
                              ...circuit, 
                              chargers: (circuit.chargers || []).map((charger, chIndex) =>
                                chIndex === chargerIndex ? { ...charger, [field]: value } : charger
                              )
                            }
                          : circuit
                      )
                    }
                  : panel
              )
            }
          : transformer
      )
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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mb-4"></div>
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
        {/* ส่วนหัวฟอร์ม */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            แบบฟอร์มตรวจสอบระบบอัดประจุยานยนต์ไฟฟ้า (แรงต่ำ)
          </h1>
          <p className="text-gray-600">
            สำหรับกรณีรับไฟฟ้าแรงต่ำจากหม้อแปลงจำหน่ายของ PEA
          </p>
        </div>

        {/* ข้อมูลทั่วไป */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  การไฟฟ้า
                </label>
                <input
                  type="text"
                  name="utility_name"
                  value={formData.utility_name || ""}
                  onChange={handleChange}
                  className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                  placeholder="ชื่อการไฟฟ้า"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  การตรวจสอบครั้งที่
                </label>
                <input
                  type="number"
                  name="inspection_round"
                  value={formData.inspection_round || ""}
                  onChange={handleChange}
                  className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  วันที่ตรวจสอบ
                </label>
                <input
                  type="date"
                  name="inspection_date"
                  value={formData.inspection_date || ""}
                  onChange={handleChange}
                  className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เลขที่คำร้องขอใช้ไฟ
              </label>
              <input
                type="text"
                name="request_number"
                value={formData.request_number || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่คำร้องขอใช้ไฟ
              </label>
              <input
                type="date"
                name="request_date"
                value={formData.request_date || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </section>

        {/* ข้อมูลผู้ขอใช้ไฟ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            1. ข้อมูลทั่วไป
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ-นามสกุล ผู้ขอใช้ไฟฟ้า
              </label>
              <input
                type="text"
                name="applicant_name"
                value={formData.applicant_name || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                โทรศัพท์
              </label>
              <input
                type="text"
                name="applicant_phone"
                value={formData.applicant_phone || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                placeholder="เบอร์โทรศัพท์"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อนิติบุคคลที่ขอใช้ไฟฟ้า
              </label>
              <input
                type="text"
                name="corporate_name"
                value={formData.corporate_name || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                placeholder="ชื่อบริษัท/องค์กร"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                โทรศัพท์ (นิติบุคคล)
              </label>
              <input
                type="text"
                name="corporate_phone"
                value={formData.corporate_phone || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                placeholder="เบอร์โทรศัพท์"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่
              </label>
              <textarea
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                rows={3}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md resize-none"
                placeholder="ที่อยู่"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ระบบไฟฟ้า
              </label>
              <select
                name="electrical_system"
                value={formData.electrical_system || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">-- เลือก --</option>
                <option value="3 เฟส">3 เฟส (400/230V)</option>
                <option value="1 เฟส">1 เฟส (230V)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                กระแสโหลดรวมโดยประมาณ (A)
              </label>
              <input
                type="number"
                name="approximate_load_amp"
                value={formData.approximate_load_amp || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                min={0}
                placeholder="แอมแปร์"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จำนวนเครื่องอัดประจุยานยนต์ไฟฟ้า
              </label>
              <input
                type="number"
                name="charger_count"
                value={formData.charger_count || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                min={1}
                placeholder="จำนวนเครื่อง"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                พิกัดกำลังไฟฟ้ารวมของเครื่องอัดประจุ (kW)
              </label>
              <input
                type="number"
                name="total_charger_kw"
                value={formData.total_charger_kw || ""}
                onChange={handleChange}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                min={0}
                placeholder="กำลังไฟฟ้ารวม (kW)"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: แผนที่และรูปหน้าบ้าน */}
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

        {/* ส่วนที่ 5: เอกสารประกอบการตรวจสอบ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-indigo-600">
            2. เอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
          </h2>

          {/* เลือกประเภทการใช้งาน */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">เลือกประเภทการใช้งาน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.document_type === "private" 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-300 bg-white hover:border-green-300"
              }`}>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="document_type"
                    value="private"
                    checked={formData.document_type === "private"}
                    onChange={handleChange}
                    className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">2.1 พื้นที่ส่วนบุคคล</span>
                    <p className="text-sm text-gray-600 mt-1">
                      บ้านอยู่อาศัย กิจการขนาดเล็ก หรืออาคารที่คล้ายคลึงกัน
                    </p>
                  </div>
                </label>
              </div>
              
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.document_type === "public" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-300 bg-white hover:border-blue-300"
              }`}>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="document_type"
                    value="public"
                    checked={formData.document_type === "public"}
                    onChange={handleChange}
                    className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">2.2 พื้นที่สาธารณะ</span>
                    <p className="text-sm text-gray-600 mt-1">
                      สถานีอัดประจุยานยนต์ไฟฟ้า ห้างสรรพสินค้า โรงแรม อาคารชุด ร้านอาหาร ร้านค้า ร้านสะดวกซื้อ ธุรกิจให้เช่าที่จอดรถ ถนนสาธารณะ หรืออาคารที่คล้ายคลึงกัน
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* กรณีพื้นที่ส่วนบุคคล (2.1) */}
          {formData.document_type === "private" && (
            <div className="border-l-4 border-green-500 pl-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
          2.1 เอกสารสำหรับพื้นที่ส่วนบุคคล
              </h3>
              <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="document_specification"
              checked={formData.document_specification || false}
              onChange={handleChange}
              className="mr-3"
            />
            <span className="text-gray-700">
              สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า 
              ที่แสดงรายละเอียดข้อมูลทั่วไปและอุปกรณ์ป้องกันต่างๆ
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="document_single_line"
              checked={formData.document_single_line || false}
              onChange={handleChange}
              className="mr-3"
            />
            <span className="text-gray-700">แผนผังระบบไฟฟ้า (Single Line Diagram)</span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="document_load_schedule"
              checked={formData.document_load_schedule || false}
              onChange={handleChange}
              className="mr-3"
            />
            <span className="text-gray-700">ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า</span>
          </div>
              </div>

              <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สถานะความครบถ้วนของเอกสาร
          </label>
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="document_complete"
                value="ครบถ้วน"
                checked={formData.document_complete === "ครบถ้วน"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">ครบถ้วน</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="document_complete"
                value="ไม่ครบถ้วน"
                checked={formData.document_complete === "ไม่ครบถ้วน"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">ไม่ครบถ้วน</span>
            </label>
          </div>
          {formData.document_complete === "ไม่ครบถ้วน" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ระบุรายละเอียดที่ไม่ครบถ้วน
              </label>
              <textarea
                name="document_incomplete_detail"
                value={formData.document_incomplete_detail || ""}
                onChange={handleChange}
                rows={3}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md resize-none"
                placeholder="ระบุรายละเอียด..."
              />
            </div>
          )}
          <div className="mt-4">
            <CorrectiveRadio
              name="document_complete_result"
              value={formData.document_complete_result || ""}
              onChange={handleChange}
            />
          </div>
              </div>
            </div>
          )}

          {/* กรณีพื้นที่สาธารณะ (2.2) */}
          {formData.document_type === "public" && (
            <div className="border-l-4 border-blue-500 pl-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
          2.2 เอกสารสำหรับพื้นที่สาธารณะ
              </h3>
              <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              name="document_public_single_line"
              checked={formData.document_public_single_line || false}
              onChange={handleChange}
              className="mr-3 mt-1"
            />
            <span className="text-gray-700">
              แผนผังระบบไฟฟ้า (Single Line Diagram) ระบุพิกัดของอุปกรณ์ต่างๆ วิธีการเดินสาย 
              รายละเอียดท่อร้อยสาย รวมถึงระบบต่อลงดิน อย่างครบถ้วน โดยมีวิศวกรที่ได้รับใบอนุญาต
              ประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง
            </span>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              name="document_public_as_built"
              checked={formData.document_public_as_built || false}
              onChange={handleChange}
              className="mr-3 mt-1"
            />
            <span className="text-gray-700">
              แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่มีวิศวกรที่ได้รับใบอนุญาต
              ประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง
            </span>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              name="document_public_load_schedule"
              checked={formData.document_public_load_schedule || false}
              onChange={handleChange}
              className="mr-3 mt-1"
            />
            <span className="text-gray-700">
              ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า ที่มีวิศวกรที่ได้รับใบอนุญาต
              ประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง
            </span>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              name="document_public_license_copy"
              checked={formData.document_public_license_copy || false}
              onChange={handleChange}
              className="mr-3 mt-1"
            />
            <span className="text-gray-700">สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรมไฟฟ้า</span>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              name="document_public_specification"
              checked={formData.document_public_specification || false}
              onChange={handleChange}
              className="mr-3 mt-1"
            />
            <span className="text-gray-700">
              สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า 
              ที่แสดงรายละเอียดข้อมูลทั่วไปและอุปกรณ์ป้องกันต่างๆ
            </span>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              name="document_public_energy_license"
              checked={formData.document_public_energy_license || false}
              onChange={handleChange}
              className="mr-3 mt-1"
            />
            <span className="text-gray-700">
              หนังสือจดแจ้ง (พิกัดน้อยกว่า 1,000 kVA) หรือใบอนุญาต (พิกัดตั้งแต่ 1,000 kVA ขึ้นไป) 
              เพื่อประกอบกิจการสถานีอัดประจุยานยนต์ไฟฟ้าจากสำนักงานกำกับกิจการพลังงาน (สกพ.)
            </span>
          </div>
              </div>

              <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สถานะความครบถ้วนของเอกสาร
          </label>
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="document_public_complete"
                value="ครบถ้วน"
                checked={formData.document_public_complete === "ครบถ้วน"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">ครบถ้วน</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="document_public_complete"
                value="ไม่ครบถ้วน"
                checked={formData.document_public_complete === "ไม่ครบถ้วน"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">ไม่ครบถ้วน</span>
            </label>
          </div>
          {formData.document_public_complete === "ไม่ครบถ้วน" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ระบุรายละเอียดที่ไม่ครบถ้วน
              </label>
              <textarea
                name="document_public_incomplete_detail"
                value={formData.document_public_incomplete_detail || ""}
                onChange={handleChange}
                rows={5}
                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md resize-none"
                placeholder="ระบุรายละเอียด..."
              />
            </div>
          )}
          <div className="mt-4">
            <CorrectiveRadio
              name="document_public_complete_result"
              value={formData.document_public_complete_result || ""}
              onChange={handleChange}
            />
          </div>
              </div>
            </div>
          )}
        </section>

        {/* แบบมาตรฐานอ้างอิง */}
        <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">การตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าอ้างอิงแบบมาตรฐาน ดังนี้</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>ก) แบบมาตรฐาน "ข้อกำหนดทั่วไปสำหรับการติดตั้งทางไฟฟ้า ระบบอัดประจุยานยนต์ไฟฟ้า" (การประกอบเลขที่ 9807)</p>
                <p>ข) แบบมาตรฐาน "การติดตั้งทางไฟฟ้าการอัดประจุยานยนต์ไฟฟ้าระบบ 1 เฟส สำหรับผู้ใช้ไฟประเภทที่อยู่อาศัยและธุรกิจขนาดเล็ก" (การประกอบเลขที่ 0901)</p>
                <p>ค) แบบมาตรฐาน "การติดตั้งทางไฟฟ้าการอัดประจุยานยนต์ไฟฟ้าระบบ 3 เฟส สำหรับผู้ใช้ไฟประเภทที่อยู่อาศัยและธุรกิจขนาดเล็ก" (การประกอบเลขที่ 0902)</p>
                <p>ง) แบบมาตรฐาน "การติดตั้งทางไฟฟ้าสถานีอัดประจุยานยนต์ไฟฟ้า สำหรับสถานประกอบการ" (การประกอบเลขที่ 0903)</p>
                <p>จ) มาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับล่าสุด)</p>
                <p className="font-medium">* ดาวน์โหลดแบบมาตรฐานและข้อมูลที่เกี่ยวข้องที่ลิงค์หรือ QR Code นี้ <a href="https://qrgo.page.link/ijtvD" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://qrgo.page.link/ijtvD</a></p>
              </div>
            </div>

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
                value="3.1"
                checked={formData.distribution_system_type === "3.1"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <div className="ml-3">
                <span className="text-gray-900 font-medium">3.1 ระบบจำหน่ายเหนือดิน</span>
                <div className="text-sm text-gray-600">(รายการตรวจสอบ 3.1.1 - 3.1.11)</div>
              </div>
            </label>
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="distribution_system_type"
                value="3.2"
                checked={formData.distribution_system_type === "3.2"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <div className="ml-3">
                <span className="text-gray-900 font-medium">3.2 ระบบจำหน่ายใต้ดิน</span>
                <div className="text-sm text-gray-600">(รายการตรวจสอบ 3.2.1 - 3.2.7)</div>
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
            รายการตรวจสอบ - {formData.distribution_system_type === "3.1" ? "ระบบจำหน่ายเหนือดิน" : "ระบบจำหน่ายใต้ดิน"}
                </h2>
              </div>
              {(() => {
                const filteredItems = initialEvChargerHVInspectionItems3.filter(item => 
                  formData.distribution_system_type === "3.1" 
                    ? item.id.startsWith("3.1")
                    : item.id.startsWith("3.2")
                );

                const filteredValues = filteredItems.map(item => {
                  return (formData.inspection_items || []).find(v => v.id === item.id) || { id: item.id };
                });

                return (
                  <CorrectiveRadio
                    items={filteredItems}
                    values={filteredValues}
                    onChange={(updatedItems) => {
                      setFormData(prev => {
                        const existingItems = prev.inspection_items || [];
                        const updatedInspectionItems = [...existingItems];
                        
                        // Update or add each item from updatedItems
                        updatedItems.forEach(updatedItem => {
                          const existingIndex = updatedInspectionItems.findIndex(item => item.id === updatedItem.id);
                          if (existingIndex >= 0) {
                            updatedInspectionItems[existingIndex] = updatedItem;
                          } else {
                            updatedInspectionItems.push(updatedItem);
                          }
                        });
                        
                        return {
                          ...prev,
                          inspection_items: updatedInspectionItems,
                        };
                      });
                    }}
                    disabled={isSubmitting}
                  />
                );
              })()}
            </section>
          )}

          {/* SECTION 5.1: การติดตั้งเครื่องปลดวงจรต้นทาง */}
          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">3.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)</h2>
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
              items={initialEvChargerHVInspectionItems3.filter(item => item.id === "3.3")}
              values={(() => {
                const item = initialEvChargerHVInspectionItems3.find(item => item.id === "3.3");
                return item ? [(formData.inspection_items || []).find(v => v.id === "3.3") || { id: "3.3" }] : [];
              })()}
              onChange={(updatedItems) => {
                setFormData(prev => {
                  const existingItems = prev.inspection_items || [];
                  const updatedInspectionItems = [...existingItems];
                  
                  updatedItems.forEach(updatedItem => {
                    const existingIndex = updatedInspectionItems.findIndex(item => item.id === updatedItem.id);
                    if (existingIndex >= 0) {
                      updatedInspectionItems[existingIndex] = updatedItem;
                    } else {
                      updatedInspectionItems.push(updatedItem);
                    }
                  });
                  
                  return {
                    ...prev,
                    inspection_items: updatedInspectionItems,
                  };
                });
              }}
              disabled={isSubmitting}
            />
          </section>

          {/* SECTION 5.2: อื่นๆ */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">3.4 อื่นๆ</h2>
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

                /* SECTION 4: ข้อมูลหม้อแปลง */
                <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">⚡</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">4. ข้อมูลหม้อแปลง</h2>
                  </div>

                  {formData.transformers.map((transformer, transformerIndex) => (
                    <div key={transformer.id} className="border border-gray-200 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          หม้อแปลงที่ {transformerIndex + 1}
                        </h3>
                        {formData.transformers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTransformer(transformerIndex)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            ลบหม้อแปลง
                          </button>
                        )}
                      </div>

                      {/* 4.1 คุณสมบัติทั่วไปของหม้อแปลง */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">4.1 คุณสมบัติทั่วไปของหม้อแปลง</h4>
                        
                        {/* ผ่านการทดสอบ */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ผ่านการทดสอบ
                          </label>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`transformers_${transformerIndex}_test_result`}
                                value="ผ่านการทดสอบ"
                                checked={transformer.test_result === "ผ่านการทดสอบ"}
                                onChange={(e) => handleTransformerChange(transformerIndex, 'test_result', e.target.value)}
                                className="mr-2"
                              />
                              <span className="text-gray-700">ผ่านการทดสอบ</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`transformers_${transformerIndex}_test_result`}
                                value="ไม่ผ่านการทดสอบ"
                                checked={transformer.test_result === "ไม่ผ่านการทดสอบ"}
                                onChange={(e) => handleTransformerChange(transformerIndex, 'test_result', e.target.value)}
                                className="mr-2"
                              />
                              <span className="text-gray-700">ไม่ผ่านการทดสอบ</span>
                            </label>
                          </div>
                        </div>

                        {/* ข้อมูลหม้อแปลง */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              หม้อแปลงเครื่องที่
                            </label>
                            <input
                              type="text"
                              value={transformer.transformer_number || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'transformer_number', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="หมายเลขหม้อแปลง"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ขนาด (kVA)
                            </label>
                            <input
                              type="number"
                              value={transformer.capacity_kva || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'capacity_kva', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="ความจุ kVA"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              % Impedance
                            </label>
                            <input
                              type="number"
                              value={transformer.impedance_percent || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'impedance_percent', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="อิมพีแดนซ์ %"
                              min="0"
                              step="0.1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              พิกัดแรงดันด้านแรงสูง (kV)
                            </label>
                            <input
                              type="number"
                              value={transformer.hv_voltage || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'hv_voltage', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="แรงดันแรงสูง kV"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              พิกัดแรงดันด้านแรงต่ำ (V)
                            </label>
                            <input
                              type="number"
                              value={transformer.lv_voltage || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'lv_voltage', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="แรงดันแรงต่ำ V"
                              min="0"
                            />
                          </div>
                        </div>

                        {/* ชนิดหม้อแปลง */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">ชนิด</label>
                          <div className="flex items-center gap-6">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`transformers_${transformerIndex}_type`}
                                value="Oil"
                                checked={transformer.transformer_type === "Oil"}
                                onChange={(e) => handleTransformerChange(transformerIndex, 'transformer_type', e.target.value)}
                                className="mr-2"
                              />
                              <span className="text-gray-700">Oil</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`transformers_${transformerIndex}_type`}
                                value="Dry"
                                checked={transformer.transformer_type === "Dry"}
                                onChange={(e) => handleTransformerChange(transformerIndex, 'transformer_type', e.target.value)}
                                className="mr-2"
                              />
                              <span className="text-gray-700">Dry</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`transformers_${transformerIndex}_type`}
                                value="อื่นๆ"
                                checked={transformer.transformer_type === "อื่นๆ"}
                                onChange={(e) => handleTransformerChange(transformerIndex, 'transformer_type', e.target.value)}
                                className="mr-2"
                              />
                              <span className="text-gray-700">อื่นๆ</span>
                            </label>
                            {transformer.transformer_type === "อื่นๆ" && (
                              <input
                                type="text"
                                value={transformer.transformer_type_other || ""}
                                onChange={(e) => handleTransformerChange(transformerIndex, 'transformer_type_other', e.target.value)}
                                className="text-gray-700 ml-2 p-2 border border-gray-300 rounded-md"
                                placeholder="ระบุชนิดอื่นๆ"
                              />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vector Group
                            </label>
                            <input
                              type="text"
                              value={transformer.vector_group || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'vector_group', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="Vector Group"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              พิกัดการทนกระแสลัดวงจรสูงสุด (kA)
                            </label>
                            <input
                              type="number"
                              value={transformer.max_short_circuit_current || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'max_short_circuit_current', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="กระแสลัดวงจรสูงสุด kA"
                              min="0"
                              step="0.1"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <RadioEV
                            name={`transformers_${transformerIndex}_general_result`}
                            value={transformer.general_result || ""}
                            onChange={(e) => handleTransformerChange(transformerIndex, 'general_result', e.target.value)}
                            detailValue={transformer.general_detail || ""}
                            onDetailChange={(e) => handleTransformerChange(transformerIndex, 'general_detail', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* 4.2 ลักษณะการติดตั้ง */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">4.2 ลักษณะการติดตั้ง</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {['แขวน', 'นั่งร้าน', 'ตั้งพื้น', 'ตั้งบนดาดฟ้า', 'ห้องหม้อแปลง', 'อื่นๆ'].map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={transformer.installation_type?.includes(option) || false}
                                onChange={(e) => {
                                  const currentTypes = transformer.installation_type || [];
                                  const newTypes = e.target.checked 
                                    ? [...currentTypes, option]
                                    : currentTypes.filter(type => type !== option);
                                  handleTransformerChange(transformerIndex, 'installation_type', newTypes);
                                }}
                                className="mr-2"
                              />
                              <span className="text-gray-700 text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                        {transformer.installation_type?.includes('อื่นๆ') && (
                          <input
                            type="text"
                            value={transformer.installation_type_other || ""}
                            onChange={(e) => handleTransformerChange(transformerIndex, 'installation_type_other', e.target.value)}
                            className="text-gray-700 w-full p-3 border border-gray-300 rounded-md mb-4"
                            placeholder="ระบุลักษณะการติดตั้งอื่นๆ"
                          />
                        )}
                        <RadioEV
                          name={`transformers_${transformerIndex}_installation_result`}
                          value={transformer.installation_result || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'installation_result', e.target.value)}
                          detailValue={transformer.installation_detail || ""}
                          onDetailChange={(e) => handleTransformerChange(transformerIndex, 'installation_detail', e.target.value)}
                        />
                      </div>

                      {/* 4.3 เครื่องป้องกันกระแสเกินด้านไฟเข้า */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">4.3 เครื่องป้องกันกระแสเกินด้านไฟเข้า</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                          {['ดรอพเอาท์ฟิวส์คัตเอาท์', 'เซอร์กิตเบรกเกอร์', 'อื่นๆ'].map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={transformer.overcurrent_protection?.includes(option) || false}
                                onChange={(e) => {
                                  const currentProtection = transformer.overcurrent_protection || [];
                                  const newProtection = e.target.checked 
                                    ? [...currentProtection, option]
                                    : currentProtection.filter(type => type !== option);
                                  handleTransformerChange(transformerIndex, 'overcurrent_protection', newProtection);
                                }}
                                className="mr-2"
                              />
                              <span className="text-gray-700 text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                        {transformer.overcurrent_protection?.includes('อื่นๆ') && (
                          <input
                            type="text"
                            value={transformer.overcurrent_protection_other || ""}
                            onChange={(e) => handleTransformerChange(transformerIndex, 'overcurrent_protection_other', e.target.value)}
                            className="text-gray-700 w-full p-3 border border-gray-300 rounded-md mb-4"
                            placeholder="ระบุเครื่องป้องกันอื่นๆ"
                          />
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              พิกัดกระแสต่อเนื่อง (A)
                            </label>
                            <input
                              type="number"
                              value={transformer.continuous_current_rating || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'continuous_current_rating', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="กระแสต่อเนื่อง A"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              พิกัดตัดกระแสลัดวงจรสูงสุด (IC) (kA)
                            </label>
                            <input
                              type="number"
                              value={transformer.interrupting_capacity || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'interrupting_capacity', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="IC kA"
                              min="0"
                              step="0.1"
                            />
                          </div>
                        </div>
                        <RadioEV
                          name={`transformers_${transformerIndex}_overcurrent_result`}
                          value={transformer.overcurrent_result || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'overcurrent_result', e.target.value)}
                          detailValue={transformer.overcurrent_detail || ""}
                          onDetailChange={(e) => handleTransformerChange(transformerIndex, 'overcurrent_detail', e.target.value)}
                        />
                      </div>

                      {/* 4.4 การติดตั้งกับดักเสิร์จแรงสูง */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">4.4 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              พิกัดแรงดัน (kV)
                            </label>
                            <input
                              type="number"
                              value={transformer.surge_arrester_voltage || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'surge_arrester_voltage', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="พิกัดแรงดัน kV"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              พิกัดกระแส (kA)
                            </label>
                            <input
                              type="number"
                              value={transformer.surge_arrester_current || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'surge_arrester_current', e.target.value)}
                              className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                              placeholder="พิกัดกระแส kA"
                              min="0"
                              step="0.1"
                            />
                          </div>
                        </div>
                        <RadioEV
                          name={`transformers_${transformerIndex}_surge_arrester_result`}
                          value={transformer.surge_arrester_result || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'surge_arrester_result', e.target.value)}
                          detailValue={transformer.surge_arrester_detail || ""}
                          onDetailChange={(e) => handleTransformerChange(transformerIndex, 'surge_arrester_detail', e.target.value)}
                        />
                      </div>

                      {/* 4.5 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">4.5 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง</h4>
                        <RadioEV
                          name={`transformers_${transformerIndex}_grounding_result`}
                          value={transformer.grounding_result || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'grounding_result', e.target.value)}
                          detailValue={transformer.grounding_detail || ""}
                          onDetailChange={(e) => handleTransformerChange(transformerIndex, 'grounding_detail', e.target.value)}
                        />
                      </div>

                      {/* 4.6 ค่าความต้านทานดินของระบบแรงสูง */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">4.6 ค่าความต้านทานดินของระบบแรงสูง</h4>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ค่าความต้านทานดิน (โอห์ม)
                          </label>
                          <input
                            type="number"
                            value={transformer.ground_resistance || ""}
                            onChange={(e) => handleTransformerChange(transformerIndex, 'ground_resistance', e.target.value)}
                            className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                            placeholder="ค่าความต้านทานดิน โอห์ม"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                          <p className="text-sm text-yellow-800">
                            <strong>หมายเหตุ:</strong> ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน 
                            ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน 
                            ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม
                          </p>
                        </div>
                        <RadioEV
                          name={`transformers_${transformerIndex}_ground_resistance_result`}
                          value={transformer.ground_resistance_result || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'ground_resistance_result', e.target.value)}
                          detailValue={transformer.ground_resistance_detail || ""}
                          onDetailChange={(e) => handleTransformerChange(transformerIndex, 'ground_resistance_detail', e.target.value)}
                        />
                      </div>

                      {/* 4.7 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน) */}
                      {transformer.transformer_type === "Oil" && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-800 mb-3">4.7 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)</h4>
                          
                          {/* 4.7.1 สารดูดความชื้น */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">4.7.1 สารดูดความชื้น</h5>
                            <RadioEV
                              name={`transformers_${transformerIndex}_moisture_absorber_result`}
                              value={transformer.moisture_absorber_result || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'moisture_absorber_result', e.target.value)}
                              detailValue={transformer.moisture_absorber_detail || ""}
                              onDetailChange={(e) => handleTransformerChange(transformerIndex, 'moisture_absorber_detail', e.target.value)}
                            />
                          </div>

                          {/* 4.7.2 สภาพบุชชิ่ง */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">4.7.2 สภาพบุชชิ่ง</h5>
                            <RadioEV
                              name={`transformers_${transformerIndex}_bushing_condition_result`}
                              value={transformer.bushing_condition_result || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'bushing_condition_result', e.target.value)}
                              detailValue={transformer.bushing_condition_detail || ""}
                              onDetailChange={(e) => handleTransformerChange(transformerIndex, 'bushing_condition_detail', e.target.value)}
                            />
                          </div>

                          {/* 4.7.3 ระดับน้ำมัน */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">4.7.3 ระดับน้ำมัน</h5>
                            <RadioEV
                              name={`transformers_${transformerIndex}_oil_level_result`}
                              value={transformer.oil_level_result || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'oil_level_result', e.target.value)}
                              detailValue={transformer.oil_level_detail || ""}
                              onDetailChange={(e) => handleTransformerChange(transformerIndex, 'oil_level_detail', e.target.value)}
                            />
                          </div>

                          {/* 4.7.4 การรั่วซึมของน้ำมันหม้อแปลง */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">4.7.4 การรั่วซึมของน้ำมันหม้อแปลง</h5>
                            <RadioEV
                              name={`transformers_${transformerIndex}_oil_leakage_result`}
                              value={transformer.oil_leakage_result || ""}
                              onChange={(e) => handleTransformerChange(transformerIndex, 'oil_leakage_result', e.target.value)}
                              detailValue={transformer.oil_leakage_detail || ""}
                              onDetailChange={(e) => handleTransformerChange(transformerIndex, 'oil_leakage_detail', e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* 4.8 ป้ายเตือน */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">4.8 ป้ายเตือน</h4>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
                          <p className="text-sm text-red-800 font-medium">
                            "อันตรายไฟฟ้าแรงสูง เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น"
                          </p>
                        </div>
                        <RadioEV
                          name={`transformers_${transformerIndex}_warning_sign_result`}
                          value={transformer.warning_sign_result || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'warning_sign_result', e.target.value)}
                          detailValue={transformer.warning_sign_detail || ""}
                          onDetailChange={(e) => handleTransformerChange(transformerIndex, 'warning_sign_detail', e.target.value)}
                        />
                      </div>

                      {/* 4.9 อื่นๆ */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">4.9 อื่นๆ</h4>
                        <textarea
                          name={`transformers_${transformerIndex}_other_notes`}
                          value={transformer.other_notes || ""}
                          onChange={(e) => handleTransformerChange(transformerIndex, 'other_notes', e.target.value)}
                          rows="3"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="ระบุรายละเอียดอื่นๆ (ถ้ามี)"
                        />
                      </div>

                      {/* 5. วงจรประธานแรงต่ำ */}
                                  <div className="mb-6">
                                  <h4 className="font-medium text-gray-800 mb-3">5. วงจรประธานแรงต่ำ</h4>
                                  
                                  {/* 5.1 สายตัวนำประธาน (สายเมน) */}
                                  <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-lg font-medium text-gray-700">5.1 สายตัวนำประธาน (สายเมน)</h5>
                                    </div>

                                    {(transformer.main_circuits || []).map((mainCircuit, mainCircuitIndex) => (
                                    <div key={mainCircuit.id} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
                                      <div className="flex justify-between items-center mb-4">
                                      <h6 className="text-md font-medium text-gray-800">วงจรประธานที่ {mainCircuitIndex + 1}</h6>
                                      {(transformer.main_circuits || []).length > 1 && (
                                        <button
                                        type="button"
                                        onClick={() => {
                                          const newMainCircuits = transformer.main_circuits.filter((_, index) => index !== mainCircuitIndex);
                                          handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                        }}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                        >
                                        ลบ
                                        </button>
                                      )}
                                      </div>

                                      {/* 5.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน */}
                                      <div className="mb-6">
                                      <h6 className="text-sm font-medium text-gray-700 mb-3">5.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน</h6>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                        {['มอก. 11-2553', 'มอก. 293-2541', 'IEC 60502'].map((standard) => (
                                        <label key={standard} className="flex items-center">
                                          <input
                                          type="checkbox"
                                          checked={mainCircuit.lv_conductor_standard?.includes(standard) || false}
                                          onChange={(e) => {
                                            const currentStandards = mainCircuit.lv_conductor_standard || [];
                                            const newStandards = e.target.checked 
                                            ? [...currentStandards, standard]
                                            : currentStandards.filter(s => s !== standard);
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].lv_conductor_standard = newStandards;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                          }}
                                          className="mr-2"
                                          />
                                          <span className="text-gray-700 text-sm">{standard}</span>
                                        </label>
                                        ))}
                                      </div>
                                      <RadioEV
                                        name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_lv_conductor_standard_result`}
                                        value={mainCircuit.lv_conductor_standard_result || ""}
                                        onChange={(e) => {
                                        const newMainCircuits = [...transformer.main_circuits];
                                        newMainCircuits[mainCircuitIndex].lv_conductor_standard_result = e.target.value;
                                        handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                        }}
                                        detailValue={mainCircuit.lv_conductor_standard_detail || ""}
                                        onDetailChange={(e) => {
                                        const newMainCircuits = [...transformer.main_circuits];
                                        newMainCircuits[mainCircuitIndex].lv_conductor_standard_detail = e.target.value;
                                        handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                        }}
                                      />
                                      </div>

                                      {/* 5.1.2 ชนิดสายตัวนำ */}
                                      <div className="mb-6">
                                      <h6 className="text-sm font-medium text-gray-700 mb-3">5.1.2 ชนิดสายตัวนำ</h6>
                                      <div className="flex items-center gap-6 mb-4">
                                        {['IEC01', 'NYY', 'CV'].map((type) => (
                                        <label key={type} className="flex items-center">
                                          <input
                                          type="radio"
                                          name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_lv_conductor_type`}
                                          value={type}
                                          checked={mainCircuit.lv_conductor_type === type}
                                          onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].lv_conductor_type = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                          }}
                                          className="mr-2"
                                          />
                                          <span className="text-gray-700">{type}</span>
                                        </label>
                                        ))}
                                        <label className="flex items-center">
                                        <input
                                          type="radio"
                                          name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_lv_conductor_type`}
                                          value="อื่นๆ"
                                          checked={mainCircuit.lv_conductor_type === "อื่นๆ"}
                                          onChange={(e) => {
                                          const newMainCircuits = [...transformer.main_circuits];
                                          newMainCircuits[mainCircuitIndex].lv_conductor_type = e.target.value;
                                          handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                          }}
                                          className="mr-2"
                                        />
                                        <span className="text-gray-700">อื่นๆ</span>
                                        </label>
                                        {mainCircuit.lv_conductor_type === "อื่นๆ" && (
                                        <input
                                          type="text"
                                          value={mainCircuit.lv_conductor_type_other || ""}
                                          onChange={(e) => {
                                          const newMainCircuits = [...transformer.main_circuits];
                                          newMainCircuits[mainCircuitIndex].lv_conductor_type_other = e.target.value;
                                          handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                          }}
                                          className="text-gray-700 ml-2 p-2 border border-gray-300 rounded-md"
                                          placeholder="ระบุชนิดอื่นๆ"
                                        />
                                        )}
                                      </div>
                                      </div>

                                      {/* 5.1.3 ขนาดสายเฟส */}
                                      <div className="mb-4">
                                      <h6 className="text-sm font-medium text-gray-700 mb-2">5.1.3 ขนาดสายเฟส</h6>
                                      <div className="flex items-center gap-2 mb-2">
                                        <input
                                        type="number"
                                        value={mainCircuit.lv_conductor_size || ""}
                                        onChange={(e) => {
                                          const newMainCircuits = [...transformer.main_circuits];
                                          newMainCircuits[mainCircuitIndex].lv_conductor_size = e.target.value;
                                          handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                        }}
                                        className="text-gray-700 w-32 p-2 border border-gray-300 rounded-md"
                                        placeholder="ขนาด"
                                        min="0"
                                        />
                                        <span className="text-gray-700">ตร.มม.</span>
                                      </div>
                                      <p className="text-xs text-gray-600 mb-3">
                                        พิกัดกระแสสายตัวนำประธานต้องไม่น้อยกว่าขนาดปรับตั้งของเมนเซอร์กิตเบรกเกอร์ 
                                        และสอดคล้องกับขนาดมิเตอร์ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
                                      </p>
                                      </div>

                                      {/* 5.1.4 ขนาดสายนิวทรัล */}
                                      <div className="mb-6">
                                      <h6 className="text-sm font-medium text-gray-700 mb-2">5.1.4 ขนาดสายนิวทรัล</h6>
                                      <div className="flex items-center gap-2">
                                        <input
                                        type="number"
                                        value={mainCircuit.lv_neutral_size || ""}
                                        onChange={(e) => {
                                          const newMainCircuits = [...transformer.main_circuits];
                                          newMainCircuits[mainCircuitIndex].lv_neutral_size = e.target.value;
                                          handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                        }}
                                        className="text-gray-700 w-32 p-2 border border-gray-300 rounded-md"
                                        placeholder="ขนาด"
                                        min="0"
                                        />
                                        <span className="text-gray-700">ตร.มม.</span>
                                      </div>
                                      </div>

                                      <div className="mt-4">
                                      <RadioEV
                                        name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_lv_result`}
                                        value={mainCircuit.lv_result || ""}
                                        onChange={(e) => {
                                        const newMainCircuits = [...transformer.main_circuits];
                                        newMainCircuits[mainCircuitIndex].lv_result = e.target.value;
                                        handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                        }}
                                        detailValue={mainCircuit.lv_detail || ""}
                                        onDetailChange={(e) => {
                                        const newMainCircuits = [...transformer.main_circuits];
                                        newMainCircuits[mainCircuitIndex].lv_detail = e.target.value;
                                        handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                        }}
                                      />
                                      </div>

                                      {/* 5.1.5 - 5.1.8 รายการตรวจสอบเพิ่มเติม */}
                                      <div className="mt-6">
                                      <div className="space-y-4">
                                        {/* 5.1.5 ระบุเฟสสายตัวนำ */}
                                        <div>
                                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                                          5.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ
                                        </h6>
                                        <div className="flex items-center gap-4">
                                          <label className="flex items-center">
                                          <input
                                            type="radio"
                                            name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_phase_marking`}
                                            value="ถูกต้อง"
                                            checked={mainCircuit.phase_marking === "ถูกต้อง"}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].phase_marking = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">ถูกต้อง</span>
                                          </label>
                                          <label className="flex items-center">
                                          <input
                                            type="radio"
                                            name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_phase_marking`}
                                            value="ต้องแก้ไข"
                                            checked={mainCircuit.phase_marking === "ต้องแก้ไข"}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].phase_marking = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">ต้องแก้ไข</span>
                                          </label>
                                        </div>
                                        {mainCircuit.phase_marking === "ต้องแก้ไข" && (
                                          <input
                                          type="text"
                                          value={mainCircuit.phase_marking_detail || ""}
                                          onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].phase_marking_detail = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                          }}
                                          className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2"
                                          placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                          />
                                        )}
                                        </div>

                                        {/* 5.1.6 ช่องเดินสาย */}
                                        <div>
                                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                                          5.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ
                                        </h6>
                                        <div className="flex items-center gap-4">
                                          <label className="flex items-center">
                                          <input
                                            type="radio"
                                            name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_cable_routing`}
                                            value="ถูกต้อง"
                                            checked={mainCircuit.cable_routing === "ถูกต้อง"}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_routing = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">ถูกต้อง</span>
                                          </label>
                                          <label className="flex items-center">
                                          <input
                                            type="radio"
                                            name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_cable_routing`}
                                            value="ต้องแก้ไข"
                                            checked={mainCircuit.cable_routing === "ต้องแก้ไข"}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_routing = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">ต้องแก้ไข</span>
                                          </label>
                                        </div>
                                        {mainCircuit.cable_routing === "ต้องแก้ไข" && (
                                          <textarea
                                          value={mainCircuit.cable_routing_detail || ""}
                                          onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_routing_detail = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                          }}
                                          className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2 resize-none"
                                          rows="3"
                                          placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                          />
                                        )}
                                        </div>

                                        {/* 5.1.7 วิธีการเดินสาย */}
                                        <div>
                                        <h6 className="text-sm font-medium text-gray-700 mb-3">5.1.7 วิธีการเดินสาย</h6>
                                        <div className="space-y-3">
                                          <label className="flex items-center">
                                          <input
                                            type="checkbox"
                                            checked={mainCircuit.cable_installation_method?.includes('เดินสายบนลูกถ้วยฉนวนในอากาศ') || false}
                                            onChange={(e) => {
                                            const currentMethods = mainCircuit.cable_installation_method || [];
                                            const newMethods = e.target.checked 
                                              ? [...currentMethods, 'เดินสายบนลูกถ้วยฉนวนในอากาศ']
                                              : currentMethods.filter(method => method !== 'เดินสายบนลูกถ้วยฉนวนในอากาศ');
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_method = newMethods;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">เดินสายบนลูกถ้วยฉนวนในอากาศ</span>
                                          </label>

                                          <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={mainCircuit.cable_installation_method?.includes('เดินบนรางเคเบิล') || false}
                                            onChange={(e) => {
                                            const currentMethods = mainCircuit.cable_installation_method || [];
                                            const newMethods = e.target.checked 
                                              ? [...currentMethods, 'เดินบนรางเคเบิล']
                                              : currentMethods.filter(method => method !== 'เดินบนรางเคเบิล');
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_method = newMethods;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">เดินบนรางเคเบิล (Cable Tray) ขนาด</span>
                                          <input
                                            type="text"
                                            value={mainCircuit.cable_tray_size || ""}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_tray_size = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="text-gray-700 w-20 p-1 border border-gray-300 rounded-md text-sm"
                                            placeholder="มม."
                                          />
                                          <span className="text-gray-700">x</span>
                                          <input
                                            type="text"
                                            value={mainCircuit.cable_tray_width || ""}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_tray_width = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="text-gray-700 w-20 p-1 border border-gray-300 rounded-md text-sm"
                                            placeholder="มม."
                                          />
                                          <span className="text-gray-700">มม.</span>
                                          </div>

                                          <label className="flex items-center">
                                          <input
                                            type="checkbox"
                                            checked={mainCircuit.cable_installation_method?.includes('เดินสายฝังดินโดยตรง') || false}
                                            onChange={(e) => {
                                            const currentMethods = mainCircuit.cable_installation_method || [];
                                            const newMethods = e.target.checked 
                                              ? [...currentMethods, 'เดินสายฝังดินโดยตรง']
                                              : currentMethods.filter(method => method !== 'เดินสายฝังดินโดยตรง');
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_method = newMethods;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</span>
                                          </label>

                                          <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={mainCircuit.cable_installation_method?.includes('เดินสายร้อยท่อฝังดิน') || false}
                                            onChange={(e) => {
                                            const currentMethods = mainCircuit.cable_installation_method || [];
                                            const newMethods = e.target.checked 
                                              ? [...currentMethods, 'เดินสายร้อยท่อฝังดิน']
                                              : currentMethods.filter(method => method !== 'เดินสายร้อยท่อฝังดิน');
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_method = newMethods;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด</span>
                                          <input
                                            type="text"
                                            value={mainCircuit.underground_conduit_size || ""}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].underground_conduit_size = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="text-gray-700 w-20 p-1 border border-gray-300 rounded-md text-sm"
                                            placeholder="นิ้ว"
                                          />
                                          <span className="text-gray-700">นิ้ว</span>
                                          </div>

                                          <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={mainCircuit.cable_installation_method?.includes('เดินร้อยท่อเกาะผนัง') || false}
                                            onChange={(e) => {
                                            const currentMethods = mainCircuit.cable_installation_method || [];
                                            const newMethods = e.target.checked 
                                              ? [...currentMethods, 'เดินร้อยท่อเกาะผนัง']
                                              : currentMethods.filter(method => method !== 'เดินร้อยท่อเกาะผนัง');
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_method = newMethods;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด</span>
                                          <input
                                            type="text"
                                            value={mainCircuit.wall_conduit_size || ""}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].wall_conduit_size = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="text-gray-700 w-20 p-1 border border-gray-300 rounded-md text-sm"
                                            placeholder="นิ้ว"
                                          />
                                          <span className="text-gray-700">นิ้ว</span>
                                          </div>

                                          <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={mainCircuit.cable_installation_method?.includes('อื่นๆ') || false}
                                            onChange={(e) => {
                                            const currentMethods = mainCircuit.cable_installation_method || [];
                                            const newMethods = e.target.checked 
                                              ? [...currentMethods, 'อื่นๆ']
                                              : currentMethods.filter(method => method !== 'อื่นๆ');
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_method = newMethods;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">อื่นๆ ระบุ</span>
                                          <input
                                            type="text"
                                            value={mainCircuit.cable_installation_other || ""}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_other = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="text-gray-700 flex-1 p-1 border border-gray-300 rounded-md text-sm"
                                            placeholder="ระบุวิธีการอื่นๆ"
                                          />
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-4">
                                          <label className="flex items-center">
                                          <input
                                            type="radio"
                                            name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_cable_installation_result`}
                                            value="ถูกต้อง"
                                            checked={mainCircuit.cable_installation_result === "ถูกต้อง"}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_result = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">ถูกต้อง</span>
                                          </label>
                                          <label className="flex items-center">
                                          <input
                                            type="radio"
                                            name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_cable_installation_result`}
                                            value="ต้องแก้ไข"
                                            checked={mainCircuit.cable_installation_result === "ต้องแก้ไข"}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_result = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">ต้องแก้ไข</span>
                                          </label>
                                        </div>
                                        {mainCircuit.cable_installation_result === "ต้องแก้ไข" && (
                                          <textarea
                                          value={mainCircuit.cable_installation_detail || ""}
                                          onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].cable_installation_detail = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                          }}
                                          className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2 resize-none"
                                          rows="4"
                                          placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                          />
                                        )}
                                        </div>

                                        {/* 5.1.8 ประเภทท่อร้อยสาย */}
                                        <div>
                                        <h6 className="text-sm font-medium text-gray-700 mb-3">5.1.8 ประเภทท่อร้อยสาย</h6>
                                        <div className="space-y-3">
                                          <div>
                                          <span className="text-gray-700 font-medium">ท่อโลหะ</span>
                                          <div className="flex items-center gap-4 mt-2 ml-4">
                                            {['หนา (RMC)', 'หนาปานกลาง (IMC)', 'บาง (EMT)'].map((type) => (
                                            <label key={type} className="flex items-center">
                                              <input
                                              type="checkbox"
                                              checked={mainCircuit.conduit_type?.includes(type) || false}
                                              onChange={(e) => {
                                                const currentTypes = mainCircuit.conduit_type || [];
                                                const newTypes = e.target.checked 
                                                ? [...currentTypes, type]
                                                : currentTypes.filter(t => t !== type);
                                                const newMainCircuits = [...transformer.main_circuits];
                                                newMainCircuits[mainCircuitIndex].conduit_type = newTypes;
                                                handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                              }}
                                              className="mr-2"
                                              />
                                              <span className="text-gray-700 text-sm">{type}</span>
                                            </label>
                                            ))}
                                          </div>
                                          </div>

                                          <div>
                                          <span className="text-gray-700 font-medium">ท่ออโลหะ</span>
                                          <div className="flex items-center gap-4 mt-2 ml-4">
                                            {['แข็ง (RNC)', 'อ่อน (ENT)'].map((type) => (
                                            <label key={type} className="flex items-center">
                                              <input
                                              type="checkbox"
                                              checked={mainCircuit.conduit_type?.includes(type) || false}
                                              onChange={(e) => {
                                                const currentTypes = mainCircuit.conduit_type || [];
                                                const newTypes = e.target.checked 
                                                ? [...currentTypes, type]
                                                : currentTypes.filter(t => t !== type);
                                                const newMainCircuits = [...transformer.main_circuits];
                                                newMainCircuits[mainCircuitIndex].conduit_type = newTypes;
                                                handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                              }}
                                              className="mr-2"
                                              />
                                              <span className="text-gray-700 text-sm">{type}</span>
                                            </label>
                                            ))}
                                          </div>
                                          </div>

                                          <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={mainCircuit.conduit_type?.includes('อื่นๆ') || false}
                                            onChange={(e) => {
                                            const currentTypes = mainCircuit.conduit_type || [];
                                            const newTypes = e.target.checked 
                                              ? [...currentTypes, 'อื่นๆ']
                                              : currentTypes.filter(t => t !== 'อื่นๆ');
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].conduit_type = newTypes;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">อื่นๆ ระบุ</span>
                                          <input
                                            type="text"
                                            value={mainCircuit.conduit_type_other || ""}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].conduit_type_other = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="text-gray-700 flex-1 p-1 border border-gray-300 rounded-md text-sm"
                                            placeholder="ระบุประเภทท่ออื่นๆ"
                                          />
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-4">
                                          <label className="flex items-center">
                                          <input
                                            type="radio"
                                            name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_conduit_type_result`}
                                            value="ถูกต้อง"
                                            checked={mainCircuit.conduit_type_result === "ถูกต้อง"}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].conduit_type_result = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">ถูกต้อง</span>
                                          </label>
                                          <label className="flex items-center">
                                          <input
                                            type="radio"
                                            name={`transformers_${transformerIndex}_main_circuit_${mainCircuitIndex}_conduit_type_result`}
                                            value="ต้องแก้ไข"
                                            checked={mainCircuit.conduit_type_result === "ต้องแก้ไข"}
                                            onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].conduit_type_result = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                            }}
                                            className="mr-2"
                                          />
                                          <span className="text-gray-700">ต้องแก้ไข</span>
                                          </label>
                                        </div>
                                        {mainCircuit.conduit_type_result === "ต้องแก้ไข" && (
                                          <textarea
                                          value={mainCircuit.conduit_type_detail || ""}
                                          onChange={(e) => {
                                            const newMainCircuits = [...transformer.main_circuits];
                                            newMainCircuits[mainCircuitIndex].conduit_type_detail = e.target.value;
                                            handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                          }}
                                          className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2 resize-none"
                                          rows="2"
                                          placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                          />
                                        )}
                                        </div>
                                      </div>
                                      </div>
                                    </div>
                                    ))}

                                    {/* Always show the add button for main circuits */}
                                    <div className="text-center py-4 mb-4">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const currentMainCircuits = transformer.main_circuits || [];
                                                        const newMainCircuit = {
                                                        id: currentMainCircuits.length,
                                                        lv_conductor_standard: [],
                                                        lv_conductor_standard_result: "",
                                                        lv_conductor_standard_detail: "",
                                                        lv_conductor_type: "",
                                                        lv_conductor_type_other: "",
                                                        lv_conductor_size: "",
                                                        lv_neutral_size: "",
                                                        phase_marking: "",
                                                        phase_marking_detail: "",
                                                        cable_routing: "",
                                                        cable_routing_detail: "",
                                                        cable_installation_method: [],
                                                        cable_tray_size: "",
                                                        cable_tray_width: "",
                                                        underground_conduit_size: "",
                                                        wall_conduit_size: "",
                                                        cable_installation_other: "",
                                                        cable_installation_result: "",
                                                        cable_installation_detail: "",
                                                        conduit_type: [],
                                                        conduit_type_other: "",
                                                        conduit_type_result: "",
                                                        conduit_type_detail: "",
                                                        lv_result: "",
                                                        lv_detail: ""
                                                        };
                                                        const newMainCircuits = [...currentMainCircuits, newMainCircuit];
                                                        handleTransformerChange(transformerIndex, 'main_circuits', newMainCircuits);
                                                        }}
                                                        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                        >
                                                        เพิ่มวงจรประธาน
                                                        </button>
                                                      </div>
                                                      </div>
                                                      </div>

                                                      {/* 5.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน) */}
                                                      <div className="mb-6">
                                                        <h4 className="font-medium text-gray-800 mb-3">5.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)</h4>
                                                        
                                                        {/* 5.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน */}
                                                        <div className="mb-4">
                                                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                            5.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2
                                                          </h5>
                                                          <div className="flex items-center gap-4">
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_main_breaker_standard`}
                                                                value="ถูกต้อง"
                                                                checked={transformer.main_breaker_standard === "ถูกต้อง"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_standard', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ถูกต้อง</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_main_breaker_standard`}
                                                                value="ต้องแก้ไข"
                                                                checked={transformer.main_breaker_standard === "ต้องแก้ไข"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_standard', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ต้องแก้ไข</span>
                                                            </label>
                                                          </div>
                                                          {transformer.main_breaker_standard === "ต้องแก้ไข" && (
                                                            <input
                                                              type="text"
                                                              value={transformer.main_breaker_standard_detail || ""}
                                                              onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_standard_detail', e.target.value)}
                                                              className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2"
                                                              placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                            />
                                                          )}
                                                        </div>

                                                        {/* 5.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด */}
                                                        <div className="mb-4">
                                                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                            5.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด สอดคล้องกับพิกัดกระแสสายตัวนำประธาน
                                                          </h5>
                                                          <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-gray-700">AT</span>
                                                            <input
                                                              type="number"
                                                              value={transformer.main_breaker_rating || ""}
                                                              onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_rating', e.target.value)}
                                                              className="text-gray-700 w-32 p-2 border border-gray-300 rounded-md"
                                                              placeholder="ขนาด"
                                                              min="0"
                                                            />
                                                            <span className="text-gray-700">แอมแปร์ (A)</span>
                                                          </div>
                                                          <div className="flex items-center gap-4">
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_main_breaker_rating_result`}
                                                                value="ถูกต้อง"
                                                                checked={transformer.main_breaker_rating_result === "ถูกต้อง"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_rating_result', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ถูกต้อง</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_main_breaker_rating_result`}
                                                                value="ต้องแก้ไข"
                                                                checked={transformer.main_breaker_rating_result === "ต้องแก้ไข"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_rating_result', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ต้องแก้ไข</span>
                                                            </label>
                                                          </div>
                                                          {transformer.main_breaker_rating_result === "ต้องแก้ไข" && (
                                                            <input
                                                              type="text"
                                                              value={transformer.main_breaker_rating_detail || ""}
                                                              onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_rating_detail', e.target.value)}
                                                              className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2"
                                                              placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                            />
                                                          )}
                                                        </div>

                                                        {/* 5.2.3 พิกัดทนกระแสลัดวงจร */}
                                                        <div className="mb-4">
                                                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                            5.2.3 พิกัดทนกระแสลัดวงจร (Ic)
                                                          </h5>
                                                          <div className="flex items-center gap-2 mb-3">
                                                            <input
                                                              type="number"
                                                              value={transformer.main_breaker_ic_rating || ""}
                                                              onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_ic_rating', e.target.value)}
                                                              className="text-gray-700 w-32 p-2 border border-gray-300 rounded-md"
                                                              placeholder="พิกัด Ic"
                                                              min="0"
                                                              step="0.1"
                                                            />
                                                            <span className="text-gray-700">กิโลแอมแปร์ (kA)</span>
                                                          </div>
                                                          <div className="flex items-center gap-4">
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_main_breaker_ic_result`}
                                                                value="ถูกต้อง"
                                                                checked={transformer.main_breaker_ic_result === "ถูกต้อง"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_ic_result', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ถูกต้อง</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_main_breaker_ic_result`}
                                                                value="ต้องแก้ไข"
                                                                checked={transformer.main_breaker_ic_result === "ต้องแก้ไข"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_ic_result', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ต้องแก้ไข</span>
                                                            </label>
                                                          </div>
                                                          {transformer.main_breaker_ic_result === "ต้องแก้ไข" && (
                                                            <input
                                                              type="text"
                                                              value={transformer.main_breaker_ic_detail || ""}
                                                              onChange={(e) => handleTransformerChange(transformerIndex, 'main_breaker_ic_detail', e.target.value)}
                                                              className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2"
                                                              placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                            />
                                                          )}
                                                        </div>

                                                        {/* 5.2.4 Ground Fault Protection */}
                                                        <div className="mb-4">
                                                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                            5.2.4 กรณีเมนเซอร์กิตเบรกเกอร์มีขนาดตั้งแต่ 1,000 แอมแปร์ ขึ้นไป ต้องติดตั้ง Ground Fault Protection (GFP)
                                                          </h5>
                                                          <div className="flex items-center gap-4">
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_gfp_requirement`}
                                                                value="ถูกต้อง"
                                                                checked={transformer.gfp_requirement === "ถูกต้อง"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'gfp_requirement', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ถูกต้อง</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_gfp_requirement`}
                                                                value="ต้องแก้ไข"
                                                                checked={transformer.gfp_requirement === "ต้องแก้ไข"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'gfp_requirement', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ต้องแก้ไข</span>
                                                            </label>
                                                          </div>
                                                          {transformer.gfp_requirement === "ต้องแก้ไข" && (
                                                            <input
                                                              type="text"
                                                              value={transformer.gfp_requirement_detail || ""}
                                                              onChange={(e) => handleTransformerChange(transformerIndex, 'gfp_requirement_detail', e.target.value)}
                                                              className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2"
                                                              placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                            />
                                                          )}
                                                        </div>
                                                      </div>

                                                      {/* 5.3 ระบบการต่อลงดินที่แผงเมนสวิตช์ */}
                                                      <div className="mb-6">
                                                        <h4 className="font-medium text-gray-800 mb-3">5.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</h4>
                                                        
                                                        {/* 5.3.1 สายต่อหลักดิน */}
                                                        <div className="mb-4">
                                                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                            5.3.1 สายต่อหลักดิน (ตัวนำทองแดง) สอดคล้องกับขนาดสายตัวนำประธาน ตามตารางที่ 1 ในหน้าที่ 7
                                                          </h5>
                                                          <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-gray-700">ขนาด</span>
                                                            <input
                                                              type="number"
                                                              value={transformer.grounding_conductor_size || ""}
                                                              onChange={(e) => handleTransformerChange(transformerIndex, 'grounding_conductor_size', e.target.value)}
                                                              className="text-gray-700 w-32 p-2 border border-gray-300 rounded-md"
                                                              placeholder="ขนาด"
                                                              min="0"
                                                            />
                                                            <span className="text-gray-700">ตร.มม.</span>
                                                          </div>
                                                          <div className="flex items-center gap-4">
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_grounding_conductor_result`}
                                                                value="ถูกต้อง"
                                                                checked={transformer.grounding_conductor_result === "ถูกต้อง"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'grounding_conductor_result', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ถูกต้อง</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_grounding_conductor_result`}
                                                                value="ต้องแก้ไข"
                                                                checked={transformer.grounding_conductor_result === "ต้องแก้ไข"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'grounding_conductor_result', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ต้องแก้ไข</span>
                                                            </label>
                                                          </div>
                                                          {transformer.grounding_conductor_result === "ต้องแก้ไข" && (
                                                            <input
                                                              type="text"
                                                              value={transformer.grounding_conductor_detail || ""}
                                                              onChange={(e) => handleTransformerChange(transformerIndex, 'grounding_conductor_detail', e.target.value)}
                                                              className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2"
                                                              placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                            />
                                                          )}
                                                        </div>

                                                        {/* 5.3.2 การต่อลงดินที่แผงเมนสวิตช์ */}
                                                        <div className="mb-4">
                                                          <h5 className="text-sm font-medium text-gray-700 mb-3">5.3.2 การต่อลงดินที่แผงเมนสวิตช์</h5>
                                                          
                                                          {/* Single Phase Option */}
                                                          <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                                                            <label className="flex items-start">
                                                              <input
                                                                type="checkbox"
                                                                checked={transformer.main_panel_grounding_type?.includes('1phase') || false}
                                                                onChange={(e) => {
                                                                  const currentTypes = transformer.main_panel_grounding_type || [];
                                                                  const newTypes = e.target.checked 
                                                                    ? [...currentTypes, '1phase']
                                                                    : currentTypes.filter(type => type !== '1phase');
                                                                  handleTransformerChange(transformerIndex, 'main_panel_grounding_type', newTypes);
                                                                }}
                                                                className="mr-3 mt-1"
                                                              />
                                                              <div>
                                                                <span className="text-gray-700 font-medium">กรณีระบบไฟฟ้า 1 เฟส</span>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                  แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสายนิวทรัล (Neutral Wire) 
                                                                  ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน 
                                                                  (Main Circuit Breaker) ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
                                                                </p>
                                                              </div>
                                                            </label>
                                                          </div>

                                                          {/* Three Phase Option */}
                                                          <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                                                            <label className="flex items-start">
                                                              <input
                                                                type="checkbox"
                                                                checked={transformer.main_panel_grounding_type?.includes('3phase') || false}
                                                                onChange={(e) => {
                                                                  const currentTypes = transformer.main_panel_grounding_type || [];
                                                                  const newTypes = e.target.checked 
                                                                    ? [...currentTypes, '3phase']
                                                                    : currentTypes.filter(type => type !== '3phase');
                                                                  handleTransformerChange(transformerIndex, 'main_panel_grounding_type', newTypes);
                                                                }}
                                                                className="mr-3 mt-1"
                                                              />
                                                              <div>
                                                                <span className="text-gray-700 font-medium">กรณีระบบไฟฟ้า 3 เฟส</span>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                  แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) 
                                                                  โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ 
                                                                  ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
                                                                </p>
                                                              </div>
                                                            </label>
                                                          </div>

                                                          <div className="flex items-center gap-4">
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_main_panel_grounding_result`}
                                                                value="ถูกต้อง"
                                                                checked={transformer.main_panel_grounding_result === "ถูกต้อง"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'main_panel_grounding_result', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ถูกต้อง</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_main_panel_grounding_result`}
                                                                value="ต้องแก้ไข"
                                                                checked={transformer.main_panel_grounding_result === "ต้องแก้ไข"}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'main_panel_grounding_result', e.target.value)}
                                                                className="mr-2"
                                                              />
                                                              <span className="text-gray-700">ต้องแก้ไข</span>
                                                            </label>
                                                          </div>
                                                          {transformer.main_panel_grounding_result === "ต้องแก้ไข" && (
                                                            <textarea
                                                              value={transformer.main_panel_grounding_detail || ""}
                                                              onChange={(e) => handleTransformerChange(transformerIndex, 'main_panel_grounding_detail', e.target.value)}
                                                              className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2 resize-none"
                                                              rows="3"
                                                              placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                            />
                                                          )}
                                                        </div>
                                                      </div>

                                                      {/* 5.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ */}
                                                      <div className="mb-6">
                                                        <h4 className="font-medium text-gray-800 mb-3">5.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งรูปแบบ)</h4>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                          {[
                                                            { value: 'TN-C-S', label: 'TN-C-S ทั้งระบบ', desc: 'ตัวอย่างระบบที่ต่อลงดินแบบ TN-C-S ทั้งระบบ' },
                                                            { value: 'TT', label: 'TT ทั้งระบบ', desc: 'ตัวอย่างระบบที่ต่อลงดินแบบ TT ทั้งระบบ' },
                                                            { value: 'TT-partial', label: 'TT บางส่วน', desc: '(ต้นทางเป็น TN-C-S และ โหลดเป็น TT)' },
                                                            { value: 'TN-S', label: 'TN-S ทั้งระบบ', desc: 'ตัวอย่างระบบที่ต่อลงดินแบบ TN-S ทั้งระบบ' }
                                                          ].map((option) => (
                                                            <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                              <input
                                                                type="radio"
                                                                name={`transformers_${transformerIndex}_grounding_system_type`}
                                                                value={option.value}
                                                                checked={transformer.grounding_system_type === option.value}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'grounding_system_type', e.target.value)}
                                                                className="mr-3 mt-1"
                                                              />
                                                              <div>
                                                                <span className="text-gray-700 font-medium">{option.label}</span>
                                                                <p className="text-sm text-gray-600">{option.desc}</p>
                                                              </div>
                                                            </label>
                                                          ))}
                                                        </div>

                                                        {/* 5.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ */}
                                                        {transformer.grounding_system_type === 'TN-C-S' && (
                                                          <div className="border-l-4 border-blue-500 pl-4 mb-6">
                                                            <h5 className="text-sm font-medium text-gray-700 mb-3">
                                                              5.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องมีมาตรการอย่างใดอย่างหนึ่ง)
                                                            </h5>
                                                            
                                                            <div className="space-y-4 mb-4">
                                                              <label className="flex items-start">
                                                                <input
                                                                  type="checkbox"
                                                                  checked={transformer.tn_cs_measures?.includes('load_balance') || false}
                                                                  onChange={(e) => {
                                                                    const currentMeasures = transformer.tn_cs_measures || [];
                                                                    const newMeasures = e.target.checked 
                                                                      ? [...currentMeasures, 'load_balance']
                                                                      : currentMeasures.filter(measure => measure !== 'load_balance');
                                                                    handleTransformerChange(transformerIndex, 'tn_cs_measures', newMeasures);
                                                                  }}
                                                                  className="mr-3 mt-1"
                                                                />
                                                                <div>
                                                                  <span className="text-gray-700 text-sm">
                                                                    มีการจัดโหลดไฟฟ้า 3 เฟส ให้สมดุลอย่างเพียงพอ โดยให้มีโหลดต่างกันระหว่างเฟสได้ไม่เกิน 20 แอมแปร์ 
                                                                    รวมทั้งค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน 
                                                                    ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน 
                                                                    ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม
                                                                  </span>
                                                                </div>
                                                              </label>

                                                              <label className="flex items-start">
                                                                <input
                                                                  type="checkbox"
                                                                  checked={transformer.tn_cs_measures?.includes('neutral_protection') || false}
                                                                  onChange={(e) => {
                                                                    const currentMeasures = transformer.tn_cs_measures || [];
                                                                    const newMeasures = e.target.checked 
                                                                      ? [...currentMeasures, 'neutral_protection']
                                                                      : currentMeasures.filter(measure => measure !== 'neutral_protection');
                                                                    handleTransformerChange(transformerIndex, 'tn_cs_measures', newMeasures);
                                                                  }}
                                                                  className="mr-3 mt-1"
                                                                />
                                                                <div>
                                                                  <span className="text-gray-700 text-sm">
                                                                    มีมาตรการป้องกันไม่ให้สายนิวทรัลจากหม้อแปลงไฟฟ้าไปยังบริภัณฑ์ประธานชำรุดหรือเสียหาย 
                                                                    โดยติดตั้งสายไฟฟ้าในรางเคเบิล บัสเวย์ (หรือบัสดัก) หรือช่องเดินสายเท่านั้น
                                                                  </span>
                                                                </div>
                                                              </label>

                                                              <label className="flex items-start">
                                                                <input
                                                                  type="checkbox"
                                                                  checked={transformer.tn_cs_measures?.includes('touch_voltage_protection') || false}
                                                                  onChange={(e) => {
                                                                    const currentMeasures = transformer.tn_cs_measures || [];
                                                                    const newMeasures = e.target.checked 
                                                                      ? [...currentMeasures, 'touch_voltage_protection']
                                                                      : currentMeasures.filter(measure => measure !== 'touch_voltage_protection');
                                                                    handleTransformerChange(transformerIndex, 'tn_cs_measures', newMeasures);
                                                                  }}
                                                                  className="mr-3 mt-1"
                                                                />
                                                                <div>
                                                                  <span className="text-gray-700 text-sm">
                                                                    ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครงบริภัณฑ์เทียบกับดินเกิน 70 โวลต์ 
                                                                    ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัดประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น 
                                                                    รวมถึงสายนิวทรัลและสายดินออกพร้อมกันภายในเวลา 5 วินาที
                                                                  </span>
                                                                </div>
                                                              </label>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                              <label className="flex items-center">
                                                                <input
                                                                  type="radio"
                                                                  name={`transformers_${transformerIndex}_tn_cs_result`}
                                                                  value="ถูกต้อง"
                                                                  checked={transformer.tn_cs_result === "ถูกต้อง"}
                                                                  onChange={(e) => handleTransformerChange(transformerIndex, 'tn_cs_result', e.target.value)}
                                                                  className="mr-2"
                                                                />
                                                                <span className="text-gray-700">ถูกต้อง</span>
                                                              </label>
                                                              <label className="flex items-center">
                                                                <input
                                                                  type="radio"
                                                                  name={`transformers_${transformerIndex}_tn_cs_result`}
                                                                  value="ต้องแก้ไข"
                                                                  checked={transformer.tn_cs_result === "ต้องแก้ไข"}
                                                                  onChange={(e) => handleTransformerChange(transformerIndex, 'tn_cs_result', e.target.value)}
                                                                  className="mr-2"
                                                                />
                                                                <span className="text-gray-700">ต้องแก้ไข</span>
                                                              </label>
                                                            </div>
                                                            {transformer.tn_cs_result === "ต้องแก้ไข" && (
                                                              <textarea
                                                                value={transformer.tn_cs_detail || ""}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'tn_cs_detail', e.target.value)}
                                                                className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2 resize-none"
                                                                rows="4"
                                                                placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                              />
                                                            )}
                                                          </div>
                                                        )}

                                                        {/* 5.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ */}
                                                        {transformer.grounding_system_type === 'TT' && (
                                                          <div className="border-l-4 border-green-500 pl-4 mb-6">
                                                            <h5 className="text-sm font-medium text-gray-700 mb-3">
                                                              5.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ
                                                            </h5>
                                                            <p className="text-sm text-gray-600 mb-4">
                                                              ต้องติดตั้งเครื่องตัดไฟรั่ว (RCD) ทุกวงจรไฟฟ้าที่จ่ายไฟ หรือทุกเครื่องใช้ไฟฟ้า 
                                                              ไม่ว่าจะเกี่ยวข้องกับการอัดประจุยานยนต์ไฟฟ้าหรือไม่ก็ตาม
                                                            </p>
                                                            <div className="flex items-center gap-4">
                                                              <label className="flex items-center">
                                                                <input
                                                                  type="radio"
                                                                  name={`transformers_${transformerIndex}_tt_result`}
                                                                  value="ถูกต้อง"
                                                                  checked={transformer.tt_result === "ถูกต้อง"}
                                                                  onChange={(e) => handleTransformerChange(transformerIndex, 'tt_result', e.target.value)}
                                                                  className="mr-2"
                                                                />
                                                                <span className="text-gray-700">ถูกต้อง</span>
                                                              </label>
                                                              <label className="flex items-center">
                                                                <input
                                                                  type="radio"
                                                                  name={`transformers_${transformerIndex}_tt_result`}
                                                                  value="ต้องแก้ไข"
                                                                  checked={transformer.tt_result === "ต้องแก้ไข"}
                                                                  onChange={(e) => handleTransformerChange(transformerIndex, 'tt_result', e.target.value)}
                                                                  className="mr-2"
                                                                />
                                                                <span className="text-gray-700">ต้องแก้ไข</span>
                                                              </label>
                                                            </div>
                                                            {transformer.tt_result === "ต้องแก้ไข" && (
                                                              <textarea
                                                                value={transformer.tt_detail || ""}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'tt_detail', e.target.value)}
                                                                className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2 resize-none"
                                                                rows="2"
                                                                placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                              />
                                                            )}
                                                          </div>
                                                        )}

                                                        {/* 5.4.3 กรณีต่อลงดินแบบ TT บางส่วน */}
                                                        {transformer.grounding_system_type === 'TT-partial' && (
                                                          <div className="border-l-4 border-yellow-500 pl-4 mb-6">
                                                            <h5 className="text-sm font-medium text-gray-700 mb-3">
                                                              5.4.3 กรณีต่อลงดินแบบ TT บางส่วน (ต้องดำเนินการครบทุกข้อ ก) – จ))
                                                            </h5>
                                                            
                                                            <div className="space-y-3 mb-4 text-sm">
                                                              <div>
                                                                <span className="font-medium text-gray-700">ก)</span>
                                                                <span className="text-gray-600 ml-2">
                                                                  มีการประเมินความเสี่ยงก่อนว่า ไม่มีโอกาสที่บุคคลจะสัมผัสโครงบริภัณฑ์ไฟฟ้าอื่นที่ต่อลงดินแบบ TN-C-S 
                                                                  กับโครงบริภัณฑ์จ่ายไฟยานยนต์ไฟฟ้า หรือโครงยานยนต์ไฟฟ้าที่ต่อลงดินแบบ TT โดยพร้อมกัน 
                                                                  หรือมีระยะห่างไม่น้อยกว่า 2.50 เมตร สามารถใช้การห่อหุ้มหรือกั้นได้
                                                                </span>
                                                              </div>
                                                              <div>
                                                                <span className="font-medium text-gray-700">ข)</span>
                                                                <span className="text-gray-600 ml-2">
                                                                  ระยะห่างระหว่างหลักดินของระบบ TN-C-S กับระบบ TT ต้องห่างกันอย่างน้อย 2.00 เมตร
                                                                </span>
                                                              </div>
                                                              <div>
                                                                <span className="font-medium text-gray-700">ค)</span>
                                                                <span className="text-gray-600 ml-2">
                                                                  มีการติดตั้งป้ายแสดงข้อความเตือนบริเวณเครื่องอัดประจุยานยนต์ไฟฟ้า ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
                                                                </span>
                                                              </div>
                                                              <div>
                                                                <span className="font-medium text-gray-700">ง)</span>
                                                                <span className="text-gray-600 ml-2">
                                                                  มีมาตรการป้องกันไม่ให้สายนิวทรัลจากหม้อแปลงไฟฟ้าไปยังบริภัณฑ์ประธานชำรุดหรือเสียหาย 
                                                                  โดยติดตั้งสายไฟฟ้าในรางเคเบิล บัสเวย์ (หรือบัสดัก) หรือช่องเดินสายเท่านั้น
                                                                </span>
                                                              </div>
                                                              <div>
                                                                <span className="font-medium text-gray-700">จ)</span>
                                                                <span className="text-gray-600 ml-2">
                                                                  ค่าความต้านทานการต่อลงดินแบบ TN-C-S ต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน 
                                                                  ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน 
                                                                  ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม
                                                                </span>
                                                              </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                              <label className="flex items-center">
                                                                <input
                                                                  type="radio"
                                                                  name={`transformers_${transformerIndex}_tt_partial_result`}
                                                                  value="ถูกต้อง"
                                                                  checked={transformer.tt_partial_result === "ถูกต้อง"}
                                                                  onChange={(e) => handleTransformerChange(transformerIndex, 'tt_partial_result', e.target.value)}
                                                                  className="mr-2"
                                                                />
                                                                <span className="text-gray-700">ถูกต้อง</span>
                                                              </label>
                                                              <label className="flex items-center">
                                                                <input
                                                                  type="radio"
                                                                  name={`transformers_${transformerIndex}_tt_partial_result`}
                                                                  value="ต้องแก้ไข"
                                                                  checked={transformer.tt_partial_result === "ต้องแก้ไข"}
                                                                  onChange={(e) => handleTransformerChange(transformerIndex, 'tt_partial_result', e.target.value)}
                                                                  className="mr-2"
                                                                />
                                                                <span className="text-gray-700">ต้องแก้ไข</span>
                                                              </label>
                                                            </div>
                                                            {transformer.tt_partial_result === "ต้องแก้ไข" && (
                                                              <textarea
                                                                value={transformer.tt_partial_detail || ""}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'tt_partial_detail', e.target.value)}
                                                                className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2 resize-none"
                                                                rows="4"
                                                                placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                              />
                                                            )}
                                                          </div>
                                                        )}

                                                        {/* 5.4.4 กรณีต่อลงดินแบบ TN-S ทั้งระบบ */}
                                                        {transformer.grounding_system_type === 'TN-S' && (
                                                          <div className="border-l-4 border-purple-500 pl-4 mb-6">
                                                            <h5 className="text-sm font-medium text-gray-700 mb-3">
                                                              5.4.4 กรณีต่อลงดินแบบ TN-S ทั้งระบบ
                                                            </h5>
                                                            <p className="text-sm text-gray-600 mb-4">
                                                              ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน 
                                                              ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน 
                                                              ให้ปักหลักดินเพิ่มอีกตามความเหมาะสม
                                                            </p>
                                                            <div className="flex items-center gap-4">
                                                              <label className="flex items-center">
                                                                <input
                                                                  type="radio"
                                                                  name={`transformers_${transformerIndex}_tn_s_result`}
                                                                  value="ถูกต้อง"
                                                                  checked={transformer.tn_s_result === "ถูกต้อง"}
                                                                  onChange={(e) => handleTransformerChange(transformerIndex, 'tn_s_result', e.target.value)}
                                                                  className="mr-2"
                                                                />
                                                                <span className="text-gray-700">ถูกต้อง</span>
                                                              </label>
                                                              <label className="flex items-center">
                                                                <input
                                                                  type="radio"
                                                                  name={`transformers_${transformerIndex}_tn_s_result`}
                                                                  value="ต้องแก้ไข"
                                                                  checked={transformer.tn_s_result === "ต้องแก้ไข"}
                                                                  onChange={(e) => handleTransformerChange(transformerIndex, 'tn_s_result', e.target.value)}
                                                                  className="mr-2"
                                                                />
                                                                <span className="text-gray-700">ต้องแก้ไข</span>
                                                              </label>
                                                            </div>
                                                            {transformer.tn_s_result === "ต้องแก้ไข" && (
                                                              <textarea
                                                                value={transformer.tn_s_detail || ""}
                                                                onChange={(e) => handleTransformerChange(transformerIndex, 'tn_s_detail', e.target.value)}
                                                                className="text-gray-700 w-full p-2 border border-gray-300 rounded-md mt-2 resize-none"
                                                                rows="2"
                                                                placeholder="ระบุรายละเอียดที่ต้องแก้ไข"
                                                              />
                                                            )}
                                                          </div>
                                                        )}
                                                      </div>

                                                      <div className="mb-4">
                                                      <label className="flex items-center cursor-pointer"></label>
                                                      <input
                                                      type="checkbox"
                                                      checked={transformer.show_panel_boards || false}
                                                      onChange={(e) => handleTransformerChange(transformerIndex, 'show_panel_boards', e.target.checked)}
                                                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                      />
                                                      <span className="ml-2 text-gray-900 font-medium">แสดงส่วน Panel Board และ Sub Circuit</span>
                                                      </div>

                                                      {/* Panel Boards */}
                      {transformer.show_panel_boards && transformer.panel_boards.map((panel, panelIndex) => (
                        <div key={panel.id} className="border-l-4 border-blue-500 pl-4 ml-4 mb-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-medium text-gray-800">Panel Board {panelIndex + 1}</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ชื่อ Panel
                              </label>
                              <input
                                type="text"
                                value={panel.panel_name || ""}
                                onChange={(e) => {
                                  const newTransformers = [...formData.transformers];
                                  newTransformers[transformerIndex].panel_boards[panelIndex].panel_name = e.target.value;
                                  setFormData(prev => ({ ...prev, transformers: newTransformers }));
                                }}
                                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                                placeholder="ชื่อ Panel Board"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ตำแหน่งที่ตั้ง
                              </label>
                              <input
                                type="text"
                                value={panel.panel_location || ""}
                                onChange={(e) => {
                                  const newTransformers = [...formData.transformers];
                                  newTransformers[transformerIndex].panel_boards[panelIndex].panel_location = e.target.value;
                                  setFormData(prev => ({ ...prev, transformers: newTransformers }));
                                }}
                                className="text-gray-700 w-full p-3 border border-gray-300 rounded-md"
                                placeholder="ตำแหน่งที่ตั้ง"
                              />
                            </div>
                          </div>

                          {/* Panel Board Inspection Items */}
                          <div className="mb-6">
                            <h5 className="text-sm font-medium text-gray-700 mb-3">รายการตรวจสอบ Panel Board</h5>
                            {(() => {
                              const panelBoardValues = initialEvChargerHVPanelBoardItems.map(item => {
                                const panelInspectionItems = panel.inspection_items || [];
                                return panelInspectionItems.find(v => v.id === item.id) || { id: item.id };
                              });

                              return (
                                <CorrectiveRadio
                                  items={initialEvChargerHVPanelBoardItems}
                                  values={panelBoardValues}
                                  onChange={(updatedItems) => {
                                    const newTransformers = [...formData.transformers];
                                    const existingItems = panel.inspection_items || [];
                                    const updatedInspectionItems = [...existingItems];
                                    
                                    updatedItems.forEach(updatedItem => {
                                      const existingIndex = updatedInspectionItems.findIndex(item => item.id === updatedItem.id);
                                      if (existingIndex >= 0) {
                                        updatedInspectionItems[existingIndex] = updatedItem;
                                      } else {
                                        updatedInspectionItems.push(updatedItem);
                                      }
                                    });
                                    
                                    newTransformers[transformerIndex].panel_boards[panelIndex].inspection_items = updatedInspectionItems;
                                    setFormData(prev => ({ ...prev, transformers: newTransformers }));
                                  }}
                                  disabled={isSubmitting}
                                />
                              );
                            })()}
                          </div>

                          {/* Sub Circuits */}
                          <div className="ml-4">
                            <div className="flex justify-between items-center mb-4">
                              <h5 className="text-sm font-medium text-gray-700">Sub Circuits</h5>
                              <button
                                type="button"
                                onClick={() => handleAddSubCircuit(transformerIndex, panelIndex)}
                                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                              >
                                เพิ่ม Sub Circuit
                              </button>
                            </div>

                            {(panel.sub_circuits || []).map((circuit, circuitIndex) => {
                              if (!circuit) {
                                return null;
                              }
                              return (
                                <SubCircuitSection
                                  key={circuit.id || circuitIndex}
                                  circuit={circuit}
                                  circuitIndex={circuitIndex}
                                  onCircuitChange={(field, value) => 
                                    handleSubCircuitChange(transformerIndex, panelIndex, circuitIndex, field, value)
                                  }
                                  onRemoveCircuit={() => 
                                    handleRemoveSubCircuit(transformerIndex, panelIndex, circuitIndex)
                                  }
                                  onAddCharger={() => 
                                    handleAddCharger(transformerIndex, panelIndex, circuitIndex)
                                  }
                                  onChargerChange={(chargerIndex, field, value) =>
                                    handleChargerChange(transformerIndex, panelIndex, circuitIndex, chargerIndex, field, value)
                                  }
                                  onRemoveCharger={(chargerIndex) =>
                                    handleRemoveCharger(transformerIndex, panelIndex, circuitIndex, chargerIndex)
                                  }
                                  showRemove={(panel.sub_circuits || []).length > 1}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={handleAddTransformer}
                      className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium"
                    >
                      เพิ่มหม้อแปลง
                    </button>
                  </div>
                </section>


                {/* ส่วนลายเซ็น */}
          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-indigo-600">
              ลายเซ็นยืนยัน
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-800">ผู้ขอใช้ไฟฟ้า</h3>
                <SignaturePad
                  ref={applicantSigRef}
                  onSave={(signature) => handleSignatureSave('applicant_signature', signature)}
                  onClear={() => handleSignatureClear('applicant_signature')}
                  initialSignature={formData.applicant_signature}
                />
                <div className="mt-3">
                  <input
                    type="text"
                    name="applicant_signature_name"
                    value={formData.applicant_signature_name || ""}
                    onChange={handleChange}
                    className="text-gray-700 w-full p-2 border border-gray-300 rounded-md text-center"
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-800">เจ้าหน้าที่ผู้ตรวจสอบ</h3>
                <SignaturePad
                  ref={officerSigRef}
                  onSave={(signature) => handleSignatureSave('officer_signature', signature)}
                  onClear={() => handleSignatureClear('officer_signature')}
                  initialSignature={formData.officer_signature}
                />
                <div className="mt-3">
                  <input
                    type="text"
                    name="officer_signature_name"
                    value={formData.officer_signature_name || ""}
                    onChange={handleChange}
                    className="text-gray-700 w-full p-2 border border-gray-300 rounded-md text-center"
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ปุ่มบันทึกและดาวน์โหลด */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
            
            <PDFDownloadLink
              document={<EVChargerHVInspectionPDF data={formData} />}
              fileName={`ev-charger-hv-inspection-${formData.request_number || 'draft'}-${new Date().toISOString().split('T')[0]}.pdf`}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg"
            >
              {({ blob, url, loading, error }) => (
                <>
                  <Download className="w-5 h-5" />
                  {loading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}
                </>
              )}
            </PDFDownloadLink>
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

export default function EVChargerHVInspectionForm() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EVChargerHVInspectionFormContent />
    </Suspense>
  );
}