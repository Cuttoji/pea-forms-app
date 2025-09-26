import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register Sarabun font
Font.register({
  family: "Sarabun",
  src: "/fonts/Sarabun-Regular.ttf",
});
Font.register({
  family: "Sarabun",
  src: "/fonts/Sarabun-Bold.ttf",
  fontWeight: "bold",
});

// Fallback mock data
const mockData = {
  general: {
    customerName: "-",
    address: "-",
    phone: "-",
    inspectionDate: "-",
    inspector: "-",
  },
  inspection: [],
  summary: {
    result: "-",
    note: "-",
  },
  limitation: "-",
  signature: {
    name: "-",
    date: "-",
    note: "-",
  },
};

// General Info Section
const GeneralInfoSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <Text>ชื่อผู้ขอใช้ไฟฟ้า: {data?.customerName || "-"}</Text>
    <Text>ที่อยู่: {data?.address || "-"}</Text>
    <Text>เบอร์โทร: {data?.phone || "-"}</Text>
    <Text>วันที่ตรวจสอบ: {data?.inspectionDate || "-"}</Text>
    <Text>ผู้ตรวจสอบ: {data?.inspector || "-"}</Text>
  </View>
);

// Inspection Detail Section
const InspectionDetailSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. รายละเอียดการตรวจสอบ</Text>
    {Array.isArray(data) && data.length > 0 ? (
      data.map((item, idx) => (
        <Text key={idx}>{item.detail || JSON.stringify(item)}</Text>
      ))
    ) : (
      <Text>-</Text>
    )}
  </View>
);

// Summary Section
const SummarySection = ({ summary }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>3. สรุปผลการตรวจสอบ</Text>
    <Text>ผลการตรวจสอบ: {summary?.result || "-"}</Text>
    <Text>หมายเหตุ: {summary?.note || "-"}</Text>
  </View>
);

// Limitation Section
const LimitationSection = ({ limitation }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>4. ข้อจำกัดในการตรวจสอบ</Text>
    <Text>{limitation || "-"}</Text>
  </View>
);

// Signature Section
const SignatureSection = ({ signature }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>5. ลายเซ็น</Text>
    <View style={styles.signatureBox}>
      <Text>.............................................</Text>
      <Text style={styles.signatureLabel}>{signature?.name || "-"}</Text>
      <Text style={styles.signatureLabel}>วันที่: {signature?.date || "-"}</Text>
    </View>
    <Text style={styles.sectionTitle}>หมายเหตุ</Text>
    <View style={styles.noteBox}>
      <Text>{signature?.note || "-"}</Text>
    </View>
  </View>
);

const HomeInspectionPDF = ({ formData }) => {
  // รวม mockData กับ formData เพื่อกัน field หาย
  const safeData = {
    ...mockData,
    ...(formData || {}),
    general: { ...mockData.general, ...(formData?.general || {}) },
    summary: { ...mockData.summary, ...(formData?.summary || {}) },
    signature: { ...mockData.signature, ...(formData?.signature || {}) },
    inspection: Array.isArray(formData?.inspection) ? formData.inspection : [],
  };

  return (
    <Document>
      {/* หน้า 1 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header} fixed>การไฟฟ้าส่วนภูมิภาค</Text>
        <GeneralInfoSection data={safeData.general} />
        <Text style={styles.footer} fixed>หน้า 1/2</Text>
      </Page>
      {/* หน้า 2 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header} fixed>การไฟฟ้าส่วนภูมิภาค</Text>
        <InspectionDetailSection data={safeData.inspection} />
        <SummarySection summary={safeData.summary} />
        <LimitationSection limitation={safeData.limitation} />
        <SignatureSection signature={safeData.signature} />
        <Text style={styles.footer} fixed>หน้า 2/2</Text>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    fontSize: 12,
    padding: 32,
    backgroundColor: "#fff",
    lineHeight: 1.5,
  },
  header: {
    position: "absolute",
    top: 16,
    left: 32,
    right: 32,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#3a1a5b",
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    textAlign: "right",
    fontSize: 10,
    color: "#aaa",
  },
  section: {
    marginBottom: 18,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#5b2d90",
  },
  signatureBox: {
    border: "1 solid #222",
    padding: 16,
    marginTop: 24,
    alignItems: "center",
    minHeight: 80,
  },
  signatureLabel: {
    marginTop: 8,
    fontSize: 12,
  },
  noteBox: {
    border: "1 solid #aaa",
    padding: 12,
    marginTop: 16,
    minHeight: 60,
  },
});

export default HomeInspectionPDF;