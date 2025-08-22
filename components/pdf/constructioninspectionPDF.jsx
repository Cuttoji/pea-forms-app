import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';

// Register Thai font if available
Font.register({
    family: 'Sarabun',
    src: 'https://fonts.gstatic.com/s/sarabun/v8/DtVjJx26TKEqsc-lOBEHWKRgUw.ttf'
});

// กำหนด styles สำหรับ PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 20,
        fontFamily: 'Sarabun',
        fontSize: 10,
    },
    header: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
        fontWeight: 'bold',
    },
    formNumber: {
        textAlign: 'right',
        fontSize: 8,
        marginBottom: 10,
    },
    section: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        marginRight: 5,
    },
    underline: {
        borderBottom: '1px solid black',
        minWidth: 100,
        marginRight: 10,
        paddingBottom: 2,
        textAlign: 'center',
    },
    checkbox: {
        width: 12,
        height: 12,
        border: '1px solid black',
        marginRight: 5,
        textAlign: 'center',
        fontSize: 8,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginBottom: 10,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableCol: {
        width: '33.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
    },
    tableCell: {
        fontSize: 8,
        textAlign: 'center',
    },
    inspectionItem: {
        flexDirection: 'row',
        marginBottom: 3,
        alignItems: 'center',
    },
    itemNumber: {
        width: 30,
        fontSize: 9,
    },
    itemText: {
        flex: 1,
        fontSize: 9,
    },
    resultBox: {
        width: 15,
        height: 15,
        border: '1px solid black',
        marginLeft: 5,
        marginRight: 5,
        textAlign: 'center',
        fontSize: 8,
    },
    noteField: {
        width: 150,
        borderBottom: '1px solid black',
        marginLeft: 5,
        fontSize: 8,
    },
    signature: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBox: {
        width: '30%',
        textAlign: 'center',
    },
    resultSection: {
        marginTop: 15,
        padding: 10,
        border: '1px solid black',
    },
    legend: {
        fontSize: 8,
        marginBottom: 10,
        textAlign: 'center',
    },
});

