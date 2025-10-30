import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

/**
 * DocumentSectionCondo - PDF component for Condo Inspection Document Section
 * Handles electricalDocument field: "has" or "none"
 */
const DocumentSectionCondo = ({ documents }) => {
  const hasDocument = documents?.electricalDocument === "has";
  const noDocument = documents?.electricalDocument === "none";

  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>2. การตรวจสอบเอกสาร  </Text>
      
      <View style={styles.lvTable}>
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            {/* มีเอกสาร */}
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Checkbox checked={hasDocument} />
              <Text style={styles.smallText}> มี เอกสารรับรองการออกแบบระบบไฟฟ้า ดังนี้ </Text>
            </View>
            
            {/* รายการเอกสาร - เยื้องซ้าย */}
            <View style={{ marginLeft: 20, marginTop: 4 }}>
              <Text style={styles.smallText}>
                1. วิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง{'\n'}
                   ในแบบติดตั้งระบบไฟฟ้า (As-built Drawing)
              </Text>
              <Text style={[styles.smallText, { marginTop: 4 }]}>
                2. สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรม
              </Text>
            </View>
            
            {/* ไม่มีเอกสาร */}
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <Checkbox checked={noDocument} />
              <Text style={styles.smallText}> ไม่มี เอกสารรับรองการออกแบบระบบไฟฟ้า</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DocumentSectionCondo;
