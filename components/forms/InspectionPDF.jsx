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
  acknowledgementText: { fontSize: 7.5, fontWeight: 'light', lineHeight: 1.4, marginBottom: 5, textAlign: 'justify' },
  signatureSection: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-around' },
  signatureBox: { width: '45%', textAlign: 'center' },
  signatureImage: { width: 100, height: 40, alignSelf: 'center', marginBottom: 5 },
  signatureLine: { borderTop: '0.5px dotted #999', marginTop: 5, marginBottom: 3 },
  pageNumber: { position: 'absolute', fontSize: 8, bottom: 30, left: 0, right: 35, textAlign: 'right', color: 'grey' },
  docIdFooter: { position: 'absolute', fontSize: 8, bottom: 20, left: 35, color: 'grey' }
});

// Helper Components
const Field = ({ label, value = '', style }) => (
    <View style={{...styles.row, ...style}}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{` ${value} `}</Text>
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
          <Text style={styles.headerOffice}>การไฟฟ้า.......................</Text>
        </View>
        <Text style={styles.formTitle} fixed>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
        <Text style={styles.formSubtitle} fixed>สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน</Text>

        <View style={styles.headerInfoRow}>
           <Field label="การตรวจสอบครั้งที่" value={formData.inspectionNumber || ''} style={{width: '48%'}} />
           <Field label="วันที่" value={formData.inspectionDate || ''} style={{width: '48%'}}/>
        </View>
        <View style={styles.headerInfoRow}>
           <Field label="การตรวจสอบตามคำร้องขอใช้ไฟเลขที่" value={formData.requestNumber || ''} style={{width: '48%'}} />
           <Field label="วันที่" value={formData.requestDate || ''} style={{width: '48%'}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
          <Field label="ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า (นาย / นาง / น.ส.)" value={formData.fullName || ''} />
          <Field label="โทรศัพท์" value={formData.phone || ''} />
          <Field label="ที่อยู่" value={formData.address || ''} />
          <View style={{...styles.row, marginTop: 5}}>
            <Checkbox checked={formData.phaseType === '3_phase'} label="ระบบไฟฟ้า 3 เฟส (400/230 V)" />
            <Checkbox checked={formData.phaseType === '1_phase'} label="1 เฟส (230 V)" />
            <Field label="โหลดประมาณ" value={`${formData.estimatedLoad || ''} แอมแปร์`} style={{marginLeft: 20, flexGrow: 1}}/>
          </View>
        </View>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
            {/* 2.1 */}
            <Text style={{fontWeight: 'bold', marginBottom: 2}}>2.1 สายตัวนำประธานเข้าอาคาร</Text>
            <View style={styles.checklistItem}><Text style={styles.itemText}>ก) สายไฟฟ้าเป็นไปตามมาตรฐาน</Text><Checkbox checked={formData.cableStandard_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.cableStandard_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.cableStandard_correct === 'ต้องแก้ไข' ? (formData.cableStandard_correct_note || '') : ''}</Text></View>
            <View style={{...styles.subItem, flexDirection: 'column'}}>
              <Text style={{marginBottom: 2}}>ข) ชนิดและขนาด</Text>
              <View style={{...styles.row, paddingLeft: 5}}>
                  <Checkbox checked={formData.cableType === 'IEC 01'} label="IEC 01" />
                  <Checkbox checked={formData.cableType === 'NYY'} label="NYY" />
                  <Checkbox checked={formData.cableType === 'CV'} label="CV" />
                  <Field label="อื่นๆ" value={formData.cableType === 'อื่นๆ' ? (formData.cableOtherType || '') : ''} style={{width: '30%'}}/>
                  <Field label="ขนาด" value={`${formData.cableSizeSqmm || ''} ตร.มม.`} style={{width: '30%'}}/>
              </View>
              <View style={styles.checklistItem}><Checkbox checked={formData.cableTypeSize_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.cableTypeSize_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.cableTypeSize_correct === 'ต้องแก้ไข' ? (formData.cableTypeSize_correct_note || '') : ''}</Text></View>
              <Text style={{marginTop: 4, marginBottom: 2}}>ค) วิธีการเดินสาย</Text>
              <Checkbox checked={!!formData.wiringMethodOverheadChecked} label="เดินสายบนลูกถ้วยฉนวนในอากาศ" />
              {formData.wiringMethodOverheadChecked && <View style={styles.subItem}><View style={styles.checklistItem}><Text style={styles.itemText}>1) สูงจากพื้น</Text><Checkbox checked={formData.overhead_height_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.overhead_height_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.overhead_height_correct === 'ต้องแก้ไข' ? (formData.overhead_height_correct_note || ''):''}</Text></View><View style={styles.checklistItem}><Text style={styles.itemText}>2) ทำเครื่องหมายที่สายนิวทรัล</Text><Checkbox checked={formData.overhead_neutralMarked_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.overhead_neutralMarked_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.overhead_neutralMarked_correct === 'ต้องแก้ไข' ? (formData.overhead_neutralMarked_correct_note || ''):''}</Text></View></View>}
              <Checkbox checked={!!formData.wiringMethodUndergroundChecked} label="เดินสายฝังใต้ดิน" />
              {formData.wiringMethodUndergroundChecked && <View style={styles.subItem}><View style={styles.checklistItem}><Text style={styles.itemText}>1) ทำเครื่องหมายที่สายนิวทรัล</Text><Checkbox checked={formData.underground_neutralMarked_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.underground_neutralMarked_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.underground_neutralMarked_correct === 'ต้องแก้ไข' ? (formData.underground_neutralMarked_correct_note || ''):''}</Text></View></View>}
            </View>
            {/* 2.2 */}
            <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 2}}>2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์</Text>
            <View style={styles.checklistItem}><Text style={styles.itemText}>ก) เป็นไปตามมาตรฐาน</Text><Checkbox checked={formData.breakerStandard_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.breakerStandard_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.breakerStandard_correct === 'ต้องแก้ไข' ? (formData.breakerStandard_correct_note || ''):''}</Text></View>
            <View style={styles.checklistItem}><Text style={styles.itemText}>ข) สอดคล้องกับขนาดมิเตอร์ (ขนาด AT {formData.breakerAmpRating || ''})</Text><Checkbox checked={formData.breakerMeterMatch_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.breakerMeterMatch_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.breakerMeterMatch_correct === 'ต้องแก้ไข' ? (formData.breakerMeterMatch_correct_note || ''):''}</Text></View>
            <View style={styles.checklistItem}><Text style={styles.itemText}>ค) ขนาดกระแสลัดวงจรไม่ต่ำกว่า 10kA</Text><Checkbox checked={formData.breakerShortCircuitRating_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.breakerShortCircuitRating_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.breakerShortCircuitRating_correct === 'ต้องแก้ไข' ? (formData.breakerShortCircuitRating_correct_note || ''):''}</Text></View>
            {/* 2.3 */}
            <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 2}}>2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</Text>
            <View style={styles.checklistItem}><Text style={styles.itemText}>ก) ขนาดสายต่อหลักดิน (ขนาด {formData.groundWireSizeSqmm || ''} ตร.มม.)</Text><Checkbox checked={formData.groundWireSize_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.groundWireSize_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.groundWireSize_correct === 'ต้องแก้ไข' ? (formData.groundWireSize_correct_note || ''):''}</Text></View>
            <View style={styles.checklistItem}><Text style={styles.itemText}>ข) ค่าความต้านทานดินไม่เกิน 5 โอห์ม (วัดได้ {formData.groundResistanceOhm || ''} โอห์ม)</Text><Checkbox checked={formData.groundResistance_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.groundResistance_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.groundResistance_correct === 'ต้องแก้ไข' ? (formData.groundResistance_correct_note || ''):''}</Text></View>
            <View style={styles.checklistItem}><Text style={styles.itemText}>ค) การต่อลงดิน 1 เฟส</Text><Checkbox checked={formData.onePhaseGroundConnection_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.onePhaseGroundConnection_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.onePhaseGroundConnection_correct === 'ต้องแก้ไข' ? (formData.onePhaseGroundConnection_correct_note || ''):''}</Text></View>
            <View style={styles.checklistItem}><Text style={styles.itemText}>ง) การต่อลงดิน 3 เฟส</Text><Checkbox checked={formData.threePhaseGroundConnection_correct === 'ถูกต้อง'}/><Text> ถูกต้อง</Text><Checkbox checked={formData.threePhaseGroundConnection_correct === 'ต้องแก้ไข'}/><Text> ต้องแก้ไข: {formData.threePhaseGroundConnection_correct === 'ต้องแก้ไข' ? (formData.threePhaseGroundConnection_correct_note || ''):''}</Text></View>
            {/* 2.4 */}
            <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 2}}>2.4 เครื่องตัดไฟรั่ว (RCD)</Text>
            <View style={{...styles.row, paddingLeft: 10, marginTop: 2}}>
                <Checkbox checked={formData.rcdInstalledOption === 'ถูกต้อง'} label="ติดตั้งเครื่องตัดไฟรั่ว" />
                <Checkbox checked={formData.rcdInstalledOption === 'ไม่ประสงค์ติดตั้ง'} label="ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้ง..." />
            </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
        <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน)</Text>
      </Page>
      
      {/* หน้า 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. กรณีผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัย... ติดตั้งหม้อแปลงไฟฟ้าเพื่อรับไฟแรงสูง</Text>
            <Text style={{fontSize: 8, paddingLeft: 10}}>ให้ตรวจสอบมาตรฐานการติดตั้งระบบไฟฟ้าแรงสูงเพิ่มเติมโดยใช้แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆ นอกเหนือจากที่อยู่อาศัย</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</Text>
            <View style={{...styles.row, paddingLeft: 10}}>
                <Checkbox checked={formData.summaryResult === 'ติดตั้งมิเตอร์ถาวร'} label="ติดตั้งมิเตอร์ถาวร" />
                <Checkbox checked={formData.summaryResult === 'ติดตั้งมิเตอร์ชั่วคราว'} label="ติดตั้งมิเตอร์ชั่วคราว" />
                <Checkbox checked={formData.summaryResult === 'ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์'} label="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" />
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. ขอบเขตและข้อจำกัดในการตรวจสอบ</Text>
            <Text style={{paddingLeft: 10}}>{formData.scopeOfInspection || ''}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</Text>
            <Text style={styles.acknowledgementText}>6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนข้อปลีกย่อยอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ.เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงให้อยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว</Text>
            <Text style={styles.acknowledgementText}>6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหลัง หรืออุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</Text>
            <Text style={styles.acknowledgementText}>6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</Text>
            <Text style={styles.acknowledgementText}>6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</Text>
        </View>
        
        <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
                {formData.userSignature && <Image style={styles.signatureImage} src={formData.userSignature} />}
                <Text style={styles.signatureLine}>(.............................................................)</Text>
                <Text>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
            </View>
            <View style={styles.signatureBox}>
                {formData.inspectorSignature && <Image style={styles.signatureImage} src={formData.inspectorSignature} />}
                <Text style={styles.signatureLine}>(.............................................................)</Text>
                <Text>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
            </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
        <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน)</Text>
      </Page>
      
      {/* หน้า 3 */}
      <Page size="A4" style={styles.page}>
         <Text style={{...styles.formTitle, marginBottom: 20}}>รูปแบบการรับไฟฟ้าผ่านระบบจำหน่ายแรงต่ำ (400/230 โวลต์)</Text>
         {/* คุณจะต้องมีรูปภาพของแผนภาพนี้ในโปรเจกต์ของคุณ */}
         {/* ให้วางไฟล์รูปภาพไว้ที่โฟลเดอร์ /public/images/diagram_home.png */}
         <Image src="/diagram_home.png" style={{width: '100%', height: 'auto'}}/>
         
         <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
         <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน)</Text>
      </Page>
    </Document>
  );
}
export default InspectionPDF;