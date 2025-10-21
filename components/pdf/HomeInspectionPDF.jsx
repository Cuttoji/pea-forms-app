import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image, Svg, Rect, Path } from "@react-pdf/renderer";

Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
  ],
});

// เพิ่ม font สำหรับ symbols
Font.registerHyphenationCallback(word => [word]);

const PEA_LOGO = "/pea_logo.png";

const Checkbox = ({ checked = false, size = 10 }) => (
  <Svg width={size} height={size} style={{ marginRight: 4 }}>
    {/* กรอบสี่เหลี่ยม */}
    <Rect
      x="0.5"
      y="0.5"
      width={size - 1}
      height={size - 1}
      stroke="#000000"
      strokeWidth="1"
      fill={checked ? "#ffffff" : "#ffffff"}
      rx="1"
    />
    {/* เครื่องหมายถูก ✓ */}
    {checked && (
      <Path
        d={`M ${size * 0.25} ${size * 0.5} L ${size * 0.45} ${size * 0.7} L ${size * 0.75} ${size * 0.3}`}
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    )}
  </Svg>
);

// Checkbox Component - แสดงทั้ง checked และ unchecked
const CheckboxResult = ({ result, detail }) => {
  return (
    <View style={styles.resultContainer}>
      <View style={styles.checkboxRowHorizontal}>
        <View style={styles.resultRowItem}>
          <Checkbox checked={result === "ถูกต้อง"} size={10} />
          <Text style={styles.resultText}>ถูกต้อง</Text>
        </View>
        <View style={styles.resultRowItem}>
          <Checkbox checked={result === "ต้องแก้ไข"} size={10} />
          <Text style={styles.resultText}>ต้องแก้ไข</Text>
          {result === "ต้องแก้ไข" && detail && (
            <Text style={styles.detailDots}> {detail}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Header Component
const FormHeader = () => (
  <View style={styles.header}>
    <Image src={PEA_LOGO} style={styles.logo} />
    <View style={styles.headerTextContainer}>
      <Text style={styles.headerTitle}>การไฟฟ้าส่วนภูมิภาค</Text>
      <Text style={styles.headerSubtitle}>PROVINCIAL ELECTRICITY AUTHORITY</Text>
    </View>
  </View>
);

// Section 1: ข้อมูลทั่วไป
const GeneralInfoSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <View style={styles.boxed}>
      <View style={styles.row}>
        <Text style={styles.label}>ชื่อ นามสกุลผู้ใช้ไฟฟ้า (นาย / นาง / น.ส.)</Text>
        <Text style={styles.underlineLong}>{data?.customerName || " "}</Text>
        <Text style={styles.label}>โทรศัพท์</Text>
        <Text style={styles.underlineLong}>{data?.phone || " "}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>ที่อยู่</Text>
        <Text style={styles.underlineLong}>{data?.address || " "}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>ระบบไฟฟ้า:</Text>
        <Text style={styles.underline}>{data?.systemType || " "}</Text>
        <Text style={styles.label}>โหลดประมาณ</Text>
        <Text style={styles.underline}>{data?.load || " "}</Text>
        <Text style={styles.label}>แอมแปร์</Text>
        <Text style={styles.label}>ละติจูด</Text>
        <Text style={styles.underline}>{data?.latitude || " "}</Text>
        <Text style={styles.label}>ลองจิจูด</Text>
        <Text style={styles.underline}>{data?.longitude || " "}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>รูปบ้าน</Text>
        {data?.houseImage ? (
          <Image src={data.houseImage} style={{ width: 150, height: 120 }} />
        ) : (
          <Text style={styles.underline}>ไม่มีรูปภาพ</Text>
        )}
      </View>
    </View>
  </View>
);

// Section 2.1: สายดับประธานเข้าอาคาร
const MainConductorSection = ({ inspection }) => {
  const items = inspection?.items || [];
  const selectedWiringMethods = inspection?.selectedWiringMethods || [];
  
  const standardItem = items[0] || {};
  
  // หาข้อมูลของแต่ละ method จาก items array
  const overheadItem1 = items.find(item => item.label?.includes("สูงจากพื้นไม่น้อยกว่า 2.9 เมตร")) || {};
  const overheadItem2 = items.find(item => item.label?.includes("สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล") && item.label?.includes("1) สูงจากพื้น") === false) || {};
  const undergroundItem = items.find(item => item.label?.includes("สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล") && item.label?.includes("เดินสายฝังใต้ดิน")) || {};
  
  const wireType = inspection?.wireType || "";
  const wireOther = inspection?.wireOther || "";
  const wireSize = inspection?.wireSize || "";
  const wireResult = inspection?.wireResult || "";
  const wireDetail = inspection?.wireDetail || "";

  return (
    <View style={styles.subsection}>
      <Text style={styles.subsectionTitle}>2.1 สายตัวนำประธานเข้าอาคาร</Text>
      
      {/* ก) มาตรฐาน */}
      <View style={styles.item}>
        <Text style={styles.itemLabel}>ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502</Text>
        <CheckboxResult result={standardItem.result} detail={standardItem.detail} />
      </View>

      {/* ข) ชนิดและขนาด */}
      <View style={styles.item}>
        <Text style={styles.itemLabel}>ข) ชนิดและขนาด</Text>
        <View style={styles.wireTypeRow}>
          <View style={styles.optionRow}>
            <Checkbox checked={wireType === "iec01"} size={10} />
            <Text style={styles.optionText}>IEC 01</Text>
          </View>
          <View style={styles.optionRow}>
            <Checkbox checked={wireType === "nyy"} size={10} />
            <Text style={styles.optionText}>NYY</Text>
          </View>
          <View style={styles.optionRow}>
            <Checkbox checked={wireType === "cv"} size={10} />
            <Text style={styles.optionText}>CV</Text>
          </View>
          <View style={styles.optionRow}>
            <Checkbox checked={wireType === "other"} size={10} />
            <Text style={styles.optionText}>อื่นๆ</Text>
            <Text style={styles.underlineDotted}>{wireOther}</Text>
          </View>
        </View>
        <View style={styles.sizeRow}>
          <Text style={styles.label}>ขนาด</Text>
          <Text style={styles.underline}>{wireSize || " "}</Text>
          <Text style={styles.label}>ตร.มม.</Text>
        </View>
        <CheckboxResult result={wireResult} detail={wireDetail} />
      </View>

      {/* ค) วิธีการเดินสาย */}
      <View style={styles.item}>
        <Text style={styles.itemLabel}>ค) วิธีการเดินสาย</Text>

        {/* เดินสายบนลูกถ้วยฉนวนในอากาศ */}
        <View style={styles.methodSection}>
          <View style={styles.optionRow}>
            <Checkbox checked={selectedWiringMethods.includes("overhead")} size={10} />
            <Text style={styles.optionText}>เดินสายบนลูกถ้วยฉนวนในอากาศ</Text>
          </View>
          {selectedWiringMethods.includes("overhead") && (
            <View style={styles.subMethodDetails}>
              {/* ข้อ 1 */}
              <View style={styles.subItemRow}>
                <Text style={styles.subItemNumber}>1) </Text>
                <Text style={styles.subItemText}>สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตรถ้ามียานพาหนะลอดผ่าน</Text>
              </View>
              <View style={styles.checkboxDetailRow}>
                <View style={styles.resultRowItem}>
                  <Checkbox checked={overheadItem1?.result === "ถูกต้อง"} size={10} />
                  <Text style={styles.resultText}>ถูกต้อง</Text>
                </View>
                <View style={styles.resultRowItem}>
                  <Checkbox checked={overheadItem1?.result === "ต้องแก้ไข"} size={10} />
                  <Text style={styles.resultText}>ต้องแก้ไข</Text>
                  <Text style={styles.detailDots}>{overheadItem1?.detail}</Text>
                </View>
              </View>

              {/* ข้อ 2 */}
              <View style={styles.subItemRow}>
                <Text style={styles.subItemNumber}>2) </Text>
                <Text style={styles.subItemText}>สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล  </Text>
              </View>
              <View style={styles.checkboxDetailRow}>
                <View style={styles.resultRowItem}>
                  <Checkbox checked={overheadItem2?.result === "ถูกต้อง"} size={10} />
                  <Text style={styles.resultText}>ถูกต้อง</Text>
                </View>
                <View style={styles.resultRowItem}>
                  <Checkbox checked={overheadItem2?.result === "ต้องแก้ไข"} size={10} />
                  <Text style={styles.resultText}>ต้องแก้ไข</Text>
                  <Text style={styles.detailDots}>{overheadItem2?.detail}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* เดินสายฝังใต้ดิน */}
        <View style={styles.methodSection}>
          <View style={styles.optionRow}>
            <Checkbox checked={selectedWiringMethods.includes("underground")} size={10} />
            <Text style={styles.optionText}>เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)</Text>
          </View>
          {selectedWiringMethods.includes("underground") && (
            <View style={styles.subMethodDetails}>
              {/* ข้อ 1 */}
              <View style={styles.subItemRow}>
                <Text style={styles.subItemNumber}>1) </Text>
                <Text style={styles.subItemText}>สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล  </Text>
              </View>
              <View style={styles.checkboxDetailRow}>
                <View style={styles.resultRowItem}>
                  <Checkbox checked={undergroundItem?.result === "ถูกต้อง"} size={10} />
                  <Text style={styles.resultText}>ถูกต้อง</Text>
                </View>
                <View style={styles.resultRowItem}>
                  <Checkbox checked={undergroundItem?.result === "ต้องแก้ไข"} size={10} />
                  <Text style={styles.resultText}>ต้องแก้ไข</Text>
                  <Text style={styles.detailDots}>{undergroundItem?.detail}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// Section 2.2: เครื่องป้องกันกระแสเกิน
const ProtectionDeviceSection = ({ inspection }) => {
  const items = inspection?.items || [];
  const atSize = inspection?.atSize || "";
  
  const standardItem = items[3] || {};
  const sizingItem = items[4] || {};
  const currentItem = items[5] || {};

  return (
    <View style={styles.subsection}>
      <Text style={styles.subsectionTitle}>2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์(บริภัณฑ์ประธาน)</Text>
      
      <View style={styles.item}>
        <Text style={styles.itemLabel}>ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน <Text style={styles.highlight}>IEC60898</Text></Text>
        <CheckboxResult result={standardItem.result} detail={standardItem.detail} />
      </View>

      <View style={styles.item}>
        <View style={styles.sizeRow}>
          <Text style={styles.itemLabel}>ข) เซอร์กิตเบรกเกอร์สอดคล้องกับชนิดของสายไฟฟ้า ขนาด AT </Text>
          <Text style={styles.underline}>{atSize || " "}</Text>
          <Text style={styles.label}>A</Text>
        </View>
        <CheckboxResult result={sizingItem.result} detail={sizingItem.detail} />
      </View>

      <View style={styles.item}>
        <Text style={styles.itemLabel}>ค) ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)</Text>
        <CheckboxResult result={currentItem.result} detail={currentItem.detail} />
      </View>
    </View>
  );
};

