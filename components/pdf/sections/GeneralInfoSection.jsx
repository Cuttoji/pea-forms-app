import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const GeneralInfoSection = ({ general }) => (
  <View style={styles.generalSection} break={false}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    
    <View style={styles.checkboxLine}>
      <Checkbox checked={general?.userType === "individual"} />
      <Text style={styles.infoText}>
        ชื่อ-นามสกุล ผู้ขอใช้ไฟฟ้า (บุคคลธรรมดา) <Text style={styles.underlineLong}>{general?.individualName || ""}</Text> โทรศัพท์ <Text style={styles.underlineLong}>{general?.individualPhone || ""}</Text>
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
      <Checkbox checked={general?.systemType === "22kv"} />
      <Text style={styles.infoText}> 22 kV </Text>
      <Checkbox checked={general?.systemType === "33kv"} />
      <Text style={styles.infoText}> 33 kV    กระแสโหลด (ตำแหน่งรับจ่าย) รวมโดยประมาณ <Text style={styles.underlineLong}>{general?.loadCurrent || ""}</Text> แอมแปร์ (A)</Text>
    </View>
    
    <Text style={styles.infoText}>
      ติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้ารวม <Text style={styles.underlineLong}>{general?.chargerCount || ""}</Text> เครื่อง     พิกัดกำลังไฟฟ้ารวมของเครื่องอัดประจุยานยนต์ไฟฟ้าในโครงการนี้ <Text style={styles.underlineLong}>{general?.chargerPower || ""}</Text> กิโลวัตต์ (kW)
    </Text>
  </View>
);

export default GeneralInfoSection;