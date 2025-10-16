import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Register Sarabun font
Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
  ],
});

const PEA_LOGO = "/pea_logo.png";

// Checkbox Component - แสดง ☐ (ไม่ติ๊ก) และ ☑ (ติ๊ก)
const Checkbox = ({ checked = false, label }) => (
  <View style={styles.checkbox}>
    <Text style={styles.checkboxSymbol}>
      {checked ? "☑" : "☐"}
    </Text>
    {label && <Text style={styles.checkboxText}>{label}</Text>}
  </View>
);

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
        <Text style={styles.label}>ละติจูด</Text>
        <Text style={styles.underline}>{data?.latitude || " "}</Text>
        <Text style={styles.label}>ลองจิจูด</Text>
        <Text style={styles.underline}>{data?.longitude || " "}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>รูปบ้าน</Text>
        {data?.houseImage ? (
          <Image src={data.houseImage} style={{ width: 150, height: 130, objectFit: "cover", marginRight: 10 }} />
        ) : (
          <Text style={styles.underline} />
        )}
        <Text style={styles.label}>ระบบไฟฟ้า:</Text>
        <Text style={styles.underline}>{data?.systemType || " "}</Text>
        <Text style={styles.label}>โหลดประมาณ</Text>
        <Text style={styles.underline}>{data?.load || " "}</Text>
        <Text style={styles.label}>แอมแปร์</Text>
      </View>
    </View>
  </View>
);

// Section 2.1: สายดับประธานเข้าอาคาร
const MainConductorSection = ({ data }) => {
  const mainConductor = data?.mainConductor || {};
  return (
    <View style={styles.subsection}>
      <Text style={styles.subsectionTitle}>2.1 สายดับประธานเข้าอาคาร</Text>
      
      <View style={styles.item}>
        <Text style={styles.itemLabel}>ก) สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502</Text>
        <View style={styles.checkboxRow}>
          <Checkbox checked={mainConductor.result === "correct"} label="ถูกต้อง" />
          <Checkbox checked={mainConductor.result === "fix"} label="ต้องแก้ไข" />
        </View>
      </View>

      <View style={styles.item}>
        <Text style={styles.itemLabel}>ข) ชนิดและขนาด</Text>
        <View style={styles.checkboxRow}>
          <Checkbox checked={mainConductor.wireType === "IEC01"} label="IEC 01" />
          <Checkbox checked={mainConductor.wireType === "NYY"} label="NYY" />
          <Checkbox checked={mainConductor.wireType === "CV"} label="CV" />
          <Checkbox checked={mainConductor.wireOther === "other"} label="อื่นๆ" />
        </View>
        <View style={styles.sizeRow}>
          <Text style={styles.label}>ขนาด</Text>
          <Text style={styles.underline}>{mainConductor.size || " "}</Text>
          <Text style={styles.label}>ตร.มม.</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox checked={mainConductor.sizeResult === "correct"} label="ถูกต้อง" />
          <Checkbox checked={mainConductor.sizeResult === "fix"} label="ต้องแก้ไข" />
        </View>
      </View>

      <View style={styles.item}>
        <Text style={styles.itemLabel}>ค) วิธีการเดินสาย</Text>
        <View style={styles.indentedRow}>
          <Checkbox checked={mainConductor.installation === "overhead"} label="เดินสายบนลูกถ้วยฉนวนใต้อากาศ" />
        </View>
        <View style={styles.indentedRow}>
          <Text style={styles.smallLabel}>1) ความสูงไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตร กำหนดขึ้นกับขนาดผ่านศูนย์กลาง</Text>
        </View>
        <View style={styles.indentedRow}>
          <Text style={styles.smallLabel}>ตัวนำพบขนาดเส้นผ่านศูนย์กลางตัวนำไฟฟ้ามากกว่า</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox checked={mainConductor.overheadResult === "correct"} label="ถูกต้อง" />
          <Checkbox checked={mainConductor.overheadResult === "fix"} label="ต้องแก้ไข" />
        </View>
        
        <View style={styles.indentedRow}>
          <Text style={styles.smallLabel}>2) สายดับประธานห้ามหย่อนหรือห้ามพาดข้ามมากเกินไป</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox checked={mainConductor.sagResult === "correct"} label="ถูกต้อง" />
          <Checkbox checked={mainConductor.sagResult === "fix"} label="ต้องแก้ไข" />
        </View>

        <View style={styles.indentedRow}>
          <Checkbox checked={mainConductor.installation === "underground"} label="เดินสายใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)" />
        </View>
        <View style={styles.indentedRow}>
          <Text style={styles.smallLabel}>1) สายดับประธานห้ามหย่อนหรือห้ามพาดข้ามมากเกินไป</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox checked={mainConductor.undergroundResult === "correct"} label="ถูกต้อง" />
          <Checkbox checked={mainConductor.undergroundResult === "fix"} label="ต้องแก้ไข" />
        </View>
      </View>
    </View>
  );
};