// Section 2.3: ระบบการต่อสายดิน
const GroundingSection = ({ inspection }) => {
  const items = inspection?.items || [];
  const undergroundSize = inspection?.undergroundSize || "";
  
  const earthWireItem = items[6] || {};
  const resistanceItem = items[7] || {};
  const onePhaseItem = items[8] || {};
  const threePhaseItem = items[9] || {};

  return (
    <View style={styles.subsection}>
      <Text style={styles.subsectionTitle}>2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์</Text>
      
      <View style={styles.item}>
        <Text style={styles.itemLabel}>ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน</Text>
        <View style={styles.sizeRow}>
          <Text style={styles.itemLabel}>ขนาดสายต่อหลักดิน</Text>
          <Text style={styles.underline}>{undergroundSize || " "}</Text>
          <Text style={styles.label}>ตร.มม.</Text>
        </View>
        <CheckboxResult result={earthWireItem.result} detail={earthWireItem.detail} />
      </View>

      <View style={styles.item}>
        <Text style={styles.itemLabel}>ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่</Text>
        <Text style={styles.itemLabel}>ที่ยากในการปฏิบัติและการไฟฟ้าส่วนภูมิภาคเห็นชอบ ยอมให้ค่า</Text>
        <Text style={styles.itemLabel}>ความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการ</Text>
        <Text style={styles.itemLabel}>วัดแล้วมีค่าเกินให้ปักหลักดินเพิ่มอีก 1 แท่ง</Text>
        <CheckboxResult result={resistanceItem.result} detail={resistanceItem.detail} />
      </View>

      <View style={styles.item}>
        <Text style={styles.itemLabel}>ค) กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus)</Text>
        <Text style={styles.itemLabel}>และต่อสายนิวทรัล (Neutral Wire) ของตัวนำประธาน (Main Conductor)</Text>
        <Text style={styles.itemLabel}>เข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน</Text>
        <CheckboxResult result={onePhaseItem.result} detail={onePhaseItem.detail} />
      </View>

      <View style={styles.item}>
        <Text style={styles.itemLabel}>ง) กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน (Ground Bus)</Text>
        <Text style={styles.itemLabel}>และขั้วต่อสายนิวทรัล (Neutral Bus) โดยติดตั้งสายต่อหลักดิน</Text>
        <Text style={styles.itemLabel}>และสายดินบริภัณฑ์ ภายในแผงเมนสวิตช์</Text>
        <CheckboxResult result={threePhaseItem.result} detail={threePhaseItem.detail} />
      </View>
    </View>
  );
};

