import { useState, useEffect, useCallback } from 'react';
import { fetchCountries, fetchAllStates, Country, State, createCancelToken } from '../services/apiService';

interface UseLocationDataReturn {
  countries: Country[];
  states: State[];
  loadingCountries: boolean;
  loadingStates: boolean;
  selectedCountry: Country | null;
  selectedState: State | null;
  loadStates: (countryId: string) => Promise<void>;
  clearStates: () => void;
  error: string | null;
}

export const useLocationData = (): UseLocationDataReturn => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargar países al montar el hook
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setError(null);
        setLoadingCountries(true);
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load countries';
        setError(errorMessage);
        console.error(' useLocationData: Error loading countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  // Cargar estados al montar el hook
  useEffect(() => {
    const loadStates = async () => {
      try {
        setError(null);
        setLoadingStates(true);
        
        // Crear cancel token para poder cancelar requests anteriores
        const cancelToken = createCancelToken();
        
        const statesData = await fetchAllStates(cancelToken);
        setStates(statesData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load states';
        setError(errorMessage);
        console.error('useLocationData: Error loading states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  // Función para cargar estados (mantenida para compatibilidad)
  const loadStates = useCallback(async (countryId: string) => {
    // Ya no necesitamos cargar estados por país, se cargan todos al inicio
    console.log(' useLocationData: loadStates called with countryId:', countryId);
    console.log(' useLocationData: States are already loaded, no action needed');
  }, []);

  // Función para limpiar estados
  const clearStates = useCallback(() => {
    setStates([]);
    setSelectedCountry(null);
    setSelectedState(null);
  }, []);

  return {
    countries,
    states,
    loadingCountries,
    loadingStates,
    selectedCountry,
    selectedState,
    loadStates,
    clearStates,
    error,
  };
}; 