// Section 2.2: เครื่องป้องกันกระแสเกิน
const ProtectionDeviceSection = ({ data }) => {
  const protection = data?.protection || {};
  return (
    <View style={styles.subsection}>
      <Text style={styles.subsectionTitle}>2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์(บริเวณต่อประธาน)</Text>
      
      <View style={styles.item}>
        <Text style={styles.itemLabel}>ก) เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898 หรือ ที่เทียบเท่า IEC60947-2</Text>
        <View style={styles.checkboxRow}>
          <Checkbox checked={protection.standard === "correct"} label="ถูกต้อง" />
          <Checkbox checked={protection.standard === "fix"} label="ต้องแก้ไข" />
        </View>
      </View>

      <View style={styles.item}>
        <Text style={styles.itemLabel}>ข) เซอร์กิตเบรกเกอร์สอดคล้องกับชนิดของสายไฟฟ้า ขนาด AT</Text>
        <Text style={styles.underline}>{protection.atSize || " "}</Text>
        <Text style={styles.label}>A</Text>
        <View style={styles.checkboxRow}>
          <Checkbox checked={protection.sizing === "correct"} label="ถูกต้อง" />
          <Checkbox checked={protection.sizing === "fix"} label="ต้องแก้ไข" />
        </View>
      </View>

      <View style={styles.item}>
        <Text style={styles.itemLabel}>ค) ขนาดกระแสตัดวงจรสูงสุดไม่เกิน 10 กิโลแอมแปร์ (kA)</Text>
        <View style={styles.checkboxRow}>
          <Checkbox checked={protection.current === "correct"} label="ถูกต้อง" />
          <Checkbox checked={protection.current === "fix"} label="ต้องแก้ไข" />
        </View>
      </View>
    </View>
  );
};

