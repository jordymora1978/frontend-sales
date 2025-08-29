/**
 * Geolocation Service - Auto-detect user country
 * Uses ipapi.co free API (1000 requests/day)
 */

class GeolocationService {
  constructor() {
    this.cache = new Map();
    this.cacheKey = 'user_location_cache';
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    
    // Load cached data
    this.loadFromCache();
  }

  loadFromCache() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < this.cacheExpiry) {
          this.cache.set('location', data.location);
        }
      }
    } catch (error) {
      console.warn('Failed to load location cache:', error);
    }
  }

  saveToCache(location) {
    try {
      const cacheData = {
        location,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
      this.cache.set('location', location);
    } catch (error) {
      console.warn('Failed to save location cache:', error);
    }
  }

  async detectCountry() {
    // Check cache first
    if (this.cache.has('location')) {
      return this.cache.get('location');
    }

    try {
      // Use ipapi.co free API
      const response = await fetch('https://ipapi.co/json/', {
        timeout: 5000
      });
      
      if (!response.ok) {
        throw new Error('Geolocation API failed');
      }
      
      const data = await response.json();
      
      const location = {
        country: data.country_name || 'Colombia',
        countryCode: data.country_code || 'CO',
        timezone: data.timezone || 'America/Bogota',
        currency: data.currency || 'COP',
        calling_code: data.country_calling_code || '+57'
      };
      
      // Cache the result
      this.saveToCache(location);
      
      return location;
      
    } catch (error) {
      console.warn('Geolocation detection failed, using default:', error);
      
      // Fallback to Colombia
      const fallback = {
        country: 'Colombia',
        countryCode: 'CO', 
        timezone: 'America/Bogota',
        currency: 'COP',
        calling_code: '+57'
      };
      
      return fallback;
    }
  }

  getCountryByCode(code) {
    const countries = {
      'CO': { name: 'Colombia', calling_code: '+57', currency: 'COP' },
      'MX': { name: 'México', calling_code: '+52', currency: 'MXN' },
      'AR': { name: 'Argentina', calling_code: '+54', currency: 'ARS' },
      'CL': { name: 'Chile', calling_code: '+56', currency: 'CLP' },
      'PE': { name: 'Perú', calling_code: '+51', currency: 'PEN' },
      'EC': { name: 'Ecuador', calling_code: '+593', currency: 'USD' },
      'VE': { name: 'Venezuela', calling_code: '+58', currency: 'VES' },
      'UY': { name: 'Uruguay', calling_code: '+598', currency: 'UYU' },
      'BO': { name: 'Bolivia', calling_code: '+591', currency: 'BOB' },
      'PY': { name: 'Paraguay', calling_code: '+595', currency: 'PYG' },
      'US': { name: 'Estados Unidos', calling_code: '+1', currency: 'USD' },
      'ES': { name: 'España', calling_code: '+34', currency: 'EUR' }
    };
    
    return countries[code] || countries['CO'];
  }

  getSupportedCountries() {
    return [
      { code: 'CO', name: 'Colombia', flag: '🇨🇴', calling_code: '+57' },
      { code: 'MX', name: 'México', flag: '🇲🇽', calling_code: '+52' },
      { code: 'AR', name: 'Argentina', flag: '🇦🇷', calling_code: '+54' },
      { code: 'CL', name: 'Chile', flag: '🇨🇱', calling_code: '+56' },
      { code: 'PE', name: 'Perú', flag: '🇵🇪', calling_code: '+51' },
      { code: 'EC', name: 'Ecuador', flag: '🇪🇨', calling_code: '+593' },
      { code: 'VE', name: 'Venezuela', flag: '🇻🇪', calling_code: '+58' },
      { code: 'UY', name: 'Uruguay', flag: '🇺🇾', calling_code: '+598' },
      { code: 'BO', name: 'Bolivia', flag: '🇧🇴', calling_code: '+591' },
      { code: 'PY', name: 'Paraguay', flag: '🇵🇾', calling_code: '+595' },
      { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', calling_code: '+1' },
      { code: 'ES', name: 'España', flag: '🇪🇸', calling_code: '+34' }
    ];
  }

  // Alias para detectCountry (compatibilidad)
  async detectUserLocation() {
    return this.detectCountry();
  }

  clearCache() {
    localStorage.removeItem(this.cacheKey);
    this.cache.clear();
  }
}

export default new GeolocationService();