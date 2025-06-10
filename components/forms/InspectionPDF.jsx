// app/components/forms/InspectionPDF.jsx
"use client";
import React from 'react';
// ✅ แก้ไขชื่อแพ็คเกจที่นี่
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// -- การตั้งค่าฟอนต์และสไตล์ --

// 1. ลงทะเบียนฟอนต์ภาษาไทย
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.ttf' },
    { src: '/fonts/Sarabun-Bold.ttf', fontWeight: 'bold' },
  ]
});

// 2. สร้างสไตล์ชีทสำหรับเอกสาร PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Sarabun',
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#E5E7EB',
    padding: 3,
    marginBottom: 5,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  label: {
    marginRight: 5,
    fontWeight: 'bold',
    flexShrink: 0,
  },
  value: {
    borderBottom: '0.5px dotted #999999',
    flexGrow: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 3,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '0.5px solid #000',
    marginRight: 4,
    textAlign: 'center',
    paddingTop: 1,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signatureBox: {
    width: '45%',
    borderTop: '1px solid #333',
    paddingTop: 5,
    textAlign: 'center',
  },
  signatureImage: {
    width: 120,
    height: 60,
    alignSelf: 'center',
    marginBottom: 5,
  }
});

// --- คอมโพเนนต์เสริม ---
const Checkbox = ({ checked, label }) => (
  <View style={styles.checkboxContainer}>
    <View style={styles.checkbox}>
      <Text>{checked ? '✓' : ' '}</Text>
    </View>
    <Text>{label}</Text>
  </View>
);

const FormField = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value || '.........................'}</Text>
    </View>
);

// --- คอมโพเนนต์หลักของเอกสาร PDF ---
const InspectionPDF = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>การไฟฟ้าส่วนภูมิภาค</Text>
        <Text style={styles.headerSubtitle}>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
      </View>

      <View style={styles.section}>
         <View style={styles.twoColumnLayout}>
            <View style={styles.column}>
                <FormField label="การตรวจสอบครั้งที่" value={formData.inspectionNumber} />
                <FormField label="การตรวจสอบตามคำร้องขอใช้ไฟเลขที่" value={formData.requestNumber} />
            </View>
            <View style={styles.column}>
                <FormField label="วันที่" value={formData.inspectionDate} />
                <FormField label="วันที่" value={formData.requestDate} />
            </View>
         </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
        <FormField label="ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า" value={formData.fullName} />
        <FormField label="โทรศัพท์" value={formData.phone} />
        <FormField label="ที่อยู่" value={formData.address} />
        <View style={styles.row}>
            <Checkbox checked={formData.phaseType === '3_phase'} label="ระบบไฟฟ้า 3 เฟส (400/230 V)" />
            <Checkbox checked={formData.phaseType === '1_phase'} label="1 เฟส (230 V)" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
        {/* คุณจะต้องสร้าง Layout 2 คอลัมน์และเพิ่มข้อมูลทั้งหมดที่นี่ */}
        {/* ... (ตัวอย่าง) ... */}
        <Text style={{fontWeight: 'bold', fontSize: 10, marginBottom: 5}}>2.1 สายตัวนำประธานเข้าอาคาร</Text>
        <View style={styles.row}>
            <Text style={styles.label}>ก) สายไฟฟ้าตามมาตรฐาน:</Text>
            <Text style={styles.value}>{formData.cableStandard_correct}</Text>
        </View>
        
        {/* ... เพิ่มส่วนที่เหลือของฟอร์ม ... */}
      </View>
      
      <View style={styles.signatureSection}>
         <View style={styles.signatureBox}>
            {formData.userSignature && <Image style={styles.signatureImage} src={formData.userSignature} />}
            <Text>(ผู้ขอใช้ไฟฟ้าหรือผู้แทน)</Text>
         </View>
         <View style={styles.signatureBox}>
            {formData.inspectorSignature && <Image style={styles.signatureImage} src={formData.inspectorSignature} />}
            <Text>(เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค)</Text>
         </View>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export default InspectionPDF;