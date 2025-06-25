// components/forms/CondoInspectionPDF.jsx
"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// ใช้ Base URL เพื่อให้ path ของไฟล์สมบูรณ์
const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

// ลงทะเบียนฟอนต์ Sarabun
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: `${baseUrl}/fonts/Sarabun-Regular.ttf` },
    { src: `${baseUrl}/fonts/Sarabun-Bold.ttf`, fontWeight: 'bold' },
    { src: `${baseUrl}/fonts/Sarabun-Light.ttf`, fontWeight: 'light' },
  ]
});

// สไตล์ของเอกสาร PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Sarabun',
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 35,
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  headerText: { textAlign: 'center', flexGrow: 1, paddingTop: 5 },
  headerPEA: { fontSize: 14, fontWeight: 'bold' },
  headerEN: { fontSize: 8 },
  headerOffice: { fontSize: 9, textAlign: 'right' },
  formTitle: { fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 2 },
  formSubtitle: { fontSize: 9, textAlign: 'center', marginBottom: 8 },
  headerInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  section: { marginTop: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 4, borderBottom: '0.5px solid #333', paddingBottom: 2 },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2, flexWrap: 'wrap' },
  label: { marginRight: 4, flexShrink: 0, paddingBottom: 1 },
  value: { borderBottom: '0.5px dotted #666', flexGrow: 1, minHeight: 10, paddingLeft: 2 },
  checklistItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3, paddingLeft: 10 },
  itemText: { width: '55%' },
  itemCheckboxArea: { width: '45%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  checkbox: { width: 8, height: 8, border: '0.5px solid #000', marginRight: 3, textAlign: 'center', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  checkMark: { fontSize: 9, transform: 'translateY(-1.5px)' },
  noteValue: { borderBottom: '0.5px dotted #666', flexGrow: 1, minHeight: 10, marginLeft: 3, fontSize: 8, paddingLeft: 2 },
  acknowledgementText: { fontSize: 7.5, fontWeight: 'light', lineHeight: 1.4, marginBottom: 10, textAlign: 'justify' },
  signatureSection: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-around' },
  signatureBox: { width: '45%', textAlign: 'center' },
  signatureImage: { width: 100, height: 40, alignSelf: 'center', position: 'absolute', top: 40 },
  signatureLine: { borderTop: '0.5px dotted #999', marginTop: 40, marginBottom: 3 },
  pageNumber: { position: 'absolute', fontSize: 8, bottom: 30, left: 0, right: 35, textAlign: 'right', color: 'grey' },
  docIdFooter: { position: 'absolute', fontSize: 8, bottom: 20, left: 35, color: 'grey' }
});

