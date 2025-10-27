import React from "react";
import { Document, Page, Font, Text } from "@react-pdf/renderer";

// Import sections
import FormHeader from "./sections/FormHeader";
import TitleSection from "./sections/TitleSection";
import GeneralInfoSection from "./sections/GeneralInfoSection";
import DocumentSection from "./sections/DocumentSection";
import HVSystemSection from "./sections/HVSystemSection";
import TransformerSection from "./sections/TransformerSection";
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

const EVChargerHVExportPDF = ({ formData }) => {
  console.log("=== EVChargerHVExportPDF Main Component Debug ===");
  console.log("Full formData:", JSON.stringify(formData, null, 2));
  
  const safeData = {
    general: {
      userType: formData?.general?.userType,
      individualName: formData?.general?.customerName,
      individualPhone: formData?.general?.phone,
      corpName: formData?.general?.corpName,
      corpPhone: formData?.general?.phone,
      address: formData?.general?.address,
      systemType: formData?.general?.systemType,
      loadCurrent: formData?.general?.load,
      chargerCount: formData?.general?.evChargerCount,
      chargerPower: formData?.general?.evChargerPower,
      powerAuthority: formData?.general?.powerAuthority,
      inspectionNo: formData?.general?.inspectionNo,
      inspectionDate: formData?.general?.inspectionDate,
      requestNo: formData?.general?.requestNo,
      requestDate: formData?.general?.requestDate,
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

    hvSystem: formData?.hvSystem || {},
    transformers: formData?.transformers || [],
    summaryType: formData?.summary?.summaryType || "",
    limitation: formData?.limitation || "",
    signature: formData?.signature || {},
  };

  console.log("=== safeData.transformers ===");
  console.log("transformers array:", safeData.transformers);
  console.log("transformers length:", safeData.transformers?.length);

  return (
    <Document>
      {/* หน้าที่ 1: ข้อมูลทั่วไปและเอกสาร */}
      <Page size="A4" style={styles.page}>
        <FormHeader />
        <TitleSection general={safeData.general} />
        <GeneralInfoSection general={safeData.general} />
        <DocumentSection documents={safeData.documents} />
      </Page>

      {/* หน้าที่ 2: ระบบจำหน่ายแรงสูง */}
      <Page size="A4" style={styles.page}>
        <HVSystemSection hvSystem={safeData.hvSystem} />
      </Page>

      {/* หน้าที่ 3+: หม้อแปลง (Section 4) + ระบบแรงต่ำ (Section 5) */}
      {safeData.transformers && safeData.transformers.length > 0 ? 
        <Page size="A4" style={styles.page}>
          <TransformerSection 
            transformers={safeData.transformers} 
            includeLvSystem={true}
            sectionPrefix="5"
          />
        </Page>
        : 
        <Page size="A4" style={styles.page}>
          <TransformerSection 
            transformers={[]} 
            includeLvSystem={true}
            sectionPrefix="5"
          />
        </Page>
      }

      {/* หน้าที่ 4+: เครื่องอัดประจุแต่ละหม้อแปลง */}
      {safeData.transformers && safeData.transformers.length > 0 && 
        safeData.transformers.map((transformer, transformerIndex) => (
          <Page key={`evcharger-${transformerIndex}`} size="A4" style={styles.page}>
            <EVChargerInspectionSection 
              evChargers={transformer?.subCircuits?.[0]?.evChargers || []} 
              transformerIndex={transformerIndex}
            />
          </Page>
        ))
      }

      {/* หน้าสุดท้าย: สรุปผลและลายเซ็น */}
      <Page size="A4" style={styles.page}>
        <SummarySection />
        <SignatureSection signature={safeData.signature} />
        <SingleLineDiagram />
      </Page>
    </Document>
  );
};

export default EVChargerHVExportPDF;