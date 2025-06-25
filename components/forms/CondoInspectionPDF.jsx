import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// ลงทะเบียนฟอนต์ (เหมือนเดิม)
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.ttf' },
    { src: '/fonts/Sarabun-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Styles (เหมือนเดิม)
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Sarabun',
    fontSize: 10,
    padding: 30,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginBottom: 10,
    padding: 10,
    border: '1px solid #E5E7EB',
    borderRadius: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3a1a5b',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
  },
  signatureContainer: {
    marginTop: 20,
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
    width: 150,
    height: 75,
    alignSelf: 'center',
    marginBottom: 5,
  },
});

// --- จุดที่แก้ไขคือการเพิ่ม `|| ''` และการเช็คค่าก่อนแสดงผล ---
const InspectionPDF = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์
      </Text>

      <View style={styles.section}>
        <Text style={styles.header}>ข้อมูลทั่วไป</Text>
        <View style={styles.row}>
          <Text style={styles.label}>เลขที่บันทึกตรวจสอบ:</Text>
          <Text style={styles.value}>{formData.inspectionNumber || ''}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>วันที่ตรวจสอบ:</Text>
          <Text style={styles.value}>{formData.inspectionDate || ''}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ชื่อ-นามสกุล:</Text>
          <Text style={styles.value}>{formData.fullName || ''}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>โทรศัพท์:</Text>
          <Text style={styles.value}>{formData.phone || ''}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ที่อยู่:</Text>
          <Text style={styles.value}>{formData.address || ''}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>พิกัด (Lat, Lng):</Text>
          <Text style={styles.value}>
            {formData.latitude || 'N/A'}, {formData.longitude || 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ระบบไฟฟ้า:</Text>
          <Text style={styles.value}>{formData.phaseType === '1_phase' ? '1 เฟส' : formData.phaseType === '3_phase' ? '3 เฟส' : ''}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ประมาณการโหลด:</Text>
          <Text style={styles.value}>{formData.estimatedLoad || ''} A</Text>
        </View>
      </View>

      {/* คุณสามารถเพิ่ม Section อื่นๆ ของฟอร์มตามหลักการเดียวกันนี้ */}
      {/* ... */}
      
      <View style={styles.section}>
         <Text style={styles.header}>4. สรุปผลการตรวจสอบ</Text>
         <View style={styles.row}>
            <Text style={styles.label}>ผลการตรวจสอบ:</Text>
            <Text style={styles.value}>{formData.summaryResult || ''}</Text>
         </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>6. การลงนาม</Text>
        <View style={styles.signatureContainer}>
          <View style={styles.signatureBox}>
            {/* เช็คว่ามีข้อมูลลายเซ็นหรือไม่ก่อนที่จะแสดง Image */}
            {formData.userSignature && (
              <Image style={styles.signatureImage} src={formData.userSignature} />
            )}
            <Text>....................................................</Text>
            <Text>(ผู้ขอใช้ไฟฟ้าหรือผู้แทน)</Text>
          </View>
          <View style={styles.signatureBox}>
            {formData.inspectorSignature && (
              <Image style={styles.signatureImage} src={formData.inspectorSignature} />
            )}
            <Text>....................................................</Text>
            <Text>(เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค)</Text>
          </View>
        </View>
      </View>

    </Page>
  </Document>
);

export default InspectionPDF;