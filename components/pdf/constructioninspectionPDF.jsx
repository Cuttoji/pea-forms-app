"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register Sarabun font
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.ttf' },
    { src: '/fonts/Sarabun-Bold.ttf', fontWeight: 'bold' },
  ]
});

// --- Fallback mock data ---
const mockData = {
  work_name: "-",
  approval_number: "-",
  approval: "-",
  work_id: "-",
  inspection_date: "-",
  operation: false,
  contractor_work: false,
  hv_work_volume: "-",
  hv_work_volume_poles: "-",
  hv_station: "-",
  hv_feeder: "-",
  hv_phase: "-",
  hv_transformer_kva: "-",
  lv_work_volume: "-",
  lv_work_volume_poles: "-",
  supervisor_name: "-",
  supervisor_position: "-",
  supervisor_affiliation: "-",
  inspection_items: [],
  inspection_result: "-",
  user_signature: null,
  user_position: "-",
  inspector_signature: null,
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  page: { fontFamily: 'Sarabun', fontSize: 8, paddingTop: 30, paddingBottom: 50, paddingHorizontal: 35, backgroundColor: "#fff" },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  headerText: { textAlign: 'center', flexGrow: 1, paddingTop: 5 },
  headerPEA: { fontSize: 14, fontWeight: 'bold' },
  headerEN: { fontSize: 8 },
  formTitle: { fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 2 },
  formSubtitle: { fontSize: 9, textAlign: 'center', marginBottom: 8 },
  headerInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  section: { marginTop: 6, marginBottom: 4, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0', borderBottomStyle: "solid" },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 4, paddingBottom: 2, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2, flexWrap: 'wrap' },
  label: { marginRight: 4, flexShrink: 0, paddingBottom: 1 },
  value: { borderBottom: '0.5px dotted #666', flexGrow: 1, minHeight: 10, paddingLeft: 2 },
  checklistItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2, paddingLeft: 5, flexWrap: 'wrap' },
  itemText: { flex: 1, minWidth: '55%', marginRight: 4, lineHeight: 1.2 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 8, marginTop: 1 },
  checkbox: { width: 8, height: 8, borderWidth: 0.5, borderColor: '#000', marginRight: 3, alignItems: 'center', justifyContent: 'center' },
  checkMark: { fontSize: 8, transform: 'translateY(-1px)' },
  subItem: { paddingLeft: 10, marginTop: 2 },
  acknowledgementText: { fontSize: 7.5, fontWeight: 'light', lineHeight: 1.4, marginBottom: 5, textAlign: 'justify' },
  signatureSection: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-around' },
  signatureBox: { width: '45%', textAlign: 'center' },
  signatureImage: { width: 100, height: 40, alignSelf: 'center', marginBottom: 5, borderColor: '#e0e0e0', borderWidth: 1 },
  signatureLine: { borderTop: '0.5px dotted #999', marginTop: 5, marginBottom: 3, fontSize: 8 },
  pageNumber: { position: 'absolute', fontSize: 8, bottom: 20, left: 0, right: 35, textAlign: 'right', color: 'grey' },
  docIdFooter: { position: 'absolute', fontSize: 7, bottom: 20, left: 35, color: 'grey' },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  gridColumn: { width: '49%' },
  recommendationBox: { marginTop: 10, border: '1px solid #ccc', padding: 8 },
  recommendationTitle: { fontWeight: 'bold', marginBottom: 4, fontSize: 8.5 },
});

