"use client";
import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Register Sarabun font
Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Sarabun-Light.ttf", fontWeight: "light" },
  ],
});

const PEA_LOGO = "/pea_logo.png";

// Helper Components
const Field = ({ label, value, style }) => (
  <View style={{ ...styles.infoRow, ...style }}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "-"}</Text>
  </View>
);

const Checkbox = ({ checked, label }) => (
  <View style={styles.checkboxContainer}>
    <View style={styles.checkbox}>
      <Text style={styles.checkMark}>{checked ? "✓" : " "}</Text>
    </View>
    <Text>{label}</Text>
  </View>
);

// Header Section
const HeaderSection = () => (
  <View style={styles.headerRow} fixed>
    <Image src={PEA_LOGO} style={styles.logo} />
    <View style={{ flex: 1 }}>
      <Text style={styles.headerTitle}>การไฟฟ้าส่วนภูมิภาค</Text>
      <Text style={styles.headerSubtitle}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
    </View>
    <Text style={styles.headerOffice}>การไฟฟ้า......</Text>
  </View>
);

// Section: ข้อมูลทั่วไป
const GeneralInfoSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <Field label="ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า" value={data.fullName} />
    <Field label="โทรศัพท์" value={data.phone} />
    <Field label="ที่อยู่" value={data.address} />
    <View style={{ ...styles.infoRow, marginTop: 5 }}>
      <Checkbox checked={data.hvSystemType === "22kV"} label="ระบบไฟฟ้า 22 kV" />
      <Checkbox checked={data.hvSystemType === "33kV"} label="33 kV" />
      <Field label="โหลดประมาณ" value={`${data.estimatedLoad || "-"} แอมแปร์`} style={{ marginLeft: 20, flexGrow: 1 }} />
    </View>
  </View>
);

// Section: เอกสารรับรองการออกแบบระบบไฟฟ้า
const ElectricalDocSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. การตรวจสอบเอกสารรับรองการออกแบบระบบไฟฟ้า</Text>
    <View style={styles.infoRow}>
      <Checkbox checked={data.hasCertificate} label="มีเอกสารรับรองการออกแบบระบบไฟฟ้า" />
      <Checkbox checked={!data.hasCertificate} label="ไม่มีเอกสารรับรองการออกแบบระบบไฟฟ้า" />
    </View>
    {data.hasCertificate && (
      <View style={{ marginLeft: 16 }}>
        <Text>1. วิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรองในแบบติดตั้งระบบไฟฟ้า (As-built Drawing)</Text>
        <Text>2. สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม</Text>
      </View>
    )}
  </View>
);

// Section: ระบบจำหน่ายแรงสูง (array)
const HVSystemSection = ({ hvOverhead, hvUnderground, hvBreaker, hvOther }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>3. ระบบจำหน่ายแรงสูง</Text>
    <Text style={styles.subTitle}>3.1 ระบบจำหน่ายเหนือดิน</Text>
    {hvOverhead?.map((item, idx) => (
      <View key={idx} style={styles.infoRow}>
        <Field label={item.label} value={item.value} />
        <Checkbox checked={item.status === "ถูกต้อง"} label="ถูกต้อง" />
        <Checkbox checked={item.status === "ต้องแก้ไข"} label="ต้องแก้ไข" />
        {item.note && <Text style={styles.noteValue}>{item.note}</Text>}
      </View>
    ))}
    <Text style={styles.subTitle}>3.2 ระบบจำหน่ายใต้ดิน</Text>
    {hvUnderground?.map((item, idx) => (
      <View key={idx} style={styles.infoRow}>
        <Field label={item.label} value={item.value} />
        <Checkbox checked={item.status === "ถูกต้อง"} label="ถูกต้อง" />
        <Checkbox checked={item.status === "ต้องแก้ไข"} label="ต้องแก้ไข" />
        {item.note && <Text style={styles.noteValue}>{item.note}</Text>}
      </View>
    ))}
    <Text style={styles.subTitle}>3.3 การติดตั้งเครื่องปลดวงจรต้นทาง</Text>
    <View style={styles.infoRow}>
      <Checkbox checked={hvBreaker?.status === "ถูกต้อง"} label="ถูกต้อง" />
      <Checkbox checked={hvBreaker?.status === "ต้องแก้ไข"} label="ต้องแก้ไข" />
      <Checkbox checked={hvBreaker?.type === "dropout"} label="ดรอพเอาท์ฟิวส์คัตเอาท์" />
      <Checkbox checked={hvBreaker?.type === "switch"} label={`สวิตช์ตัดตอน ชนิด${hvBreaker?.switchType || ""}`} />
      <Checkbox checked={hvBreaker?.type === "rmu"} label="RMU" />
      {hvBreaker?.note && <Text style={styles.noteValue}>{hvBreaker.note}</Text>}
    </View>
    <Text style={styles.subTitle}>3.4 อื่นๆ</Text>
    <Text style={styles.noteValue}>{hvOther || "-"}</Text>
  </View>
);