// Section 2.3: ระบบการต่อสายดิน
const GroundingSection = ({ data }) => (
  <View style={styles.subsection}>
    <Text style={styles.subsectionTitle}>2.3 ระบบการต่อสายดินที่แผงเมนสวิตช์</Text>
    
    <View style={styles.item}>
      <Text style={styles.itemLabel}>ก) ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายดับประธาน</Text>
      <Text style={styles.itemLabel}>ขนาดสายต่อหลักดิน</Text>
      <Text style={styles.underline}>{data?.grounding?.earthWireSize }</Text>
      <Text style={styles.label}>ตร.มม.</Text>
      <View style={styles.checkboxRow}>
        <Checkbox checked={data?.grounding?.earthWireSizeResult === "correct"} label="ถูกต้อง" />
        <Checkbox checked={data?.grounding?.earthWireSizeResult === "fix"} label="ต้องแก้ไข" />
      </View>
    </View>

    <View style={styles.item}>
      <Text style={styles.itemLabel}>ข) ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม ยกเว้นพื้นที่</Text>
      <Text style={styles.itemLabel}>ที่ยากในการปฏิบัติและการไฟฟ้าส่วนภูมิภาคเห็นชอบ ยอมให้ค่า</Text>
      <Text style={styles.itemLabel}>ความต้านทานของหลักดินกับดินต้องไม่เกิน 25 โอห์ม หากทำการ</Text>
      <Text style={styles.itemLabel}>วัดแล้วมีค่าเกินให้ปักหลักดินเพิ่มอีก 1 แท่ง</Text>
      <View style={styles.checkboxRow}>
        <Checkbox checked={data?.grounding?.resistance === "correct"} label="ถูกต้อง" />
        <Checkbox checked={data?.grounding?.resistance === "fix"} label="ต้องแก้ไข" />
      </View>
    </View>

    <View style={styles.item}>
      <Text style={styles.itemLabel}>ค) กรณีระบบไฟฟ้า 1 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน</Text>
      <Text style={styles.itemLabel}>(Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Wire) ของสายดินกับตัว</Text>
      <Text style={styles.itemLabel}>ประธาน (Main Conductor) เข้าขั้วต่อสายดินก่อนเข้าเบรกเกอร์ของ</Text>
      <Text style={styles.itemLabel}>ประธาน (Main Circuit Breaker) ตามที่ กฟภ. กำหนด</Text>
      <View style={styles.checkboxRow}>
        <Checkbox checked={data?.grounding?.singlePhaseConnection === "correct"} label="ถูกต้อง" />
        <Checkbox checked={data?.grounding?.singlePhaseConnection === "fix"} label="ต้องแก้ไข" />
      </View>
    </View>

    <View style={styles.item}>
      <Text style={styles.itemLabel}>ง) กรณีระบบไฟฟ้า 3 เฟส แผงเมนสวิตช์ต้องมีขั้วต่อสายดิน</Text>
      <Text style={styles.itemLabel}>(Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) โดยเชื่อม</Text>
      <Text style={styles.itemLabel}>สายต่อหลักดินและสายต่อดินเบรกเกอร์ ภายในแผงเมนสวิตช์ ตามที่</Text>
      <Text style={styles.itemLabel}>กฟภ. กำหนด</Text>
      <View style={styles.checkboxRow}>
        <Checkbox checked={data?.grounding?.threePhaseConnection === "correct"} label="ถูกต้อง" />
        <Checkbox checked={data?.grounding?.threePhaseConnection === "fix"} label="ต้องแก้ไข" />
      </View>
    </View>
  </View>
);

// Section 2.4: เครื่องตัดไฟรั่ว (RCD)
const RCDSection = ({ data }) => (
  <View style={styles.subsection}>
    <Text style={styles.subsectionTitle}>2.4 เครื่องตัดไฟรั่ว (RCD)</Text>
    
    <View style={styles.item}>
      <Text style={styles.itemLabel}>ติดตั้งเครื่องตัดไฟรั่ว ขนาดกำหนดกระแสรั่ว (IΔn) ไม่เกิน 30 mA</Text>
      <Text style={styles.itemLabel}>โดยติดตั้งในวงจรที่มีความเสี่ยง</Text>
      <View style={styles.checkboxRow}>
        <Checkbox checked={data?.rcd?.installed === true} label="ถูกต้อง" />
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox checked={data?.rcd?.installed === false} label="ผู้ขอใช้ไฟฟ้าไม่ประสงค์ติดตั้งเครื่องตัดไฟรั่ว และผู้ตรวจสอบ" />
      </View>
      <Text style={styles.itemLabel}>มาตรฐานได้แจ้งให้ผู้ขอใช้ไฟฟ้าหรือผู้แทนทราบถึงความเสี่ยง</Text>
      <Text style={styles.itemLabel}>จากการไม่ติดตั้งเครื่องตัดไฟรั่วแล้ว</Text>
    </View>
  </View>
);

// Section 2: การตรวจสอบ (2 คอลัมน์)
const InspectionSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. การตรวจสอบ</Text>
    <View style={styles.twoColumns}>
      <View style={styles.leftColumn}>
        <MainConductorSection data={data} />
        <ProtectionDeviceSection data={data} />
      </View>
      <View style={styles.rightColumn}>
        <GroundingSection data={data} />
        <RCDSection data={data} />
      </View>
    </View>
  </View>
);

