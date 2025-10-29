"use client";
import React, { useEffect, useState, useRef } from "react";
import otherFormSchema, { getNewOtherTransformer } from "@/lib/constants/otherFormSchema";
import GeneralInfoSectionOther from "../components/building/GeneralInfoSectionOther";
import DocumentSection from "../components/building/DocumentSection";
import HVSystemSection from "../components/evCharger/HVSystemSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import TransformerSection from "../components/evCharger/TransformerSection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import OtherInspectionPDF from '../../../components/pdf/OtherInspectionPDF';

export default function OtherInspectionPage({ initialForm }) {
  const [formData, setFormData] = useState({
    general: otherFormSchema.general,
    documents: otherFormSchema.documents,
    hvSystem: otherFormSchema.hvSystem,
    summary: otherFormSchema.summary,
    limitation: otherFormSchema.limitation,
    signature: otherFormSchema.signature
  });

  const [transformers, setTransformers] = useState([getNewOtherTransformer()]);

  useEffect(() => {
    if (initialForm) {
      setFormData(initialForm);
      // Load transformers data from initialForm
      if (initialForm.transformers && Array.isArray(initialForm.transformers) && initialForm.transformers.length > 0) {
        setTransformers(initialForm.transformers);
      }
    }
  }, [initialForm]);

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

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const formRef = useRef();

  // ไม่ต้อง import หรือใช้ supabase client ฝั่ง client
  // ส่งข้อมูลไป API /api/submit-form/other-inspection
  const handleSubmit = async (e) => {
    e.preventDefault();
    // สร้าง payload จากข้อมูลฟอร์ม
    const payload = {
      general: formData.general,
      documents: formData.documents,
      hvSystem: formData.hvSystem,
      transformers: transformers,
      summary: formData.summary,
      limitation: formData.limitation,
      signature: formData.signature,
    };
    try {
      const response = await fetch('/api/submit-form/other-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  // PDF generation function (ปรับใหม่)
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const pdfData = {
        general: formData.general,
        documents: formData.documents,
        hvSystem: formData.hvSystem,
        transformers: transformers,
        summary: formData.summary,
        limitation: formData.limitation,
        signature: formData.signature,
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
    <div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6" ref={formRef}>

        <GeneralInfoSectionOther
          data={formData.general}
          onChange={(field, value) => handleSectionChange("general", field, value)}
          data-section="general"
          id="general-info-section"
        />
        
        <DocumentSection 
          value={formData.documents} 
          onChange={(value) => handleSectionObject("documents", value)} 
          data-section="documents"
          id="document-section"
        />
        
        <HVSystemSection 
          value={formData.hvSystem} 
          onChange={(value) => handleSectionObject("hvSystem", value)} 
          data-section="hvSystem"
          id="hv-system-section"
        />

        <div className="space-y-10 mb-6" data-section="transformers" id="transformers-section">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-6">หม้อแปลงไฟฟ้า</h3>
          </div>
          
          <TransformerSection
            value={transformers}
            onChange={setTransformers}
          />
        </div>

        <InspectionSummarySection 
          value={formData.summary} 
          onChange={(value) => handleSectionObject("summary", value)} 
          data-section="summary"
          id="summary-section"
        />
        
        <LimitationSection 
          value={formData.limitation} 
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
          5.1  งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆ นอกเหนือจากที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจน
 ข้อปลีกย่อยอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าให้เป็นไปตาม
 มาตรฐานการติดตั ้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม 
หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงให้อยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว
        <div>
5.2  ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหน้า หรือ
 อุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว
        </div>
        <div>
5.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้ง
 ทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว
        </div>
      </div>
    </div>
    </div>
        <SignaturePadSection 
          value={formData.signature}
          onChange={(value) => handleSectionObject("signature", value)}
          data-section="signature"
          id="signature-section"
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
            className="bg-blue-700 text-white px-8 py-2 rounded shadow font-bold hover:bg-blue-800 disabled:opacity-50"
          >
            บันทึกแบบฟอร์ม
          </button>
        </div>
      </form>
    </div>
  );
}