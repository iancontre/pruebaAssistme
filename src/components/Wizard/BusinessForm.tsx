import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PricingPlan } from '../../services/taxService';


interface BusinessFormProps {
  onValidityChange: (isValid: boolean) => void;
  onDataChange?: (data: { state: string }) => void;
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
    industry: '',
  });

  const [errors, setErrors] = useState({
    company: false,
    address1: false,
    city: false,
    state: false,
    zip: false,
    country: false,
    industry: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const isValid =
    fields.company.trim() !== '' &&
    fields.address1.trim() !== '' &&
    fields.city.trim() !== '' &&
    fields.state !== '' &&
    fields.zip.trim() !== '' &&
    fields.country !== '' &&
    fields.industry !== '';

  useEffect(() => {
    onValidityChange(isValid);
    if (isValid && onDataChange) {
      onDataChange({ state: fields.state });
    }
  }, [isValid, onValidityChange, onDataChange, fields.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const validateField = (name: string, value: string) => {
    if (["industry", "state", "country"].includes(name)) return value === '';
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
      industry: validateField('industry', fields.industry),
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
          <div className="wizard-form-row">
            <div className="wizard-form-group">
              <label>City</label>
              <input 
                name="city" 
                type="text" 
                value={fields.city} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.city && submitted ? 'error' : ''}
              />
              {errors.city && submitted && <span className="error-message">City is required</span>}
            </div>
            <div className="wizard-form-group">
              <label>State</label>
              <select 
                name="state" 
                value={fields.state} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.state && submitted ? 'error' : ''}
              >
                <option value="">Select a state</option>
                <option value="Georgia">Georgia</option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
              </select>
              {errors.state && submitted && <span className="error-message">State is required</span>}
            </div>
          </div>
          <div className="wizard-form-row">
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
            <div className="wizard-form-group">
              <label>Country</label>
              <select 
                name="country" 
                value={fields.country} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.country && submitted ? 'error' : ''}
              >
                <option value="">Select a country</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
              </select>
              {errors.country && submitted && <span className="error-message">Country is required</span>}
            </div>
          </div>
          <div className="wizard-form-group">
            <label>Industry</label>
            <select 
              name="industry" 
              value={fields.industry} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.industry && submitted ? 'error' : ''}
            >
              <option value="">Select an industry</option>
              <option value="Finance">Finance</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
            </select>
            {errors.industry && submitted && <span className="error-message">Industry is required</span>}
          </div>
          <button type="submit" style={{display: 'none'}} tabIndex={-1}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm; 