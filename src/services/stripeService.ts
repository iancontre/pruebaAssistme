import { loadStripe, Stripe } from '@stripe/stripe-js';

// Clave pública de Stripe del usuario
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RW2ByFZLk0rN7lFwRxX2Buc5HVcTC15zmSlqLdS7ZkcpLPT8PrMYReVDEREnJfGwgBXvc1RKNbbPVQAsrkUTzxZ002qoJObI2';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface CreateCheckoutSessionRequest {
  planId: string;
  planName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  // Información de dirección para Stripe Tax
  address?: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  successUrl: string;
  cancelUrl: string;
}

// Mapeo de planes a price IDs reales por nombre
const PLAN_PRICE_IDS: { [key: string]: string } = {
  'STARTER': 'price_1Rdc0LFZLk0rN7lFx7NDndUA',
  'PRO': 'price_1Rdc0kFZLk0rN7lFw6b3ULcw',
  'BUSINESS': 'price_1Rdc1AFZLk0rN7lFpvUiN762',
};

// Debug: Log de los price IDs para verificar
console.log('Stripe Price IDs by name:', PLAN_PRICE_IDS);

// Función para crear checkout session con configuración básica
export const createCheckoutSession = async (request: CreateCheckoutSessionRequest): Promise<CheckoutSession> => {
  try {
    console.log('🚀 Creating checkout session for:', request);
    
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    console.log('✅ Stripe loaded successfully');

    // Usar el nombre del plan para encontrar el price ID
    const priceId = PLAN_PRICE_IDS[request.planName.toUpperCase()];
    if (!priceId) {
      throw new Error(`Price ID not found for plan: ${request.planName} (${request.planId})`);
    }
    console.log('✅ Price ID found for plan:', request.planName, '->', priceId);

    // Crear la sesión de checkout usando el método correcto
    console.log('🔄 Redirecting to Stripe checkout...');
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: request.successUrl,
      cancelUrl: request.cancelUrl,
      customerEmail: request.customerEmail,
      billingAddressCollection: 'required',
    });

    if (error) {
      console.error('❌ Stripe redirect error:', error);
      throw error;
    }
    
    console.log('✅ Stripe redirect successful');

    // Retornar un objeto mock ya que redirectToCheckout no retorna session
    return {
      id: 'redirecting_to_stripe',
      url: 'redirecting_to_stripe'
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const redirectToCheckout = async (sessionId: string) => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

export const generateInvoice = async (_sessionId: string) => {
  try {
    // Mock de generación de factura
    const invoiceNumber = `INV-${Date.now()}`;
    const downloadUrl = `https://yourdomain.com/invoices/${invoiceNumber}.pdf`;

    return {
      invoiceNumber,
      downloadUrl,
      amount: 0,
      taxAmount: 0,
      total: 0,
    };
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
}; 