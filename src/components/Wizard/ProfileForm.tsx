import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface ProfileFormProps {
  onValidityChange: (isValid: boolean) => void;
  onDataChange?: (data: { name: string; email: string }) => void;
  onValid?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onValidityChange, onDataChange, onValid }) => {
  const [fields, setFields] = useState({
    fullName: '',
    lastName: '',
    companyName: '',
    officeNumber: '',
    mobileNumber: '',
    email: '',
    heardAbout: '',
  });

  const [errors, setErrors] = useState({
    fullName: false,
    lastName: false,
    companyName: false,
    officeNumber: false,
    mobileNumber: false,
    email: false,
    heardAbout: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const isValid = Object.values(fields).every((v) => v.trim() !== '');

  useEffect(() => {
    onValidityChange(isValid);
    
    // Pasar datos al componente padre cuando el formulario sea válido
    if (isValid && onDataChange) {
      onDataChange({
        name: `${fields.fullName} ${fields.lastName}`.trim(),
        email: fields.email
      });
    }
  }, [isValid, onValidityChange, onDataChange, fields.fullName, fields.lastName, fields.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const validateField = (value: string) => {
    return value.trim() === '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateField(value) });
  };

  const validateForm = () => {
    const newErrors = {
      fullName: validateField(fields.fullName),
      lastName: validateField(fields.lastName),
      companyName: validateField(fields.companyName),
      officeNumber: validateField(fields.officeNumber),
      mobileNumber: validateField(fields.mobileNumber),
      email: validateField(fields.email),
      heardAbout: validateField(fields.heardAbout),
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
          <div className="wizard-form-row">
            <div className="wizard-form-group">
              <label>Full Name</label>
              <input 
                name="fullName" 
                type="text" 
                value={fields.fullName} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.fullName && submitted ? 'error' : ''}
              />
              {errors.fullName && submitted && <span className="error-message" style={{ color: '#d32f2f' }}>Full name is required</span>}
            </div>
            <div className="wizard-form-group">
              <label>Last Name</label>
              <input 
                name="lastName" 
                type="text" 
                value={fields.lastName} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.lastName && submitted ? 'error' : ''}
              />
              {errors.lastName && submitted && <span className="error-message" style={{ color: '#d32f2f' }}>Last name is required</span>}
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
              className={errors.companyName && submitted ? 'error' : ''}
            />
            {errors.companyName && submitted && <span className="error-message" style={{ color: '#d32f2f' }}>Company name is required</span>}
          </div>
          <div className="wizard-form-row">
            <div className="wizard-form-group">
              <label>Office Number</label>
              <input 
                name="officeNumber" 
                type="text" 
                value={fields.officeNumber} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.officeNumber && submitted ? 'error' : ''}
              />
              {errors.officeNumber && submitted && <span className="error-message" style={{ color: '#d32f2f' }}>Office number is required</span>}
            </div>
            <div className="wizard-form-group">
              <label>Mobile Number</label>
              <input 
                name="mobileNumber" 
                type="text" 
                value={fields.mobileNumber} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.mobileNumber && submitted ? 'error' : ''}
              />
              {errors.mobileNumber && submitted && <span className="error-message" style={{ color: '#d32f2f' }}>Mobile number is required</span>}
            </div>
          </div>
          <div className="wizard-form-group">
            <label>Email</label>
            <input 
              name="email" 
              type="email" 
              value={fields.email} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && submitted ? 'error' : ''}
            />
            {errors.email && submitted && <span className="error-message" style={{ color: '#d32f2f' }}>Email is required</span>}
          </div>
          <div className="wizard-form-group">
            <label>Where did you hear about us?</label>
            <select 
              name="heardAbout" 
              value={fields.heardAbout} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.heardAbout && submitted ? 'error' : ''}
            >
              <option value="">Select an option</option>
              <option value="Internet">Internet</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
            {errors.heardAbout && submitted && <span className="error-message" style={{ color: '#d32f2f' }}>Please select an option</span>}
          </div>
          <button type="submit" style={{display: 'none'}} tabIndex={-1}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm; 