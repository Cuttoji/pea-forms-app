import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Register Sarabun font
Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
  ],
});

// โลโก้ PEA (ถ้ามี)
const PEA_LOGO = "/images/pea-logo.png";

// Section: ข้อมูลทั่วไป
const GeneralInfoSection = ({ general }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>การไฟฟ้า:</Text>
      <Text style={styles.infoValue}>{general?.powerAuthority || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>การตรวจสอบครั้งที่:</Text>
      <Text style={styles.infoValue}>{general?.inspectionNo || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>วันที่ตรวจสอบ:</Text>
      <Text style={styles.infoValue}>{general?.inspectionDate || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>การตรวจสอบตามคำร้องขอใช้ไฟเลขที่:</Text>
      <Text style={styles.infoValue}>{general?.requestNo || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>วันที่คำร้อง:</Text>
      <Text style={styles.infoValue}>{general?.requestDate || "-"}</Text>
    </View>
    {general?.userType === "corp" ? (
      <>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ชื่อนิติบุคคล:</Text>
          <Text style={styles.infoValue}>{general?.corpName || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>โทรศัพท์ (นิติบุคคล):</Text>
          <Text style={styles.infoValue}>{general?.corpPhone || "-"}</Text>
        </View>
      </>
    ) : (
      <>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า:</Text>
          <Text style={styles.infoValue}>{general?.customerName || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>โทรศัพท์:</Text>
          <Text style={styles.infoValue}>{general?.phone || "-"}</Text>
        </View>
      </>
    )}
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ที่อยู่:</Text>
      <Text style={styles.infoValue}>{general?.address || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ระบบไฟฟ้า:</Text>
      <Text style={styles.infoValue}>{general?.systemType || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>กระแสโหลดรวมโดยประมาณ (A):</Text>
      <Text style={styles.infoValue}>{general?.load || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>จำนวนเครื่องอัดประจุ:</Text>
      <Text style={styles.infoValue}>{general?.evChargerCount || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>พิกัดกำลังไฟฟ้ารวม (kW):</Text>
      <Text style={styles.infoValue}>{general?.evChargerPower || "-"}</Text>
    </View>
  </View>
);

// Section: เอกสารประกอบ
const DocumentSection = ({ documents }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. เอกสารประกอบการตรวจสอบ</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>เอกสารรับรองการออกแบบระบบไฟฟ้า:</Text>
      <Text style={styles.infoValue}>
        {documents?.electricalDocument === "has"
          ? "ครบถ้วน"
          : documents?.electricalDocument === "none"
          ? "ไม่ครบถ้วน"
          : "-"}
      </Text>
    </View>
  </View>
);

// Section: ระบบไฟฟ้าแรงต่ำ (ตัวอย่างแสดงเฉพาะบางหัวข้อ)
const LVSystemSection = ({ LVSystemPEA }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>3. ระบบไฟฟ้าแรงต่ำ</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>มาตรฐานสายเมน:</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.standard || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ชนิดสายตัวนำ:</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.conductorType || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ขนาดสายเฟส (ตร.มม.):</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.phaseWireSize || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ขนาดสายนิวทรัล (ตร.มม.):</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.neutralWireSize || "-"}</Text>
    </View>
    {/* ... เพิ่มหัวข้ออื่นๆ ตาม schema ... */}
  </View>
);

// Section: แผงวงจร (Panel Board)
const PanelSection = ({ panel }) => (
  panel?.hasPanelBoard ? (
    <View style={styles.section} break>
      <Text style={styles.sectionTitle}>4. แผงวงจร (Panel Board)</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ขนาดสายเฟส:</Text>
        <Text style={styles.infoValue}>{panel?.phaseSize || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ขนาดสายนิวทรัล:</Text>
        <Text style={styles.infoValue}>{panel?.neutralSize || "-"}</Text>
      </View>
      {/* ... เพิ่มหัวข้ออื่นๆ ตาม schema ... */}
    </View>
  ) : null
);

// Section: วงจรย่อย (Sub Circuits)
const SubCircuitsSection = ({ subCircuits }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>5. วงจรย่อย</Text>
    {Array.isArray(subCircuits) && subCircuits.length > 0 ? (
      subCircuits.map((circuit, idx) => (
        <View key={idx} style={{ marginBottom: 10, paddingLeft: 8 }}>
          <Text style={{ fontWeight: "bold" }}>วงจรที่ {circuit.circuitNo || idx + 1}</Text>
          <Text>ขนาดสายเฟส: {circuit.phaseSize || "-"}</Text>
          <Text>ขนาดสายนิวทรัล: {circuit.neutralSize || "-"}</Text>
          {/* ... เพิ่มหัวข้ออื่นๆ ตาม schema ... */}
          {/* เครื่องอัดประจุในวงจรนี้ */}
          {Array.isArray(circuit.evChargers) && circuit.evChargers.length > 0 && (
            <View style={{ marginTop: 4 }}>
              <Text style={{ fontWeight: "bold" }}>เครื่องอัดประจุในวงจรนี้</Text>
              {circuit.evChargers.map((charger, cidx) => (
                <View key={cidx} style={{ marginLeft: 8, marginBottom: 2 }}>
                  <Text>ผลิตภัณฑ์: {charger.product || "-"}</Text>
                  <Text>รุ่น: {charger.model || "-"}</Text>
                  <Text>Serial Number: {charger.sn || "-"}</Text>
                  <Text>จำนวนหัวชาร์จ: {charger.chargingHeads || "-"}</Text>
                  <Text>พิกัดกำลังไฟฟ้ารวม: {charger.totalPower || "-"}</Text>
                  {/* ... เพิ่มหัวข้ออื่นๆ ตาม schema ... */}
                </View>
              ))}
            </View>
          )}
        </View>
      ))
    ) : (
      <Text>-</Text>
    )}
  </View>
);

// Section: สรุปผลและข้อจำกัด
const SummarySection = ({ summaryType, limitation }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>6. สรุปผลและข้อจำกัด</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ผลการตรวจสอบ:</Text>
      <Text style={styles.infoValue}>
        {summaryType?.overallResult === "pass"
          ? "✓ ผ่าน"
          : summaryType?.overallResult === "fail"
          ? "✗ ไม่ผ่าน"
          : "-"}
      </Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ข้อจำกัด:</Text>
      <Text style={styles.infoValue}>{limitation || "-"}</Text>
    </View>
  </View>
);

// Section: ลายเซ็น
const SignatureSection = ({ signature }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>7. ลายเซ็น</Text>
    <View style={styles.signatureRow}>
      <View style={styles.signatureBox}>
        <Text style={styles.signatureRole}>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
        {signature?.customerSign ? (
          <Image src={signature.customerSign} style={styles.signatureImage} />
        ) : (
          <Text style={styles.signaturePlaceholder}>[ไม่มีลายเซ็น]</Text>
        )}
      </View>
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

// Main PDF Document
const EvChargerLvFormPDF = ({ formData }) => {
  const safeData = {
    general: formData?.general || {},
    documents: formData?.documents || {},
    LVSystemPEA: formData?.LVSystemPEA || {},
    panel: formData?.panel || {},
    subCircuits: formData?.subCircuits || [],
    summaryType: formData?.summaryType || {},
    limitation: formData?.limitation || "",
    signature: formData?.signature || {},
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow} fixed>
          {/* <Image src={PEA_LOGO} style={styles.logo} /> */}
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>การไฟฟ้าส่วนภูมิภาค</Text>
            <Text style={styles.headerSubtitle}>แบบฟอร์มตรวจสอบระบบอัดประจุยานยนต์ไฟฟ้า (แรงต่ำ)</Text>
          </View>
        </View>
        <View style={styles.divider} fixed />
        <GeneralInfoSection general={safeData.general} />
        <DocumentSection documents={safeData.documents} />
        <LVSystemSection LVSystemPEA={safeData.LVSystemPEA} />
        <PanelSection panel={safeData.panel} />
        <SubCircuitsSection subCircuits={safeData.subCircuits} />
        <SummarySection summaryType={safeData.summaryType} limitation={safeData.limitation} />
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
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 140,
    fontWeight: "bold",
  },
  infoValue: {
    flex: 1,
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
});

export default EvChargerLvFormPDF;