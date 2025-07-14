// Tax Service - Importa funciones del API Service
import { calculateTaxWithAPI, TaxCalculation } from './apiService';

export interface TaxRate {
  state: string;
  rate: number;
  name: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  minutes: number;
  addMinuteRate: number;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    price: 79,
    minutes: 50,
    addMinuteRate: 1.89
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 279,
    minutes: 250,
    addMinuteRate: 1.35
  },
  {
    id: 'business',
    name: 'BUSINESS',
    price: 499,
    minutes: 1000,
    addMinuteRate: 1.25
  }
];

// Función de compatibilidad para mantener la interfaz existente
export const calculateTax = async (subtotal: number, state: string, postal_code: string = '33101'): Promise<number> => {
  try {
    const taxCalculation = await calculateTaxWithAPI(subtotal, 'US', state, postal_code);
    return taxCalculation.tax_amount;
  } catch (error) {
    console.error('Error calculating tax:', error);
    return 0;
  }
};

// Función de compatibilidad para obtener tax rate
export const getTaxRate = async (state: string, postal_code: string = '33101'): Promise<TaxRate | null> => {
  try {
    const taxCalculation = await calculateTaxWithAPI(100, 'US', state, postal_code); // Usar $100 como base
    return {
      state,
      rate: taxCalculation.tax_rate,
      name: state
    };
  } catch (error) {
    console.error('Error getting tax rate:', error);
    return null;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}; 