// Section: หม้อแปลง (array, รองรับ schema ใหม่)
const TransformersSection = ({ transformers }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>4. หม้อแปลง</Text>
    {Array.isArray(transformers) && transformers.length > 0 ? (
      transformers.map((tr, idx) => {
        const t = tr.transformerData || {};
        const lv = tr.lvSystem || {};
        return (
          <View key={idx} style={{ marginBottom: 8, paddingLeft: 8 }}>
            <Text style={{ fontWeight: "bold" }}>หม้อแปลงเครื่องที่ {idx + 1}</Text>
            {/* 2.1 คุณสมบัติทั่วไปของหม้อแปลง */}
            <Field label="ขนาด (kVA)" value={t.general?.capacity} />
            <Field label="พิกัดแรงดันด้านแรงสูง (kV)" value={t.general?.hvVoltage} />
            <Field label="พิกัดแรงดันด้านแรงต่ำ (V)" value={t.general?.lvVoltage} />
            <Field label="% Impedance" value={t.general?.impedance} />
            <Field label="ชนิด" value={t.general?.transformerType === "other" ? t.general?.transformerTypeOther : t.general?.transformerType} />
            <Field label="Vector Group" value={t.general?.vectorGroup} />
            <Field label="พิกัดการทนกระแสลัดวงจรสูงสุด (kA)" value={t.general?.shortCircuitCurrent} />
            <Checkbox checked={t.general?.testResult === "ผ่านการทดสอบ"} label="ผ่านการทดสอบ" />
            <Checkbox checked={t.general?.testResult === "ไม่ผ่านการทดสอบ"} label="ไม่ผ่านการทดสอบ" />
            {/* 2.2 ลักษณะการติดตั้ง */}
            <Field label="ลักษณะการติดตั้ง" value={Array.isArray(t.type) ? t.type.join(", ") : ""} />
            {/* 2.3 เครื่องป้องกันกระแสเกิน */}
            <Field label="เครื่องป้องกันกระแสเกิน" value={Array.isArray(t.overcurrentType) ? t.overcurrentType.join(", ") : ""} />
            <Field label="พิกัดกระแสต่อเนื่อง (A)" value={t.overcurrentAmp} />
            <Field label="พิกัดตัดกระแสลัดวงจรสูงสุด (IC, kA)" value={t.overcurrentIc} />
            {/* 2.4 การติดตั้งกับดักเสิร์จแรงสูง */}
            <Field label="พิกัดแรงดัน (kV)" value={t.surgeKV} />
            <Field label="พิกัดกระแส (kA)" value={t.surgeKA} />
            {/* 2.5 การประกอบสายดิน */}
            <Field label="ค่าความต้านทานดิน (โอห์ม)" value={t.groundOhm} />
            {/* 2.7 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน) */}
            <Field label="สารดูดความชื้น" value={t.ext?.silica?.result} />
            <Field label="สภาพบุชชิ่ง" value={t.ext?.bushing?.result} />
            <Field label="ระดับน้ำมัน" value={t.ext?.oilLevel?.result} />
            <Field label="การรั่วซึมของน้ำมันหม้อแปลง" value={t.ext?.leak?.result} />
            {/* 2.8 ป้ายเตือน */}
            <Field label="ป้ายเตือน" value={t.sign?.result} />
            {/* 2.9 อื่นๆ */}
            <Field label="อื่นๆ" value={t.other} />

            {/* --- LV System (แรงต่ำ) --- */}
            <Text style={styles.subTitle}>ระบบจำหน่ายแรงต่ำ (ของหม้อแปลงนี้)</Text>
            {/* 2.14 สายตัวนำประธานแรงต่ำ */}
            <Field label="สายไฟฟ้าเป็นไปตามมาตรฐาน" value={lv.conductorStandard?.["2.14.1"]?.result} />
            <Field label="ชนิดสายไฟ" value={Array.isArray(lv.conductorStandard?.["2.14.2"]?.types) ? lv.conductorStandard["2.14.2"].types.join(", ") : ""} />
            <Field label="ขนาดสายไฟ" value={lv.conductorStandard?.["2.14.2"]?.size} />
            {/* 2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร */}
            <Field label="เครื่องปลดวงจร/ป้องกันกระแสเกิน" value={lv.mainSwitch?.result} />
            {/* ... เพิ่ม field อื่นๆ ตาม schema ... */}
            {/* 2.22 อื่นๆ */}
            <Field label="อื่นๆ (แรงต่ำ)" value={lv.other} />
          </View>
        );
      })
    ) : (
      <Text>-</Text>
    )}
  </View>
);

