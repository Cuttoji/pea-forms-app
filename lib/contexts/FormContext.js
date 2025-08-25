import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [formState, setFormState] = useState({
    isDirty: false,
    currentSection: 0,
    progress: {},
    draftKey: null,
    lastSaved: null
  });

  // Memoize saveDraft function to prevent infinite loops
  const saveDraft = useCallback(async () => {
    // Save to localStorage with timestamp
    // Implementation details...
  }, []);

  // Save draft every 30 seconds if form is dirty
  useEffect(() => {
    if (formState.isDirty) {
      const timer = setInterval(saveDraft, 30000);
      return () => clearInterval(timer);
    }
  }, [formState.isDirty, saveDraft]);

  return (
    <FormContext.Provider value={{ formState, setFormState, saveDraft }}>
      {children}
    </FormContext.Provider>
  );
}

export const useFormContext = () => useContext(FormContext);