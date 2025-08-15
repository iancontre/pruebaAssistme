
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { fetchAllPlansWithStripe, PlanWithStripe, getJWTToken, api } from './apiService';
import { supportsScrollTimeline } from 'framer-motion';

// Variable para almacenar la clave en caché
let cachedStripeKey: string | null = null;

// Función para obtener la configuración de Stripe desde el endpoint externo
const getStripeConfig = async (): Promise<string> => {
  try {
    // Si ya tenemos la clave en caché, usarla
    if (cachedStripeKey) {
      return cachedStripeKey;
    }

    // Determinar la URL del endpoint según el entorno
    const isDevelopment = import.meta.env.DEV;
    const configUrl = isDevelopment ? '/config.json' : 'https://myassist-me.com/config.json';
    
    // Realizar la petición al endpoint externo
    const response = await fetch(configUrl);
    
    if (!response.ok) {
      throw new Error(`Error al obtener configuración: ${response.status}`);
    }

    const config = await response.json();
    
    if (!config.stripe_publishable_key) {
      throw new Error('La configuración no contiene la clave pública de Stripe');
    }

    // Almacenar en caché
    cachedStripeKey = config.stripe_publishable_key as string;
    return cachedStripeKey;
    
  } catch (error) {
    console.error('Error al obtener configuración de Stripe:', error);
    
    // Fallback a la clave del .env si falla la obtención desde el endpoint
    const fallbackKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (fallbackKey) {
      console.log('Usando clave de fallback desde .env');
      return fallbackKey;
    }
    
    throw new Error('No se pudo obtener la clave pública de Stripe');
  }
};

let stripePromise: Promise<Stripe | null>;

export const getStripe = async (): Promise<Stripe | null> => {
  try {
    const publishableKey = await getStripeConfig();
    
    if (!publishableKey) {
      throw new Error('Stripe publishable key is not configured');
    }
    
    if (!stripePromise) {
      stripePromise = loadStripe(publishableKey);
    }
    
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }
    
    return stripe;
  } catch (error) {
    console.error('Error loading Stripe:', error);
    throw new Error(`Failed to load Stripe.js: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Función para obtener los planes directamente desde la API (sin caché)
export const getPlansWithStripe = async (): Promise<PlanWithStripe[]> => {
  try {
    const plans = await fetchAllPlansWithStripe();
    return plans;
  } catch (error) {
    console.error('❌ Error fetching plans with Stripe data:', error);
    throw error;
  }
};

export interface CreateCheckoutSessionRequest {
  planId: string;
  planName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  // Información de dirección para Stripe Tax
  state: string;
  country: string;
  successUrl: string;
  cancelUrl: string;
}

// Función para crear checkout session con configuración básica
export const createCheckoutSession = async (request: CreateCheckoutSessionRequest): Promise<void> => {
  try {
    // 1. Cargar Stripe
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // 2. Obtener planes
    const plans = await getPlansWithStripe();
    
    // 3. Encontrar el plan seleccionado
    const selectedPlan = plans.find(plan => plan.id === request.planId);
    
    if (!selectedPlan || !selectedPlan.stripe_price_id) {
      throw new Error(`Price ID not found for plan: ${request.planName}`);
    }
    
    const priceId = selectedPlan.stripe_price_id;

    // 4. Redirigir a Stripe
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: request.successUrl,
      cancelUrl: request.cancelUrl,
      customerEmail: request.customerEmail,
      billingAddressCollection: 'required',
    });

    if (error) {
      console.error('❌ Error de Stripe:', error);
      throw error;
    }

    // La redirección debería ocurrir automáticamente
  } catch (error) {
    console.error('❌ ERROR en createCheckoutSession:', error);
    throw error;
  }
};

// Función para generar factura
export const generateInvoice = async (sessionId: string): Promise<any> => {
  try {
    console.log(' Generating invoice for session:', sessionId);
    
    // Aquí deberías llamar a tu backend para generar la factura
    // Por ahora, solo retornamos un mock
    return {
      success: true,
      message: 'Invoice generation initiated',
      sessionId
    };
  } catch (error) {
    console.error(' Error generating invoice:', error);
    throw error;
  }
}; 

// Función para obtener el price ID de un plan por nombre
export const getStripePriceId = async (planName: string): Promise<string | null> => {
  try {
    const plans = await getPlansWithStripe();
    const plan = plans.find((p: PlanWithStripe) => p.name.toUpperCase() === planName.toUpperCase());
    
    if (plan && plan.stripe_price_id) {
      return plan.stripe_price_id;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting Stripe price ID from API:', error);
    throw new Error(`Failed to get Stripe price ID for plan ${planName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 

// Función para redirigir al portal de facturación de Stripe
export const redirectToStripeBillingPortal = async (userId: string): Promise<void> => {
  try {
    // Obtener el JWT token
    const jwtToken = localStorage.getItem('jwt_token');
    if (!jwtToken) {
      throw new Error('Usuario no autenticado');
    }
    
    // Usar la misma configuración que apiService.ts
    const isDevelopment = import.meta.env.DEV;
    const API_BASE_URL = isDevelopment ? '' : 'https://myassist-me.com';
    
    // Llamar al endpoint del backend que crea la sesión del portal
    const response = await fetch(`${API_BASE_URL}/api/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const { url } = await response.json();
    
    if (!url) {
      throw new Error('No se recibió URL del portal de facturación');
    }

    window.location.href = url;
    
  } catch (error) {
    console.error('❌ Error al acceder al portal de facturación:', error);
    throw error;
  }
}; 