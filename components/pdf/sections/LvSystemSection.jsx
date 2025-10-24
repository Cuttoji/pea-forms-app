import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";
import PanelBoardSection from "./PanelBoardSection";
import SubCircuitSection from "./SubCircuitSection";

const LvSystemSection = ({ transformer, index, showSectionTitle = true }) => {
  const lvSystem = transformer?.lvSystem || {};
  
  return (
    <View style={{ paddingTop: 4 }}>
      {showSectionTitle && index === 0 && (
        <Text style={styles.sectionTitle}>5. ระบบจำหน่ายแรงต่ำ</Text>
      )}
      <Text style={styles.subsectionTitle}>5.1 วงจรประธานแรงต่ำ (หม้อแปลงที่ {index + 1})</Text>
      
      <View style={styles.lvTable}>
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>5.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.standardMok11 === true} />
              <Text style={styles.smallText}> มอก. 11-2553  </Text>
              <Checkbox checked={lvSystem?.standardMok293 === true} />
              <Text style={styles.smallText}> มอก. 293-2541  </Text>
              <Checkbox checked={lvSystem?.standardIEC60502 === true} />
              <Text style={styles.smallText}> IEC 60502</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.standardCorrect}
              detail={lvSystem?.standardNote}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>5.1.2 ชนิดสายตัวนำ</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.conductorIEC01 === true} />
              <Text style={styles.smallText}> IEC01  </Text>
              <Checkbox checked={lvSystem?.conductorNYY === true} />
              <Text style={styles.smallText}> NYY  </Text>
              <Checkbox checked={lvSystem?.conductorCV === true} />
              <Text style={styles.smallText}> CV  </Text>
              <Checkbox checked={lvSystem?.conductorOther === true} />
              <Text style={styles.smallText}> อื่นๆ <Text style={styles.underlineDotted}>{lvSystem?.conductorOtherText || "........................."}</Text></Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.conductorTypeCorrect}
              detail={lvSystem?.conductorTypeNote}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              5.1.3 ขนาดสายเฟส <Text style={styles.underlineDotted}>{lvSystem?.phaseWireSize || "........................."}</Text> ตร.มม. 
              พิกัดกระแสสายตัวนำประธานต้องไม่น้อยกว่าขนาดปรับตั้งของเมนเซอร์กิตเบรกเกอร์ และสอดคล้องกับขนาดมิเตอร์ตามที่การไฟฟ้าส่วนภูมิภาคกำหนด
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.phaseWireSizeCorrect}
              detail={lvSystem?.phaseWireSizeNote}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              5.1.4 ขนาดสายนิวทรัล <Text style={styles.underlineDotted}>{lvSystem?.neutralWireSize || "........................."}</Text> ตร.มม.
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.neutralWireSizeCorrect}
              detail={lvSystem?.neutralWireSizeNote}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              5.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.phaseIdentificationCorrect}
              detail={lvSystem?.phaseIdentificationNote}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>5.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.cablePathwayCorrect}
              detail={lvSystem?.cablePathwayNote}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>5.1.7 วิธีการเดินสาย</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.wiringOverhead === true} />
              <Text style={styles.smallText}> เดินสายบนลูกถ้วยฉนวนในอากาศ</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.wiringCableTray === true} />
              <Text style={styles.smallText}> เดินบนรางเคเบิล (Cable Tray)</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.wiringDirectBuried === true} />
              <Text style={styles.smallText}> เดินสายฝังดินโดยตรง</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.wiringConduitBuried === true} />
              <Text style={styles.smallText}> เดินสายร้อยท่อฝังดิน</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.wiringConduitWall === true} />
              <Text style={styles.smallText}> เดินร้อยท่อเกาะผนัง</Text>
            </View>
            {lvSystem?.wiringOther && (
              <View style={styles.checkboxLine}>
                <Checkbox checked={lvSystem?.wiringOther === true} />
                <Text style={styles.smallText}> อื่นๆ <Text style={styles.underlineDotted}>{lvSystem?.wiringOtherText || "........................."}</Text></Text>
              </View>
            )}
            {/* แสดงรายละเอียดขนาด */}
            {lvSystem?.wiringCableTray && (
              <Text style={styles.smallText}>
                ขนาดถาดเคเบิล <Text style={styles.underlineDotted}>{lvSystem?.cableTraySize?.width || "......."}</Text> x <Text style={styles.underlineDotted}>{lvSystem?.cableTraySize?.height || "......."}</Text> มม.
              </Text>
            )}
            {lvSystem?.wiringConduitBuried && (
              <Text style={styles.smallText}>
                ขนาดท่อฝังดิน <Text style={styles.underlineDotted}>{lvSystem?.conduitBuriedSize || "............"}</Text> มม.
              </Text>
            )}
            {lvSystem?.wiringConduitWall && (
              <Text style={styles.smallText}>
                ขนาดท่อบนผนัง <Text style={styles.underlineDotted}>{lvSystem?.conduitWallSize || "............"}</Text> มม.
              </Text>
            )}
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.wiringMethodCorrect}
              detail={lvSystem?.wiringMethodNote}
            />
          </View>
        </View>

        {/* 5.1.8 ประเภทท่อร้อยสาย */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>5.1.8 ประเภทท่อร้อยสาย</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.conduitMetalRMC === true} />
              <Text style={styles.smallText}> RMC (Rigid Metal Conduit)  </Text>
              <Checkbox checked={lvSystem?.conduitMetalIMC === true} />
              <Text style={styles.smallText}> IMC (Intermediate Metal Conduit)  </Text>
              <Checkbox checked={lvSystem?.conduitMetalEMT === true} />
              <Text style={styles.smallText}> EMT (Electrical Metallic Tubing)</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.conduitNonMetalRNC === true} />
              <Text style={styles.smallText}> RNC (Rigid Nonmetallic Conduit)  </Text>
              <Checkbox checked={lvSystem?.conduitNonMetalENT === true} />
              <Text style={styles.smallText}> ENT (Electrical Nonmetallic Tubing)  </Text>
              <Checkbox checked={lvSystem?.conduitTypeOther === true} />
              <Text style={styles.smallText}> อื่นๆ <Text style={styles.underlineDotted}>{lvSystem?.conduitTypeOtherText || "........................."}</Text></Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.conduitTypeCorrect}
              detail={lvSystem?.conduitTypeNote}
            />
          </View>
        </View>

        {/* 5.2 เครื่องป้องกันกระแสเกิน */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.subsectionTitle}>5.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์</Text>
            <Text style={styles.smallText}>5.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2</Text>
            <Text style={styles.smallText}>
              5.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด AT <Text style={styles.underlineDotted}>{lvSystem?.mainBreakerSize || "..........................."}</Text> แอมแปร์ (A)
            </Text>
            <Text style={styles.smallText}>
              5.2.3 พิกัดทนกระแสลัดวงจร (Ic) <Text style={styles.underlineDotted}>{lvSystem?.shortCircuitRating || "..........................."}</Text> กิโลแอมแปร์ (kA)
            </Text>
            <Text style={styles.smallText}>5.2.4 การป้องกันการรั่วไหลของกระแสลงดิน</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.mainBreakerStandardCorrect}
              detail={lvSystem?.mainBreakerStandardNote}
            />
            <CheckboxResult 
              result={lvSystem?.mainBreakerSizeCorrect}
              detail={lvSystem?.mainBreakerSizeNote}
            />
            <CheckboxResult 
              result={lvSystem?.shortCircuitRatingCorrect}
              detail={lvSystem?.shortCircuitRatingNote}
            />
            <CheckboxResult 
              result={lvSystem?.groundFaultProtectionCorrect}
              detail={lvSystem?.groundFaultProtectionNote}
            />
          </View>
        </View>

        {/* 5.3 ระบบการต่อลงดิน */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.subsectionTitle}>5.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</Text>
            <Text style={styles.smallText}>
              5.3.1 สายต่อหลักดิน (ตัวนำทองแดง) ขนาด <Text style={styles.underlineDotted}>{lvSystem?.groundWireSize || "..........................."}</Text> ตร.มม.
            </Text>
            <Text style={styles.smallText}>5.3.2 การต่อลงดินที่แผงเมนสวิตช์</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.groundingConfig === "single_phase"} />
              <Text style={styles.smallText}> ระบบ 1 เฟส</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.groundingConfig === "three_phase"} />
              <Text style={styles.smallText}> ระบบ 3 เฟส</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystem?.groundWireSizeCorrect}
              detail={lvSystem?.groundWireSizeNote}
            />
            <CheckboxResult 
              result={lvSystem?.groundingConfigCorrect}
              detail={lvSystem?.groundingConfigNote}
            />
          </View>
        </View>

        {/* 5.4 รูปแบบการต่อลงดิน (เลือกหนึ่งอย่าง) */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.subsectionTitle}>5.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งอย่าง)</Text>
            
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.groundingSystem === "TN-C-S"} />
              <Text style={styles.smallText}> TN-C-S ทั้งระบบ</Text>
              <Checkbox checked={lvSystem?.groundingSystem === "TT"} />
              <Text style={styles.smallText}> TT ทั้งระบบ</Text>
              <Checkbox checked={lvSystem?.groundingSystem === "TT_partial"} />
              <Text style={styles.smallText}> TT บางส่วน</Text>
              <Checkbox checked={lvSystem?.groundingSystem === "TN-S"} />
              <Text style={styles.smallText}> TN-S ทั้งระบบ</Text>
            </View>
            
            <Text style={styles.smallText}>(ดึงมาจากใบ TN-C-S และ ไดอแกรม TT)</Text>
            
            {/* แสดงแผนภาพตามระบบที่เลือก */}
            {lvSystem?.groundingSystem === "TN-C-S" && (
              <View>
                <Text style={styles.smallText}>ก) ดึงแบงเอกสาน 1 เฟส</Text>
                <Text style={styles.smallText}>ที่ต่อลงดิน TN-C-S ทั้งระบบ</Text>
                {/* แผนภาพ TN-C-S จะแสดงที่นี่ */}
              </View>
            )}
            
            {lvSystem?.groundingSystem === "TT" && (
              <View>
                <Text style={styles.smallText}>ข) ดึงแบงเอกสาน 1 เฟส</Text>
                <Text style={styles.smallText}>ที่ต่อลงดิน TT ทั้งระบบ</Text>
                {/* แผนภาพ TT จะแสดงที่นี่ */}
              </View>
            )}
            
            {lvSystem?.groundingSystem === "TT_partial" && (
              <View>
                <Text style={styles.smallText}>ค) ดึงแบงเอกสาน 1 เฟส</Text>
                <Text style={styles.smallText}>ที่ต่อลงดิน TT บางส่วน</Text>
                {/* แผนภาพ TT บางส่วน จะแสดงที่นี่ */}
              </View>
            )}
            
            {lvSystem?.groundingSystem === "TN-S" && (
              <View>
                <Text style={styles.smallText}>ง) ดึงแบงเอกสาน 1 เฟส</Text>
                <Text style={styles.smallText}>ที่ต่อลงดิน TN-S ทั้งระบบ</Text>
                {/* แผนภาพ TN-S จะแสดงที่นี่ */}
              </View>
            )}
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystem?.groundingDiagram?.result === "ถูกต้อง"} />
              <Text style={styles.smallText}> ถูกต้อง</Text>
              <Checkbox checked={lvSystem?.groundingDiagram?.result === "ต้องแก้ไข"} />
              <Text style={styles.smallText}> ต้องแก้ไข</Text>
            </View>
            {lvSystem?.groundingDiagram?.detail && (
              <Text style={styles.smallText}>{lvSystem.groundingDiagram.detail}</Text>
            )}
          </View>
        </View>

        {/* แสดงข้อกำหนดเฉพาะตามระบบที่เลือก */}
        {lvSystem?.groundingSystem === "TN-C-S" && (
          <View style={[styles.tableRow, styles.borderTop]}>
            <View style={styles.leftColumn}>
              <Text style={styles.smallBoldText}>5.4.1 การต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องปฏิบัติตามข้อกำหนดต่อไปนี้)</Text>
              
              {/* แสดงเฉพาะที่เลือก */}
              {lvSystem?.tncsLoadBalance && (
                <View>
                  <View style={styles.checkboxLine}>
                    <Checkbox checked={true} />
                    <Text style={styles.smallText}> มีการจัดโหลดไฟฟ้า 3 เฟส ให้สมดุลอย่างเพียงพอ โดยให้มีโหลดต่างกัน</Text>
                  </View>
                  <Text style={styles.smallText}>
                    ระหว่างเฟสได้ไม่เกิน 20 แอมแปร์ รวมทั้งค่าความต้านทานการต่อลงดินต้อง
                    ไม่เกิน 5 โอห์ม ยกเว้นพื้นที่ที่ยากแก่การต่อลงดิน ยอมให้ค่าความต้านทานของ
                    หลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการวัดแล้วยังมีค่าเกิน ให้ปักหลักดิน
                    เพิ่มอีกตามความเหมาะสม
                  </Text>
                </View>
              )}
              
              {lvSystem?.tncsNeutralProtection && (
                <View>
                  <View style={styles.checkboxLine}>
                    <Checkbox checked={true} />
                    <Text style={styles.smallText}> มีมาตรการป้องกันไม่ให้สายนิวทรัลจากหม้อแปลงไฟฟ้าไปยังบริภัณฑ์</Text>
                  </View>
                  <Text style={styles.smallText}>
                    ประธานชำรุดหรือเสียหาย โดยติดตั้งสายไฟฟ้าในรางเคเบิล บัสเวย์ (หรือบัสดัก)
                    หรือช่องเดินสายเท่านั้น
                  </Text>
                </View>
              )}
              
              {lvSystem?.tncsTouchVoltageProtection && (
                <View>
                  <View style={styles.checkboxLine}>
                    <Checkbox checked={true} />
                    <Text style={styles.smallText}> ติดตั้งอุปกรณ์ป้องกันแรงดันไฟฟ้าสัมผัส (Touch Voltage) ที่โครง</Text>
                  </View>
                  <Text style={styles.smallText}>
                    บริภัณฑ์เทียบกับดินเกิน 70 โวลต์ ซึ่งอุปกรณ์ดังกล่าวใช้สำหรับปลดวงจรการอัด
                    ประจุไฟฟ้า โดยสามารถตัดกระแสไฟฟ้าทุกเส้น รวมถึงสายนิวทรัลและสายดิน
                    ออกพร้อมกันภายในเวลา 5 วินาที
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.checkboxLine}>
                <Checkbox checked={lvSystem?.tncsCorrect === "ถูกต้อง"} />
                <Text style={styles.smallText}> ถูกต้อง</Text>
                <Checkbox checked={lvSystem?.tncsCorrect === "ต้องแก้ไข"} />
                <Text style={styles.smallText}> ต้องแก้ไข</Text>
              </View>
              {lvSystem?.tncsNote && (
                <Text style={styles.smallText}>{lvSystem.tncsNote}</Text>
              )}
            </View>
          </View>
        )}

        {lvSystem?.groundingSystem === "TT" && (
          <View style={[styles.tableRow, styles.borderTop]}>
            <View style={styles.leftColumn}>
              <Text style={styles.smallBoldText}>5.4.2 การต่อลงดินแบบ TT ทั้งระบบ</Text>
              <Text style={styles.smallText}>
                ต้องมีเครื่องตัดไฟรั่ว (RCD) ทุกวงจรบริการ หรืออุปกรณ์ดังกล่าวให้
                ไม่ใช่ลองพื่อปิดตำกันการต่อลงตายงซอแน่ให้ให้ตำบรากขาด
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.checkboxLine}>
                <Checkbox checked={lvSystem?.ttCorrect === "ถูกต้อง"} />
                <Text style={styles.smallText}> ถูกต้อง</Text>
                <Checkbox checked={lvSystem?.ttCorrect === "ต้องแก้ไข"} />
                <Text style={styles.smallText}> ต้องแก้ไข</Text>
              </View>
              {lvSystem?.ttNote && (
                <Text style={styles.smallText}>{lvSystem.ttNote}</Text>
              )}
            </View>
          </View>
        )}

        {lvSystem?.groundingSystem === "TT_partial" && (
          <View style={[styles.tableRow, styles.borderTop]}>
            <View style={styles.leftColumn}>
              <Text style={styles.smallBoldText}>5.4.3 การต่อลงดินแบบ TT บางส่วน (ต้องต่อตามการกรุงศล ก) - จ))</Text>
              <Text style={styles.smallText}>
                ก) มีการสองบล่อการเมื่อครบเสร็จ ใน้ใจการเทพเกยเองมจอมตลิงความว่ามื่น
                ให้ใช้แลเจ๊าตัยลงดิน TN-C-S ก็ใครมาว่างอีกชื่นไหลขณอมูลให้ใข่ จัวออว
                ยวมนึงโ่นทำเขียนลงดิน TT ให้เท่กมอมี ผล่อเจืองเงี่วมอน่อก่วา 2.50
                เมดา อำมาหมใลมาคคมอมข้อซิมิ
              </Text>
              <Text style={styles.smallText}>
                ข) การมอมูเท่าหวาบผมขกราน TN-C-S ก็วามาม TT ต้องทำกับ
                อม่วนยุป 2.00 เมตร
              </Text>
              <Text style={styles.smallText}>ค) อำมิวมอญซิบ เแมงออท่อแวา์มกันเกยว่นของแมง</Text>
              <Text style={styles.smallText}>ง) มีการลงมีการใบแผงให้หน้กมซิษทนารยอแนยให้ใช้มขอบรื่ยำ</Text>
              <Text style={styles.smallText}>
                จ) ทำอส่เล้าวิาแ่านการต่อลงดิน TN-C-S ต่วกจำขคใน่วย 5 โอหม มอดับ
                ทำสูคแการการกอลงดิน แมใว่การวนสำกันการราองสำกันเคมใบไม่เกี่ย ใบนำน
                25 โอห์ม จากการก่อแผนลดึคตานจ่า ให้ใข้แม่ทำและใใใฟอราสารามราคชาขง
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.checkboxLine}>
                <Checkbox checked={lvSystem?.ttPartialCorrect === "ถูกต้อง"} />
                <Text style={styles.smallText}> ถูกต้อง</Text>
                <Checkbox checked={lvSystem?.ttPartialCorrect === "ต้องแก้ไข"} />
                <Text style={styles.smallText}> ต้องแก้ไข</Text>
              </View>
              {lvSystem?.ttPartialNote && (
                <Text style={styles.smallText}>{lvSystem.ttPartialNote}</Text>
              )}
            </View>
          </View>
        )}

        {lvSystem?.groundingSystem === "TN-S" && (
          <View style={[styles.tableRow, styles.borderTop]}>
            <View style={styles.leftColumn}>
              <Text style={styles.smallBoldText}>5.4.1 การต่อลงดินแบบ TN-S ทั้งระบบ</Text>
              <Text style={styles.smallText}>
                ค่าความต้านทานการต่อลงดินไม่เกิน 5 โอห์ม มต่องมีการนำใช้มาตรการ
                ต่อเติม แมแใดาการก่องการราองสำกันเคมใบไม่เกิดลิ่มหอย 25 โอห์ม
                การก่องถาเป็นลึกไซ้กันจุด ให้ใบมอขึ้นผลต่นเนอเก็นก่อการมคนมชาง
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.checkboxLine}>
                <Checkbox checked={lvSystem?.tnsCorrect === "ถูกต้อง"} />
                <Text style={styles.smallText}> ถูกต้อง</Text>
                <Checkbox checked={lvSystem?.tnsCorrect === "ต้องแก้ไข"} />
                <Text style={styles.smallText}> ต้องแก้ไข</Text>
              </View>
              {lvSystem?.tnsNote && (
                <Text style={styles.smallText}>{lvSystem.tnsNote}</Text>
              )}
            </View>
          </View>
        )}

      </View>

      {/* แสดง Panel Board (5.5) ของหม้อแปลงนี้ */}
      <PanelBoardSection 
        panelBoard={transformer?.panel} 
        transformerIndex={index}
      />

      {/* แสดงวงจรย่อย (SubCircuit - 5.6) ของหม้อแปลงนี้ */}
      <SubCircuitSection 
        subCircuits={transformer?.subCircuits} 
        transformerIndex={index}
      />
    </View>
  );
}
export default LvSystemSection;