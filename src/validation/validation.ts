// validation.ts
export const validateFormValues = <T extends Record<string, any>, E extends Record<string, string>>(
    formValues: T, 
    validationRules: E
  ): { hasError: boolean; errors: Partial<E> } => {
    const errors: Partial<E> = {};
    let hasError = false;
  
    for (const field in validationRules) {
      if (!formValues[field]) {
        hasError = true; // Set error status if validation fails
        errors[field as keyof E] = validationRules[field]; // Assign error message
      }
    }
  
    return { hasError, errors }; // Return both error status and errors
  };
  