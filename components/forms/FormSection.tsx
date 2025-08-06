import React from 'react';
import { FormSectionProps } from '@/types/forms';

export const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <section className={`bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <h3 className="text-xl font-semibold text-[#5b2d90] mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};
