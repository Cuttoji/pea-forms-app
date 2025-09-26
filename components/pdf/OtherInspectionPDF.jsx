"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register Sarabun font
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.ttf' },
    { src: '/fonts/Sarabun-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Sarabun-Light.ttf', fontWeight: 'light' },
  ]
});

// Fallback mock data
const mockData = {
  inspectionNumber: "-",
  inspectionDate: "-",
  requestNumber: "-",
  requestDate: "-",
  fullName: "-",
  phone: "-",
  address: "-",
  hvSystemType: "-",
  estimatedLoad: "-",
  hasDesignCertification: false,
  checklistItem2: false,
  checklistItem3: false,
  checklistItem4: false,
  checklistItem4Note: "-",
  summary: "-",
  signature: {
    name: "-",
    date: "-",
    note: "-",
  },
};

// Styles
const styles = StyleSheet.create({
  page: { fontFamily: 'Sarabun', fontSize: 10, paddingTop: 30, paddingBottom: 50, paddingHorizontal: 35, backgroundColor: '#fff', color: '#000' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  headerText: { textAlign: 'center', flexGrow: 1, paddingTop: 5 },
  headerPEA: { fontSize: 14, fontWeight: 'bold' },
  headerEN: { fontSize: 8 },
  headerOffice: { fontSize: 9, textAlign: 'right' },
  formTitle: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginTop: 2 },
  formSubtitle: { fontSize: 9, textAlign: 'center', marginBottom: 8 },
  headerInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  section: { marginTop: 8, marginBottom: 4, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0', borderBottomStyle: "solid" },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 4, color: "#5b2d90" },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2, flexWrap: 'wrap' },
  label: { marginRight: 4, flexShrink: 0, paddingBottom: 1 },
  value: { borderBottom: '0.5px dotted #666', flexGrow: 1, minHeight: 10, paddingLeft: 2 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 3, paddingLeft: 10, flexWrap: 'wrap' },
  itemText: { flex: 1, minWidth: '55%' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 8, marginTop: 2 },
  checkbox: { width: 8, height: 8, borderWidth: 0.5, borderColor: '#000', marginRight: 3, alignItems: 'center', justifyContent: 'center' },
  checkMark: { fontSize: 9, transform: 'translateY(-1px)' },
  noteValue: { borderBottom: '0.5px dotted #666', flexGrow: 1, minHeight: 10, marginLeft: 3, fontSize: 8, paddingLeft: 2 },
  signatureSection: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-around' },
  signatureBox: { width: '45%', textAlign: 'center' },
  signatureLine: { borderTop: '0.5px dotted #999', marginTop: 5, marginBottom: 3, fontSize: 9 },
  pageNumber: { position: 'absolute', fontSize: 8, bottom: 20, left: 0, right: 35, textAlign: 'right', color: 'grey' },
  docIdFooter: { position: 'absolute', fontSize: 8, bottom: 20, left: 35, color: 'grey' }
});

// Reusable Components
const Field = ({ label, value, style }) => (
  <View style={{ ...styles.row, ...style }}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{` ${value || "-"} `}</Text>
  </View>
);
const Checkbox = ({ checked, label }) => (
  <View style={styles.checkboxContainer}>
    <View style={styles.checkbox}><Text style={styles.checkMark}>{checked ? '✓' : ' '}</Text></View>
    <Text>{label}</Text>
  </View>
);

// Section Components
const HeaderSection = () => (
  <View style={styles.headerContainer} fixed>
    <Image src="/pea_logo.png" style={{ width: 40, height: 40 }} alt="PEA Logo" />
    <View style={styles.headerText}>
      <Text style={styles.headerPEA}>การไฟฟ้าส่วนภูมิภาค</Text>
      <Text style={styles.headerEN}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
    </View>
    <Text style={styles.headerOffice}>การไฟฟ้า.......</Text>
  </View>
);

const GeneralInfoSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <Field label="ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า" value={data.fullName} />
    <Field label="โทรศัพท์" value={data.phone} />
    <Field label="ที่อยู่" value={data.address} />
    <View style={{ ...styles.row, marginTop: 5 }}>
      <Checkbox checked={data.hvSystemType === '22kV'} label="ระบบไฟฟ้า 22 kV" />
      <Checkbox checked={data.hvSystemType === '33kV'} label="33 kV" />
      <Field label="โหลดประมาณ" value={`${data.estimatedLoad || "-"} แอมแปร์`} style={{ marginLeft: 20, flexGrow: 1 }} />
    </View>
  </View>
);

const InspectionSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
    <View style={styles.checklistItem}>
      <Checkbox checked={!!data.hasDesignCertification} label="มี เอกสารรับรองการออกแบบระบบไฟฟ้า ดังนี้" />
    </View>
    <View style={styles.checklistItem}>
      <Checkbox checked={!!data.checklistItem2} label="1. แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่แสดงการติดตั้งอุปกรณ์ไฟฟ้าและการเดินสายไฟฟ้า" />
    </View>
    <View style={styles.checklistItem}>
      <Checkbox checked={!!data.checklistItem3} label="2. สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม" />
    </View>
    <Text style={styles.sectionTitle}>ระบบจำหน่ายแรงสูง</Text>
    <View style={styles.checklistItem}>
      <Checkbox checked={!!data.checklistItem4} label="มี แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่แสดงการติดตั้งอุปกรณ์ไฟฟ้าและการเดินสายไฟฟ้า" />
      <Text style={styles.noteValue}>{data.checklistItem4Note || "-"}</Text>
    </View>
  </View>
);

const SignatureSection = ({ signature }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>ลายเซ็น</Text>
    <View style={styles.signatureBox}>
      <Text>.............................................</Text>
      <Text style={{ marginTop: 8 }}>{signature?.name || "-"}</Text>
      <Text style={{ marginTop: 8 }}>วันที่: {signature?.date || "-"}</Text>
    </View>
    <Text style={styles.sectionTitle}>หมายเหตุ</Text>
    <View style={{ border: "1 solid #aaa", padding: 12, marginTop: 8, minHeight: 40 }}>
      <Text>{signature?.note || "-"}</Text>
    </View>
  </View>
);

// Main PDF Document
const OtherInspectionPDF = ({ formData }) => {
  const safeData = { ...mockData, ...(formData || {}), signature: { ...mockData.signature, ...(formData?.signature || {}) } };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <HeaderSection />
        <Text style={styles.formTitle} fixed>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
        <Text style={styles.formSubtitle} fixed>สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน</Text>
        <View style={styles.headerInfoRow}>
          <Field label="การตรวจสอบครั้งที่" value={safeData.inspectionNumber} style={{ width: '48%' }} />
          <Field label="วันที่" value={safeData.inspectionDate} style={{ width: '48%' }} />
        </View>
        <View style={styles.headerInfoRow}>
          <Field label="การตรวจสอบตามคำร้องขอใช้ไฟเลขที่" value={safeData.requestNumber} style={{ width: '48%' }} />
          <Field label="วันที่" value={safeData.requestDate} style={{ width: '48%' }} />
        </View>
        <GeneralInfoSection data={safeData} />
        <InspectionSection data={safeData} />
        <SignatureSection signature={safeData.signature} />
        <Text style={styles.docIdFooter} fixed>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
      </Page>
    </Document>
  );
};

export default OtherInspectionPDF;