import { loadStripe, Stripe } from '@stripe/stripe-js';
import { fetchAllPlansWithStripe, PlanWithStripe } from './apiService';

// Clave pública de Stripe desde variables de entorno
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Validar de la clave
if (!STRIPE_PUBLISHABLE_KEY) {
  throw new Error('VITE_STRIPE_PUBLISHABLE_KEY is not configured in environment variables');
}

let stripePromise: Promise<Stripe | null>;

export const getStripe = async (): Promise<Stripe | null> => {
  try {
    console.log('🔍 Loading Stripe with key:', STRIPE_PUBLISHABLE_KEY ? `${STRIPE_PUBLISHABLE_KEY.substring(0, 10)}...` : 'NOT SET');
    
    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Stripe publishable key is not configured');
    }
    
    if (!stripePromise) {
      console.log(' Creating new Stripe promise...');
      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }
    
    console.log('Stripe loaded successfully');
    return stripe;
  } catch (error) {
    console.error(' Error loading Stripe:', error);
    throw new Error(`Failed to load Stripe.js: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Función para obtener los planes directamente desde la API (sin caché)
export const getPlansWithStripe = async (): Promise<PlanWithStripe[]> => {
  try {
    console.log(' Fetching plans with Stripe data from API...');
    const plans = await fetchAllPlansWithStripe();
    
    console.log(' Plans with Stripe data fetched from API:', plans);
    return plans;
  } catch (error) {
    console.error(' Error fetching plans with Stripe data:', error);
    throw error;
  }
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





// Función para crear checkout session con configuración básica
export const createCheckoutSession = async (request: CreateCheckoutSessionRequest): Promise<CheckoutSession> => {
  try {
    console.log(' Creating checkout session for:', request);
    
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    console.log(' Stripe loaded successfully');

    // Obtener el price ID desde la API usando el planId
    const plans = await getPlansWithStripe();
    console.log(' All plans from API:', plans.map(p => ({ name: p.name, priceId: p.stripe_price_id })));
    
    const selectedPlan = plans.find(plan => plan.id === request.planId || plan.name.toUpperCase() === request.planName.toUpperCase());
    console.log(' Selected plan:', selectedPlan);
    
    if (!selectedPlan || !selectedPlan.stripe_price_id) {
      throw new Error(`Price ID not found for plan: ${request.planName} (${request.planId})`);
    }
    
    const priceId = selectedPlan.stripe_price_id;
    console.log(' Price ID found for plan:', request.planName, '->', priceId);

    // Los price IDs vienen de la API y ya están validados
    console.log(' Using price ID from API:', priceId);

    // Crear la seión de checkout usando el método correcto
    console.log(' Redirecting to Stripe checkout...');
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
      console.error(' Stripe redirect error:', error);
      
      // Manejar errores específicos de Stripe
      if (error.type === 'validation_error') {
        throw new Error(`Payment configuration error: ${error.message}`);
      } else if (error.type === 'card_error') {
        throw new Error(`Card error: ${error.message}`);
      } else if (error.type === 'invalid_request_error') {
        throw new Error(`Invalid request: ${error.message}`);
      } else {
        throw new Error(`Payment error: ${error.message}`);
      }
    }
    
    console.log(' Stripe redirect successful');

    // Retornar un objeto mock ya que redirectToCheckout no retorna session
    return {
      id: 'redirecting_to_stripe',
      url: 'redirecting_to_stripe'
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Proporcionar mensajes de error más específicos
    if (error instanceof Error) {
      if (error.message.includes('not active') || error.message.includes('not available')) {
        throw new Error('This plan is currently unavailable. Please contact support or try a different plan.');
      } else if (error.message.includes('Price ID not found')) {
        throw new Error('Plan configuration error. Please contact support.');
      } else {
        throw new Error(`Payment setup failed: ${error.message}`);
      }
    }
    
    throw new Error('An unexpected error occurred while setting up payment. Please try again.');
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

// Función para obtener el price ID de un plan por nombre
export const getStripePriceId = async (planName: string): Promise<string | null> => {
  try {
    const plans = await getPlansWithStripe();
    const plan = plans.find((p: PlanWithStripe) => p.name.toUpperCase() === planName.toUpperCase());
    
    if (plan && plan.stripe_price_id) {
      console.log(`✅ Found Stripe price ID for plan ${planName}:`, plan.stripe_price_id);
      return plan.stripe_price_id;
    }
    
    console.warn(` No Stripe price ID found for plan: ${planName}`);
    return null;
  } catch (error) {
    console.error('Error getting Stripe price ID from API:', error);
    throw new Error(`Failed to get Stripe price ID for plan ${planName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 