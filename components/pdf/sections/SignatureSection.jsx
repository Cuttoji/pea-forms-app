import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";

const SignatureSection = ({ signature }) => {
  console.log("=== SignatureSection Debug ===");
  console.log("signature data:", signature);
  console.log("customerSign:", signature?.customerSign ? "มีข้อมูล" : "ไม่มีข้อมูล");
  console.log("officerSign:", signature?.officerSign ? "มีข้อมูล" : "ไม่มีข้อมูล");
  
  return (
    <View style={styles.signatureSection}>
      <Text style={styles.sectionTitle}>8. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</Text>
      
      <Text style={styles.smallText}>
        8.1 งานเดินสายและติดตั้งอุปกรณ์ไฟฟ้าสำหรับระบบอัดประจุยานยนต์ไฟฟ้าที่รับไฟฟ้าจากหม้อแปลงเฉพาะราย เป็นความรับผิดชอบของผู้ขอใช้ไฟฟ้าแต่ผู้เดียว
      </Text>
      
      <View style={styles.signatureRow}>
        <View style={styles.signatureBox}>
          {signature?.customerSign && (
            <Image 
              src={signature.customerSign} 
              style={styles.signatureImage}
            />
          )}
          <Text style={styles.signatureLabel}>
            ลงชื่อ.............................................ผู้ขอใช้ไฟฟ้าหรือผู้แทน
          </Text>
        </View>
        
        <View style={styles.signatureBox}>
          {signature?.officerSign && (
            <Image 
              src={signature.officerSign} 
              style={styles.signatureImage}
            />
          )}
          <Text style={styles.signatureLabel}>
            ลงชื่อ.............................................เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค
          </Text>
        </View>
      </View>

      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationTitle}>ข้อแนะนำ</Text>
        <Text style={styles.recommendationText}>
          1. ควรติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดพิกัดกระแสรั่ว (IΔn) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง เช่น บริเวณที่เป็นหย่อมชื้น ห้องน้ำ ห้องอาบน้ำ ห้องครัว ห้องใต้ถุน อ่างล้างมือ วงจรไฟฟ้าภายนอกอาคาร รวมทั้งวงจรย่อยสำหรับเครื่องทำน้ำอุ่น/อ่างอาบน้ำ
        </Text>
        <Text style={styles.recommendationText}>
          2. ควรติดตั้งสายดินกับบริภัณฑ์ไฟฟ้าเพื่อความปลอดภัย ในกรณีเกิดไฟฟ้ารั่ว หรือไฟฟ้าลัดวงจร
        </Text>
        <Text style={styles.recommendationText}>
          3. ควรติดตั้งระบบไฟฟ้าโดยช่างที่ได้รับหนังสือรับรองการผ่านทดสอบ มาตรฐานฝีมือแรงงานแห่งชาติ จากกรมพัฒนาฝีมือแรงงาน
        </Text>
      </View>
    </View>
  );
};

export default SignatureSection;