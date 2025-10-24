import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const LvSystemSectionforLv = ({ lvSystemPEA, panel }) => {
  return (
    <View>
      {/* 3. ระบบไฟฟ้าแรงต่ำ */}
      <Text style={styles.sectionTitle}>3. ระบบไฟฟ้าแรงต่ำ</Text>

      {/* 3.1 วงจรประธานแรงต่ำ */}
      <Text style={styles.subsectionTitle}>3.1 วงจรประธานแรงต่ำ</Text>
      
      <View style={styles.lvTable}>
        {/* 3.1.1 สายตัวนำประธาน */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>3.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.standard === "มอก. 11-2553"} />
              <Text style={styles.smallText}> มอก. 11-2553  </Text>
              <Checkbox checked={lvSystemPEA?.standard === "มอก. 293-2541"} />
              <Text style={styles.smallText}> มอก. 293-2541  </Text>
              <Checkbox checked={lvSystemPEA?.standard === "IEC 60502"} />
              <Text style={styles.smallText}> IEC 60502</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.standardCorrect}
              detail={lvSystemPEA?.standardNote}
            />
          </View>
        </View>

        {/* 3.1.2 ชนิดสายตัวนำ */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>3.1.2 ชนิดสายตัวนำ</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.conductorType === "IEC01"} />
              <Text style={styles.smallText}> IEC01  </Text>
              <Checkbox checked={lvSystemPEA?.conductorType === "NYY"} />
              <Text style={styles.smallText}> NYY  </Text>
              <Checkbox checked={lvSystemPEA?.conductorType === "CV"} />
              <Text style={styles.smallText}> CV  </Text>
              <Checkbox checked={lvSystemPEA?.conductorType === "other"} />
              <Text style={styles.smallText}> อื่นๆ</Text>
              {lvSystemPEA?.otherConductorType && (
                <Text style={styles.smallText}> ({lvSystemPEA.otherConductorType})</Text>
              )}
            </View>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.conductorTypeCorrect}
              detail={lvSystemPEA?.conductorTypeNote}
            />
          </View>
        </View>

        {/* 3.1.3 ขนาดสายเฟส */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              3.1.3 ขนาดสายเฟส <Text style={styles.underlineDotted}>{lvSystemPEA?.phaseWireSize || "............"}</Text> ตร.มม. พิกัดกระแสสายตัวนำประธานต้องไม่น้อยกว่าขนาดปรับตั้งของเซอร์กิตเบรกเกอร์ และสอดคล้องกับขนาดมิเตอร์ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.phaseWireSizeCorrect}
              detail={lvSystemPEA?.phaseWireSizeNote}
            />
          </View>
        </View>

        {/* 3.1.4 ขนาดสายนิวทรัล */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              3.1.4 ขนาดสายนิวทรัล <Text style={styles.underlineDotted}>{lvSystemPEA?.neutralWireSize || "............"}</Text> ตร.มม.
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.neutralWireSizeCorrect}
              detail={lvSystemPEA?.neutralWireSizeNote}
            />
          </View>
        </View>

        {/* 3.1.5 ระบุเฟส */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>3.1.5 ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.phaseIdentificationCorrect}
              detail={lvSystemPEA?.phaseIdentificationNote}
            />
          </View>
        </View>

        {/* 3.1.6 ช่องเดินสาย */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>3.1.6 ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.cablePathwayCorrect}
              detail={lvSystemPEA?.cablePathwayNote}
            />
          </View>
        </View>

        {/* 3.1.7 วิธีการเดินสาย */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>3.1.7 วิธีการเดินสาย</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.wiringMethod === "overhead"} />
              <Text style={styles.smallText}> เดินสายบนลูกถ้วยฉนวนในอากาศ</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.wiringMethod === "cable_tray"} />
              <Text style={styles.smallText}> เดินบนรางเคเบิล (Cable Tray) ขนาด </Text>
              <Text style={styles.underlineDotted}>{lvSystemPEA?.cableTraySize?.width || "...."}</Text>
              <Text style={styles.smallText}> x </Text>
              <Text style={styles.underlineDotted}>{lvSystemPEA?.cableTraySize?.height || "...."}</Text>
              <Text style={styles.smallText}> มม.</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.wiringMethod === "direct_burial"} />
              <Text style={styles.smallText}> เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.wiringMethod === "underground_conduit"} />
              <Text style={styles.smallText}> เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด </Text>
              <Text style={styles.underlineDotted}>{lvSystemPEA?.conduitSize || "...."}</Text>
              <Text style={styles.smallText}> นิ้ว</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.wiringMethod === "wall_conduit"} />
              <Text style={styles.smallText}> เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด </Text>
              <Text style={styles.underlineDotted}>{lvSystemPEA?.conduitSizeWall || "...."}</Text>
              <Text style={styles.smallText}> นิ้ว</Text>
            </View>
            {lvSystemPEA?.otherWiringMethod && (
              <View style={styles.checkboxLine}>
                <Checkbox checked={lvSystemPEA?.wiringMethod === "other"} />
                <Text style={styles.smallText}> อื่นๆ </Text>
                <Text style={styles.underlineDotted}>{lvSystemPEA.otherWiringMethod}</Text>
              </View>
            )}
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.wiringMethodCorrect}
              detail={lvSystemPEA?.wiringMethodNote}
            />
          </View>
        </View>

        {/* 3.1.8 ประเภทท่อร้อยสาย */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>3.1.8 ประเภทท่อร้อยสาย</Text>
            <View style={styles.checkboxLine}>
              <Text style={styles.smallText}>ท่อโลหะ  </Text>
              <Checkbox checked={lvSystemPEA?.conduitType === "RMC"} />
              <Text style={styles.smallText}> หนา (RMC)  </Text>
              <Checkbox checked={lvSystemPEA?.conduitType === "IMC"} />
              <Text style={styles.smallText}> หนาปานกลาง (IMC)  </Text>
              <Checkbox checked={lvSystemPEA?.conduitType === "EMT"} />
              <Text style={styles.smallText}> บาง (EMT)</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Text style={styles.smallText}>ท่ออโลหะ  </Text>
              <Checkbox checked={lvSystemPEA?.conduitType === "RNC"} />
              <Text style={styles.smallText}> แข็ง (RNC)  </Text>
              <Checkbox checked={lvSystemPEA?.conduitType === "ENT"} />
              <Text style={styles.smallText}> อ่อน (ENT)</Text>
            </View>
            {lvSystemPEA?.otherConduitType && (
              <View style={styles.checkboxLine}>
                <Checkbox checked={lvSystemPEA?.conduitType === "other"} />
                <Text style={styles.smallText}> อื่นๆ </Text>
                <Text style={styles.underlineDotted}>{lvSystemPEA.otherConduitType}</Text>
              </View>
            )}
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.conduitTypeCorrect}
              detail={lvSystemPEA?.conduitTypeNote}
            />
          </View>
        </View>
      </View>

      {/* 3.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ */}
      <Text style={styles.subsectionTitle}>3.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (หรือที่แผ่นประธาน)</Text>
      
      <View style={styles.lvTable}>
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>3.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.mainBreakerStandardCorrect}
              detail={lvSystemPEA?.mainBreakerStandardNote}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              3.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด AT <Text style={styles.underlineDotted}>{lvSystemPEA?.mainBreakerSize || "............"}</Text> แอมแปร์ (A) สอดคล้องกับพิกัดกระแสสายตัวนำประธาน
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.mainBreakerSizeCorrect}
              detail={lvSystemPEA?.mainBreakerSizeNote}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              3.2.3 พิกัดทนกระแสลัดวงจร (Ic) <Text style={styles.underlineDotted}>{lvSystemPEA?.shortCircuitRating || "............"}</Text> กิโลแอมแปร์ (kA)
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.shortCircuitRatingCorrect}
              detail={lvSystemPEA?.shortCircuitRatingNote}
            />
          </View>
        </View>
      </View>

      {/* 3.3 ระบบการต่อลงดินที่แผงเมนสวิตช์ */}
      <Text style={styles.subsectionTitle}>3.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</Text>
      
      <View style={styles.lvTable}>
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              3.3.1 สายต่อหลักดิน (ตัวนำทองแดง) ขนาด <Text style={styles.underlineDotted}>{lvSystemPEA?.groundWireSize || "............"}</Text> ตร.มม. สอดคล้องกับขนาดสายตัวนำประธาน ตามตารางที่ 1 ในหน้าที่ 5
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.groundWireSizeCorrect}
              detail={lvSystemPEA?.groundWireSizeNote}
            />
          </View>
        </View>

        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>3.3.2 การต่อลงดินที่แผงเมนสวิตช์</Text>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.groundingConfig === "singlePhase"} />
              <Text style={styles.smallText}> กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีรางตัวต่อดิน (Ground Bus) และต้องต่อสายดินจากวงจรประธาน (Main Conductor) เข้าสู่รางตัวต่อดินเฉพาะเส้นต่ำนั้นของแผงประธาน (Main Circuit Breaker) ตามมีการไฟฟ้าส่วนภูมิภาค กำหนด</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.groundingConfig === "threePhase"} />
              <Text style={styles.smallText}> กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีรางตัวต่อดิน (Ground Bus) และรางตัวต่อนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดินและสายนิวทรัลบริโภค ภายในแผงเมนสวิตช์ ตามที่การไฟฟ้าส่วนภูมิภาค กำหนด</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={lvSystemPEA?.groundingSystemCorrect}
              detail={lvSystemPEA?.groundingSystemNote}
            />
          </View>
        </View>
      </View>

      {/* 3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งอย่าง) */}
      <Text style={styles.subsectionTitle}>3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์ (เลือกหนึ่งอย่าง)</Text>
      
      <View style={styles.lvTable}>
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.groundingSystem === "TN-C-S"} />
              <Text style={styles.smallText}> TN-C-S ทั้งระบบ</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.groundingSystem === "TT"} />
              <Text style={styles.smallText}> TT ทั้งระบบ</Text>
            </View>
            <View style={styles.checkboxLine}>
              <Checkbox checked={lvSystemPEA?.groundingSystem === "TT_partial"} />
              <Text style={styles.smallText}> TT บางส่วน (ดัมพ์จาก TN-C-S และ โหลดเป็น TT)</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            {/* ผลการตรวจสอบจะแสดงในแต่ละหัวข้อย่อยด้านล่าง */}
          </View>
        </View>

        {/* 3.4.1 TN-C-S ทั้งระบบ */}
        {lvSystemPEA?.groundingSystem === "TN-C-S" && (
          <View style={[styles.tableRow, styles.borderTop]}>
            <View style={styles.leftColumn}>
              <Text style={styles.smallBoldText}>3.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ (ต้องปฏิบัติตามภาคผนวก ก - ค )</Text>
              <Text style={styles.smallText}>
                ก) มีการระบุเส้นความเสี่ยงต่อบาร โมมีเอกสารที่บุคครางสมันสิ่งครู่
                บริภัณฑ์ไฟฟ้าอื่นต้องลงส่งแบบ TN-C-S กับทรวะบริมัพชั่วโดยเยนอบุฟไฟฟ้า
                หรือโครงายบอบเหฟที่รีติดลงส่งแบบ TT โหตทีลงคืน หรือมีชุระของห้วางเม็ยอย
                การ 2.50 เมตร ระหว่างส่งจุดภูกมรากฟเอง ที่เองห้วางรโมได้
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <CheckboxResult 
                result={lvSystemPEA?.tncsCorrect}
                detail={lvSystemPEA?.tncsNote}
              />
            </View>
          </View>
        )}

        {/* 3.4.2 TT ทั้งระบบ */}
        {lvSystemPEA?.groundingSystem === "TT" && (
          <View style={[styles.tableRow, styles.borderTop]}>
            <View style={styles.leftColumn}>
              <Text style={styles.smallBoldText}>3.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ ( ต้องตามมาตรพดี้ ก) และ ข) )</Text>
              <Text style={styles.smallText}>
                ก) ติดตั้งเครื่องตัดไฟรั่ว (RCD) ทุกวงจรบริการฟ้าทั้งเป็น หรือภายเหตุ่วตัดไฟฟ้า ไม่ว่า จะเป็นรักษาทนการลิดประจุยนบุรฟไฟฟ้า หรือรีไม่ครอน
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <CheckboxResult 
                result={lvSystemPEA?.ttCorrect}
                detail={lvSystemPEA?.ttNote}
              />
            </View>
          </View>
        )}

        {/* 3.4.3 TT บางส่วน */}
        {lvSystemPEA?.groundingSystem === "TT_partial" && (
          <View style={[styles.tableRow, styles.borderTop]}>
            <View style={styles.leftColumn}>
              <Text style={styles.smallBoldText}>3.4.3 กรณีต่อลงดินแบบ TT บางส่วน</Text>
              <Text style={styles.smallText}>
                (รายละเอียดตามเอกสารแนบ)
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <CheckboxResult 
                result={lvSystemPEA?.ttPartialCorrect}
                detail={lvSystemPEA?.ttPartialNote}
              />
            </View>
          </View>
        )}
      </View>

      {/* 3.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board) - ถ้ามี */}
      {panel?.hasPanelBoard && (
        <>
          <Text style={styles.subsectionTitle}>3.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board) (ถ้ามี)</Text>
          
          <View style={styles.lvTable}>
            {/* 3.5.1 วงจรสายป้อน */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallBoldText}>3.5.1 วงจรสายป้อน</Text>
                <Text style={styles.smallText}>ก) สายป้อนเป็นไปตามมาตรฐาน</Text>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={panel?.standard?.includes("มอก11")} />
                  <Text style={styles.smallText}> มอก. 11-2553  </Text>
                  <Checkbox checked={panel?.standard?.includes("มอก293")} />
                  <Text style={styles.smallText}> มอก. 293-2541  </Text>
                  <Checkbox checked={panel?.standard?.includes("iec60502")} />
                  <Text style={styles.smallText}> IEC 60502</Text>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.standardCheck?.result}
                  detail={panel?.standardCheck?.detail}
                />
              </View>
            </View>

            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallText}>ข) ชนิดสายตัวนำ</Text>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={panel?.wireType?.includes("IEC01")} />
                  <Text style={styles.smallText}> IEC01  </Text>
                  <Checkbox checked={panel?.wireType?.includes("NYY")} />
                  <Text style={styles.smallText}> NYY  </Text>
                  <Checkbox checked={panel?.wireType?.includes("CV")} />
                  <Text style={styles.smallText}> CV  </Text>
                  <Checkbox checked={panel?.wireType?.includes("other")} />
                  <Text style={styles.smallText}> อื่นๆ</Text>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.wireTypeCheck?.result}
                  detail={panel?.wireTypeCheck?.detail}
                />
              </View>
            </View>

            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallText}>
                  ค) ขนาดสายเฟส <Text style={styles.underlineDotted}>{panel?.phaseSize || "............"}</Text> ตร.มม. (พิกัดกระแสสายป้อนต้องไม่น้อยกว่าขนาดปรับตั้งของเซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน และขนาดสายป้อนต้องไม่เล็กกว่า 4 ตร.มม.)
                </Text>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.phaseSizeCheck?.result}
                  detail={panel?.phaseSizeCheck?.detail}
                />
              </View>
            </View>

            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallText}>
                  ง) ขนาดสายนิวทรัล <Text style={styles.underlineDotted}>{panel?.neutralSize || "............"}</Text> ตร.มม.
                </Text>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.neutralSizeCheck?.result}
                  detail={panel?.neutralSizeCheck?.detail}
                />
              </View>
            </View>

            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallText}>
                  จ) ขนาดสายดิน <Text style={styles.underlineDotted}>{panel?.groundSize || "............"}</Text> ตร.มม. สอดคล้องกับขนาดสายตัวนำสายป้องวงจรสายป้อน ตามตารางที่ 1 ในหน้าที่ 5
                </Text>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.groundSizeCheck?.result}
                  detail={panel?.groundSizeCheck?.detail}
                />
              </View>
            </View>

            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallText}>ฉ) ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ</Text>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.phaseColor?.result}
                  detail={panel?.phaseColor?.detail}
                />
              </View>
            </View>

            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallText}>ช) ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ</Text>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.wirewayMechanical?.result}
                  detail={panel?.wirewayMechanical?.detail}
                />
              </View>
            </View>

            {/* 3.5.2 วิธีการเดินสาย */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallBoldText}>3.5.2 วิธีการเดินสาย</Text>
                {/* รายการวิธีการเดินสาย */}
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.methodCheck?.result}
                  detail={panel?.methodCheck?.detail}
                />
              </View>
            </View>

            {/* 3.5.3 ประเภทท่อร้อยสาย */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallBoldText}>3.5.3 ประเภทท่อร้อยสาย</Text>
                {/* รายการประเภทท่อ */}
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.conduitCheck?.result}
                  detail={panel?.conduitCheck?.detail}
                />
              </View>
            </View>

            {/* 3.5.4 ผลตรวจสอบอุปกรณ์ป้องกัน */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallBoldText}>3.5.4 ผลตรวจสอบอุปกรณ์ป้องกันวงจรสายป้อน</Text>
                <Text style={styles.smallText}>
                  ก) เซอร์กิตเบรกเกอร์วงจรสายป้อนเป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2
                </Text>
                <Text style={styles.smallText}>
                  ข) เซอร์กิตเบรกเกอร์วงจรสายป้อนขนาด AT <Text style={styles.underlineDotted}>{panel?.breakerSize || ".........."}</Text> แอมแปร์ (A) ไม่เกินพิกัดกระแสสายป้อน และไม่เกินกว่าโหลดสูงสุดของสายป้อน
                </Text>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.breakerStandard?.result}
                  detail={panel?.breakerStandard?.detail}
                />
                <CheckboxResult 
                  result={panel?.breakerCheck?.result}
                  detail={panel?.breakerCheck?.detail}
                />
              </View>
            </View>

            {/* 3.5.5 การป้องกันและควบคุมวงจรสายป้อน */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallBoldText}>3.5.5 การป้องกันและควบคุมวงจรสายป้อน (Panel board)</Text>
                <Text style={styles.smallText}>ก) ติดตั้งที่ปิดไม่ปิดน้ำและฝุ่นในตำแหน่งที่ปลอดภัย</Text>
                <Text style={styles.smallText}>ข) มีการระบุฉลาก เครื่องหมาย หรือแผ่นป้าย (Ground Bus) และต้องจัดทำสายนิวทรัล (Neutral Bus) ที่แยกจากวงจรย่อย</Text>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={panel?.panelCapacity?.result}
                  detail={panel?.panelCapacity?.detail}
                />
                <CheckboxResult 
                  result={panel?.panelNeutralGround?.result}
                  detail={panel?.panelNeutralGround?.detail}
                />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default LvSystemSectionforLv;