// Component สำหรับสร้าง PDF Document
const ConstructionInspectionPDF = ({ data = {} }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <Text style={styles.formNumber}>FM.กมฟ. 01-59-00</Text>
            <Text style={styles.header}>
                แบบฟอร์มตรวจสอบมาตรฐานงานก่อสร้างและปรับปรุงระบบจำหน่าย ของ กฟภ.
            </Text>

            {/* Project Information */}
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>ชื่องาน</Text>
                    <Text style={[styles.underline, { flex: 1 }]}>{data.projectName || ''}</Text>
                    <View style={styles.checkbox}>{data.peaImplemented ? '✓' : ''}</View>
                    <Text style={styles.label}>กฟภ. ดำเนินการ</Text>
                </View>
                
                <View style={styles.row}>
                    <Text style={styles.label}>อนุมัติเลขที่</Text>
                    <Text style={styles.underline}>{data.approvalNumber || ''}</Text>
                    <Text style={styles.label}>ลว.</Text>
                    <Text style={styles.underline}>{data.approvalDate || ''}</Text>
                    <Text style={styles.label}>หมายเลขงาน</Text>
                    <Text style={styles.underline}>{data.workNumber || ''}</Text>
                    <View style={styles.checkbox}>{data.contractWork ? '✓' : ''}</View>
                    <Text style={styles.label}>งานจ้างฯบริษัท</Text>
                    <Text style={styles.underline}>{data.contractorName || ''}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>ปริมาณงานแรงสูง</Text>
                    <Text style={styles.underline}>{data.hvCircuitKm || ''}</Text>
                    <Text style={styles.label}>วงจร-กม.</Text>
                    <Text style={styles.label}>จำนวนเสา</Text>
                    <Text style={styles.underline}>{data.hvPoleCount || ''}</Text>
                    <Text style={styles.label}>ต้น</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>รับไฟจากสถานี</Text>
                    <Text style={styles.underline}>{data.powerStation || ''}</Text>
                    <Text style={styles.label}>ฟีดเดอร์</Text>
                    <Text style={styles.underline}>{data.feeder || ''}</Text>
                    <Text style={styles.label}>เฟสที่ต่อ</Text>
                    <Text style={styles.underline}>{data.phaseConnection || ''}</Text>
                    <Text style={styles.label}>หม้อแปลงรวม</Text>
                    <Text style={styles.underline}>{data.totalTransformerKva || ''}</Text>
                    <Text style={styles.label}>kVA</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>ปริมาณงานแรงต่ำ</Text>
                    <Text style={styles.underline}>{data.lvCircuitKm || ''}</Text>
                    <Text style={styles.label}>วงจร-กม.</Text>
                    <Text style={styles.label}>จำนวนเสา</Text>
                    <Text style={styles.underline}>{data.lvPoleCount || ''}</Text>
                    <Text style={styles.label}>ต้น</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>ผู้ควบคุมงาน</Text>
                    <Text style={styles.underline}>{data.workSupervisor || ''}</Text>
                    <Text style={styles.label}>ตำแหน่ง</Text>
                    <Text style={styles.underline}>{data.supervisorPosition || ''}</Text>
                    <Text style={styles.label}>สังกัด</Text>
                    <Text style={styles.underline}>{data.supervisorDepartment || ''}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>วัน/เดือน/ปี ที่ดำเนินการตรวจ</Text>
                    <Text style={[styles.underline, { flex: 1 }]}>{data.inspectionDate || ''}</Text>
                </View>
            </View>

            <Text style={styles.legend}>
                ช่องผลการตรวจ ให้ทำเครื่องหมาย ✓ หมายถึง ถูกต้อง หรือ × หมายถึง ต้องแก้ไข หรือ - หมายถึง ไม่มีการตรวจ
            </Text>

            {/* Inspection Table Header */}
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>รายการ</Text>
                    </View>
                    <View style={[styles.tableCol, { width: '15%' }]}>
                        <Text style={styles.tableCell}>ผลการตรวจ</Text>
                    </View>
                    <View style={[styles.tableCol, { width: '25%' }]}>
                        <Text style={styles.tableCell}>รายละเอียดที่ต้องแก้ไข</Text>
                    </View>
                    <View style={[styles.tableCol, { width: '10%' }]}>
                        <Text style={styles.tableCell}>หมายเหตุ</Text>
                    </View>
                </View>
            </View>

            {/* High Voltage Distribution System */}
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
                1. ระบบจำหน่ายแรงสูง
            </Text>
            
            {hvInspectionItems.map((item, index) => (
                <View key={index} style={styles.inspectionItem}>
                    <Text style={styles.itemNumber}>{item.number}</Text>
                    <Text style={styles.itemText}>{item.text}</Text>
                    <View style={styles.resultBox}>
                        {data.hvResults && data.hvResults[index] === 'correct' ? '✓' : 
                         data.hvResults && data.hvResults[index] === 'incorrect' ? '×' : 
                         data.hvResults && data.hvResults[index] === 'na' ? '-' : ''}
                    </View>
                    <Text style={styles.noteField}>{data.hvNotes && data.hvNotes[index] || ''}</Text>
                </View>
            ))}
        </Page>

        <Page size="A4" style={styles.page}>
            <Text style={styles.formNumber}>แผ่นที่ 2/2</Text>
            <Text style={styles.formNumber}>FM.กมฟ. 01-59-00</Text>

            {/* Low Voltage Distribution System */}
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
                2. ระบบจำหน่ายแรงต่ำ
            </Text>
            
            {lvInspectionItems.map((item, index) => (
                <View key={index} style={styles.inspectionItem}>
                    <Text style={styles.itemNumber}>{item.number}</Text>
                    <Text style={styles.itemText}>{item.text}</Text>
                    <View style={styles.resultBox}>
                        {data.lvResults && data.lvResults[index] === 'correct' ? '✓' : 
                         data.lvResults && data.lvResults[index] === 'incorrect' ? '×' : 
                         data.lvResults && data.lvResults[index] === 'na' ? '-' : ''}
                    </View>
                    <Text style={styles.noteField}>{data.lvNotes && data.lvNotes[index] || ''}</Text>
                </View>
            ))}

            {/* Transformer Installation */}
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5, marginTop: 10 }}>
                3. การติดตั้งหม้อแปลง
            </Text>
            
            <View style={styles.row}>
                <Text style={styles.label}>TR</Text>
                <Text style={styles.underline}>{data.transformerPhase || ''}</Text>
                <Text style={styles.label}>Ø</Text>
                <Text style={styles.underline}>{data.transformerKva || ''}</Text>
                <Text style={styles.label}>kVA</Text>
                <View style={styles.checkbox}>{data.poleMount ? '✓' : ''}</View>
                <Text style={styles.label}>แขวนเสา</Text>
                <View style={styles.checkbox}>{data.platformMount ? '✓' : ''}</View>
                <Text style={styles.label}>นั่งร้าน</Text>
            </View>

            {transformerInspectionItems.map((item, index) => (
                <View key={index} style={styles.inspectionItem}>
                    <Text style={styles.itemNumber}>{item.number}</Text>
                    <Text style={styles.itemText}>{item.text}</Text>
                    <View style={styles.resultBox}>
                        {data.transformerResults && data.transformerResults[index] === 'correct' ? '✓' : 
                         data.transformerResults && data.transformerResults[index] === 'incorrect' ? '×' : 
                         data.transformerResults && data.transformerResults[index] === 'na' ? '-' : ''}
                    </View>
                    <Text style={styles.noteField}>{data.transformerNotes && data.transformerNotes[index] || ''}</Text>
                </View>
            ))}

            {/* Inspection Results */}
            <View style={styles.resultSection}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>ผลการตรวจสอบ</Text>
                <View style={styles.row}>
                    <View style={styles.checkbox}>{data.passedInspection ? '✓' : ''}</View>
                    <Text style={styles.label}>ตรวจสอบแล้ว ถูกต้องตามมาตรฐาน กฟภ.</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.checkbox}>{data.needsCorrection ? '✓' : ''}</View>
                    <Text style={styles.label}>ตรวจสอบแล้ว เห็นควรแก้ไขให้ถูกต้องตามรายการข้างต้น</Text>
                </View>
                
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: 10, marginBottom: 5 }}>
                    กรณีมีการแก้ไข
                </Text>
                <View style={styles.row}>
                    <View style={styles.checkbox}>{data.corrected ? '✓' : ''}</View>
                    <Text style={styles.label}>ได้แก้ไขให้ถูกต้องตามมาตรฐานทุกรายการแล้ว</Text>
                </View>
            </View>

            {/* Signatures */}
            <View style={styles.signature}>
                <View style={styles.signatureBox}>
                    <Text>ผู้ควบคุมงาน</Text>
                    <Text style={styles.underline}>{data.workSupervisorSignature || ''}</Text>
                    <Text>ลว. {data.supervisorSignDate || ''}</Text>
                </View>
                
                <View style={styles.signatureBox}>
                    <Text>ผู้ตรวจสอบฯ</Text>
                    <Text>1. {data.inspector1Name || ''}</Text>
                    <Text>ตำแหน่ง {data.inspector1Position || ''}</Text>
                    <Text>({data.inspector1Signature || ''})</Text>
                    <Text>2. {data.inspector2Name || ''}</Text>
                    <Text>ตำแหน่ง {data.inspector2Position || ''}</Text>
                    <Text>({data.inspector2Signature || ''})</Text>
                    <Text>3. {data.inspector3Name || ''}</Text>
                    <Text>ตำแหน่ง {data.inspector3Position || ''}</Text>
                    <Text>({data.inspector3Signature || ''})</Text>
                </View>

                <View style={styles.signatureBox}>
                    <Text>รับรองผลการแก้ไข</Text>
                    <Text>หผ. {data.certifierName || ''}</Text>
                    <Text>ลว. {data.certificationDate || ''}</Text>
                    <Text>({data.certifierSignature || ''})</Text>
                </View>
            </View>
        </Page>
    </Document>
);

