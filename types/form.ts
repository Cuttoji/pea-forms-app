export interface FormFieldError {
  message: string;
  type: 'required' | 'format' | 'custom';
}

export interface FormErrors {
  [key: string]: FormFieldError;
}

export interface BaseFormData {
  id?: string | null;
  user_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}
