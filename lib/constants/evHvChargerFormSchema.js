const initialEvHvChargerForm = {
  // General Information
  general: {
    powerAuthority: "",
    inspectionNo: "",
    inspectionDate: "",
    requestNo: "",
    requestDate: "",
    userType: "individual",
    customerName: "",
    phone: "",
    corpName: "",
    corpPhone: "",
    address: "",
    systemType: "",
    load: "",
    evChargerCount: "",
    evChargerPower: ""
  },

  documents: {
    hasSpecification: false,
    specificationStatus: "",
    hasSingleLineDiagram: false,
    singleLineDiagramStatus: "",
    singleLineDiagramNote: "",
    hasLoadSchedule: false
  },

  hvSystem: {
    mode: null,
    "3.1_1": { result: null, text: "", detail: "" },
    "3.1_2": { result: null, text: "", detail: "" },
    "3.1_3": { result: null, detail: "" },
    "3.1_4": { result: null, detail: "" },
    "3.1_5": { result: null, detail: "" },
    "3.1_6": { result: null, detail: "" },
    "3.1_7": { result: null, detail: "" },
    "3.1_8": { result: null, detail: "" },
    "3.1_9": { result: null, detail: "" },
    "3.1_10": { result: null, detail: "" },
    "3.1_11": { result: null, detail: "" },
    "3.2_1": { result: null, text: "", detail: "" },
    "3.2_2": { result: null, text: "", detail: "" },
    "3.2_3": { result: null, detail: "" },
    "3.2_4": { result: null, detail: "" },
    "3.2_5": { result: null, detail: "" },
    "3.2_6": { result: null, detail: "" },
    "3.2_7": { result: null, detail: "" },
    hv33: {
      type: [],       // ["dropout", "switch", "rmu"] - เลือกก่อน
      switchType: "", // ถ้าเลือก switch
      result: null,   // ถูกต้อง/ต้องแก้ไข - เลือกหลัง
      detail: "",     // รายละเอียดถ้าต้องแก้ไข
    },
    other: "",
  },

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
        standard: [],
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

      // Panel Board (optional)
      panel: {
        hasPanelBoard: false,
        standard: [],
        standardCheck: { result: "", detail: "" },
        wireType: [],
        wireTypeOther: "",
        wireTypeCheck: { result: "", detail: "" },
        phaseSize: "",
        phaseSizeCheck: { result: "", detail: "" },
        neutralSize: "",
        neutralSizeCheck: { result: "", detail: "" },
        groundSize: "",
        groundSizeCheck: { result: "", detail: "" },
        phaseColor: { result: "", detail: "" },
        wirewayMechanical: { result: "", detail: "" },
        method: [],
        methodWirewayW: "",
        methodWirewayH: "",
        methodCableTrayW: "",
        methodCableTrayH: "",
        methodBuswayW: "",
        methodBuswayH: "",
        methodConduitWallSize: "",
        methodConduitBuriedSize: "",
        methodOther: "",
        methodCheck: { result: "", detail: "" },
        conduitType: [],
        conduitTypeOther: "",
        conduitCheck: { result: "", detail: "" },
        breakerStandard: { result: "", detail: "" },
        breakerSize: "",
        breakerCheck: { result: "", detail: "" },
        panelCapacity: { result: "", detail: "" },
        panelNeutralGround: { result: "", detail: "" }
      },

      // Sub Circuits
      subCircuits: [
        {
          circuitNo: "",
          evOnly: { result: null, detail: "" },
          evOnePerCircuit: { result: null, detail: "" },
          standard: [],
          wireType: [],
          wireTypeOther: "",
          phaseSize: "",
          phaseSizeCheck: { result: null, detail: "" },
          neutralSize: "",
          neutralSizeCheck: { result: null, detail: "" },
          groundSize: "",
          groundSizeCheck: { result: null, detail: "" },
          phaseColor: { result: null, detail: "" },
          wirewayMechanical: { result: null, detail: "" },
          method: [],
          methodConduitWallSize: "",
          methodConduitBuriedSize: "",
          methodWirewayW: "",
          methodWirewayH: "",
          methodCableTrayW: "",
          methodCableTrayH: "",
          methodOther: "",
          methodCheck: { result: null, detail: "" },
          conduitType: [],
          conduitTypeOther: "",
          conduitCheck: { result: null, detail: "" },
          breakerStandard: false,
          breakerMode3: false,
          breakerMode3AT: "",
          breakerMode2: false,
          breakerMode2AT: "",
          breakerCheck: { result: null, detail: "" },
          breakerSizeCheck: { result: null, detail: "" },
          rcdTypeB: false,
          rcdTypeBIn: "",
          rcdTypeAFPlusDD: false,
          rcdTypeBInCharger: false,
          rcdTypeBInChargerIn: "",
          rcdCheck: { result: null, detail: "" },
          rcdTypeBMain: { result: null, detail: "" },
          evChargers: [
            {
              // 5.7.1 ข้อมูลเครื่องอัดประจุ
              product: "",
              model: "",
              sn: "",
              ip: "",
              chargeType: "", // "1" หรือ "3" (radio button)
              chargingHeads: "",
              totalPower: "",
              totalCurrent: "",
              mode: [], // ["2", "3", "4"] (checkbox)
              infoCheck: { result: null, detail: "" },
              
              // 5.7.2 ลักษณะหัวชาร์จ
              headTypes: [], // ["ACType2", "DCCHAdeMO", "DCCCS", "Other"] (checkbox)
              acType2Current: "",
              acType2Voltage: "",
              acType2Power: "",
              dcChadeMoCurrent: "",
              dcChadeMoVoltage: "",
              dcChadeMoPower: "",
              dcCcsCurrent: "",
              dcCcsVoltage: "",
              dcCcsPower: "",
              otherHeadType: "",
              otherCurrent: "",
              otherVoltage: "",
              otherPower: "",
              simultaneousCharge: "",
              simultaneousChargeDetail: "",
              headCheck: { result: null, detail: "" },
              
              // 5.7.3 โหมด 2
              mode2OutletGrounding: { result: null, detail: "" },
              mode2OutletFixed: { result: null, detail: "" },
              mode2WarningSign: { result: null, detail: "" },
              
              // 5.7.4 โหมด 3 และ 4
              mode34DangerSign: { result: null, detail: "" },
              mode34EmergencySwitch: { result: null, detail: "" },
              mode34Ventilation: { result: null, detail: "" },
              mode34CableLength: { result: null, detail: "" },
              
              // 5.7.5 สถานีบริการน้ำมัน
              gasStationMode: { result: null, detail: "" },
              gasStationFixedCable: { result: null, detail: "" },
              gasStationMainSwitch: { result: null, detail: "" },
              gasStationSwitchDistance: { result: null, detail: "" },
              gasStationElectricalStandard: { result: null, detail: "" },
              gasStationSafetyDistance: { result: null, detail: "" },
              
              // 5.7.6 ข้อแนะนำ
              collisionProtection: "", // "ติดตั้งแล้ว" หรือ "ยังไม่ติดตั้ง" (radio)
              fireProtection: "", // "ติดตั้งแล้ว" หรือ "ยังไม่ติดตั้ง" (radio)
              lightningProtection: "" // "ติดตั้งแล้ว" หรือ "ยังไม่ติดตั้ง" (radio)
            }
          ]
        }
      ]
    }
  ],

  summary: {
    summaryType: null, // "compliant", "compliant_with_conditions", "non_compliant"
  },

  limitation: "",

  signature: {
    officerSign: "",
    customerSign: "",
  }
};

