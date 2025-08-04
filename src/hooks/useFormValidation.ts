import { useState, useEffect, useCallback } from 'react';
import { FieldValidation, validateField, validateFields, isFormValid } from '../utils/validation';

interface UseFormValidationProps {
  initialFields: { [key: string]: string };
  fieldTypes: { [key: string]: string };
  additionalData?: { [key: string]: any };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormValidationReturn {
  fields: { [key: string]: string };
  errors: { [key: string]: string };
  isValid: boolean;
  touched: { [key: string]: boolean };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setFieldValue: (fieldName: string, value: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  getFieldError: (fieldName: string) => string;
  isFieldValid: (fieldName: string) => boolean;
}

export const useFormValidation = ({
  initialFields,
  fieldTypes,
  additionalData = {},
  validateOnChange = true,
  validateOnBlur = true
}: UseFormValidationProps): UseFormValidationReturn => {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [validationResults, setValidationResults] = useState<FieldValidation>({});

  // Validar todos los campos
  const validateAllFields = useCallback(() => {
    const results = validateFields(fields, fieldTypes, additionalData);
    setValidationResults(results);
    
    const newErrors: { [key: string]: string } = {};
    Object.keys(results).forEach(fieldName => {
      if (!results[fieldName].isValid) {
        newErrors[fieldName] = results[fieldName].message;
      }
    });
    setErrors(newErrors);
    
    return isFormValid(results);
  }, [fields, fieldTypes, additionalData]);

  // Validar un campo específico
  const validateSingleField = useCallback((fieldName: string, value: string) => {
    const fieldType = fieldTypes[fieldName] || 'required';
    const fieldAdditionalData = additionalData?.[fieldName];
    const result = validateField(value, fieldType, fieldAdditionalData);
    setErrors(prev => ({ ...prev, [fieldName]: result.message }));
    return result.isValid;
  }, [fieldTypes, additionalData]);

  // Manejar cambios en los campos
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFields(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Marcar como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validar en tiempo real si está habilitado
    if (validateOnChange) {
      validateSingleField(name, value);
    }
  }, [validateOnChange, validateSingleField]);

  // Manejar pérdida de foco
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Marcar como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validar al perder foco si está habilitado
    if (validateOnBlur) {
      validateSingleField(name, value);
    }
  }, [validateOnBlur, validateSingleField]);

  // Establecer valor de un campo manualmente
  const setFieldValue = useCallback((fieldName: string, value: string) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    if (validateOnChange) {
      validateSingleField(fieldName, value);
    }
  }, [validateOnChange, validateSingleField]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    return validateAllFields();
  }, [validateAllFields]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setFields(initialFields);
    setErrors({});
    setTouched({});
    setValidationResults({});
  }, [initialFields]);

  // Obtener error de un campo específico
  const getFieldError = useCallback((fieldName: string): string => {
    return errors[fieldName] || '';
  }, [errors]);

  // Verificar si un campo es válido
  const isFieldValid = useCallback((fieldName: string): boolean => {
    return validationResults[fieldName]?.isValid ?? false;
  }, [validationResults]);

  // Validar al montar el componente
  useEffect(() => {
    validateAllFields();
  }, [validateAllFields]);

  // Calcular si el formulario es válido
  const isValid = isFormValid(validationResults);

  return {
    fields,
    errors,
    isValid,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    validateForm,
    resetForm,
    getFieldError,
    isFieldValid
  };
}; 