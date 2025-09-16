"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import GeneralInfoSection from "../components/home/GeneralInfoSection";
import HomeInspectionSection from "../components/home/HomeInspectionSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection"; 

export default function HomeInspectionPage() {
  const [form, setForm] = useState({
    general: {},
    inspection: {},
    summary: "",
    limitation: "",
    signature: "",
  });

  // ฟังก์ชันสำหรับเปลี่ยนค่าในแต่ละ section
  const handleSectionChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // ฟังก์ชันเปลี่ยนค่าที่เป็น object ทั้งก้อน (สำหรับบาง section)
  const handleSectionObject = (section, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  // ฟังก์ชันบันทึกหรือส่งฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: เพิ่ม logic ส่งฟอร์มหรือ validate ตามต้องการ
    // เช่น console.log(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
        แบบฟอร์มตรวจสอบระบบไฟฟ้าภายในบ้าน/ที่อยู่อาศัย
      </h1>
      <GeneralInfoSection
        data={form.general}
        onChange={(field, value) => handleSectionChange("general", field, value)}
      />
      <HomeInspectionSection
        data={form.inspection}
        onChange={(field, value) => handleSectionChange("inspection", field, value)}
      />
      <InspectionSummarySection
        value={form.summary}
        onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))}
      />
      <LimitationSection
        value={form.limitation}
        onChange={(value) => setForm((prev) => ({ ...prev, limitation: value }))}
      />
      <SignaturePadSection
        value={form.signature}
        onChange={(value) => setForm((prev) => ({ ...prev, signature: value }))}
      />

      <div className="flex justify-center mt-8">
        <button
          type="submit"
          className="bg-blue-700 text-white px-8 py-2 rounded shadow font-bold hover:bg-blue-800"
        >
          บันทึกฟอร์ม
        </button>
      </div>
    </form>
  );
}