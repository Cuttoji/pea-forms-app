const initialInspectionItems = [
  // 2.1 สายตัวนำประธานเข้าอาคาร
  {
    section: "2.1",
    sub_item: "ก",
    item_title: "สายไฟฟ้าเป็นไปตามมาตรฐาน มอก. 11-2553 หรือ มอก. 293-2541 หรือ IEC 60502",
    type: "", 
    type_other: "",
    result: "", // "ถูกต้อง" หรือ "ต้องแก้ไข"
    detail: "",
    value: ""
  },
  {
    section: "2.1",
    sub_item: "ข",
    item_title: "ชนิดสายและขนาดสาย",
    type: "", 
    type_other: "",
    value: "", // ขนาดสาย (ตร.มม.)
    result: "", // "ถูกต้อง" หรือ "ต้องแก้ไข"
    detail: ""
  },
  {
    section: "2.1",
    sub_item: "ค",
    item_title: "เดินสายบนลูกถ้วยฉนวนในอากาศ",
    type: "", 
    type_other: "",
    result: "", // "checked" หรือ ""
    detail: "",
    value: ""
  },
  {
    section: "2.1",
    sub_item: "ค1",
    item_title: "สูงจากพื้นไม่น้อยกว่า 2.9 เมตร หรือ 5.5 เมตร ถ้ามียานพาหนะลอดผ่าน",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: ""
  },
  {
    section: "2.1",
    sub_item: "ค2",
    item_title: "สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล (เดินสายอากาศ)",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: ""
  },
  {
    section: "2.1",
    sub_item: "ค",
    item_title: "เดินสายฝังใต้ดิน (ตรวจสอบเฉพาะส่วนที่มองเห็นได้)",
    type: "", 
    type_other: "",
    result: "", // "checked" หรือ ""
    detail: "",
    value: ""
  },
  {
    section: "2.1",
    sub_item: "ค3",
    item_title: "สายตัวนำประธานทำเครื่องหมายที่สายนิวทรัล (เดินสายใต้ดิน)",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: ""
  },

  // 2.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์(บริภัณฑ์ประธาน)
  {
    section: "2.2",
    sub_item: "ก",
    item_title: "เซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน IEC60898",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: ""
  },
  {
    section: "2.2",
    sub_item: "ข",
    item_title: "เซอร์กิตเบรกเกอร์สอดคล้องกับขนาดมิเตอร์",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: "" // ขนาด AT (A)
  },
  {
    section: "2.2",
    sub_item: "ค",
    item_title: "ขนาดกระแสลัดวงจรสูงสุดไม่ต่ำกว่า 10 กิโลแอมแปร์ (kA)",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: ""
  },

  // 2.3 ระบบการต่อลงดินที่แผงเมนสวิตช์
  {
    section: "2.3",
    sub_item: "ก",
    item_title: "ขนาดสายต่อหลักดินสอดคล้องกับขนาดสายตัวนำประธาน",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: "" // ขนาดสายต่อหลักดิน (ตร.มม.)
  },
  {
    section: "2.3",
    sub_item: "ข",
    item_title: "ค่าความต้านทานการต่อลงดินต้องไม่เกิน 5 โอห์ม (หรือ 25 โอห์มในกรณียกเว้น)",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: ""
  },
  {
    section: "2.3",
    sub_item: "ค",
    item_title: "1 เฟส: แผงเมนสวิตช์ต้องมีขั้วต่อสายดินและต่อสายนิวทรัลเข้าขั้วต่อสายดินก่อนเข้าบริภัณฑ์ประธาน",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: ""
  },
  {
    section: "2.3",
    sub_item: "ง",
    item_title: "3 เฟส: แผงเมนสวิตช์ต้องมีขั้วต่อสายดินและขั้วต่อสายนิวทรัล",
    type: "", 
    type_other: "",
    result: "",
    detail: "",
    value: ""
  },

  // 2.4 เครื่องตัดไฟรั่ว (RCD)
  {
    section: "2.4",
    sub_item: null,
    item_title: "การติดตั้งเครื่องตัดไฟรั่ว (RCD) (≤30mA)",
    type: "", 
    type_other: "",
    result: "", // "ถูกต้อง" หรือ "ไม่ประสงค์ติดตั้ง"
    detail: "",
    value: ""
  }
];

export default initialInspectionItems;