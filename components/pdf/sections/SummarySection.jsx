import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const SummarySection = ({ summary, limitation }) => (
  <View style={styles.section} break={false}>
    <Text style={styles.sectionTitle}>6. สรุปผลการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า </Text>

    <View
      style={[
        styles.summaryOptions,
        { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
      ]}
    >
      <View style={[styles.summaryOption, { flexDirection: "row", alignItems: "center", flex: 1 }]}>
        <Checkbox checked={summary?.summaryType === "compliant"} />
        <Text style={[styles.infoText, { marginLeft: 6 }]}>ติดตั้งมิเตอร์ถาวร</Text>
      </View>

      <View style={[styles.summaryOption, { flexDirection: "row", alignItems: "center", flex: 1 }]}>
        <Checkbox checked={summary?.summaryType === "compliant_with_conditions"} />
        <Text style={[styles.infoText, { marginLeft: 6 }]}>ติดตั้งมิเตอร์ชั่วคราว</Text>
      </View>

      <View style={[styles.summaryOption, { flexDirection: "row", alignItems: "center", flex: 1 }]}>
        <Checkbox checked={summary?.summaryType === "non_compliant"} />
        <Text style={[styles.infoText, { marginLeft: 6 }]}>ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์</Text>
      </View>
    </View>

    <Text style={[styles.sectionTitle, { marginTop: 12 }]}>7. ขอบเขตและข้อจำกัดในการตรวจสอบ  </Text>
    <View style={styles.limitationBox}>
      <Text style={styles.smallText}>{limitation || "ไม่มีข้อบกพร่องหรือข้อจำกัด"}</Text>
    </View>
  </View>
);

export default SummarySection;