// Helper functions
export const getNewSubCircuit = () => ({
  circuitNo: "",
  evOnly: { result: null, detail: "" },
  evOnePerCircuit: { result: null, detail: "" },
  standard: [],
  wireType: [],
  wireTypeOther: "",
  phaseSize: "",
  phaseSizeCheck: { result: null, detail: "" },
  neutralSize: "",
  neutralSizeCheck: { result: null, detail: "" },
  groundSize: "",
  groundSizeCheck: { result: null, detail: "" },
  phaseColor: { result: null, detail: "" },
  wirewayMechanical: { result: null, detail: "" },
  method: [],
  methodConduitWallSize: "",
  methodConduitBuriedSize: "",
  methodWirewayW: "",
  methodWirewayH: "",
  methodCableTrayW: "",
  methodCableTrayH: "",
  methodOther: "",
  methodCheck: { result: null, detail: "" },
  conduitType: [],
  conduitTypeOther: "",
  conduitCheck: { result: null, detail: "" },
  breakerStandard: false,
  breakerMode3: false,
  breakerMode3AT: "",
  breakerMode2: false,
  breakerMode2AT: "",
  breakerCheck: { result: null, detail: "" },
  breakerSizeCheck: { result: null, detail: "" },
  rcdTypeB: false,
  rcdTypeBIn: "",
  rcdTypeAFPlusDD: false,
  rcdTypeBInCharger: false,
  rcdTypeBInChargerIn: "",
  rcdCheck: { result: null, detail: "" },
  rcdTypeBMain: { result: null, detail: "" },
  evChargers: []
});

