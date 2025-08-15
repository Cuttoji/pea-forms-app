/**
 * Transform form data for database submission
 * Handles type conversion and null values properly
 */
export const transformFormData = (data, userId, isUpdate = false) => {
  const transformed = isUpdate ? { ...data } : { ...data, user_id: userId };
  
  // Define fields that should be converted to numbers
  const numberFields = [
    // Common number fields across forms
    'estimatedload', 'estimatedLoad', 'estimated_load',
    'hvWorkVolumeKm', 'hvWorkVolumePoles', 'hvTransformerKVA',
    'lvWorkVolumeKm', 'lvWorkVolumePoles', 
    'hv_groundResistance', 'hv_groundResistanceSystem',
    'lv_totalGroundResistance', 'transformerKVA',
    'transformer_groundResistancePerPoint', 'transformer_groundResistanceSystem',
    
    // EV Charger specific fields
    'totalloadamp', 'numchargers', 'totalchargerpowerkw',
    'mainbreakeramprating', 'mainbreakericrating',
    'mainphasecablesizesqmm', 'mainneutralcablesizesqmm',
    'feederbreakeramprating', 'feederphasecablesizesqmm',
    'feederneutralcablesizesqmm', 'feedergroundcablesizesqmm',
    
    // HV inspection specific
    'transformersizekva', 'continuouscurrentratinga', 'interruptingcapacityka',
    'hvvoltageratingkv', 'lvvoltageratingv', 'impedancepercent',
    'shortcircuitratingka', 'groundconductorsizesqmm',
    'mainphasecablesizesqmm', 'mainneutralcablesizesqmm',
    
    // Construction specific
    'hvWorkVolumeKm', 'hvWorkVolumePoles', 'hvTransformerKVA',
    'lvWorkVolumeKm', 'lvWorkVolumePoles',
    
    // Condo specific
    'overhead_cable_size_sqmm', 'underground_cable_size_sqmm',
    'main_grounding_conductor_size_sqmm'
  ];
  
  // Convert number fields
  numberFields.forEach(field => {
    if (field in transformed) {
      const value = transformed[field];
      if (value === '' || value === null || value === undefined) {
        transformed[field] = null;
      } else {
        const numValue = Number(value);
        transformed[field] = isNaN(numValue) ? null : numValue;
      }
    }
  });
  
  // Define fields that should be converted to dates
  const dateFields = [
    'inspectiondate', 'inspectionDate', 'inspection_date',
    'requestdate', 'requestDate', 'request_date',
    'approvaldate', 'approvalDate', 'approval_date',
    'created_at', 'updated_at'
  ];
  
  // Convert date fields
  dateFields.forEach(field => {
    if (field in transformed) {
      const value = transformed[field];
      if (value === '' || value === null || value === undefined) {
        transformed[field] = null;
      } else if (typeof value === 'string' && value.trim() !== '') {
        // Validate date format
        const date = new Date(value);
        transformed[field] = isNaN(date.getTime()) ? null : value;
      }
    }
  });
  
  // Handle boolean fields
  const booleanFields = [
    'peaOperation', 'contractorWork', 'correctedAndApproved',
    'gfpinstalled', 'main_breaker_gfp_installed',
    'docspecevcharger', 'docsinglelinediagram', 'docloadschedule',
    'as_built_drawing_certified', 'engineer_license_copy'
  ];
  
  booleanFields.forEach(field => {
    if (field in transformed) {
      const value = transformed[field];
      if (typeof value === 'string') {
        transformed[field] = value === 'true' || value === '1';
      } else if (typeof value === 'number') {
        transformed[field] = value === 1;
      } else {
        transformed[field] = Boolean(value);
      }
    }
  });
  
  // Handle array fields - ensure they're properly formatted
  const arrayFields = [
    'disconnecting_device_type', 'lv_main_cable_wiring_method', 
    'room_feeder_wiring', 'wiringmethod', 'conduitmetaltype', 
    'conduitnonmetaltype', 'installationtype'
  ];
  
  arrayFields.forEach(field => {
    if (field in transformed) {
      const value = transformed[field];
      if (!Array.isArray(value)) {
        if (typeof value === 'string') {
          try {
            transformed[field] = JSON.parse(value);
          } catch {
            transformed[field] = value ? [value] : [];
          }
        } else {
          transformed[field] = value ? [value] : [];
        }
      }
    }
  });
  
  // Handle special JSON fields like transformers
  if ('transformers' in transformed && transformed.transformers) {
    if (typeof transformed.transformers === 'string') {
      try {
        transformed.transformers = JSON.parse(transformed.transformers);
      } catch {
        transformed.transformers = [];
      }
    }
    
    // Ensure transformers array has proper number types
    if (Array.isArray(transformed.transformers)) {
      transformed.transformers = transformed.transformers.map(transformer => ({
        ...transformer,
        kVA: transformer.kVA === '' ? null : (isNaN(Number(transformer.kVA)) ? null : Number(transformer.kVA)),
        yearMade: transformer.yearMade === '' ? null : (isNaN(Number(transformer.yearMade)) ? null : Number(transformer.yearMade))
      }));
    }
  }
  
  // Remove undefined values
  Object.keys(transformed).forEach(key => {
    if (transformed[key] === undefined) {
      delete transformed[key];
    }
  });
  
  return transformed;
};

/**
 * Sanitize form data to remove empty strings and convert to appropriate types
 */
export const sanitizeFormData = (data) => {
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    
    // Convert empty strings to null
    if (value === '') {
      sanitized[key] = null;
    }
    
    // Handle nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeFormData(value);
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'object' ? sanitizeFormData(item) : (item === '' ? null : item)
      );
    }
  });
  
  return sanitized;
};

/**
 * Validate form data before submission
 */
export const validateFormData = (data, requiredFields = []) => {
  const errors = [];
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`Field '${field}' is required`);
    }
  });
  
  // Validate number fields
  const numberFields = ['estimatedload', 'totalloadamp', 'numchargers'];
  numberFields.forEach(field => {
    if (data[field] !== null && data[field] !== undefined && data[field] !== '') {
      const num = Number(data[field]);
      if (isNaN(num) || num < 0) {
        errors.push(`Field '${field}' must be a valid positive number`);
      }
    }
  });
  
  // Validate date fields
  const dateFields = ['inspectiondate', 'requestdate'];
  dateFields.forEach(field => {
    if (data[field] && typeof data[field] === 'string') {
      const date = new Date(data[field]);
      if (isNaN(date.getTime())) {
        errors.push(`Field '${field}' must be a valid date`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
