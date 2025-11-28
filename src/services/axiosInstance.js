import axios from 'axios';

// Configurez l'URL de votre backend Laravel
const API_BASE_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour ajouter le token JWT à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token ajouté à la requête:', config.url);
    }
    
    console.log('🚀 Requête:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erreur requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse réussie:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('🚨 Erreur réponse:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      console.log('🔒 Token expiré ou invalide - Déconnexion');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('🌐 Erreur réseau - Vérifiez que le serveur Laravel est démarré');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;