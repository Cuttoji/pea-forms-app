import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  // หน้ากระดาษ - ไม่มีสี ใช้ขาวดำ
  page: {
    fontFamily: "Sarabun",
    fontSize: 11,
    padding: "17 20 15 20",
    lineHeight: 1.3,
    backgroundColor: "#ffffff",
  },

  // Header ของ PEA พร้อมโลโก้ - ตามรูป (โลโก้อยู่บน ข้อความอยู่ล่าง)
  peaHeader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  peaLogo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  peaHeaderText: {
    flexDirection: "column",
    alignItems: "center",
  },
  peaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  peaSubtitle: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
    fontWeight: "bold",
  },
  
  // สำหรับ FormHeader.jsx
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 6,
  },
  headerTextContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 2,
  },

  // กรอบชื่อฟอร์มหลัก (2 เส้น) - ตามรูป
  formTitleBox: {
    border: "2 solid #000",
    padding: 12,
    marginBottom: 12,
    textAlign: "center",
  },
  formTitle: {
    fontSize: 13,
    fontWeight: "bold",
    lineHeight: 1.5,
  },

  // ส่วนอ้างอิงและข้อมูลทั่วไป
  referenceSection: {
    border: "1 solid #000",
    padding: 10,
    marginBottom: 10,
  },
  referenceLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  referenceLabel: {
    fontSize: 12,
    marginRight: 5,
  },
  referenceField: {
    borderBottom: "1 dotted #000",
    minWidth: 100,
    paddingBottom: 2,
    fontSize: 12,
  },

  // ส่วนหลัก (section)
  section: {
    padding: 0,
    marginBottom: 6,
  },

  // ส่วนข้อมูลทั่วไป (section 1)
  generalSection: {
    border: "1 solid #000",
    padding: 6,
    marginBottom: 6,
  },

  // หัวข้อหลักของแต่ละส่วน (1., 2., 3., ...)
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 2,
    lineHeight: 1.4,
  },

  // หัวข้อย่อย
  subsectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 3,
    marginTop: 4,
  },

  // ข้อความในหัวข้อย่อย
  subsectionText: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 6,
  },

  // บรรทัดที่มี checkbox - checkbox อยู่หน้าข้อความ (ตามรูป PDF)
  checkboxLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  // Container สำหรับกลุ่ม checkbox หลายบรรทัด
  checkboxContainer: {
    marginTop: 4,
    marginBottom: 4,
  },

  // กลุ่ม checkbox แนวนอน
  checkboxGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  // checkbox พร้อม label แนวนอน
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },

  // ข้อความข้อมูล - มีเส้นใต้
  infoText: {
    fontSize: 11,
    lineHeight: 1.4,
    marginLeft: 2,
  },

  // เส้นใต้สำหรับข้อมูลที่กรอก
  underlineLong: {
    borderBottom: "1 dotted #000",
    paddingBottom: 2,
    minWidth: 60,
  },
  
  // เส้นใต้แบบสั้น
  underlineShort: {
    borderBottom: "1 dotted #000",
    paddingBottom: 2,
    minWidth: 40,
  },

  // บรรทัดระบบไฟฟ้า - checkbox ในบรรทัดเดียวกัน
  systemLine: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 6,
  },

  // ตารางเอกสาร - มีกรอบด้านในสุดเท่านั้น
  documentTable: {
    border: "1 solid #000",
    marginBottom: 8,
    marginTop: 8,
  },

  // แถวของตาราง - มีเส้นคั่น
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    minHeight: 20,
    pageBreakInside: "avoid",
  },

  // คอลัมน์ซ้าย - กว้างมาก (ประมาณ 80%)
  leftColumn: {
    flex: 4,
    padding: 4,
    borderRight: "1 solid #000",
  },

  // คอลัมน์ขวา - แคบ สำหรับ checkbox (ประมาณ 20%)
  rightColumn: {
    flex: 1,
    padding: 4,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  // รายการเอกสาร - checkbox อยู่หน้า
  docItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  // รายการอนุมัติ - checkbox และข้อความในบรรทัดเดียวกัน
  approvalItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  // ส่วนหม้อแปลง - เอากรอบออก ไม่มีกรอบนอกสุด
  transformerSection: {
    padding: 0,
    marginBottom: 8,
    marginTop: 4,
  },
  
  // Wrapper สำหรับหม้อแปลงแต่ละตัว - ป้องกันการแยกข้ามหน้า
  transformerWrapper: {
    marginBottom: 12,
  },
  
  // สำหรับบังคับขึ้นหน้าใหม่
  pageBreak: {
    marginTop: 0,
  },

  // ส่วนวงจรย่อย
  subCircuitSection: {
    marginBottom: 8,
  },

  // ตาราง LV
  lvTable: {
    border: "1 solid #000",
    marginTop: 2,
    marginBottom: 2,
  },

  // ตาราง HV System (Section 3) - ตามรูป 2 (แก้ไม่ให้กรอบขาด)
  hvTable: {
    border: "1 solid #000",
    marginTop: 4,
    marginBottom: 4,
  },
  
  hvRow: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    minHeight: 20,
    pageBreakInside: "avoid",
  },
  
  // คอลัมน์ซ้าย HV - กว้างมาก (ประมาณ 75%)
  hvLeftCol: {
    flex: 3,
    padding: 4,
    borderRight: "1 solid #000",
    justifyContent: "center",
  },
  
  // คอลัมน์ขวา HV - สำหรับ checkbox ถูกต้อง/ต้องแก้ไข (ประมาณ 25%)
  hvRightCol: {
    flex: 1,
    padding: 4,
    justifyContent: "flex-start",
  },

  // เส้นประสำหรับกรอกข้อมูล
  underlineDotted: {
    borderBottom: "1 dotted #000",
    paddingBottom: 2,
    minWidth: 80,
  },

  // Container สำหรับ checkbox result (ถูกต้อง/ต้องแก้ไข) - แนวนอน
  resultContainer: {
    flexDirection: "row",
  },
  
  // สำหรับรายการย่อย (เช่น 4.7.1, 4.7.2 ฯลฯ) - ป้องกันการตัดครึ่ง
  subItemResult: {
    marginBottom: 6,
    pageBreakInside: "avoid",
  },
  
  // Row สำหรับ checkbox แนวนอน
  checkboxRowHorizontal: {
    flexDirection: "row",
  },
  
  // แต่ละแถวของ result (checkbox + text)
  resultRowHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  
  // ข้อความ result
  resultText: {
    fontSize: 10,
    lineHeight: 1.3,
  },

  // เส้นใต้ยาวสำหรับกรอกข้อความเต็มบรรทัด (เช่น section 3.4)
  underlineLongFull: {
    borderBottom: "1 dotted #000",
    paddingBottom: 2,
    flex: 1,
    minWidth: 200,
  },

  // ตาराง Transformer (Section 4) - ตามรูป 3 (เอาแค่กรอบด้านในสุด)
  transformerTable: {
    border: "1 solid #000",
    marginTop: 8,
    marginBottom: 8,
  },

  transformerRow: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    minHeight: 25,
  },

  // คอลัมน์ซ้าย transformer (ข้อความ)
  transformerLeftCol: {
    flex: 3,
    padding: 8,
    borderRight: "1 solid #000",
  },

  // คอลัมน์ขวา transformer (checkbox ผ่านการทดสอบ/ไม่ผ่าน)
  transformerRightCol: {
    flex: 1,
    padding: 8,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  
  // คอลัมน์เต็ม สำหรับส่วนที่ไม่แบ่ง (ใช้สำหรับส่วน 4.9)
  transformerFullCol: {
    flex: 1,
    padding: 8,
  },

  // ตาราง - ไม่มีสีพื้นหลัง
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    padding: 4,
    fontWeight: "bold",
  },
  tableCell: {
    padding: 4,
    fontSize: 10,
    flex: 1,
    borderRight: "1 solid #000",
    justifyContent: "center",
  },
  tableCellLast: {
    padding: 4,
    fontSize: 10,
    flex: 1,
    justifyContent: "center",
  },
  tableCellCenter: {
    textAlign: "center",
    alignItems: "center",
  },
  tableCellSmall: {
    flex: 0.5,
  },
  tableCellMedium: {
    flex: 1,
  },
  tableCellLarge: {
    flex: 2,
  },

  // ฟิลด์กรอกข้อมูล - มีระยะห่างพอดี
  formField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  fieldLabel: {
    fontSize: 11,
    marginRight: 4,
  },
  fieldInput: {
    borderBottom: "1 dotted #000",
    minWidth: 60,
    paddingBottom: 1,
    fontSize: 11,
    paddingHorizontal: 2,
  },
  fieldInputLong: {
    borderBottom: "1 dotted #000",
    flex: 1,
    paddingBottom: 1,
    fontSize: 11,
    minWidth: 100,
  },

  // แผนภาพ - มีกรอบชัดเจน
  diagramSection: {
    border: "1 solid #000",
    padding: 10,
    marginBottom: 8,
    textAlign: "center",
  },
  diagramTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  diagramImage: {
    maxWidth: "100%",
    maxHeight: 180,
    objectFit: "contain",
  },

  // ประเภทวงจร - ไม่มีสี
  circuitTypes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  circuitType: {
    alignItems: "center",
    flex: 1,
    padding: 6,
  },
  circuitLabel: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 1.2,
  },
  circuitDiagram: {
    width: 70,
    height: 50,
    marginBottom: 4,
  },

  // รายการ
  specList: {
    marginLeft: 10,
    marginBottom: 6,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  bulletSymbol: {
    fontSize: 11,
    marginRight: 4,
    minWidth: 12,
  },
  specText: {
    fontSize: 10,
    flex: 1,
    lineHeight: 1.2,
  },

  // เลย์เอาท์ 2 คอลัมน์ - ระยะห่างพอดี
  twoColumn: {
    flexDirection: "row",
    gap: 8,
  },

  // หมายเลขหน้า
  pageNumber: {
    position: "absolute",
    top: 8,
    right: 15,
    fontSize: 10,
    fontWeight: "bold",
  },

  // ส่วนท้ายหน้า
  footerReference: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 15,
    paddingTop: 6,
    borderTop: "0.5 solid #000",
  },

  // QR Code - ไม่มีสีพื้นหลัง
  qrSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    padding: 6,
    border: "1 solid #000",
  },
  qrCode: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  qrText: {
    fontSize: 9,
    flex: 1,
    lineHeight: 1.2,
  },

  // ลายเซ็น - มีกรอบและระยะห่างพอดี
  signatureSection: {
    border: "1 solid #000",
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  signatureBox: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 15,
  },
  signatureLine: {
    borderTop: "1 dotted #000",
    width: 120,
    marginTop: 30,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
  },
  signatureImage: {
    width: 120,
    height: 60,
    objectFit: "contain",
    marginBottom: 8,
  },

  // กล่องข้อความ/หมายเหตุ - ไม่มีสีพื้นหลัง
  noteBox: {
    border: "1 solid #000",
    padding: 8,
    marginVertical: 6,
    fontSize: 10,
    lineHeight: 1.3,
  },
  noteTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 10,
    lineHeight: 1.3,
  },
  
  // กล่องคำแนะนำ
  recommendationBox: {
    border: "1 solid #000",
    padding: 8,
    marginTop: 8,
  },

  // แผนภาพไฟฟ้าแบบเต็ม
  electricalDiagram: {
    border: "1 solid #000",
    padding: 12,
    marginVertical: 12,
    textAlign: "center",
    minHeight: 300,
  },
  electricalDiagramTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    textDecoration: "underline",
  },
  diagramLegend: {
    marginTop: 8,
    padding: 6,
    border: "1 solid #000",
    fontSize: 9,
  },

  // ตารางอุปกรณ์ - ไม่มีสีพื้นหลัง
  equipmentTable: {
    border: "1 solid #000",
    marginBottom: 8,
  },
  equipmentTableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #000",
    minHeight: 18,
  },
  equipmentTableCell: {
    padding: 3,
    fontSize: 9,
    borderRight: "0.5 solid #000",
    justifyContent: "center",
  },
  equipmentTableCellLast: {
    padding: 3,
    fontSize: 9,
    justifyContent: "center",
  },
  equipmentTableHeader: {
    fontWeight: "bold",
  },

  // Utility classes - ไม่มีสีพื้นหลัง
  bold: {
    fontWeight: "bold",
  },
  center: {
    textAlign: "center",
  },
  underline: {
    textDecoration: "underline",
  },
  smallText: {
    fontSize: 9,
  },
  smallBoldText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  mediumText: {
    fontSize: 10,
  },
  largeText: {
    fontSize: 12,
  },
  marginSmall: {
    marginBottom: 3,
  },
  marginMedium: {
    marginBottom: 6,
  },
  marginLarge: {
    marginBottom: 10,
  },
  paddingSmall: {
    padding: 3,
  },
  paddingMedium: {
    padding: 6,
  },
  borderBottom: {
    borderBottom: "1 solid #000",
  },
  borderTop: {
    borderTop: "1 solid #000",
  },
  flexRow: {
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
  },
  alignCenter: {
    alignItems: "center",
  },
  alignStart: {
    alignItems: "flex-start",
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  textRight: {
    textAlign: "right",
  },
  textLeft: {
    textAlign: "left",
  },
  
  // Styles จาก HomeInspectionPDF
  boxed: {
    border: "1 solid #000",
    padding: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    flexWrap: "wrap",
  },
  titleBox: {
    border: "1 solid #000",
    padding: 6,
    marginBottom: 8,
    textAlign: "center",
  },
  titleText: {
    fontSize: 9,
    marginBottom: 2,
  },
  inspectionInfo: {
    fontSize: 8,
    marginTop: 3,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 8,
  },
  subsection: {
    marginBottom: 2,
  },
  item: {
    marginBottom: 6,
  },
  itemLabel: {
    fontSize: 8,
    marginBottom: 2,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    marginLeft: 3,
    flexWrap: "wrap",
  },
  resultRowItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxDetailRow: {
    flexDirection: "column",
    marginLeft: 15,
    marginBottom: 3,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    marginLeft: 3,
  },
  detailDots: {
    fontSize: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "dotted",
    paddingBottom: 1,
    marginLeft: 4,
  },
  indentedRow: {
    marginLeft: 10,
    marginBottom: 2,
  },
  methodSection: {
    marginBottom: 4,
  },
  subMethodDetails: {
    marginLeft: 15,
    marginTop: 2,
  },
  subItemRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  subItemNumber: {
    fontSize: 8,
    marginRight: 2,
  },
  subItemText: {
    fontSize: 8,
    flex: 1,
  },
  smallLabel: {
    fontSize: 7,
  },
  wireTypeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 3,
  },
  optionText: {
    fontSize: 8,
    marginRight: 6,
  },
  checkboxColumn: {
    flexDirection: "column",
    marginLeft: 10,
  },
  summaryText: {
    fontSize: 9,
  },
  sizeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    marginLeft: 3,
  },
  highlight: {
    fontWeight: "bold",
  },
  redText: {
    color: "#dc2626",
  },
  acknowledgmentBox: {
    border: "1 solid #000",
    padding: 6,
  },
  acknowledgmentText: {
    fontSize: 7,
    marginBottom: 4,
    lineHeight: 1.2,
  },
  signatureLabel: {
    fontSize: 8,
    marginBottom: 6,
  },
  signatureDate: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 3,
  },
  recommendationTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
  },
  recommendationText: {
    fontSize: 7,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 7,
    color: "#666",
  },
  diagramSubtitle: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 10,
  },
  diagramContainer: {
    border: "1 solid #000",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  diagramElement: {
    fontSize: 8,
    marginVertical: 2,
    textAlign: "center",
  },
  arrow: {
    fontSize: 12,
    marginVertical: 1,
  },
  dashedLine: {
    borderTopWidth: 1,
    borderTopStyle: "dashed",
    width: "100%",
    marginVertical: 4,
  },
  systemBox: {
    border: "1 solid #000",
    padding: 8,
    marginVertical: 6,
    width: "100%",
  },
  systemTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 3,
  },
  systemItem: {
    fontSize: 7,
    marginBottom: 1,
  },
  requirementBox: {
    border: "1 solid #000",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  requirementTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
  },
  requirementText: {
    fontSize: 7,
    marginBottom: 2,
    lineHeight: 1.2,
  },
});