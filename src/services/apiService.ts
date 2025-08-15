import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError, CancelTokenSource } from 'axios';
import { 
  setJWTToken, 
  getJWTToken as getJWTTokenFromCookie, 
  removeJWTToken, 
  isAuthenticated as isAuthenticatedCookie,
  getUserInfoFromToken,
  setJWTRefreshToken
} from '../utils/cookieUtils';

// Configuración para desarrollo vs producción
// En desarrollo usar proxy de Vite para evitar CORS
// En producción usar directamente https://myassist-me.com
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment ? '' : 'https://myassist-me.com';

// Configuración de retry
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

// Logger estructurado
const logger = {
  info: (message: string, data?: any) => {
    console.log(`ℹ️ [API] ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`❌ [API] ${message}`, error || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ [API] ${message}`, data || '');
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// --- Token OAuth2 client_credentials ---
const TOKEN_KEY = 'assistme_token';
const TOKEN_EXPIRY_KEY = 'assistme_token_expiry';

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

// Función para guardar información del usuario en localStorage (solo para datos no sensibles)
const setUserInfo = (userInfo: any): void => {
  try {
    // Solo guardamos información no sensible
    const safeUserInfo = {
      id: userInfo.id,
      email: userInfo.email,
      full_name: userInfo.full_name,
      role: userInfo.role
    };
    localStorage.setItem('user_info', JSON.stringify(safeUserInfo));
  } catch (error) {
    logger.error('Error saving user info:', error);
  }
};

// Función de retry con delay exponencial
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      logger.warn(`Request failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(requestFn, retries - 1);
    }
    throw error;
  }
};

// Determinar si un error es retryable
const isRetryableError = (error: any): boolean => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    // Retry en errores de red, timeouts, y errores 5xx
    return !status || status >= 500 || status === 429;
  }
  return false;
};

export async function getClientCredentialsToken(): Promise<string | null> {
  try {
    // Si ya hay un token válido en localStorage, se usa
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (token && expiry && Date.now() < parseInt(expiry)) {
      logger.info('Using cached token');
      return token;
    }
    
    logger.info('Requesting new OAuth token');
    
    // Si no, solicita uno nuevo
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', 'frontend-app');
    params.append('client_secret', 'frontend-secret-key-2024-super-secure');
    
    const response = await retryRequest(() => 
      axios.post<AuthResponse>('/oauth/auth/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    );
    
    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in || 3600; 
    
    // Validar que el token existe
    if (!accessToken) {
      throw new Error('No access token received from OAuth server');
    }
    
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + expiresIn * 1000).toString());
    
    logger.info('New OAuth token obtained and cached');
    return accessToken;
  } catch (error) {
    logger.error('Failed to obtain OAuth token', error);
    throw new Error(`OAuth token request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Verificar el token real usando la API /oauth/auth/verify
export const verifyToken = async (token: string) => {
  try {
    const response = await api.post(
      '/oauth/auth/verify',
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    logger.error('Error verificando token:', error);
    return null;
  }
};

// Obtener token válido desde localStorage (después de login)
export const getValidToken = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  // Retornar el token directamente sin verificar (como funcionaba antes)
  return token;
};

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getClientCredentialsToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      logger.error('Failed to add token to request', error);
    }
    return config;
  },
  (error: AxiosError) => {
    logger.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para logging y manejo de errores
api.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.info(`Request successful: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    if (status === 401) {
      logger.warn('Unauthorized request - token may be expired', { url });
      // Limpiar token inválido
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    } else if (status === 403) {
      logger.error('Forbidden request', { url, status });
    } else if (status && status >= 500) {
      logger.error('Server error', { url, status });
    } else {
      logger.error('Request failed', { url, status, message: error.message });
    }
    
    return Promise.reject(error);
  }
);

// --- Servicio de países ---
export interface Country {
  id: string;
  name: string;
  iso_code: string;
  phone_code: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CountriesResponse {
  countries: Country[];
  total: number;
  message: string;
}

// --- Servicio de estados/provincias ---
export interface State {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

export interface StatesResponse {
  states: State[];
  total: number;
  message: string;
}

// --- Servicio de ciudades ---
export interface City {
  id: string;
  name: string;
  state_name?: string;
  country_name?: string;
  country_phone_code?: string;
  time_zone_name?: string;
  time_zone_offset?: string;
  postal_code?: string;
  active: boolean;
}

export interface CitiesResponse {
  cities: City[];
  total: number;
  message: string;
}

// --- Servicio de planes ---
export interface Plan {
  id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  duration?: string;
  features?: string[];
  included_minutes?: number;
  additional_minute_price?: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// --- Servicio de planes con Stripe ---
export interface PlanWithStripe extends Plan {
  stripe_price_id?: string;
  stripe_product_id?: string;
}

export interface PlansWithStripeResponse {
  plans: PlanWithStripe[];
  total: number;
  message: string;
}

export interface PlansResponse {
  plans: Plan[];
  total: number;
  message: string;
}

// Validar respuesta de países
const validateCountriesResponse = (data: any): CountriesResponse => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format');
  }
  
  if (!Array.isArray(data.countries)) {
    throw new Error('Countries array is missing or invalid');
  }
  
  if (typeof data.total !== 'number') {
    throw new Error('Total count is missing or invalid');
  }
  
  return data as CountriesResponse;
};

// Validar respuesta de estados
const validateStatesResponse = (data: any): StatesResponse => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format');
  }
  
  // Log detallado de la estructura de datos
  logger.info('Validating states response structure:', {
    hasData: !!data,
    dataType: typeof data,
    keys: Object.keys(data),
    hasStates: 'states' in data,
    hasDataField: 'data' in data,
    statesType: Array.isArray(data.states),
    dataFieldType: Array.isArray(data.data)
  });
  
  // Intentar diferentes estructuras posibles
  if (Array.isArray(data.states)) {
    logger.info('Found states array in data.states');
    return {
      states: data.states,
      total: data.total || data.states.length,
      message: data.message || 'States retrieved successfully'
    } as StatesResponse;
  }
  
  if (Array.isArray(data.data)) {
    logger.info('Found states array in data.data');
    return {
      states: data.data,
      total: data.total || data.data.length,
      message: data.message || 'States retrieved successfully'
    } as StatesResponse;
  }
  
  // Si no encontramos ninguna estructura válida, mostrar error detallado
  throw new Error(`States array is missing or invalid. Available keys: ${Object.keys(data).join(', ')}`);
};

// Validar respuesta de ciudades
const validateCitiesResponse = (data: any): CitiesResponse => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format');
  }
  
  // Manejar diferentes estructuras posibles
  let cities: City[] = [];
  let total: number = 0;
  
  // Caso 1: Estructura esperada { cities: [], total: number }
  if (Array.isArray(data.cities)) {
    cities = data.cities;
    total = data.total || cities.length;
  }
  // Caso 2: Estructura real del API { data: [], total: number, message: string }
  else if (Array.isArray(data.data)) {
    cities = data.data;
    total = data.total || cities.length;
    logger.info('Found cities in data property', { cities });
  }
  // Caso 3: La respuesta es directamente un array de ciudades
  else if (Array.isArray(data)) {
    cities = data;
    total = data.length;
  }
  // Caso 4: Buscar otras propiedades que puedan contener las ciudades
  else {
    // Buscar cualquier propiedad que sea un array
    const arrayProperties = Object.keys(data).filter(key => Array.isArray(data[key]));
    if (arrayProperties.length > 0) {
      // Usar el primer array encontrado
      cities = data[arrayProperties[0]];
      total = cities.length;
      logger.info(`Found cities in property: ${arrayProperties[0]}`, { cities });
    } else {
      throw new Error(`Cities array not found. Available properties: ${Object.keys(data).join(', ')}`);
    }
  }
  
  // Validar que las ciudades tengan la estructura correcta
  const validCities = cities.filter(city => 
    city && typeof city === 'object' && 
    typeof city.id === 'string' && 
    typeof city.name === 'string'
  );
  
  if (validCities.length === 0) {
    logger.warn('No valid cities found in response');
    return { cities: [], total: 0, message: 'No cities available' };
  }
  
  return {
    cities: validCities,
    total: total,
    message: data.message || 'Cities loaded successfully'
  };
};

// Validar respuesta de planes
const validatePlansResponse = (data: any): PlansResponse => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format');
  }

  // Manejar diferentes estructuras posibles
  let plans: Plan[] = [];
  let total: number = 0;
  
  // Caso 1: Estructura esperada { plans: [], total: number }
  if (Array.isArray(data.plans)) {
    plans = data.plans;
    total = data.total || plans.length;
  }
  // Caso 2: Estructura real del API { data: [], total: number, message: string }
  else if (Array.isArray(data.data)) {
    plans = data.data;
    total = data.total || plans.length;
    logger.info('Found plans in data property', { plans });
  }
  // Caso 3: La respuesta es directamente un array de planes
  else if (Array.isArray(data)) {
    plans = data;
    total = data.length;
  }
  // Caso 4: Buscar otras propiedades que puedan contener los planes
  else {
    // Buscar cualquier propiedad que sea un array
    const arrayProperties = Object.keys(data).filter(key => Array.isArray(data[key]));
    if (arrayProperties.length > 0) {
      // Usar el primer array encontrado
      plans = data[arrayProperties[0]];
      total = plans.length;
      logger.info(`Found plans in property: ${arrayProperties[0]}`, { plans });
    } else {
      throw new Error(`Plans array not found. Available properties: ${Object.keys(data).join(', ')}`);
    }
  }
  
  // Validar que los planes tengan la estructura correcta
  const validPlans = plans.filter(plan => 
    plan && typeof plan === 'object' && 
    typeof plan.id === 'string' && 
    typeof plan.name === 'string'
  );
  
  if (validPlans.length === 0) {
    logger.warn('No valid plans found in response');
    return { plans: [], total: 0, message: 'No plans available' };
  }

  return {
    plans: validPlans,
    total: total,
    message: data.message || 'Plans loaded successfully'
  };
};







export async function fetchCountries(cancelToken?: CancelTokenSource): Promise<Country[]> {
  try {
    logger.info('Fetching countries');
    
    const token = await getClientCredentialsToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }
    
    const response = await retryRequest(() => 
      api.get<CountriesResponse>('/db/countries-intelligent/countries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cancelToken: cancelToken?.token,
      })
    );
    
    // Validar la respuesta
    const validatedData = validateCountriesResponse(response.data);
    
    // Retornar solo los países activos
    const activeCountries = validatedData.countries.filter(country => country.active);
    
    logger.info(`Successfully fetched ${activeCountries.length} active countries out of ${validatedData.total} total`);
    
    // Log de los primeros 5 países para debugging
    if (activeCountries.length > 0) {
      logger.info('Sample countries loaded:', activeCountries.slice(0, 5).map(c => ({
        id: c.id,
        name: c.name,
        iso_code: c.iso_code,
        phone_code: c.phone_code
      })));
    }
    
    return activeCountries;
  } catch (error) {
    if (axios.isCancel(error)) {
      logger.info('Countries request was cancelled');
      return [];
    }
    
    logger.error('Error fetching countries:', error);
    throw new Error(`Failed to fetch countries: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchAllStates(
  cancelToken?: CancelTokenSource
): Promise<State[]> {
  try {
    logger.info('Fetching all states');
    
    const token = await getClientCredentialsToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }
    
    const url = '/db/states-intelligent/by-country/1';
    logger.info(`Making request to: ${url}`);
    logger.info(`Full URL will be: ${API_BASE_URL}${url}`);
    
    const response = await retryRequest(() => 
      api.get<StatesResponse>(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cancelToken: cancelToken?.token,
      })
    );
    
    // Log de la respuesta para debugging
    logger.info('Raw response from states endpoint:', response.data);
    
    // Validar la respuesta
    const validatedData = validateStatesResponse(response.data);
    
    // Retornar solo los estados activos
    const activeStates = validatedData.states.filter((state: State) => state.active);
    
    logger.info(`Successfully fetched ${activeStates.length} active states out of ${validatedData.total} total`);
    return activeStates;
  } catch (error) {
    if (axios.isCancel(error)) {
      logger.info('States request was cancelled');
      return [];
    }
    
    // Log detallado del error
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      const url = error.config?.url;
      
      logger.error(`HTTP Error ${status} fetching all states:`, {
        url,
        status,
        data,
        message: error.message
      });
      // prueba
      
      // Si es un 404, el endpoint no existe
      if (status === 404) {
        logger.warn(`States endpoint not found. This endpoint might not be implemented yet.`);
        return [];
      }
    }
    
    logger.error(`Error fetching all states:`, error);
    throw new Error(`Failed to fetch states: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchAllCities(
  cancelToken?: CancelTokenSource
): Promise<City[]> {
  try {
    logger.info('Fetching all cities');
    
    const token = await getClientCredentialsToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }
    
    const url = '/db/cities-intelligent/list-all-cities';
    logger.info(`Making request to: ${url}`);
    logger.info(`Full URL will be: ${API_BASE_URL}${url}`);
    
    const response = await retryRequest(() => 
      api.get<CitiesResponse>(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cancelToken: cancelToken?.token,
      })
    );
    
    // Log detallado de la respuesta para debugging
    logger.info('Cities API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      dataKeys: response.data ? Object.keys(response.data) : 'No data',
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      hasCities: response.data && 'cities' in response.data,
      citiesType: response.data && response.data.cities ? typeof response.data.cities : 'No cities property',
      citiesIsArray: response.data && response.data.cities ? Array.isArray(response.data.cities) : 'No cities property'
    });
    
    // Validar la respuesta
    const validatedData = validateCitiesResponse(response.data);
    
    // Retornar solo las ciudades activas
    const activeCities = validatedData.cities.filter((city: City) => city.active);
    
    logger.info(`Successfully fetched ${activeCities.length} active cities out of ${validatedData.total} total`);
    return activeCities;
  } catch (error) {
    if (axios.isCancel(error)) {
      logger.info('Cities request was cancelled');
      return [];
    }
    
    // Log detallado del error
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      const url = error.config?.url;
      
      logger.error(`HTTP Error ${status} fetching all cities:`, {
        url,
        status,
        data,
        message: error.message
      });
      
      // Si es un 404, el endpoint no existe
      if (status === 404) {
        logger.warn(`Cities endpoint not found. This endpoint might not be implemented yet.`);
        return [];
      }
    }
    
    logger.error(`Error fetching all cities:`, error);
    throw new Error(`Failed to fetch cities: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchAllPlans(
  cancelToken?: CancelTokenSource
): Promise<Plan[]> {
  try {
    logger.info('Fetching all plans');
    
    const token = await getClientCredentialsToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }
    
    const url = '/db/plans';
    logger.info(`Making request to: ${url}`);
    logger.info(`Full URL will be: ${API_BASE_URL}${url}`);
    
    const response = await retryRequest(() => 
      api.get<PlansResponse>(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cancelToken: cancelToken?.token,
      })
    );
    
    // Log detallado de la respuesta para debugging
    logger.info('Plans API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      dataKeys: response.data ? Object.keys(response.data) : 'No data',
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      hasPlans: response.data && 'plans' in response.data,
      plansType: response.data && response.data.plans ? typeof response.data.plans : 'No plans property',
      plansIsArray: response.data && response.data.plans ? Array.isArray(response.data.plans) : 'No plans property'
    });
    
    // Validar la respuesta
    const validatedData = validatePlansResponse(response.data);
    
    // Retornar solo los planes activos
    const activePlans = validatedData.plans.filter((plan: Plan) => plan.active);
    
    logger.info(`Successfully fetched ${activePlans.length} active plans out of ${validatedData.total} total`);
    return activePlans;
  } catch (error) {
    if (axios.isCancel(error)) {
      logger.info('Plans request was cancelled');
      return [];
    }
    
    // Log detallado del error
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      const url = error.config?.url;
      
      logger.error(`HTTP Error ${status} fetching all plans:`, {
        url,
        status,
        data,
        message: error.message
      });
      
      // Si es un 404, el endpoint no existe
      if (status === 404) {
        logger.warn(`Plans endpoint not found. This endpoint might not be implemented yet.`);
        throw new Error('Plans endpoint not available');
      }
    }
    
    logger.error(`Error fetching all plans:`, error);
    throw new Error(`Failed to fetch plans: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchAllPlansWithStripe(
  cancelToken?: CancelTokenSource
): Promise<PlanWithStripe[]> {
  try {
    logger.info('Fetching all plans with Stripe data');
    
    const token = await getClientCredentialsToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }
    
    const url = '/db/plans';
    logger.info(`Making request to: ${url}`);
    
    const response = await retryRequest(() => 
      api.get<any>(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cancelToken: cancelToken?.token,
      })
    );
    
    logger.info('Raw API response:', response.data);
    
    // Tu API devuelve { data: [...], total: X, message: "..." }
    const plansData = response.data.data || response.data.plans || response.data;
    
    if (!Array.isArray(plansData)) {
      throw new Error('Invalid response format: plans data is not an array');
    }
    
    logger.info(`Processing ${plansData.length} plans from API response`);
    
    // Convertir los datos al formato esperado
    const plans: PlanWithStripe[] = plansData.map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: parseFloat(plan.price) || 0,
      currency: plan.currency?.code || 'USD',
      duration: 'monthly',
      features: plan.features || [],
      included_minutes: plan.included_minutes || 0,
      additional_minute_price: parseFloat(plan.additional_minute_price) || 0,
      active: plan.active !== false,
      stripe_price_id: plan.stripe_price_id,
      stripe_product_id: plan.stripe_product_id,
      created_at: plan.createdAt,
      updated_at: plan.updatedAt
    }));
    
    // Retornar solo los planes activos
    const activePlans = plans.filter((plan: PlanWithStripe) => plan.active);
    
    logger.info(`Successfully processed ${activePlans.length} active plans`);
    logger.info('Processed plans:', activePlans.map(p => ({ name: p.name, priceId: p.stripe_price_id })));
    
    return activePlans;
  } catch (error) {
    logger.error(`Error fetching all plans with Stripe:`, error);
    throw new Error(`Failed to fetch plans with Stripe: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Función helper para crear cancel tokens
export const createCancelToken = (): CancelTokenSource => {
  return axios.CancelToken.source();
};

// --- Servicio de Tax API ---
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

// --- Tipos para planes de precios ---
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  included_minutes: number;
  additional_minute_price: number;
  stripe_price_id?: string;
  // Propiedades adicionales para compatibilidad
  minutes?: number;
  addMinuteRate?: number;
}

// --- Función de formateo de moneda ---
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export async function calculateTaxWithAPI(
  amount: number,
  country: string = 'US',
  state: string,
  postal_code: string = '33101'
): Promise<TaxCalculation> {
  try {
    logger.info('Calculating tax with API', { amount, country, state, postal_code });
    
    const url = `/db/automatic-tax/preview?amount=${amount}&currency=usd&country=${country}&state=${state}&postal_code=${postal_code}`;
    
    const response = await retryRequest(() => 
      api.get(url)
    );
    
    const data = response.data;
    
    logger.info('Tax calculation successful', data);
    
    return {
      amount: data.amount || amount,
      currency: data.currency || 'usd',
      country: data.country || country,
      state: data.state || state,
      postal_code: data.postal_code || postal_code,
      tax_amount: data.tax_amount || 0,
      tax_rate: data.tax_rate || 0,
      total_amount: data.total_amount || amount
    };
  } catch (error) {
    logger.error('Error calculating tax with API', error);
    // Fallback: retornar cálculo básico sin tax
    return {
      amount,
      currency: 'usd',
      country,
      state,
      postal_code,
      tax_amount: 0,
      tax_rate: 0,
      total_amount: amount
    };
  }
}

// --- Suscripciones Stripe ---
export interface SubscriptionPayload {
  session_id: string;
  [key: string]: any;
}

export async function createSubscriptionFromSession(data: SubscriptionPayload) {
  const response = await api.post('/db/stripe/create-subscription-from-session', data);
  return response.data;
}

export async function fetchActiveRole() {
  try {
    const token = await getValidToken();
    const response = await api.get('/db/roles/active', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.role_id;
  } catch (error) {
    logger.error('Error fetching active role:', error);
    throw error;
  }
}

// --- JWT Login ---
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  message: string;
  token?: string;
  access_token?: string;
  accessToken?: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  };
  error?: string;
}

