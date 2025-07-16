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
const InspectionPDF = ({ formData }) => {
  if (!formData) {
    return <Document><Page style={styles.page}><Text>ไม่มีข้อมูล</Text></Page></Document>;
  }
  const getFullText = (key) => formData[key] || '';

  return (
    <Document>
      {/* หน้า 1 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer} fixed>
          <Image src="/pea_logo.png" style={{ width: 40, height: 40 }} />
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
            <Checkbox checked={formData.inspectionStatus === 'passed'} label="มี เอกสารรับรองการออกแบบระบบไฟฟ้า ดังนี้" />
            <Text style={{fontSize: 8, paddingLeft: 10}}> 1. วิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรองในแบบติดตั้งระบบไฟฟ้า (As-built Drawing) </Text>
            <Text style={{fontSize: 8, paddingLeft: 10}}> 2. สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม </Text>
            <Checkbox checked={formData.inspectionStatus === 'not_passed'} label=" ไม่มี เอกสารรับรองการออกแบบระบบไฟฟ้า" />
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>ระบบจำหน่ายแรงสูง</Text>
            <Text style={{fontSize: 8, paddingLeft: 10}}>2.1  ระบบจำหน่ายเหนือดิน</Text>
            {/* 2.1.1 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>
                2.1.1 ชนิดสายตัวนำ {formData.conductorType || ''} เหมาะสมกับพื้นที่และสภาพแวดล้อม
              </Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_conductorType_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_conductorType_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_conductorType_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_conductorType_note || ''}</Text>
              )}
            </View>
            {/* 2.1.2 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>
                2.1.2 ขนาดสายตัวนำ {formData.conductorSize || ''} ตร.มม.
              </Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_conductorSize_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_conductorSize_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_conductorSize_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_conductorSize_note || ''}</Text>
              )}
            </View>
            {/* 2.1.3 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.1.3 สภาพเสาและระยะห่างระหว่างเสา</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_pole_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_pole_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_pole_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_pole_note || ''}</Text>
              )}
            </View>
            {/* 2.1.4 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.1.4 การประกอบอุปกรณ์หัวเสา</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_headEquip_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_headEquip_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_headEquip_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_headEquip_note || ''}</Text>
              )}
            </View>
            {/* 2.1.5 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.1.5 การประกอบชุดยึดโยง</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_guySet_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_guySet_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_guySet_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_guySet_note || ''}</Text>
              )}
            </View>
            {/* 2.1.6 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.1.6 ลูกถ้วยและฉนวนของอุปกรณ์ไฟฟ้าเหมาะสมกับสภาพแวดล้อม</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_insulator_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_insulator_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_insulator_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_insulator_note || ''}</Text>
              )}
            </View>
            {/* 2.1.7 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.1.7 การพาดสาย (สภาพสาย, ระยะหย่อนยาน)</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_wireSag_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_wireSag_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_wireSag_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_wireSag_note || ''}</Text>
              )}
            </View>
            {/* 2.1.8 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.1.8 ระยะห่างของสายกับอาคาร สิ่งก่อสร้าง หรือต้นไม้</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_clearance_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_clearance_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_clearance_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_clearance_note || ''}</Text>
              )}
            </View>
            {/* 2.1.9 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.1.9 การติดตั้งกับดักเสร็จแรงสูง (HV Surge Arrester)</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_surgeArrester_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_surgeArrester_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_surgeArrester_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_surgeArrester_note || ''}</Text>
              )}
            </View>
            {/* 2.1.10 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.1.10 สภาพของจุดต่อสาย</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_joint_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_joint_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_joint_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_joint_note || ''}</Text>
              )}
            </View>
            {/* 2.1.11 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.1.11 การต่อลงดิน</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.overhead_ground_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.overhead_ground_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.overhead_ground_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.overhead_ground_note || ''}</Text>
              )}
            </View>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>ระบบจำหน่ายแรงสูง</Text>
            <Text style={{fontSize: 8, paddingLeft: 10}}>2.2  ระบบจำหน่ายใต้ดิน</Text>
            {/* 2.2.1 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>
                2.2.1 ชนิดสายตัวนำ {formData.underground_conductorType || ''} เหมาะสมกับพื้นที่และสภาพแวดล้อม
              </Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.underground_conductorType_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.underground_conductorType_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.underground_conductorType_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.underground_conductorType_note || ''}</Text>
              )}
            </View>
            {/* 2.2.2 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>
                2.2.2 ขนาดสายตัวนำ {formData.underground_conductorSize || ''} ตร.มม.
              </Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.underground_conductorSize_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.underground_conductorSize_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.underground_conductorSize_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.underground_conductorSize_note || ''}</Text>
              )}
            </View>
            {/* 2.2.3 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.2.3 สภาพสายส่วนที่มองเห็นได้</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.underground_visibleWire_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.underground_visibleWire_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.underground_visibleWire_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.underground_visibleWire_note || ''}</Text>
              )}
            </View>
            {/* 2.2.4 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.2.4 ความตึงของสายช่วงเข้า-ออก อาคารหรือสิ่งก่อสร้าง</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.underground_tension_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.underground_tension_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.underground_tension_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.underground_tension_note || ''}</Text>
              )}
            </View>
            {/* 2.2.5 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.2.5 การติดตั้งกับดักเสร็จแรงสูง (HV Surge Arrester)</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.underground_surgeArrester_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.underground_surgeArrester_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.underground_surgeArrester_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.underground_surgeArrester_note || ''}</Text>
              )}
            </View>
            {/* 2.2.6 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.2.6 สภาพของจุดต่อสาย</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.underground_joint_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.underground_joint_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.underground_joint_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.underground_joint_note || ''}</Text>
              )}
            </View>
            {/* 2.2.7 */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.2.7 การต่อลงดิน</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.underground_ground_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.underground_ground_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.underground_ground_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.underground_ground_note || ''}</Text>
              )}
            </View>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>2.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)</Text>
            {/* Reordered to match PDF: Status checkboxes first */}
            <View style={styles.checklistItem}>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.mainBreaker_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.mainBreaker_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.mainBreaker_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.mainBreaker_note || ''}</Text>
              )}
            </View>
            {/* Then type checkboxes */}
            <View style={styles.subItem}>
              <Checkbox checked={formData.mainBreaker_type === 'dropout'} label="ดรอพเอาท์ฟิวส์คัตเอาท์" />
              <Checkbox checked={formData.mainBreaker_type === 'switch'} label={`สวิตช์ตัดตอน ชนิด ${formData.mainBreaker_switchType_other || ''}`} />
              <Checkbox checked={formData.mainBreaker_rmu === true} label="RMU (ไม่รวมถึงฟังก์ชันการทำงาน)" />
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.4 อื่นๆ</Text>
              <Text style={styles.noteValue}>{formData.other_highvoltage || ''}</Text>
            </View>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>หม้อแปลง</Text>
            {/* 2.5 คุณสมบัติทั่วไปของหม้อแปลง */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.5 คุณสมบัติทั่วไปของหม้อแปลง</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.transformer_test_status === 'ผ่านการทดสอบ'} label="ผ่านการทดสอบ" />
                <Checkbox checked={formData.transformer_test_status === 'ไม่ผ่านการทดสอบ'} label="ไม่ผ่านการทดสอบ" />
              </View>
              {formData.transformer_test_status === 'ไม่ผ่านการทดสอบ' && (
                <Text style={styles.noteValue}>{formData.transformer_test_note || ''}</Text>
              )}
            </View>
            <View style={styles.subItem}>
              <Text style={styles.itemText}>
                หม้อแปลงเครื่องที่ {formData.transformer_number || ''} ขนาด {formData.transformer_size_kva || ''} kVA
              </Text>
              <Text style={styles.itemText}>
                พิกัดแรงดันด้านแรงสูง {formData.transformer_hv_rating_kv || ''} kV พิกัดแรงดันด้านแรงต่ำ {formData.transformer_lv_rating_v || ''} V
              </Text>
              <Text style={styles.itemText}>
                % Impedance {formData.transformer_impedance_percent || ''}
              </Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.transformer_type === 'Oil'} label="Oil" />
                <Checkbox checked={formData.transformer_type === 'Dry'} label="Dry" />
                <Checkbox checked={formData.transformer_type === 'อื่นๆ'} label={`อื่นๆ ${formData.transformer_type_other || ''}`} />
              </View>
              <Text style={styles.itemText}>
                Vector Group {formData.transformer_vector_group || ''}
              </Text>
              <Text style={styles.itemText}>
                พิกัดการทนกระแสลัดวงจรสูงสุด {formData.transformer_shortcircuit_rating_kA || ''} kA
              </Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.transformer_check_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.transformer_check_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.transformer_check_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.transformer_check_note || ''}</Text>
              )}
            </View>
            {/* 2.6 ลักษณะการติดตั้ง */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.6 ลักษณะการติดตั้ง</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.transformer_install_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.transformer_install_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.transformer_install_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.transformer_install_note || ''}</Text>
              )}
            </View>
            <View style={styles.subItem}>
              <Checkbox checked={formData.transformer_install_type === 'แขวน'} label="แขวน" />
              <Checkbox checked={formData.transformer_install_type === 'นั่งร้าน'} label="นั่งร้าน" />
              <Checkbox checked={formData.transformer_install_type === 'ตั้งพื้น'} label="ตั้งพื้น" />
              <Checkbox checked={formData.transformer_install_type === 'ตั้งบนดาดฟ้า'} label="ตั้งบนดาดฟ้า" />
              <Checkbox checked={formData.transformer_install_type === 'ห้องหม้อแปลง'} label="ห้องหม้อแปลง" />
              <Checkbox checked={formData.transformer_install_type === 'อื่นๆ'} label={`อื่นๆ ${formData.transformer_install_other || ''}`} />
            </View>
            {/* 2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า</Text>
              {/* Reordered to match PDF: Status checkboxes first */}
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.hv_incoming_protection_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.hv_incoming_protection_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.hv_incoming_protection_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.hv_incoming_protection_note || ''}</Text>
              )}
            </View>
            <View style={styles.subItem}>
              <Checkbox checked={formData.hv_incoming_protection_type === 'dropout'} label="ดรอพเอาท์ฟิวส์คัตเอาท์" />
              <Checkbox checked={formData.hv_incoming_protection_type === 'circuit_breaker'} label="เซอร์กิตเบรกเกอร์" />
              <Checkbox checked={formData.hv_incoming_protection_type === 'อื่นๆ'} label={`อื่นๆ ${formData.hv_incoming_protection_type_other || ''}`} />
              <Text style={styles.itemText}>
                พิกัดกระแสต่อเนื่อง {formData.hv_incoming_protection_continuous_A || ''} A
              </Text>
              <Text style={styles.itemText}>
                พิกัดตัดกระแสลัดวงจรสูงสุด (Interrupting Capacity, IC) {formData.hv_incoming_protection_interrupt_kA || ''} kA
              </Text>
            </View>
            {/* 2.8 การติดตั้งกับดักเสร็จแรงสูง (HV Surge Arrester) */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.8 การติดตั้งกับดักเสร็จแรงสูง (HV Surge Arrester)</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.hv_surgeArrester_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.hv_surgeArrester_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.hv_surgeArrester_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.hv_surgeArrester_note || ''}</Text>
              )}
              <Text style={styles.itemText}>
                พิกัดแรงดัน {formData.hv_surgeArrester_voltage_kv || ''} kV พิกัดกระแส {formData.hv_surgeArrester_current_kA || ''} kA
              </Text>
            </View>
            {/* 2.9 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสร็จแรงสูง */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.9 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสร็จแรงสูง</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.transformer_grounding_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.transformer_grounding_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.transformer_grounding_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.transformer_grounding_note || ''}</Text>
              )}
            </View>
            {/* 2.10 ค่าความต้านทานดินของระบบแรงสูง */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>
                2.10 ค่าความต้านทานดินของระบบแรงสูง {formData.hv_ground_resistance_ohm || ''} โอห์ม
              </Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.hv_ground_resistance_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.hv_ground_resistance_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.hv_ground_resistance_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.hv_ground_resistance_note || ''}</Text>
              )}
            </View>
            {/* 2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน) */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)</Text>
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.11.1 สารดูดความชื้น</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.transformer_desiccant_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.transformer_desiccant_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.transformer_desiccant_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.transformer_desiccant_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.11.2 สภาพบชชิ่ง</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.transformer_bushing_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.transformer_bushing_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.transformer_bushing_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.transformer_bushing_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.11.3 ระดับน้ำมัน</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.transformer_oil_level_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.transformer_oil_level_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.transformer_oil_level_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.transformer_oil_level_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.11.4 การรั่วซึมของน้ำมันหม้อแปลง</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.transformer_oil_leak_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.transformer_oil_leak_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.transformer_oil_leak_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.transformer_oil_leak_note || ''}</Text>
              )}
            </View>
            {/* 2.12 ป้ายเตือน */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.12 ป้ายเตือน</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.hv_warning_sign_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.hv_warning_sign_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.hv_warning_sign_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.hv_warning_sign_note || ''}</Text>
              )}
              <Text style={styles.itemText}>“อันตรายไฟฟ้าแรงสูง เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น”</Text>
            </View>
            {/* 2.13 อื่นๆ */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.13 อื่นๆ</Text>
              <Text style={styles.noteValue}>{formData.hv_other_remark || ''}</Text>
            </View>
        </View>
        <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber}/${totalPages}`)} />
        <Text style={styles.docIdFooter} fixed>{`กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)`}</Text>
      </Page>

      {/* หน้า 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>ระบบจำหน่ายแรงต่ำ</Text>
            {/* 2.14 สายตัวนำประธานแรงต่ำ */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.14.1 สายไฟฟ้าเป็นไปตามมาตรฐาน มอก.11-2553 หรือ มอก. 293-2541 หรือ IEC 60502</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_cableStandard_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_cableStandard_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_cableStandard_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_cableStandard_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.14.2 ชนิดและขนาดของสายไฟฟ้า</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_cableType === 'IEC 01'} label="IEC 01" />
                <Checkbox checked={formData.lv_cableType === 'NYY'} label="NYY" />
                <Checkbox checked={formData.lv_cableType === 'CV'} label="CV" />
                <Checkbox checked={formData.lv_cableType === 'อื่นๆ'} label={`อื่นๆ ${formData.lv_cableType_other || ''}`} />
              </View>
              <Text style={styles.itemText}>ขนาด {formData.lv_cableSize || ''} ตร.มม.</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_cableTypeSize_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_cableTypeSize_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_cableTypeSize_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_cableTypeSize_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.14.3 วิธีการเดินสาย</Text>
              {/* Reordered to match PDF: Status checkboxes first */}
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_wiringMethod_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_wiringMethod_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_wiringMethod_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_wiringMethod_note || ''}</Text>
              )}
            </View>
            <View style={styles.subItem}>
              <Checkbox checked={formData.lv_wiringMethod_overhead === true} label="บนลูกถ้วยฉนวนในอากาศ" />
              <Checkbox checked={formData.lv_wiringMethod_conduit === true} label="ท่อร้อยสาย (Conduit)" />
              <Checkbox checked={formData.lv_wiringMethod_wireway === true} label="รางเดินสาย (Wire Way)" />
              <Checkbox checked={formData.lv_wiringMethod_cabletray === true} label="รางเคเบิล (Cable Tray)" />
              <Checkbox checked={formData.lv_wiringMethod_busway === true} label="บัสเวย์ (Bus Way)" />
              <Checkbox checked={formData.lv_wiringMethod_underground === true} label="เดินฝังใต้ดิน" />
              <Checkbox checked={formData.lv_wiringMethod_other === true} label={`อื่นๆ ${formData.lv_wiringMethod_other_text || ''}`} />
              <Text style={{...styles.itemText, fontSize: 7, marginTop: 5}}>* การไฟฟ้าส่วนภูมิภาคกำหนดให้ใช้สายตัวนำทองแดงสำหรับการเดินสายภายในและภายนอกอาคาร สำหรับสายตัวนำอะลูมิเนียมอนุญาตให้ใช้เป็นตัวนำประธานได้เฉพาะการเดินสายบนลูกถ้วยฉนวนภายนอกอาคาร</Text>
            </View>
            {/* 2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร</Text>
              {/* Reordered to match PDF: Status checkboxes first */}
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_mainSwitch_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_mainSwitch_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_mainSwitch_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_mainSwitch_note || ''}</Text>
              )}
            </View>
            <View style={styles.subItem}>
              <Checkbox checked={formData.lv_mainSwitch_cb === true} label="เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2" />
              <Checkbox checked={formData.lv_mainSwitch_switchfuse === true} label="สวิตช์พร้อมฟิวส์" />
              <Checkbox checked={formData.lv_mainSwitch_other_standard === true} label={`มาตรฐานอื่นๆ โปรดระบุ ${formData.lv_mainSwitch_other_standard_text || ''}`} />
              <Text style={styles.itemText}>ผลิตภัณฑ์ {formData.lv_mainSwitch_product || ''} Type {formData.lv_mainSwitch_type || ''}</Text>
              <Text style={styles.itemText}>In {formData.lv_mainSwitch_in || ''}A IC {formData.lv_mainSwitch_ic || ''}kA แรงดัน {formData.lv_mainSwitch_voltage || ''}V</Text>
              <Text style={styles.itemText}>AT {formData.lv_mainSwitch_at || ''}A AF {formData.lv_mainSwitch_af || ''}A (เฉพาะเซอร์กิตเบรกเกอร์)</Text>
              <Text style={{fontSize: 7, marginTop: 5}}>บริภัณฑ์ประธานแรงต่ำที่มีขนาดตั้งแต่ 1,000 A ขึ้นไป ต้องติดตั้ง</Text>
              <Checkbox checked={formData.lv_mainSwitch_gfp === true} label="Ground Fault Protection (GFP)" />
            </View>
            {/* 2.16 การต่อลงดินของแผงเมนสวิตช์ของอาคาร */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.16.1 ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน</Text>
              <Text style={styles.itemText}>ขนาดสายต่อหลักดิน {formData.lv_groundWireSize || ''} ตร.มม.</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_groundWireSize_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_groundWireSize_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_groundWireSize_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_groundWireSize_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.16.2 ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม (ยกเว้นพื้นที่ที่ยากในการปฏิบัติและการไฟฟ้าส่วนภูมิภาคเห็นชอบ ยอมให้ค่าความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดินเพิ่มอีก 1 แทง)</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_groundResistance_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_groundResistance_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_groundResistance_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_groundResistance_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.16.3 ต้องทำจุดทดสอบ สำหรับใช้วัดค่าความต้านทานการต่อลงดิน</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_groundTestPoint_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_groundTestPoint_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_groundTestPoint_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_groundTestPoint_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.16.4 แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่ กฟภ. กำหนด</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_groundBusNeutralBus_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_groundBusNeutralBus_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_groundBusNeutralBus_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_groundBusNeutralBus_note || ''}</Text>
              )}
            </View>
            {/* 2.17 แผงจ่ายไฟประจำชั้น */}
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.17.1 เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898 หรือ IEC60947-2</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_floorPanel_cb_standard === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_floorPanel_cb_standard === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_floorPanel_cb_standard === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_floorPanel_cb_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.17.2 เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดสายป้อนแต่ละชั้น</Text>
              <Text style={styles.itemText}>ขนาด AT {formData.lv_floorPanel_cb_at || ''}A , AF {formData.lv_floorPanel_cb_af || ''}A, IC {formData.lv_floorPanel_cb_ic || ''}kA</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_floorPanel_cb_match_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_floorPanel_cb_match_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_floorPanel_cb_match_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_floorPanel_cb_match_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.17.3 การติดตั้งขั้วต่อสายดิน (Ground Bus)</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.lv_floorPanel_groundBus_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.lv_floorPanel_groundBus_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.lv_floorPanel_groundBus_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.lv_floorPanel_groundBus_note || ''}</Text>
              )}
            </View>
        </View>
        <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber}/${totalPages}`)} />
        <Text style={styles.docIdFooter} fixed>{`กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)`}</Text>
      </Page>

      {/* หน้า 3 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.checklistItem}>
            <Text style={styles.itemText}>2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์ มีขนาดสอดคล้องกับ ขนาดมิเตอร์ AT {formData.meterBreaker_at || ''}A, AF {formData.meterBreaker_af || ''}A</Text>
            <View style={styles.itemCheckboxArea}>
              <Checkbox checked={formData.meterBreaker_status === 'ถูกต้อง'} label="ถูกต้อง" />
              <Checkbox checked={formData.meterBreaker_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
            </View>
            {formData.meterBreaker_status === 'ต้องแก้ไข' && (
              <Text style={styles.noteValue}>{formData.meterBreaker_note || ''}</Text>
            )}
          </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.itemText}>2.19 สายตัวนำประธานเข้าห้องชุด</Text>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>สายไฟฟ้าเป็นไปตามมาตรฐาน มอก.11-2553 หรือ IEC 60502</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.unitCable_standard_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.unitCable_standard_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.unitCable_standard_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.unitCable_standard_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>ชนิด {formData.unitCable_type || ''} ขนาด {formData.unitCable_size || ''} ตร.มม.</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.unitCable_wiringMethod_conduit === true} label="เดินในท่อร้อยสาย" />
                <Checkbox checked={formData.unitCable_wiringMethod_wireway === true} label="เดินในรางเดินสาย" />
                <Checkbox checked={formData.unitCable_wiringMethod_other === true} label={`อื่นๆ ${formData.unitCable_wiringMethod_other_text || ''}`} />
              </View>
            </View>
        </View>
        <View style={styles.section}>
            <Text style={styles.itemText}>2.20 แผงจ่ายไฟในห้องชุด</Text>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.20.1 เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.unitPanel_cb_standard_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.unitPanel_cb_standard_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.unitPanel_cb_standard_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.unitPanel_cb_standard_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.20.2 เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์</Text>
              <Text style={styles.itemText}>ขนาด AT {formData.unitPanel_cb_at || ''}A, AF {formData.unitPanel_cb_af || ''}A</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.unitPanel_cb_meterMatch_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.unitPanel_cb_meterMatch_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.unitPanel_cb_meterMatch_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.unitPanel_cb_meterMatch_note || ''}</Text>
              )}
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.itemText}>2.20.3 พิกัดตัดกระแสลัดวงจรสูงสุด (Interrupting Capacity, IC) ของเซอร์กิตเบรกเกอร์ ไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)</Text>
              <View style={styles.itemCheckboxArea}>
                <Checkbox checked={formData.unitPanel_cb_ic_status === 'ถูกต้อง'} label="ถูกต้อง" />
                <Checkbox checked={formData.unitPanel_cb_ic_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
              </View>
              {formData.unitPanel_cb_ic_status === 'ต้องแก้ไข' && (
                <Text style={styles.noteValue}>{formData.unitPanel_cb_ic_note || ''}</Text>
              )}
            </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.checklistItem}>
            <Text style={styles.itemText}>2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน (Ground Bus) สำหรับต่อกับอุปกรณ์และเครื่องใช้ไฟฟ้า</Text>
            <View style={styles.itemCheckboxArea}>
              <Checkbox checked={formData.unitPanel_groundBus_status === 'ถูกต้อง'} label="ถูกต้อง" />
              <Checkbox checked={formData.unitPanel_groundBus_status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
            </View>
            {formData.unitPanel_groundBus_status === 'ต้องแก้ไข' && (
              <Text style={styles.noteValue}>{formData.unitPanel_groundBus_note || ''}</Text>
            )}
          </Text>
        </View>
        <View style={styles.checklistItem}>
          <Text style={styles.itemText}>2.22 อื่นๆ</Text>
          <Text style={styles.noteValue}>{formData.unitPanel_other_remark || ''}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</Text>
          <View style={{...styles.row, marginTop: 5}}>
            <Checkbox checked={formData.summary_meter_permanent === true} label="ติดตั้งมิเตอร์ถาวร" />
            <Checkbox checked={formData.summary_meter_temporary === true} label="ติดตั้งมิเตอร์ชั่วคราว" />
            <Checkbox checked={formData.summary_meter_needs_fix === true} label="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. ขอบเขตและข้อจำกัดในการตรวจสอบ</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</Text>
          <Text style={styles.acknowledgementText}>
            5.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน ตลอดจนข้อปลีกย่อย
            อื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าให้เป็นไปตามมาตรฐาน
            การติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิด
            ความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงให้อยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว [cite: 377]
          </Text>
          <Text style={styles.acknowledgementText}>
            5.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหน้า หรือ
            อุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว [cite: 378]
          </Text>
          <Text style={styles.acknowledgementText}>
            5.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้ง
            ทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว [cite: 379]
          </Text>
        </View>

        <View style={styles.signatureSection} fixed>
          <View style={styles.signatureBox}>
            {formData.userSignature && <Image style={styles.signatureImage} src={formData.userSignature} />}
            <Text style={styles.signatureLine}>(..................................................)</Text>
            <Text style={{fontSize: 8}}>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
          </View>
          <View style={styles.signatureBox}>
            {formData.inspectorSignature && <Image style={styles.signatureImage} src={formData.inspectorSignature} />}
            <Text style={styles.signatureLine}>(..................................................)</Text>
            <Text style={{fontSize: 8}}>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
          </View>
        </View>
        <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber}/${totalPages}`)} />
        <Text style={styles.docIdFooter} fixed>{`กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)`}</Text>
      </Page>
    </Document>
  );
}
export default InspectionPDF;