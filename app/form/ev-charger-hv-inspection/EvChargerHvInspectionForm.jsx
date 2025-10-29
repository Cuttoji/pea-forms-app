"use client";

import React, { useState } from "react";

import { getNewEvCharger, getNewTransformer } from "@/lib/constants/evHvChargerFormSchema";
import GeneralInfoHvSection from "@/app/form/components/evCharger/GeneralInfoHvSection";
import DocumentSectionhv from "@/app/form/components/evCharger/DocumentSectionhv";
import TransformerSection from "@/app/form/components/evCharger/TransformerSection";
import SubCircuitSection from "@/app/form/components/evCharger/SubCircuitSection";
import LVSystemSection from "@/app/form/components/evCharger/LVSystemSection";
import PanelBoardSection from "@/app/form/components/evCharger/PanelBoardSection";
import HVSystemSection from "@/app/form/components/evCharger/HVSystemSection";
import InspectionSummarySection from "@/app/form/components/shared/InspectionSummarySection";
import LimitationSection from "@/app/form/components/shared/LimitationSection";
import SignaturePadSection from "@/app/form/components/shared/SignaturePadSection";
import evHvChargerFormSchema from "@/lib/constants/evHvChargerFormSchema";
import EVChargerHVExportPDF from '../../../components/pdf/EVChargerHVExportPDF';

