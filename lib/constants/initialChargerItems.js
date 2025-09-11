// initialChargerFields.js
// Schema ฟิลด์เครื่องอัดประจุยานยนต์ไฟฟ้า (Reusable ไม่ผูกเลขหัวข้อ)

const initialChargerFields = [
  // 1. ข้อมูลเครื่องอัดประจุยานยนต์ไฟฟ้า
  { name: "brand", label: "ผลิตภัณฑ์", type: "text", value: "" },
  { name: "model", label: "รุ่น", type: "text", value: "" },
  { name: "serial_number", label: "Serial Number", type: "text", value: "" },
  { name: "ip_rating", label: "IP", type: "text", value: "" },
  { name: "phase_system", label: "ระบบ", type: "radio", options: ["1 เฟส", "3 เฟส"], value: "" },
  { name: "charger_head_count", label: "จำนวนหัวชาร์จ (หัว)", type: "number", value: "" },
  { name: "total_power_kw", label: "พิกัดกำลังไฟฟ้ารวม (kW)", type: "number", value: "" },
  { name: "total_input_current", label: "พิกัดกระแสรวม (Input) (A)", type: "number", value: "" },
  { name: "charge_mode", label: "การอัดประจุไฟฟ้า", type: "radio", options: ["โหมด 2 (AC)", "โหมด 3 (AC)", "โหมด 4 (DC)"], value: "" },
  { name: "info_result", label: "ผลการตรวจสอบ", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "info_detail", label: "รายละเอียดการแก้ไข", type: "textarea", value: "" },

  // 2. ลักษณะหัวชาร์จ / การชาร์จ
  { name: "ac_type2", label: "AC Type 2", type: "checkbox", checked: false },
  { name: "ac_type2_current", label: "พิกัดกระแส (AAC)", type: "number", value: "" },
  { name: "ac_type2_voltage", label: "พิกัดแรงดัน (VAC)", type: "number", value: "" },
  { name: "ac_type2_power", label: "พิกัดกำลัง (kW)", type: "number", value: "" },

  { name: "dc_chademo", label: "DC CHAdeMO", type: "checkbox", checked: false },
  { name: "dc_chademo_current", label: "พิกัดกระแส (ADC)", type: "number", value: "" },
  { name: "dc_chademo_voltage", label: "พิกัดแรงดัน (VDC)", type: "number", value: "" },
  { name: "dc_chademo_power", label: "พิกัดกำลัง (kW)", type: "number", value: "" },

  { name: "dc_ccs", label: "DC CCS", type: "checkbox", checked: false },
  { name: "dc_ccs_current", label: "พิกัดกระแส (ADC)", type: "number", value: "" },
  { name: "dc_ccs_voltage", label: "พิกัดแรงดัน (VDC)", type: "number", value: "" },
  { name: "dc_ccs_power", label: "พิกัดกำลัง (kW)", type: "number", value: "" },

  { name: "other_type", label: "อื่นๆ ระบุ", type: "checkbox", checked: false },
  { name: "other_type_desc", label: "ระบุชนิดหัวชาร์จ", type: "text", value: "" },
  { name: "other_type_current", label: "พิกัดกระแส (A)", type: "number", value: "" },
  { name: "other_type_voltage", label: "พิกัดแรงดัน (V)", type: "number", value: "" },
  { name: "other_type_power", label: "พิกัดกำลัง (kW)", type: "number", value: "" },

  { name: "simultaneous_charge_heads", label: "หัวชาร์จสามารถชาร์จได้พร้อมกัน ... หัว คือ ...", type: "text", value: "" },
  { name: "charge_result", label: "ผลการตรวจสอบ", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "charge_detail", label: "รายละเอียดการแก้ไข", type: "textarea", value: "" },

  // 3. กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 2
  { name: "grounded_socket", label: "เต้ารับและเต้าเสียบต้องเป็นชนิดมีขั้วสายดินตามมาตรฐาน", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "fixed_socket", label: "เต้ารับต้องไม่ใช่ชนิดหยิบยกได้", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "warning_sign_socket", label: "ต้องมีป้ายข้อความเตือน “จุดเชื่อมต่อยานยนต์ไฟฟ้า” บริเวณเต้ารับ", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "grounded_socket_detail", label: "รายละเอียดการแก้ไข (เต้ารับมีสายดิน)", type: "textarea", value: "" },
  { name: "fixed_socket_detail", label: "รายละเอียดการแก้ไข (เต้ารับไม่ใช่ชนิดหยิบยกได้)", type: "textarea", value: "" },
  { name: "warning_sign_socket_detail", label: "รายละเอียดการแก้ไข (ป้ายข้อความเตือน)", type: "textarea", value: "" },

  // 4. กรณีติดตั้งเครื่องอัดประจุยานยนต์ไฟฟ้า โหมด 3 และโหมด 4
  { name: "warning_sign_charger", label: "ต้องมีป้ายเตือน “ระวังอันตรายจากไฟฟ้าช็อก” ที่เครื่องอัดประจุยานยนต์ไฟฟ้า", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "emergency_switch", label: "ต้องติดตั้งสวิตช์ควบคุมฉุกเฉิน (Emergency Switch)", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "ventilation", label: "ต้องจัดให้มีการระบายอากาศอย่างเหมาะสมและติดตั้งป้ายเตือน “ต้องการการระบายอากาศ”", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "cable_length", label: "ความยาวสายชาร์จไม่ควรเกิน 7.50 เมตร", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "warning_sign_charger_detail", label: "รายละเอียดการแก้ไข (ป้ายเตือนไฟฟ้าช็อก)", type: "textarea", value: "" },
  { name: "emergency_switch_detail", label: "รายละเอียดการแก้ไข (Emergency Switch)", type: "textarea", value: "" },
  { name: "ventilation_detail", label: "รายละเอียดการแก้ไข (ระบายอากาศและป้ายเตือน)", type: "textarea", value: "" },
  { name: "cable_length_detail", label: "รายละเอียดการแก้ไข (สายชาร์จ)", type: "textarea", value: "" },

  // 5. กรณีติดตั้งเครื่องอัดประจุในสถานีบริการน้ำมัน, LPG และ CNG
  { name: "mode_3_4_only", label: "เครื่องอัดประจุยานยนต์ไฟฟ้าต้องเป็นการอัดประจุโหมด 3 หรือโหมด 4", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "fixed_cable", label: "ต้องเป็นแบบมีสายชาร์จยึดติดกับเครื่องอัดประจุเท่านั้น", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "emergency_switch_main", label: "ติดตั้งสวิตช์ควบคุมฉุกเฉินสำหรับปลดวงจรเมนสวิตช์ที่จ่ายไฟให้กับตู้จ่ายวัตถุอันตรายและเครื่องอัดประจุ", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "emergency_switch_distance", label: "สวิตช์ควบคุมฉุกเฉินอยู่ห่างจากตู้จ่ายวัตถุอันตราย 6-30 เมตร", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "danger_zone_devices", label: "อุปกรณ์ไฟฟ้าในบริเวณอันตรายปฏิบัติตามกฎหมาย", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "danger_zone_distance", label: "ระยะห่างของบริเวณอันตรายตามกฎหมาย", type: "radio", options: ["ถูกต้อง", "ต้องแก้ไข"], value: "" },
  { name: "mode_3_4_only_detail", label: "รายละเอียดการแก้ไข (โหมด 3/4)", type: "textarea", value: "" },
  { name: "fixed_cable_detail", label: "รายละเอียดการแก้ไข (สายชาร์จติดกับเครื่อง)", type: "textarea", value: "" },
  { name: "emergency_switch_main_detail", label: "รายละเอียดการแก้ไข (Emergency Switch เมน)", type: "textarea", value: "" },
  { name: "emergency_switch_distance_detail", label: "รายละเอียดการแก้ไข (Emergency Switch ระยะห่าง)", type: "textarea", value: "" },
  { name: "danger_zone_devices_detail", label: "รายละเอียดการแก้ไข (อุปกรณ์ไฟฟ้าในบริเวณอันตราย)", type: "textarea", value: "" },
  { name: "danger_zone_distance_detail", label: "รายละเอียดการแก้ไข (ระยะห่างบริเวณอันตราย)", type: "textarea", value: "" },

  // 6. ข้อแนะนำในการป้องกันเครื่องอัดประจุยานยนต์ไฟฟ้า
  { name: "collision_protection", label: "มีการป้องกันความเสียหายของเครื่องอัดประจุไฟฟ้าจากการชนของยานยนต์", type: "radio", options: ["ติดตั้งแล้ว", "ยังไม่ติดตั้ง"], value: "" },
  { name: "fire_extinguisher", label: "มีการป้องกันและระงับอัคคีภัย โดยการติดตั้งถังดับเพลิง", type: "radio", options: ["ติดตั้งแล้ว", "ยังไม่ติดตั้ง"], value: "" },
  { name: "lightning_protection", label: "กรณีติดตั้งอยู่ภายนอกอาคาร มีการติดตั้งระบบป้องกันฟ้าผ่า", type: "radio", options: ["ติดตั้งแล้ว", "ยังไม่ติดตั้ง"], value: "" }
];

export default initialChargerFields;