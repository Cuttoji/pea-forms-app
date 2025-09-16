import * as z from "zod";

export const homeFormSchema = z.object({
  general: z.object({
    inspectionNo: z.string().min(1, "กรุณาระบุครั้งที่ตรวจสอบ"),
    inspectionDate: z.string().min(1, "กรุณาระบุวันที่ตรวจสอบ"),
    requestNo: z.string().min(1, "กรุณาระบุเลขคำร้อง"),
    requestDate: z.string().min(1, "กรุณาระบุวันที่ของคำร้อง"),
    customerName: z.string().min(1, "กรุณาระบุชื่อ-นามสกุล"),
    phone: z.string().min(9, "กรุณาระบุหมายเลขโทรศัพท์").max(15),
    address: z.string().min(1, "กรุณาระบุที่อยู่"),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    houseImage: z.string().optional(),
    systemType: z.enum(["3เฟส", "1เฟส"]),
    load: z.string().optional(),
  }),
  inspection: z.object({
    // wireType, wireOther, wireSize สำหรับ 2.1 ข)
    wireType: z.enum(["ICE01", "NYY", "CV", "OTHER"]),
    wireOther: z.string().optional(),
    wireSize: z.string().min(1, "กรุณาระบุขนาดสายไฟ"),
    wireResult: z.enum(["ถูกต้อง", "ต้องแก้ไข"]),
    wireDetail: z.string().optional(),

    // items: รายการ 2.1(ก,ค), 2.2, 2.3 ทั่วไป
    items: z.array(
      z.object({
        label: z.string(),
        result: z.enum(["ถูกต้อง", "ต้องแก้ไข"]),
        detail: z.string().optional(),
      })
    ),

    // RCD
    rcdResult: z.enum(["ถูกต้อง", "ไม่ติดตั้ง"]),
    rcdNote: z.string().optional(),
  }),
  summary: z.object({
    summaryType: z.enum(["ถาวร", "ชั่วคราว", "ปรับปรุง"]),
    note: z.string().optional(),
  }),
  limitation: z.string().optional(),
  signature: z.object({
    name: z.string().min(1, "กรุณาระบุชื่อผู้ขอใช้ไฟฟ้า"),
    date: z.string().min(1, "กรุณาระบุวันที่เซ็น"),
    note: z.string().optional(),
    customerSign: z.string().optional(),
    officerSign: z.string().optional(),
  }),
});

export default homeFormSchema;