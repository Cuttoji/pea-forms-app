const otherFormSchema = {
    // General Information
    general: {
        customerName: "",
        customerNumber: "",
        address: "",
        inspectionDate: "",
        inspector: "",
        area: "",
        buildingType: "",
        purpose: ""
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
        protection: [],
        systemType: "",
        loadCapacity: ""
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
        }
    ],
    
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
export const getNewOtherTransformer = () => ({
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
    lvSystem: {},
    hasPanel: false,
    panel: {
        brand: "",
        model: "",
        current: "",
        slots: "",
        condition: { result: null, detail: "" }
    }
});

export default otherFormSchema;
