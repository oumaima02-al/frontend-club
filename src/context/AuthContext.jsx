import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(response => {
          // Gérer les différents formats de réponse
          const userData = response.user || response.data || response;
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error('Erreur lors du chargement du profil:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { access_token, token, user } = response;

      // Utiliser access_token ou token selon la réponse
      const authToken = access_token || token;
      
      if (authToken) {
        localStorage.setItem('token', authToken);
        setUser(user || response.user || response.data);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return {
          success: false,
          message: 'Token manquant dans la réponse'
        };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Erreur de connexion'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasPermission = (permission) => {
    const rolePermissions = {
      admin: ['dashboard', 'matches', 'coaches', 'players', 'trainings', 'notifications', 'profile'],
      coach: ['dashboard', 'matches', 'players', 'trainings', 'notifications', 'profile'],
      player: ['dashboard', 'matches', 'trainings', 'notifications', 'profile']
    };

    return rolePermissions[user?.role]?.includes(permission) || false;
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/dashboard';
      case 'coach':
        return '/dashboard';
      case 'player':
        return '/dashboard';
      default:
        return '/login';
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    hasRole,
    hasPermission,
    getDashboardPath
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};