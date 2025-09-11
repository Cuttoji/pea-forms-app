// initialSubCircuitFields.js
// Schema ฟิลด์วงจรย่อย (Reusable ไม่ผูกเลขหัวข้อ)
// ใช้ร่วมได้ทั้ง HV/LV โดยเลขหัวข้อกำหนดที่ component/page

const initialSubCircuitFields = [
  // 1. วงจรย่อยของเครื่องอัดประจุยานยนต์ไฟฟ้า
  {
    name: "only_charger_circuit",
    label: "วงจรย่อยจ่ายไฟให้เครื่องอัดประจุยานยนต์ไฟฟ้าเท่านั้น (ไม่รวมกับโหลดอื่น)",
    type: "radio",
    options: ["ถูกต้อง", "ต้องแก้ไข"],
    value: ""
  },
  {
    name: "one_charger_per_circuit",
    label: "วงจรย่อยจ่ายไฟให้เครื่องอัดประจุยานยนต์ไฟฟ้า 1 เครื่อง ต่อ 1 วงจรย่อย",
    type: "radio",
    options: ["ถูกต้อง", "ต้องแก้ไข"],
    value: ""
  },

  // 2. วงจรย่อย
  {
    name: "conductor_standard",
    label: "สายตัวนำวงจรย่อยเป็นไปตามมาตรฐาน",
    type: "checkboxGroup",
    options: [
      { value: "มอก. 11-2553", label: "มอก. 11-2553" },
      { value: "มอก. 293-2541", label: "มอก. 293-2541" },
      { value: "IEC 60502", label: "IEC 60502" }
    ],
    value: []
  },
  {
    name: "conductor_type",
    label: "ชนิดสายตัวนำ",
    type: "radio",
    options: ["IEC01", "NYY", "CV", "อื่นๆ"],
    value: ""
  },
  {
    name: "conductor_type_other",
    label: "ระบุชนิดสายตัวนำอื่นๆ",
    type: "text",
    value: ""
  },
  {
    name: "phase_wire_size",
    label: "ขนาดสายเฟส (ตร.มม.)",
    type: "number",
    value: ""
  },
  {
    name: "neutral_wire_size",
    label: "ขนาดสายนิวทรัล (ตร.มม.)",
    type: "number",
    value: ""
  },
  {
    name: "ground_wire_size",
    label: "ขนาดสายดิน (ตร.มม.)",
    type: "number",
    value: ""
  },
  {
    name: "phase_wire_mark",
    label: "ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ",
    type: "radio",
    options: ["ถูกต้อง", "ต้องแก้ไข"],
    value: ""
  },
  {
    name: "wireway_continuity",
    label: "ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ",
    type: "radio",
    options: ["ถูกต้อง", "ต้องแก้ไข"],
    value: ""
  },

  // 3. วิธีการเดินสาย
  {
    name: "conduit_surface",
    label: "เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด ... นิ้ว",
    type: "checkboxWithNumber",
    checked: false,
    value: ""
  },
  {
    name: "conduit_buried",
    label: "เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด ... นิ้ว",
    type: "checkboxWithNumber",
    checked: false,
    value: ""
  },
  {
    name: "direct_buried",
    label: "เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)",
    type: "checkbox",
    checked: false
  },
  {
    name: "wireway",
    label: "เดินในรางเดินสาย (Wireway) ขนาด ... มม. x ... มม.",
    type: "checkboxWithText",
    checked: false,
    value: ""
  },
  {
    name: "cable_tray",
    label: "เดินบนรางเคเบิล (Cable Tray) ขนาด ... มม. x ... มม.",
    type: "checkboxWithText",
    checked: false,
    value: ""
  },
  {
    name: "other_method",
    label: "อื่นๆ ระบุ",
    type: "checkboxWithText",
    checked: false,
    value: ""
  },
  {
    name: "method_result",
    label: "ผลการตรวจสอบ",
    type: "radio",
    options: ["ถูกต้อง", "ต้องแก้ไข"],
    value: ""
  },

  // 4. ประเภทท่อร้อยสาย
  {
    name: "metal_conduit_rmc",
    label: "ท่อโลหะ หนา (RMC)",
    type: "checkbox",
    checked: false
  },
  {
    name: "metal_conduit_imc",
    label: "ท่อโลหะ หนาปานกลาง (IMC)",
    type: "checkbox",
    checked: false
  },
  {
    name: "metal_conduit_emt",
    label: "ท่อโลหะ บาง (EMT)",
    type: "checkbox",
    checked: false
  },
  {
    name: "nonmetal_conduit_rnc",
    label: "ท่ออโลหะ แข็ง (RNC)",
    type: "checkbox",
    checked: false
  },
  {
    name: "nonmetal_conduit_ent",
    label: "ท่ออโลหะ อ่อน (ENT)",
    type: "checkbox",
    checked: false
  },
  {
    name: "flexible_metal_conduit",
    label: "ท่อโลหะอ่อน (Flexible Metal Conduit)",
    type: "checkbox",
    checked: false
  },
  {
    name: "other_conduit",
    label: "อื่นๆ ระบุ",
    type: "checkboxWithText",
    checked: false,
    value: ""
  },
  {
    name: "conduit_result",
    label: "ผลการตรวจสอบ",
    type: "radio",
    options: ["ถูกต้อง", "ต้องแก้ไข"],
    value: ""
  },
  {
    name: "conduit_detail",
    label: "รายละเอียดการแก้ไข",
    type: "textarea",
    value: ""
  },

  // 5. เซอร์กิตเบรกเกอร์ป้องกันวงจรย่อย
  {
    name: "breaker_standard",
    label: "เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2",
    type: "checkbox",
    checked: false
  },
  {
    name: "breaker_3_4_mode",
    label: "กรณีอัดประจุโหมด 3 หรือ 4 เซอร์กิตเบรกเกอร์ขนาด AT ... แอมแปร์ (A)",
    type: "checkboxWithNumber",
    checked: false,
    value: ""
  },
  {
    name: "breaker_2_mode",
    label: "กรณีอัดประจุโหมด 2 เซอร์กิตเบรกเกอร์ขนาด AT ... แอมแปร์ (A)",
    type: "checkboxWithNumber",
    checked: false,
    value: ""
  },
  {
    name: "breaker_result",
    label: "ผลการตรวจสอบ",
    type: "radio",
    options: ["ถูกต้อง", "ต้องแก้ไข"],
    value: ""
  },
  {
    name: "breaker_detail",
    label: "รายละเอียดการแก้ไข",
    type: "textarea",
    value: ""
  },

  // 6. ระบบป้องกันอันตรายต่อบุคคล
  {
    name: "rcd_type_b",
    label: "เครื่องตัดไฟรั่ว (RCD) Type B ตามมาตรฐาน มอก. 2955 หรือ IEC 62423 พิกัดกระแสรั่ว I∆N ≤ 30 mA พิกัดกระแส (In) ... แอมแปร์ (A)",
    type: "checkboxWithNumber",
    checked: false,
    value: ""
  },
  {
    name: "rcd_type_a_f_rdcdd",
    label: "เครื่องตัดไฟรั่ว (RCD) Type A หรือ F ร่วมกับอุปกรณ์ตัดไฟฟ้ารั่วกระแสตรง (RDC-DD) ขนาดพิกัด I∆N,DC ≥ 6 mA",
    type: "checkbox",
    checked: false
  },
  {
    name: "rcd_type_b_in_charger",
    label: "มีเครื่องตัดไฟรั่ว (RCD) Type B ตามมาตรฐาน มอก. 2955 หรือ IEC 62423 พิกัดกระแสรั่ว I∆N ≤ 30 mA พิกัดกระแส (In) ... แอมแปร์ (A) ติดตั้งภายในเครื่องอัดประจุยานยนต์ไฟฟ้า",
    type: "checkboxWithNumber",
    checked: false,
    value: ""
  },
  {
    name: "isolating_transformer",
    label: "มีหม้อแปลงแยกขดลวด (Isolating Transformer) ติดตั้งมากับเครื่องอัดประจุยานยนต์ไฟฟ้า",
    type: "checkbox",
    checked: false
  },
  {
    name: "protection_result",
    label: "ผลการตรวจสอบ",
    type: "radio",
    options: ["ถูกต้อง", "ต้องแก้ไข"],
    value: ""
  },
  {
    name: "protection_detail",
    label: "รายละเอียดการแก้ไข",
    type: "textarea",
    value: ""
  },

  // 7. ติดตั้ง RCD Type B ไม่ซ้อนกับ RCD อื่น
  {
    name: "rcd_type_b_not_under_other_rcd",
    label: "RCD Type B ต้องไม่ติดตั้งภายใต้วงจรที่มี RCD Type อื่นๆ อยู่ที่เมนของวงจรนั้นๆ",
    type: "radio",
    options: ["ถูกต้อง", "ต้องแก้ไข"],
    value: ""
  },
  {
    name: "rcd_type_b_detail",
    label: "รายละเอียดการแก้ไข",
    type: "textarea",
    value: ""
  }
];

export default initialSubCircuitFields;