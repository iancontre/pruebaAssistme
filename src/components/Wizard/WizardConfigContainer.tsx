import React, { useState, useEffect } from 'react';
import WizardSidebar from './WizardSidebar';
import Header from '../header/Header';
import './Wizard.css';
import finalize1 from '../../assets/images/finalize 1.png';
import { useFormValidation } from '../../hooks/useFormValidation';

const configSteps = [
  { label: 'SETUP', description: 'Configure your call handling' },
  { label: 'OPTIONS', description: 'Choose your preferences' },
  { label: 'CONFIRM', description: 'Review and confirm your setup' },
];

interface WizardConfigContainerProps {
  onConfigComplete?: (data: any) => void;
  isSubmitting?: boolean;
}

const WizardConfigContainer: React.FC<WizardConfigContainerProps> = ({ onConfigComplete, isSubmitting }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Validación para el paso 1 (Setup)
  const setupValidation = useFormValidation({
    initialFields: {
      announcement: '',
      greeting: '',
      goodbye: '',
      observations: '',
    },
    fieldTypes: {
      announcement: 'required',
      greeting: 'required',
      goodbye: 'required',
      observations: 'text', // Cambiado de 'required' a 'text' para que no sea obligatorio
    }
  });

  // Validación para el paso 2 (Options)
  const optionsValidation = useFormValidation({
    initialFields: {
      timezone: '',
      reportEmail: '',
    },
    fieldTypes: {
      timezone: 'select',
      reportEmail: 'email',
    }
  });

  // Validación para el paso 3 (Confirm)
  const confirmValidation = useFormValidation({
    initialFields: {
      selectedDay: '',
      selectedSlot: '',
    },
    fieldTypes: {
      selectedDay: 'select',
      selectedSlot: 'select',
    }
  });

  const [form] = useState({
    announcement: '',
    greeting: '',
    goodbye: '',
    observations: '',
  });

  const [step2, setStep2] = useState({
    timezone: '',
    usage: {
      lunch: false,
      afterHours: false,
      overflow: false,
      virtualReceptionist: false,
      other: false,
    },
    sameHours: true,
    openWeekdays: false, // <-- agregado para el checkbox individual
    openSaturday: true, // <-- para el checkbox de Saturday
    openSunday: true,   // <-- para el checkbox de Sunday
    weekendOpen: true,
    reportFrequency: 'daily',
    reportHour: '09',
    reportMinute: '00',
    reportPeriod: 'pm',
    reportEmail: '',
    reportEmailError: '',
  });

  // Estados para el paso 3
  const [selectedDay, setSelectedDay] = useState<string>('2025-02-26');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [confirmNumber, setConfirmNumber] = useState(true);
  const [showFinalize, setShowFinalize] = useState(false);

  const timezones = [
    'Eastern Time Zone (UTC-05:00)',
    'Central Time Zone (UTC-06:00)',
    'Mountain Time Zone (UTC-07:00)',
    'Pacific Time Zone (UTC-08:00)',
  ];

  // Función para verificar si al menos una opción de usage está seleccionada
  const isUsageValid = () => {
    return Object.values(step2.usage).some(value => value === true);
  };

  // Función para verificar si el paso actual es válido
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return setupValidation.isValid;
      case 1:
        return optionsValidation.isValid && isUsageValid();
      case 2:
        return confirmValidation.isValid;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      setShowFinalize(true);
      return;
    }
    
    // Validar el paso actual antes de continuar
    if (isCurrentStepValid()) {
      setCurrentStep((prev) => (prev < configSteps.length - 1 ? prev + 1 : prev));
    }
  };

  const handlePrevStep = () => {
    if (showFinalize) {
      setShowFinalize(false);
      return;
    }
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleStep2Change = (field: string, value: any) => {
    setStep2(prev => ({ ...prev, [field]: value }));
    if (field === 'timezone') {
      optionsValidation.setFieldValue('timezone', value);
    }
  };

  // Sincronizar datos del estado local con la validación
  useEffect(() => {
    setupValidation.setFieldValue('announcement', form.announcement);
    setupValidation.setFieldValue('greeting', form.greeting);
    setupValidation.setFieldValue('goodbye', form.goodbye);
    setupValidation.setFieldValue('observations', form.observations);
  }, [form]);

  useEffect(() => {
    optionsValidation.setFieldValue('timezone', step2.timezone);
    optionsValidation.setFieldValue('reportEmail', step2.reportEmail);
  }, [step2.timezone, step2.reportEmail]);

  useEffect(() => {
    confirmValidation.setFieldValue('selectedDay', selectedDay);
    confirmValidation.setFieldValue('selectedSlot', selectedSlot);
  }, [selectedDay, selectedSlot]);

  const handleUsageChange = (key: keyof typeof step2.usage) => {
    setStep2(prev => ({ ...prev, usage: { ...prev.usage, [key]: !prev.usage[key] } }));
  };

  const handleDaySelection = (day: string) => {
    setSelectedDay(day);
    setSelectedSlot('');
    confirmValidation.setFieldValue('selectedDay', day);
  };

  const handleSlotSelection = (slot: string) => {
    setSelectedSlot(slot);
    confirmValidation.setFieldValue('selectedSlot', slot);
  };

  // Al finalizar el wizard de configuración:
  const handleFinishConfig = () => {
    if (onConfigComplete) {
      onConfigComplete({
        form: {
          announcement: setupValidation.fields.announcement,
          greeting: setupValidation.fields.greeting,
          goodbye: setupValidation.fields.goodbye,
          observations: setupValidation.fields.observations,
        },
        step2: {
          ...step2,
          timezone: optionsValidation.fields.timezone,
          reportEmail: optionsValidation.fields.reportEmail,
        },
        selectedDay: confirmValidation.fields.selectedDay,
        selectedSlot: confirmValidation.fields.selectedSlot,
        confirmNumber,
        // Agrega aquí cualquier otro estado relevante de configuración
      });
    }
  };

  const renderStep = () => {
    if (showFinalize) {
      return (
        <>
          <div className="wizard-form-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
          <div className="wizard-form-foreground" style={{ position: 'relative', zIndex: 1 }}>
            <form className="wizard-form" autoComplete="off" style={{ position: 'relative', minHeight: 500 }}>
              <div style={{ maxWidth: 500, paddingRight: 180 }}>
                <div style={{ fontWeight: 700, color: '#18344C', fontSize: 18, marginBottom: 24 }}>Welcome</div>
                <div style={{ color: '#222', fontSize: 16, marginBottom: 32, maxWidth: 420 }}>
                  We want you to know that we are committed to delivering the very best service to you and to your clients. We understand that every interaction counts and we never give any less than 100% to all of our clients and all of their clients.
                </div>
                <div style={{ fontWeight: 700, color: '#18344C', fontSize: 18, marginBottom: 12 }}>Next Step</div>
                <div style={{ color: '#222', fontSize: 16, marginBottom: 32, maxWidth: 420 }}>
                  A setup specialist will call you at 678-427-1932 on February 26 at 4:00pm EST to finalize everything and get you live.<br /><br />We look forward to speaking with you.
                </div>
                <div style={{ fontWeight: 700, color: '#18344C', fontSize: 32, marginTop: 48, lineHeight: 1.1 }}>
                  We can't wait to<br />Start Working<br />for you
                </div>
                <button
                  type="button"
                  className="wizard-next-btn"
                  style={{ marginTop: 32, fontSize: 18, padding: '12px 32px' }}
                  onClick={handleFinishConfig}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Finalizar y Enviar'}
                </button>
              </div>
              <img 
                src={finalize1} 
                alt="Finalize" 
                style={{ 
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  height: '380px',
                  objectFit: 'cover',
                  objectPosition: 'bottom right'
                }} 
              />
            </form>
          </div>
        </>
      );
    }
    if (currentStep === 0) {
      return (
        <div style={{ position: 'relative', width: '100%' }}>
          <div className="wizard-form-bg" />
          <div className="wizard-form-foreground">
            <form className="wizard-form" autoComplete="off">
              <div className="wizard-form-group">
                <label className="wizard-config-label">
                  Many of our customers opt to have a prerecorded announcement followed by hold music before a live agent answer (this service is free). If you would like to use this service, what would you like it to say?
                </label>
                <textarea
                  name="announcement"
                  value={setupValidation.fields.announcement}
                  onChange={setupValidation.handleChange}
                  onBlur={setupValidation.handleBlur}
                  rows={3}
                  style={{ width: '100%' }}
                  className={`wizard-config-textarea ${setupValidation.touched.announcement && !setupValidation.isFieldValid('announcement') ? 'error' : ''} ${setupValidation.touched.announcement && setupValidation.isFieldValid('announcement') ? 'valid' : ''}`}
                />
                {setupValidation.touched.announcement && setupValidation.getFieldError('announcement') && (
                  <div className="error-message">{setupValidation.getFieldError('announcement')}</div>
                )}
              </div>
              <div className="wizard-form-group">
                <label className="wizard-config-label">When a live agent answer, how would you like them to greet your caller?</label>
                <textarea
                  name="greeting"
                  value={setupValidation.fields.greeting}
                  onChange={setupValidation.handleChange}
                  onBlur={setupValidation.handleBlur}
                  rows={3}
                  style={{ width: '100%' }}
                  className={`wizard-config-textarea ${setupValidation.touched.greeting && !setupValidation.isFieldValid('greeting') ? 'error' : ''} ${setupValidation.touched.greeting && setupValidation.isFieldValid('greeting') ? 'valid' : ''}`}
                />
                {setupValidation.touched.greeting && setupValidation.getFieldError('greeting') && (
                  <div className="error-message">{setupValidation.getFieldError('greeting')}</div>
                )}
              </div>
              <div className="wizard-form-group">
                <label className="wizard-config-label">When a live agent disconnects, how would you like the caller to say goodbye?</label>
                <textarea
                  name="goodbye"
                  value={setupValidation.fields.goodbye}
                  onChange={setupValidation.handleChange}
                  onBlur={setupValidation.handleBlur}
                  rows={3}
                  style={{ width: '100%' }}
                  className={`wizard-config-textarea ${setupValidation.touched.goodbye && !setupValidation.isFieldValid('goodbye') ? 'error' : ''} ${setupValidation.touched.goodbye && setupValidation.isFieldValid('goodbye') ? 'valid' : ''}`}
                />
                {setupValidation.touched.goodbye && setupValidation.getFieldError('goodbye') && (
                  <div className="error-message">{setupValidation.getFieldError('goodbye')}</div>
                )}
              </div>
              <div className="wizard-form-group">
                <label className="wizard-config-label">Additional observations?</label>
                <textarea
                  name="observations"
                  value={setupValidation.fields.observations}
                  onChange={setupValidation.handleChange}
                  onBlur={setupValidation.handleBlur}
                  rows={2}
                  style={{ width: '100%' }}
                  className={`wizard-config-textarea ${setupValidation.touched.observations && !setupValidation.isFieldValid('observations') ? 'error' : ''} ${setupValidation.touched.observations && setupValidation.isFieldValid('observations') ? 'valid' : ''}`}
                />
                {setupValidation.touched.observations && setupValidation.getFieldError('observations') && (
                  <div className="error-message">{setupValidation.getFieldError('observations')}</div>
                )}
              </div>
            </form>
          </div>
        </div>
      );
    }
    if (currentStep === 1) {
      return (
        <div style={{ position: 'relative', width: '100%' }}>
          <div className="wizard-form-bg" />
          <div className="wizard-form-foreground">
            <form className="wizard-form" autoComplete="off" onSubmit={e => e.preventDefault()} style={{ minWidth: 700, maxWidth: 850 }}>
              <div className="wizard-form-group" style={{ padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <label className="wizard-config-label" style={{ marginBottom: 0 }}>
                      What time zone is your business located in?
                    </label>
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <select
                      name="timezone"
                      className={`wizard-config-textarea ${optionsValidation.touched.timezone && !optionsValidation.isFieldValid('timezone') ? 'error' : ''} ${optionsValidation.touched.timezone && optionsValidation.isFieldValid('timezone') ? 'valid' : ''}`}
                      value={optionsValidation.fields.timezone}
                      onChange={optionsValidation.handleChange}
                      onBlur={optionsValidation.handleBlur}
                      style={{ maxWidth: 350, minWidth: 250 }}
                    >
                      <option value="">Select Time Zone</option>
                      {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                    {optionsValidation.touched.timezone && optionsValidation.getFieldError('timezone') && (
                      <div className="error-message">{optionsValidation.getFieldError('timezone')}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="wizard-form-group">
                <label className="wizard-config-label">How do you plan on using our service?</label>
                <div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'repeat(2, 56px)',
  gap: '18px 32px',
  marginTop: 16,
  justifyItems: 'center',
  alignItems: 'center',
  width: '100%'
}}>
  {[
    { key: 'lunch', label: 'Lunch' },
    { key: 'afterHours', label: 'After Hours' },
    { key: 'overflow', label: 'Call Overflow/Busy' },
    { key: 'virtualReceptionist', label: '24/7 Virtual Receptionist' },
    { key: 'other', label: 'Other' },
  ].map((opt) => (
    <label key={opt.key} style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer', gap: 10, width: '100%', height: 48, minWidth: 0, justifyContent: 'flex-start',
    }}>
      <input
        type="checkbox"
        checked={step2.usage[opt.key as keyof typeof step2.usage]}
        onChange={() => handleUsageChange(opt.key as keyof typeof step2.usage)}
        style={{ display: 'none' }}
      />
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: step2.usage[opt.key as keyof typeof step2.usage] ? '#5DD28E' : '#E9E9E9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
          border: step2.usage[opt.key as keyof typeof step2.usage] ? '2px solid #5DD28E' : '2px solid #E9E9E9',
          boxSizing: 'border-box',
        }}
      >
        {step2.usage[opt.key as keyof typeof step2.usage] && (
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span style={{ color: '#222', fontSize: 15, textAlign: 'left', fontWeight: 400, whiteSpace: 'normal', lineHeight: 1.1 }}>{opt.label}</span>
    </label>
  ))}
  {/* Si hay menos de 6, agrega una celda vacía para simetría */}
  <div style={{ width: '100%', height: 48 }}></div>
</div>
              </div>
              <div className="wizard-form-group" style={{ padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <label className="wizard-config-label" style={{ marginBottom: 0 }}>
                      Are your business hours the same<br />Monday - Friday?
                    </label>
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 32 }}>
                    {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map(opt => (
                      <label key={String(opt.value)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 10 }}>
                        <input
                          type="radio"
                          checked={step2.sameHours === opt.value}
                          onChange={() => handleStep2Change('sameHours', opt.value)}
                          style={{ display: 'none' }}
                        />
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: step2.sameHours === opt.value ? '#5DD28E' : '#E9E9E9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: step2.sameHours === opt.value ? '2px solid #5DD28E' : '2px solid #E9E9E9',
                            boxSizing: 'border-box',
                            transition: 'background 0.2s, border 0.2s',
                          }}
                        >
                          {step2.sameHours === opt.value && (
                            <span style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: '#fff',
                              display: 'block',
                            }} />
                          )}
                        </span>
                        <span style={{ color: '#222', fontSize: 16, fontWeight: 400 }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {/* Tabla no editable */}
              <div className="wizard-table" style={{ marginTop: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#18344C', color: '#fff', borderRadius: 12, overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#18344C', color: '#fff', padding: 8 }}>Open</th>
                      <th style={{ background: '#18344C', color: '#fff', padding: 8 }}>Day</th>
                      <th colSpan={2} style={{ background: '#18344C', color: '#fff', padding: 8 }}>Hours</th>
                      <th colSpan={2} style={{ background: '#18344C', color: '#fff', padding: 8 }}>Lunch</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#bcd0e2', color: '#18344C' }}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: '100%', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={step2.openWeekdays}
                            onChange={() => handleStep2Change('openWeekdays', !step2.openWeekdays)}
                            style={{ display: 'none' }}
                          />
                          <span
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              background: step2.openWeekdays ? '#5A7B96' : '#5A7B96',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: step2.openWeekdays ? '2px solid #5A7B96' : '2px solid#5A7B96',
                              boxSizing: 'border-box',
                              transition: 'background 0.2s, border 0.2s',
                            }}
                          >
                            {step2.openWeekdays && (
                              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                        </label>
                      </td>
                      <td>Monday-friday</td>
                      <td>9:00 am</td>
                      <td>6:00 pm</td>
                      <td>none</td>
                      <td>none</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="wizard-form-group" style={{ padding: 0, marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <label className="wizard-config-label" style={{ marginBottom: 0, fontSize: 16 }}>
                      Are you open during the weekend?
                    </label>
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 20 }}>
                    {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map(opt => (
                      <label key={String(opt.value)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
                        <input
                          type="radio"
                          checked={step2.weekendOpen === opt.value}
                          onChange={() => handleStep2Change('weekendOpen', opt.value)}
                          style={{ display: 'none' }}
                        />
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: step2.weekendOpen === opt.value ? '#5DD28E' : '#E9E9E9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: step2.weekendOpen === opt.value ? '2px solid #5DD28E' : '2px solid #E9E9E9',
                            boxSizing: 'border-box',
                            transition: 'background 0.2s, border 0.2s',
                          }}
                        >
                          {step2.weekendOpen === opt.value && (
                            <span style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: '#fff',
                              display: 'block',
                            }} />
                          )}
                        </span>
                        <span style={{ color: '#222', fontSize: 16, fontWeight: 400 }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {/* Tabla no editable */}
              <div className="wizard-table" style={{ marginTop: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#18344C', color: '#fff', borderRadius: 12, overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#18344C', color: '#fff', padding: 8 }}>Open</th>
                      <th style={{ background: '#18344C', color: '#fff', padding: 8 }}>Day</th>
                      <th colSpan={2} style={{ background: '#18344C', color: '#fff', padding: 8 }}>Hours</th>
                      <th colSpan={2} style={{ background: '#18344C', color: '#fff', padding: 8 }}>Lunch</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#e9eef2', color: '#18344C' }}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: '100%', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={step2.openSaturday}
                            onChange={() => handleStep2Change('openSaturday', !step2.openSaturday)}
                            style={{ display: 'none' }}
                          />
                          <span
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              background: step2.openSaturday ? '#5A7B96' : '#5A7B96',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: step2.openSaturday ? '2px solid #5A7B96' : '2px #5A7B96',
                              boxSizing: 'border-box',
                              transition: 'background 0.2s, border 0.2s',
                            }}
                          >
                            {step2.openSaturday && (
                              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                        </label>
                      </td>
                      <td>Saturday</td>
                      <td>9:00 am</td>
                      <td>5:00 pm</td>
                      <td>none</td>
                      <td>none</td>
                    </tr>
                    <tr style={{ background: '#e9eef2', color: '#18344C' }}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: '100%', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={step2.openSunday}
                            onChange={() => handleStep2Change('openSunday', !step2.openSunday)}
                            style={{ display: 'none' }}
                          />
                          <span
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              background: step2.openSunday ? '#5A7B96' : '#5A7B96',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: step2.openSunday ? '2px solid #5A7B96' : '2px solid #5A7B96',
                              boxSizing: 'border-box',
                              transition: 'background 0.2s, border 0.2s',
                            }}
                          >
                            {step2.openSunday && (
                              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                        </label>
                      </td>
                      <td>Sunday</td>
                      <td>9:00 am</td>
                      <td>5:00 pm</td>
                      <td>none</td>
                      <td>none</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="wizard-form-group">
                <p style={{ color: '#18344C', fontWeight: 500, marginBottom: 8 }}>
                  We provide a Summary Report, free of charge, for the previous 24 hours of messages.
                </p>
                <div className="wizard-form-group" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <label className="wizard-config-label" style={{ marginBottom: 0, fontSize: 16 }}>
                        How often would you like to receive this report?
                      </label>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 20 }}>
                      {[{ value: 'daily', label: 'Daily' }, { value: 'm-f', label: 'Monday - Friday' }].map(opt => (
                        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
                          <input
                            type="radio"
                            checked={step2.reportFrequency === opt.value}
                            onChange={() => handleStep2Change('reportFrequency', opt.value)}
                            style={{ display: 'none' }}
                          />
                          <span
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: step2.reportFrequency === opt.value ? '#5DD28E' : '#E9E9E9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: step2.reportFrequency === opt.value ? '2px solid #5DD28E' : '2px solid #E9E9E9',
                              boxSizing: 'border-box',
                              transition: 'background 0.2s, border 0.2s',
                            }}
                          >
                            {step2.reportFrequency === opt.value && (
                              <span style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: '#fff',
                                display: 'block',
                              }} />
                            )}
                          </span>
                          <span style={{ color: '#222', fontSize: 16, fontWeight: 400 }}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="wizard-form-group" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <label className="wizard-config-label" style={{ marginBottom: 0, fontSize: 16 }}>
                        At what time would you like to receive the Summary Report?
                      </label>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <select
                        className="wizard-config-textarea"
                        style={{ width: 60, textAlign: 'center', padding: '0 8px', height: 32, fontSize: 15 }}
                        value={step2.reportHour && /^[0-9]{2}$/.test(step2.reportHour) ? step2.reportHour : '09'}
                        onChange={e => handleStep2Change('reportHour', e.target.value.padStart(2, '0'))}
                      >
                        {[...Array(12)].map((_, i) => {
                          const val = (i + 1).toString().padStart(2, '0');
                          return <option key={val} value={val}>{val}</option>;
                        })}
                      </select>
                      <select
                        className="wizard-config-textarea"
                        style={{ width: 60, textAlign: 'center', padding: '0 8px', height: 32, fontSize: 15 }}
                        value={step2.reportMinute && /^[0-9]{2}$/.test(step2.reportMinute) ? step2.reportMinute : '00'}
                        onChange={e => handleStep2Change('reportMinute', e.target.value.padStart(2, '0'))}
                      >
                        {[...Array(60)].map((_, i) => {
                          const val = i.toString().padStart(2, '0');
                          return <option key={val} value={val}>{val}</option>;
                        })}
                      </select>
                      <select
                        className="wizard-config-textarea"
                        style={{ width: 60, textAlign: 'center', padding: '0 8px', height: 32, fontSize: 15 }}
                        value={step2.reportPeriod}
                        onChange={e => handleStep2Change('reportPeriod', e.target.value)}
                      >
                        <option value="am">am</option>
                        <option value="pm">pm</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="wizard-form-group" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <label className="wizard-config-label" style={{ marginBottom: 0, fontSize: 16 }}>
                        To which email would you like to receive the report?
                      </label>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <input
                        name="reportEmail"
                        className={`wizard-config-textarea ${optionsValidation.touched.reportEmail && !optionsValidation.isFieldValid('reportEmail') ? 'error' : ''} ${optionsValidation.touched.reportEmail && optionsValidation.isFieldValid('reportEmail') ? 'valid' : ''}`}
                        type="email"
                        value={optionsValidation.fields.reportEmail}
                        onChange={optionsValidation.handleChange}
                        onBlur={optionsValidation.handleBlur}
                        style={{ maxWidth: 300, width: '100%' }}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  {optionsValidation.touched.reportEmail && optionsValidation.getFieldError('reportEmail') && (
                    <div className="error-message">{optionsValidation.getFieldError('reportEmail')}</div>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>
      );
    }
    if (currentStep === 2) {
      // Paso 3: Layout igual a la imagen proporcionada, con el mismo contenedor y botón Next Step funcional
      const availableDays = [
        { label: 'Wednesday, February 26 (Today)', value: '2025-02-26' },
        { label: 'Thursday, February 27', value: '2025-02-27' },
        { label: 'Friday,February 28', value: '2025-02-28' },
        { label: 'Monday, March 3', value: '2025-03-03' },
        { label: 'Tuesday,March 4', value: '2025-03-04' },
      ];
      const availableSlots = {
        '2025-02-26': [
          { time: '09:30 AM', disabled: true },
          { time: '12:00 PM', disabled: true },
          { time: '02:30 PM', disabled: false },
        ],
        '2025-02-27': [
          { time: '10:00 AM', disabled: true },
          { time: '12:30 AM', disabled: true },
          { time: '03:00 PM', disabled: false },
        ],
        '2025-02-28': [
          { time: '10:30 AM', disabled: true },
          { time: '01:00 PM', disabled: true },
          { time: '03:30 PM', disabled: false },
        ],
        '2025-03-03': [
          { time: '11:00 AM', disabled: true },
          { time: '01:30 PM', disabled: true },
          { time: '04:00 PM', disabled: false },
        ],
        '2025-03-04': [
          { time: '11:30 AM', disabled: true },
          { time: '02:00 PM', disabled: false },
          { time: '04:30 PM', disabled: false },
        ],
      };
      const phoneNumber = '678-427-1932'; // Mock, puedes traerlo del estado real

      return (
        <div style={{ position: 'relative', width: '100%' }}>
          <div className="wizard-form-bg" />
          <div className="wizard-form-foreground">
            <form className="wizard-form" autoComplete="off" style={{ minWidth: 700, maxWidth: 850 }} onSubmit={e => e.preventDefault()}>
              <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
                <div style={{ color: '#18344C', fontSize: 18, marginBottom: 16 }}>
                  Your account is now being processed, however we would like to set up a time for one of our setup specialists to call you to review your instructions and the handling of your calls
                </div>
                <div style={{ color: '#18344C', fontSize: 16, marginBottom: 24 }}>
                  Please choose the time slot that would work best for you
                </div>
                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 32 }}>
                  {/* Días */}
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18 }}>Select an available day</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {availableDays.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDaySelection(day.value)}
                          style={{
                            background: selectedDay === day.value ? '#18344C' : '#fff',
                            color: selectedDay === day.value ? '#fff' : '#18344C',
                            border: selectedDay === day.value ? 'none' : '2px solid #18344C',
                            borderRadius: 10,
                            fontWeight: 600,
                            fontSize: 16,
                            padding: '12px 18px',
                            cursor: 'pointer',
                            boxShadow: selectedDay === day.value ? '0 2px 8px rgba(24,52,76,0.08)' : 'none',
                            outline: 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Horarios */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                      {(availableSlots[selectedDay as keyof typeof availableSlots] as { time: string; disabled: boolean }[]).map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={slot.disabled}
                          onClick={() => handleSlotSelection(slot.time)}
                          style={{
                            background: selectedSlot === slot.time ? '#18344C' : slot.disabled ? '#E9E9E9' : '#fff',
                            color: selectedSlot === slot.time ? '#fff' : slot.disabled ? '#A0A0A0' : '#18344C',
                            border: selectedSlot === slot.time ? 'none' : '2px solid #18344C',
                            borderRadius: 10,
                            fontWeight: 700,
                            fontSize: 16,
                            padding: '12px 0',
                            cursor: slot.disabled ? 'not-allowed' : 'pointer',
                            boxShadow: selectedSlot === slot.time ? '0 2px 8px rgba(24,52,76,0.08)' : 'none',
                            outline: 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Confirmación de número */}
                <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
                  <span style={{ color: '#18344C', fontSize: 16 }}>
                    Is the best number to reach you the number you previously provided, <b>{phoneNumber}</b>
                  </span>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map(opt => (
                      <label key={String(opt.value)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
                        <input
                          type="radio"
                          checked={confirmNumber === opt.value}
                          onChange={() => setConfirmNumber(opt.value)}
                          style={{ display: 'none' }}
                        />
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: confirmNumber === opt.value ? '#5DD28E' : '#E9E9E9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: confirmNumber === opt.value ? '2px solid #5DD28E' : '2px solid #E9E9E9',
                            boxSizing: 'border-box',
                            transition: 'background 0.2s, border 0.2s',
                          }}
                        >
                          {confirmNumber === opt.value && (
                            <span style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: '#fff',
                              display: 'block',
                            }} />
                          )}
                        </span>
                        <span style={{ color: '#222', fontSize: 16, fontWeight: 400 }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      );
    }
    // Puedes agregar los otros pasos aquí
    return <div style={{ padding: 32 }}>Step {currentStep + 1} content here</div>;
  };

  return (
    <>
      <Header isConfigWizard={true} wizardStep={showFinalize ? 3 : currentStep} />
      <div className="wizard-main-layout">
        <WizardSidebar
          steps={configSteps}
          currentStep={currentStep}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          forceNoValidation={true}
        />
        <div className="wizard-content">
          <div className="wizard-form-container">
            <div className="wizard-form-foreground">
              {renderStep()}
            </div>
            <div className="wizard-navigation mobile">
              {(currentStep > 0 || showFinalize) && (
                <button className="wizard-prev-btn-circular" onClick={handlePrevStep}>
                  Prev
                </button>
              )}
              {currentStep < configSteps.length - 1 && !showFinalize && (
                <button 
                  className={`wizard-next-btn ${!isCurrentStepValid() ? 'disabled' : ''}`}
                  onClick={handleNextStep}
                  disabled={!isCurrentStepValid()}
                >
                  Next Step
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WizardConfigContainer; 