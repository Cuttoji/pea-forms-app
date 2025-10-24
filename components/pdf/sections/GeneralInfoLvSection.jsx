import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const GeneralInfoLvSection = ({ general }) => (
  <View style={styles.generalSection} break={false}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    
    <View style={styles.checkboxLine}>
      <Checkbox checked={general?.userType === "individual"} />
      <Text style={styles.infoText}>
        ชื่อ-นามสกุล ผู้ขอใช้ไฟฟ้า (บุคคลธรรมดา) <Text style={styles.underlineLong}>{general?.customerName || ""}</Text> โทรศัพท์ <Text style={styles.underlineLong}>{general?.phone || ""}</Text>
      </Text>
    </View>
    
    <View style={styles.checkboxLine}>
      <Checkbox checked={general?.userType === "corp"} />
      <Text style={styles.infoText}>
        ชื่อนิติบุคคล ที่ขอใช้ไฟฟ้า <Text style={styles.underlineLong}>{general?.corpName || ""}</Text> โทรศัพท์ <Text style={styles.underlineLong}>{general?.corpPhone || ""}</Text>
      </Text>
    </View>
    
    <Text style={styles.infoText}>
      ที่อยู่ <Text style={styles.underlineLongFull}>{general?.address || ""}</Text>
    </Text>
    
    <View style={styles.systemLine}>
      <Text style={styles.infoText}>ระบบไฟฟ้า </Text>
      <Checkbox checked={general?.systemType === " 3 เฟส (400 / 230 โวลต์)"} />
      <Text style={styles.infoText}> 3 เฟส (400 / 230 โวลต์) </Text>
      <Checkbox checked={general?.systemType === "1 เฟส (230 โวลต์)"} />
      <Text style={styles.infoText}> 1 เฟส (230 โวลต์)</Text>
    </View>
    
    <Text style={styles.infoText}>
      กระแสโหลด (ด้านแรงต่ำ) รวมโดยประมาณ <Text style={styles.underlineLong}>{general?.load || ""}</Text> แอมแปร์ (A)
    </Text>
    
    <Text style={styles.infoText}>
      ติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้ารวม <Text style={styles.underlineLong}>{general?.evChargerCount || ""}</Text> เครื่อง     พิกัดกำลังไฟฟ้ารวมของเครื่องอัดประจุยานยนต์ไฟฟ้าในโครงการนี้ <Text style={styles.underlineLong}>{general?.evChargerPower || ""}</Text> กิโลวัตต์ (kW)
    </Text>
  </View>
);

export default GeneralInfoLvSection;