export default function EvChargerHvInspectionForm({ initialForm }) {
  const [form, setForm] = useState(
    initialForm || {
      general: evHvChargerFormSchema.general,
      documents: evHvChargerFormSchema.documents,
      hvSystem: evHvChargerFormSchema.hvSystem,
      transformers: [getNewTransformer()],
      summary: evHvChargerFormSchema.summary,
      limitation: evHvChargerFormSchema.limitation,
      signature: evHvChargerFormSchema.signature,
    }
  );

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  React.useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
    }
  }, [initialForm]);

  const addTransformer = () => {
    setForm(prev => ({
      ...prev,
      transformers: [...prev.transformers, getNewTransformer()],
    }));
  };

  const removeTransformer = (index) => {
    setForm(prev => ({
      ...prev,
      transformers: prev.transformers.length > 1
        ? prev.transformers.filter((_, i) => i !== index)
        : prev.transformers,
    }));
  };

  const handleTransformerChange = (idx, key, value) => {
    setForm(prev => ({
      ...prev,
      transformers: prev.transformers.map((t, i) =>
        i === idx ? { ...t, [key]: value } : t
      ),
    }));
  };

  const handleAddEvCharger = (transformerIndex, subCircuitIndex) => {
    setForm(prev => ({
      ...prev,
      transformers: prev.transformers.map((transformer, tIdx) => {
        if (tIdx === transformerIndex) {
          const newSubCircuits = (transformer.subCircuits || []).map((subCircuit, sIdx) => {
            if (sIdx === subCircuitIndex) {
              const newEvChargers = [...(subCircuit.evChargers || []), getNewEvCharger()];
              return { ...subCircuit, evChargers: newEvChargers };
            }
            return subCircuit;
          });
          return { ...transformer, subCircuits: newSubCircuits };
        }
        return transformer;
      }),
    }));
  };

  const handleSectionChange = (section, value) => {
    setForm(prev => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleGeneralChange = (field, fieldValue) => {
    setForm(prev => ({
      ...prev,
      general: { ...prev.general, [field]: fieldValue }
    }));
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const pdfData = {
        general: form.general,
        documents: form.documents,
        hvSystem: form.hvSystem,
        transformers: form.transformers,
        summary: form.summary,
        limitation: form.limitation,
        signature: form.signature,
      };
      const blob = await pdf(<EVChargerHVExportPDF formData={pdfData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ev-charger-hv-inspection.pdf';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-form/ev-charger-hv-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert("บันทึกฟอร์มสำเร็จ!");
      } else {
        alert(result.error || "เกิดข้อผิดพลาดในการบันทึกฟอร์ม");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      console.error(err);
    }
  };

  // แก้ไขการจัดการ LVSystem
  const handleLVSystemChange = (transformerIndex, newLVSystemData) => {
    console.log(`=== Updating LV System for transformer ${transformerIndex} ===`);
    console.log('New LV System data:', newLVSystemData);
    
    setForm(prev => {
      const updatedTransformers = [...prev.transformers];
      
      // ตรวจสอบว่า transformer index มีอยู่จริง
      if (updatedTransformers[transformerIndex]) {
        updatedTransformers[transformerIndex] = {
          ...updatedTransformers[transformerIndex],
          lvSystem: newLVSystemData
        };
        
        console.log(`Updated transformer ${transformerIndex}:`, updatedTransformers[transformerIndex]);
      }
      
      const updatedForm = {
        ...prev,
        transformers: updatedTransformers
      };
      
      console.log('Updated complete form:', updatedForm);
      return updatedForm;
    });
  };

  return (
    <div className="min-h-screen p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">

        <GeneralInfoHvSection
          value={form.general}
          onChange={handleGeneralChange}
          data-section="general"
          id="general-info-section"
        />

        <DocumentSectionhv
          value={form.documents}
          onChange={value => handleSectionChange("documents", value)}
          data-section="documents"
          id="document-section"
        />

        <HVSystemSection
          value={form.hvSystem}
          onChange={value => handleSectionChange("hvSystem", value)}
          data-section="hvSystem"
          id="hv-system-section"
        />

        <div className="space-y-8 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              4. หม้อแปลงและระบบไฟฟ้าแรงต่ำ
            </h2>
            <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500 mb-6"></div>
          </div>

          <div data-section="transformers" id="transformers-section">
          {form.transformers.map((transformer, transformerIndex) => (
            <div
              key={transformerIndex}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    หม้อแปลง #{transformerIndex + 1}
                  </h3>
                  {form.transformers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTransformer(transformerIndex)}
                      className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                    >
                      ลบหม้อแปลง
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-8">
                <TransformerSection
                  sectionNumber={4}
                  value={transformer.transformerData || {}}
                  onChange={updatedTransformer =>
                    handleTransformerChange(transformerIndex, "transformerData", updatedTransformer)
                  }
                />

                <LVSystemSection
                  value={transformer.lvSystem || {}}
                  onChange={(lvData) => handleLVSystemChange(transformerIndex, lvData)}
                  transformerIndex={transformerIndex}
                />

                <PanelBoardSection
                  value={transformer.panel || {}}
                  sectionNumber={5}
                  onChange={panelData =>
                    handleTransformerChange(transformerIndex, "panel", panelData)
                  }
                />

                <div className="mb-8 border p-4 rounded">
                  <div className="font-bold mb-2">วงจรย่อยของหม้อแปลงที่ {transformerIndex + 1}</div>
                  <SubCircuitSection
                    sectionNumber={5}
                    value={transformer.subCircuits}
                    onChange={value =>
                      handleTransformerChange(transformerIndex, "subCircuits", value)
                    }
                    onAddCharger={subCircuitIndex =>
                      handleAddEvCharger(transformerIndex, subCircuitIndex)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addTransformer}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors mb-6"
          >
            + เพิ่มหม้อแปลง
          </button>
        </div>

        <InspectionSummarySection
          value={form.summary}
          onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))}
          data-section="summary"
          id="summary-section"
        />
        <LimitationSection
          value={form.limitation}
          onChange={value => handleSectionChange("limitation", value)}
        />
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">4. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ </h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 text-gray-700">
        <div className="space-y-4">
          8.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าที่รับไฟฟ้าจากหม้อแปลงเฉพาะราย ตลอดจนข้อปลีกย่อยอื่นๆ    
ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง PEA จะตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้ง
 ระบบอัดประจุยานยนต์ไฟฟ้า ตามที่ PEA กำหนด และแม้ว่า PEA ได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้น
 ภายหลังการตรวจสอบแล้วก็ยังคงให้อยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว
        <div>
8.2 ในกรณีที่ PEA เป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหน้า หรืออุปกรณ์ดังกล่าว
 เสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว 
        </div>
        <div>
8.3 สำหรับระบบอัดประจุยานยนต์ไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่ PEA ไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐาน        
การติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า ตามที่ PEA กำหนด หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว
        </div>
      </div>
    </div>
    </div>

        <SignaturePadSection
          value={form.signature}
          onChange={value => handleSectionChange("signature", value)}
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
            className="bg-blue-700 text-white px-8 py-2 rounded shadow font-bold hover:bg-blue-800 disabled:opacity-50"
          >
            บันทึกแบบฟอร์ม
          </button>
        </div>
      </form>
    </div>
  );
}