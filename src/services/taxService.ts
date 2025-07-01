// Tax rates by state (simplified - in production you'd want a more comprehensive tax service)
export interface TaxRate {
  state: string;
  rate: number;
  name: string;
}

export const stateTaxRates: TaxRate[] = [
  { state: 'Alabama', rate: 0.04, name: 'AL' },
  { state: 'Alaska', rate: 0.00, name: 'AK' },
  { state: 'Arizona', rate: 0.056, name: 'AZ' },
  { state: 'Arkansas', rate: 0.065, name: 'AR' },
  { state: 'California', rate: 0.0725, name: 'CA' },
  { state: 'Colorado', rate: 0.029, name: 'CO' },
  { state: 'Connecticut', rate: 0.0635, name: 'CT' },
  { state: 'Delaware', rate: 0.00, name: 'DE' },
  { state: 'Florida', rate: 0.06, name: 'FL' },
  { state: 'Georgia', rate: 0.04, name: 'GA' },
  { state: 'Hawaii', rate: 0.04, name: 'HI' },
  { state: 'Idaho', rate: 0.06, name: 'ID' },
  { state: 'Illinois', rate: 0.0625, name: 'IL' },
  { state: 'Indiana', rate: 0.07, name: 'IN' },
  { state: 'Iowa', rate: 0.06, name: 'IA' },
  { state: 'Kansas', rate: 0.065, name: 'KS' },
  { state: 'Kentucky', rate: 0.06, name: 'KY' },
  { state: 'Louisiana', rate: 0.0445, name: 'LA' },
  { state: 'Maine', rate: 0.055, name: 'ME' },
  { state: 'Maryland', rate: 0.06, name: 'MD' },
  { state: 'Massachusetts', rate: 0.0625, name: 'MA' },
  { state: 'Michigan', rate: 0.06, name: 'MI' },
  { state: 'Minnesota', rate: 0.06875, name: 'MN' },
  { state: 'Mississippi', rate: 0.07, name: 'MS' },
  { state: 'Missouri', rate: 0.04225, name: 'MO' },
  { state: 'Montana', rate: 0.00, name: 'MT' },
  { state: 'Nebraska', rate: 0.055, name: 'NE' },
  { state: 'Nevada', rate: 0.0685, name: 'NV' },
  { state: 'New Hampshire', rate: 0.00, name: 'NH' },
  { state: 'New Jersey', rate: 0.06625, name: 'NJ' },
  { state: 'New Mexico', rate: 0.05125, name: 'NM' },
  { state: 'New York', rate: 0.04, name: 'NY' },
  { state: 'North Carolina', rate: 0.0475, name: 'NC' },
  { state: 'North Dakota', rate: 0.05, name: 'ND' },
  { state: 'Ohio', rate: 0.0575, name: 'OH' },
  { state: 'Oklahoma', rate: 0.045, name: 'OK' },
  { state: 'Oregon', rate: 0.00, name: 'OR' },
  { state: 'Pennsylvania', rate: 0.06, name: 'PA' },
  { state: 'Rhode Island', rate: 0.07, name: 'RI' },
  { state: 'South Carolina', rate: 0.06, name: 'SC' },
  { state: 'South Dakota', rate: 0.045, name: 'SD' },
  { state: 'Tennessee', rate: 0.07, name: 'TN' },
  { state: 'Texas', rate: 0.0625, name: 'TX' },
  { state: 'Utah', rate: 0.061, name: 'UT' },
  { state: 'Vermont', rate: 0.06, name: 'VT' },
  { state: 'Virginia', rate: 0.053, name: 'VA' },
  { state: 'Washington', rate: 0.065, name: 'WA' },
  { state: 'West Virginia', rate: 0.06, name: 'WV' },
  { state: 'Wisconsin', rate: 0.05, name: 'WI' },
  { state: 'Wyoming', rate: 0.04, name: 'WY' },
];

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

export const calculateTax = (subtotal: number, state: string): number => {
  const taxRate = stateTaxRates.find(rate => rate.state === state);
  return taxRate ? subtotal * taxRate.rate : 0;
};

export const getTaxRate = (state: string): TaxRate | null => {
  return stateTaxRates.find(rate => rate.state === state) || null;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}; 