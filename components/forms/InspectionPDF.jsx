// app/components/forms/InspectionPDF.jsx
"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

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
    paddingTop: 25,
    paddingBottom: 40, // เพิ่มพื้นที่สำหรับ Footer
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1.5px solid #000',
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerText: {
    textAlign: 'center',
    flexGrow: 1,
  },
  headerPEA: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerEN: {
    fontSize: 8,
  },
  peaOffice: {
    position: 'absolute',
    top: 10,
    right: 0,
    fontSize: 9
  },
  formTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
  formSubtitle: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginTop: 10,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 15,
  },
  column: {
    width: '50%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  label: {
    marginRight: 4,
    flexShrink: 0,
  },
  labelBold: {
    fontWeight: 'bold',
  },
  value: {
    borderBottom: '0.5px dotted #999',
    flex: 1,
    minHeight: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 2,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '0.5px solid #000',
    marginRight: 4,
    textAlign: 'center',
    paddingTop: 1,
  },
  note: {
      fontSize: 8,
      color: '#444',
      marginTop: 1,
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signatureBox: {
    width: '45%',
    textAlign: 'center',
  },
  signatureLine: {
    borderTop: '0.5px dotted #999',
    marginTop: 40,
    marginBottom: 3,
  },
  signatureImage: {
    width: 100,
    height: 50,
    alignSelf: 'center',
    position: 'absolute',
    top: -45,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: 0,
    right: 30,
    textAlign: 'right',
    color: 'grey',
  },
  docIdFooter: {
     position: 'absolute',
     fontSize: 8,
     bottom: 20,
     left: 30,
     color: 'grey',
  }
});


// --- คอมโพเนนต์เสริม ---
const Checkbox = ({ checked, label }) => (
  <View style={styles.checkboxContainer}>
    <View style={styles.checkbox}><Text>{checked ? '✓' : ' '}</Text></View>
    <Text>{label}</Text>
  </View>
);

const FormField = ({ label, value, width = '100%' }) => (
    <View style={{...styles.row, width}}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}> {value || ''} </Text>
    </View>
);

const CorrectiveDisplay = ({ checked, note }) => {
    const isCorrect = checked === 'ถูกต้อง';
    const isIncorrect = checked === 'ต้องแก้ไข';
    return (
        <View style={{...styles.row, marginLeft: 15, marginTop: 2, marginBottom: 6}}>
            <Checkbox checked={isCorrect} label="ถูกต้อง" />
            <Checkbox checked={isIncorrect} label="ต้องแก้ไข" />
            {isIncorrect && <FormField label="" value={note} />}
        </View>
    );
};

