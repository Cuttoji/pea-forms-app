const evLvChargerFormSchema = {
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
    
    // Panel Board (optional)
    panel: {
        hasPanelBoard: false,
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
    
    // Inspection data with sub circuits
    inspection: {
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
                        // Basic info
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
                        
                        // Head types
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
                        
                        // Mode specific fields
                        mode2OutletGrounding: { result: null, detail: "" },
                        mode2OutletFixed: { result: null, detail: "" },
                        mode2WarningSign: { result: null, detail: "" },
                        mode34DangerSign: { result: null, detail: "" },
                        mode34EmergencySwitch: { result: null, detail: "" },
                        mode34Ventilation: { result: null, detail: "" },
                        mode34CableLength: { result: null, detail: "" },
                        
                        // Gas station specific
                        gasStationMode: { result: null, detail: "" },
                        gasStationFixedCable: { result: null, detail: "" },
                        gasStationMainSwitch: { result: null, detail: "" },
                        gasStationSwitchDistance: { result: null, detail: "" },
                        gasStationElectricalStandard: { result: null, detail: "" },
                        gasStationSafetyDistance: { result: null, detail: "" },
                        
                        // Protection recommendations
                        collisionProtection: null,
                        fireProtection: null,
                        lightningProtection: null
                    }
                ]
            }
        ]
    },
    
    // Final sections
    summary: {
        overallResult: null,
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

export default evLvChargerFormSchema;