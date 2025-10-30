import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult, Radio } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";
import LvSystemSection from "./LvSystemSection";

const TransformerSection = ({ transformers, includeLvSystem = false, sectionPrefix = "5" }) => {
  if (!transformers || transformers.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. หม้อแปลง</Text>
        <Text style={styles.smallText}>ไม่มีข้อมูลหม้อแปลง</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>4. หม้อแปลง</Text>
      
      {transformers.map((transformer, index) => {
        // อ่านข้อมูลจาก transformerData
        const transformerData = transformer?.transformerData || {};
        const general = transformerData?.general || {};
        
        return (
          <View key={index} style={styles.transformerWrapper}>
            {/* แสดงหม้อแปลงทุกตัว - แต่ละส่วนสามารถขึ้นหน้าใหม่ได้ */}
            
            {/* ขึ้นหน้าใหม่สำหรับหม้อแปลงแต่ละตัว ยกเว้นตัวแรก */}
            {index > 0 && <View break />}
            
            <View style={styles.transformerSection}>
              <Text style={styles.subsectionTitle}>หม้อแปลงที่ {index + 1}</Text>
              
              {/* 4.1 คุณสมบัติทั่วไปของหม้อแปลง */}
              <View style={styles.transformerTable}>
                {/* Header แบ่ง 2 ส่วน: ซ้าย-ขวา */}
                <View style={styles.transformerRow}>
                  <View style={styles.transformerLeftCol}>
                    <Text style={styles.smallBoldText}>4.1 คุณสมบัติทั่วไปของหม้อแปลง</Text>
                  </View>
                  <View style={styles.transformerRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={general?.testResult === "ผ่านการทดสอบ"} />
                      <Text style={styles.smallText}> ผ่านการทดสอบ</Text>
                    </View>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={general?.testResult === "ไม่ผ่านการทดสอบ"} />
                      <Text style={styles.smallText}> ไม่ผ่านการทดสอบ</Text>
                    </View>
                  </View>
                </View>
                
                {/* ข้อมูลรายละเอียด แบ่ง 2 ส่วน */}
                <View style={styles.transformerRow}>
                  <View style={styles.transformerLeftCol}>
                    <Text style={styles.smallText}>
                      ขนาด <Text style={styles.underlineDotted}>{general?.capacity || ""}</Text> kVA
                    </Text>
                    <Text style={styles.smallText}>
                      พิกัดแรงดันด้านแรงสูง <Text style={styles.underlineDotted}>{general?.hvVoltage || ""}</Text> kV พิกัดแรงดันด้านแรงต่ำ <Text style={styles.underlineDotted}>{general?.lvVoltage || ""}</Text> V
                    </Text>
                    <Text style={styles.smallText}>
                      % Impedance <Text style={styles.underlineDotted}>{general?.impedance || ""}</Text> Vector Group <Text style={styles.underlineDotted}>{general?.vectorGroup || ""}</Text>
                    </Text>
                    <View style={styles.checkboxLine}>
                      <Text style={styles.smallText}>ชนิด </Text>
                      <Checkbox checked={general?.transformerType === "Oil"} />
                      <Text style={styles.smallText}> Oil </Text>
                      <Checkbox checked={general?.transformerType === "Dry"} />
                      <Text style={styles.smallText}> Dry </Text>
                      <Checkbox checked={general?.transformerType === "อื่นๆ"} />
                      <Text style={styles.smallText}> อื่นๆ</Text>
                      <Text style={styles.underlineDotted}>
                        {general?.transformerTypeOther || ""}
                      </Text>
                    </View>
                    <Text style={styles.smallText}>
                      พิกัดการทนกระแสลัดวงจรสูงสุด  <Text style={styles.underlineDotted}>{general?.shortCircuitCurrent || ""}</Text> kA
                    </Text>
                  </View>
                  <View style={styles.transformerRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={general?.correct?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                    </View>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={general?.correct?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {general?.correct?.detail && (
                      <Text style={[styles.smallText, { marginTop: 4 }]}>
                        {general.correct.detail}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              {/* 4.2 ลักษณะการติดตั้ง */}
              <View style={styles.hvTable}>
                <View style={styles.hvRow}>
                  <View style={styles.hvLeftCol}>
                    <Text style={styles.smallBoldText}>4.2 ลักษณะการติดตั้ง</Text>
                    <View style={styles.checkboxContainer}>
                      <View style={styles.checkboxLine}>
                        <Checkbox checked={
                          Array.isArray(transformerData?.type) 
                            ? transformerData?.type?.includes("แขวน")
                            : false
                        } />
                        <Text style={styles.smallText}> แขวน</Text>
                        <Checkbox checked={
                          Array.isArray(transformerData?.type) 
                            ? transformerData?.type?.includes("นั่งร้าน")
                            : false
                        } />
                        <Text style={styles.smallText}> นั่งร้าน</Text>
                        <Checkbox checked={
                          Array.isArray(transformerData?.type) 
                            ? transformerData?.type?.includes("ตั้งพื้น")
                            : false
                        } />
                        <Text style={styles.smallText}> ตั้งพื้น</Text>
                      </View>
                      <View style={styles.checkboxLine}>
                        <Checkbox checked={
                          Array.isArray(transformerData?.type) 
                            ? transformerData?.type?.includes("ตั้งบนตะแกรง")
                            : false
                        } />
                        <Text style={styles.smallText}> ตั้งบนตะแกรง</Text>
                        <Checkbox checked={
                          Array.isArray(transformerData?.type) 
                            ? transformerData?.type?.includes("ห้องหม้อแปลง")
                            : false
                        } />
                        <Text style={styles.smallText}> ห้องหม้อแปลง</Text>
                        <Checkbox checked={
                          Array.isArray(transformerData?.type) 
                            ? transformerData?.type?.includes("อื่นๆ")
                            : false
                        } />
                        <Text style={styles.smallText}> อื่นๆ</Text>
                        <Text style={styles.underlineDotted}>
                          {transformerData?.typeOther || ""}
                        </Text>
                      </View>
                      <Text style={styles.smallText}>
                      พิกัดการทนกระแสลัดวงจรสูงสุด <Text style={styles.underlineDotted}>{general?.shortCircuitCurrent || ""}</Text> kA
                    </Text>
                    <Text style={styles.smallText}>
                      พิกัดตัดกระแสลัดวงจรสูงสุด (Interrupting Capacity , IC) <Text style={styles.underlineDotted}>{general?.interruptingCapacity || ""}</Text> kA
                    </Text>
                    </View>
                  </View>
                  <View style={styles.hvRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.correct?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.correct?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.correct?.detail && (
                      <Text style={styles.smallText}>
                        {transformerData.correct.detail.length > 50 ? 
                          `${transformerData.correct.detail.substring(0, 50)}...` : 
                          transformerData.correct.detail}
                      </Text>
                    )}
                  </View>
                </View>

                {/* 4.3 เครื่องป้องกันกระแสเกินแรงต่ำของหม้อแปลง */}
                <View style={[styles.hvRow, styles.borderTop]}>
                  <View style={styles.hvLeftCol}>
                    <Text style={styles.smallBoldText}>4.3 เครื่องป้องกันกระแสเกินแรงต่ำของหม้อแปลง</Text>
                    <View style={styles.checkboxContainer}>
                      <View style={styles.checkboxLine}>
                        <Checkbox checked={
                          Array.isArray(transformerData?.overcurrentType) 
                            ? transformerData?.overcurrentType?.includes("ฟิวส์กลองพลาสติก")
                            : false
                        } />
                        <Text style={styles.smallText}> ฟิวส์กลองพลาสติกฟิวส์ลิงค์</Text>
                      </View>
                      <View style={styles.checkboxLine}>
                        <Checkbox checked={
                          Array.isArray(transformerData?.overcurrentType) 
                            ? transformerData?.overcurrentType?.includes("เซอร์กิตเบรกเกอร์")
                            : false
                        } />
                        <Text style={styles.smallText}> เซอร์กิตเบรกเกอร์</Text>
                      </View>
                      <View style={styles.checkboxLine}>
                        <Checkbox checked={
                          Array.isArray(transformerData?.overcurrentType) 
                            ? transformerData?.overcurrentType?.includes("ดรอพเอาท์ฟิวส์คัตเอาท์")
                            : false
                        } />
                        <Text style={styles.smallText}> ดรอพเอาท์ฟิวส์คัตเอาท์</Text>
                      </View>
                      <View style={styles.checkboxLine}>
                        <Checkbox checked={
                          Array.isArray(transformerData?.overcurrentType) 
                            ? transformerData?.overcurrentType?.includes("อื่นๆ")
                            : false
                        } />
                        <Text style={styles.smallText}> อื่นๆ </Text>
                        <Text style={styles.underlineDotted}>
                          {transformerData?.overcurrentTypeOther || ""}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.smallText}>
                      ขนาดกระแสเมื่อละลาย <Text style={styles.underlineDotted}>{transformerData?.overcurrentAmp || ""}</Text> แอมแปร์ (A)
                    </Text>
                    <Text style={styles.smallText}>
                      พิกัดทนกระแสลัดวงจร (Interrupting Capacity: Ic) <Text style={styles.underlineDotted}>{transformerData?.overcurrentIc || ""}</Text> kA
                    </Text>
                  </View>
                  <View style={styles.hvRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.overcurrent?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.overcurrent?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.overcurrent?.detail && (
                      <Text style={styles.smallText}>
                        {transformerData.overcurrent.detail.length > 50 ? 
                          `${transformerData.overcurrent.detail.substring(0, 50)}...` : 
                          transformerData.overcurrent.detail}
                      </Text>
                    )}
                  </View>
                </View>

                {/* 4.4 กับดักเสิร์จ */}
                <View style={[styles.hvRow, styles.borderTop]}>
                  <View style={styles.hvLeftCol}>
                    <Text style={styles.smallBoldText}>4.4 กับดักเสิร์จ (HV Surge Arrester)</Text>
                    <Text style={styles.smallText}>
                      ขนาด <Text style={styles.underlineDotted}>{transformerData?.surgeKV || ""}</Text> kV  
                      <Text style={styles.underlineDotted}>{transformerData?.surgeKA || ""}</Text> kA
                    </Text>
                  </View>
                  <View style={styles.hvRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.surge?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.surge?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.surge?.detail && (
                      <Text style={styles.smallText}>
                        {transformerData.surge.detail.length > 50 ? 
                          `${transformerData.surge.detail.substring(0, 50)}...` : 
                          transformerData.surge.detail}
                      </Text>
                    )}
                  </View>
                </View>

                {/* 4.5 การต่อลงดิน */}
                <View style={[styles.hvRow, styles.borderTop]}>
                  <View style={styles.hvLeftCol}>
                    <Text style={styles.smallBoldText}>4.5 การต่อลงดินทางการของหม้อแปลงไฟฟ้าเหมาะมีกำกับสำหรับจุดยึดรอฟสง</Text>
                  </View>
                  <View style={styles.hvRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.ground?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.ground?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.ground?.detail && (
                      <Text style={styles.smallText}>
                        {transformerData.ground.detail.length > 50 ? 
                          `${transformerData.ground.detail.substring(0, 50)}...` : 
                          transformerData.ground.detail}
                      </Text>
                    )}
                  </View>
                </View>

                {/* 4.6 การตรวจสอบค่าความต้านทาน */}
                <View style={[styles.hvRow, styles.borderTop]}>
                  <View style={styles.hvLeftCol}>
                    <Text style={styles.smallBoldText}>4.6 การตรวจสอบค่าความต้านทานการต่อลงดิน <Text style={styles.underlineDotted}>{transformerData?.groundOhm || ""}</Text> โอห์ม</Text>
                    <Text style={styles.smallText}>
                      การตรวจสอบเมื่อแกราได้ตรวจใส่วันที่ 5 โมงคา: โอมภรีบแก้ผลอรเเล่าร่วม ระบิดเอิ้ชกันฟิล์มไฟฟ้า เครื่องปีให้ไฟฟ้ากับต้องคิด 25 โอมห์
                      แบ่งเจ้าเเคาโวหากของเงิคราฟดึงเลือกผคันเรมองดำดครินเหนืออำนาจระอากเธแลคเก็บคงคิเคมาขถาหมุฉพากต้น
                    </Text>
                  </View>
                  <View style={styles.hvRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.groundCheck?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.groundCheck?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.groundCheck?.detail && (
                      <Text style={styles.smallText}>
                        {transformerData.groundCheck.detail.length > 50 ? 
                          `${transformerData.groundCheck.detail.substring(0, 50)}...` : 
                          transformerData.groundCheck.detail}
                      </Text>
                    )}
                  </View>
                </View>

                {/* 4.7 การตรวจสอบภายนอก - Header */}
                <View style={[styles.hvRow, styles.borderTop]}>
                  <View style={styles.hvLeftCol}>
                    <Text style={styles.smallBoldText}>4.7 การตรวจสอบภายนอก (สำหรับหม้อแปลงแห้งและหม้อแปลงน้ำมัน)</Text>
                  </View>
                  <View style={styles.hvRightCol}>
                    <Text style={styles.smallBoldText}>ผลการตรวจสอบ</Text>
                  </View>
                </View>

                {/* 4.7.1 สารดูดความชื้น */}
                <View style={styles.transformerRow}>
                  <View style={styles.transformerLeftCol}>
                    <Text style={styles.smallText}>4.7.1 สารดูดความชื้น</Text>
                  </View>
                  <View style={styles.transformerRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.ext?.silica?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.ext?.silica?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.ext?.silica?.detail && (
                      <Text style={styles.smallText}>{transformerData.ext.silica.detail}</Text>
                    )}
                  </View>
                </View>

                {/* 4.7.2 บุชชิ่ง */}
                <View style={styles.transformerRow}>
                  <View style={styles.transformerLeftCol}>
                    <Text style={styles.smallText}>4.7.2 บุชชิ่ง</Text>
                  </View>
                  <View style={styles.transformerRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.ext?.bushing?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.ext?.bushing?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.ext?.bushing?.detail && (
                      <Text style={styles.smallText}>{transformerData.ext.bushing.detail}</Text>
                    )}
                  </View>
                </View>

                {/* 4.7.3 ระดับน้ำมัน */}
                <View style={styles.transformerRow}>
                  <View style={styles.transformerLeftCol}>
                    <Text style={styles.smallText}>4.7.3 ระดับน้ำมัน</Text>
                  </View>
                  <View style={styles.transformerRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.ext?.oilLevel?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.ext?.oilLevel?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.ext?.oilLevel?.detail && (
                      <Text style={styles.smallText}>{transformerData.ext.oilLevel.detail}</Text>
                    )}
                  </View>
                </View>

                {/* 4.7.4 การรั่วซึมของน้ำมันหม้อแปลง */}
                <View style={styles.transformerRow}>
                  <View style={styles.transformerLeftCol}>
                    <Text style={styles.smallText}>4.7.4 การรั่วซึมของน้ำมันหม้อแปลง</Text>
                  </View>
                  <View style={styles.transformerRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.ext?.leak?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.ext?.leak?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.ext?.leak?.detail && (
                      <Text style={styles.smallText}>{transformerData.ext.leak.detail}</Text>
                    )}
                  </View>
                </View>

                {/* 4.8 ป้ายเครื่องหมาย */}
                <View style={[styles.hvRow, styles.borderTop]}>
                  <View style={styles.hvLeftCol}>
                    <Text style={styles.smallText}>4.8 ป้ายเตือน</Text>
                    <Text style={styles.smallText}>มี โดยให้ใช้ข้อความเช่น "อันตราย แรงดันสูง" เป็นต้น</Text>
                  </View>
                  <View style={styles.hvRightCol}>
                    <View style={styles.checkboxLine}>
                      <Checkbox checked={transformerData?.sign?.result === "ถูกต้อง"} />
                      <Text style={styles.smallText}> ถูกต้อง</Text>
                      <Checkbox checked={transformerData?.sign?.result === "ต้องแก้ไข"} />
                      <Text style={styles.smallText}> ต้องแก้ไข</Text>
                    </View>
                    {transformerData?.sign?.detail && (
                      <Text style={styles.smallText}>
                        {transformerData.sign.detail.length > 50 ? 
                          `${transformerData.sign.detail.substring(0, 50)}...` : 
                          transformerData.sign.detail}
                      </Text>
                    )}
                  </View>
                </View>

                {/* 4.9 อื่นๆ */}
                <View style={[styles.hvRow, styles.borderTop]}>
                  <View style={styles.hvLeftCol}>
                    <Text style={styles.smallText}>4.9 อื่นๆ</Text>
                    <Text style={styles.underlineLong}>
                      {transformerData?.other && transformerData.other.length > 100 ? 
                        `${transformerData.other.substring(0, 100)}...` : 
                        transformerData?.other || ""}
                    </Text>
                    {transformerData?.other && transformerData.other.length > 100 && (
                      <View style={styles.pageBreak} break>
                        <Text style={styles.smallText}>
                          อื่นๆ (ต่อ): {transformerData.other.substring(100)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              
              {/* แสดง LV System เฉพาะเมื่อ includeLvSystem = true (สำหรับ EV Charger) */}
              {includeLvSystem && (
                <LvSystemSection 
                  transformer={transformer} 
                  index={index} 
                  showSectionTitle={true}
                  sectionPrefix={sectionPrefix}
                />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default TransformerSection;