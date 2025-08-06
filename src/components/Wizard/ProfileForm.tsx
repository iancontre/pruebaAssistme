import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useTranslation } from '../../hooks/useTranslation';

interface ProfileFormProps {
  onValidityChange: (isValid: boolean) => void;
  onDataChange?: (data: { 
    fullName: string; 
    lastName: string; 
    companyName: string; 
    officeNumber: string; 
    email: string; 
    industry: string; 
    heardAbout: string; 
  }) => void;
  onValid?: () => void;
  initialData?: {
    fullName?: string;
    lastName?: string;
    companyName?: string;
    officeNumber?: string;
    email?: string;
    industry?: string;
    heardAbout?: string;
  };
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onValidityChange, onDataChange, onValid, initialData }) => {
  const { t } = useTranslation();
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
    fullName: { fieldName: t('wizard.profile.fields.fullName') },
    lastName: { fieldName: t('wizard.profile.fields.lastName') },
    companyName: { fieldName: t('wizard.profile.fields.companyName') },
    officeNumber: { fieldName: t('wizard.profile.fields.officeNumber') },
    email: { fieldName: t('wizard.profile.fields.email') },
    industry: { fieldName: t('wizard.profile.fields.industry') },
    heardAbout: { fieldName: t('wizard.profile.fields.heardAbout') }
  };

  const {
    fields,
    errors,
    isValid,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setFieldValue
  } = useFormValidation({
    initialFields: {
    fullName: initialData?.fullName || '',
    lastName: initialData?.lastName || '',
    companyName: initialData?.companyName || '',
    officeNumber: initialData?.officeNumber || '',
    email: initialData?.email || '',
    industry: initialData?.industry || '',
    heardAbout: initialData?.heardAbout || '',
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
        fullName: fields.fullName,
        lastName: fields.lastName,
        companyName: fields.companyName,
        officeNumber: fields.officeNumber,
        email: fields.email,
        industry: fields.industry,
        heardAbout: fields.heardAbout
      });
    }
  }, [isValid, onValidityChange, onDataChange, fields.fullName, fields.lastName, fields.companyName, fields.officeNumber, fields.email, fields.industry, fields.heardAbout]);

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
          toast.error(t('wizard.profile.errors.fillRequiredFields'), {
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
        {/* Título y subtítulo centrados al nivel del formulario */}
                        <div className="wizard-title-container">
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 700, 
            color: '#18344C', 
            margin: '0 0 8px 0',
            lineHeight: '1.2',
            textAlign: 'center'
          }}>
            {t('profile.title')}
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666', 
            margin: 0,
            fontWeight: 400,
            textAlign: 'center'
          }}>
            {t('profile.subtitle')}
          </p>
        </div>
        
        <form className="wizard-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="wizard-form-row">
            <div className="wizard-form-group">
              <label>{t('wizard.profile.fields.fullName')}</label>
              <input 
                name="fullName" 
                type="text" 
                value={fields.fullName} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClassName('fullName')}
                placeholder={t('wizard.profile.placeholders.fullName')}
              />
              {(touched.fullName || submitted) && errors.fullName && (
                <span className="error-message" style={{ color: '#d32f2f' }}>{errors.fullName}</span>
              )}
            </div>
            <div className="wizard-form-group">
              <label>{t('wizard.profile.fields.lastName')}</label>
              <input 
                name="lastName" 
                type="text" 
                value={fields.lastName} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClassName('lastName')}
                placeholder={t('wizard.profile.placeholders.lastName')}
              />
              {(touched.lastName || submitted) && errors.lastName && (
                <span className="error-message" style={{ color: '#d32f2f' }}>{errors.lastName}</span>
              )}
            </div>
          </div>
          <div className="wizard-form-group">
            <label>{t('wizard.profile.fields.companyName')}</label>
            <input 
              name="companyName" 
              type="text" 
              value={fields.companyName} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('companyName')}
              placeholder={t('wizard.profile.placeholders.companyName')}
            />
            {(touched.companyName || submitted) && errors.companyName && (
              <span className="error-message" style={{ color: '#d32f2f' }}>{errors.companyName}</span>
            )}
          </div>
          <div className="wizard-form-group">
            <label>{t('wizard.profile.fields.officeNumber')}</label>
            <input 
              name="officeNumber" 
              type="tel"
              value={fields.officeNumber} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('officeNumber')}
              placeholder={t('wizard.profile.placeholders.officeNumber')}
            />
            {(touched.officeNumber || submitted) && errors.officeNumber && (
              <span className="error-message" style={{ color: '#d32f2f' }}>{errors.officeNumber}</span>
            )}
          </div>
          <div className="wizard-form-group">
            <label>{t('wizard.profile.fields.email')}</label>
            <input 
              name="email" 
              type="email" 
              value={fields.email} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('email')}
              placeholder={t('wizard.profile.placeholders.email')}
            />
            {(touched.email || submitted) && errors.email && (
              <span className="error-message" style={{ color: '#d32f2f' }}>{errors.email}</span>
            )}
          </div>
          <div className="wizard-form-group">
            <label>{t('wizard.profile.fields.industry')}</label>
            <select 
              name="industry" 
              value={fields.industry} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('industry')}
            >
              <option value="">{t('wizard.profile.options.selectIndustry')}</option>
              <option value="Finance">{t('wizard.profile.options.industries.finance')}</option>
              <option value="Technology">{t('wizard.profile.options.industries.technology')}</option>
              <option value="Healthcare">{t('wizard.profile.options.industries.healthcare')}</option>
              <option value="Education">{t('wizard.profile.options.industries.education')}</option>
              <option value="Manufacturing">{t('wizard.profile.options.industries.manufacturing')}</option>
              <option value="Retail">{t('wizard.profile.options.industries.retail')}</option>
              <option value="Real Estate">{t('wizard.profile.options.industries.realEstate')}</option>
              <option value="Consulting">{t('wizard.profile.options.industries.consulting')}</option>
              <option value="Other">{t('wizard.profile.options.industries.other')}</option>
            </select>
            {(touched.industry || submitted) && errors.industry && (
              <span className="error-message" style={{ color: '#d32f2f' }}>{errors.industry}</span>
            )}
          </div>
          <div className="wizard-form-group">
            <label>{t('wizard.profile.fields.heardAbout')}</label>
            <select 
              name="heardAbout" 
              value={fields.heardAbout} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClassName('heardAbout')}
            >
              <option value="">{t('wizard.profile.options.selectOption')}</option>
              <option value="Google">{t('wizard.profile.options.sources.google')}</option>
              <option value="Social Media">{t('wizard.profile.options.sources.socialMedia')}</option>
              <option value="Referral">{t('wizard.profile.options.sources.referral')}</option>
              <option value="Advertisement">{t('wizard.profile.options.sources.advertisement')}</option>
              <option value="Other">{t('wizard.profile.options.sources.other')}</option>
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