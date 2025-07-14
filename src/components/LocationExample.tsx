import React, { useState } from 'react';
import LocationSelector from './LocationSelector';
import './LocationExample.css';

const LocationExample: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    country: string;
    state: string;
    countryId: string;
    stateId: string;
  } | null>(null);

  const handleLocationChange = (data: {
    country: string;
    state: string;
    countryId: string;
    stateId: string;
  }) => {
    setSelectedLocation(data);
    console.log('📍 Location changed:', data);
  };

  return (
    <div className="location-example">
      <div className="example-header">
        <h2>🌍 Location Selector Example</h2>
        <p>Select a country to load its states/provinces dynamically</p>
      </div>

      <div className="example-content">
        <div className="selector-section">
          <h3>Location Selection</h3>
          <LocationSelector 
            onLocationChange={handleLocationChange}
            showLabels={true}
          />
        </div>

        <div className="info-section">
          <h3>Selected Information</h3>
          {selectedLocation ? (
            <div className="selected-info">
              <div className="info-item">
                <strong>Country:</strong> {selectedLocation.country}
                {selectedLocation.countryId && (
                  <span className="id"> (ID: {selectedLocation.countryId})</span>
                )}
              </div>
              <div className="info-item">
                <strong>State/Province:</strong> {selectedLocation.state || 'Not selected'}
                {selectedLocation.stateId && (
                  <span className="id"> (ID: {selectedLocation.stateId})</span>
                )}
              </div>
              <div className="info-item">
                <strong>Full Location:</strong> {selectedLocation.state ? `${selectedLocation.state}, ${selectedLocation.country}` : selectedLocation.country}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <span>No location selected yet</span>
            </div>
          )}
        </div>

        <div className="features-section">
          <h3>✨ Features</h3>
          <ul className="features-list">
            <li>✅ Dynamic loading of states based on country selection</li>
            <li>✅ Automatic token management with OAuth2</li>
            <li>✅ Retry logic for failed requests</li>
            <li>✅ Loading states and error handling</li>
            <li>✅ Responsive design</li>
            <li>✅ Dark mode support</li>
            <li>✅ Cancel tokens for request management</li>
            <li>✅ Structured logging</li>
          </ul>
        </div>

        <div className="api-info">
          <h3>🔗 API Endpoints Used</h3>
          <div className="endpoint-list">
            <div className="endpoint">
              <strong>Countries:</strong> <code>/db/countries-intelligent/countries</code>
            </div>
            <div className="endpoint">
              <strong>States:</strong> <code>/db/states-intelligent/by-country/{'{countryId}'}</code>
            </div>
            <div className="endpoint">
              <strong>OAuth:</strong> <code>/oauth/auth/token</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationExample; 