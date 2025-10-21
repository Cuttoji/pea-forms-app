import React from "react";
import { Document, Page, Font, Text } from "@react-pdf/renderer";

// Import sections
import FormHeader from "./sections/FormHeader";
import TitleSection from "./sections/TitleSection";
import GeneralInfoSection from "./sections/GeneralInfoSection";
import DocumentSection from "./sections/DocumentSection";
import HVSystemSection from "./sections/HVSystemSection";
import TransformerSection from "./sections/TransformerSection";
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
      residential: {
        hasSpecification: formData?.documents?.spec === true,
        completeness: formData?.documents?.isComplete,
      },
      commercial: {
        hasSingleLineDiagram: formData?.documents?.singleLineDiagram === true,
        hasAsBuiltDrawing: formData?.documents?.asBuiltDrawing === true,
        hasLoadSchedule: formData?.documents?.loadSchedule === true,
        hasEngineerLicense: formData?.documents?.engineerLicense === true,
        hasSpecification: formData?.documents?.spec === true,
        hasPermit: formData?.documents?.permit === true,
        completeness: formData?.documents?.isComplete,
      }
    },
    hvSystem: formData?.hvSystem || {},
    transformers: formData?.transformers || [],
    summaryType: formData?.summary?.summaryType || "",
    limitation: formData?.limitation || "",
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

      {/* หน้าที่ 3+: หม้อแปลง + ระบบแรงต่ำ - รวมกันเป็นก้อนเดียว */}
      {safeData.transformers && safeData.transformers.length > 0 ? 
        <Page size="A4" style={styles.page}>
          <TransformerSection transformers={safeData.transformers} />
        </Page>
        : 
        <Page size="A4" style={styles.page}>
          <TransformerSection transformers={[]} />
        </Page>
      }

      {/* หน้าที่ 4+: วงจรย่อยและเครื่องอัดประจุแยกตามหม้อแปลง */}
      {safeData.transformers && safeData.transformers.length > 0 ? 
        safeData.transformers.map((transformer, transformerIndex) => (
          <Page key={`subcircuit-${transformerIndex}`} size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>วงจรย่อยและเครื่องอัดประจุของหม้อแปลงที่ {transformerIndex + 1}</Text>
            
            <SubCircuitSection 
              subCircuits={transformer?.subCircuits || []} 
              transformerIndex={transformerIndex}
            />
            
            <EVChargerInspectionSection 
              evChargers={transformer?.subCircuits?.[0]?.evChargers || []} 
              transformerIndex={transformerIndex}
            />
          </Page>
        )) : 
        <Page size="A4" style={styles.page}>
          <SubCircuitSection subCircuits={[]} />
          <EVChargerInspectionSection evChargers={[]} />
        </Page>
      }

      {/* หน้าสุดท้าย: สรุปผลและลายเซ็น */}
      <Page size="A4" style={styles.page}>
        <SummarySection />
        <SignatureSection />
        <SingleLineDiagram />
      </Page>
    </Document>
  );
};

export default EVChargerHVExportPDF;