// Section 3: กรณีผู้ใช้ไฟฟ้าประเภทอื่น
const OtherTypeSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>3. กรณีผู้ใช้ไฟฟ้าประเภทอื่นยอมที่อำนวยให้อาคารที่คล้ายคลึงกัน ติดตั้งหม้อแปลงไฟฟ้าเพื่อรับไฟแรงสูง ให้ตรวจสอบ มาตรฐานการติดตั้งระบบไฟฟ้าในส่วนสูงเพิ่มเติมโดยใช้แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภท อื่นๆ นอกเหนือจากที่อยู่อาศัย</Text>
    <View style={styles.noteBox}>
      <Text style={styles.noteText}>{data?.otherTypeNotes }</Text>
    </View>
  </View>
);

// Section 4: สรุปผลการตรวจสอบ
const SummarySection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>4. สรุปผลการตรวจสอบการติดตั้งระบบไฟฟ้า</Text>
    <View style={styles.checkboxRow}>
      <Checkbox checked={data?.summaryType === "compliant"} label="ติดตั้งมิเตอร์ได้" />
      <Checkbox checked={data?.summaryType === "compliant_with_conditions"} label="ติดตั้งมิเตอร์ได้ตามเงื่อนไข" />
      <Checkbox checked={data?.summaryType === "non_compliant"} label="ต้องปรับปรุงแก้ไขก่อนติดตั้งมิเตอร์" />
    </View>
  </View>
);

// Section 5: ข้อเสนอแนะ
const SuggestionSection = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>5. ข้อเสนอแนะข้อจำกัดในการตรวจสอบ</Text>
    <View style={styles.noteBox}>
      <Text style={styles.noteText}>{data?.limitation}</Text>
    </View>
  </View>
);

// Section 6: สำหรับผู้ขอใช้ไฟฟ้ารับทราบ
const AcknowledgmentSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>6. สำหรับผู้ขอใช้ไฟฟ้ารับทราบ</Text>
    <View style={styles.acknowledgmentBox}>
      <Text style={styles.acknowledgmentText}>6.1 งานเดินสายและติดตั้งระบบไฟฟ้าสำหรับผู้ใช้ไฟฟ้าประเภทอื่นยอมที่อำนวยให้อาคารที่คล้ายคลึงกัน ต้องตามมาตรฐานที่ผู้ขอใช้ไฟฟ้าเป็นผู้จัดหาการก่อสร้างและติดตั้งเอง การไฟฟ้าส่วนภูมิภาคตรวจสอบการติดตั้งระบบไฟฟ้าของผู้ขอใช้ไฟฟ้าให้เป็นไปตามมาตรฐานการติดตั้งไฟฟ้าในอาคาร (ฉบับที่ กฟภ. เห็นชอบล่าสุด) และแม้ว่าการไฟฟ้าส่วนภูมิภาคได้ทำการตรวจสอบแล้วก็ตาม หากเกิดความเสียหายหรือมีอันตรายเกิดขึ้นภายหลัง</Text>
      <Text style={styles.acknowledgmentText}>6.2 ในกรณีทำการไฟฟ้าส่วนภูมิภาคเห็นชอบการก่อสร้างให้ ถ้ามีการเปลี่ยนแปลงโดยที่ผู้ขอใช้ไฟฟ้าเป็นผู้ดำเนินการในภายหลัง หรืออุปกรณ์ลืกสายเสื่อมคุณภาพในเวลาใดๆ ผู้ขอใช้ไฟฟ้าจะต้องเป็นผู้รับผิดชอบเองในทันทีเพื่อความปลอดภัย</Text>
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
        <Text style={styles.signatureLabel}>ลงชื่อ.............................................ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
        {signature?.customerSign && (
          <Image src={signature.customerSign} style={styles.signatureImage} />
        )}
        <Text style={styles.signatureDate}>(...............................................)</Text>
      </View>
      <View style={styles.signatureBox}>
        <Text style={styles.signatureLabel}>ลงชื่อ.............................................เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
        {signature?.officerSign && (
          <Image src={signature.officerSign} style={styles.signatureImage} />
        )}
        <Text style={styles.signatureDate}>(...............................................)</Text>
      </View>
    </View>

    {/* ข้อแนะนำ */}
    <View style={styles.recommendationBox}>
      <Text style={styles.recommendationTitle}>ข้อแนะนำ</Text>
      <Text style={styles.recommendationText}>1. ควรติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดกำหนดกระแสรั่ว (IΔn) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง เช่น บริเวณที่เป็นหย่อมชื้น ห้องน้ำ ห้องอาบน้ำ ห้องครัว ห้องใต้ถุน อ่างล้างมือ วงจรไฟฟ้าภายนอกอาคาร รวมทั้งวงจร ย่อยสำหรับเครื่องทำน้ำอุ่น/อ่างอาบน้ำ</Text>
      <Text style={styles.recommendationText}>2. ควรติดตั้งสายดินกับบริภัณฑ์ไฟฟ้าเพื่อความปลอดภัย ในกรณีเกิดไฟฟ้ารั่ว หรือไฟฟ้าดูดวงจร</Text>
      <Text style={styles.recommendationText}>3. ควรติดตั้งระบบไฟฟ้าโดยช่างที่ได้รับหนังสือรับรองการผ่านทดสอบ มาตรฐานฝีมือแรงงานแห่งชาติ จากกรมพัฒนาฝีมือแรงงาน</Text>
    </View>
  </View>
);

