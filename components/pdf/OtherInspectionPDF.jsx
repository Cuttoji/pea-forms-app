"use client";
import React from "react";
import { Page, Document, Text, View, Font, Image } from "@react-pdf/renderer";
import { styles } from "./styles/pdfStyles";
import GeneralInfoSection from "./sections/GeneralInfoSection";
import DocumentSection from "./sections/DocumentSection";
import HVSystemSection from "./sections/HVSystemSection";
import TransformerSection from "./sections/TransformerSection";
import SummarySection from "./sections/SummarySection";
import SignatureSection from "./sections/SignatureSection";

Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
  ],
});

const PEA_LOGO = "/images/pea-logo.png";

const OtherInspectionPDF = ({ formData }) => {
  const safeData = {
    general: formData.general,
    documents: formData.documents,
    hvSystem: formData.hvSystem,
    transformers: Array.isArray(formData.transformers) ? formData.transformers : [],
    summary: formData.summary,
    limitation: formData?.limitation || "",
    signature: {
      officerSign: formData?.signature?.officerSign || "",
      customerSign: formData?.signature?.customerSign || "",
    },
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header only on first page */}
        <View style={styles.headerRow} fixed>
          <Image src={PEA_LOGO} style={styles.logo} />
          <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
            <Text style={styles.headerTitle}>การไฟฟ้าส่วนภูมิภาค</Text>
            <Text style={styles.headerSubtitle}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
          </View>
        </View>
        <View style={styles.divider} fixed />
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>แบบฟอร์มตรวจสอบระบบไฟฟ้าแรงสูงสำหรับผู้ใช้ไฟฟ้าประเภทอื่น</Text>
          <Text style={styles.titleText}>(หม้อแปลงเฉพาะราย/ระบบแรงสูง)</Text>
        </View>
        {/* ข้อมูลทั่วไป */}
        <GeneralInfoSection data={safeData.general} />
        {/* เอกสาร */}
        <DocumentSection documents={safeData.documents} />
        {/* HV System */}
        <HVSystemSection hvSystem={safeData.hvSystem} sectionNumber={2} />
        {/* หม้อแปลง */}
        <TransformerSection transformers={safeData.transformers} />
        {/* สรุปผล/ข้อจำกัด */}
        <SummarySection summary={safeData.summary} limitation={safeData.limitation} />
        {/* ลายเซ็น */}
        <SignatureSection signature={safeData.signature} />

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => `หน้า ${pageNumber}/${totalPages}`}
        />
      </Page>
    </Document>
  );
};

export default OtherInspectionPDF;