export const getNewEvCharger = () => ({
  // 5.7.1 ข้อมูลเครื่องอัดประจุ
  product: "",
  model: "",
  sn: "",
  ip: "",
  chargeType: "", // "1" หรือ "3" (radio button)
  chargingHeads: "",
  totalPower: "",
  totalCurrent: "",
  mode: [], // ["2", "3", "4"] (checkbox)
  infoCheck: { result: null, detail: "" },
  
  // 5.7.2 ลักษณะหัวชาร์จ
  headTypes: [], // ["ACType2", "DCCHAdeMO", "DCCCS", "Other"] (checkbox)
  acType2Current: "",
  acType2Voltage: "",
  acType2Power: "",
  dcChadeMoCurrent: "",
  dcChadeMoVoltage: "",
  dcChadeMoPower: "",
  dcCcsCurrent: "",
  dcCcsVoltage: "",
  dcCcsPower: "",
  otherHeadType: "",
  otherCurrent: "",
  otherVoltage: "",
  otherPower: "",
  simultaneousCharge: "",
  simultaneousChargeDetail: "",
  headCheck: { result: null, detail: "" },
  
  // 5.7.3 โหมด 2
  mode2OutletGrounding: { result: null, detail: "" },
  mode2OutletFixed: { result: null, detail: "" },
  mode2WarningSign: { result: null, detail: "" },
  
  // 5.7.4 โหมด 3 และ 4
  mode34DangerSign: { result: null, detail: "" },
  mode34EmergencySwitch: { result: null, detail: "" },
  mode34Ventilation: { result: null, detail: "" },
  mode34CableLength: { result: null, detail: "" },
  
  // 5.7.5 สถานีบริการน้ำมัน
  gasStationMode: { result: null, detail: "" },
  gasStationFixedCable: { result: null, detail: "" },
  gasStationMainSwitch: { result: null, detail: "" },
  gasStationSwitchDistance: { result: null, detail: "" },
  gasStationElectricalStandard: { result: null, detail: "" },
  gasStationSafetyDistance: { result: null, detail: "" },
  
  // 5.7.6 ข้อแนะนำ
  collisionProtection: "", // "ติดตั้งแล้ว" หรือ "ยังไม่ติดตั้ง" (radio)
  fireProtection: "", // "ติดตั้งแล้ว" หรือ "ยังไม่ติดตั้ง" (radio)
  lightningProtection: "" // "ติดตั้งแล้ว" หรือ "ยังไม่ติดตั้ง" (radio)
});

