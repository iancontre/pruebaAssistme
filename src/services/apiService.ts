import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError, CancelTokenSource } from 'axios';

// Configuración para desarrollo vs producción
const isDevelopment = import.meta.env.DEV;

// En desarrollo usamos rutas relativas para que funcione el proxy de Vite
// En producción usamos la URL completa
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

const api = axios.create({
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
    const expiresIn = response.data.expires_in || 3600; // segundos
    
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
    const response = await axios.post(
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
  // Verificar el token usando la API real
  const result = await verifyToken(token);
  if (result && result.valid) {
    return token;
  } else {
    // Token inválido
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
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
    total: validCities.length,
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
    total: validPlans.length,
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
        return [];
      }
    }
    
    logger.error(`Error fetching all plans:`, error);
    throw new Error(`Failed to fetch plans: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

export default api; 