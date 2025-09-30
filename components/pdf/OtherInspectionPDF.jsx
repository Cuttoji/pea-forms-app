"use client";
import React from "react";
import { Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Register Sarabun font
Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
  ],
});

// โลโก้ PEA
const PEA_LOGO = "/images/pea-logo.png";

// Section: ข้อมูลทั่วไป (ปรับตาม prompt)
const GeneralInfoSection = ({ general }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>การตรวจสอบครั้งที่:</Text>
      <Text style={styles.infoValue}>{general?.inspectionNo || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>วันที่:</Text>
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
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า:</Text>
      <Text style={styles.infoValue}>{general?.customerName || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>โทรศัพท์:</Text>
      <Text style={styles.infoValue}>{general?.phone || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ที่อยู่:</Text>
      <Text style={styles.infoValue}>{general?.address || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ระบบไฟฟ้า:</Text>
      <Text style={styles.infoValue}>
        {general?.systemType === "22kV" ? "22 kV" : general?.systemType === "33kV" ? "33 kV" : "-"}
      </Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>โหลดประมาณ (แอมแปร์):</Text>
      <Text style={styles.infoValue}>{general?.load || "-"}</Text>
    </View>
  </View>
);

// Section: เอกสารประกอบ (ปรับตาม prompt)
const DocumentSection = ({ documents }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. การตรวจสอบเอกสาร</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>เอกสารรับรองการออกแบบระบบไฟฟ้า:</Text>
      <Text style={styles.infoValue}>
        {documents?.electricalDocument === "has"
          ? "มี"
          : documents?.electricalDocument === "none"
          ? "ไม่มี"
          : "-"}
      </Text>
    </View>
    {documents?.electricalDocument === "has" && (
      <View style={{ marginLeft: 12, marginTop: 2 }}>
        <Text style={styles.infoValue}>
          1. วิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรองในแบบติดตั้งระบบไฟฟ้า (As-built Drawing)
        </Text>
        <Text style={styles.infoValue}>
          2. สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม
        </Text>
      </View>
    )}
  </View>
);

// Section: ระบบจำหน่ายแรงสูง
const HVSystemSection = ({ hvSystem }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>3. ระบบจำหน่ายแรงสูง</Text>

    {/* 2.1 ระบบจำหน่ายเหนือดิน */}
    <Text style={{ fontWeight: "bold", marginTop: 6 }}>2.1 ระบบจำหน่ายเหนือดิน</Text>
    {Array.isArray(hvSystem?.aboveItems) && hvSystem.aboveItems.length > 0 ? (
      hvSystem.aboveItems.map((item, idx) => (
        <View key={idx} style={styles.checkRow}>
          <Text style={styles.checkLabel}>{item.label || "-"}</Text>
          <Text style={styles.checkResult}>
            {item.result === "correct"
              ? "✓ ถูกต้อง"
              : item.result === "fix"
              ? "✗ ต้องแก้ไข"
              : "-"}
          </Text>
          {item.detail && (
            <Text style={styles.checkDetail}>{item.detail}</Text>
          )}
        </View>
      ))
    ) : (
      <Text style={{ marginLeft: 12 }}>-</Text>
    )}

    {/* 2.2 ระบบจำหน่ายใต้ดิน */}
    <Text style={{ fontWeight: "bold", marginTop: 10 }}>2.2 ระบบจำหน่ายใต้ดิน</Text>
    {Array.isArray(hvSystem?.underItems) && hvSystem.underItems.length > 0 ? (
      hvSystem.underItems.map((item, idx) => (
        <View key={idx} style={styles.checkRow}>
          <Text style={styles.checkLabel}>{item.label || "-"}</Text>
          <Text style={styles.checkResult}>
            {item.result === "correct"
              ? "✓ ถูกต้อง"
              : item.result === "fix"
              ? "✗ ต้องแก้ไข"
              : "-"}
          </Text>
          {item.detail && (
            <Text style={styles.checkDetail}>{item.detail}</Text>
          )}
        </View>
      ))
    ) : (
      <Text style={{ marginLeft: 12 }}>-</Text>
    )}

    {/* 2.3 การติดตั้งเครื่องปลดวงจรต้นทาง */}
    <Text style={{ fontWeight: "bold", marginTop: 10 }}>2.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)</Text>
    <View style={styles.checkRow}>
      <Text style={styles.checkLabel}>ผลตรวจ:</Text>
      <Text style={styles.checkResult}>
        {hvSystem?.mainBreaker?.result === "correct"
          ? "✓ ถูกต้อง"
          : hvSystem?.mainBreaker?.result === "fix"
          ? "✗ ต้องแก้ไข"
          : "-"}
      </Text>
      {hvSystem?.mainBreaker?.detail && (
        <Text style={styles.checkDetail}>{hvSystem.mainBreaker.detail}</Text>
      )}
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ประเภทอุปกรณ์:</Text>
      <Text style={styles.infoValue}>
        {hvSystem?.mainBreaker?.dropoutFuse ? "ดรอพเอาท์ฟิวส์คัตเอาท์, " : ""}
        {hvSystem?.mainBreaker?.switch ? `สวิตช์ตัดตอน (${hvSystem.mainBreaker.switchType || "-"})` : ""}
        {hvSystem?.mainBreaker?.rmu ? "RMU" : ""}
      </Text>
    </View>

    {/* 2.4 อื่นๆ */}
    <Text style={{ fontWeight: "bold", marginTop: 10 }}>2.4 อื่นๆ</Text>
    <Text style={{ marginLeft: 12 }}>{hvSystem?.other || "-"}</Text>
  </View>
);

// Section: หม้อแปลง (รองรับการทำซ้ำและหัวข้อย่อยแบบละเอียด)
const TransformersSection = ({ transformers }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>4. หม้อแปลง</Text>
    {Array.isArray(transformers) && transformers.length > 0 ? (
      transformers.map((t, idx) => (
        <View key={idx} style={{ marginBottom: 16, paddingLeft: 8 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 2 }}>
            หม้อแปลงเครื่องที่ {idx + 1}
          </Text>
          {/* 2.5 คุณสมบัติทั่วไปของหม้อแปลง */}
          <Text>2.5 คุณสมบัติทั่วไปของหม้อแปลง</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลการทดสอบ:</Text>
            <Text style={styles.infoValue}>
              {t?.testResult === "pass"
                ? "✓ ผ่านการทดสอบ"
                : t?.testResult === "fail"
                ? "✗ ไม่ผ่านการทดสอบ"
                : "-"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ขนาด (kVA):</Text>
            <Text style={styles.infoValue}>{t?.capacity || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>พิกัดแรงดันด้านแรงสูง (kV):</Text>
            <Text style={styles.infoValue}>{t?.hvVoltage || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>พิกัดแรงดันด้านแรงต่ำ (V):</Text>
            <Text style={styles.infoValue}>{t?.lvVoltage || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>% Impedance:</Text>
            <Text style={styles.infoValue}>{t?.impedance || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ชนิด:</Text>
            <Text style={styles.infoValue}>
              {t?.transformerType === "oil"
                ? "Oil"
                : t?.transformerType === "dry"
                ? "Dry"
                : t?.transformerType === "other"
                ? `อื่นๆ (${t?.transformerTypeOther || "-"})`
                : "-"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vector Group:</Text>
            <Text style={styles.infoValue}>{t?.vectorGroup || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>พิกัดการทนกระแสลัดวงจรสูงสุด (kA):</Text>
            <Text style={styles.infoValue}>{t?.maxShortCircuitCurrent || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลตรวจ:</Text>
            <Text style={styles.infoValue}>
              {t?.propertyResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.propertyResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.propertyDetail ? ` (${t.propertyDetail})` : ""}
            </Text>
          </View>

          {/* 2.6 ลักษณะการติดตั้ง */}
          <Text style={{ marginTop: 6 }}>2.6 ลักษณะการติดตั้ง</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ลักษณะ:</Text>
            <Text style={styles.infoValue}>
              {t?.installationType?.hanging ? "แขวน, " : ""}
              {t?.installationType?.scaffold ? "นั่งร้าน, " : ""}
              {t?.installationType?.floor ? "ตั้งพื้น, " : ""}
              {t?.installationType?.rooftop ? "ตั้งบนดาดฟ้า, " : ""}
              {t?.installationType?.room ? "ห้องหม้อแปลง, " : ""}
              {t?.installationType?.other ? `อื่นๆ (${t.installationTypeOther || "-"})` : ""}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลตรวจ:</Text>
            <Text style={styles.infoValue}>
              {t?.installationResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.installationResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.installationDetail ? ` (${t.installationDetail})` : ""}
            </Text>
          </View>

          {/* 2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า */}
          <Text style={{ marginTop: 6 }}>2.7 เครื่องป้องกันกระแสเกินด้านไฟเข้า</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลตรวจ:</Text>
            <Text style={styles.infoValue}>
              {t?.overcurrentResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.overcurrentResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.overcurrentDetail ? ` (${t.overcurrentDetail})` : ""}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ประเภทอุปกรณ์:</Text>
            <Text style={styles.infoValue}>
              {t?.overcurrentDevice?.dropoutFuse ? "ดรอพเอาท์ฟิวส์คัตเอาท์, " : ""}
              {t?.overcurrentDevice?.circuitBreaker ? "เซอร์กิตเบรกเกอร์, " : ""}
              {t?.overcurrentDevice?.other ? `อื่นๆ (${t.overcurrentDeviceOther || "-"})` : ""}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>พิกัดกระแสต่อเนื่อง (A):</Text>
            <Text style={styles.infoValue}>{t?.overcurrentAmp || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>พิกัดตัดกระแสลัดวงจรสูงสุด (IC) (kA):</Text>
            <Text style={styles.infoValue}>{t?.overcurrentIC || "-"}</Text>
          </View>

          {/* 2.8 การติดตั้งกับดักเสิร์จแรงสูง */}
          <Text style={{ marginTop: 6 }}>2.8 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลตรวจ:</Text>
            <Text style={styles.infoValue}>
              {t?.hvSurgeResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.hvSurgeResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.hvSurgeDetail ? ` (${t.hvSurgeDetail})` : ""}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>พิกัดแรงดัน (kV):</Text>
            <Text style={styles.infoValue}>{t?.hvSurgeVoltage || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>พิกัดกระแส (kA):</Text>
            <Text style={styles.infoValue}>{t?.hvSurgeCurrent || "-"}</Text>
          </View>

          {/* 2.9 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง */}
          <Text style={{ marginTop: 6 }}>2.9 การประกอบสายดินกับตัวถังหม้อแปลงและกับดักเสิร์จแรงสูง</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลตรวจ:</Text>
            <Text style={styles.infoValue}>
              {t?.groundingResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.groundingResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.groundingDetail ? ` (${t.groundingDetail})` : ""}
            </Text>
          </View>

          {/* 2.10 ค่าความต้านทานดินของระบบแรงสูง */}
          <Text style={{ marginTop: 6 }}>2.10 ค่าความต้านทานดินของระบบแรงสูง (โอห์ม)</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ค่า (โอห์ม):</Text>
            <Text style={styles.infoValue}>{t?.groundingOhm || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลตรวจ:</Text>
            <Text style={styles.infoValue}>
              {t?.groundingOhmResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.groundingOhmResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.groundingOhmDetail ? ` (${t.groundingOhmDetail})` : ""}
            </Text>
          </View>

          {/* 2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน) */}
          <Text style={{ marginTop: 6 }}>2.11 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>2.11.1 สารดูดความชื้น:</Text>
            <Text style={styles.infoValue}>
              {t?.silicaGelResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.silicaGelResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.silicaGelDetail ? ` (${t.silicaGelDetail})` : ""}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>2.11.2 สภาพบุชชิ่ง:</Text>
            <Text style={styles.infoValue}>
              {t?.bushingResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.bushingResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.bushingDetail ? ` (${t.bushingDetail})` : ""}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>2.11.3 ระดับน้ำมัน:</Text>
            <Text style={styles.infoValue}>
              {t?.oilLevelResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.oilLevelResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.oilLevelDetail ? ` (${t.oilLevelDetail})` : ""}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>2.11.4 การรั่วซึมของน้ำมันหม้อแปลง:</Text>
            <Text style={styles.infoValue}>
              {t?.oilLeakResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.oilLeakResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.oilLeakDetail ? ` (${t.oilLeakDetail})` : ""}
            </Text>
          </View>

          {/* 2.12 ป้ายเตือน */}
          <Text style={{ marginTop: 6 }}>2.12 ป้ายเตือน</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลตรวจ:</Text>
            <Text style={styles.infoValue}>
              {t?.warningSignResult === "correct"
                ? "✓ ถูกต้อง"
                : t?.warningSignResult === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {t?.warningSignDetail ? ` (${t.warningSignDetail})` : ""}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ข้อความป้าย:</Text>
            <Text style={styles.infoValue}>
              {t?.warningSignText || "“อันตรายไฟฟ้าแรงสูง เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น”"}
            </Text>
          </View>

          {/* 2.13 อื่นๆ */}
          <Text style={{ marginTop: 6 }}>2.13 อื่นๆ</Text>
          <Text style={{ marginLeft: 12 }}>{t?.other || "-"}</Text>
        </View>
      ))
    ) : (
      <Text>-</Text>
    )}
  </View>
);

// Section: สรุปผล/ข้อจำกัด
const SummarySection = ({ summaryType, limitation }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>5. สรุปผลและข้อจำกัด</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ผลการตรวจสอบ:</Text>
      <Text style={styles.infoValue}>{summaryType?.overallResult || "-"}</Text>
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
    <Text style={styles.sectionTitle}>6. ลายเซ็น</Text>
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
const OtherInspectionPDF = ({ formData }) => {
  const safeData = {
    general: formData?.general || {},
    documents: formData?.documents || {},
    hvSystem: formData?.hvSystem || {},
    transformers: formData?.transformers || [],
    summaryType: formData?.summaryType || {},
    limitation: formData?.limitation || "",
    signature: formData?.signature || {},
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow} fixed>
          <Image src={PEA_LOGO} style={styles.logo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>การไฟฟ้าส่วนภูมิภาค</Text>
            <Text style={styles.headerSubtitle}>แบบฟอร์มตรวจสอบระบบไฟฟ้าแรงสูง</Text>
          </View>
        </View>
        <View style={styles.divider} fixed />
        <GeneralInfoSection general={safeData.general} />
        <DocumentSection documents={safeData.documents} />
        <HVSystemSection hvSystem={safeData.hvSystem} />
        <TransformersSection transformers={safeData.transformers} />
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
    fontSize: 11,
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
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 12,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  checkLabel: {
    fontSize: 11,
    minWidth: 120,
    color: "#444",
  },
  checkResult: {
    fontSize: 11,
    marginLeft: 8,
    color: "#1a7f37",
    minWidth: 80,
  },
  checkDetail: {
    fontSize: 11,
    marginLeft: 8,
    color: "#b45309",
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

export default OtherInspectionPDF;