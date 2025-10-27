import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Checkbox, CheckboxResult } from "../common/FormElements";
import { styles } from "../styles/pdfStyles";

/**
 * CondoLvSystemSection - LV System for Condo with new schema structure
 * Supports sections 2.14 - 2.22 (or can be renumbered)
 */
const CondoLvSystemSection = ({ transformer, index, showSectionTitle = true, sectionNumber = "2" }) => {
  const lvSystem = transformer?.lvSystem || {};
  
  // Helper to get nested values safely
  const getNestedValue = (obj, path, defaultValue = null) => {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    return value;
  };

  // Get conductor standard data
  const conductorStandard = lvSystem?.conductorStandard || {};
  const mainSwitch = lvSystem?.mainSwitch || {};
  const grounding = lvSystem?.grounding || {};
  const floorPanel = lvSystem?.floorPanel || {};
  const meterBreaker = lvSystem?.meterBreaker || {};
  const roomConductor = lvSystem?.roomConductor || {};
  const roomPanel = lvSystem?.roomPanel || {};
  const roomPanelGroundBus = lvSystem?.roomPanelGroundBus || {};

  return (
    <View style={{ paddingTop: 4 }}>
      {showSectionTitle && index === 0 && (
        <Text style={styles.sectionTitle}>{sectionNumber}. ระบบไฟฟ้าแรงต่ำ</Text>
      )}
      <Text style={styles.subsectionTitle}>{sectionNumber}.14 สายตัวนำประธานแรงต่ำ (หม้อแปลงที่ {index + 1})</Text>
      
      <View style={styles.lvTable}>
        {/* 2.14.1 สายไฟฟ้าเป็นไปตามมาตรฐาน */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              {sectionNumber}.14.1 สายไฟฟ้าเป็นไปตามมาตรฐาน มอก.11-2553 หรือ มอก. 293-2541 หรือ IEC 60502
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={getNestedValue(conductorStandard, '2.14.1.result')}
              detail={getNestedValue(conductorStandard, '2.14.1.detail')}
            />
          </View>
        </View>

        {/* 2.14.2 ชนิดและขนาดของสายไฟฟ้า */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>{sectionNumber}.14.2 ชนิดและขนาดของสายไฟฟ้า</Text>
            <View style={styles.checkboxLine}>
              {(getNestedValue(conductorStandard, '2.14.2.types') || []).includes('iec01') && (
                <>
                  <Checkbox checked={true} />
                  <Text style={styles.smallText}> IEC 01  </Text>
                </>
              )}
              {(getNestedValue(conductorStandard, '2.14.2.types') || []).includes('nyy') && (
                <>
                  <Checkbox checked={true} />
                  <Text style={styles.smallText}> NYY  </Text>
                </>
              )}
              {(getNestedValue(conductorStandard, '2.14.2.types') || []).includes('cv') && (
                <>
                  <Checkbox checked={true} />
                  <Text style={styles.smallText}> CV  </Text>
                </>
              )}
              {(getNestedValue(conductorStandard, '2.14.2.types') || []).includes('other') && (
                <>
                  <Checkbox checked={true} />
                  <Text style={styles.smallText}> อื่นๆ {getNestedValue(conductorStandard, '2.14.2.other')}</Text>
                </>
              )}
            </View>
            {getNestedValue(conductorStandard, '2.14.2.size') && (
              <Text style={styles.smallText}>
                ขนาด: {getNestedValue(conductorStandard, '2.14.2.size')} {getNestedValue(conductorStandard, '2.14.2.sizeUnit', 'ตร.มม.')}
              </Text>
            )}
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={getNestedValue(conductorStandard, '2.14.2.result')}
              detail={getNestedValue(conductorStandard, '2.14.2.detail')}
            />
          </View>
        </View>

        {/* 2.14.3 วิธีการเดินสาย */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>{sectionNumber}.14.3 วิธีการเดินสาย</Text>
            <View style={styles.checkboxLine}>
              {(getNestedValue(conductorStandard, '2.14.3.methods') || []).map((method, idx) => {
                const labels = {
                  'air': 'บนลูกถ้วยฉนวนในอากาศ',
                  'conduit': 'ท่อร้อยสาย (Conduit)',
                  'wireway': 'รางเดินสาย (Wire Way)',
                  'cabletray': 'รางเคเบิล (Cable Tray)',
                  'busway': 'บัสเวย์ (Bus Way)',
                  'underground': 'เดินฝังใต้ดิน'
                };
                return (
                  <React.Fragment key={idx}>
                    <Checkbox checked={true} />
                    <Text style={styles.smallText}> {labels[method] || method}  </Text>
                  </React.Fragment>
                );
              })}
              {getNestedValue(conductorStandard, '2.14.3.other') && (
                <Text style={styles.smallText}> อื่นๆ: {getNestedValue(conductorStandard, '2.14.3.other')}</Text>
              )}
            </View>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.smallText}>-</Text>
          </View>
        </View>
      </View>

      {/* 2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ */}
      <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>
        {sectionNumber}.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร
      </Text>
      <View style={styles.lvTable}>
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <View style={styles.checkboxLine}>
              <Checkbox checked={mainSwitch?.cb_iec60947_2 === true} />
              <Text style={styles.smallText}> เซอร์กิตเบรกเกอร์ตามมาตรฐาน IEC60947-2  </Text>
              <Checkbox checked={mainSwitch?.switch_fuse === true} />
              <Text style={styles.smallText}> สวิตช์พร้อมฟิวส์</Text>
            </View>
            {mainSwitch?.other_standard && (
              <Text style={styles.smallText}>มาตรฐานอื่นๆ: {mainSwitch.other_standard}</Text>
            )}
            {mainSwitch?.product && (
              <Text style={styles.smallText}>ผลิตภัณฑ์: {mainSwitch.product}</Text>
            )}
            {mainSwitch?.type && (
              <Text style={styles.smallText}>ชนิด: {mainSwitch.type}</Text>
            )}
            <Text style={styles.smallText}>
              In: <Text style={styles.underlineDotted}>{mainSwitch?.in || "............"}</Text> A,  
              Ic: <Text style={styles.underlineDotted}>{mainSwitch?.ic || "............"}</Text> kA,  
              AT: <Text style={styles.underlineDotted}>{mainSwitch?.at || "............"}</Text> A,  
              AF: <Text style={styles.underlineDotted}>{mainSwitch?.af || "............"}</Text> A
            </Text>
            {mainSwitch?.voltage && (
              <Text style={styles.smallText}>Voltage: {mainSwitch.voltage} V</Text>
            )}
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={mainSwitch?.result}
              detail={mainSwitch?.remark}
            />
          </View>
        </View>
      </View>

      {/* 2.16 การต่อลงดินของแผงเมนสวิตช์ */}
      <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>
        {sectionNumber}.16 การต่อลงดินของแผงเมนสวิตช์ของอาคาร
      </Text>
      <View style={styles.lvTable}>
        {/* 2.16.1 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              {sectionNumber}.16.1 ขนาดสายต่อหลักดิน: <Text style={styles.underlineDotted}>{grounding?.ground_wire_size || "............"}</Text> ตร.มม.
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={grounding?.ground_wire_size_result}
              detail={grounding?.ground_wire_size_remark}
            />
          </View>
        </View>

        {/* 2.16.2 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>{sectionNumber}.16.2 ค่าความต้านทานการต่อลงดิน</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={grounding?.resistance?.result}
              detail={grounding?.resistance?.remark}
            />
          </View>
        </View>

        {/* 2.16.3 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>{sectionNumber}.16.3 จุดทดสอบ</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={grounding?.test_point?.result}
              detail={grounding?.test_point?.remark}
            />
          </View>
        </View>

        {/* 2.16.4 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>{sectionNumber}.16.4 ขั้วต่อสายดิน/นิวทรัล (Busbar)</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={grounding?.busbar?.result}
              detail={grounding?.busbar?.remark}
            />
          </View>
        </View>
      </View>

      {/* 2.17 แผงจ่ายไฟประจำชั้น */}
      <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>
        {sectionNumber}.17 แผงจ่ายไฟประจำชั้น
      </Text>
      <View style={styles.lvTable}>
        {/* 2.17.1 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>{sectionNumber}.17.1 เซอร์กิตเบรกเกอร์ตามมาตรฐาน</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={floorPanel?.cb_standard?.result}
              detail={floorPanel?.cb_standard?.remark}
            />
          </View>
        </View>

        {/* 2.17.2 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              {sectionNumber}.17.2 Feeder: AT: <Text style={styles.underlineDotted}>{floorPanel?.feeder?.at || "............"}</Text> A,  
              AF: <Text style={styles.underlineDotted}>{floorPanel?.feeder?.af || "............"}</Text> A,  
              IC: <Text style={styles.underlineDotted}>{floorPanel?.feeder?.ic || "............"}</Text> kA
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={floorPanel?.feeder?.result}
              detail={floorPanel?.feeder?.remark}
            />
          </View>
        </View>

        {/* 2.17.3 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>{sectionNumber}.17.3 ขั้วต่อสายดิน</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={floorPanel?.ground_bus?.result}
              detail={floorPanel?.ground_bus?.remark}
            />
          </View>
        </View>
      </View>

      {/* 2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์ */}
      <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>
        {sectionNumber}.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์
      </Text>
      <View style={styles.lvTable}>
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              AT: <Text style={styles.underlineDotted}>{meterBreaker?.at || "............"}</Text> A,  
              AF: <Text style={styles.underlineDotted}>{meterBreaker?.af || "............"}</Text> A,  
              IC: <Text style={styles.underlineDotted}>{meterBreaker?.ic || "............"}</Text> kA
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={meterBreaker?.result}
              detail={meterBreaker?.remark}
            />
          </View>
        </View>
      </View>

      {/* 2.19 สายตัวนำประธานเข้าห้องชุด */}
      <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>
        {sectionNumber}.19 สายตัวนำประธานเข้าห้องชุด
      </Text>
      <View style={styles.lvTable}>
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              ชนิด: <Text style={styles.underlineDotted}>{roomConductor?.type || "............"}</Text>,  
              ขนาด: <Text style={styles.underlineDotted}>{roomConductor?.size || "............"}</Text> ตร.มม.
            </Text>
            {roomConductor?.methods && roomConductor.methods.length > 0 && (
              <Text style={styles.smallText}>
                วิธีการเดินสาย: {roomConductor.methods.map(m => {
                  const labels = { 'conduit': 'ท่อร้อยสาย', 'wireway': 'รางเดินสาย' };
                  return labels[m] || m;
                }).join(', ')}
                {roomConductor.other && `, อื่นๆ: ${roomConductor.other}`}
              </Text>
            )}
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={roomConductor?.result}
              detail={roomConductor?.remark}
            />
          </View>
        </View>
      </View>

      {/* 2.20 แผงจ่ายไฟในห้องชุด */}
      <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>
        {sectionNumber}.20 แผงจ่ายไฟในห้องชุด
      </Text>
      <View style={styles.lvTable}>
        {/* 2.20.1 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>{sectionNumber}.20.1 เซอร์กิตเบรกเกอร์ตามมาตรฐาน</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={roomPanel?.cb_standard?.result}
              detail={roomPanel?.cb_standard?.remark}
            />
          </View>
        </View>

        {/* 2.20.2 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>
              {sectionNumber}.20.2 Meter: AT: <Text style={styles.underlineDotted}>{roomPanel?.meter?.at || "............"}</Text> A,  
              AF: <Text style={styles.underlineDotted}>{roomPanel?.meter?.af || "............"}</Text> A
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={roomPanel?.meter?.result}
              detail={roomPanel?.meter?.remark}
            />
          </View>
        </View>

        {/* 2.20.3 */}
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>{sectionNumber}.20.3 IC</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={roomPanel?.ic?.result}
              detail={roomPanel?.ic?.remark}
            />
          </View>
        </View>
      </View>

      {/* 2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน */}
      <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>
        {sectionNumber}.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน
      </Text>
      <View style={styles.lvTable}>
        <View style={[styles.tableRow, styles.borderTop]}>
          <View style={styles.leftColumn}>
            <Text style={styles.smallText}>ขั้วต่อสายดิน (Ground Bus)</Text>
          </View>
          <View style={styles.rightColumn}>
            <CheckboxResult 
              result={roomPanelGroundBus?.result}
              detail={roomPanelGroundBus?.remark}
            />
          </View>
        </View>
      </View>

      {/* 2.22 อื่นๆ */}
      {lvSystem?.other && (
        <>
          <Text style={[styles.subsectionTitle, { marginTop: 8 }]}>
            {sectionNumber}.22 อื่นๆ
          </Text>
          <View style={styles.lvTable}>
            <View style={[styles.tableRow, styles.borderTop]}>
              <View style={styles.leftColumn}>
                <Text style={styles.smallText}>{lvSystem.other}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default CondoLvSystemSection;
