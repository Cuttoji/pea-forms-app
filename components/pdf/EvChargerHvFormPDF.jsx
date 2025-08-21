import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// กำหนด styles สำหรับ PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
});

// Component สำหรับสร้าง PDF Document
const ConstructionInspectionPDF = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>รายงานการตรวจสอบงานก่อสร้าง</Text>
                <Text style={styles.subtitle}>ข้อมูลทั่วไป</Text>
                <Text style={styles.text}>โครงการ: {data?.projectName || ''}</Text>
                <Text style={styles.text}>วันที่ตรวจสอบ: {data?.inspectionDate || ''}</Text>
                <Text style={styles.text}>ผู้ตรวจสอบ: {data?.inspector || ''}</Text>
            </View>
            
            <View style={styles.section}>
                <Text style={styles.subtitle}>รายละเอียดการตรวจสอบ</Text>
                <Text style={styles.text}>สถานะ: {data?.status || ''}</Text>
                <Text style={styles.text}>หมายเหตุ: {data?.notes || ''}</Text>
            </View>
        </Page>
    </Document>
);

// Component สำหรับแสดง PDF Viewer
const ConstructionInspectionPDFViewer = ({ data }) => (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
        <ConstructionInspectionPDF data={data} />
    </PDFViewer>
);

export default EvChargerHvFormPDFViewer;
export { EvChargerHvFormPDF };