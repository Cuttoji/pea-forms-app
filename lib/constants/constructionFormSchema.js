const constructionFormSchema = {
    // General Information
    general: {
        customerName: "",
        customerNumber: "",
        address: "",
        inspectionDate: "",
        inspector: "",
        area: "",
        projectName: "",
        contractorName: "",
        projectType: "",
        constructionPhase: ""
    },
    
    // Documents
    documents: {
        electricalDocument: null, // "has" or "none"
        constructionPermit: null,
        electricalPlan: null,
        safetyPlan: null
    },
    
    // HV System
    hvSystem: {
        voltage: "",
        frequency: "",
        phases: "",
        neutral: "",
        earthing: "",
        protection: [],
        systemType: "",
        loadCapacity: "",
        temporarySupply: null
    },
    
    // Transformers array
    transformers: [
        {
            // Transformer basic data
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
                conduitCheck: { result: null, detail: "" },
                breakerStandard: { result: null, detail: "" },
                breakerSize: "",
                breakerCheck: { result: null, detail: "" },
                panelCapacity: { result: null, detail: "" },
                grounding: { result: null, detail: "" },
                groundResistance: "",
                neutralGrounding: { result: null, detail: "" },
                temporaryWiring: { result: null, detail: "" },
                weatherProtection: { result: null, detail: "" }
            }
        }
    ],
    
    // Construction-specific sections
    safety: {
        personalProtectiveEquipment: { result: null, detail: "" },
        emergencyShutoff: { result: null, detail: "" },
        fireExtinguisher: { result: null, detail: "" },
        firstAid: { result: null, detail: "" },
        safetyTraining: { result: null, detail: "" },
        workPermit: { result: null, detail: "" },
        lockoutTagout: { result: null, detail: "" }
    },
    
    environment: {
        dustControl: { result: null, detail: "" },
        noiseControl: { result: null, detail: "" },
        wasteDisposal: { result: null, detail: "" },
        spillPrevention: { result: null, detail: "" },
        airQuality: { result: null, detail: "" }
    },
    
    workProgress: {
        completionPercentage: "",
        milestones: [],
        delays: "",
        issues: "",
        nextPhase: ""
    },
    
    // Final sections
    summary: {
        overallResult: null,
        remarks: "",
        recommendations: "",
        safetyCompliance: null,
        environmentCompliance: null
    },
    
    limitation: {
        content: "",
        additionalNotes: "",
        weatherConditions: "",
        accessLimitations: ""
    },
    
    signature: {
        inspectorSignature: "",
        contractorSignature: "",
        customerSignature: "",
        date: ""
    }
};

// Helper functions
export const getNewConstructionTransformer = () => ({
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
        conduitCheck: { result: null, detail: "" },
        breakerStandard: { result: null, detail: "" },
        breakerSize: "",
        breakerCheck: { result: null, detail: "" },
        panelCapacity: { result: null, detail: "" },
        grounding: { result: null, detail: "" },
        groundResistance: "",
        neutralGrounding: { result: null, detail: "" },
        temporaryWiring: { result: null, detail: "" },
        weatherProtection: { result: null, detail: "" }
    }
});

export default constructionFormSchema;
