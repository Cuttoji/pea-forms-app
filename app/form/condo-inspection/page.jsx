"use client";
import React, { useState, useEffect } from "react";
import GeneralInfoSection from "../components/building/GeneralInfoSection";
import DocumentSection from "../components/building/DocumentSection";
import HVSystemSection from "../components/evCharger/HVSystemSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import TransformerSection from "../components/evCharger/TransformerSection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import LVSystemSection from "../components/building/LVSystemSection";
import condoFormSchema, { getNewCondoTransformer } from "@/lib/constants/condoFormSchema";
import CondoInspectionPDF from "../../../components/pdf/CondoInspectionPDF";


// รับ props แบบ optional เพื่อรองรับทั้งสร้างใหม่และ edit
export default function CondoInspectionPage(props) {
  const initialForm = props?.initialForm;

  const [formData, setFormData] = useState({
    general: condoFormSchema.general,
    documents: condoFormSchema.documents,
    hvSystem: condoFormSchema.hvSystem,
    summary: condoFormSchema.summary || {}, // ป้องกัน summary เป็น null
    limitation: condoFormSchema.limitation,
    signature: condoFormSchema.signature
  });

  // รับ initialForm กรณี edit
  useEffect(() => {
    if (initialForm) {
      setFormData({
        ...initialForm,
        summary: initialForm.summary || {}, // fallback ป้องกัน null
      });
      if (Array.isArray(initialForm.transformers)) {
        setTransformers(initialForm.transformers);
      }
    }
  }, [initialForm]);

  const handleSectionChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  const handleSectionObject = (section, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: value
    }));
  };

  // ถ้า initialForm มี transformers ให้ใช้เลย ไม่งั้น default 1 ตัว
  const [transformers, setTransformers] = useState(
    (initialForm && Array.isArray(initialForm.transformers) && initialForm.transformers.length > 0)
      ? initialForm.transformers
      : [getNewCondoTransformer()]
  );
  const [showPDF, setShowPDF] = useState(false);

  const handleAddTransformer = () => {
    setTransformers(prev => [...prev, getNewCondoTransformer()]);
  };

  const handleTransformerChange = (index, field, value) => {
    setTransformers(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // รวมข้อมูลทั้งหมด
    const payload = {
      ...formData,
      transformers,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/submit-form/condo-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert("บันทึกฟอร์มสำเร็จ!");
        // สามารถ reset form หรือ redirect ได้ที่นี่
      } else {
        alert(result.error || "เกิดข้อผิดพลาดในการบันทึกฟอร์ม");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      console.error(error);
    }
  };

  const handleGeneratePDF = () => {
    setShowPDF(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-10 py-8 px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            แบบฟอร์มตรวจสอบระบบไฟฟ้าอาคารชุด
          </h1>
          <p className="text-xl text-gray-600">
            การตรวจสอบระบบไฟฟ้าและอุปกรณ์ป้องกันสำหรับอาคารชุดพักอาศัย
          </p>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-6"></div>
        </div>

        <GeneralInfoSection 
          data={formData.general} 
          onChange={(field, value) => handleSectionChange("general", field, value)} 
        />
        
        <DocumentSection 
          value={formData.documents} 
          onChange={(value) => handleSectionObject("documents", value)} 
        />
        
        <HVSystemSection 
          value={formData.hvSystem} 
          onChange={(value) => handleSectionObject("hvSystem", value)} 
        />

        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              4. ระบบหม้อแปลงและไฟฟ้าแรงต่ำ
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
          </div>

          {transformers.map((transformer, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{idx + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      หม้อแปลงที่ {idx + 1}
                    </h3>
                  </div>
                  {transformers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTransformers(prev => prev.filter((_, i) => i !== idx))}
                      className="px-6 py-3 bg-white bg-opacity-20 text-white text-base font-medium rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                      ลบหม้อแปลง
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8 space-y-10">
                <TransformerSection
                  sectionNumber={4}
                  value={transformer.transformerData}
                  onChange={(updatedTransformer) => {
                    handleTransformerChange(idx, "transformerData", updatedTransformer);
                  }}
                />
                
                <LVSystemSection
                  value={transformer.lvSystem || {}}
                  onChange={(lvData) =>
                    handleTransformerChange(idx, "lvSystem", lvData)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddTransformer}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            + เพิ่มหม้อแปลง
          </button>
        </div>

        <InspectionSummarySection
          value={formData.summary || {}} // ป้องกัน null
          onChange={(value) => handleSectionObject("summary", value)}
        />
        
        <LimitationSection 
          value={formData.limitation}
          onChange={(value) => handleSectionObject("limitation", value)}
        />
        
        <SignaturePadSection 
          value={formData.signature}
          onChange={(value) => handleSectionObject("signature", value)}
        />

        {/* Submit Button */}
        <div className="flex justify-center gap-4 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={handleGeneratePDF}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            สร้าง PDF
          </button>
          <button
            type="submit"
            className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            บันทึกและส่งข้อมูล
          </button>
        </div>
      </form>

      {showPDF && (
        <CondoInspectionPDF
          formData={formData}
          transformers={transformers}
          onClose={() => setShowPDF(false)}
        />
      )}
    </>
  );
}