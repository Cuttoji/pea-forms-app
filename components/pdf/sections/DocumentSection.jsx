import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const DocumentSection = ({ documents }) => {
  const areaType = documents?.areaType || "personal";
  const isComplete = documents?.isComplete;
  const notCompleteDetail = documents?.notCompleteDetail || "";

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>2. เอกสารประกอบการตรวจสอบการติดตั้งระบบอัดประจุยานยนต์ไฟฟ้า  </Text>
      
      {/* ประเภทพื้นที่ */}
      <View style={[styles.checkboxLine, { marginTop: 8 }]}>
        <Text style={styles.infoText}>ประเภทพื้นที่: </Text>
        <Checkbox checked={areaType === "personal"} />
        <Text style={styles.infoText}> กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่ส่วนบุคคล (เช่น บ้านอยู่อาศัย กิจการขนาดเล็ก หรืออาคารที่คล้ายคลึงกัน) ต้องมีเอกสารประกอบการตรวจสอบดังต่อไปนี้   </Text>
        <Checkbox checked={areaType === "public"} />
        <Text style={styles.infoText}>  กรณีผู้ขอใช้ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าในพื้นที่สาธารณะ (สถานีอัดประจุยานยนต์ไฟฟ้า ห้างสรรพสินค้า โรงแรม อาคารชุด ร้านอาหาร ร้านค้า ร้านสะดวกซื้อ ธุรกิจให้เช่าที่จอดรถ ถนนสาธารณะ หรืออาคารที่คล้ายคลึงกัน) ต้องมีเอกสารประกอบการตรวจสอบ ดังต่อไปนี้ </Text>
      </View>

      {areaType === "personal" && (
        <View style={styles.documentTable}>
          <View style={styles.tableRow}>
            <View style={styles.leftColumn}>
              <View style={styles.docItem}>
                <Checkbox checked={documents?.spec === true} />
                <Text style={styles.smallText}>
                  สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า{'\n'}
                  ที่แสดงรายละเอียดข้อมูลทั่วไปและอุปกรณ์ป้องกันต่างๆ
                </Text>
              </View>
              <View style={styles.docItem}>
                <Checkbox checked={documents?.singleLine === true} />
                <Text style={styles.smallText}>แผนผังระบบไฟฟ้า (Single Line Diagram) </Text>
              </View>
              <View style={styles.docItem}>
                <Checkbox checked={documents?.loadSchedule === true} />
                <Text style={styles.smallText}>ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า </Text>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.approvalItem}>
                <Checkbox checked={isComplete === "ครบถ้วน"} />
                <Text style={styles.smallText}> ครบถ้วน</Text>
              </View>
              <View style={styles.approvalItem}>
                <Checkbox checked={isComplete === "ไม่ครบถ้วน"} />
                <Text style={styles.smallText}> ไม่ครบถ้วน</Text>
              </View>
              {isComplete === "ไม่ครบถ้วน" && notCompleteDetail && (
                <Text style={[styles.smallText, { marginTop: 4 }]}>
                  ระบุ: {notCompleteDetail}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {areaType === "public" && (
        <View style={styles.documentTable}>
          <View style={styles.tableRow}>
            <View style={styles.leftColumn}>
              <View style={styles.docItem}>
                <Checkbox checked={documents?.singleLine === true} />
                <Text style={styles.smallText}>
                  แผนผังระบบไฟฟ้า (Single Line Diagram) ระบุพิกัดของอุปกรณ์ต่างๆ{'\n'}
                  วิธีการเดินสาย รายละเอียดท่อร้อยสาย รวมถึงระบบต่อลงดิน อย่างครบถ้วน{'\n'}
                  โดยมีวิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง
                </Text>
              </View>
              <View style={styles.docItem}>
                <Checkbox checked={documents?.asBuilt === true} />
                <Text style={styles.smallText}>
                  แบบติดตั้งระบบไฟฟ้า (As-built Drawing) ที่มีวิศวกรที่ได้รับใบอนุญาต{'\n'}
                  ประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง
                </Text>
              </View>
              <View style={styles.docItem}>
                <Checkbox checked={documents?.loadSchedule === true} />
                <Text style={styles.smallText}>
                  ตารางโหลด (Load Schedule) และรายการคำนวณทางไฟฟ้า{'\n'}
                  ที่มีวิศวกรที่ได้รับใบอนุญาตประกอบวิชาชีพจากสภาวิศวกรลงนามรับรอง
                </Text>
              </View>
              <View style={styles.docItem}>
                <Checkbox checked={documents?.licenceCopy === true} />
                <Text style={styles.smallText}>
                  สำเนาใบอนุญาตการประกอบวิชาชีพวิศวกรรมไฟฟ้า
                </Text>
              </View>
              <View style={styles.docItem}>
                <Checkbox checked={documents?.spec === true} />
                <Text style={styles.smallText}>
                  สเปคอุปกรณ์ (Specification) หรือ Data Sheet ของเครื่องอัดประจุยานยนต์ไฟฟ้า{'\n'}
                  ที่แสดงรายละเอียดข้อมูลทั่วไปและอุปกรณ์ป้องกันต่างๆ
                </Text>
              </View>
              <View style={styles.docItem}>
                <Checkbox checked={documents?.peaLicence === true} />
                <Text style={styles.smallText}>
                  หนังสือจดแจ้ง (พิกัดน้อยกว่า 1,000 kVA) หรือใบอนุญาต (พิกัดตั้งแต่ 1,000 kVA ขึ้นไป){'\n'}
                  เพื่อประกอบกิจการสถานีอัดประจุยานยนต์ไฟฟ้าจากสำนักงานกำกับกิจการพลังงาน (สกพ.)
                </Text>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.approvalItem}>
                <Checkbox checked={isComplete === "ครบถ้วน"} />
                <Text style={styles.smallText}> ครบถ้วน</Text>
              </View>
              <View style={styles.approvalItem}>
                <Checkbox checked={isComplete === "ไม่ครบถ้วน"} />
                <Text style={styles.smallText}> ไม่ครบถ้วน</Text>
              </View>
              {isComplete === "ไม่ครบถ้วน" && notCompleteDetail && (
                <Text style={[styles.smallText, { marginTop: 4 }]}>
                  ระบุ: {notCompleteDetail}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DocumentSection;