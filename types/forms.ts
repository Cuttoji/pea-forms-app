export interface BaseFormState {
  id: string | null;
  user_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}

export type FieldType = 'text' | 'number' | 'date' | 'radio' | 'checkbox' | 'select';
