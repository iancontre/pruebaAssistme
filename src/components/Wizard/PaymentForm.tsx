import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  pricingPlans, 
  calculateTax, 
  getTaxRate, 
  formatCurrency,
  PricingPlan 
} from '../../services/taxService';
import { createCheckoutSession } from '../../services/stripeService';
import './PaymentForm.css';

interface PaymentFormProps {
  onValidityChange: (isValid: boolean) => void;
  onPaymentSuccess: (paymentData: any) => void;
  customerData?: {
    name: string;
    email: string;
    state: string;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onValidityChange, 
  onPaymentSuccess: _onPaymentSuccess,
  customerData 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerState, setCustomerState] = useState(customerData?.state || '');

  const subtotal = selectedPlan?.price || 0;
  const taxAmount = calculateTax(subtotal, customerState);
  const total = subtotal + taxAmount;
  const taxRate = getTaxRate(customerState);

  const isValid = selectedPlan !== null && customerState !== '';

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  const handlePlanSelection = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const handleStateChange = (state: string) => {
    setCustomerState(state);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan || !customerData) {
      toast.error('Please select a plan and ensure customer data is available.');
      return;
    }

    setIsProcessing(true);

    try {
      // Crear Checkout Session con Stripe Tax automático
      await createCheckoutSession({
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: selectedPlan.price, // Stripe calculará automáticamente los impuestos
        customerEmail: customerData.email,
        customerName: customerData.name,
        successUrl: `${window.location.origin}/compra?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/compra?canceled=true`,
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to proceed to payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form-container">
      <div className="payment-form-bg" />
      <div className="payment-form-foreground">
        <div className="payment-form">
          <h3 className="payment-title">Select Your Plan & Payment</h3>
          
          {/* Plan Selection */}
          <div className="plan-selection">
            <h4>Choose Your Plan</h4>
            <div className="plans-grid">
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
                  onClick={() => handlePlanSelection(plan)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h5>{plan.name}</h5>
                  <div className="plan-price">{formatCurrency(plan.price)}</div>
                  <div className="plan-minutes">{plan.minutes} MINUTES</div>
                  <div className="plan-rate">${plan.addMinuteRate} Add Minutes</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tax Calculation */}
          {selectedPlan && (
            <div className="tax-calculation">
              <h4>Tax Calculation</h4>
              <div className="state-selector">
                <label>State for Tax Calculation:</label>
                <select 
                  value={customerState} 
                  onChange={(e) => handleStateChange(e.target.value)}
                  disabled={!!customerData?.state}
                >
                  <option value="">Select State</option>
                  <option value="Georgia">Georgia</option>
                  <option value="California">California</option>
                  <option value="Texas">Texas</option>
                  <option value="Florida">Florida</option>
                  <option value="New York">New York</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Pennsylvania">Pennsylvania</option>
                  <option value="Ohio">Ohio</option>
                  <option value="Michigan">Michigan</option>
                  <option value="North Carolina">North Carolina</option>
                </select>
              </div>
              
              {customerState && (
                <div className="tax-breakdown">
                  <div className="breakdown-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Tax ({taxRate?.name} - {(taxRate?.rate || 0) * 100}%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="breakdown-row total">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="tax-note">
                    <p>
                      💡 <strong>Note:</strong> Tax is calculated based on your selected state. 
                      The final amount will be confirmed on the payment page.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Proceed to Payment Button */}
          {isValid && (
            <motion.button
              type="button"
              className="payment-submit-btn"
              onClick={handleProceedToPayment}
              disabled={isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing ? 'Redirecting to Payment...' : `Proceed to Payment - ${formatCurrency(total)}`}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 