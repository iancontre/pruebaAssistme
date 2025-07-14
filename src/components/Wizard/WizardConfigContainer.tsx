import React, { useState } from 'react';
import WizardSidebar from './WizardSidebar';
import './Wizard.css';

const configSteps = [
  { label: 'SETUP', description: 'Configure your call handling' },
  { label: 'OPTIONS', description: 'Choose your preferences' },
  { label: 'CONFIRM', description: 'Review and confirm your setup' },
];

const WizardConfigContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
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

  const timezones = [
    'Eastern Time Zone (UTC-05:00)',
    'Central Time Zone (UTC-06:00)',
    'Mountain Time Zone (UTC-07:00)',
    'Pacific Time Zone (UTC-08:00)',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => (prev < configSteps.length - 1 ? prev + 1 : prev));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleStep2Change = (field: string, value: any) => {
    setStep2(prev => ({ ...prev, [field]: value }));
  };
  const handleUsageChange = (key: keyof typeof step2.usage) => {
    setStep2(prev => ({ ...prev, usage: { ...prev.usage, [key]: !prev.usage[key] } }));
  };
  const handleReportEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    if (value && !/^\S+@\S+\.\S+$/.test(value)) {
      error = 'Invalid email format';
    }
    setStep2(prev => ({ ...prev, reportEmail: value, reportEmailError: error }));
  };

  const renderStep = () => {
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
                  value={form.announcement}
                  onChange={handleChange}
                  rows={3}
                  style={{ width: '100%' }}
                  className="wizard-config-textarea"
                />
              </div>
              <div className="wizard-form-group">
                <label className="wizard-config-label">When a live agent answer, how would you like them to greet your caller?</label>
                <textarea
                  name="greeting"
                  value={form.greeting}
                  onChange={handleChange}
                  rows={3}
                  style={{ width: '100%' }}
                  className="wizard-config-textarea"
                />
              </div>
              <div className="wizard-form-group">
                <label className="wizard-config-label">When a live agent disconnects, how would you like the caller to say goodbye?</label>
                <textarea
                  name="goodbye"
                  value={form.goodbye}
                  onChange={handleChange}
                  rows={3}
                  style={{ width: '100%' }}
                  className="wizard-config-textarea"
                />
              </div>
              <div className="wizard-form-group">
                <label className="wizard-config-label">Additional observations?</label>
                <textarea
                  name="observations"
                  value={form.observations}
                  onChange={handleChange}
                  rows={2}
                  style={{ width: '100%' }}
                  className="wizard-config-textarea"
                />
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
                      className="wizard-config-textarea"
                      value={step2.timezone}
                      onChange={e => handleStep2Change('timezone', e.target.value)}
                      style={{ maxWidth: 350, minWidth: 250 }}
                    >
                      <option value="">Select Time Zone</option>
                      {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
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
  ].map((opt, idx, arr) => (
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
                        style={{ width: 60 }}
                        value={step2.reportHour}
                        onChange={e => handleStep2Change('reportHour', e.target.value)}
                      >
                        {[...Array(12)].map((_, i) => {
                          const val = (i + 1).toString().padStart(2, '0');
                          return <option key={val} value={val}>{val}</option>;
                        })}
                      </select>
                      <select className="wizard-config-textarea" style={{ width: 60 }} value={step2.reportMinute} onChange={e => handleStep2Change('reportMinute', String(e.target.value))}>
                        {[...Array(60)].map((_, i) => {
                          const val = i.toString().padStart(2, '0');
                          return <option key={val} value={val}>{val}</option>;
                        })}
                      </select>
                      <select className="wizard-config-textarea" style={{ width: 60 }} value={step2.reportPeriod} onChange={e => handleStep2Change('reportPeriod', String(e.target.value))}>
                        <option value="am">am</option>
                        <option value="pm">pm</option>
                      </select>
                    </div>
                  </div>
                </div>
                <label className="wizard-config-label">To which email would you like to receive the report?</label>
                <input
                  className="wizard-config-textarea"
                  type="email"
                  value={step2.reportEmail}
                  onChange={handleReportEmailChange}
                  style={{ maxWidth: 400 }}
                  placeholder="Enter email address"
                />
                {step2.reportEmailError && <span style={{ color: '#d32f2f', fontSize: 13 }}>{step2.reportEmailError}</span>}
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
    <div className="wizard-main-layout">
      <WizardSidebar
        steps={configSteps}
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
      />
      <div className="wizard-content">
        <div className="wizard-form-container">
          <div className="wizard-form-foreground">
            {renderStep()}
          </div>
          <div className="wizard-navigation mobile">
            {currentStep > 0 && (
              <button className="wizard-prev-btn-circular" onClick={handlePrevStep}>
                Prev
              </button>
            )}
            {currentStep < configSteps.length - 1 && (
              <button className="wizard-next-btn" onClick={handleNextStep}>
                Next Step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardConfigContainer; 