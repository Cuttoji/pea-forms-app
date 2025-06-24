"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register Sarabun font for Thai language support
// Ensure you have the font files in your /public/fonts/ directory
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.ttf' },
    { src: '/fonts/Sarabun-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Sarabun-Light.ttf', fontWeight: 'light' },
  ]
});

// Create styles for the PDF document
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
  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  headerText: {
    textAlign: 'center',
    flexGrow: 1,
    paddingTop: 5,
  },
  headerPEA: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerEN: {
    fontSize: 8,
  },
  headerOffice: {
    fontSize: 9,
    textAlign: 'right'
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
  headerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // General
  section: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    borderBottom: '0.5px solid #333',
    paddingBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
    flexWrap: 'wrap'
  },
  label: {
    marginRight: 4,
    flexShrink: 0,
    paddingBottom: 1,
  },
  value: {
    borderBottom: '0.5px dotted #666',
    flexGrow: 1,
    minHeight: 10,
    paddingLeft: 2,
  },
  // Checklist Styles
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
    paddingLeft: 10,
  },
  itemText: {
    width: '55%',
  },
  itemCheckboxArea: {
    width: '45%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '0.5px solid #000',
    marginRight: 3,
    textAlign: 'center',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
     fontSize: 9,
     transform: 'translateY(-1.5px)'
  },
  noteValue: {
    borderBottom: '0.5px dotted #666',
    flexGrow: 1,
    minHeight: 10,
    marginLeft: 3,
    fontSize: 8,
    paddingLeft: 2,
  },
  subItem: {
    paddingLeft: 15,
    marginTop: 2,
  },
  // Signature & Footer
  acknowledgementText: {
    fontSize: 7.5,
    fontWeight: 'light',
    lineHeight: 1.4,
    marginBottom: 10,
    textAlign: 'justify'
  },
  signatureSection: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signatureBox: {
    width: '45%',
    textAlign: 'center',
  },
  signatureImage: {
    width: 100,
    height: 40,
    alignSelf: 'center',
    position: 'absolute',
    top: 40,
  },
  signatureLine: {
    borderTop: '0.5px dotted #999',
    marginTop: 40,
    marginBottom: 3,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: 0,
    right: 35,
    textAlign: 'right',
    color: 'grey',
  },
  docIdFooter: {
     position: 'absolute',
     fontSize: 8,
     bottom: 20,
     left: 35,
     color: 'grey',
  }
});

// Reusable components for PDF
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

const ChecklistItem = ({ label, value, note, children }) => {
    const isCorrect = value === 'ถูกต้อง';
    const isIncorrect = value === 'ต้องแก้ไข';
    return (
        <View style={{...styles.checklistItem, flexDirection: 'column'}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.itemText}>{label}</Text>
                <View style={styles.itemCheckboxArea}>
                    <Checkbox checked={isCorrect} label="ถูกต้อง" />
                    <Checkbox checked={isIncorrect} label="ต้องแก้ไข" />
                    {isIncorrect ? <Text style={styles.noteValue}>{note || ''}</Text> : null}
                </View>
            </View>
             {children}
        </View>
    );
};