// --- คอมโพเนนต์หลักของเอกสาร PDF ---
const InspectionPDF = ({ formData }) => {
  // ตรวจสอบให้แน่ใจว่า formData ไม่ใช่ null หรือ undefined
  if (!formData) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>ไม่มีข้อมูลสำหรับสร้างเอกสาร</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* === Header === */}
        <View style={styles.headerContainer}>
          <Image src="/pea_logo.png" style={{ width: 45, height: 45 }} />
          <View style={styles.headerText}>
              <Text style={styles.headerPEA}>การไฟฟ้าส่วนภูมิภาค</Text>
              <Text style={styles.headerEN}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
          </View>
          <View style={{ width: 45 }} />
        </View>
        <Text style={styles.formTitle}>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
        <Text style={styles.formSubtitle}>สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน</Text>

        <View style={styles.headerInfo}>
           <FormField label="การตรวจสอบครั้งที่" value={formData.inspectionNumber} />
           <FormField label="วันที่" value={formData.inspectionDate} />
        </View>
         <View style={styles.headerInfo}>
           <FormField label="การตรวจสอบตามคำร้องขอใช้ไฟเลขที่" value={formData.requestNumber} />
           <FormField label="วันที่" value={formData.requestDate} />
        </View>

        {/* === Section 1: ข้อมูลทั่วไป === */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
          <FormField label="ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า (นาย / นาง / น.ส.)" value={formData.fullName} />
          <FormField label="โทรศัพท์" value={formData.phone} />
          <FormField label="ที่อยู่" value={formData.address} />
          <View style={{...styles.row, marginTop: 5}}>
            <Checkbox checked={formData.phaseType === '3_phase'} label="ระบบไฟฟ้า 3 เฟส (400/230 V)" />
            <Checkbox checked={formData.phaseType === '1_phase'} label="1 เฟส (230 V)" />
            <Text style={{marginLeft: 20}}>โหลดประมาณ {formData.estimatedLoad || '...'} แอมแปร์</Text>
          </View>
        </View>

        {/* === Section 2: การตรวจสอบ === */}
        <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
            <View style={styles.twoColumnLayout}>
                {/* Left Column */}
                <View style={styles.column}>
                    <Text style={styles.sectionTitle}>2.1 สายตัวนำประธานเข้าอาคาร</Text>
                    <Text>ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502</Text>
                    <CorrectiveDisplay checked={formData.cableStandard_correct} note={formData.cableStandard_correct_note}/>

                    <Text>ข) ชนิดและขนาด</Text>
                    <View style={styles.row}>
                        <Checkbox checked={formData.cableType === 'IEC 01'} label="IEC 01" />
                        <Checkbox checked={formData.cableType === 'NYY'} label="NYY" />
                        <Checkbox checked={formData.cableType === 'CV'} label="CV" />
                        <Checkbox checked={formData.cableType === 'อื่นๆ'} label="อื่นๆ" />
                    </View>
                    <FormField label="ขนาด" value={`${formData.cableSizeSqmm || '...'} ตร.มม.`} />
                    <CorrectiveDisplay checked={formData.cableTypeSize_correct} note={formData.cableTypeSize_correct_note}/>
                    
                    <Text>ค) วิธีการเดินสาย</Text>
                    <Checkbox checked={formData.wiringMethodOverheadChecked} label="เดินสายบนลูกถ้วยฉนวนในอากาศ" />
                    <CorrectiveDisplay checked={formData.overhead_height_correct} note={formData.overhead_height_correct_note}/>

                    <Checkbox checked={formData.wiringMethodUndergroundChecked} label="เดินสายฝังใต้ดิน" />
                    <CorrectiveDisplay checked={formData.underground_neutralMarked_correct} note={formData.underground_neutralMarked_correct_note}/>
                    
                    <Text style={{...styles.sectionTitle, marginTop: 10}}>2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</Text>
                    <Text>ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน</Text>
                    <FormField label="ขนาดสายต่อหลักดิน" value={`${formData.groundWireSizeSqmm || '...'} ตร.มม.`} />
                    <CorrectiveDisplay checked={formData.groundWireSize_correct} note={formData.groundWireSize_correct_note}/>
                    <Text>ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม...</Text>
                    <CorrectiveDisplay checked={formData.groundResistance_correct} note={formData.groundResistance_correct_note}/>
                </View>

                {/* Right Column */}
                <View style={styles.column}>
                     <Text style={styles.sectionTitle}>2.2 เครื่องป้องกันกระแสเกิน</Text>
                     <Text>ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน</Text>
                     <Text>ข) สอดคล้องกับขนาดมิเตอร์ ขนาด AT {formData.breakerAmpRating || '...'}</Text>
                     <Text>ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 kA</Text>
                     <CorrectiveDisplay checked={formData.breakerStandard_correct} note={formData.breakerStandard_correct_note}/>

                    <Text style={{...styles.sectionTitle, marginTop: 10}}>2.4 เครื่องตัดไฟรั่ว (RCD)</Text>
                     <Text>ติดตั้งเครื่องตัดไฟรั่ว ขนาดพิกัดกระแสรั่ว (I∆n) ไม่เกิน 30 mA</Text>
                     <View style={styles.row}>
                        <Checkbox checked={formData.rcdInstalledOption === 'ถูกต้อง'} label="ถูกต้อง" />
                        <Checkbox checked={formData.rcdInstalledOption === 'ไม่ประสงค์ติดตั้ง'} label="ไม่ประสงค์ติดตั้ง" />
                    </View>
                </View>
            </View>
        </View>

        {/* === Section 4 & 5 === */}
        <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</Text>
             <View style={styles.row}>
                <Checkbox checked={formData.summaryResult === 'ติดตั้งมิเตอร์ถาวร'} label="ติดตั้งมิเตอร์ถาวร" />
                <Checkbox checked={formData.summaryResult === 'ติดตั้งมิเตอร์ชั่วคราว'} label="ติดตั้งมิเตอร์ชั่วคราว" />
                <Checkbox checked={formData.summaryResult === 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'} label="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" />
            </View>

             <Text style={{...styles.sectionTitle, marginTop: 10}}>5. ขอบเขตและข้อจำกัดในการตรวจสอบ</Text>
             <Text>{formData.scopeOfInspection || '...'}</Text>
        </View>

        {/* === Section 6: Signatures === */}
        <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</Text>
            <Text style={{fontSize: 7}}>6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้า... (คัดลอกข้อความทั้งหมดมาใส่ที่นี่)</Text>
            
            <View style={styles.signatureSection}>
                <View style={styles.signatureBox}>
                    <View style={{position: 'relative', width: '100%', height: 40}}>
                        {formData.userSignature && <Image style={styles.signatureImage} src={formData.userSignature} />}
                    </View>
                    <View style={styles.signatureLine}></View>
                    <Text>(..................................................)</Text>
                    <Text>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
                </View>
                <View style={styles.signatureBox}>
                    <View style={{position: 'relative', width: '100%', height: 40}}>
                        {formData.inspectorSignature && <Image style={styles.signatureImage} src={formData.inspectorSignature} />}
                    </View>
                    <View style={styles.signatureLine}></View>
                    <Text>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
                </View>
            </View>
        </View>

        {/* === Page Footer === */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
        <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน)</Text>
      </Page>
    </Document>
  );
}
export default InspectionPDF;