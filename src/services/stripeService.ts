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

// Mapeo de planes a price IDs reales
const PLAN_PRICE_IDS: { [key: string]: string } = {
  'starter': 'price_1Rdc0LFZLk0rN7lFx7NDndUA', // STARTER
  'pro': 'price_1Rdc0kFZLk0rN7lFw6b3ULcw', // PRO
  'business': 'price_1Rdc1AFZLk0rN7lFpvUiN762', // BUSINESS
};

// Función para crear checkout session con configuración básica (sin tax automático desde frontend)
export const createCheckoutSession = async (request: CreateCheckoutSessionRequest): Promise<CheckoutSession> => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const priceId = PLAN_PRICE_IDS[request.planId];
    if (!priceId) {
      throw new Error(`Price ID not found for plan: ${request.planId}`);
    }

    // Configuración básica para Stripe Checkout
    const checkoutOptions = {
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription' as const,
      successUrl: request.successUrl,
      cancelUrl: request.cancelUrl,
      customerEmail: request.customerEmail,
    };

    const { error } = await stripe.redirectToCheckout(checkoutOptions);

    if (error) {
      throw error;
    }

    // Retornar un objeto mock ya que redirectToCheckout no retorna session
    return {
      id: 'mock_session_id',
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