// หน้า 3: ไดอะแกรม
const DiagramPage = () => (
  <Page size="A4" style={styles.page}>
    <Text style={styles.pageNumber}>หน้า 3/3</Text>
    
    <Text style={styles.diagramTitle}>รูปแบบการรับไฟฟ้าผ่านระบบจำหน่ายแรงต่ำ (400/230 โวลต์)</Text>
    <Text style={styles.diagramSubtitle}>สำหรับผู้ใช้ไฟฟ้าประเภทอื่นยอมที่อำนวยให้อาคารที่คล้ายคลึงกัน</Text>
    
    {/* ไดอะแกรมรูปภาพ */}
    <View style={styles.diagramContainer}>
      <Image src="/homediagram.png" style={{ width: 400, height: 200, marginBottom: 10 }} />
    </View>

    {/* ข้อกำหนด */}
    <View style={styles.requirementBox}>
      <Text style={styles.requirementTitle}>ข้อกำหนด</Text>
      <Text style={styles.requirementText}>1. สำหรับผู้ใช้ไฟฟ้าประเภทอื่นยอมที่อำนวยให้อาคารที่คล้ายคลึงกันให้ใช้วิธีการตรวจสอบระบบไฟฟ้าตามมาตรการ 1 - 4</Text>
      <Text style={styles.requirementText}>2. นอกจากการตรวจสอบสายต่อหลักดินของแผง MDB ตามมาตรการ 4 แล้ว ให้ตรวจสอบระบบต่อลงดินภายในแผง MDB ร่วมด้วย</Text>
      <Text style={styles.requirementText}>3. ตรวจสอบว่ามีการติดตั้ง RCD ในวงจรที่มีความเสี่ยง หากผู้ขอใช้ไฟฟ้า ไม่ประสงค์ติดตั้ง RCD ผู้ตรวจสอบมาตรฐานต้องแจ้งให้ผู้ขอใช้ไฟฟ้าหรือ ผู้แทนทราบถึงความเสี่ยงจากการไม่ติดตั้ง RCD และให้ผู้ขอใช้ไฟฟ้าหรือ ผู้แทนลงนามในแบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าด้วย</Text>
    </View>

    {/* ข้อแนะนำ */}
    <View style={styles.recommendationBox}>
      <Text style={styles.recommendationTitle}>ข้อแนะนำ</Text>
      <Text style={styles.recommendationText}>1. ควรติดตั้งเครื่องตัดไฟรั่ว (RCD) ขนาดกำหนดกระแสรั่ว (IΔn) ไม่เกิน 30 mA โดยติดตั้งในวงจรที่มีความเสี่ยง เช่น บริเวณที่เป็นหย่อมชื้น ห้องน้ำ ห้องอาบน้ำ ห้องครัว ห้องใต้ถุน อ่างล้างมือ วงจรไฟฟ้าภายนอกอาคาร รวมทั้งวงจร ย่อยสำหรับเครื่องทำน้ำอุ่น/อ่างอาบน้ำ</Text>
      <Text style={styles.recommendationText}>2. ควรติดตั้งสายดินกับบริภัณฑ์ไฟฟ้าเพื่อความปลอดภัย ในกรณีเกิดไฟฟ้ารั่ว หรือไฟฟ้าดูดวงจร</Text>
      <Text style={styles.recommendationText}>3. ควรติดตั้งระบบไฟฟ้าโดยช่างที่ได้รับหนังสือรับรองการผ่านทดสอบ มาตรฐานฝีมือแรงงานแห่งชาติ จากกรมพัฒนาฝีมือแรงงาน</Text>
    </View>

    <Text style={styles.footer}>กมฟ.ผสม.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอื่นยอมที่อำนวยให้อาคารที่คล้ายคลึงกัน)</Text>
  </Page>
);

