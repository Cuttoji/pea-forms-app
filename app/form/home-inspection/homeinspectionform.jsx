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
    <div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6" ref={formRef}>
        <GeneralInfoSection
          data={form.general}
          onChange={(field, value) => handleSectionChange("general", field, value)}
          data-section="general"
          id="general-info-section"
        />
        <HomeInspectionSection
          data={form.inspection}
          onChange={(field, value) => handleSectionChange("inspection", field, value)}
          data-section="inspection"
          id="home-inspection-section"
        />
        <InspectionSummarySection
          value={form.summary}
          onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))}
          data-section="summary"
          id="summary-section"
        />
        <LimitationSection
          value={form.limitation}
          onChange={(value) => setForm((prev) => ({ ...prev, limitation: value }))}
        />
               <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</h2>
        </div>
      </div>
      <div className="px-6 py-6 space-y-6 text-gray-700">
        <div className="space-y-4">
          6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนข้อปลีกย่อยอื่นๆ ที่ผู้ขอใช้
 ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการ
 ติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิด   
ความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงให้อยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว 
        <div>
6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหน้า หรือ
 อุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว
        </div>
        <div>
6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้ง
 ทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว 
        </div>
        <div>
6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็น
 ผู้รับผิดชอบแต่เพียงฝ่ายเดียว 
        </div>
      </div>
    </div>
    </div>
        <SignaturePadSection
          value={form.signature}
          onChange={(value) => setForm((prev) => ({ ...prev, signature: value }))}
          data-section="signature"
          id="signature-section"
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
            className="bg-blue-700 text-white px-8 py-2 rounded shadow font-bold hover:bg-blue-800 disabled:opacity-50"
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกแบบฟอร์ม"}
          </button>
        </div>
      </form>
    </div>
  );
}