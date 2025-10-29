const homeFormSchema = {
    // General Information
    general: {
        inspectionNo: "",         // การตรวจสอบครั้งที่
        inspectionDate: "",       // วันที่ตรวจสอบ
        requestNo: "",            // เลขที่คำร้องขอใช้ไฟ
        requestDate: "",          // วันที่คำร้องขอใช้ไฟ
        customerName: "",         // ชื่อผู้ขอใช้ไฟ
        phone: "",                // โทรศัพท์มือถือ
        address: "",              // ที่อยู่
        systemType: "",           // ระบบไฟฟ้า (3เฟส/1เฟส)
        load: "",                 // โหลดประมาณ (kW)
        latitude: "",             // ละติจูด
        longitude: "",            // ลองจิจูด
        houseImage: "",             // รูปบ้าน
    },
    
    // Home Inspection Data
    inspection: {
                // รายการตรวจสอบ checklist (2.1-2.3)
        items: [
            // { label: "...", result: "", detail: "" }
        ],

        // ข้อมูลสายไฟ
        standardTypes: "", // มาตรฐานที่ใช้ (มอก.11-2553, มอก.293-2541, IEC 60502)
        wireType: "",         // ชนิดสายไฟ (iec01, nyy, cv, other)
        wireOther: "",        // ระบุอื่นๆ (ถ้าเลือก other)
        wireSize: "",         // ขนาดสายไฟ (ตร.มม.)
        wireResult: "",       // ผลการตรวจสอบสายไฟ ("ถูกต้อง" หรือ "ต้องแก้ไข")
        wireDetail: "",       // รายละเอียดถ้าต้องแก้ไข

        // ขนาด AT (เซอร์กิตเบรกเกอร์)
        atSize: "",           // ขนาด AT ...A

        // ขนาดสายดินฝังใต้ดิน
        undergroundSize: "",  // ขนาดสายต่อหลักดิน ...ตร.มม.

        // RCD (2.4)
        rcdResult: "",        // ผลการตรวจสอบ RCD ("ถูกต้อง", "ไม่ติดตั้ง")
        rcdNote: "",          // หมายเหตุ/เหตุผลที่ไม่ติดตั้ง RCD
        },

    // Summary
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

export default homeFormSchema;