import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('🔄 Vérification auth - Token:', !!storedToken, 'User:', !!storedUser);

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
          
          console.log('✅ Utilisateur restauré:', userData);
        }
      } catch (error) {
        console.error('❌ Error checking auth:', error);
        logout();
      } finally {
        setLoading(false);
        console.log('🏁 Chargement auth terminé');
      }
    };

    checkAuth();
  }, []);

  // Connexion
  const login = async (email, password) => {
    try {
      console.log('🔐 Tentative de connexion:', email);
      
      const data = await authService.login(email, password);
      console.log('📦 Réponse API login:', data);

      // S'adapter à différentes structures de réponse
      const authToken = data.token || data.access_token || data.data?.token;
      const userData = data.user || data.data?.user || data.data;

      console.log('🔑 Token extrait:', !!authToken);
      console.log ('👤 User extrait:', userData);

      if (authToken && userData) {
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('✅ Connexion réussie!');
        return { success: true, user: userData };
      } else {
        console.log('❌ Données manquantes dans la réponse');
        throw new Error('Structure de réponse invalide de l\'API');
      }
    } catch (error) {
      console.error('🚨 Erreur login complète:', error);
      console.error('Détails erreur:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Erreur de connexion au serveur';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      
      const authToken = data.token || data.access_token;
      const userInfo = data.user || data.data;

      if (authToken && userInfo) {
        setToken(authToken);
        setUser(userInfo);
        setIsAuthenticated(true);
        
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        return { success: true, user: userInfo };
      } else {
        throw new Error('Données d\'inscription manquantes');
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur d\'inscription',
      };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('👋 Déconnexion effectuée');
    }
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};