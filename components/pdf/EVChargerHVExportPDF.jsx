import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register Sarabun font (make sure .ttf files are in /public/fonts)
Font.register({
  family: "Sarabun",
  src: "/fonts/Sarabun-Regular.ttf",
});
Font.register({
  family: "Sarabun",
  src: "/fonts/Sarabun-Bold.ttf",
  fontWeight: "bold",
});

// Helper: Render value (support object/array)
const renderValue = (value) => {
  if (Array.isArray(value)) {
    return value.length
      ? value.map((v, i) => (
          <View key={i} style={{ marginBottom: 2 }}>
            <Text>{typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}</Text>
          </View>
        ))
      : <Text>-</Text>;
  }
  if (typeof value === "object" && value !== null) {
    return (
      <View style={{ marginLeft: 8 }}>
        {Object.entries(value).map(([k, v]) => (
          <View key={k} style={{ flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ fontWeight: "bold" }}>{k}: </Text>
            <Text>{typeof v === "object" ? JSON.stringify(v, null, 2) : (v !== undefined && v !== null && v !== "" ? String(v) : "-")}</Text>
          </View>
        ))}
      </View>
    );
  }
  return <Text>{value !== undefined && value !== null && value !== "" ? String(value) : "-"}</Text>;
};

// Helper: Render section as table
const SectionTable = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data && Object.keys(data).length > 0 ? (
      Object.entries(data).map(([key, value]) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{key}</Text>
          <View style={styles.value}>{renderValue(value)}</View>
        </View>
      ))
    ) : (
      <Text style={{ color: "#888" }}>-</Text>
    )}
  </View>
);

// Main PDF Component
const EVChargerHVExportPDF = ({ formData }) => {
  // แยก section
  const { general, documents, hvSystem, transformers, summary, limitation, signature, ...rest } = formData || {};

  return (
    <Document>
      {/* หน้า 1: ข้อมูลทั่วไป */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>แบบฟอร์มตรวจสอบระบบอัดประจุยานยนต์ไฟฟ้า (แรงสูง)</Text>
        <SectionTable title="ข้อมูลทั่วไป" data={general} />
        <SectionTable title="เอกสารประกอบ" data={documents} />
        <Text style={styles.footer} fixed>หน้า 1</Text>
      </Page>
      {/* หน้า 2: รายละเอียดการตรวจสอบ */}
      <Page size="A4" style={styles.page}>
        <SectionTable title="ระบบไฟฟ้าแรงสูง" data={hvSystem} />
        <SectionTable title="หม้อแปลงและระบบไฟฟ้าแรงต่ำ" data={{ transformers }} />
        <SectionTable title="สรุปผล" data={summary} />
        <SectionTable title="ข้อจำกัด" data={limitation ? { ข้อจำกัด: limitation } : {}} />
        {/* แสดง field อื่นๆ ที่เหลือ */}
        {rest && Object.keys(rest).length > 0 && (
          <SectionTable title="ข้อมูลเพิ่มเติม" data={rest} />
        )}
        <Text style={styles.footer} fixed>หน้า 2</Text>
      </Page>
      {/* หน้า 3: ลายเซ็นและหมายเหตุ */}
      <Page size="A4" style={styles.page}>
        <SectionTable title="ลายเซ็น" data={signature} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>หมายเหตุ</Text>
          <Text style={{ fontSize: 10, color: "#666" }}>
            เอกสารนี้สร้างขึ้นโดยระบบอิเล็กทรอนิกส์ของการไฟฟ้าส่วนภูมิภาค
          </Text>
        </View>
        <Text style={styles.footer} fixed>หน้า 3</Text>
      </Page>
    </Document>
  );
};

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    fontSize: 11,
    padding: 32,
    backgroundColor: "#fff",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
    color: "#3a1a5b",
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
  row: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  label: {
    width: 120,
    fontWeight: "bold",
    color: "#222",
    fontSize: 11,
  },
  value: {
    flex: 1,
    fontSize: 11,
    color: "#222",
    marginLeft: 8,
    wordBreak: "break-all",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    textAlign: "right",
    fontSize: 9,
    color: "#aaa",
  },
});

export default EVChargerHVExportPDF;