export async function loginWithJWT(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    logger.info('Attempting JWT login');
    
    const response = await api.post<LoginResponse>('/oauth/auth/user/login', credentials);
    
    // Log detallado de la respuesta para debugging
    logger.info('Backend response:', response.data);
    
    // Verificar diferentes estructuras de respuesta posibles
    const responseData = response.data;
    
    // Caso 1: Estructura esperada con success y token
    if (responseData.success && responseData.token) {
      setJWTToken(responseData.token);
      // Solo establecer refresh token si existe
      if ('refresh_token' in responseData && responseData.refresh_token && typeof responseData.refresh_token === 'string') {
        setJWTRefreshToken(responseData.refresh_token);
      }
      
      if (responseData.user) {
        setUserInfo(responseData.user);
      }
      
      logger.info('JWT login successful');
      return responseData;
    }
    
    // Caso 2: Si el mensaje indica éxito pero no hay success flag
    if (responseData.message && responseData.message.toLowerCase().includes('successful')) {
      // Buscar token en diferentes propiedades posibles
      const token = responseData.token || responseData.access_token || responseData.accessToken;
      
      if (token) {
        setJWTToken(token);
        // Solo establecer refresh token si existe
        if ('refresh_token' in responseData && responseData.refresh_token && typeof responseData.refresh_token === 'string') {
          setJWTRefreshToken(responseData.refresh_token);
        }
        
        if (responseData.user) {
          setUserInfo(responseData.user);
        }
        
        logger.info('JWT login successful (alternative structure)');
        return {
          success: true,
          message: responseData.message,
          token: token,
          user: responseData.user
        };
      }
    }
    
    // Caso 3: Si hay token pero no success flag
    const token = responseData.token || responseData.access_token || responseData.accessToken;
    if (token) {
      setJWTToken(token);
      // Solo establecer refresh token si existe
      if ('refresh_token' in responseData && responseData.refresh_token && typeof responseData.refresh_token === 'string') {
        setJWTRefreshToken(responseData.refresh_token);
      }
      
      if (responseData.user) {
        setUserInfo(responseData.user);
      }
      
      logger.info('JWT login successful (token found)');
      return {
        success: true,
        message: responseData.message || 'Login successful',
        token: token,
        user: responseData.user
      };
    }
    
    // Si no se encontró token, considerar como error
    logger.error('JWT login failed: No token found in response');
    return {
      success: false,
      message: responseData.message || 'Login failed - no token received',
      error: 'No token found'
    };
    
  } catch (error) {
    logger.error('JWT login error:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      };
    }
    
    return {
      success: false,
      message: 'Network error occurred',
      error: 'Network error'
    };
  }
}

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return isAuthenticatedCookie();
};

