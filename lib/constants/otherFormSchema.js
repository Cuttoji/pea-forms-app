const otherFormSchema = {
    // General Information
    general: {
        applicantName: "",     // ชื่อ นามสกุลผู้ขอใช้ไฟฟ้า
        phone: "",             // โทรศัพท์
        address: "",           // ที่อยู่
        voltageSystem: "",     // ระบบไฟฟ้า (22kV, 33kV)
        estimatedLoad: "",       // โหลดประมาณ (แอมแปร์)
        office: "",            // การไฟฟ้า...
        inspectionNumber: "",  // การตรวจสอบครั้งที่
        inspectionDate: "",    // วันที่ตรวจสอบ
        requestNumber: "",     // เลขที่คำร้องขอใช้ไฟ
        requestDate: "",       // วันที่คำร้องขอใช้ไฟ
    },
    
    // Documents
    documents: {
        electricalDocument: null // "has" or "none"
    },
    
hvSystem: {
        mode: null, // "above" (เหนือดิน) หรือ "under" (ใต้ดิน) ให้เลือกก่อนแสดงเนื้อหาแต่ละตัวเลือก
        // dynamic items เช่น "3.1_1", "3.1_2", ... หรือ "3.2_1", ... ตาม prefix
        // ตัวอย่างค่าเริ่มต้น (สามารถเพิ่ม/ลดตาม sectionNumber ได้)
        "2.1_1": { result: null, text: "", detail: "" },
        "2.1_2": { result: null, text: "", detail: "" },
        "2.1_3": { result: null, detail: "" },
        "2.1_4": { result: null, detail: "" },
        "2.1_5": { result: null, detail: "" },
        "2.1_6": { result: null, detail: "" },
        "2.1_7": { result: null, detail: "" },
        "2.1_8": { result: null, detail: "" },
        "2.1_9": { result: null, detail: "" },
        "2.1_10": { result: null, detail: "" },
        "2.1_11": { result: null, detail: "" },

        "2.2_1": { result: null, text: "", detail: "" },
        "2.2_2": { result: null, text: "", detail: "" },
        "2.2_3": { result: null, detail: "" },
        "2.2_4": { result: null, detail: "" },
        "2.2_5": { result: null, detail: "" },
        "2.2_6": { result: null, detail: "" },
        "2.2_7": { result: null, detail: "" },

        // 3.3 เฉพาะ sectionNumber === 3
        hv33: {
            type: [],       // ["dropout", "switch", "rmu"] - เลือกก่อน
            switchType: "", // ถ้าเลือก switch
            result: null,   // ถูกต้อง/ต้องแก้ไข - เลือกหลัง
            detail: "",     // รายละเอียดถ้าต้องแก้ไข
        },

        // อื่นๆ
        other: "",
        },
    
    // Transformers array
    transformers: [
    {
      transformerData: {
        general: {
          testResult: "",
          capacity: "",
          hvVoltage: "",
          lvVoltage: "",
          impedance: "",
          vectorGroup: "",
          transformerType: "",
          transformerTypeOther: "",
          shortCircuitCurrent: "",
          correct: { result: null, detail: "" }
        },
        type: [],
        typeOther: "",
        correct: { result: null, detail: "" },
        overcurrent: { result: null, detail: "" },
        overcurrentType: [],
        overcurrentTypeOther: "",
        overcurrentAmp: "",
        overcurrentIc: "",
        surge: { result: null, detail: "" },
        surgeKV: "",
        surgeKA: "",
        ground: { result: null, detail: "" },
        groundOhm: "",
        groundCheck: { result: null, detail: "" },
        ext: {
          silica: { result: null, detail: "" },
          bushing: { result: null, detail: "" },
          oilLevel: { result: null, detail: "" },
          leak: { result: null, detail: "" }
        },
        sign: { result: null, detail: "" },
        other: ""
    }}],
    
   summaryType: {
        overallResult: null,
    },
    
    // Limitation
    limitation: "",
    
    // Signature
    signature: {
        officerSign: "",
        customerSign: "",
    }
};

// Helper functions
export const getNewOtherTransformer = () => ({
    general: {
        testResult: "",
        capacity: "",
        hvVoltage: "",
        lvVoltage: "",
        impedance: "",
        vectorGroup: "",
        transformerType: "",
        transformerTypeOther: "",
        shortCircuitCurrent: "",
        correct: { result: null, detail: "" }
    },
    type: [],
    typeOther: "",
    correct: { result: null, detail: "" },
    overcurrent: { result: null, detail: "" },
    overcurrentType: [],
    overcurrentTypeOther: "",
    overcurrentAmp: "",
    overcurrentIc: "",
    surge: { result: null, detail: "" },
    surgeKV: "",
    surgeKA: "",
    ground: { result: null, detail: "" },
    groundOhm: "",
    groundCheck: { result: null, detail: "" },
    ext: {
        silica: { result: null, detail: "" },
        bushing: { result: null, detail: "" },
        oilLevel: { result: null, detail: "" },
        leak: { result: null, detail: "" }
    },
    sign: { result: null, detail: "" },
    other: ""
});

export default otherFormSchema;
