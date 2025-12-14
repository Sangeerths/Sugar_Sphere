import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request:', config.url, token.substring(0, 20) + '...');
    } else {
      console.warn('No token found for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.data || error.message);
    
    // Handle 403 Forbidden - token expired or invalid
    if (error.response?.status === 403) {
      const token = localStorage.getItem('token');
      if (token) {
        console.warn('403 Forbidden - Token may be expired or invalid');
        // Don't auto-logout, let the component handle it
      }
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - User not authenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

export default api;