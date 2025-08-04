import React, { useState } from 'react';

import { useLocationData } from '../hooks/useLocationData';
import './LocationSelector.css';

interface LocationSelectorProps {
  onLocationChange?: (data: { country: string; state: string; countryId: string; stateId: string }) => void;
  showLabels?: boolean;
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onLocationChange, 
  showLabels = true,
  className = ''
}) => {
  const {
    countries,
    states,
    loadingCountries,
    loadingStates,
    selectedCountry,
    loadStates,
    clearStates,
    error
  } = useLocationData();

  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    setSelectedCountryName(countryName);
    setSelectedStateName(''); // Limpiar estado cuando cambia país

    if (countryName) {
      const country = countries.find(c => c.name === countryName);
      if (country) {
        loadStates(country.id);
      }
    } else {
      clearStates();
    }

    // Notificar cambio
    if (onLocationChange) {
      const country = countries.find(c => c.name === countryName);
      const state = states.find(s => s.name === selectedStateName);
      onLocationChange({
        country: countryName,
        state: selectedStateName,
        countryId: country?.id || '',
        stateId: state?.id || ''
      });
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    setSelectedStateName(stateName);

    // Notificar cambio
    if (onLocationChange) {
      const country = countries.find(c => c.name === selectedCountryName);
      const state = states.find(s => s.name === stateName);
      onLocationChange({
        country: selectedCountryName,
        state: stateName,
        countryId: country?.id || '',
        stateId: state?.id || ''
      });
    }
  };

  return (
    <div className={`location-selector ${className}`}>
      {error && (
        <div className="location-error">
          <span>⚠️ {error}</span>
        </div>
      )}
      
      <div className="location-row">
        <div className="location-field">
          {showLabels && <label htmlFor="country-select">Country</label>}
          <select
            id="country-select"
            value={selectedCountryName}
            onChange={handleCountryChange}
            disabled={loadingCountries}
            className={loadingCountries ? 'loading' : ''}
          >
            <option value="">
              {loadingCountries ? 'Loading countries...' : 'Select a country'}
            </option>
            {countries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="location-field">
          {showLabels && <label htmlFor="state-select">State/Province</label>}
          <select
            id="state-select"
            value={selectedStateName}
            onChange={handleStateChange}
            disabled={loadingStates || !selectedCountryName}
            className={loadingStates ? 'loading' : ''}
          >
            <option value="">
              {!selectedCountryName 
                ? 'Select a country first' 
                : loadingStates 
                  ? 'Loading states...' 
                  : 'Select a state/province'
              }
            </option>
            {states.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Información adicional */}
      {selectedCountry && (
        <div className="location-info">
          <small>
            📍 Selected: {selectedCountry.name} 
            {selectedCountry.phone_code && ` (+${selectedCountry.phone_code})`}
            {selectedStateName && ` - ${selectedStateName}`}
          </small>
        </div>
      )}
    </div>
  );
};

export default LocationSelector; 