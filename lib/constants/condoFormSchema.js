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
        mode: null, // "above" (เหนือดิน) หรือ "under" (ใต้ดิน)
        // Dynamic items based on mode
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

        // 2.3 การติดตั้งเครื่องปลดวงจรต้นทาง (แสดงเฉพาะเมื่อ sectionNumber === 2)
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

      // LV System
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