// คอมโพเนนต์ย่อยสำหรับแสดงผลข้อมูล
const Field = ({ label, value, style }) => (
  <View style={{ ...styles.row, ...style }}>
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

const ChecklistItem = ({ label, value, note }) => {
  const isCorrect = value === 'ถูกต้อง';
  const isIncorrect = value === 'ต้องแก้ไข';
  return (
    <View style={styles.checklistItem}>
      <Text style={styles.itemText}>{label}</Text>
      <View style={styles.itemCheckboxArea}>
        <Checkbox checked={isCorrect} label="ถูกต้อง" />
        <Checkbox checked={isIncorrect} label="ต้องแก้ไข" />
        {isIncorrect ? <Text style={styles.noteValue}>{note || ''}</Text> : null}
      </View>
    </View>
  );
};

// คอมโพเนนต์หลักของเอกสาร PDF
const CondoInspectionPDF = ({ formData }) => {
  if (!formData) {
    return <Document><Page style={styles.page}><Text>ไม่มีข้อมูล</Text></Page></Document>;
  }

  const getFullText = (key) => formData[key] || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer} fixed>
          <Image src={`${baseUrl}/pea_logo.png`} style={{ width: 40, height: 40 }} />
          <View style={styles.headerText}>
            <Text style={styles.headerPEA}>การไฟฟ้าส่วนภูมิภาค</Text>
            <Text style={styles.headerEN}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
          </View>
          <Text style={styles.headerOffice}>การไฟฟ้า.......................</Text>
        </View>
        <Text style={styles.formTitle} fixed>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
        <Text style={styles.formSubtitle} fixed>สำหรับอาคารชุด/คอนโดมิเนียม</Text>

        <View style={styles.headerInfoRow}>
          <Field label="การตรวจสอบครั้งที่" value={getFullText('inspectionNumber')} style={{ width: '48%' }} />
          <Field label="วันที่" value={getFullText('inspectionDate')} style={{ width: '48%' }} />
        </View>
        <View style={styles.headerInfoRow}>
          <Field label="การตรวจสอบตามคำร้องขอใช้ไฟเลขที่" value={getFullText('requestNumber')} style={{ width: '48%' }} />
          <Field label="วันที่" value={getFullText('requestDate')} style={{ width: '48%' }} />
        </View>

        {/* Section 1: ข้อมูลทั่วไป */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
          <Field label="ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า" value={getFullText('fullName')} />
          <Field label="ชื่ออาคาร/คอนโด" value={getFullText('buildingName')} />
          <View style={styles.row}>
             <Field label="ชั้น" value={getFullText('floor')} style={{ width: '48%' }} />
             <Field label="ห้องเลขที่" value={getFullText('roomNumber')} style={{ width: '48%' }}/>
          </View>
          <Field label="ที่อยู่" value={getFullText('address')} />
          <Field label="โทรศัพท์" value={getFullText('phone')} />
          <View style={{ ...styles.row, marginTop: 5 }}>
            <Checkbox checked={formData.phaseType === '3_phase'} label="ระบบไฟฟ้า 3 เฟส (400/230 V)" />
            <Checkbox checked={formData.phaseType === '1_phase'} label="1 เฟส (230 V)" />
            <Field label="โหลดประมาณ" value={`${getFullText('estimatedLoad')} แอมแปร์`} style={{ marginLeft: 20, flexGrow: 1 }} />
          </View>
        </View>

        {/* Section 2: การตรวจสอบ */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
          <ChecklistItem label="2.1 สายเมนเข้าห้องชุด เป็นไปตามมาตรฐาน" value={formData.mainCableStandard} note={formData.mainCableStandard_note}/>
          <ChecklistItem label="2.2 ขนาดสายเมน สอดคล้องกับขนาดเครื่องวัดฯ" value={formData.mainCableSize} note={formData.mainCableSize_note}/>
          {/* เพิ่มรายการตรวจสอบอื่นๆ ตามฟอร์มคอนโดที่นี่ */}
        </View>

        {/* Section 6: สำหรับผู้ขอใช้ไฟฟ้ารับทราบ */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</Text>
          <Text style={styles.acknowledgementText}>
            ข้าพเจ้ารับทราบผลการตรวจสอบและจะดำเนินการแก้ไขในส่วนที่ต้องปรับปรุง (ถ้ามี) และข้าพเจ้ายินยอมรับผิดชอบต่อความปลอดภัยและความเสียหายใดๆ ที่อาจเกิดขึ้นจากการติดตั้งระบบไฟฟ้าที่ไม่ได้มาตรฐานแต่เพียงฝ่ายเดียว
          </Text>
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <View style={{ position: 'relative', width: '100%', height: 40 }}>
                {formData.userSignature && <Image style={styles.signatureImage} src={formData.userSignature} />}
              </View>
              <View style={styles.signatureLine}></View>
              <Text>(.............................................................)</Text>
              <Text>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
            </View>
            <View style={styles.signatureBox}>
              <View style={{ position: 'relative', width: '100%', height: 40 }}>
                {formData.inspectorSignature && <Image style={styles.signatureImage} src={formData.inspectorSignature} />}
              </View>
              <View style={styles.signatureLine}></View>
              <Text>(.............................................................)</Text>
              <Text>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
            </View>
          </View>
        </View>

        {/* Page Footer */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
        <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-02-63 (แบบฟอร์มตรวจสอบฯ สำหรับอาคารชุด/คอนโดมิเนียม)</Text>
      </Page>
    </Document>
  );
}
export default CondoInspectionPDF;