// Section: ระบบจำหน่ายแรงต่ำ
const LVSystemSection = ({ lvSystem }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>5. ระบบจำหน่ายแรงต่ำ</Text>
    {lvSystem?.map((item, idx) => (
      <View key={idx} style={styles.infoRow}>
        <Field label={item.label} value={item.value} />
        <Checkbox checked={item.status === "ถูกต้อง"} label="ถูกต้อง" />
        <Checkbox checked={item.status === "ต้องแก้ไข"} label="ต้องแก้ไข" />
        {item.note && <Text style={styles.noteValue}>{item.note}</Text>}
      </View>
    ))}
  </View>
);

// Section: สรุปผล/ข้อจำกัด
const SummarySection = ({ summary, limitation }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>6. สรุปผลและข้อจำกัด</Text>
    <Field label="ผลการตรวจสอบ" value={summary} />
    <Field label="ข้อจำกัด" value={limitation} />
  </View>
);

const SignatureSection = ({ userSignature, inspectorSignature }) => (
  <View style={styles.signatureRow} break>
    <View style={styles.signatureBox}>
      {userSignature && <Image style={styles.signatureImage} src={userSignature} />}
      <Text style={styles.signatureName}>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
    </View>
    <View style={styles.signatureBox}>
      {inspectorSignature && <Image style={styles.signatureImage} src={inspectorSignature} />}
      <Text style={styles.signatureName}>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
    </View>
  </View>
);

// Main PDF Document (เพิ่ม break ทุก Section หลัก)
const CondoInspectionPDF = ({ formData }) => {
  // Ensure all required fields are present to avoid undefined errors
  const safeData = {
    general: formData?.general || {},
    documents: formData?.documents || {},
    hvSystem: formData?.hvSystem || {},
    transformers: Array.isArray(formData?.transformers) ? formData.transformers : [],
    summaryType: formData?.summaryType || {},
    limitation: formData?.limitation || "",
    signature: formData?.signature || {},
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <HeaderSection />
        <Text style={styles.formTitle} fixed>
          แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์
        </Text>
        <Text style={styles.formSubtitle} fixed>
          สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน
        </Text>
        <View style={styles.headerInfoRow}>
          <Field label="การตรวจสอบครั้งที่" value={safeData.inspectionNumber} style={{ width: "48%" }} />
          <Field label="วันที่" value={safeData.inspectionDate} style={{ width: "48%" }} />
        </View>
        <View style={styles.headerInfoRow}>
          <Field label="การตรวจสอบตามคำร้องขอใช้ไฟเลขที่" value={safeData.requestNumber} style={{ width: "48%" }} />
          <Field label="วันที่" value={safeData.requestDate} style={{ width: "48%" }} />
        </View>
        <GeneralInfoSection data={safeData.general} break />
        <ElectricalDocSection data={safeData.documents} break />
        <HVSystemSection
          hvOverhead={safeData.hvOverhead}
          hvUnderground={safeData.hvUnderground}
          hvBreaker={safeData.hvBreaker}
          hvOther={safeData.hvOther}
          break
        />
        <TransformersSection transformers={safeData.transformers} break />
        <LVSystemSection lvSystem={safeData.lvSystem} break />
        <SummarySection summary={safeData.summary} limitation={safeData.limitation} break />
        <SignatureSection userSignature={safeData.signature.customerSign} inspectorSignature={safeData.signature.officerSign} break />
        <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => `หน้า ${pageNumber}/${totalPages}`} />
        <Text style={styles.docIdFooter} fixed>
          กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)
        </Text>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 35,
    backgroundColor: "#FFFFFF",
    color: "#000",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 8,
  },
  headerOffice: {
    fontSize: 9,
    textAlign: "right",
  },
  formTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 2,
  },
  formSubtitle: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 8,
  },
  headerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    marginTop: 8,
    marginBottom: 4,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  subTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 2,
    flexWrap: "wrap",
  },
  infoLabel: {
    marginRight: 4,
    flexShrink: 0,
    paddingBottom: 1,
    width: 120,
    fontWeight: "bold",
  },
  infoValue: {
    borderBottom: "0.5px dotted #666",
    flexGrow: 1,
    minHeight: 10,
    paddingLeft: 2,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginTop: 2,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 0.5,
    borderColor: "#000",
    marginRight: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    fontSize: 9,
    transform: "translateY(-1px)",
  },
  noteValue: {
    borderBottom: "0.5px dotted #666",
    flexGrow: 1,
    minHeight: 10,
    marginLeft: 3,
    fontSize: 8,
    paddingLeft: 2,
  },
  signatureRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
    minHeight: 60,
    justifyContent: "flex-end",
  },
  signatureImage: {
    width: 100,
    height: 40,
    alignSelf: "center",
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 10,
    marginTop: 8,
    color: "#333",
    fontWeight: "bold",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 30,
    left: 0,
    right: 35,
    textAlign: "right",
    color: "grey",
  },
  docIdFooter: {
    position: "absolute",
    fontSize: 8,
    bottom: 20,
    left: 35,
    color: "grey",
  },
});

export default CondoInspectionPDF;