// Main PDF Document Component
const InspectionPDF = ({ formData }) => {
  if (!formData) {
    return (
      <Document>
        <Page style={styles.page}><Text>ไม่มีข้อมูล</Text></Page>
      </Document>
    );
  }

  const getFullText = (key) => formData[key] || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.headerContainer} fixed>
          <Image src="/pea_logo.png" style={{ width: 40, height: 40 }} />
          <View style={styles.headerText}>
              <Text style={styles.headerPEA}>การไฟฟ้าส่วนภูมิภาค</Text>
              <Text style={styles.headerEN}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
          </View>
          <Text style={styles.headerOffice}>การไฟฟ้า.......................</Text>
        </View>
        <Text style={styles.formTitle} fixed>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
        <Text style={styles.formSubtitle} fixed>สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน</Text>

        <View style={styles.headerInfoRow}>
           <Field label="การตรวจสอบครั้งที่" value={getFullText('inspectionNumber')} style={{width: '48%'}} />
           <Field label="วันที่" value={getFullText('inspectionDate')} style={{width: '48%'}}/>
        </View>
        <View style={styles.headerInfoRow}>
           <Field label="การตรวจสอบตามคำร้องขอใช้ไฟเลขที่" value={getFullText('requestNumber')} style={{width: '48%'}} />
           <Field label="วันที่" value={getFullText('requestDate')} style={{width: '48%'}} />
        </View>

        {/* Section 1: ข้อมูลทั่วไป */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
          <Field label="ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า (นาย / นาง / น.ส.)" value={getFullText('fullName')} />
          <Field label="โทรศัพท์" value={getFullText('phone')} />
          <Field label="ที่อยู่" value={getFullText('address')} />
          <View style={{...styles.row, marginTop: 5}}>
            <Checkbox checked={formData.phaseType === '3_phase'} label="ระบบไฟฟ้า 3 เฟส (400/230 V)" />
            <Checkbox checked={formData.phaseType === '1_phase'} label="1 เฟส (230 V)" />
            <Field label="โหลดประมาณ" value={`${getFullText('estimatedLoad')} แอมแปร์`} style={{marginLeft: 20, flexGrow: 1}}/>
          </View>
        </View>

        {/* Section 2: การตรวจสอบ */}
        <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
            
            {/* 2.1 */}
            <Text style={{fontWeight: 'bold', marginBottom: 2}}>2.1 สายตัวนำประธานเข้าอาคาร</Text>
            <ChecklistItem label="ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502" value={formData.cableStandard_correct} note={formData.cableStandard_correct_note}/>
            <View style={styles.subItem}>
              <Text style={{marginBottom: 2}}>ข) ชนิดและขนาด</Text>
              <View style={{...styles.row, paddingLeft: 10}}>
                  <Checkbox checked={formData.cableType === 'IEC 01'} label="IEC 01" />
                  <Checkbox checked={formData.cableType === 'NYY'} label="NYY" />
                  <Checkbox checked={formData.cableType === 'CV'} label="CV" />
                  <Checkbox checked={formData.cableType === 'อื่นๆ'} label="อื่นๆ:" />
                  {formData.cableType === 'อื่นๆ' && <Text style={styles.value}> {formData.cableOtherType} </Text>}
              </View>
              <Field label="ขนาด" value={`${getFullText('cableSizeSqmm')} ตร.มม.`} style={{paddingLeft: 10}}/>
              <ChecklistItem value={formData.cableTypeSize_correct} note={formData.cableTypeSize_correct_note} />
            </View>
            <View style={styles.subItem}>
              <Text style={{marginBottom: 2}}>ค) วิธีการเดินสาย</Text>
              <View style={{...styles.row, paddingLeft: 10}}>
                <Checkbox checked={formData.wiringMethodOverheadChecked} label="เดินสายบนลูกถ้วยฉนวนในอากาศ" />
              </View>
              {formData.wiringMethodOverheadChecked && <>
                <ChecklistItem label="1) สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตร ถ้ายานพาหนะลอดผ่าน" value={formData.overhead_height_correct} note={formData.overhead_height_correct_note}/>
                <ChecklistItem label="2) สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล" value={formData.overhead_neutralMarked_correct} note={formData.overhead_neutralMarked_correct_note}/>
              </>}
              <View style={{...styles.row, paddingLeft: 10, marginTop: 4}}>
                <Checkbox checked={formData.wiringMethodUndergroundChecked} label="เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)" />
              </View>
              {formData.wiringMethodUndergroundChecked && <>
                <ChecklistItem label="1) สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล" value={formData.underground_neutralMarked_correct} note={formData.underground_neutralMarked_correct_note}/>
              </>}
            </View>

            {/* 2.2 */}
            <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 2}}>2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์(บริภัณฑ์ประธาน)</Text>
            <ChecklistItem label="ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898" value={formData.breakerStandard_correct} note={formData.breakerStandard_correct_note} />
            <ChecklistItem label={`ข) เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์ ขนาด AT ${getFullText('breakerAmpRating')}`} value={formData.breakerMeterMatch_correct} note={formData.breakerMeterMatch_correct_note} />
            <ChecklistItem label="ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)" value={formData.breakerShortCircuitRating_correct} note={formData.breakerShortCircuitRating_correct_note} />
            
            {/* 2.3 */}
            <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 2}}>2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</Text>
            <ChecklistItem label={`ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน (ขนาดสายต่อหลักดิน ${getFullText('groundWireSizeSqmm')} ตร.มม.)`} value={formData.groundWireSize_correct} note={formData.groundWireSize_correct_note}/>
            <ChecklistItem label={`ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม (วัดได้ ${getFullText('groundResistanceOhm')} โอห์ม)`} value={formData.groundResistance_correct} note={formData.groundResistance_correct_note}/>
            <ChecklistItem label="ค) กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน..." value={formData.onePhaseGroundConnection_correct} note={formData.onePhaseGroundConnection_correct_note}/>
            <ChecklistItem label="ง) กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน..." value={formData.threePhaseGroundConnection_correct} note={formData.threePhaseGroundConnection_correct_note}/>

            {/* 2.4 */}
            <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 2}}>2.4 เครื่องตัดไฟรั่ว (RCD)</Text>
             <View style={styles.subItem}>
                <Text style={{marginBottom: 2}}>ติดตั้งเครื่องตัดไฟรั่ว ขนาดพิกัดกระแสรั่ว (I∆n) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง</Text>
                <View style={{...styles.row, paddingLeft: 10, marginTop: 2}}>
                  <Checkbox checked={formData.rcdInstalledOption === 'ถูกต้อง'} label="ถูกต้อง" />
                  <Checkbox checked={formData.rcdInstalledOption === 'ไม่ประสงค์ติดตั้ง'} label="ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้ง..." />
                </View>
                 {formData.rcdInstalledOption === 'ถูกต้อง' && (
                    <ChecklistItem label="การทำงานของ RCD" value={formData.rcdInstalled_correct} note={formData.rcdInstalled_correct_note}/>
                 )}
            </View>
        </View>
        
        {/* Section 3, 4, 5 on new page */}
        <View break>
          <Text style={styles.sectionTitle}>3. กรณีผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัย... ติดตั้งหม้อแปลงไฟฟ้าเพื่อรับไฟแรงสูง</Text>
          <Text style={{fontSize: 8, paddingLeft: 10}}>ให้ตรวจสอบมาตรฐานการติดตั้งระบบไฟฟ้าแรงสูงเพิ่มเติมโดยใช้แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆ นอกเหนือจากที่อยู่อาศัย</Text>
          
          <Text style={{...styles.sectionTitle, marginTop: 10}}>4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</Text>
          <View style={{...styles.row, paddingLeft: 10}}>
              <Checkbox checked={formData.summaryResult === 'ติดตั้งมิเตอร์ถาวร'} label="ติดตั้งมิเตอร์ถาวร" />
              <Checkbox checked={formData.summaryResult === 'ติดตั้งมิเตอร์ชั่วคราว'} label="ติดตั้งมิเตอร์ชั่วคราว" />
              <Checkbox checked={formData.summaryResult === 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'} label="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" />
          </View>
          
          <Text style={{...styles.sectionTitle, marginTop: 10}}>5. ขอบเขตและข้อจำกัดในการตรวจสอบ</Text>
          <Text style={{paddingLeft: 10}}>{getFullText('scopeOfInspection')}</Text>
        </View>

        {/* Section 6 */}
        <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</Text>
            <Text style={styles.acknowledgementText}>
            6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนข้อปลีกย่อยอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ.เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงให้อยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว{'\n'}
            6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหน้า หรืออุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว{'\n'}
            6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว{'\n'}
            6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว
            </Text>
            
            <View style={styles.signatureSection}>
                <View style={styles.signatureBox}>
                    <View style={{position: 'relative', width: '100%', height: 40}}>
                        {formData.userSignature && <Image style={styles.signatureImage} src={formData.userSignature} />}
                    </View>
                    <View style={styles.signatureLine}></View>
                    <Text>(.............................................................)</Text>
                    <Text>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
                </View>
                <View style={styles.signatureBox}>
                    <View style={{position: 'relative', width: '100%', height: 40}}>
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
        <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน)</Text>
      </Page>
    </Document>
  );
}
export default InspectionPDF;