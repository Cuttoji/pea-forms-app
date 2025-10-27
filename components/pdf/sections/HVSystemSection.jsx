import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const HVSystemSection = ({ hvSystem, sectionNumber = 3 }) => {
  const mode = hvSystem?.mode;
  const aboveKey = `${sectionNumber}.1`;
  const underKey = `${sectionNumber}.2`;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{sectionNumber}. ระบบจำหน่ายแรงสูง  </Text>
      
      <Text style={styles.subsectionTitle}>{aboveKey} ระบบจำหน่ายเหนือดิน  </Text>
      <View style={styles.hvTable}>
        <View style={styles.hvRow}>
          <View style={styles.hvLeftCol}>
            <Text style={styles.smallText}>
              {aboveKey}.1 ชนิดสายตัวนำ <Text style={styles.underlineDotted}>{hvSystem?.[`${sectionNumber}.1_1`]?.text || "..........................."}</Text> เหมาะสมกับพื้นที่และสภาพแวดล้อม
            </Text>
          </View>
          <View style={styles.hvRightCol}>
            <CheckboxResult 
              result={hvSystem?.[`${sectionNumber}.1_1`]?.result}
              detail={hvSystem?.[`${sectionNumber}.1_1`]?.detail}
            />
          </View>
        </View>

        <View style={[styles.hvRow, styles.borderTop]}>
          <View style={styles.hvLeftCol}>
            <Text style={styles.smallText}>
              {aboveKey}.2 ขนาดสายตัวนำ <Text style={styles.underlineDotted}>{hvSystem?.[`${sectionNumber}.1_2`]?.text || "..........................."}</Text> ตร.มม.
            </Text>
          </View>
          <View style={styles.hvRightCol}>
            <CheckboxResult 
              result={hvSystem?.[`${sectionNumber}.1_2`]?.result}
              detail={hvSystem?.[`${sectionNumber}.1_2`]?.detail}
            />
          </View>
        </View>

        <View style={[styles.hvRow, styles.borderTop]}>
          <View style={styles.hvLeftCol}>
            <Text style={styles.smallText}>{aboveKey}.3 สภาพเสาและระยะห่างระหว่างเสา</Text>
          </View>
          <View style={styles.hvRightCol}>
            <CheckboxResult 
              result={hvSystem?.[`${sectionNumber}.1_3`]?.result}
              detail={hvSystem?.[`${sectionNumber}.1_3`]?.detail}
            />
          </View>
        </View>

        <View style={[styles.hvRow, styles.borderTop]}>
          <View style={styles.hvLeftCol}>
            <Text style={styles.smallText}>{aboveKey}.4 การประกอบอุปกรณ์หัวเสา</Text>
          </View>
          <View style={styles.hvRightCol}>
            <CheckboxResult 
              result={hvSystem?.[`${sectionNumber}.1_4`]?.result}
              detail={hvSystem?.[`${sectionNumber}.1_4`]?.detail}
            />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{aboveKey}.5 การประกอบชุดยึดโยง</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.1_5`]?.result}
            detail={hvSystem?.[`${sectionNumber}.1_5`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{aboveKey}.6 ลูกถ้วยและฉนวนของอุปกรณ์ไฟฟ้าเหมาะสมกับสภาพแวดล้อม</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.1_6`]?.result}
            detail={hvSystem?.[`${sectionNumber}.1_6`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{aboveKey}.7 การพาดสาย (สภาพสาย, ระยะหย่อนยาน)</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.1_7`]?.result}
            detail={hvSystem?.[`${sectionNumber}.1_7`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{aboveKey}.8 ระยะห่างของสายกับอาคาร สิ่งก่อสร้าง หรือต้นไม้</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.1_8`]?.result}
            detail={hvSystem?.[`${sectionNumber}.1_8`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{aboveKey}.9 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.1_9`]?.result}
            detail={hvSystem?.[`${sectionNumber}.1_9`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{aboveKey}.10 สภาพของจุดต่อสาย</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.1_10`]?.result}
            detail={hvSystem?.[`${sectionNumber}.1_10`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{aboveKey}.11 การต่อลงดิน</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.1_11`]?.result}
            detail={hvSystem?.[`${sectionNumber}.1_11`]?.detail}
          />
        </View>
      </View>
    </View>

    <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>{underKey} ระบบจำหน่ายใต้ดิน</Text>
    <View style={styles.hvTable}>
      <View style={styles.hvRow}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>
            {underKey}.1 ชนิดสายตัวนำ <Text style={styles.underlineDotted}>{hvSystem?.[`${sectionNumber}.2_1`]?.text || "..........................."}</Text> เหมาะสมกับพื้นที่และสภาพแวดล้อม
          </Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.2_1`]?.result}
            detail={hvSystem?.[`${sectionNumber}.2_1`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>
            {underKey}.2 ขนาดสายตัวนำ <Text style={styles.underlineDotted}>{hvSystem?.[`${sectionNumber}.2_2`]?.text || "..........................."}</Text> ตร.มม.
          </Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.2_2`]?.result}
            detail={hvSystem?.[`${sectionNumber}.2_2`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{underKey}.3 สภาพสายส่วนที่มองเห็นได้</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.2_3`]?.result}
            detail={hvSystem?.[`${sectionNumber}.2_3`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{underKey}.4 ความตึงของสายช่วงเข้า-ออก อาคารหรือสิ่งก่อสร้าง</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.2_4`]?.result}
            detail={hvSystem?.[`${sectionNumber}.2_4`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{underKey}.5 การติดตั้งกับดักเสิร์จแรงสูง (HV Surge Arrester)</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.2_5`]?.result}
            detail={hvSystem?.[`${sectionNumber}.2_5`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{underKey}.6 สภาพของจุดต่อสาย</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.2_6`]?.result}
            detail={hvSystem?.[`${sectionNumber}.2_6`]?.detail}
          />
        </View>
      </View>

      <View style={[styles.hvRow, styles.borderTop]}>
        <View style={styles.hvLeftCol}>
          <Text style={styles.smallText}>{underKey}.7 การต่อลงดิน</Text>
        </View>
        <View style={styles.hvRightCol}>
          <CheckboxResult 
            result={hvSystem?.[`${sectionNumber}.2_7`]?.result}
            detail={hvSystem?.[`${sectionNumber}.2_7`]?.detail}
          />
        </View>
      </View>
    </View>

    {sectionNumber === 2 && (
      <>
        <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>{sectionNumber}.3 การติดตั้งเครื่องปลดวงจรต้นทาง (ส่วนของผู้ขอใช้ไฟฟ้า)</Text>
        <View style={styles.hvTable}>
          <View style={styles.hvRow}>
            <View style={styles.hvLeftCol}>
              <View style={styles.checkboxLine}>
                <Checkbox checked={hvSystem?.hv33?.type?.includes("dropout")} />
                <Text style={styles.smallText}> ดรอพเอาท์ฟิวส์คัตเอาท์</Text>
              </View>
              
              <View style={styles.checkboxLine}>
                <Checkbox checked={hvSystem?.hv33?.type?.includes("switch")} />
                <Text style={styles.smallText}> 
                  สวิตช์ตัดตอน ชนิด <Text style={styles.underlineDotted}>{hvSystem?.hv33?.switchType || "..........................."}</Text>
                </Text>
              </View>
              
              <View style={styles.checkboxLine}>
                <Checkbox checked={hvSystem?.hv33?.type?.includes("rmu")} />
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
      </>
    )}

    <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>{sectionNumber === 2 ? '2.4' : '3.4'} อื่นๆ</Text>
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
};

export default HVSystemSection;