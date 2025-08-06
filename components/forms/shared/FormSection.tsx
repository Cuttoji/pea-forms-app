import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const FormSection = ({ title, children, className = '' }: FormSectionProps) => (
  <section className={`bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}>
    <h3 className="text-xl font-semibold text-primary mb-4">{title}</h3>
    {children}
  </section>
);
