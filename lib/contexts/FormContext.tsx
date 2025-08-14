import React, { createContext, useContext, ReactNode } from 'react';

interface FormContextType {
  isDirty: boolean;
  setIsDirty?: (dirty: boolean) => void;
}

const FormContext = createContext<FormContextType>({ isDirty: false });

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [isDirty, setIsDirty] = React.useState(false);

  return (
    <FormContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
