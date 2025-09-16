"use client";

import React, { useState } from "react";
import GeneralInfoHvSection from "@/app/form/components/evCharger/GeneralInfoHvSection";
import DocumentSection from "@/app/form/components/evCharger/DocumentSection";
import TransformerSection from "@/app/form/components/evCharger/TransformerSection";
import SubCircuitSection from "@/app/form/components/evCharger/SubCircuitSection";
import LVSystemSection from "@/app/form/components/evCharger/LVSystemSection";
import PanelBoardSection from "@/app/form/components/evCharger/PanelBoardSection";
import HVSystemSection from "@/app/form/components/evCharger/HVSystemSection";
import EvChargerCheckSection from "@/app/form/components/evCharger/EvChargerCheckSection";

// ตัวอย่างโครงสร้าง state หลัก
export default function EvChargerHvInspectionPage() {
  // ข้อมูลหลัก
  const [general, setGeneral] = useState({});
  const [docAreaType, setDocAreaType] = useState("personal");
  const [docs, setDocs] = useState({});
  const [evCharger, setEvCharger] = useState({});
  const [transformers, setTransformers] = useState([
    {
      hasPanel: false,
      panel: {},
    },
  ]); // Initialize with one transformer
  const [lv, setLv] = useState({});
  const [hvSystem, setHvSystem] = useState({});

  // Add transformer function
  const addTransformer = () => {
    setTransformers([...transformers, { hasPanel: false, panel: {} }]);
  };
  const handleSubCircuitChange = (idx, subValue) => {
    setTransformers(arr =>
      arr.map((t, i) => i === idx ? { ...t, subCircuits: subValue } : t)
    );
  };
  
  // Remove transformer function
  const removeTransformer = (index) => {
    if (transformers.length > 1) {
      setTransformers(transformers.filter((_, i) => i !== index));
    }
  };

  // Handle transformer changes
  const handleTransformerChange = (idx, key, value) => {
    setTransformers((old) =>
      old.map((t, i) => (i === idx ? { ...t, [key]: value } : t))
    );
  };

  // เพิ่มฟังก์ชันเพิ่มวงจรย่อยสำหรับแต่ละหม้อแปลง
  const handleAddSubCircuit = (transformerIdx) => {
    setTransformers(arr =>
      arr.map((t, i) =>
        i === transformerIdx
          ? {
              ...t,
              subCircuits: [
                ...(t.subCircuits || []),
                {
                  circuitNo: "",
                  evOnly: {},
                  evOnePerCircuit: {},
                  standard: [],
                  wireType: [],
                  wireTypeOther: "",
                  phaseSize: "",
                  phaseSizeCheck: {},
                  neutralSize: "",
                  neutralSizeCheck: {},
                  groundSize: "",
                  groundSizeCheck: {},
                  phaseColor: {},
                  wirewayMechanical: {},
                  method: [],
                  methodConduitWallSize: "",
                  methodConduitBuriedSize: "",
                  methodWirewayW: "",
                  methodWirewayH: "",
                  methodCableTrayW: "",
                  methodCableTrayH: "",
                  methodOther: "",
                  methodCheck: {},
                  conduitType: [],
                  conduitTypeOther: "",
                  conduitCheck: {},
                  breakerStandard: false,
                  breakerMode3: false,
                  breakerMode3AT: "",
                  breakerMode2: false,
                  breakerMode2AT: "",
                  breakerCheck: {},
                  breakerSizeCheck: {},
                  rcdTypeB: false,
                  rcdTypeBIn: "",
                  rcdTypeAFPlusDD: false,
                  rcdTypeBInCharger: false,
                  rcdTypeBInChargerIn: "",
                  isolatingTransformer: false,
                  rcdCheck: {},
                  rcdTypeBMain: {},
                }
              ]
            }
          : t
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าก่อนติดตั้งมิเตอร์
          <span>สำหรับผู้ใช้ไฟฟ้าที่รับไฟฟ้าแรงสูงโดยติดตั้งหม้อแปลงเฉพาะราย</span>
        </h1>
      </div>

      {/* 1. ข้อมูลทั่วไป */}
      <GeneralInfoHvSection
        data={general}
        onChange={(k, v) => setGeneral((o) => ({ ...o, [k]: v }))}
      />

      {/* 2. เอกสารประกอบ */}
      <DocumentSection
        areaType={docAreaType}
        value={docs}
        onChange={setDocs}
      />

      {/* 3. ระบบไฟฟ้าแรงสูง */}
      <HVSystemSection
        value={hvSystem}
        onChange={setHvSystem}
      />

      {/* 4. หม้อแปลงและระบบไฟฟ้าแรงต่ำ */}
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
              {/* Transformer Section */}
              <TransformerSection
                value={transformer}
                onChange={(updatedTransformer) => {
                  handleTransformerChange(
                    transformerIndex,
                    "transformerData",
                    updatedTransformer
                  );
                }}
                mode="evCharger"
              />

              {/* LV System Section */}
              <LVSystemSection
                value={transformer.lvSystem || {}}
                onChange={(lvData) =>
                  handleTransformerChange(transformerIndex, "lvSystem", lvData)
                }
              />

              {/* Panel Board Section with Toggle */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-3 rounded-lg border-l-4 border-orange-500">
                  <h4 className="text-base font-semibold text-gray-900">
                    วงจรสายป้อน/แผงวงจรย่อย (Panel board)
                  </h4>
                </div>

                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!transformer.hasPanel}
                      onChange={(e) =>
                        handleTransformerChange(
                          transformerIndex,
                          "hasPanel",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded"
                    />
                    <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                      มีวงจรสายป้อน/แผงวงจรย่อย (Panel board)
                    </span>
                  </label>

                  {transformer.hasPanel && (
                    <div className="mt-4">
                      <PanelBoardSection
                        value={transformer.panel || {}}
                        onChange={(panelData) =>
                          handleTransformerChange(transformerIndex, "panel", panelData)
                        }
                        mode="general"
                        customSectionNumbers={{
                          main: `4.${transformerIndex + 1}.5`,
                          sub: [
                            `4.${transformerIndex + 1}.5.1`,
                            `4.${transformerIndex + 1}.5.2`,
                            `4.${transformerIndex + 1}.5.3`,
                            `4.${transformerIndex + 1}.5.4`,
                            `4.${transformerIndex + 1}.5.5`,
                          ],
                        }}
                        customTitle="วงจรสายป้อน/แผงวงจรย่อย (Panel board)"
                        enableLoop={false}
                      />
                    </div>
                  )}

                  {!transformer.hasPanel && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-yellow-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="text-sm text-yellow-800">
                          <strong className="font-semibold">หมายเหตุ:</strong>{" "}
                          หม้อแปลงนี้ไม่มีวงจรสายป้อน/แผงวงจรย่อย (Panel board) จึงไม่จำเป็นต้องตรวจสอบรายการในส่วนนี้
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* วงจรย่อยของหม้อแปลงนี้ */}
              <div className="mb-8 border p-4 rounded">
                <div className="font-bold mb-2">{transformer.name}</div>
                <SubCircuitSection
                  sectionNumber={5}
                  value={transformer.subCircuits}
                  onChange={val => handleTransformerChange(transformerIndex, "subCircuits", val)}
                />
                {/* ปุ่มเพิ่มวงจรย่อย */}
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => handleAddSubCircuit(transformerIndex)}
                  >
                    + เพิ่มวงจรย่อย
                  </button>
                </div>
              </div>
            </div>
            
        <div className="flex justify-center">
          <button
            onClick={addTransformer}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors mb-6"
          >
            + เพิ่มหม้อแปลง
          </button>
        </div>

          </div>
        ))}
      </div>

      {/* ปุ่มบันทึก */}
      <div className="flex justify-center mt-8">
        <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200">
          บันทึกข้อมูล
        </button>
      </div>
    </div>
  );
}