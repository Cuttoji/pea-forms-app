"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import GeneralInfoSection from "../components/home/GeneralInfoSection";
import HomeInspectionSection from "../components/home/HomeInspectionSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection"; 
import homeFormSchema from "@/lib/constants/homeFormSchema";
import HomeInspectionPDF from "../../../components/pdf/HomeInspectionPDF";

export default function HomeInspectionPage() {
  const [form, setForm] = useState({
    general: homeFormSchema.general,
    inspection: homeFormSchema.inspection,
    summary: homeFormSchema.summary,
    limitation: homeFormSchema.limitation,
    signature: homeFormSchema.signature,
  });

  const formRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  // ฟังก์ชันบันทึกหรือส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();

    // สร้าง payload ให้ตรงกับ column ใน home_inspections
    const payload = {
      // General Information
      inspection_no: form.general.inspectionNo,
      inspection_date: form.general.inspectionDate,
      request_no: form.general.requestNo,
      request_date: form.general.requestDate,
      customer_name: form.general.customerName,
      phone: form.general.phone,
      address: form.general.address,
      system_type: form.general.systemType,
      load: form.general.load,
      latitude: form.general.latitude,
      longitude: form.general.longitude,
      house_image: form.general.houseImage,

      // Home Inspection Data
      items: form.inspection.items,
      wire_type: form.inspection.wireType,
      wire_other: form.inspection.wireOther,
      wire_size: form.inspection.wireSize,
      wire_result: form.inspection.wireResult,
      wire_detail: form.inspection.wireDetail,
      at_size: form.inspection.atSize,
      underground_size: form.inspection.undergroundSize,
      rcd_result: form.inspection.rcdResult,
      rcd_note: form.inspection.rcdNote,

      // Summary
      overall_result: form.summaryType?.overallResult ?? null,

      // Limitation
      limitation: form.limitation,

      // Signature
      officer_sign: form.signature.officerSign,
      customer_sign: form.signature.customerSign,
    };

    try {
      const response = await fetch('/api/submit-form/home-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        alert('บันทึกฟอร์มเรียบร้อยแล้ว!');
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการบันทึกฟอร์ม');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    }
  };
  // PDF generation function
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      
      // Transform form data to match PDF component expectations
      const pdfData = {
        // General info
        inspectionnumber: form.general.inspectionNumber,
        inspectiondate: form.general.inspectionDate,
        requestnumber: form.general.requestNumber,
        requestdate: form.general.requestDate,
        fullname: form.general.fullName,
        phone: form.general.phone,
        address: form.general.address,
        phasetype: form.general.phaseType,
        estimatedload: form.general.estimatedLoad,
        
        // Inspection data
        wireType: form.inspection.wireType,
        wireOther: form.inspection.wireOther,
        wireSize: form.inspection.wireSize,
        wireResult: form.inspection.wireResult,
        wireDetail: form.inspection.wireDetail,
        atSize: form.inspection.atSize,
        undergroundSize: form.inspection.undergroundSize,
        rcdResult: form.inspection.rcdResult,
        rcdNote: form.inspection.rcdNote,
        
        // Summary
        summaryresult: form.summary,
        
        // Limitation
        scopeofinspection: form.limitation,
        
        // Signatures
        userSignature: form.signature.userSignature,
        inspectorSignature: form.signature.inspectorSignature,
      };
      
      const blob = await pdf(<HomeInspectionPDF formData={pdfData} />).toBlob();
      
      // Create download link
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
              className="bg-blue-700 text-white px-8 py-2 rounded shadow font-bold hover:bg-blue-800"
            >
              บันทึกฟอร์ม
            </button>
          </div>
        </form>
      </div>
  );
}