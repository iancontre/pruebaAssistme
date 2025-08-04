import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/nav/Nav';
import Header from '../components/header/Header';
import WizardContainer from '../components/Wizard/WizardContainer';
import WizardConfigContainer from '../components/Wizard/WizardConfigContainer';
import '../components/Wizard/Wizard.css';
import { PricingPlan, createSubscriptionFromSession, SubscriptionPayload } from '../services/apiService';
import Swal from 'sweetalert2';

const DEFAULT_ROLE_ID = '4365b1d6-40b1-40d4-8566-2616b4d23df2'; // Usa el valor por defecto que espera el backend

const CompraPage: React.FC = () => {
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan as PricingPlan;
  const [currentWizardStep, setCurrentWizardStep] = useState(0);
  const [showConfigWizard, setShowConfigWizard] = useState(false);

  // Estados para recolectar datos
  const [wizardData, setWizardData] = useState<any>(null); // datos del wizard de pago + session_id
  const [configData, setConfigData] = useState<any>(null); // datos del wizard de configuración
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para mapear y enviar todo al backend
  const handleSendAll = async () => {
    if (!wizardData || !wizardData.session_id || !configData) {
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: 'Faltan datos para completar la suscripción.',
        confirmButtonColor: '#ff6b6b',
        background: '#fff',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
      console.error('Datos faltantes:', { wizardData, configData });
      return;
    }
    // --- MAPEO DE DATOS ---
    const { customerData } = wizardData;
    const { form, step2 } = configData;

    // Derivar full_name y last_name del campo name si no existen explícitamente
    let full_name = '';
    let last_name = '';
    if (customerData?.fullName) {
      full_name = customerData.fullName;
    } else if (customerData?.name) {
      const nameParts = customerData.name.trim().split(' ');
      full_name = nameParts[0] || '';
      last_name = nameParts.slice(1).join(' ');
    }
    if (customerData?.lastName) {
      last_name = customerData.lastName;
    }

    // Derivar city_name
    let city_name = customerData?.city || customerData?.city_name || '';
    // Derivar password (si existe en customerData)
    let password = customerData?.password || '';
    // role_id por defecto
    let role_id = DEFAULT_ROLE_ID;

    const user_data = {
      full_name,
      last_name,
      email: customerData?.email || '',
      password,
      phone_code: customerData?.phone_code || '',
      state_name: customerData?.state || '',
      city_name,
      office_number: customerData?.officeNumber || '',
      mobile_number: customerData?.mobileNumber || '',
      company: customerData?.company || customerData?.companyName || '',
      address_line_1: customerData?.address1 || '',
      address_line_2: customerData?.address2 || '',
      zip_code: customerData?.zip || '',
      notification_email: customerData?.notificationEmail || step2?.reportEmail || '',
      role_id, // SIEMPRE por defecto, no editable
    };

    const service_configuration = {
      greeting_message: form?.announcement || '',
      live_agent_greeting: form?.greeting || '',
      live_agent_goodbye: form?.goodbye || '',
      additional_observations: form?.observations || '',
      report_frequency_name: step2?.reportFrequency || '',
      report_time: `${step2?.reportHour || '09'}:${step2?.reportMinute || '00'}:00`,
      same_hours_mon_fri: step2?.sameHours || false,
      open_weekends: step2?.weekendOpen || false,
      industry_name: customerData?.industry || '',
      reference_source_name: customerData?.heardAbout || '',
    };

    const payload: SubscriptionPayload = {
      session_id: wizardData.session_id,
      user_data,
      service_configuration,
    };

    setIsSubmitting(true);
    console.log('Enviando payload a la API:', payload); // <--- LOG IMPORTANTE
    try {
      const response = await createSubscriptionFromSession(payload);
      
      // Alerta hermosa de éxito con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: '¡Suscripción Realizada Correctamente!',
        html: `
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
            <div style="font-size: 18px; color: #2c3e50; margin-bottom: 10px; font-weight: bold;">
              ¡Tu cuenta ha sido creada exitosamente!
            </div>
            <div style="font-size: 14px; color: #7f8c8d;">
              Serás redirigido a la página principal en unos segundos...
            </div>
          </div>
        `,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#fff',
        backdrop: 'rgba(0,0,0,0.4)',
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          popup: 'animated fadeInDown',
          title: 'swal2-title-custom',
          htmlContainer: 'swal2-html-custom'
        }
      }).then(() => {
        // Redirección inmediata después de que se cierre la alerta
        window.location.href = '/';
      });
      
      console.log('Respuesta de la API:', response);
      
    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear la suscripción',
        text: 'Por favor, intenta nuevamente o contacta soporte.',
        confirmButtonColor: '#ff6b6b',
        background: '#fff',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
      console.error('Error al crear la suscripción:', e?.response || e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nuevo: useEffect para enviar solo cuando ambos datos estén completos
  useEffect(() => {
    if (wizardData && configData) {
      console.log('wizardData:', wizardData);
      console.log('configData:', configData);
      handleSendAll();
    }
  }, [wizardData, configData]);

  return (
    <>
      <Nav />
      {!showConfigWizard && (
        <Header
          key={`wizard-step-${currentWizardStep}`}
          isWizard={true}
          wizardStep={currentWizardStep}
        />
      )}
      {!showConfigWizard ? (
        <WizardContainer
          selectedPlan={selectedPlan}
          onStepChange={(step) => setCurrentWizardStep(step)}
          onConfigWizardRequest={() => setShowConfigWizard(true)}
          onWizardComplete={(data) => setWizardData(data)}
        />
      ) : (
        <WizardConfigContainer
          onConfigComplete={setConfigData}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default CompraPage;

// Estilos personalizados para SweetAlert2
const style = document.createElement('style');
style.textContent = `
  .swal2-popup {
    border-radius: 20px !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
  }
  
  .swal2-title {
    color: #2c3e50 !important;
    font-size: 24px !important;
    font-weight: 700 !important;
  }
  
  .swal2-html-container {
    margin: 1em 0 !important;
  }
  
  .swal2-confirm {
    border-radius: 50px !important;
    padding: 12px 30px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
  }
  
  .swal2-timer-progress-bar {
    background: linear-gradient(90deg, #4CAF50, #45a049) !important;
  }
  
  .animated {
    animation-duration: 0.6s;
    animation-fill-mode: both;
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  
  .fadeInDown {
    animation-name: fadeInDown;
  }
  
  .swal2-icon {
    border-width: 4px !important;
  }
  
  .swal2-icon.swal2-success {
    border-color: #4CAF50 !important;
  }
  
  .swal2-icon.swal2-error {
    border-color: #ff6b6b !important;
  }
`;
document.head.appendChild(style); 