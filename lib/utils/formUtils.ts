export const transformFormData = (data: Record<string, unknown>) => {
  const transformed: Record<string, unknown> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Keep original field names (don't convert to camelCase)
    const dbKey = key;
    
    // Handle different value types
    if (value === null || value === undefined || value === '') {
      transformed[dbKey] = null;
    } else if (typeof value === 'boolean') {
      transformed[dbKey] = value;
    } else if (Array.isArray(value)) {
      // Convert arrays to JSON strings for database storage
      transformed[dbKey] = value.length > 0 ? JSON.stringify(value) : null;
    } else if (typeof value === 'object' && value !== null) {
      // Convert objects to JSON strings
      transformed[dbKey] = JSON.stringify(value);
    } else if (typeof value === 'string') {
      // Handle string values
      const trimmed = value.trim();
      if (trimmed === '') {
        transformed[dbKey] = null;
      } else {
        // Handle specific string formats
        if (key.includes('date') && trimmed) {
          // Ensure date format is valid
          const date = new Date(trimmed);
          transformed[dbKey] = isNaN(date.getTime()) ? null : trimmed;
        } else {
          transformed[dbKey] = trimmed;
        }
      }
    } else if (typeof value === 'number') {
      transformed[dbKey] = isNaN(value) ? null : value;
    } else {
      transformed[dbKey] = value;
    }
  });
  
  return transformed;
};

export const sanitizeFormData = (data: Record<string, unknown>) => {
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
  data: Record<string, unknown>,
  requiredFields: string[] = [],
  customValidators: Record<string, (value: unknown) => string | null> = {}
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
