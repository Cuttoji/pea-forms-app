"use client";

import React, { useState } from "react";

import { getNewEvCharger, getNewTransformer } from "@/lib/constants/evHvChargerFormSchema";
import GeneralInfoHvSection from "@/app/form/components/evCharger/GeneralInfoHvSection";
import DocumentSection from "@/app/form/components/evCharger/DocumentSection";
import TransformerSection from "@/app/form/components/evCharger/TransformerSection";
import SubCircuitSection from "@/app/form/components/evCharger/SubCircuitSection";
import LVSystemSection from "@/app/form/components/evCharger/LVSystemSection";
import PanelBoardSection from "@/app/form/components/evCharger/PanelBoardSection";
import HVSystemSection from "@/app/form/components/evCharger/HVSystemSection";
import InspectionSummarySection from "@/app/form/components/shared/InspectionSummarySection";
import LimitationSection from "@/app/form/components/shared/LimitationSection";
import SignaturePadSection from "@/app/form/components/shared/SignaturePadSection";
import evHvChargerFormSchema from "@/lib/constants/evHvChargerFormSchema";
import EVChargerHVInspectionPDF from '../../../components/pdf/EVChargerHVInspectionPDF';

export default function EvChargerHvInspectionPage() {
  // ใช้ state เดียวสำหรับทุก section
  const [form, setForm] = useState({
    general: evHvChargerFormSchema.general,
    documents: evHvChargerFormSchema.documents,
    hvSystem: evHvChargerFormSchema.hvSystem,
    transformers: [getNewTransformer()],
    summary: evHvChargerFormSchema.summary,
    limitation: evHvChargerFormSchema.limitation,
    signature: evHvChargerFormSchema.signature,
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // เพิ่มหม้อแปลง
  const addTransformer = () => {
    setForm(prev => ({
      ...prev,
      transformers: [...prev.transformers, getNewTransformer()],
    }));
  };

  // ลบหม้อแปลง
  const removeTransformer = (index) => {
    setForm(prev => ({
      ...prev,
      transformers: prev.transformers.length > 1
        ? prev.transformers.filter((_, i) => i !== index)
        : prev.transformers,
    }));
  };

  // เปลี่ยนค่าใน transformer
  const handleTransformerChange = (idx, key, value) => {
    setForm(prev => ({
      ...prev,
      transformers: prev.transformers.map((t, i) =>
        i === idx ? { ...t, [key]: value } : t
      ),
    }));
  };

  // เพิ่ม EV Charger ใน subcircuit
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

  // เปลี่ยนค่าในแต่ละ section (object ทั้งก้อน)
  const handleSectionChange = (section, value) => {
    setForm(prev => ({
      ...prev,
      [section]: value,
    }));
  };

  // เปลี่ยนค่าใน general section (field, value)
  const handleGeneralChange = (field, fieldValue) => {
    setForm(prev => ({
      ...prev,
      general: { ...prev.general, [field]: fieldValue }
    }));
  };

  // PDF generation function
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      // เตรียมข้อมูลสำหรับ PDF
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
        buildingtype: form.general.buildingType,
        documents: form.documents,
        hvSystem: form.hvSystem,
        transformers: form.transformers,
        lvSystem: form.transformers.map(t => t.lvSystem),
        summaryresult: form.summary,
        scopeofinspection: form.limitation,
        userSignature: form.signature.userSignature,
        inspectorSignature: form.signature.inspectorSignature,
      };
      const blob = await pdf(<EVChargerHVInspectionPDF formData={pdfData} />).toBlob();
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

  // ส่งข้อมูลไป API (ไม่ต้อง import supabase client)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/submit-form/ev-charger-hv-inspection", {
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
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าก่อนติดตั้งมิเตอร์
        </h2>
        <p className="text-center text-gray-600 mb-6">
          สำหรับผู้ใช้ไฟฟ้าที่รับไฟฟ้าแรงสูงโดยติดตั้งหม้อแปลงเฉพาะราย
        </p>

        <GeneralInfoHvSection
          value={form.general}
          onChange={handleGeneralChange}
        />

        <DocumentSection
          value={form.documents}
          onChange={value => handleSectionChange("documents", value)}
        />

        <HVSystemSection
          value={form.hvSystem}
          onChange={value => handleSectionChange("hvSystem", value)}
        />

        <div className="space-y-8 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              4. หม้อแปลงและระบบไฟฟ้าแรงต่ำ
            </h2>
            <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500 mb-6"></div>
          </div>

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
                  onChange={lvData =>
                    handleTransformerChange(transformerIndex, "lvSystem", lvData)
                  }
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
          onChange={value => handleSectionChange("summary", value)}
        />
        <LimitationSection
          value={form.limitation}
          onChange={value => handleSectionChange("limitation", value)}
        />
        <SignaturePadSection
          value={form.signature}
          onChange={value => handleSectionChange("signature", value)}
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