// High Voltage Inspection Items
const hvInspectionItems = [
    { number: '1.1', text: 'การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)' },
    { number: '1.2', text: 'การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์' },
    { number: '1.3', text: 'การติดตั้งเหล็กรับสายล่อฟ้า (เหล็กฉาก, เหล็กรูปร่างน้ำ)' },
    { number: '1.4', text: 'การฝังสมอบก และประกอบยึดโยงระบบจำหน่าย' },
    { number: '1.5', text: 'การฝังสมอบก และประกอบยึดโยงสายล่อฟ้า' },
    { number: '1.6', text: 'การพาดสายไฟ ระยะหย่อนยาน' },
    { number: '1.7', text: 'การพาดสายล่อฟ้า ระยะหย่อนยาน' },
    { number: '1.8', text: 'ระยะห่าง, ความสูงของสายไฟ' },
    { number: '1.9', text: 'การพันและผูกลูกถ้วย' },
    { number: '1.10', text: 'การต่อสาย พันเทป(สายหุ้มฉนวน)' },
    { number: '1.11', text: 'การเชื่อมสาย, สายแยก พันเทป(สายหุ้มฉนวน)' },
    { number: '1.12', text: 'การเข้าปลายสาย' },
    { number: '1.13', text: 'การตัดต้นไม้' },
    { number: '1.14', text: 'การทาสีเสา' },
    { number: '1.15', text: 'การพ่นสี หมายเลขเสา' },
    { number: '1.16', text: 'การยึดโยง(storm guy, line guy, fix guy, etc.)' },
    { number: '1.17', text: 'การต่อลงดิน' },
    { number: '1.18', text: 'การติดตั้งกับดักเสิร์จแรงสูง' },
    { number: '1.19', text: 'อื่นๆ' },
];

