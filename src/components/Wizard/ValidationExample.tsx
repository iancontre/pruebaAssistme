import React from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';

const ValidationExample: React.FC = () => {
  const fieldTypes = {
    email: 'email',
    phone: 'phone',
    name: 'name',
    company: 'company',
    address: 'address',
    zipCode: 'zipCode',
    required: 'required',
    select: 'select'
  };

  const additionalData = {
    email: { fieldName: 'Email' },
    phone: { fieldName: 'Phone number', countryCode: 'US' },
    name: { fieldName: 'Full name' },
    company: { fieldName: 'Company name' },
    address: { fieldName: 'Address' },
    zipCode: { fieldName: 'Zip code', countryCode: 'US' },
    required: { fieldName: 'Required field' },
    select: { fieldName: 'Selection' }
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
      email: '',
      phone: '',
      name: '',
      company: '',
      address: '',
      zipCode: '',
      required: '',
      select: ''
    },
    fieldTypes,
    additionalData,
    validateOnChange: true,
    validateOnBlur: true
  });

  const getFieldClassName = (fieldName: string) => {
    const hasError = (touched[fieldName]) && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && fields[fieldName];
    
    if (hasError) return 'error';
    if (isValid) return 'valid';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validateForm();
    if (valid) {
      alert('Form is valid! All fields passed validation.');
    } else {
      alert('Form has errors. Please fix them before submitting.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Validation Example</h2>
      <p>This form demonstrates real-time validation for all field types.</p>
      
      <form onSubmit={handleSubmit} className="wizard-form">
        <div className="wizard-form-group">
          <label className="required">Email</label>
          <input
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('email')}
            placeholder="Enter a valid email address"
          />
          {touched.email && errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
          {touched.email && !errors.email && fields.email && (
            <span className="success-message">✓ Valid email address</span>
          )}
        </div>

        <div className="wizard-form-group">
          <label className="required">Phone Number (US)</label>
          <input
            name="phone"
            type="tel"
            value={fields.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('phone')}
            placeholder="Enter 10-digit phone number"
          />
          {touched.phone && errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
          {touched.phone && !errors.phone && fields.phone && (
            <span className="success-message">✓ Valid phone number</span>
          )}
        </div>

        <div className="wizard-form-group">
          <label className="required">Full Name</label>
          <input
            name="name"
            type="text"
            value={fields.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('name')}
            placeholder="Enter your full name (letters only)"
          />
          {touched.name && errors.name && (
            <span className="error-message">{errors.name}</span>
          )}
          {touched.name && !errors.name && fields.name && (
            <span className="success-message">✓ Valid name</span>
          )}
        </div>

        <div className="wizard-form-group">
          <label className="required">Company Name</label>
          <input
            name="company"
            type="text"
            value={fields.company}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('company')}
            placeholder="Enter company name"
          />
          {touched.company && errors.company && (
            <span className="error-message">{errors.company}</span>
          )}
          {touched.company && !errors.company && fields.company && (
            <span className="success-message">✓ Valid company name</span>
          )}
        </div>

        <div className="wizard-form-group">
          <label className="required">Address</label>
          <input
            name="address"
            type="text"
            value={fields.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('address')}
            placeholder="Enter your address (min 5 characters)"
          />
          {touched.address && errors.address && (
            <span className="error-message">{errors.address}</span>
          )}
          {touched.address && !errors.address && fields.address && (
            <span className="success-message">✓ Valid address</span>
          )}
        </div>

        <div className="wizard-form-group">
          <label className="required">Zip Code (US)</label>
          <input
            name="zipCode"
            type="text"
            value={fields.zipCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('zipCode')}
            placeholder="Enter US zip code (e.g., 12345)"
          />
          {touched.zipCode && errors.zipCode && (
            <span className="error-message">{errors.zipCode}</span>
          )}
          {touched.zipCode && !errors.zipCode && fields.zipCode && (
            <span className="success-message">✓ Valid zip code</span>
          )}
        </div>

        <div className="wizard-form-group">
          <label className="required">Required Field</label>
          <input
            name="required"
            type="text"
            value={fields.required}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('required')}
            placeholder="This field is required"
          />
          {touched.required && errors.required && (
            <span className="error-message">{errors.required}</span>
          )}
          {touched.required && !errors.required && fields.required && (
            <span className="success-message">✓ Field completed</span>
          )}
        </div>

        <div className="wizard-form-group">
          <label className="required">Selection</label>
          <select
            name="select"
            value={fields.select}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('select')}
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
          {touched.select && errors.select && (
            <span className="error-message">{errors.select}</span>
          )}
          {touched.select && !errors.select && fields.select && (
            <span className="success-message">✓ Option selected</span>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <button 
            type="submit" 
            disabled={!isValid}
            style={{
              padding: '12px 24px',
              backgroundColor: isValid ? '#4a90e2' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isValid ? 'pointer' : 'not-allowed',
              fontSize: '16px'
            }}
          >
            {isValid ? 'Submit Form' : 'Please fill all required fields'}
          </button>
        </div>

        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h4>Form Status:</h4>
          <p>Valid: {isValid ? '✅ Yes' : '❌ No'}</p>
          <p>Fields with errors: {Object.keys(errors).length}</p>
          <p>Touched fields: {Object.keys(touched).length}</p>
        </div>
      </form>
    </div>
  );
};

export default ValidationExample; 