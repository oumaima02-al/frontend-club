import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading, getDashboardPath } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers login avec retour à la page demandée
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles autorisés
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Rediriger vers le dashboard approprié selon le rôle
    return <Navigate to={getDashboardPath()} replace />;
  }

  return children;
};

export default ProtectedRoute;