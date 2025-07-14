import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { generateInvoice } from '../../services/stripeService';
import { formatCurrency } from '../../services/taxService';
import wizzar4abajo from '../../assets/images/wizzar4abajo.png';
import './GetStartedForm.css';

interface GetStartedFormProps {
  onValidityChange: (isValid: boolean) => void;
  paymentData?: {
    plan: any;
    taxAmount: number;
    total: number;
  };
  onPaymentSuccess?: (data: any) => void;
}

const GetStartedForm: React.FC<GetStartedFormProps> = ({ 
  onValidityChange,
  paymentData,
  onPaymentSuccess
}) => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  
  const sessionId = searchParams.get('session_id');
  const isSuccess = searchParams.get('success') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    onValidityChange(true); // Este paso siempre es válido
  }, [onValidityChange]);

  useEffect(() => {
    if (isSuccess && sessionId) {
      handleSuccessfulPayment();
    } else if (isCanceled) {
      toast.info('Payment was canceled. You can try again.');
    } else if (isSuccess && !sessionId) {
      // Caso cuando ya se procesó el pago y se limpiaron los parámetros
      console.log('Payment already processed, showing success state');
    }
  }, [isSuccess, isCanceled, sessionId]);

  const handleSuccessfulPayment = async () => {
    setIsLoading(true);
    try {
      // Generar factura
      const invoice = await generateInvoice(sessionId!);
      setInvoiceData(invoice);
      toast.success('Payment successful! Your account is being set up.');
      if (onPaymentSuccess) {
        onPaymentSuccess(invoice);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Payment successful but there was an issue generating the invoice.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDev = import.meta.env.DEV;

  if (isLoading) {
    return (
      <div className="get-started-container">
        <div className="get-started-bg" />
        <div className="get-started-foreground">
          <div className="loading-content">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="loading-spinner"
            />
            <h3>Setting up your account...</h3>
            <p>Please wait while we process your payment and create your account.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCanceled) {
    return (
      <div className="get-started-container">
        <div className="get-started-bg" />
        <div className="get-started-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="canceled-content"
          >
            <div className="canceled-icon">
              <i className="bi bi-x-circle-fill"></i>
            </div>
            <h3>Payment Canceled</h3>
            <p>Your payment was canceled. You can try again or contact support if you need assistance.</p>
            
            <div className="action-buttons">
              <motion.button
                className="retry-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/compra'}
              >
                Try Again
              </motion.button>
              <motion.button
                className="support-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/contact'}
              >
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Mostrar siempre el layout custom en el paso 4 (éxito), tanto en dev como después de pago
  return (
    <div className="wizard-form-container">
      <div className="wizard-form-foreground">
        <div className="get-started-container custom-step4-layout">
          <div className="step4-main-layout">
            {/* Lado izquierdo: texto */}
            <div className="step4-left">
              <div className="step4-welcome-block">
                <h2 className="step4-welcome-title">Welcome</h2>
                <p className="step4-welcome-text">
                  on behalf of the Assit-Me team, we’d like to welcome<br />
                  you as our newest member! We’re looking forward<br />
                  to setting up your account and getting to know you.
                </p>
                <h3 className="step4-nextstep-title">Next Step</h3>
                <p className="step4-nextstep-text">
                  We have just a few more questions so we can<br />
                  continue setting up your account. Time needed for<br />
                  this is about 3 - 5 minutes.
                </p>
              </div>
            </div>
            {/* Lado derecho: fondo azul, texto y foto */}
            <div className="step4-right">
              <div className="step4-right-bg">
                <div className="step4-thankyou-text">
                  <span>¡Thank you for trusting us with your clients!</span>
                </div>
                <img
                  src={wizzar4abajo}
                  alt="Thank you"
                  className="step4-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedForm; 