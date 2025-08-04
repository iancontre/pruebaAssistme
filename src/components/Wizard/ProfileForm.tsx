import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormValidation } from '../../hooks/useFormValidation';

interface ProfileFormProps {
  onValidityChange: (isValid: boolean) => void;
  onDataChange?: (data: { name: string; email: string; industry: string }) => void;
  onValid?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onValidityChange, onDataChange, onValid }) => {
  const [submitted, setSubmitted] = useState(false);

  // Configuración de validación
  const fieldTypes = {
    fullName: 'name',
    lastName: 'name',
    companyName: 'company',
    officeNumber: 'phone',
    email: 'email',
    industry: 'select',
    heardAbout: 'select'
  };

  const additionalData = {
    fullName: { fieldName: 'Full name' },
    lastName: { fieldName: 'Last name' },
    companyName: { fieldName: 'Company name' },
    officeNumber: { fieldName: 'Office number' },
    email: { fieldName: 'Email' },
    industry: { fieldName: 'Industry' },
    heardAbout: { fieldName: 'How did you hear about us' }
  };

  const {
    fields,
    errors,
    isValid,
    touched,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation({
    initialFields: {
    fullName: '',
    lastName: '',
    companyName: '',
    officeNumber: '',
    email: '',
    industry: '',
    heardAbout: '',
    },
    fieldTypes,
    additionalData,
    validateOnChange: true,
    validateOnBlur: true
  });

  useEffect(() => {
    onValidityChange(isValid);
    // Pasar datos al componente padre cuando el formulario sea válido
    if (isValid && onDataChange) {
      onDataChange({
        name: `${fields.fullName} ${fields.lastName}`.trim(),
        email: fields.email,
        industry: fields.industry
      });
    }
  }, [isValid, onValidityChange, onDataChange, fields.fullName, fields.lastName, fields.email, fields.industry]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const valid = validateForm();
    if (valid && onValid) {
      onValid();
    }
    // No bloquees el avance si es válido
    return valid;
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
          <div className="wizard-form-row">
            <div className="wizard-form-group">
              <label>Full Name</label>
              <input 
                name="fullName" 
                type="text" 
                value={fields.fullName} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClassName('fullName')}
                placeholder="Enter your full name"
              />
              {(touched.fullName || submitted) && errors.fullName && (
                <span className="error-message" style={{ color: '#d32f2f' }}>{errors.fullName}</span>
              )}
            </div>
            <div className="wizard-form-group">
              <label>Last Name</label>
              <input 
                name="lastName" 
                type="text" 
                value={fields.lastName} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClassName('lastName')}
                placeholder="Enter your last name"
              />
              {(touched.lastName || submitted) && errors.lastName && (
                <span className="error-message" style={{ color: '#d32f2f' }}>{errors.lastName}</span>
              )}
            </div>
          </div>
          <div className="wizard-form-group">
            <label>Company Name</label>
            <input 
              name="companyName" 
              type="text" 
              value={fields.companyName} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('companyName')}
              placeholder="Enter your company name"
            />
            {(touched.companyName || submitted) && errors.companyName && (
              <span className="error-message" style={{ color: '#d32f2f' }}>{errors.companyName}</span>
            )}
          </div>
          <div className="wizard-form-group">
            <label>Office Number</label>
            <input 
              name="officeNumber" 
              type="tel"
              value={fields.officeNumber} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('officeNumber')}
              placeholder="Enter your office phone number"
            />
            {(touched.officeNumber || submitted) && errors.officeNumber && (
              <span className="error-message" style={{ color: '#d32f2f' }}>{errors.officeNumber}</span>
            )}
          </div>
          <div className="wizard-form-group">
            <label>Email</label>
            <input 
              name="email" 
              type="email" 
              value={fields.email} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('email')}
              placeholder="Enter your email address"
            />
            {(touched.email || submitted) && errors.email && (
              <span className="error-message" style={{ color: '#d32f2f' }}>{errors.email}</span>
            )}
          </div>
          <div className="wizard-form-group">
            <label>Industry</label>
            <select 
              name="industry" 
              value={fields.industry} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('industry')}
            >
              <option value="">Select an industry</option>
              <option value="Finance">Finance</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
            {(touched.industry || submitted) && errors.industry && (
              <span className="error-message" style={{ color: '#d32f2f' }}>{errors.industry}</span>
            )}
          </div>
          <div className="wizard-form-group">
            <label>How did you hear about us?</label>
            <select 
              name="heardAbout" 
              value={fields.heardAbout} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('heardAbout')}
            >
              <option value="">Select an option</option>
              <option value="Google">Google</option>
              <option value="Social Media">Social Media</option>
              <option value="Referral">Referral</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Other">Other</option>
            </select>
            {(touched.heardAbout || submitted) && errors.heardAbout && (
              <span className="error-message" style={{ color: '#d32f2f' }}>{errors.heardAbout}</span>
            )}
          </div>
          <button type="submit" style={{display: 'none'}} tabIndex={-1}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm; 