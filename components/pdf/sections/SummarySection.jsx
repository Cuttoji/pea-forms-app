import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const SummarySection = ({ summaryType, limitation }) => (
  <View style={styles.section} break={false}>
    <Text style={styles.sectionTitle}>6. สรุปผลการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า</Text>
    
    <View style={styles.summaryOptions}>
      <View style={styles.summaryOption}>
        <Checkbox checked={summaryType === "compliant"} />
        <Text style={styles.infoText}>ติดตั้งมิเตอร์ได้ทันที</Text>
      </View>
      <View style={styles.summaryOption}>
        <Checkbox checked={summaryType === "compliant_with_conditions"} />
        <Text style={styles.infoText}>ติดตั้งมิเตอร์ได้ตามเงื่อนไขที่กำหนด</Text>
      </View>
      <View style={styles.summaryOption}>
        <Checkbox checked={summaryType === "non_compliant"} />
        <Text style={styles.infoText}>ต้องปรับปรุงให้ถูกต้องก่อนติดตั้งมิเตอร์</Text>
      </View>
    </View>
    
    <Text style={[styles.sectionTitle, { marginTop: 12 }]}>7. ข้อบกพร่องและข้อจำกัดในการตรวจสอบ</Text>
    <View style={styles.limitationBox}>
      <Text style={styles.smallText}>{limitation || "ไม่มีข้อบกพร่องหรือข้อจำกัด"}</Text>
    </View>
  </View>
);

export default SummarySection;