import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const SubCircuitSection = ({ subCircuits, transformerIndex = 0 }) => {
  if (!subCircuits || subCircuits.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>5.6 วงจรย่อย วงจรที่ 1 (หม้อแปลงที่ {transformerIndex + 1})</Text>
        <Text style={styles.smallText}>ไม่มีข้อมูลวงจรย่อย</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {subCircuits.map((item, idx) => (
        <View key={idx} style={styles.subCircuitSection}>
          <Text style={styles.subsectionTitle}>
            5.6 วงจรย่อย วงจรที่ {idx + 1} (หม้อแปลงที่ {transformerIndex + 1})
          </Text>
          
          <View style={styles.lvTable}>
            {/* ข้อมูลพื้นฐานของวงจร */}
            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.subsectionTitle}>5.6.1 วงจรย่อยของเครื่องอัดประจุยานยนต์ไฟฟ้า</Text>
                <Text style={styles.smallText}>ก) วงจรย่อยสำหรับเครื่องอัดประจุยานยนต์ไฟฟ้าเท่านั้น (ไม่รวมโหลดอื่น)</Text>
                <Text style={styles.smallText}>ข) วงจรย่อยสำหรับเครื่องอัดประจุยานยนต์ไฟฟ้า 1 เครื่อง ต่อ 1 วงจรย่อย</Text>
              </View>
              <View style={styles.rightColumn}>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.evOnly?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.evOnly?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.evOnly?.detail && (
                  <Text style={styles.smallText}>{item.evOnly.detail}</Text>
                )}
                
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.evOnePerCircuit?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.evOnePerCircuit?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.evOnePerCircuit?.detail && (
                  <Text style={styles.smallText}>{item.evOnePerCircuit.detail}</Text>
                )}
              </View>
            </View>

            {/* สายไฟฟ้า */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.subsectionTitle}>5.6.2 วงจรย่อย - สายไฟฟ้า</Text>
                
                <Text style={styles.smallText}>ก) สายตัวนำวงจรย่อยเป็นไปตามมาตรฐาน</Text>
                <View style={styles.checkboxLine}>
                  {["TIS 17", "IEC 60364", "BS 7671", "NEC"].map(std => (
                    <View key={std} style={styles.checkboxInline}>
                      <Checkbox checked={item?.standard?.includes(std)} />
                      <Text style={styles.smallText}> {std}  </Text>
                    </View>
                  ))}
                </View>
                
                <Text style={styles.smallText}>ข) ชนิดสายตัวนำ</Text>
                <View style={styles.checkboxLine}>
                  {["THW", "THHN", "NYY", "VV", "XLPE"].map(type => (
                    <View key={type} style={styles.checkboxInline}>
                      <Checkbox checked={item?.wireType?.includes(type)} />
                      <Text style={styles.smallText}> {type}  </Text>
                    </View>
                  ))}
                  <View style={styles.checkboxInline}>
                    <Checkbox checked={item?.wireType?.includes("อื่นๆ")} />
                    <Text style={styles.smallText}> อื่นๆ</Text>
                    <Text style={styles.underlineDotted}>{item?.wireTypeOther || ""}</Text>
                  </View>
                </View>
                
                <Text style={styles.smallText}>
                  ค) ขนาดสายเฟส <Text style={styles.underlineDotted}>{item?.phaseSize || ""}</Text> ตร.มม. 
                </Text>
                <Text style={styles.smallText}>
                  ง) ขนาดสายนิวทรัล <Text style={styles.underlineDotted}>{item?.neutralSize || ""}</Text> ตร.มม.
                </Text>
                <Text style={styles.smallText}>
                  จ) ขนาดสายกราวด์ <Text style={styles.underlineDotted}>{item?.groundSize || ""}</Text> ตร.มม.
                </Text>
              </View>
              <View style={styles.rightColumn}>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.phaseSizeCheck?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.phaseSizeCheck?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.phaseSizeCheck?.detail && (
                  <Text style={styles.smallText}>{item.phaseSizeCheck.detail}</Text>
                )}
                
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.neutralSizeCheck?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.neutralSizeCheck?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.neutralSizeCheck?.detail && (
                  <Text style={styles.smallText}>{item.neutralSizeCheck.detail}</Text>
                )}
                
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.groundSizeCheck?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.groundSizeCheck?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.groundSizeCheck?.detail && (
                  <Text style={styles.smallText}>{item.groundSizeCheck.detail}</Text>
                )}
                
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.phaseColor?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.phaseColor?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.phaseColor?.detail && (
                  <Text style={styles.smallText}>{item.phaseColor.detail}</Text>
                )}
              </View>
            </View>

            {/* การติดตั้งเดินสาย */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.subsectionTitle}>5.6.3 วิธีการเดินสาย</Text>
                
                <View style={styles.checkboxLine}>
                  {["ท่อร้อยสายบนผนัง", "ท่อร้อยสายฝังดิน", "ราง Wireway", "ถาด Cable Tray", "อื่นๆ"].map(method => (
                    <View key={method} style={styles.checkboxInline}>
                      <Checkbox checked={item?.method?.includes(method)} />
                      <Text style={styles.smallText}> {method}  </Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.smallText}>
                  ขนาดท่อบนผนัง <Text style={styles.underlineDotted}>{item?.methodConduitWallSize || ""}</Text> มม. 
                  ขนาดท่อฝังดิน <Text style={styles.underlineDotted}>{item?.methodConduitBuriedSize || ""}</Text> มม.
                </Text>
                <Text style={styles.smallText}>
                  ขนาดราง <Text style={styles.underlineDotted}>{item?.methodWirewayW || ""}</Text> x <Text style={styles.underlineDotted}>{item?.methodWirewayH || ""}</Text> มม.
                </Text>
                {item?.method?.includes("อื่นๆ") && (
                  <Text style={styles.smallText}>
                    อื่นๆ: <Text style={styles.underlineDotted}>{item?.methodOther || ""}</Text>
                  </Text>
                )}

                <Text style={styles.subsectionTitle}>5.6.4 ประเภทท่อร้อยสาย</Text>
                <View style={styles.checkboxLine}>
                  {["PVC", "Steel EMT", "Steel IMC", "Flexible"].map(type => (
                    <View key={type} style={styles.checkboxInline}>
                      <Checkbox checked={item?.conduitType?.includes(type)} />
                      <Text style={styles.smallText}> {type}  </Text>
                    </View>
                  ))}
                  <View style={styles.checkboxInline}>
                    <Checkbox checked={item?.conduitType?.includes("อื่นๆ")} />
                    <Text style={styles.smallText}> อื่นๆ</Text>
                    <Text style={styles.underlineDotted}>{item?.conduitTypeOther || ""}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.wirewayMechanical?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.wirewayMechanical?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.wirewayMechanical?.detail && (
                  <Text style={styles.smallText}>{item.wirewayMechanical.detail}</Text>
                )}
                
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.methodCheck?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.methodCheck?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.methodCheck?.detail && (
                  <Text style={styles.smallText}>{item.methodCheck.detail}</Text>
                )}
                
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.conduitCheck?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.conduitCheck?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.conduitCheck?.detail && (
                  <Text style={styles.smallText}>{item.conduitCheck.detail}</Text>
                )}
              </View>
            </View>

            {/* อุปกรณ์ป้องกัน */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.subsectionTitle}>5.6.5 อุปกรณ์ป้องกัน - เบรกเกอร์</Text>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.breakerStandard === true} />
                  <Text style={styles.smallText}> เบรกเกอร์มาตรฐาน IEC 60898 หรือ IEC 60947-2</Text>
                </View>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.breakerMode3 === true} />
                  <Text style={styles.smallText}> 
                    เบรกเกอร์สำหรับโหมด 3/4 ขนาด <Text style={styles.underlineDotted}>{item?.breakerMode3AT || ""}</Text> A
                  </Text>
                </View>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.breakerMode2 === true} />
                  <Text style={styles.smallText}> 
                    เบรกเกอร์สำหรับโหมด 2 ขนาด <Text style={styles.underlineDotted}>{item?.breakerMode2AT || ""}</Text> A
                  </Text>
                </View>

                <Text style={styles.subsectionTitle}>5.6.6 เครื่องตัดไฟรั่ว (RCD)</Text>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.rcdTypeB === true} />
                  <Text style={styles.smallText}> 
                    RCD Type B ขนาด <Text style={styles.underlineDotted}>{item?.rcdTypeBIn || ""}</Text> mA
                  </Text>
                </View>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.rcdTypeAFPlusDD === true} />
                  <Text style={styles.smallText}> RCD Type AF+DD (สำหรับโหมด 3 และ 4)</Text>
                </View>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.rcdTypeBInCharger === true} />
                  <Text style={styles.smallText}> 
                    RCD Type B ในเครื่องอัดประจุ ขนาด <Text style={styles.underlineDotted}>{item?.rcdTypeBInChargerIn || ""}</Text> mA
                  </Text>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.breakerCheck?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.breakerCheck?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.breakerCheck?.detail && (
                  <Text style={styles.smallText}>{item.breakerCheck.detail}</Text>
                )}
                
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.breakerSizeCheck?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.breakerSizeCheck?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.breakerSizeCheck?.detail && (
                  <Text style={styles.smallText}>{item.breakerSizeCheck.detail}</Text>
                )}
                
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.rcdCheck?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.rcdCheck?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.rcdCheck?.detail && (
                  <Text style={styles.smallText}>{item.rcdCheck.detail}</Text>
                )}
                
                <View style={styles.checkboxLine}>
                  <Checkbox checked={item?.rcdTypeBMain?.result === "ถูกต้อง"} />
                  <Text style={styles.smallText}> ถูกต้อง</Text>
                  <Checkbox checked={item?.rcdTypeBMain?.result === "ต้องแก้ไข"} />
                  <Text style={styles.smallText}> ต้องแก้ไข</Text>
                </View>
                {item?.rcdTypeBMain?.detail && (
                  <Text style={styles.smallText}>{item.rcdTypeBMain.detail}</Text>
                )}
              </View>
            </View>
          </View>

          {/* แสดงหมายเลขวงจรถัดไป */}
          {idx < subCircuits.length - 1 && (
            <View style={styles.circuitSeparator} />
          )}
        </View>
      ))}
    </View>
  );
};

export default SubCircuitSection;