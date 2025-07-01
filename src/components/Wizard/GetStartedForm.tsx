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

  if (isSuccess && invoiceData) {
    return (
      <div className="get-started-container">
        <div className="get-started-bg" />
        <div className="get-started-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="success-content"
          >
            <div className="success-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <h3>Welcome to Your New Account!</h3>
            <p>Your payment has been processed successfully and your account is now active.</p>
            
            <div className="account-details">
              <h4>Account Details</h4>
              <div className="detail-row">
                <span>Plan:</span>
                <span>{paymentData?.plan?.name || 'Selected Plan'}</span>
              </div>
              <div className="detail-row">
                <span>Minutes Included:</span>
                <span>{paymentData?.plan?.minutes || 0} minutes</span>
              </div>
              <div className="detail-row">
                <span>Amount Paid:</span>
                <span>{formatCurrency(paymentData?.total || 0)}</span>
              </div>
              <div className="detail-row">
                <span>Invoice Number:</span>
                <span>{invoiceData?.invoiceNumber || 'N/A'}</span>
              </div>
            </div>

            <div className="next-steps">
              <h4>Next Steps</h4>
              <ul>
                <li>Check your email for account setup instructions</li>
                <li>Download your invoice from the link below</li>
                <li>Set up your phone system preferences</li>
                <li>Configure your business hours and routing</li>
              </ul>
            </div>

            <div className="action-buttons">
              <motion.button
                className="download-invoice-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(invoiceData?.downloadUrl, '_blank')}
              >
                Download Invoice
              </motion.button>
              <motion.button
                className="dashboard-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </motion.button>
            </div>
          </motion.div>
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

  // Estado por defecto
  return (
    <div className="get-started-container custom-step4-layout">
      <div className="get-started-bg" />
      <div className="get-started-foreground step4-foreground">
        <div className="step4-content">
          <div className="step4-left">
            <h2 className="step4-welcome">Welcome</h2>
            <p>on behalf of the Assit-Me team, we'd like to welcome you as our newest member! We're looking forward to setting up your account and getting to know you.</p>
            <h2 className="step4-next">Next Step</h2>
            <p>We have just a few more questions so we can continue setting up your account. Time needed for this is about 3 - 5 minutes.</p>
          </div>
          <div className="step4-right">
            <div className="step4-thankyou">¡Thank you for<br/>trusting us with your<br/>clients!</div>
            <img src={wizzar4abajo} alt="Welcome" className="step4-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedForm; 