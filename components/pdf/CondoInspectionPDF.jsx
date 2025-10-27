"use client";
import React from "react";
import { Document, Page, Text, View, Font } from "@react-pdf/renderer";
import { styles } from "./styles/pdfStyles";
import FormHeader from "./sections/FormHeader";
import DocumentSectionCondo from "./sections/DocumentSectionCondo";
import TransformerSection from "./sections/TransformerSection";
import CondoLvSystemSection from "./sections/CondoLvSystemSection";
import HVSystemSection from "./sections/HVSystemSection";
import SignatureSection from "./sections/SignatureSection";
import { Checkbox, CheckboxResult } from "./common/FormElements";

// Register Sarabun font
Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Sarabun-Light.ttf", fontWeight: "light" },
  ],
});


// Section 1: ข้อมูลทั่วไป
const GeneralInfoSection = ({ general }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <View style={styles.lvTable}>
      <View style={[styles.tableRow, styles.borderTop]}>
        <View style={styles.leftColumn}>
          <Text style={styles.smallText}>
            ชื่อ นามสกุลผู้ขอใช้ไฟฟ้า (นาย / นาง / น.ส.) <Text style={styles.underlineDotted}>{general?.applicantName || "......................................................"}</Text> โทรศัพท์ที่ <Text style={styles.underlineDotted}>{general?.phone || "......................................................"}</Text>
          </Text>
          <Text style={styles.smallText}>
            ที่อยู่ <Text style={styles.underlineDotted}>{general?.address || "......................................................................................................................"}</Text>
          </Text>
          <View style={styles.checkboxLine}>
            <Text style={styles.smallText}>ระบบไฟฟ้า  </Text>
            <Checkbox checked={general?.voltageSystem === "22kV"} />
            <Text style={styles.smallText}> 22 kV  </Text>
            <Checkbox checked={general?.voltageSystem === "33kV"} />
            <Text style={styles.smallText}> 33 kV        โหลดประมาณ <Text style={styles.underlineDotted}>{general?.estimatedLoad || "........................"}</Text> แอมแปร์</Text>
          </View>
          <Text style={styles.smallText}>
            ละติจูด: <Text style={styles.underlineDotted}>{general?.latitude || "......................................................"}</Text> ลองจิจูด: <Text style={styles.underlineDotted}>{general?.longitude || "......................................................"}</Text>
          </Text>
          <Text style={styles.smallText}>
            รูปหน้าบ้าน: <Text style={styles.underlineDotted}>{general?.housePhoto || "......................................................"}</Text>
          </Text>
        </View>
      </View>
    </View>
  </View>
);


