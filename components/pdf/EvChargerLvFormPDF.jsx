import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from "@react-pdf/renderer";

// Register Sarabun font (รองรับภาษาไทย)
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
  projectName: "-",
  inspectionDate: "-",
  inspector: "-",
  status: "-",
  notes: "-",
};

// General Info Section
const GeneralInfoSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>ข้อมูลทั่วไป</Text>
    <Text>โครงการ: {data?.projectName || "-"}</Text>
    <Text>วันที่ตรวจสอบ: {data?.inspectionDate || "-"}</Text>
    <Text>ผู้ตรวจสอบ: {data?.inspector || "-"}</Text>
  </View>
);

// Inspection Detail Section
const InspectionDetailSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>รายละเอียดการตรวจสอบ</Text>
    <Text>สถานะ: {data?.status || "-"}</Text>
    <Text>หมายเหตุ: {data?.notes || "-"}</Text>
  </View>
);

// Main PDF Document
const EvChargerLvFormPDF = ({ data }) => {
  const safeData = { ...mockData, ...(data || {}) };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header} fixed>
          การไฟฟ้าส่วนภูมิภาค
        </Text>
        <Text style={styles.title}>รายงานการตรวจสอบ EV Charger LV</Text>
        <GeneralInfoSection data={safeData} />
        <InspectionDetailSection data={safeData} />
        <Text style={styles.footer} fixed>
          หน้า 1/1
        </Text>
      </Page>
    </Document>
  );
};

// PDF Viewer Component
const EvChargerLvFormPDFViewer = ({ data }) => (
  <PDFViewer style={{ width: "100%", height: "600px" }}>
    <EvChargerLvFormPDF data={data} />
  </PDFViewer>
);

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
  title: {
    fontSize: 18,
    marginBottom: 18,
    textAlign: "center",
    color: "#5b2d90",
    fontWeight: "bold",
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
});

export default EvChargerLvFormPDFViewer;