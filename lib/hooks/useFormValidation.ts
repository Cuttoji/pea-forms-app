import { useState, useCallback } from 'react';

interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}

type ValidationRules = {
  [key: string]: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: unknown) => boolean;
    message: string;
  };
};

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((name: string, value: unknown) => {
    const rule = rules[name];
    if (!rule) return '';

    if (rule.required && !value) {
      return rule.message;
    }

    if (value) {
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message;
      }

      if (rule.minLength && value.length < rule.minLength) {
        return `ต้องมีความยาวอย่างน้อย ${rule.minLength} ตัวอักษร`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return `ต้องมีความยาวไม่เกิน ${rule.maxLength} ตัวอักษร`;
      }

      if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          return `ค่าต้องไม่น้อยกว่า ${rule.min}`;
        }
        if (rule.max !== undefined && value > rule.max) {
          return `ค่าต้องไม่มากกว่า ${rule.max}`;
        }
      }

      if (rule.custom && !rule.custom(value)) {
        return rule.message;
      }
    }

    return '';
  }, [rules]);

  const validateForm = useCallback((data: Record<string, unknown>): ValidationState => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, data[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  }, [rules, validateField]);

  return {
    errors,
    validateField,
    validateForm,
    setErrors
  };
};
