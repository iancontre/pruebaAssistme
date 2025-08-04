// Tipos de validación
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface FieldValidation {
  [key: string]: ValidationResult;
}

// Validaciones específicas por tipo de campo
export const validators = {
  // Email validation
  email: (value: string): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    // Validar dominio
    const domain = value.split('@')[1];
    if (domain && domain.length < 3) {
      return { isValid: false, message: 'Please enter a valid email domain' };
    }
    
    return { isValid: true, message: '' };
  },

  // Phone number validation
  phone: (value: string, countryCode?: string): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, message: 'Phone number is required' };
    }
    
    // Remover espacios, guiones y paréntesis
    const cleanNumber = value.replace(/[\s\-\(\)]/g, '');
    
    // Validar que solo contenga números
    if (!/^\d+$/.test(cleanNumber)) {
      return { isValid: false, message: 'Phone number can only contain numbers' };
    }
    
    // Validar longitud según el país
    if (countryCode) {
      const lengthRules: { [key: string]: { min: number; max: number } } = {
        'US': { min: 10, max: 10 },
        'CA': { min: 10, max: 10 },
        'MX': { min: 10, max: 10 },
        'ES': { min: 9, max: 9 },
        'FR': { min: 10, max: 10 },
        'DE': { min: 10, max: 12 },
        'UK': { min: 10, max: 11 },
        'AU': { min: 9, max: 9 },
        'BR': { min: 10, max: 11 },
        'AR': { min: 10, max: 10 },
        'CL': { min: 9, max: 9 },
        'CO': { min: 10, max: 10 },
        'PE': { min: 9, max: 9 },
        'VE': { min: 10, max: 10 },
        'EC': { min: 9, max: 9 },
        'UY': { min: 8, max: 8 },
        'PY': { min: 9, max: 9 },
        'BO': { min: 8, max: 8 },
        'GY': { min: 7, max: 7 },
        'SR': { min: 7, max: 7 },
        'GF': { min: 9, max: 9 },
        'FK': { min: 5, max: 5 },
        'GS': { min: 5, max: 5 },
        'TC': { min: 7, max: 7 },
        'VG': { min: 7, max: 7 },
        'AI': { min: 7, max: 7 },
        'MS': { min: 7, max: 7 },
        'BM': { min: 7, max: 7 },
        'IO': { min: 7, max: 7 },
        'KY': { min: 7, max: 7 },
        'AW': { min: 7, max: 7 },
        'CW': { min: 7, max: 7 },
        'SX': { min: 7, max: 7 },
        'BQ': { min: 7, max: 7 },
        'BL': { min: 9, max: 9 },
        'MF': { min: 9, max: 9 },
        'GP': { min: 9, max: 9 },
        'MQ': { min: 9, max: 9 },
        'RE': { min: 9, max: 9 },
        'YT': { min: 9, max: 9 },
        'PM': { min: 6, max: 6 },
        'WF': { min: 6, max: 6 },
        'PF': { min: 6, max: 6 },
        'NC': { min: 6, max: 6 },
        'NU': { min: 4, max: 4 },
        'CK': { min: 5, max: 5 },
        'TO': { min: 5, max: 5 },
        'WS': { min: 5, max: 5 },
        'KI': { min: 5, max: 5 },
        'TV': { min: 5, max: 5 },
        'NR': { min: 7, max: 7 },
        'VU': { min: 5, max: 5 },
        'FJ': { min: 7, max: 7 },
        'PW': { min: 7, max: 7 },
        'MH': { min: 7, max: 7 },
        'FM': { min: 7, max: 7 },
        'MP': { min: 10, max: 10 },
        'GU': { min: 10, max: 10 },
        'AS': { min: 10, max: 10 },
        'PR': { min: 10, max: 10 },
        'VI': { min: 10, max: 10 },
        'UM': { min: 10, max: 10 }
      };
      
      const rule = lengthRules[countryCode];
      if (rule) {
        if (cleanNumber.length < rule.min) {
          return { isValid: false, message: `Phone number must be at least ${rule.min} digits` };
        }
        if (cleanNumber.length > rule.max) {
          return { isValid: false, message: `Phone number cannot exceed ${rule.max} digits` };
        }
      }
    }
    
    // Validación general de longitud
    if (cleanNumber.length < 7) {
      return { isValid: false, message: 'Phone number is too short' };
    }
    if (cleanNumber.length > 15) {
      return { isValid: false, message: 'Phone number is too long' };
    }
    
    return { isValid: true, message: '' };
  },

  // Name validation
  name: (value: string, fieldName: string = 'Name'): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, message: `${fieldName} is required` };
    }
    
    if (value.trim().length < 2) {
      return { isValid: false, message: `${fieldName} must be at least 2 characters` };
    }
    
    if (value.trim().length > 50) {
      return { isValid: false, message: `${fieldName} cannot exceed 50 characters` };
    }
    
    // Solo letras, espacios, guiones y apóstrofes
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']+$/;
    if (!nameRegex.test(value.trim())) {
      return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens and apostrophes` };
    }
    
    return { isValid: true, message: '' };
  },

  // Company name validation
  company: (value: string): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, message: 'Company name is required' };
    }
    
    if (value.trim().length < 2) {
      return { isValid: false, message: 'Company name must be at least 2 characters' };
    }
    
    if (value.trim().length > 100) {
      return { isValid: false, message: 'Company name cannot exceed 100 characters' };
    }
    
    return { isValid: true, message: '' };
  },

  // Address validation
  address: (value: string): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, message: 'Address is required' };
    }
    
    if (value.trim().length < 5) {
      return { isValid: false, message: 'Address must be at least 5 characters' };
    }
    
    if (value.trim().length > 200) {
      return { isValid: false, message: 'Address cannot exceed 200 characters' };
    }
    
    return { isValid: true, message: '' };
  },

  // Zip code validation
  zipCode: (value: string, countryCode?: string): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, message: 'Zip code is required' };
    }
    
    const cleanZip = value.replace(/\s/g, '');
    
    // Validaciones específicas por país
    if (countryCode) {
      const zipRules: { [key: string]: { pattern: RegExp; message: string } } = {
        'US': { pattern: /^\d{5}(-\d{4})?$/, message: 'Please enter a valid US zip code (e.g., 12345 or 12345-6789)' },
        'CA': { pattern: /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/, message: 'Please enter a valid Canadian postal code (e.g., A1A 1A1)' },
        'UK': { pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, message: 'Please enter a valid UK postal code' },
        'DE': { pattern: /^\d{5}$/, message: 'Please enter a valid German postal code (5 digits)' },
        'FR': { pattern: /^\d{5}$/, message: 'Please enter a valid French postal code (5 digits)' },
        'ES': { pattern: /^\d{5}$/, message: 'Please enter a valid Spanish postal code (5 digits)' },
        'IT': { pattern: /^\d{5}$/, message: 'Please enter a valid Italian postal code (5 digits)' },
        'MX': { pattern: /^\d{5}$/, message: 'Please enter a valid Mexican postal code (5 digits)' },
        'BR': { pattern: /^\d{5}-\d{3}$/, message: 'Please enter a valid Brazilian postal code (e.g., 12345-678)' },
        'AR': { pattern: /^\d{4}$/, message: 'Please enter a valid Argentine postal code (4 digits)' },
        'CL': { pattern: /^\d{7}$/, message: 'Please enter a valid Chilean postal code (7 digits)' },
        'CO': { pattern: /^\d{6}$/, message: 'Please enter a valid Colombian postal code (6 digits)' },
        'PE': { pattern: /^\d{5}$/, message: 'Please enter a valid Peruvian postal code (5 digits)' },
        'VE': { pattern: /^\d{4}$/, message: 'Please enter a valid Venezuelan postal code (4 digits)' },
        'EC': { pattern: /^\d{6}$/, message: 'Please enter a valid Ecuadorian postal code (6 digits)' },
        'UY': { pattern: /^\d{5}$/, message: 'Please enter a valid Uruguayan postal code (5 digits)' },
        'PY': { pattern: /^\d{4}$/, message: 'Please enter a valid Paraguayan postal code (4 digits)' },
        'BO': { pattern: /^\d{4}$/, message: 'Please enter a valid Bolivian postal code (4 digits)' }
      };
      
      const rule = zipRules[countryCode];
      if (rule && !rule.pattern.test(cleanZip)) {
        return { isValid: false, message: rule.message };
      }
    }
    
    // Validación general
    if (cleanZip.length < 3) {
      return { isValid: false, message: 'Zip code is too short' };
    }
    
    if (cleanZip.length > 10) {
      return { isValid: false, message: 'Zip code is too long' };
    }
    
    return { isValid: true, message: '' };
  },

  // Required field validation
  required: (value: string, fieldName: string = 'This field'): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, message: `${fieldName} is required` };
    }
    return { isValid: true, message: '' };
  },

  // Select field validation
  select: (value: string, fieldName: string = 'This field'): ValidationResult => {
    if (!value || value === '') {
      return { isValid: false, message: `Please select a ${fieldName.toLowerCase()}` };
    }
    return { isValid: true, message: '' };
  },

  // Text field validation (optional field)
  text: (_value: string): ValidationResult => {
    // Los campos de texto son opcionales, siempre son válidos
    return { isValid: true, message: '' };
  }
};

// Función para validar un campo específico
export const validateField = (
  value: string, 
  fieldType: string = 'required',
  additionalData?: any
): ValidationResult => {
  switch (fieldType) {
    case 'email':
      return validators.email(value);
    case 'phone':
      return validators.phone(value, additionalData?.countryCode);
    case 'name':
      return validators.name(value, additionalData?.fieldName);
    case 'company':
      return validators.company(value);
    case 'address':
      return validators.address(value);
    case 'zipCode':
      return validators.zipCode(value, additionalData?.countryCode);
    case 'select':
      return validators.select(value, additionalData?.fieldName);
    case 'text':
      return validators.text(value);
    case 'required':
    default:
      return validators.required(value, additionalData?.fieldName);
  }
};

// Función para validar múltiples campos
export const validateFields = (fields: { [key: string]: string }, fieldTypes: { [key: string]: string }, additionalData?: any): FieldValidation => {
  const results: FieldValidation = {};
  
  Object.keys(fields).forEach(fieldName => {
    const fieldType = fieldTypes[fieldName] || 'required';
    const value = fields[fieldName];
    const fieldAdditionalData = additionalData?.[fieldName];
    results[fieldName] = validateField(value, fieldType, fieldAdditionalData);
  });
  
  return results;
};

// Función para verificar si todos los campos son válidos
export const isFormValid = (validationResults: FieldValidation): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
}; 