// Función para obtener el token JWT
export const getJWTToken = (): string | null => {
  return getJWTTokenFromCookie();
};

// Función para cerrar sesión
export const logout = (): void => {
  removeJWTToken();
  // Limpiar información del usuario del localStorage
  localStorage.removeItem('user_info');
};

// Función para obtener información del usuario
export const getUserInfo = () => {
  // Primero intentar obtener del token JWT
  const userFromToken = getUserInfoFromToken();
  if (userFromToken) {
    return userFromToken;
  }
  
  // Fallback: obtener del localStorage
  try {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    logger.error('Error getting user info from localStorage:', error);
    return null;
  }
};

// Interfaces para los datos de llamadas
export interface CallData {
  date: string;
  calls: number;
  minutes: number;
  average_duration: number;
}

export interface CallSummaryResponse {
  chart_data: CallData[];
  total_calls?: number;
  total_minutes?: number;
  average_duration?: number;
}

// Función para obtener el resumen de llamadas
export async function fetchCallSummary(
  userId: string,
  startDate: string,
  endDate: string
): Promise<CallSummaryResponse> {
  try {
    // Usar el token JWT del usuario en lugar del token de client_credentials
    const jwtToken = getJWTToken();
    if (!jwtToken) {
      throw new Error('No JWT token available. Please log in again.');
    }

    // Verificar si el token JWT es válido
    if (!isAuthenticated()) {
      throw new Error('JWT token has expired. Please log in again.');
    }

    const response = await retryRequest(() =>
      api.get<CallSummaryResponse>(`/db/call-usage/summary/${userId}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          startDate,
          endDate
        }
      })
    );

    logger.info('Call summary fetched successfully');
    return response.data;
  } catch (error) {
    logger.error('Error fetching call summary:', error);
    throw error;
  }
}

// Interfaces para los datos de llamadas por cliente
export interface ClientCallData {
  cliente_numeroid: string;
  cliente_nombre: string;
  llamadas_del_dia: number;
  minutos_totales_dia: number;
  duracion_promedio_minutos: number;
  primera_llamada_dia: string;
  ultima_llamada_dia: string;
  fecha?: string; // Agregado para compatibilidad con el componente
}

export interface DailySummary {
  fecha: string;
  total_clientes_unicos: number;
  total_llamadas_dia: number;
  minutos_totales_dia: number;
  clientes: ClientCallData[];
}

export interface ClientCallResponse {
  periodo: {
    fecha_inicio: string;
    fecha_fin: string;
  };
  resumen_diario: DailySummary[];
}

// Función para obtener datos de clientes por día
export async function fetchClientCallsByDay(
  userId: string,
  startDate: string,
  endDate: string
): Promise<ClientCallResponse> {
  try {
    // Usar el mismo token OAuth que funciona en otras APIs
    const token = await getClientCredentialsToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }

    // Verificar que los parámetros sean válidos
    if (!userId) {
      throw new Error('Missing required parameter: userId');
    }

    logger.info(`Fetching client calls for user ${userId}`);
    logger.info(`Using OAuth token: ${token ? 'Token present' : 'No token'}`);

    // PRIMERO: Obtener la suscripción del usuario para obtener el paymentId correcto
    logger.info(`Getting user subscription to extract paymentId...`);
    const subscriptionResponse = await retryRequest(() =>
      api.get(`/db/subscriptions/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      })
    );

    // Extraer el paymentId del primer pago activo
    const subscription = subscriptionResponse.data;
    const activePayment = subscription.payments?.find((p: any) => p.status === 'completed');
    
    if (!activePayment) {
      throw new Error('No active payment found for this user');
    }

    const paymentId = activePayment.id;
    logger.info(`Found paymentId: ${paymentId}`);
    logger.info(`Request URL: /db/call-usage/clients/by-day`);
    logger.info(`Request params:`, { paymentId, userId });

    // SEGUNDO: Usar el paymentId correcto en la API de llamadas
    const response = await retryRequest(() =>
      api.get<ClientCallResponse>(`/db/call-usage/clients/by-day`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          paymentId: paymentId, // ✅ El paymentId real de la suscripción
          userId
        },
        timeout: 15000,
      })
    );

    logger.info('Client calls by day fetched successfully');
    return response.data;
  } catch (error) {
    logger.error('Error fetching client calls by day:', error);
    
    // Manejo específico de errores con más detalles
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      logger.error(`HTTP Status: ${status}`);
      logger.error(`Response Data:`, data);
      logger.error(`Request URL: ${error.config?.url}`);
      logger.error(`Request Method: ${error.config?.method}`);
      
      if (status === 500) {
        logger.error('Backend error (500) - Server internal error');
        logger.error('This usually means:');
        logger.error('- Database connection issue');
        logger.error('- Invalid SQL query');
        logger.error('- Server configuration problem');
        throw new Error(`Backend service error (500): ${data?.message || 'Internal server error'}`);
      } else if (status === 401) {
        logger.error('Authentication error (401) - Token expired or invalid');
        throw new Error('Authentication failed. Please log in again.');
      } else if (status === 404) {
        logger.error('Endpoint not found (404)');
        throw new Error('Service endpoint not found. Please contact support.');
      } else if (status === 400) {
        logger.error('Bad request (400) - Invalid parameters');
        throw new Error(`Bad request: ${data?.message || 'Invalid parameters'}`);
      }
    }
    
    throw error;
  }
}

