const initialEvHvChargerForm = {
    // General Information
    general: {
        customerName: "",
        customerNumber: "",
        address: "",
        inspectionDate: "",
        inspector: "",
        area: ""
    },
    
    // Documents
    documents: {
        electricalDocument: null // "has" or "none"
    },
    
    // HV System
    hvSystem: {
        voltage: "",
        frequency: "",
        phases: "",
        neutral: "",
        earthing: "",
        protection: []
    },
    
    // Transformers array
    transformers: [
        {
            // Transformer data
            transformerData: {
                general: {
                    testResult: null, // "ผ่านการทดสอบ" or "ไม่ผ่านการทดสอบ"
                    capacity: "",
                    hvVoltage: "",
                    lvVoltage: "",
                    impedance: "",
                    vectorGroup: "",
                    transformerType: null, // "Oil", "Dry", "อื่นๆ"
                    transformerTypeOther: "",
                    shortCircuitCurrent: "",
                    correct: { result: null, detail: "" }
                },
                type: [], // installation types
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
                standard: [],
                standardCheck: { result: null, detail: "" },
                wireType: [],
                wireTypeOther: "",
                wireTypeCheck: { result: null, detail: "" },
                phaseSize: "",
                phaseSizeCheck: { result: null, detail: "" },
                neutralSize: "",
                neutralSizeCheck: { result: null, detail: "" },
                groundSize: "",
                groundSizeCheck: { result: null, detail: "" },
                phaseColor: { result: null, detail: "" },
                wirewayMechanical: { result: null, detail: "" },
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
                methodCheck: { result: null, detail: "" },
                conduitType: [],
                conduitTypeOther: "",
                conduitCheck: { result: null, detail: "" }
            },
            
            // Panel Board (optional)
            hasPanelBoard: false,
            panel: {
                standard: [],
                standardCheck: { result: null, detail: "" },
                wireType: [],
                wireTypeOther: "",
                wireTypeCheck: { result: null, detail: "" },
                phaseSize: "",
                phaseSizeCheck: { result: null, detail: "" },
                neutralSize: "",
                neutralSizeCheck: { result: null, detail: "" },
                groundSize: "",
                groundSizeCheck: { result: null, detail: "" },
                phaseColor: { result: null, detail: "" },
                wirewayMechanical: { result: null, detail: "" },
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
                methodCheck: { result: null, detail: "" },
                conduitType: [],
                conduitTypeOther: "",
                conduitCheck: { result: null, detail: "" },
                breakerStandard: { result: null, detail: "" },
                breakerSize: "",
                breakerCheck: { result: null, detail: "" },
                panelCapacity: { result: null, detail: "" },
                panelNeutralGround: { result: null, detail: "" }
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
                    
                    // EV Chargers in this sub-circuit
                    evChargers: [
                        {
                            // Basic info (5.7.1)
                            product: "",
                            model: "",
                            sn: "",
                            ip: "",
                            chargeType: [], // ["1", "3"]
                            chargingHeads: "",
                            totalPower: "",
                            totalCurrent: "",
                            mode: [], // ["2", "3", "4"]
                            infoCheck: { result: null, detail: "" },
                            
                            // Head types (5.7.2)
                            headTypes: [], // ["ACType2", "DCCHAdeMO", "DCCCS", "Other"]
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
                            
                            // Mode 2 specific (5.7.3)
                            mode2OutletGrounding: { result: null, detail: "" },
                            mode2OutletFixed: { result: null, detail: "" },
                            mode2WarningSign: { result: null, detail: "" },
                            
                            // Mode 3 & 4 specific (5.7.4)
                            mode34DangerSign: { result: null, detail: "" },
                            mode34EmergencySwitch: { result: null, detail: "" },
                            mode34Ventilation: { result: null, detail: "" },
                            mode34CableLength: { result: null, detail: "" },
                            
                            // Gas station specific (5.7.5)
                            gasStationMode: { result: null, detail: "" },
                            gasStationFixedCable: { result: null, detail: "" },
                            gasStationMainSwitch: { result: null, detail: "" },
                            gasStationSwitchDistance: { result: null, detail: "" },
                            gasStationElectricalStandard: { result: null, detail: "" },
                            gasStationSafetyDistance: { result: null, detail: "" },
                            
                            // Protection recommendations (5.7.6)
                            collisionProtection: null, // "ติดตั้งแล้ว" or "ยังไม่ติดตั้ง"
                            fireProtection: null, // "ติดตั้งแล้ว" or "ยังไม่ติดตั้ง"
                            lightningProtection: null // "ติดตั้งแล้ว" or "ยังไม่ติดตั้ง"
                        }
                    ]
                }
            ]
        }
    ],
    
    // Final sections
    summary: {
        overallResult: null, // "ผ่าน" or "ไม่ผ่าน"
        remarks: "",
        recommendations: ""
    },
    
    limitation: {
        content: "",
        additionalNotes: ""
    },
    
    signature: {
        inspectorSignature: "",
        customerSignature: "",
        date: ""
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
    product: "",
    model: "",
    sn: "",
    ip: "",
    chargeType: [],
    chargingHeads: "",
    totalPower: "",
    totalCurrent: "",
    mode: [],
    infoCheck: { result: null, detail: "" },
    headTypes: [],
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
    mode2OutletGrounding: { result: null, detail: "" },
    mode2OutletFixed: { result: null, detail: "" },
    mode2WarningSign: { result: null, detail: "" },
    mode34DangerSign: { result: null, detail: "" },
    mode34EmergencySwitch: { result: null, detail: "" },
    mode34Ventilation: { result: null, detail: "" },
    mode34CableLength: { result: null, detail: "" },
    gasStationMode: { result: null, detail: "" },
    gasStationFixedCable: { result: null, detail: "" },
    gasStationMainSwitch: { result: null, detail: "" },
    gasStationSwitchDistance: { result: null, detail: "" },
    gasStationElectricalStandard: { result: null, detail: "" },
    gasStationSafetyDistance: { result: null, detail: "" },
    collisionProtection: null,
    fireProtection: null,
    lightningProtection: null
});