// --- Helper Components ---
const Field = ({ label, value = '', style }) => (
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
const CorrectiveItem = ({ label, status, note }) => (
  <View style={styles.checklistItem}>
    <Text style={styles.itemText}>{label}</Text>
    <Checkbox checked={status === 'ถูกต้อง'} label="ถูกต้อง" />
    <Checkbox checked={status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
    <Text style={{ ...styles.value, flexGrow: 0, minWidth: '50%', display: status === 'ต้องแก้ไข' ? 'block' : 'none' }}> {note || ''} </Text>
  </View>
);

// --- Section Components ---
const HeaderSection = () => (
  <View style={styles.headerContainer} fixed>
    <Image src="/pea_logo.png" style={{ width: 40, height: 40 }} alt="" />
    <View style={styles.headerText}>
      <Text style={styles.headerPEA}>การไฟฟ้าส่วนภูมิภาค</Text>
      <Text style={styles.headerEN}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
    </View>
  </View>
);

const InfoSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>ข้อมูลส่วนหัว</Text>
    <Field label="ชื่องาน:" value={data.work_name} />
    <View style={styles.headerInfoRow}>
      <Field label="อนุมัติเลขที่:" value={data.approval_number} style={{ width: '48%' }} />
      <Field label="ลงวันที่:" value={data.approval} style={{ width: '48%' }} />
    </View>
    <View style={styles.headerInfoRow}>
      <Field label="หมายเลขงาน:" value={data.work_id} style={{ width: '48%' }} />
      <Field label="วันที่ดำเนินการตรวจ:" value={data.inspection_date} style={{ width: '48%' }} />
    </View>
    <View style={{ ...styles.row, marginTop: 5 }}>
      <Checkbox checked={!!data.operation} label="กฟภ. ดำเนินการ" />
      <Checkbox checked={!!data.contractor_work} label="งานจ้างฯบริษัท" />
    </View>
  </View>
);

const WorkVolumeSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>ปริมาณงาน</Text>
    <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>งานแรงสูง</Text>
    <View style={styles.headerInfoRow}>
      <Field label="ปริมาณงาน (วงจร-กม.):" value={data.hv_work_volume} style={{ width: '48%' }} />
      <Field label="จำนวนเสา (ต้น):" value={data.hv_work_volume_poles} style={{ width: '48%' }} />
    </View>
    <View style={styles.headerInfoRow}>
      <Field label="รับไฟจากสถานี:" value={data.hv_station} style={{ width: '48%' }} />
      <Field label="ฟีดเดอร์:" value={data.hv_feeder} style={{ width: '48%' }} />
    </View>
    <View style={styles.headerInfoRow}>
      <Field label="เฟสที่ต่อ:" value={data.hv_phase} style={{ width: '48%' }} />
      <Field label="หม้อแปลงรวม (KVA):" value={data.hv_transformer_kva} style={{ width: '48%' }} />
    </View>
    <Text style={{ fontWeight: 'bold', marginBottom: 2, marginTop: 8 }}>งานแรงต่ำ</Text>
    <View style={styles.headerInfoRow}>
      <Field label="ปริมาณงาน (วงจร-กม.):" value={data.lv_work_volume} style={{ width: '48%' }} />
      <Field label="จำนวนเสา (ต้น):" value={data.lv_work_volume_poles} style={{ width: '48%' }} />
    </View>
    <Text style={{ fontWeight: 'bold', marginBottom: 2, marginTop: 8 }}>ผู้ควบคุมงาน</Text>
    <Field label="ชื่อ:" value={data.supervisor_name} />
    <View style={styles.headerInfoRow}>
      <Field label="ตำแหน่ง:" value={data.supervisor_position} style={{ width: '48%' }} />
      <Field label="สังกัด:" value={data.supervisor_affiliation} style={{ width: '48%' }} />
    </View>
  </View>
);

const InspectionItemsSection = ({ items }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>รายการตรวจสอบ</Text>
    {Array.isArray(items) && items.length > 0 ? (
      items.map((category, index) => (
        <View key={index} style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{category.title}</Text>
          {Array.isArray(category.items) && category.items.map((item, itemIndex) => (
            <CorrectiveItem
              key={itemIndex}
              label={item.label}
              status={item.value}
              note={item.note}
            />
          ))}
        </View>
      ))
    ) : (
      <Text>-</Text>
    )}
  </View>
);

const ResultAndSignatureSection = ({ data }) => (
  <>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ผลการตรวจสอบ</Text>
      <View style={{ ...styles.row, paddingLeft: 10 }}>
        <Checkbox checked={data.inspection_result === 'ถูกต้องตามมาตรฐาน กฟภ.'} label="ตรวจสอบแล้ว ถูกต้องตามมาตรฐาน กฟภ." />
        <Checkbox checked={data.inspection_result === 'เห็นควรแก้ไข'} label="ตรวจสอบแล้ว เห็นควรแก้ไขให้ถูกต้องตามรายการข้างต้น" />
      </View>
    </View>
    <View style={styles.signatureSection}>
      <View style={styles.signatureBox}>
        {data.user_signature && <Image style={styles.signatureImage} src={data.user_signature} alt="" />}
        <Text style={styles.signatureLine}>(..................................................)</Text>
        <Text style={{ fontSize: 8 }}>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
        <Text style={{ fontSize: 8 }}>ตำแหน่ง: {data.user_position || "-"}</Text>
      </View>
      <View style={styles.signatureBox}>
        {data.inspector_signature && <Image style={styles.signatureImage} src={data.inspector_signature} alt="" />}
        <Text style={styles.signatureLine}>(..................................................)</Text>
        <Text style={{ fontSize: 8 }}>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
      </View>
    </View>
  </>
);

// --- PDF Document ---
const ConstructionInspectionPDF = ({ formData }) => {
  // รวม mockData กับ formData เพื่อกัน field หาย
  const safeData = {
    ...mockData,
    ...(formData || {}),
    inspection_items: Array.isArray(formData?.inspection_items) ? formData.inspection_items : [],
  };

  return (
    <Document>
      {/* --- หน้า 1 --- */}
      <Page size="A4" style={styles.page}>
        <HeaderSection />
        <Text style={styles.formTitle} fixed>แบบฟอร์มตรวจสอบมาตรฐานงานก่อสร้างและปรับปรุงระบบจำหน่าย ของ กฟภ.</Text>
        <InfoSection data={safeData} />
        <WorkVolumeSection data={safeData} />
        <InspectionItemsSection items={safeData.inspection_items} />
        <Text style={styles.docIdFooter} fixed>แบบฟอร์มตรวจสอบมาตรฐานงานก่อสร้างและปรับปรุงระบบจำหน่าย ของ กฟภ.</Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
      </Page>
      {/* --- หน้า 2 --- */}
      <Page size="A4" style={styles.page}>
        <HeaderSection />
        <ResultAndSignatureSection data={safeData} />
        <Text style={styles.docIdFooter} fixed>แบบฟอร์มตรวจสอบมาตรฐานงานก่อสร้างและปรับปรุงระบบจำหน่าย ของ กฟภ.</Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
      </Page>
    </Document>
  );
};

export default ConstructionInspectionPDF;