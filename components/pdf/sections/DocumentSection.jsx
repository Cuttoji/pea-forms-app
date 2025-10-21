import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const DocumentSection = ({ documents }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. เอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า</Text>
    
    <Text style={styles.subsectionText}>
      2.1 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบเติมประจุยานยนต์ไฟฟ้าในที่พักที่อาศัยบุคคล 
    </Text>
    
    <View style={styles.documentTable}>
      <View style={styles.tableRow}>
        <View style={styles.leftColumn}>
          <View style={styles.docItem}>
            <Checkbox checked={documents?.residential?.hasSpecification === true} />
            <Text style={styles.smallText}>
              รายละเอียดของผู้ผลิต (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า
            </Text>
          </View>
        </View>
        
        <View style={styles.rightColumn}>
          <View style={styles.approvalItem}>
            <Checkbox checked={documents?.residential?.completeness === "ครบถ้วน"} />
            <Text style={styles.smallText}> ครบถ้วน</Text>
          </View>
          <View style={styles.approvalItem}>
            <Checkbox checked={documents?.residential?.completeness === "ไม่ครบถ้วน"} />
            <Text style={styles.smallText}> ไม่ครบถ้วน</Text>
          </View>
        </View>
      </View>
    </View>

    <Text style={[styles.subsectionText, { marginTop: 8 }]}>
      2.2 กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบเติมประจุยานยนต์ไฟฟ้าในที่สาธารณะ (สถานีปั๊มประจุยานยนต์ไฟฟ้า ห้างสรรพสินค้า โรงแรม อาคารสำนักงาน
      ร้านอาหาร ร้านค้า ร้านสะดวกซื้อ ธุรกิจให้เช่าที่จอดรถ ถนนสาธารณะ หรืออาคารที่คล้ายคลึงกัน) ต้องมีเอกสารประกอบการตรวจสอบ
      ดังต่อไปนี้
    </Text>

    <View style={styles.documentTable}>
      <View style={styles.tableRow}>
        <View style={styles.leftColumn}>
          <View style={styles.docItem}>
            <Checkbox checked={documents?.commercial?.hasSingleLineDiagram === true} />
            <Text style={styles.smallText}>
              แผนผังระบบไฟฟ้า (Single Line Diagram) ระบุที่ตั้งอุปกรณ์อย่าง{'\n'}
              ชัดเจนครบถ้วน โดยมีวิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพทาง{'\n'}
              วิศวกรรมไฟฟ้าลงนาม
            </Text>
          </View>
          <View style={styles.docItem}>
            <Checkbox checked={documents?.commercial?.hasAsBuiltDrawing === true} />
            <Text style={styles.smallText}>
              แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่มีวิศวกรที่ได้รับใบอนุญาต{'\n'}
              ประกอบวิชาชีพทางวิศวกรรมไฟฟ้าลงนาม
            </Text>
          </View>
          <View style={styles.docItem}>
            <Checkbox checked={documents?.commercial?.hasLoadSchedule === true} />
            <Text style={styles.smallText}>
              ตารางโหลด (Load Schedule) และรายงานการคำนวณทางไฟฟ้า ที่มี{'\n'}
              วิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพทางวิศวกรรมไฟฟ้าลงนาม
            </Text>
          </View>
          <View style={styles.docItem}>
            <Checkbox checked={documents?.commercial?.hasEngineerLicense === true} />
            <Text style={styles.smallText}>สำเนาใบอนุญาตประกอบวิชาชีพวิศวกรรมไฟฟ้า</Text>
          </View>
          <View style={styles.docItem}>
            <Checkbox checked={documents?.commercial?.hasSpecification === true} />
            <Text style={styles.smallText}>
              รายละเอียดของผู้ผลิต (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า
            </Text>
          </View>
          <View style={styles.docItem}>
            <Checkbox checked={documents?.commercial?.hasPermit === true} />
            <Text style={styles.smallText}>
              ใบรับแจ้ง (กำลังไฟฟ้าไม่เกิน 1,000 kVA) หรือใบอนุญาต (กำลังไฟฟ้า{'\n'}
              1,000 kVA ขึ้นไป) เพื่อประกอบกิจการประจุยานยนต์ไฟฟ้าจาก{'\n'}
              กรมพัฒนาพลังงานทดแทนและอนุรักษ์พลังงาน (พพ.)
            </Text>
          </View>
        </View>
        
        <View style={styles.rightColumn}>
          <View style={styles.approvalItem}>
            <Checkbox checked={documents?.commercial?.completeness === "ครบถ้วน"} />
            <Text style={styles.smallText}> ครบถ้วน</Text>
          </View>
          <View style={styles.approvalItem}>
            <Checkbox checked={documents?.commercial?.completeness === "ไม่ครบถ้วน"} />
            <Text style={styles.smallText}> ไม่ครบถ้วน ระบุ</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

export default DocumentSection;