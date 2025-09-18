"use client";
import React, { useState } from "react";
import GeneralInfoSection from "../components/building/GeneralInfoSection";
import DocumentSection from "../components/building/DocumentSection";
import HVSystemSection from "../components/evCharger/HVSystemSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import TransformerSection from "../components/evCharger/TransformerSection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import LVSystemSection from "../components/building/LVSystemSection";

export default function CondoInspectionPage() {
  const [formData, setFormData] = useState({});

  const handleFormChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const [transformers, setTransformers] = useState([{}]);

  const handleAddTransformer = () => {
    setTransformers(prev => [...prev, {}]);
  };

  const handleTransformerChange = (index, field, value) => {
    setTransformers(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div>
      <GeneralInfoSection data={formData} onChange={handleFormChange} />
      <DocumentSection data={formData} onChange={handleFormChange} />
      <HVSystemSection data={formData} onChange={handleFormChange} />

      <div>
        <h3>หม้อแปลง</h3>
        {transformers.map((transformer, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "8px" }}>
            <TransformerSection
              data={transformer}
              onChange={(field, value) => handleTransformerChange(idx, field, value)}
            />
            {/* LVSystemSection อยู่ในแต่ละหม้อแปลง */}
            <LVSystemSection
              data={transformer.lvSystem || {}}
              onChange={(field, value) =>
                handleTransformerChange(idx, "lvSystem", {
                  ...(transformer.lvSystem || {}),
                  [field]: value,
                })
              }
            />
          </div>
        ))}
        <button type="button" onClick={handleAddTransformer}>
          เพิ่มหม้อแปลง
        </button>
      </div>

      <InspectionSummarySection data={formData} />
      <LimitationSection />
      <SignaturePadSection />
    </div>
  );
}