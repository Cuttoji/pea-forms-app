"use client";
import React, { useState, useRef } from "react";
import otherFormSchema, { getNewOtherTransformer } from "@/lib/constants/otherFormSchema";
import GeneralInfoSection from "../components/building/GeneralInfoSection";
import DocumentSection from "../components/building/DocumentSection";
import HVSystemSection from "../components/evCharger/HVSystemSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import TransformerSection from "../components/evCharger/TransformerSection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import OtherInspectionPDF from '../../../components/pdf/OtherInspectionPDF';

export default function OtherInspectionPage() {
  const [formData, setFormData] = useState({
    general: otherFormSchema.general,
    documents: otherFormSchema.documents,
    hvSystem: otherFormSchema.hvSystem,
    summary: otherFormSchema.summary,
    limitation: otherFormSchema.limitation,
    signature: otherFormSchema.signature
  });

  const handleSectionChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  const handleSectionObject = (section, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: value
    }));
  };

  const [transformers, setTransformers] = useState([getNewOtherTransformer()]);

  const addTransformer = () => {
    setTransformers(prev => [...prev, getNewOtherTransformer()]);
  };
  
  const removeTransformer = (index) => {
    if (transformers.length > 1) {
      setTransformers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleTransformerChange = (idx, key, value) => {
    setTransformers((old) =>
      old.map((t, i) => (i === idx ? { ...t, [key]: value } : t))
    );
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const formRef = useRef();

  // ไม่ต้อง import หรือใช้ supabase client ฝั่ง client
  // ส่งข้อมูลไป API /api/submit-form/other-inspection
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-form/other-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          transformers,
        }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert('บันทึกฟอร์มเรียบร้อยแล้ว!');
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการบันทึกฟอร์ม');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  // PDF generation function (เหมือนเดิม)
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const pdfData = {
        peaoffice: formData.general.peaOffice,
        inspectionnumber: formData.general.inspectionNumber,
        inspectiondate: formData.general.inspectionDate,
        requestnumber: formData.general.requestNumber,
        requestdate: formData.general.requestDate,
        fullname: formData.general.fullName,
        phone: formData.general.phone,
        address: formData.general.address,
        buildingtype: formData.general.buildingType,
        phasetype: formData.general.phaseType,
        estimatedload: formData.general.estimatedLoad,
        documents: formData.documents,
        hvSystem: formData.hvSystem,
        transformers: transformers,
        summaryresult: formData.summary,
        scopeofinspection: formData.limitation,
        userSignature: formData.signature.userSignature,
        inspectorSignature: formData.signature.inspectorSignature,
      };
      const blob = await pdf(<OtherInspectionPDF formData={pdfData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'other-inspection.pdf';
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
          แบบฟอร์มตรวจสอบระบบไฟฟ้าอื่นๆ
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6" ref={formRef}>
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            แบบฟอร์มตรวจสอบระบบไฟฟ้าอื่นๆ
          </h2>
          <p className="text-lg text-gray-600">
            การตรวจสอบระบบไฟฟ้าและอุปกรณ์ป้องกันสำหรับอาคารพิเศษ
          </p>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-6"></div>
        </div>

        <GeneralInfoSection 
          data={formData.general} 
          onChange={(field, value) => handleSectionChange("general", field, value)} 
        />
        
        <DocumentSection 
          value={formData.documents} 
          onChange={(value) => handleSectionObject("documents", value)} 
        />
        
        <HVSystemSection 
          value={formData.hvSystem} 
          onChange={(value) => handleSectionObject("hvSystem", value)} 
        />

        <div className="space-y-10 mb-6">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-6">หม้อแปลงไฟฟ้า</h3>
          </div>
          
          {transformers.map((transformer, index) => (
            <div key={index}>
              <TransformerSection
                transformer={transformer}
                index={index}
                onTransformerChange={handleTransformerChange}
                onRemove={() => removeTransformer(index)}
                canRemove={transformers.length > 1}
              />
            </div>
          ))}
          
          <div className="text-center">
            <button
              type="button"
              onClick={addTransformer}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
            >
              เพิ่มหม้อแปลง
            </button>
          </div>
        </div>

        <InspectionSummarySection 
          value={formData.summary} 
          onChange={(value) => handleSectionObject("summary", value)} 
        />
        
        <LimitationSection 
          value={formData.limitation} 
          onChange={(value) => handleSectionObject("limitation", value)} 
        />
        
        <SignaturePadSection 
          value={formData.signature}
          onChange={(value) => handleSectionObject("signature", value)}
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