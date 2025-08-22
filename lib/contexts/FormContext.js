import { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [formState, setFormState] = useState({
    isDirty: false,
    currentSection: 0,
    progress: {},
    draftKey: null,
    lastSaved: null
  });

  // Save draft every 30 seconds if form is dirty
  useEffect(() => {
    if (formState.isDirty) {
      const timer = setInterval(() => {
        saveDraft();
      }, 30000);
      return () => clearInterval(timer);
    }
  }, [formState.isDirty]);

  const saveDraft = async () => {
    // Save to localStorage
    // Implementation details...
  };

  return (
    <FormContext.Provider value={{ formState, setFormState, saveDraft }}>
      {children}
    </FormContext.Provider>
  );
}

export const useFormContext = () => useContext(FormContext);
