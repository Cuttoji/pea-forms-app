"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// ลงทะเบียนฟอนต์ Sarabun เพื่อรองรับภาษาไทย
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.ttf' },
    { src: '/fonts/Sarabun-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Sarabun-Light.ttf', fontWeight: 'light' },
  ]
});

// สไตล์ของเอกสาร PDF
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

// Helper Components
const Field = ({ label, value, style }) => (
    <View style={{...styles.row, ...style}}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{` ${value || ''} `}</Text>
    </View>
);
const Checkbox = ({ checked, label }) => (
  <View style={styles.checkboxContainer}>
    <View style={styles.checkbox}><Text style={styles.checkMark}>{checked ? '✓' : ' '}</Text></View>
    <Text>{label}</Text>
  </View>
);

// Component หลักของเอกสาร PDF
const commercialInspectionPDF = ({ formData }) => {
  if (!formData) {
    return <Document><Page style={styles.page}><Text>ไม่มีข้อมูล</Text></Page></Document>;
  }
  const getFullText = (key) => formData[key] || '';

  return (
  <Document>
        {/* หน้า 1 */}
        <Page size="A4" style={styles.page}>
          <View style={styles.headerContainer} fixed>
            <Image src="/pea_logo.png" style={{ width: 40, height: 40 }} alt="PEA Logo" />
            <View style={styles.headerText}>
                <Text style={styles.headerPEA}>การไฟฟ้าส่วนภูมิภาค</Text>
                <Text style={styles.headerEN}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
            </View>
            <Text style={styles.headerOffice}>การไฟฟ้า.......</Text>
          </View>
          <Text style={styles.formTitle} fixed>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
          <Text style={styles.formSubtitle} fixed>สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน</Text>
  
          <View style={styles.headerInfoRow}>
             <Field label="การตรวจสอบครั้งที่" value={getFullText('inspectionNumber')} style={{width: '48%'}} />
             <Field label="วันที่" value={getFullText('inspectionDate')} style={{width: '48%'}}/>
          </View>
          <View style={styles.headerInfoRow}>
             <Field label="การตรวจสอบตามคำร้องขอใช้ไฟเลขที่" value={getFullText('requestNumber')} style={{width: '48%'}} />
             <Field label="วันที่" value={getFullText('requestDate')} style={{width: '48%'}} />
          </View>
  
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
            <Field label="ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า (นาย / นาง / น.ส.)" value={getFullText('fullName')} />
            <Field label="โทรศัพท์" value={getFullText('phone')} />
            <Field label="ที่อยู่" value={getFullText('address')} />
            <View style={{...styles.row, marginTop: 5}}>
              {/* Changed from phaseType to hvSystemType based on PDF */}
              <Checkbox checked={formData.hvSystemType === '22kV'} label="ระบบไฟฟ้า 22 kV" />
              <Checkbox checked={formData.hvSystemType === '33kV'} label="33 kV" />
              <Field label="โหลดประมาณ" value={`${getFullText('estimatedLoad')} แอมแปร์`} style={{marginLeft: 20, flexGrow: 1}}/>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
            <View style={styles.checklistItem}>
              <Checkbox checked={formData.hasDesignCertification} label="มี เอกสารรับรองการออกแบบระบบไฟฟ้า ดังนี้" />
            </View>
                <Text checked={formData.checklistItem2}>1. แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่แสดงการติดตั้งอุปกรณ์ไฟฟ้าและการเดินสายไฟฟ้า</Text>
                <Text checked={formData.checklistItem3}>2. สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม </Text>
            </View>
            <Text style={styles.sectionTitle}>ระบบจำหน่ายแรงสูง</Text>
            <View style={styles.checklistItem}>
                <Checkbox checked={formData.checklistItem4} label="มี แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่แสดงการติดตั้งอุปกรณ์ไฟฟ้าและการเดินสายไฟฟ้า" />
                <Text style={styles.noteValue}>{getFullText('checklistItem4Note')}</Text>
          </View>
        </Page>
      </Document>
  );
}
export default commercialInspectionPDF;