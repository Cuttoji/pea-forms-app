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
  projectName: "-",
  approvalNo: "-",
  approvalDate: "-",
  jobNo: "-",
  inspectionDate2: "-",
  peaType: "",
  hvAmount: "-",
  hvPoleCount: "-",
  stationName: "-",
  feeder: "-",
  phase: "-",
  kva: "-",
  lvAmount: "-",
  lvPoleCount: "-",
  supervisor: "-",
  position: "-",
  department: "-",
  customerName: "-",
  phone: "-",
  address: "-",
  systemType: "-",
  load: "-",
  latitude: "-",
  longitude: "-",
  houseImage: "",
  sections: [],
  summary: {
    summaryResult: "",
    inspector1: "",
    inspectorPosition1: "",
    inspectorSign1: null,
  },
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
const CorrectiveItem = ({ label, status, note, item }) => {
  // ตรวจสอบว่าเป็น TR item หรือไม่
  if (item && item.key === 'tr_3_0') {
    return (
      <View style={{ marginBottom: 6, padding: 6, border: '1px solid #999', borderRadius: 3, backgroundColor: '#f9f9f9' }}>
        <Text style={{ fontSize: 9, fontWeight: 'bold' }}>
          TR {item.number || '............'} Ø {item.phase ? `${item.phase} เฟส` : '.............'} {item.kva || '.............'} kVA
        </Text>
        {Array.isArray(item.type) && item.type.length > 0 && (
          <View style={{ flexDirection: 'row', marginTop: 3, fontSize: 8 }}>
            <Checkbox checked={item.type.includes('แขวน')} label="แขวน" />
            <Checkbox checked={item.type.includes('นั่งร้าน')} label="นั่งร้าน" />
          </View>
        )}
      </View>
    );
  }

  // ตรวจสอบฟิลด์พิเศษ
  const hasOhm = item && 'ohm' in item;
  const hasSystem = item && 'system' in item;
  const hasOther = item && 'other' in item;

  return (
    <View style={styles.checklistItem}>
      <Text style={styles.itemText}>{label}</Text>
      <Checkbox checked={status === 'correct'} label="✓" />
      <Checkbox checked={status === 'fix'} label="×" />
      <Checkbox checked={!status || status === 'none'} label="-" />
      <Text style={{ ...styles.value, flexGrow: 0, minWidth: '35%', display: status === 'fix' ? 'flex' : 'none' }}> {note || ''} </Text>
      
      {/* แสดงฟิลด์พิเศษ */}
      {(hasOhm || hasSystem || hasOther) && (
        <View style={{ width: '100%', marginTop: 2, paddingLeft: 10, fontSize: 7 }}>
          {hasOhm && (
            <Text>ค่าความต้านทาน: {item.ohm || '............'} Ω</Text>
          )}
          {hasSystem && (
            <Text>ระบบ: {item.system === '3phase' ? '3 เฟส' : item.system === '1phase' ? '1 เฟส' : '............'}</Text>
          )}
          {hasOther && item.other && (
            <Text>อื่นๆ: {item.other}</Text>
          )}
        </View>
      )}
    </View>
  );
};

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
    <Field label="ชื่องาน:" value={data.general?.projectName} />
    <View style={styles.headerInfoRow}>
      <Field label="อนุมัติเลขที่:" value={data.general?.approvalNo} style={{ width: '48%' }} />
      <Field label="ลงวันที่:" value={data.general?.approvalDate} style={{ width: '48%' }} />
    </View>
    <View style={styles.headerInfoRow}>
      <Field label="หมายเลขงาน:" value={data.general?.jobNo} style={{ width: '48%' }} />
      <Field label="วันที่ดำเนินการตรวจ:" value={data.general?.inspectionDate2} style={{ width: '48%' }} />
    </View>
    <View style={{ ...styles.row, marginTop: 5 }}>
      <Checkbox checked={data.general?.peaType === 'pea'} label="กฟภ. ดำเนินการ" />
      <Checkbox checked={data.general?.peaType === 'company'} label="งานจ้างฯบริษัท" />
    </View>
  </View>
);

const WorkVolumeSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>ปริมาณงาน</Text>
    <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>งานแรงสูง</Text>
    <View style={styles.headerInfoRow}>
      <Field label="ปริมาณงาน (วงจร-กม.):" value={data.general?.hvAmount} style={{ width: '48%' }} />
      <Field label="จำนวนเสา (ต้น):" value={data.general?.hvPoleCount} style={{ width: '48%' }} />
    </View>
    <View style={styles.headerInfoRow}>
      <Field label="รับไฟจากสถานี:" value={data.general?.stationName} style={{ width: '48%' }} />
      <Field label="ฟีดเดอร์:" value={data.general?.feeder} style={{ width: '48%' }} />
    </View>
    <View style={styles.headerInfoRow}>
      <Field label="เฟสที่ต่อ:" value={data.general?.phase} style={{ width: '48%' }} />
      <Field label="หม้อแปลงรวม (KVA):" value={data.general?.kva} style={{ width: '48%' }} />
    </View>
    <Text style={{ fontWeight: 'bold', marginBottom: 2, marginTop: 8 }}>งานแรงต่ำ</Text>
    <View style={styles.headerInfoRow}>
      <Field label="ปริมาณงาน (วงจร-กม.):" value={data.general?.lvAmount} style={{ width: '48%' }} />
      <Field label="จำนวนเสา (ต้น):" value={data.general?.lvPoleCount} style={{ width: '48%' }} />
    </View>
    <Text style={{ fontWeight: 'bold', marginBottom: 2, marginTop: 8 }}>ผู้ควบคุมงาน</Text>
    <Field label="ชื่อ:" value={data.general?.supervisor} />
    <View style={styles.headerInfoRow}>
      <Field label="ตำแหน่ง:" value={data.general?.position} style={{ width: '48%' }} />
      <Field label="สังกัด:" value={data.general?.department} style={{ width: '48%' }} />
    </View>
  </View>
);

const InspectionItemsSection = ({ sections }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>รายการตรวจสอบ</Text>
    {Array.isArray(sections) && sections.length > 0 ? (
      sections.map((section, index) => (
        <View key={index} style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{section.title}</Text>
          {Array.isArray(section.items) && section.items.map((item, itemIndex) => (
            <CorrectiveItem
              key={itemIndex}
              label={item.label}
              status={item.result}
              note={item.detail}
              item={item}
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
        <Checkbox checked={data.summary?.summaryResult === 'correct'} label="ตรวจสอบแล้ว ถูกต้องตามมาตรฐาน กฟภ." />
        <Checkbox checked={data.summary?.summaryResult === 'fix'} label="ตรวจสอบแล้ว เห็นควรแก้ไขให้ถูกต้องตามรายการข้างต้น" />
      </View>
    </View>
    <View style={styles.signatureSection}>
      <View style={styles.signatureBox}>
        {data.general?.customerName && (
          <>
            <Text style={styles.signatureLine}>({data.general.customerName})</Text>
            <Text style={{ fontSize: 8 }}>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
          </>
        )}
      </View>
      <View style={styles.signatureBox}>
        {data.summary?.inspectorSign1 && <Image style={styles.signatureImage} src={data.summary.inspectorSign1} alt="" />}
        <Text style={styles.signatureLine}>({data.summary?.inspector1 || "................................................."})</Text>
        <Text style={{ fontSize: 8 }}>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
        <Text style={{ fontSize: 8 }}>ตำแหน่ง: {data.summary?.inspectorPosition1 || "-"}</Text>
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
    general: {
      ...mockData.general,
      ...(formData?.general || {})
    },
    sections: Array.isArray(formData?.sections) ? formData.sections : mockData.sections,
    summary: {
      ...mockData.summary,
      ...(formData?.summary || {})
    }
  };

  return (
    <Document>
      {/* --- หน้า 1 --- */}
      <Page size="A4" style={styles.page}>
        <HeaderSection />
        <Text style={styles.formTitle} fixed>แบบฟอร์มตรวจสอบมาตรฐานงานก่อสร้างและปรับปรุงระบบจำหน่าย ของ กฟภ.</Text>
        <InfoSection data={safeData} />
        <WorkVolumeSection data={safeData} />
        <InspectionItemsSection sections={safeData.sections} />
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