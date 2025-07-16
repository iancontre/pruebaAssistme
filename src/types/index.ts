// Tipos para el sistema de pagos
export interface CustomerData {
  name: string;
  email: string;
  state: string;
  phone_code?: string;
}

export interface TaxCalculation {
  amount: number;
  currency: string;
  country: string;
  state: string;
  postal_code: string;
  tax_amount: number;
  tax_rate: number;
  total_amount: number;
}

export interface PaymentRequest {
  planId: string;
  planName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
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

// Tipos para el wizard
export interface WizardStep {
  label: string;
  description: string;
}

export interface WizardState {
  currentStep: number;
  customerData: CustomerData | null;
  isProcessing: boolean;
  taxCalculation: TaxCalculation | null;
  loadingTax: boolean;
}

// Tipos para formularios
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ProfileFormData {
  name: string;
  email: string;
}

export interface BusinessFormData {
  state: string;
  phone_code?: string;
}

// Tipos para la API
export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Tipos para errores
export interface ErrorContext {
  component: string;
  action: string;
  additionalInfo?: Record<string, any>;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

// Tipos para componentes
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
} 