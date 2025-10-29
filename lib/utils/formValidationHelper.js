/**
 * ฟังก์ชันช่วยในการตรวจสอบความครบถ้วนของฟอร์ม
 * และเลื่อนไปยังฟิลด์ที่ยังไม่ได้กรอก
 */

/**
 * ตรวจสอบว่าค่าเป็นค่าว่างหรือไม่
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * ตรวจสอบข้อมูลทั่วไป (General Info)
 */
export const validateGeneralInfo = (general) => {
  const errors = [];
  
  if (isEmpty(general?.inspectorName)) {
    errors.push({ field: 'inspectorName', message: 'กรุณากรอกชื่อผู้ตรวจสอบ', section: 'general' });
  }
  if (isEmpty(general?.customerName)) {
    errors.push({ field: 'customerName', message: 'กรุณากรอกชื่อผู้ขอใช้ไฟฟ้า', section: 'general' });
  }
  if (isEmpty(general?.address)) {
    errors.push({ field: 'address', message: 'กรุณากรอกที่อยู่', section: 'general' });
  }
  if (isEmpty(general?.caNo)) {
    errors.push({ field: 'caNo', message: 'กรุณากรอกเลขที่ CA', section: 'general' });
  }
  if (isEmpty(general?.inspectionDate)) {
    errors.push({ field: 'inspectionDate', message: 'กรุณาเลือกวันที่ตรวจสอบ', section: 'general' });
  }
  
  return errors;
};

/**
 * ตรวจสอบเอกสาร (Documents)
 */
export const validateDocuments = (documents) => {
  const errors = [];
  
  // ตรวจสอบว่ามีอย่างน้อย 1 เอกสารที่ถูกต้อง
  const hasAnyDocument = documents?.doc1 === '1' || 
                         documents?.doc2 === '1' || 
                         documents?.doc3 === '1' ||
                         documents?.doc4 === '1' ||
                         documents?.doc5 === '1';
  
  if (!hasAnyDocument) {
    errors.push({ field: 'documents', message: 'กรุณาเลือกอย่างน้อย 1 เอกสาร', section: 'documents' });
  }
  
  return errors;
};

/**
 * ตรวจสอบ LV System PEA (สำหรับ LV form)
 */
export const validateLVSystemPEA = (lvSystemPEA) => {
  const errors = [];
  
  // Section 3.1 - Service wire
  if (isEmpty(lvSystemPEA?.serviceWireSize)) {
    errors.push({ field: 'serviceWireSize', message: 'กรุณากรอกขนาดสายรับ', section: 'lvSystemPEA' });
  }
  if (isEmpty(lvSystemPEA?.serviceWireCorrect)) {
    errors.push({ field: 'serviceWireCorrect', message: 'กรุณาเลือกผลการตรวจสอบสายรับ', section: 'lvSystemPEA' });
  }
  
  // Section 3.2 - Main breaker
  if (isEmpty(lvSystemPEA?.mainBreakerStandard)) {
    errors.push({ field: 'mainBreakerStandard', message: 'กรุณาเลือกมาตรฐานเบรกเกอร์', section: 'lvSystemPEA' });
  }
  if (isEmpty(lvSystemPEA?.mainBreakerSize)) {
    errors.push({ field: 'mainBreakerSize', message: 'กรุณากรอกขนาดเบรกเกอร์หลัก', section: 'lvSystemPEA' });
  }
  if (isEmpty(lvSystemPEA?.shortCircuitRating)) {
    errors.push({ field: 'shortCircuitRating', message: 'กรุณากรอกค่า Short Circuit Rating', section: 'lvSystemPEA' });
  }
  
  // Section 3.3 - Meter
  if (isEmpty(lvSystemPEA?.meterCorrect)) {
    errors.push({ field: 'meterCorrect', message: 'กรุณาเลือกผลการตรวจสอบมิเตอร์', section: 'lvSystemPEA' });
  }
  
  // Section 3.4 - Grounding
  if (isEmpty(lvSystemPEA?.groundingSystemType)) {
    errors.push({ field: 'groundingSystemType', message: 'กรุณาเลือกระบบสายดิน', section: 'lvSystemPEA' });
  }
  if (isEmpty(lvSystemPEA?.groundingCorrect)) {
    errors.push({ field: 'groundingCorrect', message: 'กรุณาเลือกผลการตรวจสอบสายดิน', section: 'lvSystemPEA' });
  }
  
  return errors;
};

