const condoFormSchema = {

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
    
  documents: {
    electricalDocument: "", // "has" หรือ "none"
  },
    
    // HV System
  hvSystem: {
    mode: null,
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
    hv33: {
      type: [],       // ["dropout", "switch", "rmu"] - เลือกก่อน
      switchType: "", // ถ้าเลือก switch
      result: null,   // ถูกต้อง/ต้องแก้ไข - เลือกหลัง
      detail: "",     // รายละเอียดถ้าต้องแก้ไข
    },
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
      },

      // LV System - ปรับใหม่ให้ตรงกับ LVSystemSection
      lvSystem: {
        // 5.1.1 Standards - ใช้ checkbox แยก
        standardMok11: false,
        standardMok293: false,
        standardIEC60502: false,
        standardCorrect: null,
        standardNote: "",
        
        // 5.1.2 Conductor Type - ใช้ checkbox แยก
        conductorIEC01: false,
        conductorNYY: false,
        conductorCV: false,
        conductorOther: false,
        conductorOtherText: "",
        conductorTypeCorrect: null,
        conductorTypeNote: "",
        
        // 5.1.3 Phase Wire Size
        phaseWireSize: "",
        phaseWireSizeCorrect: null,
        phaseWireSizeNote: "",
        
        // 5.1.4 Neutral Wire Size
        neutralWireSize: "",
        neutralWireSizeCorrect: null,
        neutralWireSizeNote: "",
        
        // 5.1.5 Phase Identification
        phaseIdentificationCorrect: null,
        phaseIdentificationNote: "",
        
        // 5.1.6 Cable Pathway
        cablePathwayCorrect: null,
        cablePathwayNote: "",
        
        // 5.1.7 Wiring Method - ใช้ checkbox แยก
        wiringOverhead: false,
        wiringCableTray: false,
        wiringDirectBuried: false,
        wiringConduitBuried: false,
        wiringConduitWall: false,
        wiringOther: false,
        wiringOtherText: "",
        cableTraySize: { width: "", height: "" },
        conduitBuriedSize: "",
        conduitWallSize: "",
        wiringMethodCorrect: null,
        wiringMethodNote: "",
        
        // 5.1.8 Conduit Type - ใช้ checkbox แยก
        conduitMetalRMC: false,
        conduitMetalIMC: false,
        conduitMetalEMT: false,
        conduitNonMetalRNC: false,
        conduitNonMetalENT: false,
        conduitTypeOther: false,
        conduitTypeOtherText: "",
        conduitTypeCorrect: null,
        conduitTypeNote: "",
        
        // 5.2 Main Breaker Protection
        // 5.2.1 Main Breaker Standard
        mainBreakerStandardCorrect: null,
        mainBreakerStandardNote: "",
        
        // 5.2.2 Main Breaker Size
        mainBreakerSize: "",
        mainBreakerSizeCorrect: null,
        mainBreakerSizeNote: "",
        
        // 5.2.3 Short Circuit Rating
        shortCircuitRating: "",
        shortCircuitRatingCorrect: null,
        shortCircuitRatingNote: "",
        
        // 5.2.4 Ground Fault Protection
        groundFaultProtectionCorrect: null,
        groundFaultProtectionNote: "",
        
        // 5.3 Grounding System at Main Panel
        // 5.3.1 Ground Wire Size
        groundWireSize: "",
        groundWireSizeCorrect: null,
        groundWireSizeNote: "",
        
        // 5.3.2 Grounding Configuration
        groundingConfig: "", // "single_phase" หรือ "three_phase"
        groundingConfigCorrect: null,
        groundingConfigNote: "",
        
        // 5.4 Grounding System Type
        groundingSystem: "", // "TN-C-S", "TT", "TT_partial", "TN-S"
        
        // 5.4.1 TN-C-S System Requirements
        tncsLoadBalance: false,
        tncsNeutralProtection: false,
        tncsTouchVoltageProtection: false,
        tncsCorrect: null,
        tncsNote: "",
        
        // 5.4.2 TT System Requirements
        ttCorrect: null,
        ttNote: "",
        
        // 5.4.3 TT Partial System Requirements
        ttPartialCorrect: null,
        ttPartialNote: "",
        
        // 5.4.4 TN-S System Requirements
        tnsCorrect: null,
        tnsNote: ""
      },
    }
  ],
    
  summary: {
    summaryType: null, // "compliant", "compliant_with_conditions", "non_compliant"
  },
    // Limitation
    limitation: "",
    
    // Signature
    signature: {
        officerSign: "",
        customerSign: "",
    },
    
    // LV System Section (2.17-2.22)
    lvSystemPanels: [
      {
        cb_standard: { result: null, remark: "" }, // 2.17.1
        feeder: { at: "", af: "", ic: "", result: null, remark: "" }, // 2.17.2
        ground_bus: { result: null, remark: "" }, // 2.17.3
        rooms: [
          {
            meterBreaker: { at: "", af: "", ic: "", result: null, remark: "" }, // 2.18
            roomConductor: {
              type: "",
              size: "",
              methods: [], // ['conduit', 'wireway', 'other']
              other: "",
              result: null,
              remark: ""
            }, // 2.19
            roomPanel: {
              cb_standard: { result: null, remark: "" }, // 2.20.1
              meter: { at: "", af: "", result: null, remark: "" }, // 2.20.2
              ic: { result: null, remark: "" } // 2.20.3
            },
            roomPanelGroundBus: { result: null, remark: "" }, // 2.21
            note: "" // 2.22
          }
        ]
      }
    ],
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
  
  // LV System (ตรงกับ LVSystemSectionPEA)
  lvSystem: {
    // 3.1 วงจรประธานแรงต่ำ
    // 3.1.1 สายตัวนำประธาน (สายเมน) เป็นไปตามมาตรฐาน
    standard: "",  // "มอก. 11-2553", "มอก. 293-2541", "IEC 60502", "อื่นๆ"
    standardCorrect: null,
    standardNote: "",
    
    // 3.1.2 ชนิดสายตัวนำ
    conductorType: "",  // "IEC01", "NYY", "CV", "อื่นๆ"
    otherConductorType: "",
    conductorTypeCorrect: null,
    conductorTypeNote: "",
    
    // 3.1.3 ขนาดสายเฟส
    phaseWireSize: "",
    phaseWireSizeCorrect: null,
    phaseWireSizeNote: "",
    
    // 3.1.4 ขนาดสายนิวทรัล
    neutralWireSize: "",
    neutralWireSizeCorrect: null,
    neutralWireSizeNote: "",
    
    // 3.1.5 ระบุเฟสสายตัวนำ
    phaseIdentificationCorrect: null,
    phaseIdentificationNote: "",
    
    // 3.1.6 ช่องเดินสาย
    cablePathwayCorrect: null,
    cablePathwayNote: "",
    
    // 3.1.7 วิธีการเดินสาย
    wiringMethod: "",  // "overhead", "cableTray", "directBuried", "conduitBuried", "conduitWall", "อื่นๆ"
    cableTraySize: { width: "", height: "" },
    conduitSize: "",  // สำหรับ conduitBuried
    conduitSizeWall: "",  // สำหรับ conduitWall
    otherWiringMethod: "",
    wiringMethodCorrect: null,
    wiringMethodNote: "",
    
    // 3.1.8 ประเภทท่อร้อยสาย
    conduitType: "",  // "RMC", "IMC", "EMT", "RNC", "ENT", "Flexible", "อื่นๆ"
    otherConduitType: "",
    conduitTypeCorrect: null,
    conduitTypeNote: "",
    
    // 3.2 เครื่องป้องกันกระแสเกินของแผงเมนสวิตช์ (บริภัณฑ์ประธาน)
    // 3.2.1 เมนเซอร์กิตเบรกเกอร์เป็นไปตามมาตรฐาน
    mainBreakerStandardCorrect: null,
    mainBreakerStandardNote: "",
    
    // 3.2.2 เมนเซอร์กิตเบรกเกอร์ขนาด
    mainBreakerSize: "",
    mainBreakerSizeCorrect: null,
    mainBreakerSizeNote: "",
    
    // 3.2.3 พิกัดทนกระแสลัดวงจร
    shortCircuitRating: "",
    shortCircuitRatingCorrect: null,
    shortCircuitRatingNote: "",
    
    // 3.3 ระบบการต่อลงดินที่แผงเมนสวิตช์
    // 3.3.1 สายต่อหลักดิน
    groundWireSize: "",
    groundWireSizeCorrect: null,
    groundWireSizeNote: "",
    
    // 3.3.2 การต่อลงดินที่แผงเมนสวิตช์
    groundingSystem: "",  // "single_phase" หรือ "three_phase"
    groundingSystemCorrect: null,
    groundingSystemNote: "",
    
    // 3.4 รูปแบบการต่อลงดินที่แผงเมนสวิตช์
    groundingConfig: "",  // "TN-C-S", "TT", "TT_partial", "TN-S"
    
    // 3.4.1 กรณีต่อลงดินแบบ TN-C-S ทั้งระบบ
    tncsLoadBalance: false,
    tncsNeutralProtection: false,
    tncsTouchVoltageProtection: false,
    tncsCorrect: null,
    tncsNote: "",
    
    // 3.4.2 กรณีต่อลงดินแบบ TT ทั้งระบบ
    ttCorrect: null,
    ttNote: "",
    
    // 3.4.3 กรณีต่อลงดินแบบ TT บางส่วน
    ttPartialCorrect: null,
    ttPartialNote: "",
    
    // 3.4.4 กรณีต่อลงดินแบบ TN-S ทั้งระบบ
    tnsCorrect: null,
    tnsNote: ""
  }
});
export default condoFormSchema;
