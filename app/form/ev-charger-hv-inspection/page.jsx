"use client";

import React, { useState, useRef } from "react";
import { getNewSubCircuit, getNewEvCharger, getNewTransformer } from "@/lib/constants/evHvChargerFormSchema";
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
  const [general, setGeneral] = useState(evHvChargerFormSchema.general || {});
  const [docAreaType, setDocAreaType] = useState("personal");
  const [docs, setDocs] = useState(evHvChargerFormSchema.documents || {});
  const [hvSystem, setHvSystem] = useState(evHvChargerFormSchema.hvSystem || {});
  const [lvSystem, setLvSystem] = useState(evHvChargerFormSchema.lvSystem || {});
  const [summary, setSummary] = useState(evHvChargerFormSchema.summary || {});
  const [limitation, setLimitation] = useState(evHvChargerFormSchema.limitation || {});
  const [signature, setSignature] = useState(evHvChargerFormSchema.signature || {});

  // Use helper functions from schema
  const [transformers, setTransformers] = useState([getNewTransformer()]);

  const addTransformer = () => {
    setTransformers(prev => [...prev, getNewTransformer()]);
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
  

  const handleAddEvCharger = (transformerIndex, subCircuitIndex) => {
    setTransformers(prev =>
      prev.map((transformer, tIdx) => {
        if (tIdx === transformerIndex) {
          const newSubCircuits = transformer.subCircuits.map((subCircuit, sIdx) => {
            if (sIdx === subCircuitIndex) {
              const newEvChargers = [...(subCircuit.evChargers || []), getNewEvCharger()];
              return { ...subCircuit, evChargers: newEvChargers };
            }
            return subCircuit;
          });
          return { ...transformer, subCircuits: newSubCircuits };
        }
        return transformer;
      })
    );
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // PDF generation function
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      
      // Transform form data to match PDF component expectations
      const pdfData = {
        // General info
        peaoffice: general.peaOffice,
        inspectionnumber: general.inspectionNumber,
        inspectiondate: general.inspectionDate,
        requestnumber: general.requestNumber,
        requestdate: general.requestDate,
        fullname: general.fullName,
        phone: general.phone,
        address: general.address,
        phasetype: general.phaseType,
        estimatedload: general.estimatedLoad,
        
        // Documents
        documents: docs,
        docAreaType: docAreaType,
        
        // HV System
        hvSystem: hvSystem,
        
        // LV System
        lvSystem: lvSystem,
        
        // Transformers with their sub circuits
        transformers: transformers,
        
        // Summary
        summaryresult: summary,
        
        // Limitation
        scopeofinspection: limitation,
        
        // Signatures
        userSignature: signature.userSignature,
        inspectorSignature: signature.inspectorSignature,
      };
      
      const blob = await pdf(<EVChargerHVInspectionPDF formData={pdfData} />).toBlob();
      
      // Create download link
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

  const formRef = useRef();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          แบบตรวจสอบหม้อแปลงไฟฟ้าและระบบจำหน่ายไฟฟ้าแรงสูง สำหรับสถานีชาร์จรถยนต์ไฟฟ้า
        </h1>
      </div>
      
      <div ref={formRef} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าก่อนติดตั้งมิเตอร์
        </h2>
        <p className="text-center text-gray-600 mb-6">
          สำหรับผู้ใช้ไฟฟ้าที่รับไฟฟ้าแรงสูงโดยติดตั้งหม้อแปลงเฉพาะราย
        </p>

        <GeneralInfoHvSection
          data={general}
          onChange={(k, v) => setGeneral((o) => ({ ...o, [k]: v }))}
        />

        <DocumentSection
          areaType={docAreaType}
          value={docs}
          onChange={setDocs}
        />
        
        <HVSystemSection
          value={hvSystem}
          onChange={setHvSystem}
        />

        <div className="space-y-8 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              4. หม้อแปลงและระบบไฟฟ้าแรงต่ำ
            </h2>
            <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500 mb-6"></div>
          </div>

          {transformers.map((transformer, transformerIndex) => (
            <div
              key={transformerIndex}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    หม้อแปลง #{transformerIndex + 1}
                  </h3>
                  {transformers.length > 1 && (
                    <button
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
                  onChange={(updatedTransformer) => {
                    handleTransformerChange(
                      transformerIndex,
                      "transformerData",
                      updatedTransformer
                    );
                  }}
                />

                <LVSystemSection
                  value={transformer.lvSystem || {}}
                  onChange={(lvData) =>
                    handleTransformerChange(transformerIndex, "lvSystem", lvData)
                  }
                />

                <PanelBoardSection
                  value={transformer.panel || {}}
                  sectionNumber={5}
                  onChange={(panelData) =>
                    handleTransformerChange(transformerIndex, "panel", panelData)
                  }
                />

                <div className="mb-8 border p-4 rounded">
                  <div className="font-bold mb-2">วงจรย่อยของหม้อแปลงที่ {transformerIndex + 1}</div>
                  <SubCircuitSection
                    sectionNumber={5}
                    value={transformer.subCircuits}
                    onChange={val => handleTransformerChange(transformerIndex, "subCircuits", val)}
                    onAddCharger={(subCircuitIndex) => handleAddEvCharger(transformerIndex, subCircuitIndex)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={addTransformer}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors mb-6"
          >
            + เพิ่มหม้อแปลง
          </button>
        </div>

        <InspectionSummarySection
          value={summary}
          onChange={setSummary}
        />
        <LimitationSection
          value={limitation}
          onChange={setLimitation}
        />
        <SignaturePadSection
          value={signature}
          onChange={setSignature}
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
          <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200">
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}