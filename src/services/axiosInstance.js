import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', config.url);
    } else {
      console.warn('⚠️ No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Gérer les erreurs 401
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Request failed:', error.config?.url);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error data:', error.response?.data);
    
    if (error.response && error.response.status === 401) {
      console.error('🚫 Unauthorized - Redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;