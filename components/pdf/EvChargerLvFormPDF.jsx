import React from "react";
import { Document, Page, Font } from "@react-pdf/renderer";

// Import sections
import FormHeader from "./sections/FormHeader";
import TitleSection from "./sections/TitleSection";
import GeneralInfoLvSection from "./sections/GeneralInfoLvSection";
import DocumentSection from "./sections/DocumentSection";
import LvSystemSectionforLv from "./sections/LvSystemSectionforLv";
import SubCircuitSection from "./sections/SubCircuitSection";
import EVChargerInspectionSection from "./sections/EVChargerInspectionSection";
import SummarySection from "./sections/SummarySection";
import SignatureSection from "./sections/SignatureSection";
import SingleLineDiagram from "./sections/SingleLineDiagram";

// Import styles
import { styles } from "./styles/pdfStyles";

// Register Sarabun font
Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
  ],
});

const EvChargerLvFormPDF = ({ formData }) => {
  console.log("=== EvChargerLvFormPDF Main Component Debug ===");
  console.log("Full formData:", JSON.stringify(formData, null, 2));
  
  const safeData = {
    general: {
      powerAuthority: formData?.general?.powerAuthority || "",
      inspectionNo: formData?.general?.inspectionNo || "",
      inspectionDate: formData?.general?.inspectionDate || "",
      requestNo: formData?.general?.requestNo || "",
      requestDate: formData?.general?.requestDate || "",
      userType: formData?.general?.userType || "individual",
      customerName: formData?.general?.customerName || "",
      phone: formData?.general?.phone || "",
      corpName: formData?.general?.corpName || "",
      corpPhone: formData?.general?.corpPhone || formData?.general?.phone || "",
      address: formData?.general?.address || "",
      systemType: formData?.general?.systemType || "",
      load: formData?.general?.load || "",
      evChargerCount: formData?.general?.evChargerCount || "",
      evChargerPower: formData?.general?.evChargerPower || "",
    },

    documents: {
      areaType: formData?.documents?.areaType || "personal",
      spec: formData?.documents?.spec || false,
      singleLine: formData?.documents?.singleLine || false,
      loadSchedule: formData?.documents?.loadSchedule || false,
      asBuilt: formData?.documents?.asBuilt || false,
      licenceCopy: formData?.documents?.licenceCopy || false,
      peaLicence: formData?.documents?.peaLicence || false,
      isComplete: formData?.documents?.isComplete || "",
      notCompleteDetail: formData?.documents?.notCompleteDetail || "",
      electricalDocument: formData?.documents?.electricalDocument ?? null,
    },

    LVSystemPEA: {
      standard: formData?.LVSystemPEA?.standard || "",
      standardCorrect: formData?.LVSystemPEA?.standardCorrect ?? null,
      standardNote: formData?.LVSystemPEA?.standardNote || "",
      conductorType: formData?.LVSystemPEA?.conductorType || "",
      otherConductorType: formData?.LVSystemPEA?.otherConductorType || "",
      phaseWireSize: formData?.LVSystemPEA?.phaseWireSize || "",
      phaseWireSizeCorrect: formData?.LVSystemPEA?.phaseWireSizeCorrect ?? null,
      phaseWireSizeNote: formData?.LVSystemPEA?.phaseWireSizeNote || "",
      neutralWireSize: formData?.LVSystemPEA?.neutralWireSize || "",
      neutralWireSizeCorrect: formData?.LVSystemPEA?.neutralWireSizeCorrect ?? null,
      neutralWireSizeNote: formData?.LVSystemPEA?.neutralWireSizeNote || "",
      phaseIdentificationCorrect: formData?.LVSystemPEA?.phaseIdentificationCorrect ?? null,
      phaseIdentificationNote: formData?.LVSystemPEA?.phaseIdentificationNote || "",
      cablePathwayCorrect: formData?.LVSystemPEA?.cablePathwayCorrect ?? null,
      cablePathwayNote: formData?.LVSystemPEA?.cablePathwayNote || "",
      wiringMethod: formData?.LVSystemPEA?.wiringMethod || "",
      cableTraySize: formData?.LVSystemPEA?.cableTraySize || { width: "", height: "" },
      conduitSize: formData?.LVSystemPEA?.conduitSize || "",
      conduitSizeWall: formData?.LVSystemPEA?.conduitSizeWall || "",
      otherWiringMethod: formData?.LVSystemPEA?.otherWiringMethod || "",
      wiringMethodCorrect: formData?.LVSystemPEA?.wiringMethodCorrect ?? null,
      wiringMethodNote: formData?.LVSystemPEA?.wiringMethodNote || "",
      conduitType: formData?.LVSystemPEA?.conduitType || "",
      otherConduitType: formData?.LVSystemPEA?.otherConduitType || "",
      conduitTypeCorrect: formData?.LVSystemPEA?.conduitTypeCorrect ?? null,
      conduitTypeNote: formData?.LVSystemPEA?.conduitTypeNote || "",
      mainBreakerStandardCorrect: formData?.LVSystemPEA?.mainBreakerStandardCorrect ?? null,
      mainBreakerStandardNote: formData?.LVSystemPEA?.mainBreakerStandardNote || "",
      mainBreakerSize: formData?.LVSystemPEA?.mainBreakerSize || "",
      mainBreakerSizeCorrect: formData?.LVSystemPEA?.mainBreakerSizeCorrect ?? null,
      mainBreakerSizeNote: formData?.LVSystemPEA?.mainBreakerSizeNote || "",
      shortCircuitRating: formData?.LVSystemPEA?.shortCircuitRating || "",
      shortCircuitRatingCorrect: formData?.LVSystemPEA?.shortCircuitRatingCorrect ?? null,
      shortCircuitRatingNote: formData?.LVSystemPEA?.shortCircuitRatingNote || "",
      groundWireSize: formData?.LVSystemPEA?.groundWireSize || "",
      groundWireSizeCorrect: formData?.LVSystemPEA?.groundWireSizeCorrect ?? null,
      groundWireSizeNote: formData?.LVSystemPEA?.groundWireSizeNote || "",
      groundingSystem: formData?.LVSystemPEA?.groundingSystem || "",
      groundingSystemCorrect: formData?.LVSystemPEA?.groundingSystemCorrect ?? null,
      groundingSystemNote: formData?.LVSystemPEA?.groundingSystemNote || "",
      groundingConfig: formData?.LVSystemPEA?.groundingConfig || "",
      tncsLoadBalance: formData?.LVSystemPEA?.tncsLoadBalance ?? false,
      tncsNeutralProtection: formData?.LVSystemPEA?.tncsNeutralProtection ?? false,
      tncsTouchVoltageProtection: formData?.LVSystemPEA?.tncsTouchVoltageProtection ?? false,
      tncsCorrect: formData?.LVSystemPEA?.tncsCorrect ?? null,
      tncsNote: formData?.LVSystemPEA?.tncsNote || "",
      ttCorrect: formData?.LVSystemPEA?.ttCorrect ?? null,
      ttNote: formData?.LVSystemPEA?.ttNote || "",
      ttPartialCorrect: formData?.LVSystemPEA?.ttPartialCorrect ?? null,
      ttPartialNote: formData?.LVSystemPEA?.ttPartialNote || "",
    },

    panel: {
      hasPanelBoard: formData?.panel?.hasPanelBoard ?? false,
      standard: formData?.panel?.standard || [],
      standardCheck: formData?.panel?.standardCheck || { result: "", detail: "" },
      wireType: formData?.panel?.wireType || [],
      wireTypeOther: formData?.panel?.wireTypeOther || "",
      wireTypeCheck: formData?.panel?.wireTypeCheck || { result: "", detail: "" },
      phaseSize: formData?.panel?.phaseSize || "",
      phaseSizeCheck: formData?.panel?.phaseSizeCheck || { result: "", detail: "" },
      neutralSize: formData?.panel?.neutralSize || "",
      neutralSizeCheck: formData?.panel?.neutralSizeCheck || { result: "", detail: "" },
      groundSize: formData?.panel?.groundSize || "",
      groundSizeCheck: formData?.panel?.groundSizeCheck || { result: "", detail: "" },
      phaseColor: formData?.panel?.phaseColor || { result: "", detail: "" },
      wirewayMechanical: formData?.panel?.wirewayMechanical || { result: "", detail: "" },
      method: formData?.panel?.method || [],
      methodWirewayW: formData?.panel?.methodWirewayW || "",
      methodWirewayH: formData?.panel?.methodWirewayH || "",
      methodCableTrayW: formData?.panel?.methodCableTrayW || "",
      methodCableTrayH: formData?.panel?.methodCableTrayH || "",
      methodBuswayW: formData?.panel?.methodBuswayW || "",
      methodBuswayH: formData?.panel?.methodBuswayH || "",
      methodConduitWallSize: formData?.panel?.methodConduitWallSize || "",
      methodConduitBuriedSize: formData?.panel?.methodConduitBuriedSize || "",
      methodOther: formData?.panel?.methodOther || "",
      methodCheck: formData?.panel?.methodCheck || { result: "", detail: "" },
      conduitType: formData?.panel?.conduitType || [],
      conduitTypeOther: formData?.panel?.conduitTypeOther || "",
      conduitCheck: formData?.panel?.conduitCheck || { result: "", detail: "" },
      breakerStandard: formData?.panel?.breakerStandard || { result: "", detail: "" },
      breakerSize: formData?.panel?.breakerSize || "",
      breakerCheck: formData?.panel?.breakerCheck || { result: "", detail: "" },
      panelCapacity: formData?.panel?.panelCapacity || { result: "", detail: "" },
      panelNeutralGround: formData?.panel?.panelNeutralGround || { result: "", detail: "" },
    },

    subCircuits: formData?.subCircuits || [],

    summary: {
      summaryType: formData?.summary?.summaryType || "",
    },

    limitation: formData?.limitation || "",
    signature: formData?.signature || {},
  };

  console.log("=== safeData.subCircuits ===");
  console.log("subCircuits array:", safeData.subCircuits);
  console.log("subCircuits length:", safeData.subCircuits?.length);

  return (
    <Document>
      {/* หน้าที่ 1: ข้อมูลทั่วไปและเอกสาร */}
      <Page size="A4" style={styles.page}>
        <FormHeader />
        <TitleSection general={safeData.general} />
        <GeneralInfoLvSection general={safeData.general} />
        <DocumentSection documents={safeData.documents} />
      </Page>

      {/* หน้าที่ 2: ระบบแรงต่ำ + Panel (ต่อเนื่องกัน) */}
        <Page size="A4" style={styles.page}>
          <LvSystemSectionforLv 
            lvSystemPEA={safeData.LVSystemPEA}
            panel={safeData.panel}
            summary={safeData.summary}
          />
        </Page>

        {/* หน้าที่ 3+: วงจรย่อยแต่ละวงจร + เครื่องอัดประจุ */}
        {safeData.subCircuits && safeData.subCircuits.length > 0 && 
          safeData.subCircuits.map((subCircuit, subCircuitIndex) => (
            <Page key={`subcircuit-${subCircuitIndex}`} size="A4" style={styles.page}>
          <SubCircuitSection 
            subCircuits={[subCircuit]}
          />
          
          {/* เครื่องอัดประจุของวงจรนี้ */}
          <EVChargerInspectionSection 
            evChargers={subCircuit?.evChargers || []}
          />
            </Page>
          ))
        }

        {/* หน้าสุดท้าย: สรุปผลและลายเซ็น */}
      <Page size="A4" style={styles.page}>
        <SummarySection 
          summaryType={safeData.summary?.summaryType} 
          limitation={safeData.limitation}
        />
        <SignatureSection signature={safeData.signature} />
        <SingleLineDiagram />
      </Page>
    </Document>
  );
};

export default EvChargerLvFormPDF;