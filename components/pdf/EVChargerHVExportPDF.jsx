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

const PEA_LOGO = "/images/pea-logo.png";

// Section: ข้อมูลทั่วไป
const GeneralInfoHvSection = ({ general }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. ข้อมูลทั่วไป</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>การไฟฟ้า:</Text>
      <Text style={styles.infoValue}>{general?.powerAuthority || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>การตรวจสอบครั้งที่:</Text>
      <Text style={styles.infoValue}>{general?.inspectionNo || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>วันที่ตรวจสอบ:</Text>
      <Text style={styles.infoValue}>{general?.inspectionDate || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>การตรวจสอบตามคำร้องขอใช้ไฟเลขที่:</Text>
      <Text style={styles.infoValue}>{general?.requestNo || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>วันที่คำร้อง:</Text>
      <Text style={styles.infoValue}>{general?.requestDate || "-"}</Text>
    </View>
    {general?.userType === "corp" ? (
      <>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ชื่อนิติบุคคล:</Text>
          <Text style={styles.infoValue}>{general?.corpName || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>โทรศัพท์ (นิติบุคคล):</Text>
          <Text style={styles.infoValue}>{general?.corpPhone || "-"}</Text>
        </View>
      </>
    ) : (
      <>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ชื่อ-นามสกุลผู้ขอใช้ไฟฟ้า:</Text>
          <Text style={styles.infoValue}>{general?.customerName || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>โทรศัพท์:</Text>
          <Text style={styles.infoValue}>{general?.phone || "-"}</Text>
        </View>
      </>
    )}
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ที่อยู่:</Text>
      <Text style={styles.infoValue}>{general?.address || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ระบบไฟฟ้า:</Text>
      <Text style={styles.infoValue}>
        {general?.systemType === "22kv"
          ? "22 kV"
          : general?.systemType === "33kv"
          ? "33 kV"
          : "-"}
      </Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>กระแสโหลดรวมโดยประมาณ (A):</Text>
      <Text style={styles.infoValue}>{general?.load || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>จำนวนเครื่องอัดประจุ:</Text>
      <Text style={styles.infoValue}>{general?.evChargerCount || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>พิกัดกำลังไฟฟ้ารวม (kW):</Text>
      <Text style={styles.infoValue}>{general?.evChargerPower || "-"}</Text>
    </View>
  </View>
);

// Section: เอกสารประกอบ
const DocumentSection = ({ documents }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. เอกสารประกอบการตรวจสอบ</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>เอกสารรับรองการออกแบบระบบไฟฟ้า:</Text>
      <Text style={styles.infoValue}>
        {documents?.electricalDocument === "has"
          ? "ครบถ้วน"
          : documents?.electricalDocument === "none"
          ? "ไม่ครบถ้วน"
          : "-"}
      </Text>
    </View>
  </View>
);

// Section: ระบบจำหน่ายแรงสูง (ตัวอย่างแสดงเฉพาะบางหัวข้อ)
const HVSystemSection = ({ hvSystem }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>3. ระบบจำหน่ายแรงสูง</Text>
    <Text style={{ fontWeight: "bold", marginTop: 6 }}>3.1 ระบบจำหน่ายเหนือดิน</Text>
    {[...Array(11)].map((_, i) => {
      const key = `3.1_${i + 1}`;
      const item = hvSystem?.[key] || {};
      return (
        <View style={styles.infoRow} key={key}>
          <Text style={styles.infoLabel}>{item.text || `3.1.${i + 1}`}</Text>
          <Text style={styles.infoValue}>
            {item.result === "correct"
              ? "✓ ถูกต้อง"
              : item.result === "fix"
              ? "✗ ต้องแก้ไข"
              : "-"}
            {item.detail ? ` (${item.detail})` : ""}
          </Text>
        </View>
      );
    })}
    <Text style={{ fontWeight: "bold", marginTop: 10 }}>3.2 ระบบจำหน่ายใต้ดิน</Text>
    {[...Array(7)].map((_, i) => {
      const key = `3.2_${i + 1}`;
      const item = hvSystem?.[key] || {};
      return (
        <View style={styles.infoRow} key={key}>
          <Text style={styles.infoLabel}>{item.text || `3.2.${i + 1}`}</Text>
          <Text style={styles.infoValue}>
            {item.result === "correct"
              ? "✓ ถูกต้อง"
              : item.result === "fix"
              ? "✗ ต้องแก้ไข"
              : "-"}
            {item.detail ? ` (${item.detail})` : ""}
          </Text>
        </View>
      );
    })}
    <Text style={{ fontWeight: "bold", marginTop: 10 }}>3.3 การติดตั้งเครื่องปลดวงจรต้นทาง</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ผลตรวจ:</Text>
      <Text style={styles.infoValue}>
        {hvSystem?.hv33?.result === "correct"
          ? "✓ ถูกต้อง"
          : hvSystem?.hv33?.result === "fix"
          ? "✗ ต้องแก้ไข"
          : "-"}
        {hvSystem?.hv33?.detail ? ` (${hvSystem.hv33.detail})` : ""}
      </Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ประเภทอุปกรณ์:</Text>
      <Text style={styles.infoValue}>
        {Array.isArray(hvSystem?.hv33?.type)
          ? hvSystem.hv33.type
              .map((t) =>
                t === "dropout"
                  ? "ดรอพเอาท์ฟิวส์คัตเอาท์"
                  : t === "switch"
                  ? `สวิตช์ตัดตอน (${hvSystem.hv33.switchType || "-"})`
                  : t === "rmu"
                  ? "RMU"
                  : t
              )
              .join(", ")
          : "-"}
      </Text>
    </View>
    <Text style={{ fontWeight: "bold", marginTop: 10 }}>3.4 อื่นๆ</Text>
    <Text style={{ marginLeft: 12 }}>{hvSystem?.other || "-"}</Text>
  </View>
);

// Section: หม้อแปลง (รองรับหลายลูก)
const TransformersSection = ({ transformers }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>4. หม้อแปลง</Text>
    {Array.isArray(transformers) && transformers.length > 0 ? (
      transformers.map((tr, idx) => {
        const t = tr.transformerData || {};
        return (
          <View key={idx} style={{ marginBottom: 16, paddingLeft: 8 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 2 }}>
              หม้อแปลงเครื่องที่ {idx + 1}
            </Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ผลการทดสอบ:</Text>
              <Text style={styles.infoValue}>
                {t.general?.testResult === "pass"
                  ? "✓ ผ่านการทดสอบ"
                  : t.general?.testResult === "fail"
                  ? "✗ ไม่ผ่านการทดสอบ"
                  : "-"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ขนาด (kVA):</Text>
              <Text style={styles.infoValue}>{t.general?.capacity || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>พิกัดแรงดันด้านแรงสูง (kV):</Text>
              <Text style={styles.infoValue}>{t.general?.hvVoltage || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>พิกัดแรงดันด้านแรงต่ำ (V):</Text>
              <Text style={styles.infoValue}>{t.general?.lvVoltage || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>% Impedance:</Text>
              <Text style={styles.infoValue}>{t.general?.impedance || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ชนิด:</Text>
              <Text style={styles.infoValue}>
                {t.general?.transformerType === "oil"
                  ? "Oil"
                  : t.general?.transformerType === "dry"
                  ? "Dry"
                  : t.general?.transformerType === "other"
                  ? `อื่นๆ (${t.general?.transformerTypeOther || "-"})`
                  : "-"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vector Group:</Text>
              <Text style={styles.infoValue}>{t.general?.vectorGroup || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>พิกัดการทนกระแสลัดวงจรสูงสุด (kA):</Text>
              <Text style={styles.infoValue}>{t.general?.shortCircuitCurrent || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ผลตรวจ:</Text>
              <Text style={styles.infoValue}>
                {t.general?.correct?.result === "correct"
                  ? "✓ ถูกต้อง"
                  : t.general?.correct?.result === "fix"
                  ? "✗ ต้องแก้ไข"
                  : "-"}
                {t.general?.correct?.detail ? ` (${t.general.correct.detail})` : ""}
              </Text>
            </View>
            {/* ... เพิ่มหัวข้อ 4.2-4.9 ตาม schema ... */}
            <Text style={{ marginTop: 6 }}>อื่นๆ: {t.other || "-"}</Text>
          </View>
        );
      })
    ) : (
      <Text>-</Text>
    )}
  </View>
);

// Section: ระบบไฟฟ้าแรงต่ำ
const LVSystemSection = ({ LVSystemPEA }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>5. ระบบไฟฟ้าแรงต่ำ</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>มาตรฐานสายเมน:</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.standard || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ขนาดสายเมน (ตารางมิลลิเมตร):</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.cableSize || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ชนิดสายเมน:</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.cableType || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ความยาวสายเมน (เมตร):</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.cableLength || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>กระแสไฟฟ้าสูงสุดที่อนุญาต (A):</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.maxCurrent || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>แรงดันไฟฟ้าสูงสุดที่อนุญาต (V):</Text>
      <Text style={styles.infoValue}>{LVSystemPEA?.maxVoltage || "-"}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>การต่อสายดิน:</Text>
      <Text style={styles.infoValue}>
        {LVSystemPEA?.grounding === "yes"
          ? "✓ มีการต่อสายดิน"
          : LVSystemPEA?.grounding === "no"
          ? "✗ ไม่มีการต่อสายดิน"
          : "-"}
      </Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ผลตรวจ:</Text>
      <Text style={styles.infoValue}>
        {LVSystemPEA?.correct?.result === "correct"
          ? "✓ ถูกต้อง"
          : LVSystemPEA?.correct?.result === "fix"
          ? "✗ ต้องแก้ไข"
          : "-"}
        {LVSystemPEA?.correct?.detail ? ` (${LVSystemPEA.correct.detail})` : ""}
      </Text>
    </View>
  </View>
);

// Section: แผงวงจร (Panel Board)
const PanelSection = ({ panel }) => (
  panel?.hasPanelBoard ? (
    <View style={styles.section} break>
      <Text style={styles.sectionTitle}>6. แผงวงจร (Panel Board)</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>มาตรฐานแผงวงจร:</Text>
        <Text style={styles.infoValue}>{panel?.standard || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ขนาดแผงวงจร (ตารางมิลลิเมตร):</Text>
        <Text style={styles.infoValue}>{panel?.size || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ชนิดแผงวงจร:</Text>
        <Text style={styles.infoValue}>{panel?.type || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ตำแหน่งติดตั้ง:</Text>
        <Text style={styles.infoValue}>{panel?.installationLocation || "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ผลตรวจ:</Text>
        <Text style={styles.infoValue}>
          {panel?.correct?.result === "correct"
            ? "✓ ถูกต้อง"
            : panel?.correct?.result === "fix"
            ? "✗ ต้องแก้ไข"
            : "-"}
          {panel?.correct?.detail ? ` (${panel.correct.detail})` : ""}
        </Text>
      </View>
    </View>
  ) : null
);

// Section: วงจรย่อย (Sub Circuits)
const SubCircuitsSection = ({ subCircuits }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>7. วงจรย่อย</Text>
    {Array.isArray(subCircuits) && subCircuits.length > 0 ? (
      subCircuits.map((circuit, idx) => (
        <View key={idx} style={{ marginBottom: 10, paddingLeft: 8 }}>
          <Text style={{ fontWeight: "bold" }}>วงจรที่ {circuit.circuitNo || idx + 1}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>มาตรฐานสาย:</Text>
            <Text style={styles.infoValue}>{circuit?.standard || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ขนาดสาย (ตารางมิลลิเมตร):</Text>
            <Text style={styles.infoValue}>{circuit?.cableSize || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ชนิดสาย:</Text>
            <Text style={styles.infoValue}>{circuit?.cableType || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ความยาวสาย (เมตร):</Text>
            <Text style={styles.infoValue}>{circuit?.cableLength || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>กระแสไฟฟ้าสูงสุดที่อนุญาต (A):</Text>
            <Text style={styles.infoValue}>{circuit?.maxCurrent || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>แรงดันไฟฟ้าสูงสุดที่อนุญาต (V):</Text>
            <Text style={styles.infoValue}>{circuit?.maxVoltage || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>การต่อสายดิน:</Text>
            <Text style={styles.infoValue}>
              {circuit?.grounding === "yes"
                ? "✓ มีการต่อสายดิน"
                : circuit?.grounding === "no"
                ? "✗ ไม่มีการต่อสายดิน"
                : "-"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลตรวจ:</Text>
            <Text style={styles.infoValue}>
              {circuit?.correct?.result === "correct"
                ? "✓ ถูกต้อง"
                : circuit?.correct?.result === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {circuit?.correct?.detail ? ` (${circuit.correct.detail})` : ""}
            </Text>
          </View>
        </View>
      ))
    ) : (
      <Text>-</Text>
    )}
  </View>
);

// Section: เครื่องอัดประจุ (EV Chargers)
const EVChargersSection = ({ evChargers }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>8. เครื่องอัดประจุยานยนต์ไฟฟ้า</Text>
    {Array.isArray(evChargers) && evChargers.length > 0 ? (
      evChargers.map((charger, idx) => (
        <View key={idx} style={{ marginBottom: 10, paddingLeft: 8 }}>
          <Text style={{ fontWeight: "bold" }}>เครื่องที่ {idx + 1}</Text>
          <Text>ผลิตภัณฑ์: {charger.product || "-"}</Text>
          <Text>รุ่น: {charger.model || "-"}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>พิกัดกำลังไฟฟ้า (kW):</Text>
            <Text style={styles.infoValue}>{charger.power || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>กระแสไฟฟ้า (A):</Text>
            <Text style={styles.infoValue}>{charger.current || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>แรงดันไฟฟ้า (V):</Text>
            <Text style={styles.infoValue}>{charger.voltage || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ชนิดปลั๊ก:</Text>
            <Text style={styles.infoValue}>{charger.plugType || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>จำนวนช่องชาร์จ:</Text>
            <Text style={styles.infoValue}>{charger.chargePoints || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ตำแหน่งติดตั้ง:</Text>
            <Text style={styles.infoValue}>{charger.installationLocation || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ผลตรวจ:</Text>
            <Text style={styles.infoValue}>
              {charger.correct?.result === "correct"
                ? "✓ ถูกต้อง"
                : charger.correct?.result === "fix"
                ? "✗ ต้องแก้ไข"
                : "-"}
              {charger.correct?.detail ? ` (${charger.correct.detail})` : ""}
            </Text>
          </View>
        </View>
      ))
    ) : (
      <Text>-</Text>
    )}
  </View>
);

// Section: สรุปผลและข้อจำกัด
const SummarySection = ({ summaryType, limitation }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>9. สรุปผลและข้อจำกัด</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ผลการตรวจสอบ:</Text>
      <Text style={styles.infoValue}>
        {summaryType?.overallResult === "pass"
          ? "✓ ผ่าน"
          : summaryType?.overallResult === "fail"
          ? "✗ ไม่ผ่าน"
          : "-"}
      </Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>ข้อจำกัด:</Text>
      <Text style={styles.infoValue}>{limitation || "-"}</Text>
    </View>
  </View>
);

// Section: ลายเซ็น
const SignatureSection = ({ signature }) => (
  <View style={styles.section} break>
    <Text style={styles.sectionTitle}>10. ลายเซ็น</Text>
    <View style={styles.signatureRow}>
      <View style={styles.signatureBox}>
        <Text style={styles.signatureRole}>ผู้ขอใช้ไฟฟ้าหรือผู้แทน</Text>
        {signature?.customerSign ? (
          <Image src={signature.customerSign} style={styles.signatureImage} />
        ) : (
          <Text style={styles.signaturePlaceholder}>[ไม่มีลายเซ็น]</Text>
        )}
      </View>
      <View style={styles.signatureBox}>
        <Text style={styles.signatureRole}>เจ้าหน้าที่การไฟฟ้าส่วนภูมิภาค</Text>
        {signature?.officerSign ? (
          <Image src={signature.officerSign} style={styles.signatureImage} />
        ) : (
          <Text style={styles.signaturePlaceholder}>[ไม่มีลายเซ็น]</Text>
        )}
      </View>
    </View>
  </View>
);

// Main PDF Document
const EVChargerHVExportPDF = ({ formData }) => {
  const safeData = {
    general: formData?.general || {},
    documents: formData?.documents || {},
    hvSystem: formData?.hvSystem || {},
    transformers: formData?.transformers || [],
    LVSystemPEA: formData?.LVSystemPEA || {},
    panel: formData?.panel || {},
    subCircuits: formData?.subCircuits || [],
    evChargers: formData?.evChargers || [],
    summaryType: formData?.summaryType || {},
    limitation: formData?.limitation || "",
    signature: formData?.signature || {},
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow} fixed>
          {/* <Image src={PEA_LOGO} style={styles.logo} /> */}
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>การไฟฟ้าส่วนภูมิภาค</Text>
            <Text style={styles.headerSubtitle}>แบบฟอร์มตรวจสอบระบบอัดประจุยานยนต์ไฟฟ้า (แรงสูง)</Text>
          </View>
        </View>
        <View style={styles.divider} fixed />
        <GeneralInfoHvSection general={safeData.general} />
        <DocumentSection documents={safeData.documents} />
        <HVSystemSection hvSystem={safeData.hvSystem} />
        <TransformersSection transformers={safeData.transformers} />
        <LVSystemSection LVSystemPEA={safeData.LVSystemPEA} />
        <PanelSection panel={safeData.panel} />
        <SubCircuitsSection subCircuits={safeData.subCircuits} />
        <EVChargersSection evChargers={safeData.evChargers} />
        <SummarySection summaryType={safeData.summaryType} limitation={safeData.limitation} />
        <SignatureSection signature={safeData.signature} />
        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => `หน้า ${pageNumber}/${totalPages}`}
        />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    fontSize: 12,
    padding: 32,
    backgroundColor: "#fff",
    lineHeight: 1.5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3a1a5b",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#3a1a5b",
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#5b2d90",
    borderBottomStyle: "solid",
    marginVertical: 12,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    textAlign: "right",
    fontSize: 10,
    color: "#aaa",
  },
  section: {
    marginBottom: 18,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#5b2d90",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 140,
    fontWeight: "bold",
  },
  infoValue: {
    flex: 1,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 8,
  },
  signatureBox: {
    border: "1 solid #222",
    padding: 12,
    minHeight: 90,
    minWidth: 160,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  signatureRole: {
    fontSize: 11,
    marginBottom: 4,
    color: "#5b2d90",
    fontWeight: "bold",
  },
  signatureImage: {
    width: 120,
    height: 40,
    marginBottom: 8,
    objectFit: "contain",
  },
  signaturePlaceholder: {
    color: "#bbb",
    marginBottom: 8,
  },
});

export default EVChargerHVExportPDF;