// Main Document Component
const HomeInspectionPDF = ({ formData }) => {
  const safeData = {
    general: formData?.general || {},
    inspection: formData?.inspection || {},
    summaryType: formData?.summaryType || "",
    limitation: formData?.limitation || "",
    signature: formData?.signature || {},
    otherTypeNotes: formData?.otherTypeNotes || "",
  };

  return (
    <Document>
      {/* หน้า 1 */}
        <Page size="A4" style={styles.page}>
          <FormHeader />
          <View style={styles.divider} />
          <Text style={styles.pageNumber}>หน้า 1/3</Text>
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>แบบฟอร์มตรวจสอบการติดตั้งระบบไฟฟ้าภายในของผู้ใช้ไฟฟ้าก่อนติดตั้งมิเตอร์</Text>
            <Text style={styles.titleText}>สำหรับผู้ใช้ไฟฟ้าประเภทอื่นยอมที่อำนวยให้อาคารที่คล้ายคลึงกัน</Text>
            <Text style={styles.inspectionInfo}>
          การตรวจสอบครั้งที่ {safeData.inspection?.inspectionNumber || ""} วันที่ {safeData.inspection?.inspectionDate || ""} การตรวจสอบตามคำร้องขอใช้ไฟเลขที่ {safeData.inspection?.requestNumber || ""} วันที่ {safeData.inspection?.requestDate || ""}
            </Text>
          </View>

          <GeneralInfoSection data={safeData.general} />
          <InspectionSection data={safeData.inspection} />

          <Text style={styles.footer}>กมฟ.ผสม.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอื่นยอมที่อำนวยให้อาคารที่คล้ายคลึงกัน)</Text>
        </Page>

        {/* หน้า 2 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageNumber}>หน้า 2/3</Text>
        
        <OtherTypeSection data={safeData} />
        <SummarySection data={safeData} />
        <SuggestionSection data={safeData} />
        <AcknowledgmentSection />
        <SignatureSection signature={safeData.signature} />

        <Text style={styles.footer}>กมฟ.ผสม.-01-63 (แบบฟอร์มตรวจสอบฯ สำหรับผู้ใช้ไฟฟ้าประเภทอื่นยอมที่อำนวยให้อาคารที่คล้ายคลึงกัน)</Text>
      </Page>

      {/* หน้า 3: ไดอะแกรม */}
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
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
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
  indentedRow: {
    marginLeft: 10,
    marginBottom: 2,
  },
  smallLabel: {
    fontSize: 7,
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