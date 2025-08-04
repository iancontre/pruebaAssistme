import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PricingPlan } from '../../services/apiService';
import { fetchCountries, fetchAllStates, fetchAllCities, Country, State, City } from '../../services/apiService';
import { FaFlag } from 'react-icons/fa';
import { useFormValidation } from '../../hooks/useFormValidation';

interface BusinessFormProps {
  onValidityChange: (isValid: boolean) => void;
  onDataChange?: (data: {
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    mobileNumber?: string;
    officeNumber?: string;
    phone_code?: string;
    // ...otros campos relevantes
  }) => void;
  selectedPlan?: PricingPlan;
  onValid?: () => void;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ onValidityChange, onDataChange, selectedPlan: _selectedPlan, onValid }) => {
  const [submitted, setSubmitted] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Configuración de validación
  const fieldTypes = {
    company: 'company',
    address1: 'address',
    address2: 'text', // Cambiado de 'required' a 'text' para que no sea obligatorio
    city: 'select',
    state: 'select',
    zip: 'zipCode',
    country: 'select',
    mobileNumber: 'phone'
  };

  const {
    fields,
    errors,
    isValid,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    validateForm
  } = useFormValidation({
    initialFields: {
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      mobileNumber: '',
    },
    fieldTypes,
    additionalData: {
      company: { fieldName: 'Company' },
      address1: { fieldName: 'Address' },
      address2: { fieldName: 'Address line 2' },
      city: { fieldName: 'City' },
      state: { fieldName: 'State' },
      zip: { fieldName: 'Zip code' },
      country: { fieldName: 'Country' },
      mobileNumber: { fieldName: 'Mobile number' }
    },
    validateOnChange: true,
    validateOnBlur: true
  });

  // Cargar países al montar el componente
  useEffect(() => {
    const loadCountries = async () => {
      try {
        console.log('🚀 BusinessForm: Starting to load countries...');
        setLoadingCountries(true);
        const countriesData = await fetchCountries();
        console.log('📋 BusinessForm: Countries loaded successfully:', countriesData);
        setCountries(countriesData);
      } catch (error) {
        console.error('❌ BusinessForm: Error loading countries:', error);
        toast.error('Error loading countries. Please try again.');
      } finally {
        setLoadingCountries(false);
        console.log('🏁 BusinessForm: Loading finished');
      }
    };

    loadCountries();
  }, []);

  // Cargar estados al montar el componente
  useEffect(() => {
    const loadStates = async () => {
      try {
        console.log('🚀 BusinessForm: Starting to load all states');
        setLoadingStates(true);
        
        const statesData = await fetchAllStates();
        console.log('📋 BusinessForm: States loaded successfully:', statesData);
        setStates(statesData);
      } catch (error) {
        console.error('❌ BusinessForm: Error loading states:', error);
        
        // Mostrar información más específica del error
        if (error instanceof Error) {
          if (error.message.includes('not found')) {
            console.warn('⚠️ BusinessForm: States endpoint not found. This endpoint might not be implemented yet.');
            // No mostrar toast de error - es normal si el endpoint no existe
          } else {
            toast.error(`Error loading states: ${error.message}`);
          }
        } else {
          toast.error('Error loading states. Please try again.');
        }
        
        setStates([]);
      } finally {
        setLoadingStates(false);
        console.log('🏁 BusinessForm: States loading finished');
      }
    };

    loadStates();
  }, []);

  // Cargar ciudades al montar el componente
  useEffect(() => {
    const loadCities = async () => {
      try {
        console.log('🚀 BusinessForm: Starting to load all cities');
        setLoadingCities(true);
        
        const citiesData = await fetchAllCities();
        console.log('📋 BusinessForm: Cities loaded successfully:', citiesData);
        setCities(citiesData);
      } catch (error) {
        console.error('❌ BusinessForm: Error loading cities:', error);
        
        // Mostrar información más específica del error
        if (error instanceof Error) {
          if (error.message.includes('not found')) {
            console.warn('⚠️ BusinessForm: Cities endpoint not found. This endpoint might not be implemented yet.');
            // No mostrar toast de error - es normal si el endpoint no existe
          } else {
            toast.error(`Error loading cities: ${error.message}`);
          }
        } else {
          toast.error('Error loading cities. Please try again.');
        }
        
        setCities([]);
      } finally {
        setLoadingCities(false);
        console.log('🏁 BusinessForm: Cities loading finished');
      }
    };

    loadCities();
  }, []);

  // Actualizar el campo de teléfono móvil cuando cambie el país
  useEffect(() => {
    if (fields.country) {
      const selectedCountry = countries.find(country => country.name === fields.country);
      if (selectedCountry && selectedCountry.phone_code) {
        // Mantener solo el número sin prefijo
        const currentNumber = fields.mobileNumber.replace(/^\+\d+\s*/, '');
        
        // No agregar el prefijo al estado, solo limpiar si es necesario
        if (currentNumber !== fields.mobileNumber) {
          setFieldValue('mobileNumber', currentNumber);
        }
        
        console.log('📞 BusinessForm: Updated phone number with country code:', {
          country: selectedCountry.name,
          phone_code: selectedCountry.phone_code,
          iso_code: selectedCountry.iso_code,
          currentNumber: currentNumber
        });
      }
    }
  }, [fields.country, countries, setFieldValue]);

  // El campo state es obligatorio si hay estados disponibles
  const hasStates = states.length > 0;

  // Memoizar la función de callback para evitar re-renders innecesarios
  const handleDataChange = useCallback(() => {
    if (isValid && onDataChange) {
      // Encontrar el país seleccionado para obtener el phone_code
      const selectedCountry = countries.find(country => country.name === fields.country);
      const phoneCode = selectedCountry?.phone_code;
      
      // Construir el número completo con prefijo para enviar
      const fullMobileNumber = phoneCode && fields.mobileNumber 
        ? `+${phoneCode} ${fields.mobileNumber}` 
        : fields.mobileNumber;
      
      onDataChange({ 
        state: fields.state,
        phone_code: phoneCode,
        mobileNumber: fullMobileNumber
      });
    }
  }, [isValid, onDataChange, fields.state, fields.country, fields.mobileNumber, countries]);

  useEffect(() => {
    onValidityChange(isValid);
    handleDataChange();
  }, [isValid, onValidityChange, handleDataChange]);

  // Llama a onDataChange cada vez que los campos cambian y el formulario es válido
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        company: fields.company,
        address1: fields.address1,
        address2: fields.address2,
        city: fields.city, // <-- Asegura que la ciudad se pase
        state: fields.state,
        zip: fields.zip,
        country: fields.country,
        mobileNumber: fields.mobileNumber,
        officeNumber: fields.officeNumber, // si existe
        // ...otros campos relevantes
      });
    }
  }, [fields, onDataChange]);

  // Manejar cambios personalizados para campos especiales
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Manejo especial para el campo de teléfono móvil
    if (name === 'mobileNumber') {
      // Para el teléfono móvil, solo guardar el número sin prefijo
      // El prefijo se muestra visualmente pero no se guarda en el estado
      const numberWithoutPrefix = value.replace(/^\+\d+\s*/, '');
      setFieldValue(name, numberWithoutPrefix);
    } else {
      handleChange(e);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const valid = validateForm();
    if (valid && onValid) {
      onValid();
    }
  };

  useEffect(() => {
    const form = document.querySelector('.wizard-form') as HTMLFormElement;
    if (form) {
      const submitHandler = (e: Event) => {
        setSubmitted(true);
        const valid = validateForm();
        if (!valid) {
          e.preventDefault();
          toast.error('Please fill in all required fields before proceeding to the next step.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              backgroundColor: '#fff3cd',
              color: '#856404',
              border: '1px solid #ffeeba',
              width: '400px',
              fontSize: '14px',
            },
          });
        }
      };
      form.addEventListener('submit', submitHandler);
      return () => form.removeEventListener('submit', submitHandler);
    }
  }, [fields, validateForm]);

  // Función para obtener la clase CSS del campo
  const getFieldClassName = (fieldName: string) => {
    const hasError = (touched[fieldName] || submitted) && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && fields[fieldName];
    
    if (hasError) return 'error';
    if (isValid) return 'valid';
    return '';
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div className="wizard-form-bg" />
      <div className="wizard-form-foreground">
        <form className="wizard-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="wizard-form-group">
            <label>Company</label>
            <input 
              name="company" 
              type="text" 
              value={fields.company} 
              onChange={handleCustomChange}
              onBlur={handleBlur}
              className={getFieldClassName('company')}
              placeholder="Enter your company name"
            />
            {(touched.company || submitted) && errors.company && (
              <span className="error-message">{errors.company}</span>
            )}
          </div>
          <div className="wizard-form-group">
            <label>Address</label>
            <input 
              name="address1" 
              type="text" 
              value={fields.address1} 
              onChange={handleCustomChange}
              onBlur={handleBlur}
              className={getFieldClassName('address1')}
              placeholder="Enter your address"
              style={{ marginBottom: '0.7rem' }} 
            />
            {(touched.address1 || submitted) && errors.address1 && (
              <span className="error-message">{errors.address1}</span>
            )}
            <input 
              name="address2" 
              type="text" 
              value={fields.address2} 
              onChange={handleCustomChange}
              onBlur={handleBlur}
              placeholder="Address line 2 (optional)"
            />
          </div>
          <div className="wizard-form-group">
            <label>Country</label>
            <select 
              name="country" 
              value={fields.country} 
              onChange={handleCustomChange}
              onBlur={handleBlur}
              className={getFieldClassName('country')}
              disabled={loadingCountries}
            >
              <option value="">
                {loadingCountries ? 'Loading countries...' : 'Select a country'}
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {(touched.country || submitted) && errors.country && (
              <span className="error-message">{errors.country}</span>
            )}
          </div>
          <div className="wizard-form-row">
            <div className="wizard-form-group">
              <label>State {!hasStates && !loadingStates && <span style={{fontSize: '12px', color: '#666', fontWeight: 'normal'}}>(Optional)</span>}</label>
              <select 
                name="state" 
                value={fields.state} 
                onChange={handleCustomChange}
                onBlur={handleBlur}
                className={getFieldClassName('state')}
                disabled={loadingStates}
              >
                <option value="">
                  {loadingStates 
                    ? 'Loading states...' 
                    : hasStates
                      ? 'Select a state'
                      : 'No states available'
                  }
                </option>
                {states.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              {(touched.state || submitted) && errors.state && hasStates && (
                <span className="error-message">{errors.state}</span>
              )}
            </div>
            <div className="wizard-form-group">
              <label>City {!cities.length && !loadingCities && <span style={{fontSize: '12px', color: '#666', fontWeight: 'normal'}}>(Optional)</span>}</label>
              <select 
                name="city" 
                value={fields.city} 
                onChange={handleCustomChange}
                onBlur={handleBlur}
                className={getFieldClassName('city')}
                disabled={loadingCities}
              >
                <option value="">
                  {loadingCities 
                    ? 'Loading cities...' 
                    : cities.length > 0
                      ? 'Select a city'
                      : 'No cities available'
                  }
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {(touched.city || submitted) && errors.city && cities.length > 0 && (
                <span className="error-message">{errors.city}</span>
              )}
            </div>
          </div>
          <div className="wizard-form-row">
            <div className="wizard-form-group">
              <label>Mobile Number</label>
              <div style={{ position: 'relative' }}>
                {(() => {
                  const selectedCountry = countries.find(country => country.name === fields.country);
                  const phoneCode = selectedCountry?.phone_code;
                  
                  return (
                    <>
                      {phoneCode && (
                        <div style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#666',
                          fontSize: '14px',
                          pointerEvents: 'none',
                          zIndex: 1,
                          backgroundColor: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                          <FaFlag style={{ color: '#4a90e2', fontSize: '16px' }} />
                          <span style={{ fontWeight: '500', color: '#333' }}>+{phoneCode}</span>
                        </div>
                      )}
                      <input 
                        name="mobileNumber" 
                        type="tel" 
                        value={(() => {
                          if (!phoneCode) return fields.mobileNumber;
                          const numberWithoutPrefix = fields.mobileNumber.replace(/^\+\d+\s*/, '');
                          return numberWithoutPrefix || '';
                        })()} 
                        onChange={handleCustomChange}
                        onBlur={handleBlur}
                        className={getFieldClassName('mobileNumber')}
                        placeholder={phoneCode ? `Enter your mobile number` : "Select a country first"}
                        style={phoneCode ? { paddingLeft: '80px' } : {}}
                      />
                    </>
                  );
                })()}
              </div>
              {(touched.mobileNumber || submitted) && errors.mobileNumber && (
                <span className="error-message">{errors.mobileNumber}</span>
              )}
            </div>
            <div className="wizard-form-group">
              <label>Zip Code</label>
              <input 
                name="zip" 
                type="text" 
                value={fields.zip} 
                onChange={handleCustomChange}
                onBlur={handleBlur}
                className={getFieldClassName('zip')}
                placeholder="Enter zip code"
              />
              {(touched.zip || submitted) && errors.zip && (
                <span className="error-message">{errors.zip}</span>
              )}
            </div>
          </div>
          <button type="submit" style={{display: 'none'}} tabIndex={-1}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;