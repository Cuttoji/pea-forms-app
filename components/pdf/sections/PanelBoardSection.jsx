import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const PanelBoardSection = ({ panelBoard, transformerIndex = 0 }) => {
  // ถ้าไม่มี panel board หรือไม่ได้เลือกให้แสดง ก็ไม่แสดงอะไร
  if (!panelBoard || !panelBoard.hasPanelBoard) {
    return null;
  }

  return (
    <View>
      <Text style={styles.subsectionTitle}>5.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board) (หม้อแปลงที่ {transformerIndex + 1})</Text>
      
      <View style={styles.lvTable}>
        {/* 5.5.1 วงจรสายป้อน */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallBoldText}>5.5.1 วงจรสายป้อน</Text>
            
            <Text style={styles.smallText}>ก) สายป้อนเป็นไปตามมาตรฐาน</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={panelBoard?.standard?.includes("มอก11")} />
              <Text style={styles.smallText}> มอก. 11-2553  </Text>
              <Checkbox checked={panelBoard?.standard?.includes("มอก293")} />
              <Text style={styles.smallText}> มอก. 293-2541  </Text>
              <Checkbox checked={panelBoard?.standard?.includes("iec60502")} />
              <Text style={styles.smallText}> IEC 60502</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.standardCheck?.result}
              detail={panelBoard?.standardCheck?.detail}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>ข) ชนิดสายตัวนำ</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={panelBoard?.wireType?.includes("IEC01")} />
              <Text style={styles.smallText}> IEC01  </Text>
              <Checkbox checked={panelBoard?.wireType?.includes("NYY")} />
              <Text style={styles.smallText}> NYY  </Text>
              <Checkbox checked={panelBoard?.wireType?.includes("CV")} />
              <Text style={styles.smallText}> CV  </Text>
              <Checkbox checked={panelBoard?.wireType?.includes("other")} />
              <Text style={styles.smallText}> อื่นๆ</Text>
              {panelBoard?.wireType?.includes("other") && panelBoard?.wireTypeOther && (
                <Text style={styles.smallText}> ({panelBoard.wireTypeOther})</Text>
              )}
            </View>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.wireTypeCheck?.result}
              detail={panelBoard?.wireTypeCheck?.detail}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              ค) ขนาดสายเฟส <Text style={styles.underlineDotted}>{panelBoard?.phaseSize || "............"}</Text> ตร.มม. (พิกัดกระแสสายป้อนต้องไม่น้อยกว่าขนาดปรับตั้งของเซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน และขนาดสายป้อนต้องไม่เล็กกว่า 4 ตร.มม.)
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.phaseSizeCheck?.result}
              detail={panelBoard?.phaseSizeCheck?.detail}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              ง) ขนาดสายนิวทรัล <Text style={styles.underlineDotted}>{panelBoard?.neutralSize || "............"}</Text> ตร.มม.
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.neutralSizeCheck?.result}
              detail={panelBoard?.neutralSizeCheck?.detail}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              จ) ขนาดสายดิน <Text style={styles.underlineDotted}>{panelBoard?.groundSize || "............"}</Text> ตร.มม.
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.groundSizeCheck?.result}
              detail={panelBoard?.groundSizeCheck?.detail}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.phaseColor?.result}
              detail={panelBoard?.phaseColor?.detail}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.wirewayMechanical?.result}
              detail={panelBoard?.wirewayMechanical?.detail}
            />
          </View>
        </View>

        {/* 5.5.2 วิธีการเดินสาย */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallBoldText}>5.5.2 วิธีการเดินสาย</Text>
            
            <View style={styles.checkboxLine}>
              <Checkbox checked={panelBoard?.method?.includes("wireway")} />
              <Text style={styles.smallText}> ราง (Wireway) ขนาด </Text>
              <Text style={styles.underlineDotted}>{panelBoard?.wirewayW || "...."}</Text>
              <Text style={styles.smallText}> x </Text>
              <Text style={styles.underlineDotted}>{panelBoard?.wirewayH || "...."}</Text>
              <Text style={styles.smallText}> มม.</Text>
            </View>
            
            <View style={styles.checkboxLine}>
              <Checkbox checked={panelBoard?.method?.includes("cableTray")} />
              <Text style={styles.smallText}> ถาดเคเบิล (Cable Tray) ขนาด </Text>
              <Text style={styles.underlineDotted}>{panelBoard?.cableTrayW || "...."}</Text>
              <Text style={styles.smallText}> x </Text>
              <Text style={styles.underlineDotted}>{panelBoard?.cableTrayH || "...."}</Text>
              <Text style={styles.smallText}> มม.</Text>
            </View>
            
            <View style={styles.checkboxLine}>
              <Checkbox checked={panelBoard?.method?.includes("busway")} />
              <Text style={styles.smallText}> บัสเวย์ (Busway) หรือบัสดัก (Bus duct) ขนาด </Text>
              <Text style={styles.underlineDotted}>{panelBoard?.buswayW || "...."}</Text>
              <Text style={styles.smallText}> x </Text>
              <Text style={styles.underlineDotted}>{panelBoard?.buswayH || "...."}</Text>
              <Text style={styles.smallText}> มม.</Text>
            </View>
            
            <View style={styles.checkboxLine}>
              <Checkbox checked={panelBoard?.method?.includes("conduitWall")} />
              <Text style={styles.smallText}> เดินร้อยท่อเกาะผนัง ขนาดท่อบนผนัง </Text>
              <Text style={styles.underlineDotted}>{panelBoard?.conduitWallSize || "...."}</Text>
              <Text style={styles.smallText}> มม.</Text>
            </View>
            
            <View style={styles.checkboxLine}>
              <Checkbox checked={panelBoard?.method?.includes("conduitBuried")} />
              <Text style={styles.smallText}> เดินร้อยท่อฝังดิน ขนาดท่อฝังดิน </Text>
              <Text style={styles.underlineDotted}>{panelBoard?.conduitBuriedSize || "...."}</Text>
              <Text style={styles.smallText}> มม.</Text>
            </View>
            
            {panelBoard?.method?.includes("other") && (
              <View style={styles.checkboxLine}>
                <Checkbox checked={true} />
                <Text style={styles.smallText}> อื่นๆ </Text>
                <Text style={styles.underlineDotted}>{panelBoard?.methodOther || "........................"}</Text>
              </View>
            )}
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.methodCheck?.result}
              detail={panelBoard?.methodCheck?.detail}
            />
          </View>
        </View>

        {/* 5.5.3 ประเภทท่อร้อยสาย */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallBoldText}>5.5.3 ประเภทท่อร้อยสาย</Text>
            
            <View style={styles.checkboxLine}>
              <Text style={styles.smallText}>ท่อโลหะ  </Text>
              <Checkbox checked={panelBoard?.conduitMetal?.includes("RMC")} />
              <Text style={styles.smallText}> RMC  </Text>
              <Checkbox checked={panelBoard?.conduitMetal?.includes("IMC")} />
              <Text style={styles.smallText}> IMC  </Text>
              <Checkbox checked={panelBoard?.conduitMetal?.includes("EMT")} />
              <Text style={styles.smallText}> EMT</Text>
            </View>
            
            <View style={styles.checkboxLine}>
              <Text style={styles.smallText}>ท่อไม่ใช่โลหะ  </Text>
              <Checkbox checked={panelBoard?.conduitNonMetal?.includes("RNC")} />
              <Text style={styles.smallText}> RNC  </Text>
              <Checkbox checked={panelBoard?.conduitNonMetal?.includes("ENT")} />
              <Text style={styles.smallText}> ENT  </Text>
              <Checkbox checked={panelBoard?.conduitNonMetal?.includes("FlexibleMetal")} />
              <Text style={styles.smallText}> ท่อโลหะอ่อน (Flexible Metal Conduit)</Text>
            </View>
            
            {panelBoard?.conduitOther && (
              <View style={styles.checkboxLine}>
                <Checkbox checked={true} />
                <Text style={styles.smallText}> อื่นๆ </Text>
                <Text style={styles.underlineDotted}>{panelBoard.conduitOther || "........................"}</Text>
              </View>
            )}
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.conduitTypeCheck?.result}
              detail={panelBoard?.conduitTypeCheck?.detail}
            />
          </View>
        </View>

        {/* 5.5.4 ผลตรวจสอบอุปกรณ์ป้องกันวงจรสายป้อน */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallBoldText}>5.5.4 ผลตรวจสอบอุปกรณ์ป้องกันวงจรสายป้อน</Text>
            
            <Text style={styles.smallText}>
              ก) เซอร์กิตเบรกเกอร์วงจรสายป้อนเป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2
            </Text>
            <Text style={styles.smallText}>
              ข) เซอร์กิตเบรกเกอร์วงจรสายป้อนขนาด AT <Text style={styles.underlineDotted}>{panelBoard?.breakerAT || ".........."}</Text> แอมแปร์ (A) (ไม่มีพิกัดกระแสสูงกว่า 63 แอมแปร์ และสอดคล้องกับขนาดสายป้อน)
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.breakerStandardCheck?.result}
              detail={panelBoard?.breakerStandardCheck?.detail}
            />
            <CheckboxResult 
              result={panelBoard?.breakerSizeCheck?.result}
              detail={panelBoard?.breakerSizeCheck?.detail}
            />
          </View>
        </View>

        {/* 5.5.5 การป้องกันและควบคุมวงจรสายป้อน (Panel board) */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallBoldText}>5.5.5 การป้องกันและควบคุมวงจรสายป้อน (Panel board)</Text>
            
            <Text style={styles.smallText}>
              ก) ติดตั้งที่ปิดไม่ปิดน้ำและฝุ่นในตำแหน่งที่ปลอดภัย
            </Text>
            <Text style={styles.smallText}>
              ข) มีการระบุฉลาก เครื่องหมาย หรือแผ่นป้าย (Ground Bus) และต้องจัดทำแผงสำหรับต่อสายดินจากสายกราวด์ (Neutral Bus) ที่แยกจากกัน
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={panelBoard?.panelLocation?.result}
              detail={panelBoard?.panelLocation?.detail}
            />
            <CheckboxResult 
              result={panelBoard?.panelLabel?.result}
              detail={panelBoard?.panelLabel?.detail}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PanelBoardSection;
