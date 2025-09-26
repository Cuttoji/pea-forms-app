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

// --- MOCK DATA (สำหรับ fallback) ---
const mockData = {
  general: {
    customerName: "-",
    address: "-",
    contractNo: "-",
    transformerType: "-",
    inspectionDate: "-",
    inspector: "-",
  },
  documents: [],
  hvSystem: [],
  transformers: [],
  summary: {
    result: "-",
    note: "-",
  },
  limitation: "-",
  signature: {
    customer: { name: "-", date: "-" },
    inspector: { name: "-", date: "-" },
  },
};

// --- REUSABLE COMPONENTS ---

// Checklist Table
const ChecklistTable = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.tableHeader}>
      <Text style={styles.colItem}>รายการตรวจสอบ</Text>
      <Text style={styles.colCheck}>ถูกต้อง</Text>
      <Text style={styles.colCheck}>ต้องแก้ไข</Text>
    </View>
    {(Array.isArray(data) ? data : []).map((row, idx) => (
      <View style={styles.tableRow} key={idx}>
        <Text style={styles.colItem}>{row.item || row.name || "-"}</Text>
        <Text style={styles.colCheck}>
          {row.correct !== undefined
            ? row.correct
              ? "☑"
              : "☐"
            : row.checked
            ? "☑"
            : "☐"}
        </Text>
        <Text style={styles.colCheck}>
          {row.needFix !== undefined
            ? row.needFix
              ? "☑"
              : "☐"
            : row.checked === false
            ? "☑"
            : "☐"}
        </Text>
      </View>
    ))}
  </View>
);

// General Info Section
const GeneralInfoSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <Text>ชื่อผู้ขอใช้ไฟฟ้า: {data?.customerName || "-"}</Text>
    <Text>ที่อยู่: {data?.address || "-"}</Text>
    <Text>เลขที่สัญญา: {data?.contractNo || "-"}</Text>
    <Text>ประเภทหม้อแปลง: {data?.transformerType || "-"}</Text>
    <Text>วันที่ตรวจสอบ: {data?.inspectionDate || "-"}</Text>
    <Text>ผู้ตรวจสอบ: {data?.inspector || "-"}</Text>
  </View>
);

// Summary & Signature Section
const SummaryAndSignature = ({ summary, signature }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>12. สรุปผลการตรวจสอบ</Text>
    <Text>ผลการตรวจสอบ: {summary?.result || "-"}</Text>
    <Text>หมายเหตุ: {summary?.note || "-"}</Text>
    <View style={styles.signatureRow}>
      <View style={styles.signatureBlock}>
        <Text>ลงชื่อผู้ขอใช้ไฟฟ้า</Text>
        <Text>({signature?.customer?.name || "-"})</Text>
        <Text>วันที่ {signature?.customer?.date || "-"}</Text>
      </View>
      <View style={styles.signatureBlock}>
        <Text>ลงชื่อเจ้าหน้าที่ กฟภ.</Text>
        <Text>({signature?.inspector?.name || "-"})</Text>
        <Text>วันที่ {signature?.inspector?.date || "-"}</Text>
      </View>
    </View>
  </View>
);

// --- MAIN DOCUMENT ---
const EVChargerHVExportPDF = ({ formData }) => {
  // ใช้ mockData ถ้า formData ไม่มี หรือ field ไหนไม่มีจะ fallback เป็น mockData
  const safeData = {
    ...mockData,
    ...(formData || {}),
    general: { ...mockData.general, ...(formData?.general || {}) },
    summary: { ...mockData.summary, ...(formData?.summary || {}) },
    signature: { ...mockData.signature, ...(formData?.signature || {}) },
    documents: Array.isArray(formData?.documents) ? formData.documents : [],
    hvSystem: Array.isArray(formData?.hvSystem) ? formData.hvSystem : [],
    transformers: Array.isArray(formData?.transformers) ? formData.transformers : [],
  };

  return (
    <Document>
      {/* หน้า 1 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header} fixed mb-16>การไฟฟ้าส่วนภูมิภาค</Text>
        <GeneralInfoSection data={safeData.general} />
        <ChecklistTable
          title="2. เอกสารประกอบการตรวจสอบ"
          data={safeData.documents}
        />
        <Text style={styles.footer} fixed>หน้า 1/3</Text>
      </Page>
      {/* หน้า 2 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header} fixed>การไฟฟ้าส่วนภูมิภาค</Text>
        <ChecklistTable
          title="3. ระบบจำหน่ายแรงสูง"
          data={safeData.hvSystem}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. หม้อแปลง</Text>
          {safeData.transformers.length > 0
            ? safeData.transformers.map((t, i) => (
                <Text key={i}>{t.name} - {t.kva} kVA ({t.status})</Text>
              ))
            : <Text>-</Text>
          }
        </View>
        <Text style={styles.footer} fixed>หน้า 2/3</Text>
      </Page>
      {/* หน้า 3: สรุปผลและลายเซ็น */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header} fixed>การไฟฟ้าส่วนภูมิภาค</Text>
        <SummaryAndSignature
          summary={safeData.summary}
          signature={safeData.signature}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>หมายเหตุ</Text>
          <Text style={{ fontSize: 10, color: "#666" }}>
            เอกสารนี้สร้างขึ้นโดยระบบอิเล็กทรอนิกส์ของการไฟฟ้าส่วนภูมิภาค
          </Text>
        </View>
        <Text style={styles.footer} fixed>หน้า 3/3</Text>
      </Page>
    </Document>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    fontSize: 11,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#3a1a5b",
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
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  colItem: { flex: 3, padding: 2, fontSize: 11 },
  colCheck: { flex: 1, padding: 2, fontSize: 11, textAlign: "center" },
  signatureRow: { flexDirection: "row", marginTop: 24 },
  signatureBlock: { flex: 1, alignItems: "center", fontSize: 11 },
});

export default EVChargerHVExportPDF;