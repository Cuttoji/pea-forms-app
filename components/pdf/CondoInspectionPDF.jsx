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
  inspectionStatus: "-",
  conductorType: "-",
  conductorSize: "-",
  overhead_conductorType_status: "-",
  overhead_conductorType_note: "-",
  // ... (เติม field อื่นๆ ตามที่ใช้ในฟอร์ม)
  userSignature: null,
  inspectorSignature: null,
};

// Helper Components
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

// Header Section
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

// General Info Section
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

// Inspection Section (ตัวอย่าง, สามารถขยายเพิ่มได้)
const InspectionSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
    <Checkbox checked={data.inspectionStatus === 'passed'} label="มี เอกสารรับรองการออกแบบระบบไฟฟ้า ดังนี้" />
    <Checkbox checked={data.inspectionStatus === 'not_passed'} label="ไม่มี เอกสารรับรองการออกแบบระบบไฟฟ้า" />
    {/* เพิ่ม checklist อื่นๆ ตามต้องการ */}
  </View>
);

// Signature Section
const SignatureSection = ({ userSignature, inspectorSignature }) => (
  <View style={styles.signatureSection}>
    <View style={styles.signatureBox}>
      {userSignature && <Image style={styles.signatureImage} src={userSignature} alt="User Signature" />}
      <Text style={styles.signatureLine}>(..................................................)</Text>
      <Text style={{ fontSize: 8 }}>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
    </View>
    <View style={styles.signatureBox}>
      {inspectorSignature && <Image style={styles.signatureImage} src={inspectorSignature} alt="Inspector Signature" />}
      <Text style={styles.signatureLine}>(..................................................)</Text>
      <Text style={{ fontSize: 8 }}>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
    </View>
  </View>
);

// Main PDF Document
const CondoInspectionPDF = ({ formData }) => {
  const safeData = { ...mockData, ...(formData || {}) };

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
        {/* ... เพิ่ม Section อื่นๆ ตามต้องการ ... */}
        <SignatureSection userSignature={safeData.userSignature} inspectorSignature={safeData.inspectorSignature} />
        <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber}/${totalPages}`)} />
        <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)</Text>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: { fontFamily: 'Sarabun', fontSize: 9, paddingTop: 30, paddingBottom: 50, paddingHorizontal: 35, backgroundColor: '#FFFFFF', color: '#000' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  headerText: { textAlign: 'center', flexGrow: 1, paddingTop: 5 },
  headerPEA: { fontSize: 14, fontWeight: 'bold' },
  headerEN: { fontSize: 8 },
  headerOffice: { fontSize: 9, textAlign: 'right' },
  formTitle: { fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 2 },
  formSubtitle: { fontSize: 9, textAlign: 'center', marginBottom: 8 },
  headerInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  section: { marginTop: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 4, paddingBottom: 2, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2, flexWrap: 'wrap' },
  label: { marginRight: 4, flexShrink: 0, paddingBottom: 1 },
  value: { borderBottom: '0.5px dotted #666', flexGrow: 1, minHeight: 10, paddingLeft: 2 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 3, paddingLeft: 10, flexWrap: 'wrap' },
  itemText: { flex: 1, minWidth: '55%' },
  itemCheckboxArea: { flexDirection: 'row', alignItems: 'center' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 8, marginTop: 2 },
  checkbox: { width: 8, height: 8, borderWidth: 0.5, borderColor: '#000', marginRight: 3, alignItems: 'center', justifyContent: 'center' },
  checkMark: { fontSize: 9, transform: 'translateY(-1px)' },
  noteValue: { borderBottom: '0.5px dotted #666', flexGrow: 1, minHeight: 10, marginLeft: 3, fontSize: 8, paddingLeft: 2 },
  subItem: { paddingLeft: 15, marginTop: 2 },
  acknowledgementText: { fontSize: 7.5, fontWeight: 'light', lineHeight: 1.4, marginBottom: 10, textAlign: 'justify' },
  signatureSection: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-around' },
  signatureBox: { width: '45%', textAlign: 'center' },
  signatureImage: { width: 100, height: 40, alignSelf: 'center', marginBottom: 5 },
  signatureLine: { borderTop: '0.5px dotted #999', marginTop: 5, marginBottom: 3 },
  pageNumber: { position: 'absolute', fontSize: 8, bottom: 30, left: 0, right: 35, textAlign: 'right', color: 'grey' },
  docIdFooter: { position: 'absolute', fontSize: 8, bottom: 20, left: 35, color: 'grey' }
});

export default CondoInspectionPDF;