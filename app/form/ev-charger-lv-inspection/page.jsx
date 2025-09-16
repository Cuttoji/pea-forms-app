"use client";
import React from "react";
import DocumentSection from "../components/evCharger/DocumentSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import PanelBoardSection from "../components/evCharger/PanelBoardSection";

export default function EvChargerLvInspectionPage() {
  const [form, setForm] = React.useState({
    general: {},
    inspection: {},
    documents: {},
    summary: "",
    limitation: "",
    signature: "",
  });
  // ฟังก์ชันสำหรับเปลี่ยนค่าในแต่ละ section
  const handleSectionChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
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
  // ฟังก์ชันบันทึกหรือส่งฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
        แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า (EV Charger) ระดับแรงดันต่ำ
      </h1>
      <DocumentSection
        value={form.documents}
        onChange={(value) => handleSectionObject("documents", value)}
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

      <InspectionSummarySection
        value={form.summary}
        onChange={(value) => handleSectionChange("summary", null, value)}
      />
      <LimitationSection
        value={form.limitation}
        onChange={(value) => handleSectionChange("limitation", null, value)}
      />
      <SignaturePadSection
        value={form.signature}
        onChange={(value) => handleSectionChange("signature", null, value)}
      />
    </form>
  );
}