import React from "react";
import {

Document,
Page,
Text,
View,
StyleSheet,
Font,
} from "@react-pdf/renderer";

// โหลดฟอนต์ Sarabun (Google Fonts)
Font.register({
family: "Sarabun",
src: "/fonts/Sarabun-Regular.ttf"
});

Font.register({
family: "Sarabun",
src: "/fonts/Sarabun-Bold.ttf",
fontWeight: "bold",
});

// สไตล์
const styles = StyleSheet.create({
page: {
  fontFamily: "Sarabun",
  fontSize: 12,
  padding: 32,
  lineHeight: 1.5,
  backgroundColor: "#fff",
},
section: {
  marginBottom: 16,
},
header: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 8,
  textAlign: "center",
},
subHeader: {
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 6,
  marginTop: 12,
  color: "#222",
},
label: {
  fontWeight: "bold",
  marginRight: 6,
},
row: {
  flexDirection: "row",
  marginBottom: 4,
  alignItems: "flex-start",
},
table: {
  display: "table",
  width: "auto",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#222",
  marginBottom: 8,
},
tableRow: {
  flexDirection: "row",
},
tableColHeader: {
  width: "33%",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#222",
  backgroundColor: "#eee",
  padding: 4,
  fontWeight: "bold",
},
tableCol: {
  width: "33%",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#222",
  padding: 4,
},
signatureBox: {
  border: "1 solid #222",
  padding: 16,
  marginTop: 24,
  alignItems: "center",
  minHeight: 80,
},
signatureLabel: {
  marginTop: 8,
  fontSize: 12,
},
noteBox: {
  border: "1 solid #aaa",
  padding: 12,
  marginTop: 16,
  minHeight: 60,
},
});

// Helper: แสดงค่าหรือ "-"
const renderValue = (value) => {
if (value === null || value === undefined || value === "") return "-";
if (Array.isArray(value)) {
  if (value.length === 0) return "-";
  return (
    <View>
      {value.map((item, idx) => (
        <View key={idx} style={{ marginBottom: 2 }}>
          {typeof item === "object" ? renderObject(item) : <Text>{item}</Text>}
        </View>
      ))}
    </View>
  );
}
if (typeof value === "object") {
  return renderObject(value);
}
return <Text>{value}</Text>;
};

// Helper: แสดง object ซ้อน
const renderObject = (obj) => {
if (!obj || typeof obj !== "object") return <Text>-</Text>;
return (
  <View style={{ marginLeft: 8 }}>
    {Object.entries(obj).map(([key, val], idx) => (
      <View style={styles.row} key={idx}>
        <Text style={styles.label}>{key}:</Text>
        {renderValue(val)}
      </View>
    ))}
  </View>
);
};

// Helper: แสดงตารางข้อมูล array ของ object
const renderTable = (data) => {
if (!Array.isArray(data) || data.length === 0) return <Text>-</Text>;
const columns = Object.keys(data[0] || {});
return (
  <View style={styles.table}>
    <View style={styles.tableRow}>
      {columns.map((col, idx) => (
        <Text style={styles.tableColHeader} key={idx}>
          {col}
        </Text>
      ))}
    </View>
    {data.map((row, idx) => (
      <View style={styles.tableRow} key={idx}>
        {columns.map((col, cidx) => (
          <Text style={styles.tableCol} key={cidx}>
            {row[col] !== undefined && row[col] !== null && row[col] !== ""
              ? String(row[col])
              : "-"}
          </Text>
        ))}
      </View>
    ))}
  </View>
);
};

// Main Component
const HomeInspectionPDF = ({ formData = {} }) => {
// แยก section
const {
  general = {},
  inspection = {},
  summary = {},
  limitation = {},
  signature = {},
} = formData;

// Helper: render fields
const renderFields = (data) =>
  Object.entries(data).map(([key, value], idx) => (
    <View style={styles.row} key={idx}>
      <Text style={styles.label}>{key}:</Text>
      {Array.isArray(value) && value.length > 0 && typeof value[0] === "object"
        ? renderTable(value)
        : renderValue(value)}
    </View>
  ));

return (
  <Document>
    {/* หน้าแรก: หัวข้อและข้อมูลทั่วไป */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>รายงานการตรวจสอบบ้าน</Text>
      <Text style={styles.subHeader}>ข้อมูลทั่วไป</Text>
      {renderFields(general)}
    </Page>

    {/* หน้าถัดไป: รายละเอียดการตรวจสอบ, สรุป, ข้อจำกัด */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.subHeader}>รายละเอียดการตรวจสอบ</Text>
      {renderFields(inspection)}

      <Text style={styles.subHeader}>สรุปผลการตรวจสอบ</Text>
      {renderFields(summary)}

      <Text style={styles.subHeader}>ข้อจำกัดในการตรวจสอบ</Text>
      {renderFields(limitation)}
    </Page>

    {/* หน้าสุดท้าย: ลายเซ็นและหมายเหตุ */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.subHeader}>ลายเซ็น</Text>
      <View style={styles.signatureBox}>
        {signature.signatureImage ? (
          <Image
            src={signature.signatureImage}
            style={{ width: 120, height: 60 }}
          />
        ) : (
          <Text>.............................................</Text>
        )}
        <Text style={styles.signatureLabel}>
          {signature.name || "-"}
        </Text>
        <Text style={styles.signatureLabel}>
          วันที่: {signature.date || "-"}
        </Text>
      </View>
      <Text style={styles.subHeader}>หมายเหตุ</Text>
      <View style={styles.noteBox}>
        <Text>{signature.note || "-"}</Text>
      </View>
    </Page>
  </Document>
);
};

export default HomeInspectionPDF;