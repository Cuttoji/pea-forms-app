"use client";
import React, { useState, useEffect } from "react";
import GeneralInfoSection from "../components/building/GeneralInfoSection";
import DocumentSection from "../components/building/DocumentSection";
import HVSystemSection from "../components/evCharger/HVSystemSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import TransformerSection from "../components/evCharger/TransformerSection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import LVSystemSectionCondo from "../components/building/LVSystemSectionCondo";
import condoFormSchema, { getNewCondoTransformer } from "@/lib/constants/condoFormSchema";
import CondoInspectionPDF from '../../../components/pdf/CondoInspectionPDF';
import { pdf } from "@react-pdf/renderer"; // เพิ่มถ้ายังไม่ได้ import


// รับ props แบบ optional เพื่อรองรับทั้งสร้างใหม่และ edit
export default function CondoInspectionPage(props) {
  const initialForm = props?.initialForm;

  const [formData, setFormData] = useState({
    general: condoFormSchema.general,
    documents: condoFormSchema.documents,
    hvSystem: condoFormSchema.hvSystem,
    lvSystem: condoFormSchema.lvSystem,
    transformers: condoFormSchema.transformers,
    summary: condoFormSchema.summary,
    limitation: condoFormSchema.limitation,
    signature: condoFormSchema.signature
  });

  // ถ้า initialForm มี transformers ให้ใช้เลย ไม่งั้น default 1 ตัว
  const [transformers, setTransformers] = useState(
    (initialForm && Array.isArray(initialForm.transformers) && initialForm.transformers.length > 0)
      ? initialForm.transformers
      : [getNewCondoTransformer()]
  );
  const [showPDF, setShowPDF] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // รับ initialForm กรณี edit
  useEffect(() => {
    if (initialForm) {
      setFormData({
        general: initialForm.general || condoFormSchema.general,
        documents: initialForm.documents || condoFormSchema.documents,
        hvSystem: initialForm.hvSystem || condoFormSchema.hvSystem,
        summary: initialForm.summary || condoFormSchema.summary,
        limitation: initialForm.limitation || "",
        signature: initialForm.signature || condoFormSchema.signature,
      });
      if (Array.isArray(initialForm.transformers)) {
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

  const handleAddTransformer = () => {
    setTransformers(prev => [...prev, getNewCondoTransformer()]);
  };

  const handleTransformerChange = (index, field, value) => {
    setTransformers(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบความครบถ้วนของข้อมูลก่อน submit
    const { validateAndScroll } = await import('@/lib/utils/formValidationHelper');
    
    // รวมข้อมูลทั้งหมด
    const payload = {
      general: formData.general,
      documents: formData.documents,
      hvSystem: formData.hvSystem,
      transformers,
      summary: formData.summary,
      limitation: formData.limitation,
      signature: formData.signature,
      created_at: new Date().toISOString(),
    };
    
    const isValid = validateAndScroll(payload, 'Condo');
    
    if (!isValid) {
      return; // หยุดการ submit ถ้าข้อมูลไม่ครบ
    }

    try {
      const response = await fetch("/api/submit-form/condo-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    }
  };

  // แก้ไขตรงนี้: ใช้ setIsGeneratingPDF (สะกดถูก) แทน setIsGenratingPDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // รวมข้อมูลตรงกับ payload ที่บันทึก/โหลด
      const pdfData = {
        general: formData.general,
        documents: formData.documents,
        hvSystem: formData.hvSystem,
        transformers: transformers,
        summary: formData.summary,
        limitation: formData.limitation,
        signature: formData.signature,
      };
      const blob = await pdf(<CondoInspectionPDF formData={pdfData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'condo-inspection.pdf';
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
    <>
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-10 py-8 px-4">


        <GeneralInfoSection 
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
          sectionNumber={2}
          value={formData.hvSystem}
          onChange={value => handleSectionObject("hvSystem", value)}
          data-section="hvSystem"
          id="hv-system-section"
        />

        {/* ระบบหม้อแปลง (ตกแต่งใหม่) */}
        <div className="space-y-10" data-section="transformers" id="transformers-section">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              4. ระบบหม้อแปลงและไฟฟ้าแรงต่ำ
            </h2>
            <div className="w-full h-1 bg-blue-200 from-green-500 to-blue-500 rounded-full"></div>
          </div>

          {transformers.map((transformer, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-blue-200 from-green-600 to-blue-600 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 text-lg font-bold text-gray-900">{idx + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700">
                      หม้อแปลงที่ {idx + 1}
                    </h3>
                  </div>
                  {transformers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTransformers(prev => prev.filter((_, i) => i !== idx))}
                      className="px-6 py-3 bg-white bg-opacity-20 text-gray-900 text-base font-medium rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                      ลบหม้อแปลง
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8 space-y-10">
                <TransformerSection
                  sectionNumber={4}
                  value={transformer.transformerData}
                  onChange={(updatedTransformer) => {
                    handleTransformerChange(idx, "transformerData", updatedTransformer);
                  }}
                />

                <LVSystemSectionCondo
                  value={transformer.lvSystem || {}}
                  onChange={(lvData) =>
                    handleTransformerChange(idx, "lvSystem", lvData)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddTransformer}
            className="px-8 py-4 bg-green-400 from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            + เพิ่มหม้อแปลง
          </button>
        </div>

        
        <InspectionSummarySection
          value={formData.summary?.summaryType || ""}
          onChange={(value) => handleSectionObject("summary", { summaryType: value })}
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
          5.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน ตลอดจนข้อปลีกย่อย
 อื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าให้เป็นไปตามมาตรฐาน  
การติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิด
 ความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงให้อยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว
        <div>
5.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหน้า หรือ
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

        {/* Submit Button */}
        <div className="flex justify-center gap-4 pt-8 border-t border-gray-200">
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
    </>
  );
}