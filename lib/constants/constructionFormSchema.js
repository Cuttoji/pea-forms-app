const constructionFormSchema = {
    // General Information
    general: // GeneralInfoSection value schema (JavaScript object)
{
  projectName: "",        // string
  approvalNo: "",         // string
  approvalDate: "",       // string (ISO date)
  jobNo: "",              // string
  inspectionDate2: "",    // string (ISO date)
  peaType: "",            // string ("pea" หรือ "company")
  hvAmount: "",           // string หรือ number
  hvPoleCount: "",        // string หรือ number
  stationName: "",        // string
  feeder: "",             // string
  phase: "",              // string
  kva: "",                // string หรือ number
  lvAmount: "",           // string หรือ number
  lvPoleCount: "",        // string หรือ number
  supervisor: "",         // string
  position: "",           // string
  department: "",         // string

  customerName: "",       // string
  phone: "",              // string
  address: "",            // string
  systemType: "",         // string ("3เฟส", "1เฟส")
  load: "",               // string หรือ number

  latitude: "",           // string หรือ number
  longitude: "",          // string หรือ number
  houseImage: ""          // string (URL)
},

    // Sections (รายการตรวจสอบ)
    sections: [
  {
    title: "1. ระบบจำหน่ายแรงสูง",
    items: [
      { key: "hv_1_1", label: "1.1 การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)", result: "", detail: "", note: "" },
      { key: "hv_1_2", label: "1.2 การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์", result: "", detail: "", note: "" },
      { key: "hv_1_3", label: "1.3 การติดตั้งเหล็กรับสายล่อฟ้า (เหล็กฉาก , เหล็กรูปรางน้ำ)", result: "", detail: "", note: "" },
      { key: "hv_1_4", label: "1.4 การฝังสมอบก และประกอบยึดโยงระบบจำหน่าย", result: "", detail: "", note: "" },
      { key: "hv_1_5", label: "1.5 การฝังสมอบก และประกอบยึดโยงสายล่อฟ้า", result: "", detail: "", note: "" },
      { key: "hv_1_6", label: "1.6 การพาดสายไฟ ระยะหย่อนยาน", result: "", detail: "", note: "" },
      { key: "hv_1_7", label: "1.7 การพาดสายล่อฟ้า ระยะหย่อนยาน", result: "", detail: "", note: "" },
      { key: "hv_1_8", label: "1.8 ระยะห่าง, ความสูงของสายไฟ", result: "", detail: "", note: "" },
      { key: "hv_1_9", label: "1.9 การพันและผูกลูกถ้วย", result: "", detail: "", note: "" },
      { key: "hv_1_10", label: "1.10 การต่อสาย พันเทป(สายหุ้มฉนวน)", result: "", detail: "", note: "" },
      { key: "hv_1_11", label: "1.11 การเชื่อมสาย, สายแยก พันเทป(สายหุ้มฉนวน)", result: "", detail: "", note: "" },
      { key: "hv_1_12", label: "1.12 การเข้าปลายสาย", result: "", detail: "", note: "" },
      { key: "hv_1_13", label: "1.13 การตัดต้นไม้", result: "", detail: "", note: "" },
      { key: "hv_1_14", label: "1.14 การทาสีเสา", result: "", detail: "", note: "" },
      { key: "hv_1_15", label: "1.15 การพ่นสี หมายเลขเสา", result: "", detail: "", note: "" },
      { key: "hv_1_16", label: "1.16 การยึดโยง(storm guy, line guy, fix guy, etc.)", result: "", detail: "", note: "" },
      { key: "hv_1_17", label: "1.17 การต่อลงดิน", result: "", detail: "", note: "" },
      { key: "hv_1_17_1", label: "1.17.1 ค่าความต้านทานดินต่อจุด", ohm: "", system: "", result: "", detail: "", note: "" },
      { key: "hv_1_18", label: "1.18 การติดตั้งกับดักเสิร์จแรงสูง", result: "", detail: "", note: "" },
      { key: "hv_1_19", label: "1.19 อื่นๆ", other: "", result: "", detail: "", note: "" }
    ]
  },
  {
    title: "2. ระบบจำหน่ายแรงต่ำ",
    items: [
      { key: "lv_2_1", label: "2.1 การปักเสา, เสาตอม่อ (ความลึก, แนวเสา, หน้าเสา)", result: "", detail: "", note: "" },
      { key: "lv_2_2", label: "2.2 การติดตั้งคอน แร็ค", result: "", detail: "", note: "" },
      { key: "lv_2_3", label: "2.3 การฝังสมอบก และประกอบยึดโยง", result: "", detail: "", note: "" },
      { key: "lv_2_4", label: "2.4 การพาดสายไฟ ระยะหย่อนยาน", result: "", detail: "", note: "" },
      { key: "lv_2_5", label: "2.5 ระยะห่าง, ความสูงของสายไฟ", result: "", detail: "", note: "" },
      { key: "lv_2_6", label: "2.6 การผูกสายไฟกับลูกรอกแรงต่ำ", result: "", detail: "", note: "" },
      { key: "lv_2_7", label: "2.7 การต่อสาย พันเทป", result: "", detail: "", note: "" },
      { key: "lv_2_8", label: "2.8 การเชื่อมสาย, สายแยก พันเทป", result: "", detail: "", note: "" },
      { key: "lv_2_9", label: "2.9 การเข้าปลายสาย พันเทป", result: "", detail: "", note: "" },
      { key: "lv_2_10", label: "2.10 การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป", result: "", detail: "", note: "" },
      { key: "lv_2_11", label: "2.11 การทาสีเสา", result: "", detail: "", note: "" },
      { key: "lv_2_12", label: "2.12 การพ่นสี หมายเลขเสา", result: "", detail: "", note: "" },
      { key: "lv_2_13", label: "2.13 การยึดโยง(storm guy, line guy, fix guy)", result: "", detail: "", note: "" },
      { key: "lv_2_14", label: "2.14 การต่อลงดิน", result: "", detail: "", note: "" },
      { key: "lv_2_15", label: "2.15 ค่าความต้านทานดินรวม", ohm: "", result: "", detail: "", note: "" },
      { key: "lv_2_16", label: "2.16 อื่นๆ", other: "", result: "", detail: "", note: "" }
    ]
  },
  {
    title: "3. การติดตั้งหม้อแปลง",
    items: [
      { key: "tr_3_0", label: "TR", number: "", phase: "", kva: "", type: [], result: "", detail: "", note: "" },
      { key: "tr_3_1", label: "3.1 การติดตั้งหม้อแปลง (ระยะความสูง, ทิศทาง)", result: "", detail: "", note: "" },
      { key: "tr_3_2", label: "3.2 การติดตั้งคอน ลูกถ้วย และประกอบบอนด์ไวร์", result: "", detail: "", note: "" },
      { key: "tr_3_3", label: "3.3 การพาดสายแรงสูงเข้าหม้อแปลง และลำดับเฟส", result: "", detail: "", note: "" },
      { key: "tr_3_4", label: "3.4 การผูกสายไฟกับลูกถ้วย", result: "", detail: "", note: "" },
      { key: "tr_3_5", label: "3.5 การติดตั้งกับดักเสิร์จแรงสูง, หางปลา", result: "", detail: "", note: "" },
      { key: "tr_3_6", label: "3.6 การติดตั้งดร็อปเอาต์, พินเทอร์มินอล และฟิวส์ลิงก์", result: "", detail: "", note: "" },
      { key: "tr_3_7", label: "3.7 การติดตั้งคอนสปัน 3,200 มม. ระยะความสูง", result: "", detail: "", note: "" },
      { key: "tr_3_8", label: "3.8 การเข้าสายที่บุชชิ่งหม้อแปลง, หางปลา, ฉนวนครอบบุชชิ่ง", result: "", detail: "", note: "" },
      { key: "tr_3_9", label: "3.9 การติดตั้งสายแรงต่ำ และลำดับเฟส", result: "", detail: "", note: "" },
      { key: "tr_3_10", label: "3.10 การติดตั้งกับดักเสิร์จแรงต่ำ พันเทป", result: "", detail: "", note: "" },
      { key: "tr_3_11", label: "3.11 การติดตั้งคอนสำหรับ LT, LT สวิตช์ และ ฟิวส์แรงต่ำ", result: "", detail: "", note: "" },
      { key: "tr_3_12", label: "3.12 การติดตั้งที่จับขอบถัง, เหล็กแขวน ท่อร้อยสายแรงต่ำ", result: "", detail: "", note: "" },
      { key: "tr_3_13", label: "3.13 เทคอนกรีตที่คาน , โคนเสา", result: "", detail: "", note: "" },
      { key: "tr_3_14", label: "3.14 การต่อลงดิน", result: "", detail: "", note: "" },
      { key: "tr_3_14_1", label: "- ตัวถังหม้อแปลง", result: "", detail: "", note: "" },
      { key: "tr_3_14_2", label: "- สายกราวด์ด้านแรงสูง", result: "", detail: "", note: "" },
      { key: "tr_3_14_3", label: "- สายกราวด์ด้านแรงต่ำ", result: "", detail: "", note: "" },
      { key: "tr_3_15", label: "3.15 ค่าความต้านทานดินต่อจุด", ohm: "", system: "", result: "", detail: "", note: "" },
      { key: "tr_3_16", label: "3.16 อื่นๆ", other: "", result: "", detail: "", note: "" }
    ]
  }
],

    // สรุปผลการตรวจสอบ
    summary: {
        summaryResult: "", // "correct" หรือ "fix"
        inspector1: "", // ชื่อ-สกุลผู้ตรวจสอบฯ
        inspectorPosition1: "", // ตำแหน่ง
        inspectorSign1: "", // base64 ลายเซ็น
    }
};



export default constructionFormSchema;