/**
 * ตรวจสอบ HV System (สำหรับ HV form)
 */
export const validateHVSystem = (hvSystem) => {
  const errors = [];
  
  if (isEmpty(hvSystem?.serviceWireCorrect)) {
    errors.push({ field: 'serviceWireCorrect', message: 'กรุณาเลือกผลการตรวจสอบสายรับ', section: 'hvSystem' });
  }
  if (isEmpty(hvSystem?.switchCorrect)) {
    errors.push({ field: 'switchCorrect', message: 'กรุณาเลือกผลการตรวจสอบสวิตช์', section: 'hvSystem' });
  }
  if (isEmpty(hvSystem?.meterCorrect)) {
    errors.push({ field: 'meterCorrect', message: 'กรุณาเลือกผลการตรวจสอบมิเตอร์', section: 'hvSystem' });
  }
  
  return errors;
};

/**
 * ตรวจสอบ Transformer (สำหรับ HV form)
 */
export const validateTransformers = (transformers) => {
  const errors = [];
  
  if (!transformers || transformers.length === 0) {
    errors.push({ field: 'transformers', message: 'กรุณาเพิ่มข้อมูลหม้อแปลงอย่างน้อย 1 ตัว', section: 'transformers' });
    return errors;
  }
  
  transformers.forEach((transformer, index) => {
    const transformerData = transformer.transformerData || {};
    
    if (isEmpty(transformerData.capacity)) {
      errors.push({ 
        field: `transformer-${index}-capacity`, 
        message: `กรุณากรอกขนาดความจุหม้อแปลงที่ ${index + 1}`, 
        section: 'transformers',
        transformerIndex: index 
      });
    }
    
    if (isEmpty(transformerData.installationCorrect)) {
      errors.push({ 
        field: `transformer-${index}-installation`, 
        message: `กรุณาเลือกผลการตรวจสอบการติดตั้งหม้อแปลงที่ ${index + 1}`, 
        section: 'transformers',
        transformerIndex: index 
      });
    }
  });
  
  return errors;
};

/**
 * ตรวจสอบ Panel Board
 */
export const validatePanelBoard = (panel) => {
  const errors = [];
  
  if (isEmpty(panel?.installationCorrect)) {
    errors.push({ field: 'installationCorrect', message: 'กรุณาเลือกผลการตรวจสอบตู้แผงหลัก', section: 'panel' });
  }
  
  return errors;
};

/**
 * ตรวจสอบ Sub Circuits และ EV Chargers
 */
export const validateSubCircuits = (subCircuits) => {
  const errors = [];
  
  if (!subCircuits || subCircuits.length === 0) {
    errors.push({ field: 'subCircuits', message: 'กรุณาเพิ่มข้อมูลวงจรย่อยอย่างน้อย 1 วงจร', section: 'subCircuits' });
    return errors;
  }
  
  subCircuits.forEach((subCircuit, scIndex) => {
    // ตรวจสอบข้อมูลวงจรย่อย
    if (isEmpty(subCircuit.breakerSize)) {
      errors.push({ 
        field: `subcircuit-${scIndex}-breaker`, 
        message: `กรุณากรอกขนาดเบรกเกอร์ของวงจรย่อยที่ ${scIndex + 1}`, 
        section: 'subCircuits',
        subCircuitIndex: scIndex 
      });
    }
    
    // ตรวจสอบ EV Chargers
    const evChargers = subCircuit.evChargers || [];
    if (evChargers.length === 0) {
      errors.push({ 
        field: `subcircuit-${scIndex}-chargers`, 
        message: `กรุณาเพิ่มข้อมูลเครื่องชาร์จในวงจรย่อยที่ ${scIndex + 1}`, 
        section: 'subCircuits',
        subCircuitIndex: scIndex 
      });
    }
    
    evChargers.forEach((charger, chargerIndex) => {
      if (isEmpty(charger.chargeType)) {
        errors.push({ 
          field: `charger-${scIndex}-${chargerIndex}-type`, 
          message: `กรุณาเลือกประเภทเครื่องชาร์จที่ ${chargerIndex + 1} ในวงจรที่ ${scIndex + 1}`, 
          section: 'subCircuits',
          subCircuitIndex: scIndex,
          chargerIndex: chargerIndex 
        });
      }
    });
  });
  
  return errors;
};

