"use client";
import React from "react";
import evLvChargerFormSchema, { getNewLvSubCircuit, getNewLvEvCharger } from "@/lib/constants/evLvChargerFormSchema";
import DocumentSection from "../components/evCharger/DocumentSection";
import InspectionSummarySection from "../components/shared/InspectionSummarySection";
import LimitationSection from "../components/shared/LimitationSection";
import SignaturePadSection from "../components/shared/SignaturePadSection";
import PanelBoardSection from "../components/evCharger/PanelBoardSection";
import SubCircuitSection from "../components/evCharger/SubCircuitSection";
import GeneralInfoLvSection from "../components/evCharger/GeneralInfoLvSection";

export default function EvChargerLvInspectionPage() {
  const [form, setForm] = React.useState({
    general: evLvChargerFormSchema.general,
    inspection: {
      subCircuits: [getNewLvSubCircuit()], // Use helper function
    },
    panel: evLvChargerFormSchema.panel,
    documents: evLvChargerFormSchema.documents,
    summary: evLvChargerFormSchema.summary,
    limitation: evLvChargerFormSchema.limitation,
    signature: evLvChargerFormSchema.signature,
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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
        แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า (EV Charger) ระดับแรงดันต่ำ
      </h1>
      
      <GeneralInfoLvSection
        data={form.general}
        onChange={(field, value) => handleSectionChange("general", field, value)}
      />

      <DocumentSection
        value={form.documents}
        onChange={(value) => handleSectionObject("documents", value)}
      />

      {/* Updated Panel Board Section */}
      <PanelBoardSection
        value={form.panel}
        sectionNumber={3}
        onChange={(value) => handleSectionObject("panel", value)}
      />

      <SubCircuitSection
        sectionNumber={3}
        value={form.inspection.subCircuits || []}
        onChange={(value) => handleSectionChange("inspection", "subCircuits", value)}
        onAddCharger={(subCircuitIndex) => {
          const subCircuits = form.inspection.subCircuits || [];
          const updatedSubCircuits = subCircuits.map((subCircuit, index) => {
            if (index === subCircuitIndex) {
              const updatedEvChargers = [...(subCircuit.evChargers || []), getNewLvEvCharger()];
              return { ...subCircuit, evChargers: updatedEvChargers };
            }
            return subCircuit;
          });
          handleSectionChange("inspection", "subCircuits", updatedSubCircuits);
        }}
      />

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
      <div className="text-center">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          บันทึกแบบฟอร์ม
        </button>
      </div>
    </form>
  );
}