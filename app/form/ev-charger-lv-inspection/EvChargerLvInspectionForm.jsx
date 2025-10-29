"use client";
import React, { useEffect } from "react";

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

export default function EvChargerLvInspectionPage({ initialForm, formFromDb, mode = "create", formId }) {
  const [form, setForm] = React.useState({
    general: evLvChargerFormSchema.general,
    documents: evLvChargerFormSchema.documents,
    LVSystemPEA: evLvChargerFormSchema.LVSystemPEA,
    panel: evLvChargerFormSchema.panel,
    subCircuits: [getNewLvSubCircuit()],
    summary: evLvChargerFormSchema.summary || { summaryType: null },
    limitation: evLvChargerFormSchema.limitation || "",
    signature: evLvChargerFormSchema.signature || { officerSign: "", customerSign: "" },
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    console.log("initialForm received:", initialForm);
    if (initialForm) {
      const newFormState = {
        general: initialForm.general || evLvChargerFormSchema.general,
        documents: initialForm.documents || evLvChargerFormSchema.documents,
        LVSystemPEA: initialForm.LVSystemPEA || evLvChargerFormSchema.LVSystemPEA,
        panel: initialForm.panel || evLvChargerFormSchema.panel,
        subCircuits: initialForm.subCircuits || [getNewLvSubCircuit()],
        summary: initialForm.summary || { summaryType: null },
        limitation: initialForm.limitation || "",
        signature: initialForm.signature || { officerSign: "", customerSign: "" },
      };
      console.log("Setting form state to:", newFormState);
      console.log("LVSystemPEA in newFormState:", newFormState.LVSystemPEA);
      setForm(newFormState);
    }
  }, [initialForm]);

  useEffect(() => {
    console.log("formFromDb received:", formFromDb);
    if (formFromDb) {
      setForm({
        general: formFromDb.general || evLvChargerFormSchema.general,
        documents: formFromDb.documents || evLvChargerFormSchema.documents,
        LVSystemPEA: formFromDb.LVSystemPEA || evLvChargerFormSchema.LVSystemPEA,
        panel: formFromDb.panel || evLvChargerFormSchema.panel,
        subCircuits: formFromDb.subCircuits || [getNewLvSubCircuit()],
        summary: formFromDb.summary || { summaryType: null },
        limitation: formFromDb.limitation || "",
        signature: formFromDb.signature || { officerSign: "", customerSign: "" },
      });
    }
  }, [formFromDb]);

  useEffect(() => {
    console.log("Current form state:", form);
    console.log("Current LVSystemPEA:", form.LVSystemPEA);
    console.log("Current subCircuits:", form.subCircuits);
  }, [form]);

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
      let endpoint, method;
      
      if (mode === "edit" && formId) {
        // PUT: /api/submit-form/ev-charger-lv-inspection/{formId}
        endpoint = `/api/submit-form/ev-charger-lv-inspection/${formId}`;
        method = "PUT";
      } else {
        // POST: /api/submit-form/ev-charger-lv-inspection
        endpoint = "/api/submit-form/ev-charger-lv-inspection";
        method = "POST";
      }
      
      console.log(`Submitting ${method} to:`, endpoint);
      console.log("Form data:", form);
      
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        alert(mode === "edit" ? "อัปเดตฟอร์มสำเร็จ!" : "บันทึกฟอร์มสำเร็จ!");
        // สามารถ reset form หรือ redirect ได้ที่นี่
      } else {
        alert(result.error || "เกิดข้อผิดพลาดในการบันทึกฟอร์ม");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // PDF generation function
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      // ส่งข้อมูลเป็น object ตาม schema ที่บันทึก
      const pdfData = {
        general: form.general,
        documents: form.documents,
        LVSystemPEA: form.LVSystemPEA,
        panel: form.panel,
        subCircuits: form.subCircuits,
        summary: form.summary,
        limitation: form.limitation,
        signature: form.signature,
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
    <div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <GeneralInfoLvSection
          data={form.general}
          onChange={(field, value) => handleSectionChange("general", field, value)}
          data-section="general"
          id="general-info-section"
        />
        <DocumentSection
          value={form.documents}
          onChange={(value) => handleSectionObject("documents", value)}
          data-section="documents"
          id="document-section"
        />
        <LVSystemSectionPEA
          value={form.LVSystemPEA}
          onChange={(value) => handleSectionObject("LVSystemPEA", value)}
          data-section="lvSystemPEA"
          id="lv-system-pea-section"
        />
        <PanelBoardSection
          value={form.panel}
          sectionNumber={3}
          onChange={(value) => handleSectionObject("panel", value)}
          data-section="panel"
          id="panel-board-section"
        />
        <div data-section="subCircuits" id="sub-circuits-section">
        <SubCircuitSection
          sectionNumber={3}
          value={form.subCircuits || []}
          onChange={(value) => handleSectionObject("subCircuits", value)}
          onAddCharger={(subCircuitIndex) => {
            const subCircuits = form.subCircuits || [];
            const updatedSubCircuits = subCircuits.map((subCircuit, index) => {
              if (index === subCircuitIndex) {
                const updatedEvChargers = [...(subCircuit.evChargers || []), getNewLvEvCharger()];
                return { ...subCircuit, evChargers: updatedEvChargers };
              }
              return subCircuit;
            });
            handleSectionObject("subCircuits", updatedSubCircuits);
          }}
        />
        </div>
                
        <InspectionSummarySection
          value={form.summary}
          onChange={(value) => handleSectionObject("summary", value)}
          data-section="summary"
          id="summary-section"
        />
        <LimitationSection
          value={form.limitation}
          onChange={(value) => handleSectionObject("limitation", value)}
        />
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">5. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ </h2>
        </div>
      </div>
      <div className="px-6 py-6 space-y-6 text-gray-700">
        <div className="space-y-4">
          6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าที่รับไฟฟ้าจากหม้อแปลงจำหน่ายของการไฟฟ้าส่วนภูมิภาค 
(PEA) ตลอดจนข้อปลีกย่อยอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง PEA จะตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า
 ให้เป็นไปตามมาตรฐานการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า ตามที่ PEA กำหนด และแม้ว่า PEA ได้ทำการตรวจสอบแล้วก็ตาม หากเกิด
 ความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงให้อยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว
        <div>
6.2  ในกรณีที่ PEA เป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหน้า หรืออุปกรณ์ดังกล่าว
 เสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว 
        </div>
        <div>
6.3 สำหรับระบบอัดประจุยานยนต์ไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่ PEA ไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐาน
การติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า ตามที่ PEA กำหนด หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว
        </div>
      </div>
    </div>
    </div>
        <SignaturePadSection
          value={form.signature}
          onChange={(value) => handleSectionObject("signature", value)}
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
            {isSubmitting ? "กำลังบันทึก..." : (mode === "edit" ? "อัปเดตแบบฟอร์ม" : "บันทึกแบบฟอร์ม")}
          </button>
        </div>
      </form>
    </div>
  );
}