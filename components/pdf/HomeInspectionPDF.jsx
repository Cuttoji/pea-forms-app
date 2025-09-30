import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Register Sarabun font (ensure you have these fonts in your /public/fonts folder)
Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
  ],
});

// โลโก้ PEA (ใส่ path public หรือ base64)
const PEA_LOGO = "/images/pea-logo.png"; // หรือ base64

// General Info Section (แก้ชื่อ field ให้ตรง schema)
const GeneralInfoSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <View style={styles.infoTable}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ครั้งที่ตรวจสอบ:</Text>
        <Text style={styles.infoValue}>{data?.inspectionNo || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>วันที่ตรวจสอบ:</Text>
        <Text style={styles.infoValue}>{data?.inspectionDate || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>เลขที่คำร้องขอใช้ไฟ:</Text>
        <Text style={styles.infoValue}>{data?.requestNo || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>วันที่คำร้อง:</Text>
        <Text style={styles.infoValue}>{data?.requestDate || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ชื่อผู้ขอใช้ไฟฟ้า:</Text>
        <Text style={styles.infoValue}>{data?.customerName || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>โทรศัพท์มือถือ:</Text>
        <Text style={styles.infoValue}>{data?.phone || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ที่อยู่:</Text>
        <Text style={styles.infoValue}>{data?.address || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ระบบไฟฟ้า:</Text>
        <Text style={styles.infoValue}>{data?.systemType || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>โหลดประมาณ (kW):</Text>
        <Text style={styles.infoValue}>{data?.load || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ละติจูด:</Text>
        <Text style={styles.infoValue}>{data?.latitude || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ลองจิจูด:</Text>
        <Text style={styles.infoValue}>{data?.longitude || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>รูปภาพหน้าบ้าน:</Text>
        {data?.houseImage ? (
          <Image src={data.houseImage} style={{ width: 80, height: 60 }} />
        ) : (
          <Text style={styles.infoValue}>-</Text>
        )}
      </View>
    </View>
  </View>
);

// Section: ข้อมูลสายไฟและอุปกรณ์พิเศษ
const WireInfoSection = ({ inspection }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>ข้อมูลสายไฟและอุปกรณ์</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ชนิดสายไฟ:</Text>
      <Text style={styles.infoValue}>
        {inspection?.wireType === "other"
          ? inspection?.wireOther || "-"
          : inspection?.wireType || "-"}
      </Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ขนาดสายไฟ:</Text>
      <Text style={styles.infoValue}>{inspection?.wireSize || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ขนาด AT:</Text>
      <Text style={styles.infoValue}>{inspection?.atSize || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ขนาดสายต่อหลักดิน:</Text>
      <Text style={styles.infoValue}>{inspection?.undergroundSize || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>RCD:</Text>
      <Text style={styles.infoValue}>{inspection?.rcdResult || "-"}</Text>
    </View>
    {inspection?.rcdResult === "ไม่ติดตั้ง" && (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>หมายเหตุ RCD:</Text>
        <Text style={styles.infoValue}>{inspection?.rcdNote || "-"}</Text>
      </View>
    )}
  </View>
);

// Section: รายละเอียดการตรวจสอบ (รองรับหัวข้อย่อยและผลตรวจ)
const InspectionDetailSection = ({ items }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>2. รายละเอียดการตรวจสอบ</Text>
    {Array.isArray(items) && items.length > 0 ? (
      <View>
        {items.map((item, idx) => (
          <View key={idx} style={{ marginBottom: 8 }}>
            {/* หัวข้อหลัก */}
            <Text style={styles.inspectionMainLabel}>
              {item.label || "-"}
            </Text>
            {/* ถ้ามี subItems ให้แสดงเป็นข้อย่อย */}
            {Array.isArray(item.subItems) && item.subItems.length > 0 ? (
              item.subItems.map((sub, subIdx) => (
                <View key={subIdx} style={styles.inspectionSubRow}>
                  <Text style={styles.inspectionSubLabel}>
                    {sub.label || "-"}
                  </Text>
                  <Text style={styles.inspectionResult}>
                    {sub.result === "correct" ? "✓ ถูกต้อง"
                      : sub.result === "fix" ? "✗ ต้องแก้ไข"
                      : sub.result === "not_install" ? "⚠ ไม่ประสงค์ติดตั้ง/แจ้งความเสี่ยงแล้ว"
                      : "-"}
                  </Text>
                  {sub.detail && (
                    <Text style={styles.inspectionDetail}>
                      {sub.detail}
                    </Text>
                  )}
                </View>
              ))
            ) : (
              // ถ้าไม่มี subItems ให้แสดงผลตรวจของ item หลัก
              <View style={styles.inspectionSubRow}>
                <Text style={styles.inspectionResult}>
                  {item.result === "correct" ? "✓ ถูกต้อง"
                    : item.result === "fix" ? "✗ ต้องแก้ไข"
                    : item.result === "not_install" ? "⚠ ไม่ประสงค์ติดตั้ง/แจ้งความเสี่ยงแล้ว"
                    : "-"}
                </Text>
                {item.detail && (
                  <Text style={styles.inspectionDetail}>
                    {item.detail}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    ) : (
      <Text>-</Text>
    )}
  </View>
);

// Summary Section (แก้ชื่อ field ให้ตรง schema)
const SummarySection = ({ summaryType }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>3. สรุปผลการตรวจสอบ</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ผลการตรวจสอบ:</Text>
      <Text style={styles.infoValue}>{summaryType?.overallResult || "-"}</Text>
    </View>
    {summaryType?.note && (
      <View style={styles.noteBox}>
        <Text>หมายเหตุ: {summaryType.note}</Text>
      </View>
    )}
  </View>
);

// Limitation Section
const LimitationSection = ({ limitation }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>4. ข้อจำกัดในการตรวจสอบ</Text>
    <Text>{limitation || "-"}</Text>
  </View>
);

// Signature Section (แยก 2 ช่อง)
const SignatureSection = ({ signature }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>5. ลายเซ็น</Text>
    <View style={styles.signatureRow}>
      {/* ผู้ขอใช้ไฟฟ้า */}
      <View style={styles.signatureBox}>
        <Text style={styles.signatureRole}>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
        {signature?.customerSign ? (
          <Image src={signature.customerSign} style={styles.signatureImage} />
        ) : (
          <Text style={styles.signaturePlaceholder}>[ไม่มีลายเซ็น]</Text>
        )}
      </View>
      {/* เจ้าหน้าที่ */}
      <View style={styles.signatureBox}>
        <Text style={styles.signatureRole}>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
        {signature?.officerSign ? (
          <Image src={signature.officerSign} style={styles.signatureImage} />
        ) : (
          <Text style={styles.signaturePlaceholder}>[ไม่มีลายเซ็น]</Text>
        )}
      </View>
    </View>
  </View>
);

const HomeInspectionPDF = ({ formData }) => {
  const safeData = {
    general: formData?.general || {},
    summaryType: formData?.summaryType || {},
    signature: formData?.signature || {},
    inspection: formData?.inspection || {},
    limitation: formData?.limitation || "",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow} fixed>
          <Image src={PEA_LOGO} style={styles.logo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>การไฟฟ้าส่วนภูมิภาค</Text>
            <Text style={styles.headerSubtitle}>แบบฟอร์มตรวจสอบระบบไฟฟ้าภายในอาคาร</Text>
          </View>
        </View>
        <View style={styles.divider} fixed />
        <GeneralInfoSection data={safeData.general} />
        <WireInfoSection inspection={safeData.inspection} />
        <InspectionDetailSection items={safeData.inspection.items || []} />
        <SummarySection summaryType={safeData.summaryType} />
        <LimitationSection limitation={safeData.limitation} />
        <SignatureSection signature={safeData.signature} />
        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => `หน้า ${pageNumber}/${totalPages}`}
        />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    fontSize: 12,
    padding: 32,
    backgroundColor: "#fff",
    lineHeight: 1.5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3a1a5b",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#3a1a5b",
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#5b2d90",
    borderBottomStyle: "solid",
    marginVertical: 12,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    textAlign: "right",
    fontSize: 10,
    color: "#aaa",
  },
  section: {
    marginBottom: 18,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#5b2d90",
  },
  infoTable: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 120,
    fontWeight: "bold",
  },
  infoValue: {
    flex: 1,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 8,
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
  },
  cellHeader: {
    flex: 1,
    fontWeight: "bold",
    padding: 4,
    fontSize: 11,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    borderRightStyle: "solid",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid",
  },
  cell: {
    flex: 1,
    padding: 4,
    fontSize: 11,
    borderRightWidth: 1,
    borderRightColor: "#eee",
    borderRightStyle: "solid",
  },
  inspectionItem: {
    marginLeft: 12,
    marginBottom: 2,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 8,
  },
  signatureBox: {
    border: "1 solid #222",
    padding: 12,
    minHeight: 90,
    minWidth: 160,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  signatureRole: {
    fontSize: 11,
    marginBottom: 4,
    color: "#5b2d90",
    fontWeight: "bold",
  },
  signatureImage: {
    width: 120,
    height: 40,
    marginBottom: 8,
    objectFit: "contain",
  },
  signaturePlaceholder: {
    color: "#bbb",
    marginBottom: 8,
  },
  sigDate: {
    fontSize: 10,
    color: "#666",
    marginTop: 6,
    textAlign: "right",
  },
  noteBox: {
    border: "1 solid #aaa",
    padding: 12,
    marginTop: 12,
    minHeight: 60,
  },
  inspectionMainLabel: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 2,
    color: "#333",
  },
  inspectionSubRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 12,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  inspectionSubLabel: {
    fontSize: 11,
    minWidth: 120,
    color: "#444",
  },
  inspectionResult: {
    fontSize: 11,
    marginLeft: 8,
    color: "#1a7f37",
    minWidth: 80,
  },
  inspectionDetail: {
    fontSize: 11,
    marginLeft: 8,
    color: "#b45309",
    flex: 1,
  },
});

export default HomeInspectionPDF;