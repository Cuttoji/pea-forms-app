import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const HVSystemSection = ({ hvSystem }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>3. ระบบจำหน่ายแรงสูง</Text>
    
    <Text style={styles.subsectionTitle}>3.1 ระบบจำหน่ายเหนือดิน</Text>
    <View style={styles.hvTable}>
      <View style={styles.hvRow}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>
            3.1.1 ชนิดสายตัวนำ <Text style={styles.underlineDotted}>{hvSystem?.["3.1_1"]?.text || "..........................."}</Text> เหมาะสมกับพื้นที่และสภาพแวดล้อม
          </Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_1"]?.result}
            detail={hvSystem?.["3.1_1"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>
            3.1.2 ขนาดสายตัวนำ <Text style={styles.underlineDotted}>{hvSystem?.["3.1_2"]?.text || "..........................."}</Text> ตร.มม.
          </Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_2"]?.result}
            detail={hvSystem?.["3.1_2"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.1.3 สภาพเสาและระยะห่างระหว่างเสา</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_3"]?.result}
            detail={hvSystem?.["3.1_3"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.1.4 การประกอบอุปกรณ์หัวเสา</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_4"]?.result}
            detail={hvSystem?.["3.1_4"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.1.5 การประกอบชุดยึดโยง</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_5"]?.result}
            detail={hvSystem?.["3.1_5"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.1.6 ลูกถ้วยและฉนวนของอุปกรณ์ไฟฟ้าเหมาะสมกับสภาพแวดล้อม</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_6"]?.result}
            detail={hvSystem?.["3.1_6"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.1.7 การพาดสาย (สภาพสาย, ระยะหย่อนยาน)</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_7"]?.result}
            detail={hvSystem?.["3.1_7"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.1.8 ระยะห่างของสายกับอาคาร สิ่งก่อสร้าง หรือต้นไม้</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_8"]?.result}
            detail={hvSystem?.["3.1_8"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.1.9 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_9"]?.result}
            detail={hvSystem?.["3.1_9"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.1.10 สภาพของจุดต่อสาย</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_10"]?.result}
            detail={hvSystem?.["3.1_10"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.1.11 การต่อลงดิน</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.1_11"]?.result}
            detail={hvSystem?.["3.1_11"]?.detail}
          />
        </View>
      </View>
    </View>

    <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>3.2 ระบบจำหน่ายใต้ดิน</Text>
    <View style={styles.hvTable}>
      <View style={styles.hvRow}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>
            3.2.1 ชนิดสายตัวนำ <Text style={styles.underlineDotted}>{hvSystem?.["3.2_1"]?.text || "..........................."}</Text> เหมาะสมกับพื้นที่และสภาพแวดล้อม
          </Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.2_1"]?.result}
            detail={hvSystem?.["3.2_1"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>
            3.2.2 ขนาดสายตัวนำ <Text style={styles.underlineDotted}>{hvSystem?.["3.2_2"]?.text || "..........................."}</Text> ตร.มม.
          </Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.2_2"]?.result}
            detail={hvSystem?.["3.2_2"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.2.3 สภาพสายส่วนที่มองเห็นได้</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.2_3"]?.result}
            detail={hvSystem?.["3.2_3"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.2.4 ความตึงของสายช่วงเข้า-ออก อาคารหรือสิ่งก่อสร้าง</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.2_4"]?.result}
            detail={hvSystem?.["3.2_4"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.2.5 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.2_5"]?.result}
            detail={hvSystem?.["3.2_5"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.2.6 สภาพของจุดต่อสาย</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.2_6"]?.result}
            detail={hvSystem?.["3.2_6"]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>3.2.7 การต่อลงดิน</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.["3.2_7"]?.result}
            detail={hvSystem?.["3.2_7"]?.detail}
          />
        </View>
      </View>
    </View>

    <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>3.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)</Text>
    <View style={styles.hvTable}>
      <View style={styles.hvRow}>
        <View style={styles.hvLeftCol}>
          <View style={styles.checkboxLine}>
            <Checkbox checked={hvSystem?.hv33?.type?.includes("ดรอพเอาท์ฟิวส์คัตเอาท์")} />
            <Text style={styles.smallText}> ดรอพเอาท์ฟิวส์คัตเอาท์</Text>
          </View>
          
          <View style={styles.checkboxLine}>
            <Checkbox checked={hvSystem?.hv33?.type?.includes("สวิตช์ตัดตอน")} />
            <Text style={styles.smallText}> 
              สวิตช์ตัดตอน ชนิด <Text style={styles.underlineDotted}>{hvSystem?.hv33?.switchType || "..........................."}</Text>
            </Text>
          </View>
          
          <View style={styles.checkboxLine}>
            <Checkbox checked={hvSystem?.hv33?.type?.includes("RMU")} />
            <Text style={styles.smallText}> RMU (ไม่รวมถึงฟังก์ชั่นการทำงาน)</Text>
          </View>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.hv33?.result}
            detail={hvSystem?.hv33?.detail}
          />
        </View>
      </View>
    </View>

    <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>3.4 อื่นๆ</Text>
    <View style={styles.hvTable}>
      <View style={styles.hvRow}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>
            <Text style={styles.underlineLong}>{hvSystem?.other || "........................................................................................................................................................................................"}</Text>
          </Text>
        </View>
      </View>
    </View>
  </View>
);

export default HVSystemSection;