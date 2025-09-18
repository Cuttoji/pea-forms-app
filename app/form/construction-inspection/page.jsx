"use client";

import React, { useState } from "react";
import GeneralInfoSection from "../components/construction/GeneralInfoSection";
import ConstructionInspectionSection from "../components/construction/ConstructionInspectionSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import constructionFormSchema from "@/lib/constants/constructionFormSchema";

export default function ConstructionInspectionPage() {
  const [formData, setFormData] = useState(constructionFormSchema);

  const handleFormChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  return (
    <div>
      <GeneralInfoSection data={formData} onChange={handleFormChange} />
      <ConstructionInspectionSection data={formData} onChange={handleFormChange} />
      <InspectionSummarySection data={formData} />
      <LimitationSection />
      <SignaturePadSection />
    </div>
  );
}
