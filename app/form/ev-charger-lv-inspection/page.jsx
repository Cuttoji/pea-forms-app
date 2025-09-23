"use client";
import React from "react";

import evLvChargerFormSchema, { getNewLvSubCircuit, getNewLvEvCharger } from "@/lib/constants/evLvChargerFormSchema";
import DocumentSection from "../components/evCharger/DocumentSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import PanelBoardSection from "../components/evCharger/PanelBoardSection";
import SubCircuitSection from "../components/evCharger/SubCircuitSection";
import GeneralInfoLvSection from "../components/evCharger/GeneralInfoLvSection";
import EvChargerLvFormPDF from "../../../components/pdf/EvChargerLvFormPDF";
import LVSystemSectionPEA from "../components/evCharger/LVSystemSectionPEA";

export default function EvChargerLvInspectionPage() {
  const [form, setForm] = React.useState({
    general: evLvChargerFormSchema.general,
    inspection: {
      subCircuits: [getNewLvSubCircuit()],
    },
    panel: evLvChargerFormSchema.panel,
    documents: evLvChargerFormSchema.documents,
    summary: evLvChargerFormSchema.summary,
    limitation: evLvChargerFormSchema.limitation,
    signature: evLvChargerFormSchema.signature,
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // ฟังก์ชันสำหรับเปลี่ยนค่าในแต่ละ section
  const handleSectionChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...(field ? { [field]: value } : value),
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

  // ฟังก์ชันบันทึกหรือส่งฟอร์ม (ส่งไป API เท่านั้น)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-form/ev-charger-lv-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // PDF generation function
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const pdfData = {
        peaoffice: form.general.peaOffice,
        inspectionnumber: form.general.inspectionNumber,
        inspectiondate: form.general.inspectionDate,
        requestnumber: form.general.requestNumber,
        requestdate: form.general.requestDate,
        fullname: form.general.fullName,
        phone: form.general.phone,
        address: form.general.address,
        phasetype: form.general.phaseType,
        estimatedload: form.general.estimatedLoad,
        documents: form.documents,
        panel: form.panel,
        subCircuits: form.inspection.subCircuits,
        summaryresult: form.summary,
        scopeofinspection: form.limitation,
        userSignature: form.signature.userSignature,
        inspectorSignature: form.signature.inspectorSignature,
      };
      const blob = await pdf(<EvChargerLvFormPDF formData={pdfData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ev-charger-lv-inspection.pdf';
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
          แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า (EV Charger) ระดับแรงดันต่ำ
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <GeneralInfoLvSection
          data={form.general}
          onChange={(field, value) => handleSectionChange("general", field, value)}
        />
        <DocumentSection
          value={form.documents}
          onChange={(value) => handleSectionObject("documents", value)}
        />
        <LVSystemSectionPEA
          value={form.inspection.lvSystemPEA}
          onChange={(value) => handleSectionChange("inspection", "lvSystemPEA", value)}
        />
        <PanelBoardSection
          value={form.panel}
          sectionNumber={3}
          onChange={(value) => handleSectionObject("panel", value)}
        />
        <SubCircuitSection
          sectionNumber={3}
          value={form.inspection.subCircuits || []}
          onChange={(value) => handleSectionChange("inspection", "subCircuits", value)}
          onAddCharger={(subCircuitIndex) => {
            const subCircuits = form.inspection.subCircuits || [];
            const updatedSubCircuits = subCircuits.map((subCircuit, index) => {
              if (index === subCircuitIndex) {
                const updatedEvChargers = [...(subCircuit.evChargers || []), getNewLvEvCharger()];
                return { ...subCircuit, evChargers: updatedEvChargers };
              }
              return subCircuit;
            });
            handleSectionChange("inspection", "subCircuits", updatedSubCircuits);
          }}
        />
        <InspectionSummarySection
          value={form.summary}
          onChange={(value) => handleSectionChange("summary", null, value)}
        />
        <LimitationSection
          value={form.limitation}
          onChange={(value) => handleSectionChange("limitation", null, value)}
        />
        <SignaturePadSection
          value={form.signature}
          onChange={(value) => handleSectionChange("signature", null, value)}
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