const condoFormSchema = {
    // General Information
    general: {
        inspectionNo: "",      // การตรวจสอบครั้งที่
        inspectionDate: "",    // วันที่ตรวจสอบ
        requestNo: "",         // เลขที่คำร้องขอใช้ไฟ
        requestDate: "",       // วันที่คำร้องขอใช้ไฟ
        customerName: "",      // ชื่อผู้ขอใช้ไฟ
        phone: "",             // โทรศัพท์มือถือ
        address: "",           // ที่อยู่
        systemType: "",        // ระบบไฟฟ้า (22kV, 33kV)
        load: "",              // โหลดประมาณ (kW)
        latitude: "",          // ละติจูด
        longitude: "",         // ลองจิจูด
        houseImage: "",        // URL หรือ base64 ของรูปหน้าบ้าน
    },
    
    // Documents
    documents: {
        electricalDocument: null // "has" or "none"
    },
    
    // HV System
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
            // Transformer basic data
            transformerData: {
                // 2.1 คุณสมบัติทั่วไปของหม้อแปลง
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

                // 2.2 ลักษณะการติดตั้ง
                type: [],                  // ["แขวน", "นั่งร้าน", "ตั้งพื้น", "ตั้งบนดาดฟ้า", "ห้องหม้อแปลง", "อื่นๆ"]
                typeOther: "",             // ถ้าเลือก "อื่นๆ"
                correct: { result: null, detail: "" },

                // 2.3 เครื่องป้องกันกระแสเกิน
                overcurrent: { result: null, detail: "" },
                overcurrentType: [],       // ["ดรอพเอาท์ฟิวส์คัตเอาท์", "เซอร์กิตเบรกเกอร์", "อื่นๆ"]
                overcurrentTypeOther: "",
                overcurrentAmp: "",        // พิกัดกระแสต่อเนื่อง (A)
                overcurrentIc: "",         // พิกัดตัดกระแสลัดวงจรสูงสุด (IC, kA)

                // 2.4 การติดตั้งกับดักเสิร์จแรงสูง
                surge: { result: null, detail: "" },
                surgeKV: "",               // พิกัดแรงดัน (kV)
                surgeKA: "",               // พิกัดกระแส (kA)

                // 2.5 การประกอบสายดิน
                ground: { result: null, detail: "" },

                // 2.6 ค่าความต้านทานดิน
                groundOhm: "",             // ค่าความต้านทานดิน (โอห์ม)
                groundCheck: { result: null, detail: "" },

                // 2.7 สภาพภายนอกหม้อแปลง (เฉพาะหม้อแปลงชนิดน้ำมัน)
                ext: {
                    silica: { result: null, detail: "" },    // 2.7.1 สารดูดความชื้น
                    bushing: { result: null, detail: "" },   // 2.7.2 สภาพบุชชิ่ง
                    oilLevel: { result: null, detail: "" },  // 2.7.3 ระดับน้ำมัน
                    leak: { result: null, detail: "" },      // 2.7.4 การรั่วซึมของน้ำมันหม้อแปลง
                },

                // 2.8 ป้ายเตือน
                sign: { result: null, detail: "" },

                // 2.9 อื่นๆ
                other: "",

                // lv: {} // สำหรับข้อมูลฝั่งแรงต่ำ (ถ้ามี)
                },
            
            // LV System
            lvSystem: {
                  // 2.14 สายตัวนำประธานแรงต่ำ
                conductorStandard: {
                    "2.14.1": { result: null, detail: "" }, // สายไฟฟ้าเป็นไปตามมาตรฐาน
                    "2.14.2": {
                    types: [],        // ["iec01", "nyy", "cv", "other"]
                    other: "",        // ถ้าเลือก "other"
                    size: "",         // ขนาดสายไฟ
                    sizeUnit: "ตร.มม.",
                    result: null,     // "ถูกต้อง" หรือ "ต้องแก้ไข"
                    detail: "",       // รายละเอียดถ้าต้องแก้ไข
                    },
                    "2.14.3": {
                    methods: [],      // ["air", "conduit", "wireway", "cabletray", "busway", "underground", "other"]
                    other: "",        // ถ้าเลือก "other"
                    },
                },

                // 2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร
                mainSwitch: {
                    result: null,         // "ถูกต้อง" หรือ "ต้องแก้ไข"
                    remark: "",           // หมายเหตุถ้า "ต้องแก้ไข"
                    cb_iec60947_2: false, // เซอร์กิตเบรกเกอร์ ตามมาตรฐาน IEC60947-2
                    switch_fuse: false,   // สวิตช์พร้อมฟิวส์
                    other_standard: "",   // มาตรฐานอื่นๆ
                    product: "",
                    type: "",
                    in: "",
                    ic: "",
                    voltage: "",
                    at: "",
                    af: "",
                },

                // 2.16 การต่อลงดินของแผงเมนสวิตช์ของอาคาร
                grounding: {
                    ground_wire_size: "", // ขนาดสายต่อหลักดิน
                    ground_wire_size_result: null,
                    ground_wire_size_remark: "",
                    resistance: { result: null, remark: "" }, // ค่าความต้านทานการต่อลงดิน
                    test_point: { result: null, remark: "" }, // จุดทดสอบ
                    busbar: { result: null, remark: "" },     // ขั้วต่อสายดิน/นิวทรัล
                },

                // 2.17 แผงจ่ายไฟประจำชั้น
                floorPanel: {
                    cb_standard: { result: null, remark: "" }, // เซอร์กิตเบรกเกอร์ตามมาตรฐาน
                    feeder: {
                    at: "",
                    af: "",
                    ic: "",
                    result: null,
                    remark: "",
                    },
                    ground_bus: { result: null, remark: "" }, // ขั้วต่อสายดิน
                },

                // 2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์
                meterBreaker: {
                    at: "",
                    af: "",
                    ic: "",
                    result: null,
                    remark: "",
                },

                // 2.19 สายตัวนำประธานเข้าห้องชุด
                roomConductor: {
                    result: null,
                    type: "",
                    size: "",
                    methods: [], // ["conduit", "wireway", "other"]
                    other: "",
                },

                // 2.20 แผงจ่ายไฟในห้องชุด
                roomPanel: {
                    cb_standard: { result: null, remark: "" },
                    meter: {
                    at: "",
                    af: "",
                    result: null,
                    remark: "",
                    },
                    ic: { result: null, remark: "" },
                },

                // 2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน
                roomPanelGroundBus: { result: null, remark: "" },

                // 2.22 อื่นๆ
                other: "",
                }
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
export const getNewCondoTransformer = () => ({
  transformerData: {
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
      correct: { result: null, detail: "" }
    },
    type: [],                  // ["แขวน", "นั่งร้าน", "ตั้งพื้น", "ตั้งบนดาดฟ้า", "ห้องหม้อแปลง", "อื่นๆ"]
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
  },
  lvSystem: {
    // 2.14 สายตัวนำประธานแรงต่ำ
    conductorStandard: {
      "2.14.1": { result: null, detail: "" },
      "2.14.2": {
        types: [],
        other: "",
        size: "",
        sizeUnit: "ตร.มม.",
        result: null,
        detail: "",
      },
      "2.14.3": {
        methods: [],
        other: "",
      },
    },
    // 2.15 เครื่องปลดวงจรและเครื่องป้องกันกระแสเกินที่แผงเมนสวิตช์ของอาคาร
    mainSwitch: {
      result: null,
      remark: "",
      cb_iec60947_2: false,
      switch_fuse: false,
      other_standard: "",
      product: "",
      type: "",
      in: "",
      ic: "",
      voltage: "",
      at: "",
      af: "",
    },
    // 2.16 การต่อลงดินของแผงเมนสวิตช์ของอาคาร
    grounding: {
      ground_wire_size: "",
      ground_wire_size_result: null,
      ground_wire_size_remark: "",
      resistance: { result: null, remark: "" },
      test_point: { result: null, remark: "" },
      busbar: { result: null, remark: "" },
    },
    // 2.17 แผงจ่ายไฟประจำชั้น
    floorPanel: {
      cb_standard: { result: null, remark: "" },
      feeder: {
        at: "",
        af: "",
        ic: "",
        result: null,
        remark: "",
      },
      ground_bus: { result: null, remark: "" },
    },
    // 2.18 เซอร์กิตเบรกเกอร์ด้านไฟเข้าของมิเตอร์
    meterBreaker: {
      at: "",
      af: "",
      ic: "",
      result: null,
      remark: "",
    },
    // 2.19 สายตัวนำประธานเข้าห้องชุด
    roomConductor: {
      result: null,
      type: "",
      size: "",
      methods: [],
      other: "",
    },
    // 2.20 แผงจ่ายไฟในห้องชุด
    roomPanel: {
      cb_standard: { result: null, remark: "" },
      meter: {
        at: "",
        af: "",
        result: null,
        remark: "",
      },
      ic: { result: null, remark: "" },
    },
    // 2.21 แผงจ่ายไฟในห้องชุดต้องมีขั้วต่อสายดิน
    roomPanelGroundBus: { result: null, remark: "" },
    // 2.22 อื่นๆ
    other: "",
  }
});
export default condoFormSchema;
