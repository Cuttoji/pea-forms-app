import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";

const TitleSection = ({ general }) => (
  <View style={styles.titleContainer}>
    <View style={styles.titleBox}>
      <Text style={styles.titleTextBold}>
        แบบฟอร์มตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้าก่อนติดตั้งมิเตอร์
      </Text>
      <Text style={styles.titleTextBold}>
        สำหรับผู้ใช้ไฟฟ้าที่รับไฟฟ้าแรงสูงโดยติดตั้งหม้อแปลงเฉพาะราย 
      </Text>
    </View>
    
    <View style={styles.infoRow}>
      <Text style={styles.infoText}>
        การไฟฟ้า <Text style={styles.underlineLong}>{general?.powerAuthority || "................................................"}</Text> การตรวจสอบครั้งที่ <Text style={styles.underlineLong}>{general?.inspectionNo || ".................."}</Text> วันที่ <Text style={styles.underlineLong}>{general?.inspectionDate || "............................................"}</Text>
      </Text>
    </View>
  </View>
);

export default TitleSection;