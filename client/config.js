// Centralized configuration
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  apiKey: import.meta.env.VITE_API_KEY || ' sp_zjy8lf6y9b',
  
  // Helper to check if configured
  isConfigured: () => {
    if (!config.apiKey) {
      console.error('API Key not configured! Please set VITE_API_KEY in .env file');
      return false;
    }
    return true;
  }
};

export default config;