"use client";

import React, { useState, useRef, useEffect } from "react";
import GeneralInfoSection from "../components/home/GeneralInfoSection";
import HomeInspectionSection from "../components/home/HomeInspectionSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import homeFormSchema from "@/lib/constants/homeFormSchema";
import HomeInspectionPDF from "../../../components/pdf/HomeInspectionPDF";

export default function HomeInspectionPage({ initialForm }) {
  const [form, setForm] = useState({
    general: homeFormSchema.general,
    inspection: homeFormSchema.inspection,
    summary: homeFormSchema.summary,
    limitation: homeFormSchema.limitation,
    signature: homeFormSchema.signature,
  });

  const formRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialForm) {
      setForm({
        ...initialForm,
        summary: initialForm.summary || homeFormSchema.summary || {},
        limitation: initialForm.limitation || homeFormSchema.limitation || "",
        signature: initialForm.signature || homeFormSchema.signature || {},
      });
    }
  }, [initialForm]);

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

  // ฟังก์ชันบันทึกหรือส่งฟอร์ม (ส่งไป API เท่านั้น)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-form/home-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert('บันทึกฟอร์มเรียบร้อยแล้ว!');
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการบันทึกฟอร์ม');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsSubmitting(false);
    }
  };

  // PDF generation function (ปรับใหม่)
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      // ส่งข้อมูลเป็น object ตาม schema ที่บันทึก
      const pdfData = {
        general: form.general,
        inspection: form.inspection,
        summary: form.summary,
        limitation: form.limitation,
        signature: form.signature,
      };
      const blob = await pdf(<HomeInspectionPDF formData={pdfData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'home-inspection.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          แบบตรวจสอบระบบไฟฟ้าภายในบ้านพักอาศัย
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6" ref={formRef}>
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
        <div className="flex justify-center mt-8 space-x-4">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="bg-red-600 text-white px-8 py-2 rounded shadow font-bold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                กำลังสร้าง PDF...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ดาวน์โหลด PDF
              </>
            )}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-700 text-white px-8 py-2 rounded shadow font-bold hover:bg-blue-800"
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกฟอร์ม"}
          </button>
        </div>
      </form>
    </div>
  );
}