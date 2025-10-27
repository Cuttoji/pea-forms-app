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
            result: null,
            detail: "",
            type: [],       // ["dropout", "switch", "rmu"]
            switchType: "", // ถ้าเลือก switch
        },

        // อื่นๆ
        other: "",
        },
    
    // Transformers array
    transformers: [
        {
            // 4.1 คุณสมบัติทั่วไปของหม้อแปลง
            general: {
                testResult: "",           // "ผ่านการทดสอบ" หรือ "ไม่ผ่านการทดสอบ"
                capacity: "",             // ขนาด kVA
                hvVoltage: "",            // พิกัดแรงดันด้านแรงสูง (kV)
                lvVoltage: "",            // พิกัดแรงดันด้านแรงต่ำ (V)
                impedance: "",            // % Impedance
                vectorGroup: "",          // Vector Group
                transformerType: "",      // "Oil", "Dry", "อื่นๆ"
                transformerTypeOther: "", // ถ้าเลือก "อื่นๆ"
                shortCircuitCurrent: "",  // พิกัดการทนกระแสลัดวงจรสูงสุด (kA)
                correct: { result: null, detail: "" }, // ผลการประเมิน
            },

            // 4.2 ลักษณะการติดตั้ง
            type: [],                  // ["แขวน", "นั่งร้าน", "ตั้งพื้น", "ตั้งบนดาดฟ้า", "ห้องหม้อแปลง", "อื่นๆ"]
            typeOther: "",             // ถ้าเลือก "อื่นๆ"
            correct: { result: null, detail: "" },

            // 4.3 เครื่องป้องกันกระแสเกิน
            overcurrent: { result: null, detail: "" },
            overcurrentType: [],       // ["ดรอพเอาท์ฟิวส์คัตเอาท์", "เซอร์กิตเบรกเกอร์", "อื่นๆ"]
            overcurrentTypeOther: "",
            overcurrentAmp: "",        // พิกัดกระแสต่อเนื่อง (A)
            overcurrentIc: "",         // พิกัดตัดกระแสลัดวงจรสูงสุด (IC, kA)

            // 4.4 การติดตั้งกับดักเสิร์จแรงสูง
            surge: { result: null, detail: "" },
            surgeKV: "",               // พิกัดแรงดัน (kV)
            surgeKA: "",               // พิกัดกระแส (kA)

            // 4.5 การประกอบสายดิน
            ground: { result: null, detail: "" },

            // 4.6 ค่าความต้านทานดิน
            groundOhm: "",             // ค่าความต้านทานดิน (โอห์ม)
            groundCheck: { result: null, detail: "" },

            // 4.7 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)
            ext: {
                silica: { result: null, detail: "" },    // 4.7.1 สารดูดความชื้น
                bushing: { result: null, detail: "" },   // 4.7.2 สภาพบุชชิ่ง
                oilLevel: { result: null, detail: "" },  // 4.7.3 ระดับน้ำมัน
                leak: { result: null, detail: "" },      // 4.7.4 การรั่วซึมของน้ำมันหม้อแปลง
            },

            // 4.8 ป้ายเตือน
            sign: { result: null, detail: "" },

            // 4.9 อื่นๆ
            other: "",
        }
    ],
    
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
