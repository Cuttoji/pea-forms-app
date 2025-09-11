// initialEvChargerHVPanelBoardItems.js
// Schema ฟิลด์สำหรับ 5.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board)

const initialEvChargerHVPanelBoardItems = [
  // 5.5.1 วงจรสายป้อน
  {
    id: "5.5.1",
    section: "5.5.1",
    item_title: "วงจรสายป้อน",
    fields: [
      // ก) สายป้อนเป็นไปตามมาตรฐาน
      {
        name: "feeder_standard",
        label: "สายป้อนเป็นไปตามมาตรฐาน",
        type: "checkboxGroup",
        options: [
          { value: "มอก. 11-2553", label: "มอก. 11-2553" },
          { value: "มอก. 293-2541", label: "มอก. 293-2541" },
          { value: "IEC 60502", label: "IEC 60502" }
        ],
        value: []
      },
      {
        name: "feeder_standard_result",
        label: "ผลการตรวจสอบ (มาตรฐาน)",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "feeder_standard_detail",
        label: "รายละเอียดการแก้ไข (มาตรฐาน)",
        type: "textarea",
        value: ""
      },
      // ข) ชนิดสายตัวนำ
      {
        name: "feeder_conductor_type",
        label: "ชนิดสายตัวนำ",
        type: "radio",
        options: ["IEC01", "NYY", "CV", "อื่นๆ"],
        value: ""
      },
      {
        name: "feeder_conductor_type_other",
        label: "ระบุชนิดสายตัวนำอื่นๆ",
        type: "text",
        value: ""
      },
      {
        name: "feeder_conductor_type_result",
        label: "ผลการตรวจสอบ (ชนิดสาย)",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "feeder_conductor_type_detail",
        label: "รายละเอียดการแก้ไข (ชนิดสาย)",
        type: "textarea",
        value: ""
      },
      // ค) ขนาดสายเฟส
      {
        name: "feeder_phase_size",
        label: "ขนาดสายเฟส (ตร.มม.)",
        type: "number",
        value: ""
      },
      {
        name: "feeder_phase_size_result",
        label: "ผลการตรวจสอบ (ขนาดสายเฟส)",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "feeder_phase_size_detail",
        label: "รายละเอียดการแก้ไข (ขนาดสายเฟส)",
        type: "textarea",
        value: ""
      },
      // ง) ขนาดสายนิวทรัล
      {
        name: "feeder_neutral_size",
        label: "ขนาดสายนิวทรัล (ตร.มม.)",
        type: "number",
        value: ""
      },
      {
        name: "feeder_neutral_size_result",
        label: "ผลการตรวจสอบ (ขนาดสายนิวทรัล)",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "feeder_neutral_size_detail",
        label: "รายละเอียดการแก้ไข (ขนาดสายนิวทรัล)",
        type: "textarea",
        value: ""
      },
      // จ) ขนาดสายดิน
      {
        name: "feeder_ground_size",
        label: "ขนาดสายดิน (ตร.มม.)",
        type: "number",
        value: ""
      },
      {
        name: "feeder_ground_size_result",
        label: "ผลการตรวจสอบ (ขนาดสายดิน)",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "feeder_ground_size_detail",
        label: "รายละเอียดการแก้ไข (ขนาดสายดิน)",
        type: "textarea",
        value: ""
      },
      // ฉ) ระบุเฟสสายตัวนำ
      {
        name: "feeder_phase_marking_result",
        label: "ผลการตรวจสอบ (ระบุเฟสสายตัวนำ)",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "feeder_phase_marking_detail",
        label: "รายละเอียดการแก้ไข (ระบุเฟสสายตัวนำ)",
        type: "textarea",
        value: ""
      },
      // ช) ช่องเดินสายมีความต่อเนื่องทางกล
      {
        name: "feeder_continuity_result",
        label: "ผลการตรวจสอบ (ช่องเดินสายมีความต่อเนื่องทางกล)",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "feeder_continuity_detail",
        label: "รายละเอียดการแก้ไข (ช่องเดินสายมีความต่อเนื่องทางกล)",
        type: "textarea",
        value: ""
      }
    ]
  },

  // 5.5.2 วิธีการเดินสาย
  {
    id: "5.5.2",
    section: "5.5.2",
    item_title: "วิธีการเดินสาย",
    fields: [
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
        name: "busway",
        label: "บัสเวย์ (Busway) หรือบัสดัก (Bus duct) ขนาด ... มม. x ... มม.",
        type: "checkboxWithText",
        checked: false,
        value: ""
      },
      {
        name: "conduit_wall",
        label: "เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสายขนาด ... นิ้ว",
        type: "checkboxWithText",
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
        name: "conduit_underground",
        label: "เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้) โดยใช้ท่อร้อยสายขนาด ... นิ้ว",
        type: "checkboxWithText",
        checked: false,
        value: ""
      },
      {
        name: "wiring_other",
        label: "อื่นๆ ระบุ",
        type: "checkboxWithText",
        checked: false,
        value: ""
      },
      {
        name: "wiring_result",
        label: "ผลการตรวจสอบ",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "wiring_detail",
        label: "รายละเอียดการแก้ไข",
        type: "textarea",
        value: ""
      }
    ]
  },

  // 5.5.3 ประเภทท่อร้อยสาย
  {
    id: "5.5.3",
    section: "5.5.3",
    item_title: "ประเภทท่อร้อยสาย",
    fields: [
      {
        name: "conduit_rmc",
        label: "ท่อโลหะ หนา (RMC)",
        type: "checkbox",
        checked: false
      },
      {
        name: "conduit_imc",
        label: "ท่อโลหะ หนาปานกลาง (IMC)",
        type: "checkbox",
        checked: false
      },
      {
        name: "conduit_emt",
        label: "ท่อโลหะ บาง (EMT)",
        type: "checkbox",
        checked: false
      },
      {
        name: "conduit_rnc",
        label: "ท่ออโลหะ แข็ง (RNC)",
        type: "checkbox",
        checked: false
      },
      {
        name: "conduit_ent",
        label: "ท่ออโลหะ อ่อน (ENT)",
        type: "checkbox",
        checked: false
      },
      {
        name: "conduit_flexible_metal",
        label: "ท่อโลหะอ่อน (Flexible Metal Conduit)",
        type: "checkbox",
        checked: false
      },
      {
        name: "conduit_other",
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
      }
    ]
  },

  // 5.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน
  {
    id: "5.5.4",
    section: "5.5.4",
    item_title: "เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน",
    fields: [
      {
        name: "breaker_standard",
        label: "เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2",
        type: "checkbox",
        checked: false
      },
      {
        name: "breaker_at",
        label: "เซอร์กิตเบรกเกอร์ขนาด AT ... แอมแปร์ (A)",
        type: "number",
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
      }
    ]
  },

  // 5.5.5 การติดตั้งแผงวงจรย่อย (Panel board)
  {
    id: "5.5.5",
    section: "5.5.5",
    item_title: "การติดตั้งแผงวงจรย่อย (Panel board)",
    fields: [
      {
        name: "panel_rating",
        label: "ต้องมีพิกัดไม่ต่ำกว่าขนาดสายป้อน",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "panel_rating_detail",
        label: "รายละเอียดการแก้ไข (พิกัดไม่ต่ำกว่าขนาดสายป้อน)",
        type: "textarea",
        value: ""
      },
      {
        name: "panel_bonding",
        label: "ไม่มีการต่อฝาก เชื่อมระหว่างขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) ที่แผงวงจรย่อย",
        type: "radio",
        options: ["ถูกต้อง", "ต้องแก้ไข"],
        value: ""
      },
      {
        name: "panel_bonding_detail",
        label: "รายละเอียดการแก้ไข (Bonding/Neutral Bus)",
        type: "textarea",
        value: ""
      }
    ]
  }
];

export default initialEvChargerHVPanelBoardItems;