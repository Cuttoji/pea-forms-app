import React from 'react';
import { FieldType } from '@/types/forms';

interface FormFieldProps {
  label: string;
  name: string;
  type: FieldType;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  options?: { label: string; value: string | number }[];
  required?: boolean;
  className?: string;
}

export const FormField = ({
  label,
  name,
  type,
  value,
  onChange,
  error,
  options = [],
  required = false,
  className = '',
}: FormFieldProps) => {
  const baseInputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] sm:text-sm";
  
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`${baseInputClasses} ${className}`}
            required={required}
          >
            <option value="">เลือก{label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'radio':
        return (
          <div className="space-y-2">
            {options.map(option => (
              <label key={option.value} className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  className="form-radio h-4 w-4 text-[#5b2d90]"
                />
                <span className="ml-2">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`${baseInputClasses} ${className}`}
          />
        );
    }
  };

  return (
    <div className="form-control">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
