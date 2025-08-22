import React from 'react';
import { Control, Controller } from 'react-hook-form';

type FieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'radio' | 'textarea';

interface FormFieldProps {
  label: string;
  name: string;
  control: Control<Record<string, unknown>>;
  type?: FieldType;
  options?: { label: string; value: string | number }[];
  required?: boolean;
  className?: string;
}

export const FormField = ({
  label,
  name,
  control,
  type = 'text',
  options = [],
  required = false,
  className = '',
}: FormFieldProps) => {
  const baseInputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#a78bfa] focus:ring-[#a78bfa] sm:text-sm";
  
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="form-control">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {type === 'select' ? (
            <select
              {...field}
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
          ) : type === 'radio' ? (
            <div className="space-y-2">
              {options.map(option => (
                <label key={option.value} className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    {...field}
                    value={option.value}
                    className="form-radio h-4 w-4 text-[#5b2d90]"
                  />
                  <span className="ml-2">{option.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <input
              type={type}
              {...field}
              className={`${baseInputClasses} ${className}`}
            />
          )}
          
          {error && (
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};
          {error && (
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};
