import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const EVChargerInspectionSection = ({ evChargers, transformerIndex = 0 }) => {
  if (!evChargers || evChargers.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>5.7 การตรวจสอบเครื่องอัดประจุยานยนต์ไฟฟ้า เครื่องที่ 1</Text>
        <Text style={styles.smallText}>ไม่มีข้อมูลเครื่องอัดประจุ  </Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {evChargers.map((charger, index) => (
        <View key={index} style={styles.chargerSection}>
          <Text style={styles.subsectionTitle}>
            5.7 การตรวจสอบเครื่องอัดประจุยานยนต์ไฟฟ้า เครื่องที่ {index + 1}
          </Text>
          
          <View style={styles.lvTable}>
            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.subsectionTitle}>5.7.1 ข้อมูลเครื่องอัดประจุยานยนต์ไฟฟ้า  </Text>
                <Text style={styles.smallText}>
                  ผลิตภัณฑ์ <Text style={styles.underlineDotted}>{charger?.product || "............................................................. "}</Text> 
                  รุ่น <Text style={styles.underlineDotted}>{charger?.model || ".........................................."}</Text>
                </Text>
                <Text style={styles.smallText}>
                  Serial Number <Text style={styles.underlineDotted}>{charger?.sn || "................................................... "}</Text> 
                  IP <Text style={styles.underlineDotted}>{charger?.ip || ".........................................."}</Text>
                </Text>
                <View style={styles.checkboxLine}>
                  <Text style={styles.smallText}>ระบบ </Text>
                  <Checkbox checked={charger?.chargeType === "1"} />
                  <Text style={styles.smallText}> 1 เฟส  </Text>
                  <Checkbox checked={charger?.chargeType === "3"} />
                  <Text style={styles.smallText}> 3 เฟส       จำนวนหัวชาร์จ <Text style={styles.underlineDotted}>{charger?.chargingHeads || "................."}</Text> หัว</Text>
                </View>
                <Text style={styles.smallText}>
                  พิกัดกำลังไฟฟ้ารวม <Text style={styles.underlineDotted}>{charger?.totalPower || "................"}</Text> kW  
                  พิกัดกระแสรวม (Input) <Text style={styles.underlineDotted}>{charger?.totalCurrent || "....................."}</Text> A
                </Text>
                <View style={styles.checkboxLine}>
                  <Text style={styles.smallText}>การอัดประจุไฟฟ้า  </Text>
                  <Checkbox checked={charger?.mode?.includes("2")} />
                  <Text style={styles.smallText}> โหมด 2 (AC)  </Text>
                  <Checkbox checked={charger?.mode?.includes("3")} />
                  <Text style={styles.smallText}> โหมด 3 (AC)  </Text>
                  <Checkbox checked={charger?.mode?.includes("4")} />
                  <Text style={styles.smallText}> โหมด 4 (DC)</Text>
                </View>
                <Text style={styles.smallText}>* AC คือ ไฟกระแสสลับ    DC คือ ไฟกระแสตรง</Text>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={charger?.infoCheck?.result}
                  detail={charger?.infoCheck?.detail}
                />
              </View>
            </View>

            {/* 5.7.2 ลักษณะหัวชาร์จ */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.subsectionTitle}>5.7.2 ลักษณะหัวชาร์จ / การชาร์จ</Text>
                
                <View style={styles.chargerTypes}>
                  {/* AC Type 2 */}
                  <View style={styles.chargerType}>
                    <Checkbox checked={charger?.headTypes?.includes("ACType2")} />
                    <Text style={styles.smallText}> AC Type 2</Text>
                  </View>
                  {charger?.headTypes?.includes("ACType2") && (
                    <Text style={styles.smallText}>
                      {"     "}พิกัดกระแส (AAC) <Text style={styles.underlineDotted}>{charger?.acType2Current || ".........."}</Text>{" "}
                      พิกัดแรงดัน (VAC) <Text style={styles.underlineDotted}>{charger?.acType2Voltage || ".........."}</Text>{" "}
                      พิกัดกำลัง (kW) <Text style={styles.underlineDotted}>{charger?.acType2Power || ".........."}</Text>
                    </Text>
                  )}
                  
                  {/* DC CHAdeMO */}
                  <View style={styles.chargerType}>
                    <Checkbox checked={charger?.headTypes?.includes("DCCHAdeMO")} />
                    <Text style={styles.smallText}> DC CHAdeMO</Text>
                  </View>
                  {charger?.headTypes?.includes("DCCHAdeMO") && (
                    <Text style={styles.smallText}>
                      {"     "}พิกัดกระแส (ADC) <Text style={styles.underlineDotted}>{charger?.dcChadeMoCurrent || ".........."}</Text>{" "}
                      พิกัดแรงดัน (VDC) <Text style={styles.underlineDotted}>{charger?.dcChadeMoVoltage || ".........."}</Text>{" "}
                      พิกัดกำลัง (kW) <Text style={styles.underlineDotted}>{charger?.dcChadeMoPower || ".........."}</Text>
                    </Text>
                  )}
                  
                  {/* DC CCS */}
                  <View style={styles.chargerType}>
                    <Checkbox checked={charger?.headTypes?.includes("DCCCS")} />
                    <Text style={styles.smallText}> DC CCS</Text>
                  </View>
                  {charger?.headTypes?.includes("DCCCS") && (
                    <Text style={styles.smallText}>
                      {"     "}พิกัดกระแส (ADC) <Text style={styles.underlineDotted}>{charger?.dcCcsCurrent || ".........."}</Text>{" "}
                      พิกัดแรงดัน (VDC) <Text style={styles.underlineDotted}>{charger?.dcCcsVoltage || ".........."}</Text>{" "}
                      พิกัดกำลัง (kW) <Text style={styles.underlineDotted}>{charger?.dcCcsPower || ".........."}</Text>
                    </Text>
                  )}
                  
                  {/* อื่นๆ ระบุ */}
                  <View style={styles.chargerType}>
                    <Checkbox checked={charger?.headTypes?.includes("Other")} />
                    <Text style={styles.smallText}> อื่นๆ ระบุ</Text>
                  </View>
                  {charger?.headTypes?.includes("Other") && (
                    <>
                      <Text style={styles.smallText}>
                        {"     "}ระบุประเภท <Text style={styles.underlineDotted}>{charger?.otherHeadType || ".............................."}</Text>
                      </Text>
                      <Text style={styles.smallText}>
                        {"     "}พิกัดกระแส (A) <Text style={styles.underlineDotted}>{charger?.otherCurrent || ".........."}</Text>{" "}
                        พิกัดแรงดัน (V) <Text style={styles.underlineDotted}>{charger?.otherVoltage || ".........."}</Text>{" "}
                        พิกัดกำลัง (kW) <Text style={styles.underlineDotted}>{charger?.otherPower || ".........."}</Text>
                      </Text>
                    </>
                  )}
                  
                  {/* หัวชาร์จสามารถชาร์จได้พร้อมกัน */}
                  {charger?.simultaneousCharge && (
                    <Text style={styles.smallText}>
                      หัวชาร์จสามารถชาร์จได้พร้อมกัน <Text style={styles.underlineDotted}>{charger?.simultaneousCharge || ".........."}</Text> หัว คือ <Text style={styles.underlineDotted}>{charger?.simultaneousChargeDetail || ".............................."}</Text>
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={charger?.headCheck?.result}
                  detail={charger?.headCheck?.detail}
                />
              </View>
            </View>
          </View>

          {/* แสดงหมายเลขเครื่องถัดไป */}
          {index < evChargers.length - 1 && (
            <View style={styles.chargerSeparator} />
          )}
        </View>
      ))}
    </View>
  );
};

export default EVChargerInspectionSection;