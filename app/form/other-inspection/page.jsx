"use client";
import React, { useState } from "react";
import GeneralInfoSection from "../components/building/GeneralInfoSection";
import DocumentSection from "../components/building/DocumentSection";
import HVSystemSection from "../components/evCharger/HVSystemSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import TransformerSection from "../components/building/TransformerSection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import LVSystemSection from "../components/building/LVSystemSection";

export default function CondoInspectionPage() {
  const [formData, setFormData] = useState({
    general: {},
    documents: {},
    hvSystem: {},
    summary: "",
    limitation: "",
    signature: ""
  });

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

  const [transformers, setTransformers] = useState([{
    transformerData: {},
    lvSystem: {},
    hasPanel: false,
    panel: {}
  }]);

  const addTransformer = () => {
    setTransformers(prev => [...prev, {
      transformerData: {},
      lvSystem: {},
      hasPanel: false,
      panel: {}
    }]);
  };
  
  const removeTransformer = (index) => {
    if (transformers.length > 1) {
      setTransformers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleTransformerChange = (idx, key, value) => {
    setTransformers((old) =>
      old.map((t, i) => (i === idx ? { ...t, [key]: value } : t))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { formData, transformers });
    // TODO: Implement form submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-10 py-8 px-4">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          แบบฟอร์มตรวจสอบระบบไฟฟ้าอื่นๆ
        </h1>
        <p className="text-xl text-gray-600">
          การตรวจสอบระบบไฟฟ้าและอุปกรณ์ป้องกันสำหรับอาคารพิเศษ
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
        {transformers.map((transformer, transformerIndex) => (
          <div
            key={transformerIndex}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 text-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-gray-700 text-lg font-bold">{transformerIndex + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    หม้อแปลงที่ {transformerIndex + 1}
                  </h3>
                </div>
                {transformers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTransformer(transformerIndex)}
                    className="text-red px-6 py-3 bg-white bg-opacity-20 text-base font-medium rounded-lg hover:bg-opacity-30 transition-colors"
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
                  handleTransformerChange(
                    transformerIndex,
                    "transformerData",
                    updatedTransformer
                  );
                }}
                mode="general"
              />
              </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addTransformer}
          className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          + เพิ่มหม้อแปลง
        </button>
      </div>

      <InspectionSummarySection 
        value={formData.summary}
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
      <div className="flex justify-center pt-8 border-t border-gray-200">
        <button
          type="submit"
          className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          บันทึกและส่งข้อมูล
        </button>
      </div>
    </form>
  );
}