const homeFormSchema = {
    // General Information
    general: {
        customerName: "",
        customerNumber: "",
        address: "",
        inspectionDate: "",
        inspector: "",
        province: "",
        district: "",
        subDistrict: "",
        postalCode: "",
        phone: "",
        email: ""
    },
    
    // Home Inspection Data
    inspection: {
        // Electrical system details
        mainBreakerSize: "",
        mainBreakerType: "",
        panelBrand: "",
        panelModel: "",
        circuitCount: "",
        groundingSystem: "",
        groundResistance: "",
        
        // Circuit details
        circuits: [
            {
                circuitNo: "",
                purpose: "",
                breakerSize: "",
                wireSize: "",
                wireType: "",
                condition: "",
                remark: ""
            }
        ],
        
        // Safety equipment
        rcdInstalled: false,
        rcdType: "",
        rcdRating: "",
        groundFaultProtection: false,
        
        // Wiring system
        wiringMethod: [],
        wiringCondition: "",
        
        // Outlets and switches
        outletCount: "",
        switchCount: "",
        outletType: [],
        
        // Lighting system
        lightingType: [],
        lightingControl: "",
        
        // Special circuits
        airConditionerCircuits: "",
        kitchenCircuits: "",
        bathroomCircuits: "",
        
        // Safety compliance
        electricalClearance: { result: null, detail: "" },
        properGrounding: { result: null, detail: "" },
        wiringProtection: { result: null, detail: "" },
        loadBalance: { result: null, detail: "" },
        
        // Overall condition
        overallCondition: "",
        safetyIssues: [],
        recommendations: ""
    },
    
    // Summary
    summary: {
        overallResult: null, // "ผ่าน" or "ไม่ผ่าน"
        remarks: "",
        recommendations: "",
        nextInspectionDate: ""
    },
    
    // Limitation
    limitation: {
        content: "",
        additionalNotes: "",
        limitations: []
    },
    
    // Signature
    signature: {
        inspectorSignature: "",
        customerSignature: "",
        date: "",
        inspectorName: "",
        customerName: ""
    }
};

// Helper functions
export const getNewCircuit = () => ({
    circuitNo: "",
    purpose: "",
    breakerSize: "",
    wireSize: "",
    wireType: "",
    condition: "",
    remark: ""
});

export const addCircuit = (inspection) => ({
    ...inspection,
    circuits: [...(inspection.circuits || []), getNewCircuit()]
});

export const removeCircuit = (inspection, index) => ({
    ...inspection,
    circuits: (inspection.circuits || []).filter((_, i) => i !== index)
});

export default homeFormSchema;