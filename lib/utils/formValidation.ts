export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormData {
  [key: string]: unknown;
}

export const validateForm = (data: FormData, rules: Record<string, unknown>): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  // Basic validation logic
  Object.keys(rules).forEach(fieldName => {
    const value = data[fieldName];
    const rule = rules[fieldName] as { required?: boolean; message?: string };
    
    if (rule?.required && (!value || value === '')) {
      errors[fieldName] = rule.message || `${fieldName} is required`;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export const sanitizeFormData = (data: FormData): FormData => {
  const sanitized: FormData = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};