/**
 * ตรวจสอบสรุปผลการตรวจสอบ (Summary)
 */
export const validateSummary = (summary) => {
  const errors = [];
  
  if (isEmpty(summary?.summaryType)) {
    errors.push({ field: 'summaryType', message: 'กรุณาเลือกผลสรุปการตรวจสอบ', section: 'summary' });
  }
  
  return errors;
};

/**
 * ตรวจสอบลายเซ็น (Signature)
 */
export const validateSignature = (signature) => {
  const errors = [];
  
  if (isEmpty(signature?.officerSign)) {
    errors.push({ field: 'officerSign', message: 'กรุณาเซ็นชื่อเจ้าหน้าที่', section: 'signature' });
  }
  if (isEmpty(signature?.customerSign)) {
    errors.push({ field: 'customerSign', message: 'กรุณาเซ็นชื่อผู้ขอใช้ไฟฟ้า', section: 'signature' });
  }
  
  return errors;
};

/**
 * ตรวจสอบ Home Inspection Section
 */
export const validateHomeInspection = (inspection) => {
  const errors = [];
  
  // ตรวจสอบฟิลด์พื้นฐาน
  if (isEmpty(inspection?.electricMeterCorrect)) {
    errors.push({ field: 'electricMeterCorrect', message: 'กรุณาเลือกผลการตรวจสอบมิเตอร์ไฟฟ้า', section: 'inspection' });
  }
  if (isEmpty(inspection?.mainBreakerCorrect)) {
    errors.push({ field: 'mainBreakerCorrect', message: 'กรุณาเลือกผลการตรวจสอบเบรกเกอร์หลัก', section: 'inspection' });
  }
  if (isEmpty(inspection?.groundingCorrect)) {
    errors.push({ field: 'groundingCorrect', message: 'กรุณาเลือกผลการตรวจสอบระบบสายดิน', section: 'inspection' });
  }
  if (isEmpty(inspection?.wiringCorrect)) {
    errors.push({ field: 'wiringCorrect', message: 'กรุณาเลือกผลการตรวจสอบการเดินสาย', section: 'inspection' });
  }
  
  return errors;
};

/**
 * ฟังก์ชันหลักในการตรวจสอบฟอร์ม Home
 */
export const validateHomeForm = (form) => {
  const allErrors = [];
  
  allErrors.push(...validateGeneralInfo(form.general));
  allErrors.push(...validateHomeInspection(form.inspection));
  allErrors.push(...validateSummary(form.summary));
  allErrors.push(...validateSignature(form.signature));
  
  return allErrors;
};

/**
 * ฟังก์ชันหลักในการตรวจสอบฟอร์ม Condo
 */
export const validateCondoForm = (form) => {
  const allErrors = [];
  
  allErrors.push(...validateGeneralInfo(form.general));
  allErrors.push(...validateDocuments(form.documents));
  allErrors.push(...validateHVSystem(form.hvSystem));
  allErrors.push(...validateTransformers(form.transformers));
  allErrors.push(...validateSummary(form.summary));
  allErrors.push(...validateSignature(form.signature));
  
  return allErrors;
};

/**
 * ฟังก์ชันหลักในการตรวจสอบฟอร์ม Other
 */
