"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image, Svg, Polyline } from '@react-pdf/renderer';

// ลงทะเบียนฟอนต์ Sarabun
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.ttf' },
    { src: '/fonts/Sarabun-Bold.ttf', fontWeight: 'bold' },
  ]
});

// --- Stylesheet ---
const styles = StyleSheet.create({
    page: { fontFamily: 'Sarabun', fontSize: 8, paddingTop: 30, paddingBottom: 50, paddingHorizontal: 35 },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
    headerText: { textAlign: 'center', flexGrow: 1, paddingTop: 5 },
    headerPEA: { fontSize: 14, fontWeight: 'bold' },
    headerEN: { fontSize: 8 },
    formTitle: { fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 2 },
    formSubtitle: { fontSize: 9, textAlign: 'center', marginBottom: 8 },
    headerInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
    section: { marginTop: 6, marginBottom: 4 },
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
    signatureImage: { width: 100, height: 40, alignSelf: 'center', marginBottom: 5, border: '1px solid #e0e0e0' },
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
    <View style={{...styles.row, ...style}}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{` ${value} `}</Text>
    </View>
);
const Checkbox = ({ checked, label }) => (
  <View style={styles.checkboxContainer}>
    <View style={styles.checkbox}>
      {checked && (
        <Svg width="8" height="8" viewBox="0 0 8 8">
          <Polyline
            points="1,4 3,6 7,1"
            stroke="#222"
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      )}
    </View>
    <Text>{label}</Text>
  </View>
);
const CorrectiveItem = ({ label, status, note }) => (
    <View style={styles.checklistItem}>
        <Text style={styles.itemText}>{label}</Text>
        <Checkbox checked={status === 'ถูกต้อง'} label="ถูกต้อง" />
        <Checkbox checked={status === 'ต้องแก้ไข'} label="ต้องแก้ไข" />
        {status === 'ต้องแก้ไข' && <Text style={{...styles.value, flexGrow: 0, minWidth: '50%'}}> {note || ''} </Text>}
    </View>
);

// --- PDF Document ---
const ResidentialInspectionPDF = ({ formData }) => {
  if (!formData) {
    return <Document><Page style={styles.page}><Text>ไม่มีข้อมูล</Text></Page></Document>;
  }

  return (
    <Document>
      {/* --- หน้า 1 --- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer} fixed>
          <Image src="/pea_logo.png" style={{ width: 40, height: 40 }} />
          <View style={styles.headerText}>
              <Text style={styles.headerPEA}>การไฟฟ้าส่วนภูมิภาค</Text>
              <Text style={styles.headerEN}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
          </View>
          <Text style={{fontSize: 9, textAlign: 'right'}}>การไฟฟ้า: {formData.peaOffice || '........................'}</Text>
        </View>
        <Text style={styles.formTitle} fixed>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
        <Text style={styles.formSubtitle} fixed>สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน</Text>

        <View style={styles.headerInfoRow}>
           <Field label="การตรวจสอบครั้งที่:" value={formData.inspectionNumber || ''} style={{width: '48%'}} />
           <Field label="วันที่:" value={formData.inspectionDate || ''} style={{width: '48%'}}/>
        </View>
        <View style={styles.headerInfoRow}>
           <Field label="การตรวจสอบตามคำร้องขอใช้ไฟเลขที่:" value={formData.requestNumber || ''} style={{width: '48%'}} />
           <Field label="วันที่:" value={formData.requestDate || ''} style={{width: '48%'}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
          <Field label="ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า (นาย/นาง/น.ส.):" value={formData.fullName || ''} />
          <Field label="โทรศัพท์:" value={formData.phone || ''} />
          <Field label="ที่อยู่:" value={formData.address || ''} />
          <View style={{...styles.row, marginTop: 5}}>
            <Checkbox checked={formData.phaseType === '3_phase'} label="ระบบไฟฟ้า 3 เฟส (400/230 V)" />
            <Checkbox checked={formData.phaseType === '1_phase'} label="1 เฟส (230 V)" />
            <Field label="โหลดประมาณ:" value={`${formData.estimatedLoad || ''} แอมแปร์`} style={{marginLeft: 20, flexGrow: 1}}/>
          </View>
        </View>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
            <View style={styles.gridContainer}>
                {/* --- คอลัมน์ซ้าย --- */}
                <View style={styles.gridColumn}>
                    <Text style={{fontWeight: 'bold', marginBottom: 2}}>2.1 สายตัวนำประธานเข้าอาคาร</Text>
                    <CorrectiveItem label="ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502" status={formData.cableStandard_correct} note={formData.cableStandard_correct_note} />
                    <Text style={{fontSize: 8, paddingLeft: 5, marginTop: 4}}>ข) ชนิดและขนาด</Text>
                    <View style={styles.subItem}>
                        <View style={{...styles.row, flexWrap: 'nowrap', paddingLeft: 5, marginBottom: 1}}>
                           <Checkbox checked={formData.cableType === 'IEC 01'} label="IEC 01" />
                           <Checkbox checked={formData.cableType === 'NYY'} label="NYY" />
                           <Checkbox checked={formData.cableType === 'CV'} label="CV" />
                        </View>
                         <Field label="อื่นๆ:" value={formData.cableType === 'อื่นๆ' ? formData.cableOtherType : ''} style={{paddingLeft: 5}}/>
                         <Field label="ขนาด:" value={`${formData.cableSizeSqmm || ''} ตร.มม.`} style={{paddingLeft: 5}}/>
                        <CorrectiveItem status={formData.cableTypeSize_correct} note={formData.cableTypeSize_correct_note} />
                    </View>
                    <Text style={{fontSize: 8, paddingLeft: 5, marginTop: 4}}>ค) วิธีการเดินสาย</Text>
                    <View style={styles.subItem}>
                        <Checkbox checked={!!formData.wiringMethodOverheadChecked} label="เดินสายบนลูกถ้วยฉนวนในอากาศ" />
                        {formData.wiringMethodOverheadChecked && <View style={styles.subItem}>
                            <CorrectiveItem label="1) สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตร ถ้ามียานพาหนะลอดผ่าน" status={formData.overhead_height_correct} note={formData.overhead_height_correct_note} />
                            <CorrectiveItem label="2) สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล" status={formData.overhead_neutralMarked_correct} note={formData.overhead_neutralMarked_correct_note} />
                        </View>}
                        <Checkbox checked={!!formData.wiringMethodUndergroundChecked} label="เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)" />
                        {formData.wiringMethodUndergroundChecked && <View style={styles.subItem}>
                             <CorrectiveItem label="1) สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล" status={formData.underground_neutralMarked_correct} note={formData.underground_neutralMarked_correct_note} />
                        </View>}
                     </View>
                     <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 2}}>2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)</Text>
                     <CorrectiveItem label="ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898" status={formData.breakerStandard_correct} note={formData.breakerStandard_correct_note} />
                     <CorrectiveItem label={`ข) เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์ ขนาด AT ${formData.breakerAmpRating || ''}`} status={formData.breakerMeterMatch_correct} note={formData.breakerMeterMatch_correct_note} />
                     <CorrectiveItem label="ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (KA)" status={formData.breakerShortCircuitRating_correct} note={formData.breakerShortCircuitRating_correct_note} />
                </View>
                {/* --- คอลัมน์ขวา --- */}
                <View style={styles.gridColumn}>
                    <Text style={{fontWeight: 'bold', marginBottom: 2}}>2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</Text>
                    <CorrectiveItem label={`ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน ขนาดสายต่อหลักดิน ${formData.groundWireSizeSqmm || ''} ตร.มม.`} status={formData.groundWireSize_correct} note={formData.groundWireSize_correct_note} />
                    <CorrectiveItem label="ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม (มีข้อยกเว้น)" status={formData.groundResistance_correct} note={formData.groundResistance_correct_note} />
                    <CorrectiveItem label="ค) กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน (Main Circuit Breaker) ตามที่ กฟภ. กำหนด" status={formData.onePhaseGroundConnection_correct} note={formData.onePhaseGroundConnection_correct_note} />
                    <CorrectiveItem label="ง) กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์ ตามที่ กฟภ. กำหนด" status={formData.threePhaseGroundConnection_correct} note={formData.threePhaseGroundConnection_correct_note} />
                    <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 2}}>2.4 เครื่องตัดไฟรั่ว (RCD)</Text>
                    <Checkbox checked={formData.rcdInstalledOption === 'ถูกต้อง'} label="ติดตั้งเครื่องตัดไฟรั่ว ขนาดพิกัดกระแสรั่ว (IΔn) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง" />
                    <Checkbox checked={formData.rcdInstalledOption === 'ไม่ประสงค์ติดตั้ง'} label="ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว และผู้ตรวจสอบมาตรฐานได้แจ้งให้ผู้ขอใช้ไฟฟ้าหรือผู้แทนทราบถึงความเสี่ยงจากการไม่ติดตั้งเครื่องตัดไฟรั่วแล้ว" />
                </View>
            </View>
        </View>
        <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน)</Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
      </Page>
      
      {/* --- หน้า 2 --- */}
      <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>3. กรณีผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ติดตั้งหม้อแปลงไฟฟ้าเพื่อรับไฟแรงสูง</Text>
                <Text style={styles.acknowledgementText}>ให้ตรวจสอบมาตรฐานการติดตั้งระบบไฟฟ้าแรงสูงเพิ่มเติมโดยใช้แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นๆ นอกเหนือจากที่อยู่อาศัย</Text>
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
                <Text style={{paddingLeft: 10, fontSize: 8}}>{formData.scopeOfInspection || ''}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</Text>
                <Text style={styles.acknowledgementText}>6.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ตลอดจนข้อปลีกย่อยอื่นๆ ที่ผู้ขอใช้ไฟฟ้าเป็นผู้ทำการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคจะตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลังการตรวจสอบแล้วก็ยังคงให้อยู่ในความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่เพียงฝ่ายเดียว</Text>
                <Text style={styles.acknowledgementText}>6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเป็นผู้ดำเนินการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการเองในภายหลัง หรืออุปกรณ์ดังกล่าวเสื่อมคุณภาพไปตามสภาพ ทางผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</Text>
                <Text style={styles.acknowledgementText}>6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องติดตั้งตามมาตรฐานการติดตั้งทางไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</Text>
                <Text style={styles.acknowledgementText}>6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</Text>
            </View>
            <View style={styles.signatureSection}>
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
            <View style={styles.recommendationBox}>
                <Text style={styles.recommendationTitle}>ข้อแนะนำ</Text>
                <Text style={styles.acknowledgementText}>1. ควรติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดพิกัดกระแสรั่ว (IΔn) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง เช่น บริเวณที่เปียกชื้น ห้องน้ำ ห้องอาบน้ำ ห้องครัว ห้องใต้ดิน อ่างล้างมือ วงจรไฟฟ้าภายนอกอาคาร รวมถึงวงจรย่อยสำหรับเครื่องทำน้ำอุ่น/อ่างอาบน้ำ</Text>
                <Text style={styles.acknowledgementText}>2. ควรติดตั้งสายดินที่บริภัณฑ์ไฟฟ้าเพื่อความปลอดภัย ในกรณีเกิดไฟฟ้ารั่ว หรือไฟฟ้าลัดวงจร</Text>
                <Text style={styles.acknowledgementText}>3. ควรติดตั้งระบบไฟฟ้าโดยช่างที่ได้รับหนังสือรับรองการผ่านทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ จากกรมพัฒนาฝีมือแรงงาน</Text>
            </View>
            <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน)</Text>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
        </Page>
      
      {/* --- หน้า 3 --- */}
       <Page size="A4" style={styles.page}>
         <Text style={{...styles.formTitle, marginBottom: 15}}>รูปแบบการรับไฟฟ้าผ่านระบบจำหน่ายแรงต่ำ (400/230 โวลต์)</Text>
         <Text style={styles.formSubtitle}>สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน</Text>
         <Image src="/diagram_home.png" style={{width: '100%', height: 'auto', marginBottom: 15}}/>
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>ข้อกำหนด</Text>
            <Text style={styles.acknowledgementText}>1. สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกันให้พิจารณาตรวจสอบระบบไฟฟ้าตามหมายเลข 1-4</Text>
            <Text style={styles.acknowledgementText}>2. นอกจากการตรวจสอบสายต่อหลักดินของตู้ MDB ตามหมายเลข 4 แล้ว ให้ตรวจสอบระบบต่อลงดินภายในตู้ MDB ร่วมด้วย</Text>
            <Text style={styles.acknowledgementText}>3. ตรวจสอบว่ามีการติดตั้ง RCD ในวงจรที่มีความเสี่ยง หากผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้ง RCD ผู้ตรวจสอบมาตรฐานต้องแจ้งให้ผู้ขอใช้ไฟฟ้าหรือผู้แทนทราบถึงความเสี่ยงจากการไม่ติดตั้ง RCD และให้ผู้ขอใช้ไฟฟ้าหรือผู้แทนลงนามในแบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าฯ</Text>
         </View>
         <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>ข้อแนะนำ</Text>
            <Text style={styles.acknowledgementText}>1. ควรติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดพิกัดกระแสรั่ว (IΔn) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง เช่น บริเวณที่เปียกชื้น ห้องน้ำ ห้องอาบน้ำ ห้องครัว ห้องใต้ดิน อ่างล้างมือ วงจรไฟฟ้าภายนอกอาคาร รวมถึงวงจรย่อยสำหรับเครื่องทำน้ำอุ่น/อ่างอาบน้ำ</Text>
            <Text style={styles.acknowledgementText}>2. ควรติดตั้งสายดินที่บริภัณฑ์ไฟฟ้าเพื่อความปลอดภัย ในกรณีเกิดไฟฟ้ารั่ว หรือไฟฟ้าลัดวงจร</Text>
            <Text style={styles.acknowledgementText}>3. ควรติดตั้งระบบไฟฟ้าโดยช่างที่ได้รับหนังสือรับรองการผ่านทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ จากกรมพัฒนาฝีมือแรงงาน</Text>
         </View>
         <Text style={styles.docIdFooter} fixed>กมฟ.ผมต.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน)</Text>
         <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`หน้า ${pageNumber} / ${totalPages}`)} fixed />
       </Page>
    </Document>
  );
}
export default ResidentialInspectionPDF;