import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

const EVChargerInspectionSection = ({ evChargers, transformerIndex = 0 }) => {
  if (!evChargers || evChargers.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>5.7 การตรวจสอบเครื่องอัดประจุยานยนต์ไฟฟ้า เครื่องที่ 1</Text>
        <Text style={styles.smallText}>ไม่มีข้อมูลเครื่องอัดประจุ</Text>
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
                <Text style={styles.subsectionTitle}>5.7.1 ข้อมูลเครื่องอัดประจุยานยนต์ไฟฟ้า</Text>
                <Text style={styles.smallText}>
                  ผลิตภัณฑ์ <Text style={styles.underlineDotted}>{charger?.manufacturer || charger?.product || "............................................................. "}</Text> 
                  รุ่น <Text style={styles.underlineDotted}>{charger?.model || ".........................................."}</Text>
                </Text>
                <Text style={styles.smallText}>
                  Serial Number <Text style={styles.underlineDotted}>{charger?.serialNumber || charger?.sn || "................................................... "}</Text> 
                  IP <Text style={styles.underlineDotted}>{charger?.ipRating || charger?.ip || ".........................................."}</Text>
                </Text>
                <View style={styles.checkboxLine}>
                  <Text style={styles.smallText}>ระบบ </Text>
                  <Checkbox checked={charger?.systemType?.includes("1เฟส") || charger?.chargeType?.includes("1เฟส")} />
                  <Text style={styles.smallText}> 1 เฟส  </Text>
                  <Checkbox checked={charger?.systemType?.includes("3เฟส") || charger?.chargeType?.includes("3เฟส")} />
                  <Text style={styles.smallText}> 3 เฟส       จำนวนหัวชาร์จ <Text style={styles.underlineDotted}>{charger?.numberOfPorts || charger?.chargingHeads || "................."}</Text> หัว</Text>
                </View>
                <Text style={styles.smallText}>
                  พิกัดกำลังไฟฟ้ารวม <Text style={styles.underlineDotted}>{charger?.totalPower || charger?.power || "................"}</Text> kW  
                  พิกัดกระแสรวม (Input) <Text style={styles.underlineDotted}>{charger?.totalCurrent || charger?.inputCurrent || "....................."}</Text> A
                </Text>
                <View style={styles.checkboxLine}>
                  <Text style={styles.smallText}>การอัดประจุไฟฟ้า  </Text>
                  <Checkbox checked={charger?.chargingMode?.includes("โหมด2") || charger?.mode?.includes("โหมด2")} />
                  <Text style={styles.smallText}> โหมด 2 (AC)  </Text>
                  <Checkbox checked={charger?.chargingMode?.includes("โหมด3") || charger?.mode?.includes("โหมด3")} />
                  <Text style={styles.smallText}> โหมด 3 (AC)  </Text>
                  <Checkbox checked={charger?.chargingMode?.includes("โหมด4") || charger?.mode?.includes("โหมด4")} />
                  <Text style={styles.smallText}> โหมด 4 (DC)</Text>
                </View>
                <Text style={styles.smallText}>* AC คือ ไฟกระแสสลับ    DC คือ ไฟกระแสตรง</Text>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={charger?.specificationCheck?.result || charger?.infoCheck?.result}
                  detail={charger?.specificationCheck?.detail || charger?.infoCheck?.detail}
                />
              </View>
            </View>

            {/* 5.7.2 ลักษณะหัวชาร์จ */}
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.subsectionTitle}>5.7.2 ลักษณะหัวชาร์จ / การชาร์จ</Text>
                
                <View style={styles.chargerTypes}>
                  <View style={styles.chargerType}>
                    <Checkbox checked={charger?.portTypes?.includes("ACType2") || charger?.headTypes?.includes("ACType2")} />
                    <Text style={styles.smallText}> AC Type 2    พิกัดกระแส <Text style={styles.underlineDotted}>{charger?.acType2?.current || charger?.acType2Current || "............"}</Text> AAC</Text>
                  </View>
                  <Text style={styles.smallText}>
                    พิกัดแรงดัน <Text style={styles.underlineDotted}>{charger?.acType2?.voltage || charger?.acType2Voltage || "............."}</Text> VAC 
                    พิกัดกำลัง <Text style={styles.underlineDotted}>{charger?.acType2?.power || charger?.acType2Power || "................"}</Text> kW
                  </Text>
                  
                  <View style={styles.chargerType}>
                    <Checkbox checked={charger?.portTypes?.includes("DCCHAdeMO") || charger?.headTypes?.includes("DCCHAdeMO")} />
                    <Text style={styles.smallText}> DC CHAdeMO พิกัดกระแส <Text style={styles.underlineDotted}>{charger?.dcChadeMo?.current || charger?.dcChadeMoCurrent || "............"}</Text> ADC</Text>
                  </View>
                  <Text style={styles.smallText}>
                    พิกัดแรงดัน <Text style={styles.underlineDotted}>{charger?.dcChadeMo?.voltage || charger?.dcChadeMoVoltage || "............."}</Text> VDC 
                    พิกัดกำลัง <Text style={styles.underlineDotted}>{charger?.dcChadeMo?.power || charger?.dcChadeMoPower || "................"}</Text> kW
                  </Text>
                  
                  <View style={styles.chargerType}>
                    <Checkbox checked={charger?.portTypes?.includes("DCCCS") || charger?.headTypes?.includes("DCCCS")} />
                    <Text style={styles.smallText}> DC CCS      พิกัดกระแส <Text style={styles.underlineDotted}>{charger?.dcCcs?.current || charger?.dcCcsCurrent || "............"}</Text> ADC</Text>
                  </View>
                  <Text style={styles.smallText}>
                    พิกัดแรงดัน <Text style={styles.underlineDotted}>{charger?.dcCcs?.voltage || charger?.dcCcsVoltage || "............."}</Text> VDC 
                    พิกัดกำลัง <Text style={styles.underlineDotted}>{charger?.dcCcs?.power || charger?.dcCcsPower || "................"}</Text> kW
                  </Text>
                  
                  <View style={styles.chargerType}>
                    <Checkbox checked={charger?.portTypes?.includes("อื่นๆ") || charger?.headTypes?.includes("อื่นๆ")} />
                    <Text style={styles.smallText}> อื่นๆ ระบุ <Text style={styles.underlineDotted}>{charger?.otherPortType || charger?.otherHeadType || "........................."}</Text></Text>
                  </View>
                  
                  <View style={styles.chargerType}>
                    <Checkbox checked={!!charger?.simultaneousCharge || !!charger?.concurrentCharging} />
                    <Text style={styles.smallText}> หัวชาร์จสามารถชาร์จได้พร้อมกัน <Text style={styles.underlineDotted}>{charger?.simultaneousCharge || charger?.concurrentCharging || "................."}</Text> หัว</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <CheckboxResult 
                  result={charger?.portCheck?.result || charger?.headCheck?.result}
                  detail={charger?.portCheck?.detail || charger?.headCheck?.detail}
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