export const getNewTransformer = () => ({
    transformerData: {
        general: {
            testResult: null,
            capacity: "",
            hvVoltage: "",
            lvVoltage: "",
            impedance: "",
            vectorGroup: "",
            transformerType: null,
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
        standard: [],
        standardCheck: { result: null, detail: "" },
        wireType: [],
        wireTypeOther: "",
        wireTypeCheck: { result: null, detail: "" },
        phaseSize: "",
        phaseSizeCheck: { result: null, detail: "" },
        neutralSize: "",
        neutralSizeCheck: { result: null, detail: "" },
        groundSize: "",
        groundSizeCheck: { result: null, detail: "" },
        phaseColor: { result: null, detail: "" },
        wirewayMechanical: { result: null, detail: "" },
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
        methodCheck: { result: null, detail: "" },
        conduitType: [],
        conduitTypeOther: "",
        conduitCheck: { result: null, detail: "" }
    },
    hasPanelBoard: false,
    panel: {
        standard: [],
        standardCheck: { result: null, detail: "" },
        wireType: [],
        wireTypeOther: "",
        wireTypeCheck: { result: null, detail: "" },
        phaseSize: "",
        phaseSizeCheck: { result: null, detail: "" },
        neutralSize: "",
        neutralSizeCheck: { result: null, detail: "" },
        groundSize: "",
        groundSizeCheck: { result: null, detail: "" },
        phaseColor: { result: null, detail: "" },
        wirewayMechanical: { result: null, detail: "" },
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
        methodCheck: { result: null, detail: "" },
        conduitType: [],
        conduitTypeOther: "",
        conduitCheck: { result: null, detail: "" },
        breakerStandard: { result: null, detail: "" },
        breakerSize: "",
        breakerCheck: { result: null, detail: "" },
        panelCapacity: { result: null, detail: "" },
        panelNeutralGround: { result: null, detail: "" }
    },
    subCircuits: [getNewSubCircuit()]
});

export default initialEvHvChargerForm;