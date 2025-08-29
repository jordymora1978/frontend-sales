import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import geolocationService from '../../services/geolocationService';

const InternationalPhoneInput = ({ value, onChange, error }) => {
  const [country, setCountry] = useState('CO');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-detect country on mount
    const detectLocation = async () => {
      try {
        const location = await geolocationService.detectCountry();
        if (location?.countryCode) {
          setCountry(location.countryCode);
        }
      } catch (error) {
        console.warn('Could not detect country:', error);
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  const handlePhoneChange = (phoneNumber) => {
    onChange({
      target: {
        name: 'phone',
        value: phoneNumber || ''
      }
    });
  };

  return (
    <div className="phone-input-container">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Teléfono {loading && <span className="text-gray-400 text-xs">(detectando país...)</span>}
      </label>
      <PhoneInput
        international
        defaultCountry={country}
        value={value}
        onChange={handlePhoneChange}
        className="phone-input-modern"
        placeholder="Ingresa tu teléfono"
        countryCallingCodeEditable={false}
        limitMaxLength={true}
        smartCaret={true}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      <style jsx>{`
        :global(.phone-input-modern) {
          display: block;
          width: 100%;
        }
        :global(.phone-input-modern .PhoneInputInput) {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          transition: all 0.2s;
        }
        :global(.phone-input-modern .PhoneInputInput:focus) {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        :global(.phone-input-modern .PhoneInputCountry) {
          display: inline-flex;
          align-items: center;
          margin-right: 0.5rem;
        }
        :global(.phone-input-modern .PhoneInputCountryIcon) {
          width: 1.5rem;
          height: 1rem;
          margin-right: 0.25rem;
        }
        :global(.phone-input-modern .PhoneInputCountrySelect) {
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          background-color: white;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        :global(.phone-input-modern .PhoneInputCountrySelect:hover) {
          background-color: #f9fafb;
        }
        :global(.phone-input-modern .PhoneInputCountrySelect:focus) {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        @media (max-width: 640px) {
          :global(.phone-input-modern .PhoneInputInput) {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }
      `}</style>
    </div>
  );
};

export default InternationalPhoneInput;