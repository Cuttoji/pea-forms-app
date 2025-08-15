export const transformFormData = (data: Record<string, any>) => {
  const transformed = { ...data };
  
  // Transform empty strings to null
  Object.entries(transformed).forEach(([key, value]) => {
    if (value === '') transformed[key] = null;
  });

  // Convert string numbers to actual numbers
  const numberFields = ['estimatedLoad', 'transformer_size_kva', 'transformer_impedance'];
  numberFields.forEach(field => {
    if (transformed[field]) {
      transformed[field] = Number(transformed[field]);
    }
  });

  // Format dates to ISO string
  const dateFields = ['inspectionDate', 'requestDate'];
  dateFields.forEach(field => {
    if (transformed[field]) {
      transformed[field] = new Date(transformed[field]).toISOString();
    }
  });

  return transformed;
};

export const sanitizeFormData = (data: Record<string, any>) => {
  const sanitized = { ...data };
  
  Object.entries(sanitized).forEach(([key, value]) => {
    // Sanitize strings
    if (typeof value === 'string') {
      sanitized[key] = value.trim().replace(/[<>]/g, '');
    }
    // Remove null/undefined values
    if (value === null || value === undefined) {
      delete sanitized[key];
    }
  });

  return sanitized;
};

/**
 * Validates form data based on required fields and custom validation rules
 * @param data - The form data to validate
 * @param requiredFields - Array of required field names
 * @param customValidators - Object with custom validation functions
 * @returns Object with validation results
 */
export const validateFormData = (
  data: Record<string, any>,
  requiredFields: string[] = [],
  customValidators: Record<string, (value: any) => string | null> = {}
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Check required fields
  requiredFields.forEach(field => {
    const value = data[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[field] = 'ฟิลด์นี้จำเป็นต้องกรอก';
    }
  });

  // Run custom validators
  Object.entries(customValidators).forEach(([field, validator]) => {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      const error = validator(data[field]);
      if (error) {
        errors[field] = error;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