// Interfaces para las llamadas
export interface CallRecord {
  cliente_nombre: string;
  duracion_segundos: number;
  duracion_minutos: number;
  fecha_llamada: string;
  tipificacion: string;
  tipificacion_nivel1: string;
  tipificacion_nivel2: string;
  tipificacion_nivel3: string;
  observaciones: string;
  prioridad: string;
  es_transferencia: boolean;
  agente: string;
  telefono_cliente: string;
  email_cliente: string;
  fecha_actualizacion: string;
}

export interface CallRecordsResponse {
  calls: CallRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Función para obtener las llamadas con paginación
export const fetchCallRecords = async (
  userId: string, 
  startDate: string, 
  endDate: string, 
  page: number = 1, 
  limit: number = 50
): Promise<CallRecordsResponse> => {
  try {
    console.log('Fetching call records with params:', { userId, startDate, endDate, page, limit });
    
    // Usar el token JWT del usuario en lugar del token de client_credentials
    const jwtToken = getJWTToken();
    if (!jwtToken) {
      throw new Error('No JWT token available. Please log in again.');
    }

    // Verificar si el token JWT es válido
    if (!isAuthenticated()) {
      throw new Error('JWT token has expired. Please log in again.');
    }

    const response = await retryRequest(() =>
      api.get<CallRecordsResponse>(`/db/call-usage/calls/${userId}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          startDate,
          endDate,
          page,
          limit
        }
      })
    );

    console.log('Call records response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching call records:', error);
    throw error;
  }
};

export default api; 

// Función para obtener el stripe_customer_id del usuario
export async function getUserStripeCustomerId(userId: string): Promise<string> {
  try {
    logger.info('Fetching user stripe customer ID for user:', userId);
    
    const jwtToken = getJWTToken();
    if (!jwtToken) {
      throw new Error('No JWT token available. Please log in again.');
    }
    
    // Intentar primero con el endpoint de suscripciones
    try {
      const response = await api.get(`/db/subscriptions/user/${userId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      
      logger.info('User subscription data received:', response.data);
      console.log('🔍 Respuesta completa del endpoint:', response.data);
      
      // Buscar el stripe_customer_id en diferentes campos posibles
      let stripeCustomerId = null;
      
      // Opción 1: Buscar en el nivel raíz
      if (response.data.stripe_customer_id) {
        stripeCustomerId = response.data.stripe_customer_id;
        console.log('✅ Encontrado en stripe_customer_id:', stripeCustomerId);
      }
      // Opción 2: Buscar en customer_id
      else if (response.data.customer_id) {
        stripeCustomerId = response.data.customer_id;
        console.log('✅ Encontrado en customer_id:', stripeCustomerId);
      }
      // Opción 3: Buscar en stripe.customer_id
      else if (response.data.stripe && response.data.stripe.customer_id) {
        stripeCustomerId = response.data.stripe.customer_id;
        console.log('✅ Encontrado en stripe.customer_id:', stripeCustomerId);
      }
      // Opción 4: Buscar en subscription.stripe_customer_id
      else if (response.data.subscription && response.data.subscription.stripe_customer_id) {
        stripeCustomerId = response.data.subscription.stripe_customer_id;
        console.log('✅ Encontrado en subscription.stripe_customer_id:', stripeCustomerId);
      }
      // Opción 5: Buscar en cualquier campo que contenga "customer"
      else {
        const customerFields = Object.keys(response.data).filter(key => 
          key.toLowerCase().includes('customer') || 
          key.toLowerCase().includes('stripe')
        );
        
        console.log('🔍 Campos que podrían contener customer ID:', customerFields);
        
        for (const field of customerFields) {
          if (response.data[field] && typeof response.data[field] === 'string' && 
              response.data[field].startsWith('cus_')) {
            stripeCustomerId = response.data[field];
            console.log(`✅ Encontrado en ${field}:`, stripeCustomerId);
            break;
          }
        }
      }
      
      if (stripeCustomerId) {
        logger.info('Stripe customer ID found:', stripeCustomerId);
        return stripeCustomerId;
      }
      
    } catch (error) {
      console.log('⚠️ Endpoint de suscripciones falló, intentando métodos alternativos...');
    }
    
    // Si no se encontró, usar el fallback
    try {
      console.log('🔄 Intentando métodos alternativos...');
      return await getStripeCustomerIdFallback(userId);
    } catch (error) {
      console.log('⚠️ Métodos alternativos fallaron, intentando búsqueda exhaustiva...');
    }
    
    // Último recurso: búsqueda exhaustiva
    console.log('🔄 Iniciando búsqueda exhaustiva...');
    return await findStripeCustomerIdExhaustive(userId);
    
  } catch (error) {
    logger.error('Error fetching user stripe customer ID:', error);
    throw error;
  }
} 

// Función de respaldo para buscar el customer ID en otros endpoints
export async function getStripeCustomerIdFallback(userId: string): Promise<string> {
  try {
    logger.info('Trying fallback methods to get stripe customer ID for user:', userId);
    
    const jwtToken = getJWTToken();
    if (!jwtToken) {
      throw new Error('No JWT token available. Please log in again.');
    }
    
    // Intentar diferentes endpoints que podrían tener el customer ID
    
    // Opción 1: Endpoint de usuario
    try {
      const userResponse = await api.get(`/db/user/${userId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      
      if (userResponse.data.stripe_customer_id) {
        console.log('✅ Encontrado en /db/user/:', userResponse.data.stripe_customer_id);
        return userResponse.data.stripe_customer_id;
      }
    } catch (error) {
      console.log('⚠️ Endpoint /db/user/ no disponible');
    }
    
    // Opción 2: Endpoint de perfil
    try {
      const profileResponse = await api.get(`/db/profile/${userId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      
      if (profileResponse.data.stripe_customer_id) {
        console.log('✅ Encontrado en /db/profile/:', profileResponse.data.stripe_customer_id);
        return profileResponse.data.stripe_customer_id;
      }
    } catch (error) {
      console.log('⚠️ Endpoint /db/profile/ no disponible');
    }
    
    // Opción 3: Endpoint de customer
    try {
      const customerResponse = await api.get(`/db/customer/${userId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      
      if (customerResponse.data.stripe_customer_id) {
        console.log('✅ Encontrado en /db/customer/:', customerResponse.data.stripe_customer_id);
        return customerResponse.data.stripe_customer_id;
      }
    } catch (error) {
      console.log('⚠️ Endpoint /db/customer/ no disponible');
    }
    
    throw new Error('No se pudo encontrar el stripe_customer_id en ningún endpoint');
    
  } catch (error) {
    logger.error('Error in fallback methods:', error);
    throw error;
  }
} 

// Función para búsqueda exhaustiva del customer ID
export async function findStripeCustomerIdExhaustive(userId: string): Promise<string> {
  try {
    logger.info('Starting exhaustive search for stripe customer ID for user:', userId);
    
    const jwtToken = getJWTToken();
    if (!jwtToken) {
      throw new Error('No JWT token available. Please log in again.');
    }
    
    const headers = { Authorization: `Bearer ${jwtToken}` };
    
    // Lista de endpoints a probar
    const endpointsToTry = [
      `/db/subscriptions/user/${userId}`,
      `/db/user/${userId}`,
      `/db/profile/${userId}`,
      `/db/customer/${userId}`,
      `/db/stripe/customer/${userId}`,
      `/db/billing/user/${userId}`,
      `/db/account/${userId}`,
      `/db/user/${userId}/subscription`,
      `/db/user/${userId}/billing`,
      `/db/user/${userId}/stripe`
    ];
    
    console.log('🔍 Probando endpoints:', endpointsToTry);
    
    for (const endpoint of endpointsToTry) {
      try {
        console.log(`🔄 Probando endpoint: ${endpoint}`);
        
        const response = await api.get(endpoint, { headers });
        
        if (response.data) {
          console.log(`📋 Respuesta de ${endpoint}:`, response.data);
          
          // Buscar customer ID en la respuesta
          const customerId = findCustomerIdInResponse(response.data);
          
          if (customerId) {
            console.log(`✅ Customer ID encontrado en ${endpoint}:`, customerId);
            return customerId;
          }
        }
        
      } catch (error) {
        console.log(`⚠️ Endpoint ${endpoint} no disponible o falló`);
      }
    }
    
    throw new Error('No se pudo encontrar el stripe_customer_id en ningún endpoint');
    
  } catch (error) {
    logger.error('Error in exhaustive search:', error);
    throw error;
  }
}

// Función auxiliar para buscar customer ID en cualquier respuesta
function findCustomerIdInResponse(data: any): string | null {
  // Buscar en campos comunes
  const commonFields = [
    'stripe_customer_id',
    'customer_id', 
    'stripe_customer',
    'stripe_customerId',
    'stripeCustomerId',
    'stripeCustomer'
  ];
  
  for (const field of commonFields) {
    if (data[field] && typeof data[field] === 'string' && data[field].startsWith('cus_')) {
      return data[field];
    }
  }
  
  // Buscar en objetos anidados
  if (data.stripe && data.stripe.customer_id) {
    return data.stripe.customer_id;
  }
  
  if (data.subscription && data.subscription.stripe_customer_id) {
    return data.subscription.stripe_customer_id;
  }
  
  if (data.billing && data.billing.stripe_customer_id) {
    return data.billing.stripe_customer_id;
  }
  
  // Buscar recursivamente en objetos
  for (const key in data) {
    if (typeof data[key] === 'object' && data[key] !== null) {
      const found = findCustomerIdInResponse(data[key]);
      if (found) return found;
    }
  }
  
  return null;
} 