// Section 3: สรุปผลการตรวจสอบ
const InspectionSummarySection = ({ summaryType }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>3. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</Text>
    <View style={styles.lvTable}>
      <View style={[styles.tableRow, styles.borderTop]}>
        <View style={styles.leftColumn}>
          <View style={styles.checkboxLine}>
            <Checkbox checked={summaryType === "complete"} />
            <Text style={styles.smallText}> ติดตั้งเรียบร้อย</Text>
          </View>
          <View style={styles.checkboxLine}>
            <Checkbox checked={summaryType === "incomplete_minor"} />
            <Text style={styles.smallText}> ติดตั้งไม่เรียบร้อย</Text>
          </View>
          <View style={styles.checkboxLine}>
            <Checkbox checked={summaryType === "incomplete_reject"} />
            <Text style={styles.smallText}> ต้องปรับปรุงเพิ่มเติมตามข้อแนะนำ</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

// Section 4: ข้อบ่งขีดและข้อจำกัด
const LimitationsSection = ({ limitation }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>4. ข้อบ่งขีดและข้อจำกัดในการตรวจสอบ</Text>
    <View style={styles.lvTable}>
      <View style={[styles.tableRow, styles.borderTop]}>
        <View style={styles.leftColumn}>
          <Text style={styles.smallText}>{limitation || "................................................................................................................................................................................................................................................................................................................................................................................................................"}</Text>
        </View>
      </View>
    </View>
  </View>
);


// Main PDF Document
const CondoInspectionPDF = ({ formData }) => {
  const safeData = {
    general: formData?.general || {},
    documents: formData?.documents || {},
    hvSystem: formData?.hvSystem || {},
    transformers: Array.isArray(formData?.transformers) ? formData.transformers : [],
    summaryType: formData?.summary?.summaryType || formData?.summaryType || "",
    limitation: formData?.limitation || "",
    signature: formData?.signature || {},
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.pageHeader} fixed>
          <Text style={styles.pageNumber}>หน้า 1/5</Text>
        </View>

        <FormHeader />
        
        {/* Form Title */}
        <View style={styles.formTitleContainer}>
          <Text style={styles.formMainTitle}>การไฟฟ้า<Text style={styles.underlineDotted}>{safeData.general?.office || "............................................"}</Text></Text>
          <View style={styles.formTitleBox}>
            <Text style={styles.formTitle}>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
            <Text style={styles.formSubtitle}>สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน</Text>
          </View>
          
          <View style={styles.inspectionInfoRow}>
            <Text style={styles.smallText}>
              การตรวจสอบครั้งที่<Text style={styles.underlineDotted}>{safeData.general?.inspectionNumber || "....................."}</Text> วันที่<Text style={styles.underlineDotted}>{safeData.general?.inspectionDate || "..................................."}</Text> การตรวจสอบตามคำร้องขอใช้ไฟเลขที่<Text style={styles.underlineDotted}>{safeData.general?.requestNumber || "..................................."}</Text> วันที่<Text style={styles.underlineDotted}>{safeData.general?.requestDate || "..................................."}</Text>
            </Text>
          </View>
        </View>

        {/* Section 1: ข้อมูลทั่วไป */}
        <GeneralInfoSection general={safeData.general} />

        {/* Section 2: การตรวจสอบเอกสาร */}
        <DocumentSectionCondo documents={safeData.documents} />

        {/* Footer */}
        <Text style={styles.footer} fixed>
          กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)
        </Text>
      </Page>

      {/* Page 2: ระบบจำหน่ายแรงสูง และหม้อแปลง */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader} fixed>
          <Text style={styles.pageNumber}>หน้า 2/5</Text>
        </View>

        {/* HV System Section */}
        <HVSystemSection hvSystem={safeData.hvSystem} sectionNumber={2} />

        <Text style={styles.footer} fixed>
          กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)
        </Text>
      </Page>

      {/* Page 3: หม้อแปลงทั้งหมดในหน้าเดียว - ไม่รวม LV System */}
      {safeData.transformers && safeData.transformers.length > 0 ? (
        <Page size="A4" style={styles.page}>
          <View style={styles.pageHeader} fixed>
            <Text style={styles.pageNumber}>หน้า 3</Text>
          </View>

          <TransformerSection 
            transformers={safeData.transformers} 
            includeLvSystem={false}
          />

          <Text style={styles.footer} fixed>
            กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)
          </Text>
        </Page>
      ) : (
        <Page size="A4" style={styles.page}>
          <View style={styles.pageHeader} fixed>
            <Text style={styles.pageNumber}>หน้า 3</Text>
          </View>

          <TransformerSection 
            transformers={[]} 
            includeLvSystem={false}
          />

          <Text style={styles.footer} fixed>
            กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)
          </Text>
        </Page>
      )}

      {/* Page 4+: LV System แต่ละหม้อแปลงแยกหน้า (Section 2.14-2.22) */}
      {safeData.transformers && safeData.transformers.length > 0 && 
        safeData.transformers.map((transformer, index) => (
          <Page key={`lv-${index}`} size="A4" style={styles.page}>
            <View style={styles.pageHeader} fixed>
              <Text style={styles.pageNumber}>หน้า {4 + index}</Text>
            </View>

            <CondoLvSystemSection
              transformer={transformer} 
              index={index}
              showSectionTitle={index === 0}
              sectionNumber="2"
            />

            <Text style={styles.footer} fixed>
              กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)
            </Text>
          </Page>
        ))
      }

      {/* Page 5: สรุปผล และลายเซ็น */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader} fixed>
          <Text style={styles.pageNumber}>หน้า 5/5</Text>
        </View>

        {/* Section 3: สรุปผล */}
        <InspectionSummarySection summaryType={safeData.summaryType} />

        {/* Section 4: ข้อจำกัด */}
        <LimitationsSection limitation={safeData.limitation} />

        {/* Section 5: สำหรับผู้ขอใช้ไฟฟ้ารับทราบ */}
        <SignatureSection signature={safeData.signature} />

        <Text style={styles.footer} fixed>
          กมฟ.ผมต.-03-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอาคารที่มีผู้ทรงสิทธิ์หลายรายหรืออาคารที่คล้ายคลึงกัน)
        </Text>
      </Page>
    </Document>
  );
};

export default CondoInspectionPDF;