export const getNewTransformer = () => ({
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
  lvSystem: {
    // 5.1.1 Standards
    standardMok11: false,
    standardMok293: false,
    standardIEC60502: false,
    standardCorrect: null,
    standardNote: "",
    
    // 5.1.2 Conductor Type
    conductorIEC01: false,
    conductorNYY: false,
    conductorCV: false,
    conductorOther: false,
    conductorOtherText: "",
    conductorTypeCorrect: null,
    conductorTypeNote: "",
    
    // 5.1.3-5.1.4 Wire Sizes
    phaseWireSize: "",
    phaseWireSizeCorrect: null,
    phaseWireSizeNote: "",
    neutralWireSize: "",
    neutralWireSizeCorrect: null,
    neutralWireSizeNote: "",
    
    // 5.1.5-5.1.6
    phaseIdentificationCorrect: null,
    phaseIdentificationNote: "",
    cablePathwayCorrect: null,
    cablePathwayNote: "",
    
    // 5.1.7 Wiring Method
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
    
    // 5.1.8 Conduit Type
    conduitMetalRMC: false,
    conduitMetalIMC: false,
    conduitMetalEMT: false,
    conduitNonMetalRNC: false,
    conduitNonMetalENT: false,
    conduitTypeOther: false,
    conduitTypeOtherText: "",
    conduitTypeCorrect: null,
    conduitTypeNote: "",
    
    // 5.2 Main Breaker
    mainBreakerStandardCorrect: null,
    mainBreakerStandardNote: "",
    mainBreakerSize: "",
    mainBreakerSizeCorrect: null,
    mainBreakerSizeNote: "",
    shortCircuitRating: "",
    shortCircuitRatingCorrect: null,
    shortCircuitRatingNote: "",
    groundFaultProtectionCorrect: null,
    groundFaultProtectionNote: "",
    
    // 5.3 Grounding
    groundWireSize: "",
    groundWireSizeCorrect: null,
    groundWireSizeNote: "",
    groundingConfig: "",
    groundingConfigCorrect: null,
    groundingConfigNote: "",
    
    // 5.4 Grounding System Types
    groundingSystem: "",
    tncsLoadBalance: false,
    tncsNeutralProtection: false,
    tncsTouchVoltageProtection: false,
    tncsCorrect: null,
    tncsNote: "",
    ttCorrect: null,
    ttNote: "",
    ttPartialCorrect: null,
    ttPartialNote: "",
    tnsCorrect: null,
    tnsNote: ""
  },
  panel: {
    hasPanelBoard: false,
    standard: [],
    standardCheck: { result: "", detail: "" },
    wireType: [],
    wireTypeOther: "",
    wireTypeCheck: { result: "", detail: "" },
    phaseSize: "",
    phaseSizeCheck: { result: "", detail: "" },
    neutralSize: "",
    neutralSizeCheck: { result: "", detail: "" },
    groundSize: "",
    groundSizeCheck: { result: "", detail: "" },
    phaseColor: { result: "", detail: "" },
    wirewayMechanical: { result: "", detail: "" },
    method: [],
    methodWirewayW: "",
    methodWirewayH: "",
    methodCableTrayW: "",
    methodCableTrayH: "",
    methodBuswayW: "",
    methodBuswayH: "",
    methodConduitWallSize: "",
    methodConduitBuriedSize: "",
    methodOther: "",
    methodCheck: { result: "", detail: "" },
    conduitType: [],
    conduitTypeOther: "",
    conduitCheck: { result: "", detail: "" },
    breakerStandard: { result: "", detail: "" },
    breakerSize: "",
    breakerCheck: { result: "", detail: "" },
    panelCapacity: { result: "", detail: "" },
    panelNeutralGround: { result: "", detail: "" }
  },
  subCircuits: [getNewSubCircuit()]
});

export default initialEvHvChargerForm;