export const transformFormData = (data: Record<string, any>) => {
  const transformed = { ...data };
  
  // Transform empty strings to null
  Object.entries(transformed).forEach(([key, value]) => {
    if (value === '') transformed[key] = null;
  });

  // Convert string numbers to actual numbers
  const numberFields = ['estimatedLoad', 'transformer_size_kva', 'transformer_impedance'];
  numberFields.forEach(field => {
    if (transformed[field]) {
      transformed[field] = Number(transformed[field]);
    }
  });

  // Format dates to ISO string
  const dateFields = ['inspectionDate', 'requestDate'];
  dateFields.forEach(field => {
    if (transformed[field]) {
      transformed[field] = new Date(transformed[field]).toISOString();
    }
  });

  return transformed;
};

export const sanitizeFormData = (data: Record<string, any>) => {
  const sanitized = { ...data };
  
  Object.entries(sanitized).forEach(([key, value]) => {
    // Sanitize strings
    if (typeof value === 'string') {
      sanitized[key] = value.trim().replace(/[<>]/g, '');
    }
    // Remove null/undefined values
    if (value === null || value === undefined) {
      delete sanitized[key];
    }
  });

  return sanitized;
};