// Low Voltage Inspection Items
const lvInspectionItems = [
    { number: '2.1', text: 'การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)' },
    { number: '2.2', text: 'การติดตั้งคอน แร็ค' },
    { number: '2.3', text: 'การฝังสมอบก และประกอบยึดโยง' },
    { number: '2.4', text: 'การพาดสายไฟ ระยะหย่อนยาน' },
    { number: '2.5', text: 'ระยะห่าง, ความสูงของสายไฟ' },
    { number: '2.6', text: 'การผูกสายไฟกับลูกรอกแรงต่ำ' },
    { number: '2.7', text: 'การต่อสาย พันเทป' },
    { number: '2.8', text: 'การเชื่อมสาย, สายแยก พันเทป' },
    { number: '2.9', text: 'การเข้าปลายสาย พันเทป' },
    { number: '2.10', text: 'การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป' },
    { number: '2.11', text: 'การทาสีเสา' },
    { number: '2.12', text: 'การพ่นสี หมายเลขเสา' },
    { number: '2.13', text: 'การยึดโยง(storm guy, line guy, fix guy)' },
    { number: '2.14', text: 'การต่อลงดิน' },
    { number: '2.15', text: 'ค่าความต้านทานดินรวม' },
    { number: '2.16', text: 'อื่นๆ' },
];

// Transformer Inspection Items
const transformerInspectionItems = [
    { number: '3.1', text: 'การติดตั้งหม้อแปลง (ระยะความสูง, ทิศทาง)' },
    { number: '3.2', text: 'การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์' },
    { number: '3.3', text: 'การพาดสายแรงสูงเข้าหม้อแปลง และลำดับเฟส' },
    { number: '3.4', text: 'การผูกสายไฟกับลูกถ้วย' },
    { number: '3.5', text: 'การติดตั้งกับดักเสิร์จแรงสูง, หางปลา' },
    { number: '3.6', text: 'การติดตั้งดร็อปเอาต์, พินเทอร์มินอล และฟิวส์ลิงก์' },
    { number: '3.7', text: 'การติดตั้งคอนสปัน 3,200 มม. ระยะความสูง' },
    { number: '3.8', text: 'การเข้าสายที่บุชชิ่งหม้อแปลง, หางปลา, ฉนวนครอบบุชชิ่ง' },
    { number: '3.9', text: 'การติดตั้งสายแรงต่ำ และลำดับเฟส' },
    { number: '3.10', text: 'การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป' },
    { number: '3.11', text: 'การติดตั้งคอนสำหรับ LT, LT สวิตช์ และ ฟิวส์แรงต่ำ' },
    { number: '3.12', text: 'การติดตั้งที่จับขอบถัง, เหล็กแขวน ท่อร้อยสายแรงต่ำ' },
    { number: '3.13', text: 'เทคอนกรีตที่คาน, โคนเสา' },
    { number: '3.14', text: 'การต่อลงดิน' },
    { number: '3.15', text: 'ค่าความต้านทานดินต่อจุด' },
    { number: '3.16', text: 'อื่นๆ' },
];

// Component สำหรับแสดง PDF Viewer
const ConstructionInspectionPDFViewer = ({ data }) => (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
        <ConstructionInspectionPDF data={data} />
    </PDFViewer>
);

export default ConstructionInspectionPDFViewer;
export { ConstructionInspectionPDF };