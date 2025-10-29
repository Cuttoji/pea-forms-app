const evLvChargerFormSchema = {
  // General Information (ตรงกับ GeneralInfoLvSection)
  general: {
    powerAuthority: "",      // การไฟฟ้า
    inspectionNo: "",        // การตรวจสอบครั้งที่
    inspectionDate: "",      // วันที่ตรวจสอบ
    requestNo: "",           // การตรวจสอบตามคำร้องขอใช้ไฟเลขที่
    requestDate: "",         // วันที่คำร้อง
    userType: "individual",  // "individual" หรือ "corp"
    customerName: "",        // ชื่อ-นามสกุล (บุคคลธรรมดา)
    phone: "",               // โทรศัพท์ (บุคคลธรรมดา)
    corpName: "",            // ชื่อนิติบุคคล (นิติบุคคล)
    corpPhone: "",           // โทรศัพท์ (นิติบุคคล)
    address: "",             // ที่อยู่
    systemType: "",          // "3 เฟส (400 / 230 โวลต์)" หรือ "1 เฟส (230 โวลต์)"
    load: "",                // กระแสโหลด (A)
    evChargerCount: "",      // จำนวนเครื่องอัดประจุ
    evChargerPower: ""       // พิกัดกำลังไฟฟ้ารวม (kW)
  },

  // Documents
  documents: {
    electricalDocument: null, // "has" or "none"
    specificationStatus: "",
    hasSingleLineDiagram: false,
    singleLineDiagramStatus: "",
    singleLineDiagramNote: "",
    hasLoadSchedule: false
  },

  // LV System (PEA) - ตรงกับ LVSystemSectionPEA initialState
  LVSystemPEA: {
    // 3.1 วงจรประธานแรงต่ำ
    standard: "",
    standardCorrect: null,
    standardNote: "",
    conductorType: "",
    otherConductorType: "",
    phaseWireSize: "",
    phaseWireSizeCorrect: null,
    phaseWireSizeNote: "",
    neutralWireSize: "",
    neutralWireSizeCorrect: null,
    neutralWireSizeNote: "",
    phaseIdentificationCorrect: null,
    phaseIdentificationNote: "",
    cablePathwayCorrect: null,
    cablePathwayNote: "",
    wiringMethod: "",
    cableTraySize: { width: "", height: "" },
    conduitSize: "",
    conduitSizeWall: "",
    otherWiringMethod: "",
    wiringMethodCorrect: null,
    wiringMethodNote: "",
    conduitType: "",
    otherConduitType: "",
    conduitTypeCorrect: null,
    conduitTypeNote: "",
    
    // 3.2 เครื่องป้องกันกระแสเกินของแผงสายเมน
    mainBreakerStandardCorrect: null,
    mainBreakerStandardNote: "",
    mainBreakerSize: "",
    mainBreakerSizeCorrect: null,
    mainBreakerSizeNote: "",
    shortCircuitRating: "",
    shortCircuitRatingCorrect: null,
    shortCircuitRatingNote: "",
    
    // 3.3 ระบบการต่อสายดินและสายนิวทรัล
    groundWireSize: "",
    groundWireSizeCorrect: null,
    groundWireSizeNote: "",
    groundingSystem: "",
    groundingSystemCorrect: null,
    groundingSystemNote: "",
    
    // 3.4 ระบบสายดิน
    groundingConfig: "",
    tncsLoadBalance: false,
    tncsNeutralProtection: false,
    tncsTouchVoltageProtection: false,
    tncsCorrect: null,
    tncsNote: "",
    ttCorrect: null,
    ttNote: "",
    ttPartialCorrect: null,
    ttPartialNote: "",
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
      ],

  // Summary Section

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
export const getNewLvSubCircuit = () => ({
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

export const getNewLvEvCharger = () => ({
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

export default evLvChargerFormSchema;