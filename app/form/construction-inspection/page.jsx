"use client";
import React, { useState, useEffect } from "react";
import constructionFormSchema from "@/lib/constants/constructionFormSchema";
import GeneralInfoSection from "../components/construction/GeneralInfoSection";
import ConstructionInspectionSection from "../components/construction/ConstructionInspectionSection";
import SummarySection from "../components/construction/SummarySection";
import ConstructionInspectionPDF from '../../../components/pdf/constructioninspectionPDF';

export default function ConstructionInspectionClient({ props }) {
  const initialForm = props?.initialForm;
  const safeInitial = initialForm && typeof initialForm === "object" ? initialForm : constructionFormSchema;
  const [formData, setFormData] = useState(safeInitial);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-form/construction-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert("บันทึกฟอร์มสำเร็จ!");
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

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const pdfData = {
        peaoffice: formData.general?.peaOffice,
        inspectionnumber: formData.general?.inspectionNumber,
        inspectiondate: formData.general?.inspectionDate,
        requestnumber: formData.general?.requestNumber,
        requestdate: formData.general?.requestDate,
        fullname: formData.general?.fullName,
        phone: formData.general?.phone,
        address: formData.general?.address,
        buildingtype: formData.general?.buildingType,
        constructiontype: formData.general?.constructionType,
        inspection: formData.inspection,
        summaryresult: formData.summary,
        scopeofinspection: formData.limitation,
        userSignature: formData.signature?.userSignature,
        inspectorSignature: formData.signature?.inspectorSignature,
      };
      const blob = await pdf(<ConstructionInspectionPDF formData={pdfData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'construction-inspection.pdf';
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
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <GeneralInfoSection
          value={formData.general}
          onChange={(field, val) =>
            setFormData(prev => ({
              ...prev,
              general: {
                ...prev.general,
                [field]: val
              }
            }))
          }
        />
        <ConstructionInspectionSection
          value={formData.inspection}
          onChange={value => handleFormChange("inspection", value)}
        />
        <SummarySection
          value={formData.summary}
          onChange={value => handleFormChange("summary", value)}
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
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกฟอร์ม"}
          </button>
        </div>
      </form>
    </div>
  );
}