// Section 2.4: เครื่องตัดไฟรั่ว (RCD)
const RCDSection = ({ inspection }) => {
  const rcdResult = inspection?.rcdResult || "";
  const rcdNote = inspection?.rcdNote || "";

  return (
    <View style={styles.subsection}>
      <Text style={styles.subsectionTitle}>2.4 เครื่องตัดไฟรั่ว (RCD)</Text>
      
      <View style={styles.item}>
        <Text style={styles.itemLabel}>ติดตั้งเครื่องตัดไฟรั่ว ขนาดพิกัดกระแสรั่ว (IΔn) ไม่เกิน 30 mA</Text>
        <Text style={styles.itemLabel}>โดยติดตั้งในวงจรที่มีความเสี่ยง</Text>
        
        <View style={styles.checkboxRow}>
          <View style={styles.resultRowItem}>
            <Checkbox checked={rcdResult === "ถูกต้อง"} size={10} />
            <Text style={[styles.resultText, rcdResult === "ถูกต้อง" && styles.correctText]}>
              ถูกต้อง
            </Text>
          </View>
        </View>
        
        <View style={styles.optionRow}>
          <Checkbox checked={rcdResult === "ไม่ติดตั้ง"} size={10} />
          <Text style={[styles.optionText, rcdResult === "ไม่ติดตั้ง" && styles.warningText]}>
            ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว และผู้ตรวจสอบ
          </Text>
        </View>
        
        {rcdResult === "ไม่ติดตั้ง" && (
          <>
            <Text style={styles.itemLabel}>มาตรฐานได้แจ้งให้ผู้ขอใช้ไฟฟ้าหรือผู้แทนทราบถึงความเสี่ยง</Text>
            <Text style={styles.itemLabel}>จากการไม่ติดตั้งเครื่องตัดไฟรั่วแล้ว</Text>
            {rcdNote && (
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>หมายเหตุ: </Text>
                <Text style={styles.detailText}>{rcdNote}</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

// Section 2: การตรวจสอบ (2 คอลัมน์)
const InspectionSection = ({ inspection }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
    <View style={styles.twoColumns}>
      <View style={styles.leftColumn}>
        <MainConductorSection inspection={inspection} />
        <ProtectionDeviceSection inspection={inspection} />
      </View>
      <View style={styles.rightColumn}>
        <GroundingSection inspection={inspection} />
        <RCDSection inspection={inspection} />
      </View>
    </View>
  </View>
);

// Section 3: กรณีผู้ใช้ไฟฟ้าประเภทอื่น
const OtherTypeSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>3. กรณีผู้ใช้ไฟฟ้าประเภทอื่นอย่างอาคารที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ติดตั้งหม้อแปลงไฟฟ้าเพื่อรับไฟแรงสูง ให้ตรวจสอบ มาตรฐานการติดตั้งระบบไฟฟ้าในส่วนสูงเพิ่มเติมโดยใช้แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภท อื่นๆ นอกเหนือจากที่อยู่อาศัย</Text>
  </View>
);

// Section 4: สรุปผลการตรวจสอบ
const SummarySection = ({ summaryType }) => {
  // Add debugging
  console.log("SummarySection received:", summaryType);
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</Text>
      <View style={styles.checkboxColumn}>
        <View style={styles.optionRow}>
          <Checkbox checked={summaryType === "compliant"} size={10} />
          <Text style={styles.summaryText}>ติดตั้งมิเตอร์ได้</Text>
        </View>
        <View style={styles.optionRow}>
          <Checkbox checked={summaryType === "compliant_with_conditions"} size={10} />
          <Text style={styles.summaryText}>ติดตั้งมิเตอร์ได้ตามเงื่อนไข</Text>
        </View>
        <View style={styles.optionRow}>
          <Checkbox checked={summaryType === "non_compliant"} size={10} />
          <Text style={styles.summaryText}>ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์</Text>
        </View>
      </View>
    </View>
  );
};

// Section 5: ข้อเสนอแนะ
const SuggestionSection = ({ limitation }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>5. ข้อเสนอแนะข้อจำกัดในการตรวจสอบ  </Text>
    <View style={styles.noteBox}>
      <Text style={styles.noteText}>{limitation || " "}</Text>
    </View>
  </View>
);

// Section 6: สำหรับผู้ขอใช้ไฟฟ้ารับทราบ
const AcknowledgmentSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ  </Text>
    <View style={styles.acknowledgmentBox}>
      <Text style={styles.acknowledgmentText}>6.1 งานเดินสายและติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นอย่างอาคารที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน ต้องดำเนินการโดยผู้ขอใช้ไฟฟ้าเป็นผู้จัดหาการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งไฟฟ้าในอาคาร (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลัง</Text>
      <Text style={styles.acknowledgmentText}>6.2 ในกรณีที่การไฟฟ้าส่วนภูมิภาคเห็นชอบการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการในภายหลัง หรืออุปกรณ์สายเสื่อมคุณภาพในเวลาใดๆ ผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบเองในทันทีเพื่อความปลอดภัย</Text>
      <Text style={styles.acknowledgmentText}>6.3 สำหรับระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าในส่วนที่การไฟฟ้าส่วนภูมิภาคไม่สามารถตรวจสอบได้ ผู้ขอใช้ไฟฟ้าต้องจัดให้เป็นไปตามมาตรฐานการติดตั้งไฟฟ้าสำหรับประเทศไทย (ฉบับที่ กฟภ. เห็นชอบล่าสุด) หากเกิดความเสียหายผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</Text>
      <Text style={styles.acknowledgmentText}>6.4 หากเกิดความเสียหายใดๆ ที่เกิดจากการที่ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว (RCD) ในวงจรที่มีความเสี่ยง ผู้ขอใช้ไฟฟ้าต้องเป็นผู้รับผิดชอบแต่เพียงฝ่ายเดียว</Text>
    </View>
  </View>
);

// Signature Section
const SignatureSection = ({ signature }) => (
  <View style={styles.signatureSection}>
    <View style={styles.signatureRow}>
      <View style={styles.signatureBox}>
        {signature?.customerSign && (
          <Image src={signature.customerSign} style={styles.signatureImage} />
        )}
        <Text style={styles.signatureLabel}>ลงชื่อ.............................................ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
      </View>
      <View style={styles.signatureBox}>
        {signature?.officerSign && (
          <Image src={signature.officerSign} style={styles.signatureImage} />
        )}
        <Text style={styles.signatureLabel}>ลงชื่อ.............................................เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
      </View>
    </View>

    <View style={styles.recommendationBox}>
      <Text style={styles.recommendationTitle}>ข้อแนะนำ</Text>
      <Text style={styles.recommendationText}>1. ควรติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดพิกัดกระแสรั่ว (IΔn) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง เช่น บริเวณที่เป็นหย่อมชื้น ห้องน้ำ ห้องอาบน้ำ ห้องครัว ห้องใต้ถุน อ่างล้างมือ วงจรไฟฟ้าภายนอกอาคาร รวมทั้งวงจรย่อยสำหรับเครื่องทำน้ำอุ่น/อ่างอาบน้ำ</Text>
      <Text style={styles.recommendationText}>2. ควรติดตั้งสายดินกับบริภัณฑ์ไฟฟ้าเพื่อความปลอดภัย ในกรณีเกิดไฟฟ้ารั่ว หรือไฟฟ้าลัดวงจร</Text>
      <Text style={styles.recommendationText}>3. ควรติดตั้งระบบไฟฟ้าโดยช่างที่ได้รับหนังสือรับรองการผ่านทดสอบ มาตรฐานฝีมือแรงงานแห่งชาติ จากกรมพัฒนาฝีมือแรงงาน</Text>
    </View>
  </View>
);

// หน้า 3: ไดอะแกรม
const DiagramPage = () => (
  <Page size="A4" style={styles.page}>
    <Text style={styles.pageNumber}>หน้า 3/3</Text>
    
    <Text style={styles.diagramTitle}>รูปแบบการรับไฟฟ้าผ่านระบบจำหน่ายแรงต่ำ (400/230 โวลต์)</Text>
    <Text style={styles.diagramSubtitle}>สำหรับผู้ใช้ไฟฟ้าประเภทอื่นอย่างอาคารที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน</Text>
    
    <View style={styles.diagramContainer}>
      <Image src="/homediagram.png" style={{ width: 400, height: 200, marginBottom: 10 }} />
    </View>

    <View style={styles.requirementBox}>
      <Text style={styles.requirementTitle}>ข้อกำหนด</Text>
      <Text style={styles.requirementText}>1. สำหรับผู้ใช้ไฟฟ้าประเภทอื่นอย่างอาคารที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกันให้ใช้วิธีการตรวจสอบระบบไฟฟ้าตามมาตรฐาน 1 - 4</Text>
      <Text style={styles.requirementText}>2. นอกจากการตรวจสอบสายต่อหลักดินของแผง MDB ตามมาตรฐาน 4 แล้ว ให้ตรวจสอบระบบต่อลงดินภายในแผง MDB ร่วมด้วย</Text>
      <Text style={styles.requirementText}>3. ตรวจสอบว่ามีการติดตั้ง RCD ในวงจรที่มีความเสี่ยง หากผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้ง RCD ผู้ตรวจสอบมาตรฐานต้องแจ้งให้ผู้ขอใช้ไฟฟ้าหรือผู้แทนทราบถึงความเสี่ยงจากการไม่ติดตั้ง RCD และให้ผู้ขอใช้ไฟฟ้าหรือผู้แทนลงนามในแบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าด้วย</Text>
    </View>

    <View style={styles.recommendationBox}>
      <Text style={styles.recommendationTitle}>ข้อแนะนำ</Text>
      <Text style={styles.recommendationText}>1. ควรติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดพิกัดกระแสรั่ว (IΔn) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง เช่น บริเวณที่เป็นหย่อมชื้น ห้องน้ำ ห้องอาบน้ำ ห้องครัว ห้องใต้ถุน อ่างล้างมือ วงจรไฟฟ้าภายนอกอาคาร รวมทั้งวงจรย่อยสำหรับเครื่องทำน้ำอุ่น/อ่างอาบน้ำ</Text>
      <Text style={styles.recommendationText}>2. ควรติดตั้งสายดินกับบริภัณฑ์ไฟฟ้าเพื่อความปลอดภัย ในกรณีเกิดไฟฟ้ารั่ว หรือไฟฟ้าลัดวงจร</Text>
      <Text style={styles.recommendationText}>3. ควรติดตั้งระบบไฟฟ้าโดยช่างที่ได้รับหนังสือรับรองการผ่านทดสอบ มาตรฐานฝีมือแรงงานแห่งชาติ จากกรมพัฒนาฝีมือแรงงาน</Text>
    </View>

  </Page>
);

// Main Document Component
const HomeInspectionPDF = ({ formData }) => {
  // เพิ่ม debugging
  console.log("PDF formData:", formData);
  console.log("summary จาก DB:", formData?.summary);
  
  const safeData = {
    general: formData?.general || {},
    inspection: formData?.inspection || {},
    // แก้จาก summaryType เป็น summary ให้ตรงกับฐานข้อมูล
    summary: formData?.summary || {},
    limitation: formData?.limitation || "",
    signature: formData?.signature || {},
    otherTypeNotes: formData?.otherTypeNotes || "",
  };
  
  // ดึง summaryType จาก summary object
  const summaryType = safeData.summary?.summaryType || "";
  console.log("summaryType ที่จะส่งให้ checkbox:", summaryType);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <FormHeader />
        <Text style={styles.pageNumber}>หน้า 1/3</Text>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
          <Text style={styles.titleText}>สำหรับผู้ใช้ไฟฟ้าประเภทอื่นอย่างอาคารที่อยู่อาศัยหรืออาคารที่คล้ายคลึงกัน</Text>
          <Text style={styles.inspectionInfo}>
            การตรวจสอบครั้งที่ {safeData.general?.inspectionNo || "-"} วันที่ {safeData.general?.inspectionDate || "-"} การตรวจสอบตามคำร้องขอใช้ไฟเลขที่ {safeData.general?.requestNo || "-"} วันที่ {safeData.general?.requestDate || "-"}
          </Text>
        </View>

        <GeneralInfoSection data={safeData.general} />
        <InspectionSection inspection={safeData.inspection} />

      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.pageNumber}>หน้า 2/3</Text>
        
        <OtherTypeSection data={safeData} />
        <SummarySection summaryType={summaryType} />
        <SuggestionSection limitation={safeData.limitation} />
        <AcknowledgmentSection />
        <SignatureSection signature={safeData.signature} />

      </Page>

      <DiagramPage />
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    fontSize: 9,
    padding: 20,
    backgroundColor: "#fff",
    lineHeight: 1.3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
  headerTextContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 8,
    color: "#000",
    marginTop: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 6,
  },
  pageNumber: {
    position: "absolute",
    top: 15,
    right: 20,
    fontSize: 9,
  },
  companyField: {
    fontSize: 9,
    marginBottom: 6,
  },
  titleBox: {
    border: "1 solid #000",
    padding: 6,
    marginBottom: 8,
    textAlign: "center",
  },
  titleText: {
    fontSize: 9,
    marginBottom: 2,
  },
  inspectionInfo: {
    fontSize: 8,
    marginTop: 3,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  boxed: {
    border: "1 solid #000",
    padding: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    flexWrap: "wrap",
  },
  label: {
    fontSize: 8,
    marginRight: 3,
  },
  underline: {
    fontSize: 8,
    marginRight: 6,
    borderBottomWidth: 1,
    borderBottomStyle: "dotted",
    paddingBottom: 1,
  },
  underlineLong: {
    fontSize: 8,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomStyle: "dotted",
    paddingBottom: 1,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxSymbol: {
    fontSize: 10,
    marginRight: 3,
    color: "#000",
  },
  checkboxText: {
    fontSize: 8,
    color: "#000",
  },
  twoColumns: {
    flexDirection: "row",
    gap: 8,
  },
  leftColumn: {
    flex: 1,
    border: "1 solid #000",
    padding: 5,
  },
  rightColumn: {
    flex: 1,
    border: "1 solid #000",
    padding: 5,
  },
  subsection: {
    marginBottom: 2,
  },
  subsectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
  },
  item: {
    marginBottom: 6,
  },
  itemLabel: {
    fontSize: 8,
    marginBottom: 2,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    marginLeft: 3,
    flexWrap: "wrap",
  },
  checkboxRowHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    flexWrap: "wrap",
  },
  resultRowItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxDetailRow: {
    flexDirection: "column",
    marginLeft: 15,
    marginBottom: 3,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    marginLeft: 3,
  },
  underlineDotted: {
    fontSize: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "dotted",
    paddingBottom: 1,
    marginLeft: 2,
    minWidth: 60,
  },
  detailDots: {
    fontSize: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "dotted",
    paddingBottom: 1,
    marginLeft: 4,
  },
  indentedRow: {
    marginLeft: 10,
    marginBottom: 2,
  },
  methodSection: {
    marginBottom: 4,
  },
  subMethodDetails: {
    marginLeft: 15,
    marginTop: 2,
  },
  subItemRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  subItemNumber: {
    fontSize: 8,
    marginRight: 2,
  },
  subItemText: {
    fontSize: 8,
    flex: 1,
  },
  smallLabel: {
    fontSize: 7,
  },
  wireTypeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 3,
  },
  optionText: {
    fontSize: 8,
    marginRight: 6,
  },
  checkboxColumn: {
    flexDirection: "column",
    marginLeft: 10,
  },
  summaryText: {
    fontSize: 9,
  },
  resultContainer: {
    marginLeft: 10,
    marginTop: 2,
  },
  resultText: {
    fontSize: 8,
    marginRight: 4,
  },
  sizeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    marginLeft: 3,
  },
  highlight: {
    fontWeight: "bold",
  },
  redText: {
    color: "#dc2626",
  },
  noteBox: {
    border: "1 solid #000",
    padding: 6,
    minHeight: 35,
    marginTop: 3,
  },
  noteText: {
    fontSize: 8,
  },
  acknowledgmentBox: {
    border: "1 solid #000",
    padding: 6,
  },
  acknowledgmentText: {
    fontSize: 7,
    marginBottom: 4,
    lineHeight: 1.2,
  },
  signatureSection: {
    marginTop: 10,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  signatureBox: {
    flex: 1,
    marginHorizontal: 6,
  },
  signatureLabel: {
    fontSize: 8,
    marginBottom: 6,
  },
  signatureImage: {
    width: 80,
    height: 30,
    marginVertical: 6,
  },
  signatureDate: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 3,
  },
  recommendationBox: {
    border: "1 solid #000",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  recommendationTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
  },
  recommendationText: {
    fontSize: 7,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 7,
    color: "#666",
  },
  diagramTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
    marginTop: 15,
  },
  diagramSubtitle: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 10,
  },
  diagramContainer: {
    border: "1 solid #000",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  diagramElement: {
    fontSize: 8,
    marginVertical: 2,
    textAlign: "center",
  },
  arrow: {
    fontSize: 12,
    marginVertical: 1,
  },
  dashedLine: {
    borderTopWidth: 1,
    borderTopStyle: "dashed",
    width: "100%",
    marginVertical: 4,
  },
  systemBox: {
    border: "1 solid #000",
    padding: 8,
    marginVertical: 6,
    width: "100%",
  },
  systemTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 3,
  },
  systemItem: {
    fontSize: 7,
    marginBottom: 1,
  },
  requirementBox: {
    border: "1 solid #000",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  requirementTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
  },
  requirementText: {
    fontSize: 7,
    marginBottom: 2,
    lineHeight: 1.2,
  },
});

export default HomeInspectionPDF;