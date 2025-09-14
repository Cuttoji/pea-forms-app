// initialEvChargerHVPanelBoardItems.js
// Schema ฟิลด์สำหรับ 5.5 วงจรสายป้อน/แผงวงจรย่อย (Panel board)

const initialEvChargerHVPanelBoardItems = [
  // 5.5.1 วงจรสายป้อน
  {
    section: "5.5.1",
    sub_item: "ก.",
    item_title: "สายป้อนเป็นไปตามมาตรฐาน",
    other: "มอก. 11-2553 / มอก. 293-2541 / IEC 60502",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  {
    section: "5.5.1",
    sub_item: "ข.",
    item_title: "ชนิดสาย",
    other: "IEC01 / NYY / CV / อื่นๆ",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  {
    section: "5.5.1",
    sub_item: "ค.",
    item_title: "ขนาดสายเฟส",
    other: "ตร.มม. (พิกัดกระแสสายป้อนต้องไม่น้อยกว่าขนาดปรับตั้งของเซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน และขนาดสายป้อนต้องไม่เล็กกว่า 4 ตร.มม.)",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  {
    section: "5.5.1",
    sub_item: "ง.",
    item_title: "ขนาดสายนิวทรัล",
    other: "ตร.มม.",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  {
    section: "5.5.1",
    sub_item: "จ.",
    item_title: "ขนาดสายดิน",
    other: "ตร.มม. สอดคล้องกับขนาดสายเฟสของวงจรสายป้อน ตามตารางที่ 1 ในหน้าที่ 7",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  {
    section: "5.5.1",
    sub_item: "ฉ.",
    item_title: "ระบุเฟสสายตัวนำ โดยใช้สีของฉนวนหรือการทำเครื่องหมายที่สายตัวนำ",
    other: "",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  {
    section: "5.5.1",
    sub_item: "ช.",
    item_title: "ช่องเดินสายมีความต่อเนื่องทางกล และความมั่นคงแข็งแรงเพียงพอ",
    other: "",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  // 5.5.2 วิธีการเดินสาย
  {
    section: "5.5.2",
    sub_item: "1.",
    item_title: "เดินในรางเดินสาย (Wireway)",
    other: "ขนาด มม. x มม.",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  {
    section: "5.5.2",
    sub_item: "2.",
    item_title: "เดินบนรางเคเบิล (Cable Tray)",
    other: "ขนาด มม. x มม.",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  {
    section: "5.5.2",
    sub_item: "3.",
    item_title: "บัสเวย์ (Busway) หรือบัสดัก (Bus duct)",
    other: "ขนาด มม. x มม.",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  {
    section: "5.5.2",
    sub_item: "4.",
    item_title: "เดินร้อยท่อเกาะผนัง โดยใช้ท่อร้อยสาย",
    other: "ขนาด นิ้ว",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  {
    section: "5.5.2",
    sub_item: "5.",
    item_title: "เดินสายฝังดินโดยตรง (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)",
    other: "",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  {
    section: "5.5.2",
    sub_item: "6.",
    item_title: "เดินสายร้อยท่อฝังดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)",
    other: "โดยใช้ท่อร้อยสายขนาด นิ้ว",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  {
    section: "5.5.2",
    sub_item: "7.",
    item_title: "อื่นๆ ระบุ",
    other: "",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  // 5.5.3 ประเภทท่อร้อยสาย
  {
    section: "5.5.3",
    sub_item: "1.",
    item_title: "ท่อโลหะ",
    other: "หนา (RMC) / หนาปานกลาง (IMC) / บาง (EMT)",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  {
    section: "5.5.3",
    sub_item: "2.",
    item_title: "ท่ออโลหะ",
    other: "แข็ง (RNC) / อ่อน (ENT)",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  {
    section: "5.5.3",
    sub_item: "3.",
    item_title: "ท่อโลหะอ่อน (Flexible Metal Conduit)",
    other: "",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  {
    section: "5.5.3",
    sub_item: "4.",
    item_title: "อื่นๆ ระบุ",
    other: "",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  // 5.5.4 เซอร์กิตเบรกเกอร์ป้องกันวงจรสายป้อน
  {
    section: "5.5.4",
    sub_item: "ก.",
    item_title: "เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC 60898 หรือ IEC 60947-2",
    other: "",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  {
    section: "5.5.4",
    sub_item: "ข.",
    item_title: "เซอร์กิตเบรกเกอร์ขนาด AT",
    other: "แอมแปร์ (A) ไม่เกินพิกัดกระแสสายป้อน และไม่ต่ำกว่าโหลดสูงสุดของสายป้อน",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "input"
  },
  // 5.5.5 การติดตั้งแผงวงจรย่อย (Panel board)
  {
    section: "5.5.5",
    sub_item: "ก.",
    item_title: "ต้องมีพิกัดไม่ต่ำกว่าขนาดสายป้อน",
    other: "",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  },
  {
    section: "5.5.5",
    sub_item: "ข.",
    item_title: "ไม่มีการต่อฝาก เชื่อมระหว่างขั้วต่อสายดิน (Ground Bus) และขั้วต่อสายนิวทรัล (Neutral Bus) ที่แผงวงจรย่อย",
    other: "",
    result: "ถูกต้อง",
    detail: "",
    note: "ต้องแก้ไข",
    value: "",
    type: "checkbox"
  }
];

export default initialEvChargerHVPanelBoardItems;