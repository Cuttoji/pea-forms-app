"use client";

import React, { useState, useRef } from "react";
import GeneralInfoSection from "../components/construction/GeneralInfoSection";
import ConstructionInspectionSection from "../components/construction/ConstructionInspectionSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import constructionFormSchema from "@/lib/constants/constructionFormSchema";
import ConstructionInspectionPDF from '../../../components/pdf/ConstructionInspectionPDF';

export default function ConstructionInspectionPage() {
  const [formData, setFormData] = useState(constructionFormSchema);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const formRef = useRef();

  const handleFormChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Implement form submission logic
  };

  // PDF generation function
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      
      // Transform form data to match PDF component expectations
      const pdfData = {
        // General info
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
        
        // Construction inspection data
        inspection: formData.inspection,
        
        // Summary
        summaryresult: formData.summary,
        
        // Limitation
        scopeofinspection: formData.limitation,
        
        // Signatures
        userSignature: formData.signature?.userSignature,
        inspectorSignature: formData.signature?.inspectorSignature,
      };
      
      const blob = await pdf(<ConstructionInspectionPDF formData={pdfData} />).toBlob();
      
      // Create download link
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          แบบฟอร์มตรวจสอบการก่อสร้าง
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6" ref={formRef}>
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            แบบฟอร์มตรวจสอบการก่อสร้าง
          </h2>
          <p className="text-lg text-gray-600">
            การตรวจสอบความปลอดภัยและมาตรฐานการก่อสร้าง
          </p>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-6"></div>
        </div>

        <GeneralInfoSection 
          data={formData} 
          onChange={handleFormChange} 
        />
        
        <ConstructionInspectionSection 
          data={formData} 
          onChange={handleFormChange} 
        />
        
        <InspectionSummarySection 
          value={formData.summary} 
          onChange={(value) => handleFormChange("summary", value)} 
        />
        
        <LimitationSection 
          value={formData.limitation} 
          onChange={(value) => handleFormChange("limitation", value)} 
        />
        
        <SignaturePadSection 
          value={formData.signature}
          onChange={(value) => handleFormChange("signature", value)}
        />

        {/* Submit Buttons */}
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