export const validateOtherForm = (form) => {
  const allErrors = [];
  
  allErrors.push(...validateGeneralInfo(form.general));
  allErrors.push(...validateDocuments(form.documents));
  allErrors.push(...validateHVSystem(form.hvSystem));
  allErrors.push(...validateTransformers(form.transformers));
  allErrors.push(...validateSummary(form.summary));
  allErrors.push(...validateSignature(form.signature));
  
  return allErrors;
};

/**
 * ฟังก์ชันหลักในการตรวจสอบฟอร์ม HV
 */
export const validateHVForm = (form) => {
  const allErrors = [];
  
  allErrors.push(...validateGeneralInfo(form.general));
  allErrors.push(...validateDocuments(form.documents));
  allErrors.push(...validateHVSystem(form.hvSystem));
  allErrors.push(...validateTransformers(form.transformers));
  allErrors.push(...validateSummary(form.summary));
  allErrors.push(...validateSignature(form.signature));
  
  return allErrors;
};

/**
 * ฟังก์ชันหลักในการตรวจสอบฟอร์ม LV
 */
export const validateLVForm = (form) => {
  const allErrors = [];
  
  allErrors.push(...validateGeneralInfo(form.general));
  allErrors.push(...validateDocuments(form.documents));
  allErrors.push(...validateLVSystemPEA(form.LVSystemPEA));
  allErrors.push(...validatePanelBoard(form.panel));
  allErrors.push(...validateSubCircuits(form.subCircuits));
  allErrors.push(...validateSummary(form.summary));
  allErrors.push(...validateSignature(form.signature));
  
  return allErrors;
};

/**
 * แสดงรายการข้อผิดพลาดในรูปแบบ alert
 */
export const showValidationErrors = (errors) => {
  if (errors.length === 0) return;
  
  const errorMessages = errors.map((error, index) => 
    `${index + 1}. ${error.message}`
  ).join('\n');
  
  alert(`กรุณากรอกข้อมูลให้ครบถ้วน:\n\n${errorMessages}`);
};

/**
 * เลื่อนไปยังฟิลด์แรกที่มีข้อผิดพลาด
 */
export const scrollToFirstError = (errors) => {
  if (errors.length === 0) return;
  
  const firstError = errors[0];
  const sectionMap = {
    'general': 'general-info-section',
    'documents': 'document-section',
    'inspection': 'home-inspection-section',
    'lvSystemPEA': 'lv-system-pea-section',
    'hvSystem': 'hv-system-section',
    'transformers': 'transformers-section',
    'panel': 'panel-board-section',
    'subCircuits': 'sub-circuits-section',
    'summary': 'summary-section',
    'signature': 'signature-section'
  };
  
  const sectionId = sectionMap[firstError.section];
  if (!sectionId) return;
  
  // ลองหา element โดยใช้ id หรือ data-section attribute
  let element = document.getElementById(sectionId);
  
  if (!element) {
    // ถ้าไม่เจอ ลองหาจาก data-section
    element = document.querySelector(`[data-section="${firstError.section}"]`);
  }
  
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // เพิ่ม highlight effect
    element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
    setTimeout(() => {
      element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2');
    }, 3000);
  }
};

/**
 * ฟังก์ชันรวมที่จะใช้ในฟอร์ม
 */
export const validateAndScroll = (form, formType = 'LV') => {
  let errors = [];
  
  switch (formType) {
    case 'HV':
      errors = validateHVForm(form);
      break;
    case 'LV':
      errors = validateLVForm(form);
      break;
    case 'Home':
      errors = validateHomeForm(form);
      break;
    case 'Condo':
      errors = validateCondoForm(form);
      break;
    case 'Other':
      errors = validateOtherForm(form);
      break;
    default:
      errors = validateLVForm(form);
  }
  
  if (errors.length > 0) {
    showValidationErrors(errors);
    scrollToFirstError(errors);
    return false;
  }
  
  return true;
};
