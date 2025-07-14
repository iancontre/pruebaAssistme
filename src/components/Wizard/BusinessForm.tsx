import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PricingPlan } from '../../services/taxService';
import { fetchCountries, fetchAllStates, fetchAllCities, Country, State, City } from '../../services/apiService';
import { FaFlag } from 'react-icons/fa';

// Función para convertir código ISO a emoji de bandera
const getCountryFlag = (isoCode: string): string => {
  const codePoints = isoCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

interface BusinessFormProps {
  onValidityChange: (isValid: boolean) => void;
  onDataChange?: (data: { state: string; phone_code?: string; mobileNumber?: string }) => void;
  selectedPlan?: PricingPlan;
  onValid?: () => void;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ onValidityChange, onDataChange, selectedPlan: _selectedPlan, onValid }) => {
  const [fields, setFields] = useState({
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState({
    company: false,
    address1: false,
    city: false,
    state: false,
    zip: false,
    country: false,
    mobileNumber: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

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
          setFields(prev => ({
            ...prev,
            mobileNumber: currentNumber
          }));
        }
        
        console.log('📞 BusinessForm: Updated phone number with country code:', {
          country: selectedCountry.name,
          phone_code: selectedCountry.phone_code,
          iso_code: selectedCountry.iso_code,
          currentNumber: currentNumber
        });
      }
    }
  }, [fields.country, countries]);

  // El campo state es obligatorio si hay estados disponibles
  const hasStates = states.length > 0;
  // El campo city es obligatorio si hay ciudades disponibles
  const hasCities = cities.length > 0;
  
  const isValid =
    fields.company.trim() !== '' &&
    fields.address1.trim() !== '' &&
    (hasCities ? fields.city !== '' : true) && // Solo requerir city si hay ciudades disponibles
    (hasStates ? fields.state !== '' : true) && // Solo requerir state si hay estados disponibles
    fields.zip.trim() !== '' &&
    fields.country !== '' &&
    fields.mobileNumber.trim() !== '';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Manejo especial para el campo de teléfono móvil
    if (name === 'mobileNumber') {
      // Para el teléfono móvil, solo guardar el número sin prefijo
      // El prefijo se muestra visualmente pero no se guarda en el estado
      const numberWithoutPrefix = value.replace(/^\+\d+\s*/, '');
      setFields({ ...fields, [name]: numberWithoutPrefix });
    } else {
      setFields({ ...fields, [name]: value });
    }
    
    setErrors({ ...errors, [name]: false });
  };

  const validateField = (name: string, value: string) => {
    if (name === "country") return value === '';
    if (name === "state") {
      // El campo state solo es obligatorio si hay estados disponibles
      return hasStates ? value === '' : false;
    }
    if (name === "city") {
      // El campo city solo es obligatorio si hay ciudades disponibles
      return hasCities ? value === '' : false;
    }
    if (name === 'address2') return false; // address2 es opcional
    return value.trim() === '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const validateForm = () => {
    const newErrors = {
      company: validateField('company', fields.company),
      address1: validateField('address1', fields.address1),
      city: validateField('city', fields.city),
      state: validateField('state', fields.state),
      zip: validateField('zip', fields.zip),
      country: validateField('country', fields.country),
      mobileNumber: validateField('mobileNumber', fields.mobileNumber),
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error);
    return !hasErrors;
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
  }, [fields]);

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
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.company && submitted ? 'error' : ''}
            />
            {errors.company && submitted && <span className="error-message">Company name is required</span>}
          </div>
          <div className="wizard-form-group">
            <label>Address</label>
            <input 
              name="address1" 
              type="text" 
              value={fields.address1} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.address1 && submitted ? 'error' : ''}
              style={{ marginBottom: '0.7rem' }} 
            />
            {errors.address1 && submitted && <span className="error-message">Address is required</span>}
            <input 
              name="address2" 
              type="text" 
              value={fields.address2} 
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="wizard-form-group">
            <label>Country</label>
            <select 
              name="country" 
              value={fields.country} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.country && submitted ? 'error' : ''}
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
            {errors.country && submitted && <span className="error-message">Country is required</span>}
          </div>
          <div className="wizard-form-row">
            <div className="wizard-form-group">
              <label>State {!hasStates && !loadingStates && <span style={{fontSize: '12px', color: '#666', fontWeight: 'normal'}}>(Optional)</span>}</label>
              <select 
                name="state" 
                value={fields.state} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.state && submitted ? 'error' : ''}
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
              {errors.state && submitted && hasStates && <span className="error-message">State is required</span>}
            </div>
            <div className="wizard-form-group">
              <label>City {!cities.length && !loadingCities && <span style={{fontSize: '12px', color: '#666', fontWeight: 'normal'}}>(Optional)</span>}</label>
              <select 
                name="city" 
                value={fields.city} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.city && submitted ? 'error' : ''}
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
              {errors.city && submitted && cities.length > 0 && <span className="error-message">City is required</span>}
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.mobileNumber && submitted ? 'error' : ''}
                        placeholder={phoneCode ? `Enter your mobile number` : "Select a country first"}
                        style={phoneCode ? { paddingLeft: '80px' } : {}}
                      />
                    </>
                  );
                })()}
              </div>
              {errors.mobileNumber && submitted && <span className="error-message">Mobile number is required</span>}
            </div>
            <div className="wizard-form-group">
              <label>Zip Code</label>
              <input 
                name="zip" 
                type="text" 
                value={fields.zip} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.zip && submitted ? 'error' : ''}
              />
              {errors.zip && submitted && <span className="error-message">Zip code is required</span>}
            </div>
          </div>
          <button type="submit" style={{display: 'none'}} tabIndex={-1}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;