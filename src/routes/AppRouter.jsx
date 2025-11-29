import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Pages publiques
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';

// Dashboards
import DashboardAdmin from '../pages/DashboardAdmin';
import DashboardCoach from '../pages/DashboardCoach';
import DashboardPlayer from '../pages/DashboardPlayer';

// Pages protégées
import CoachsList from '../pages/CoachesList';
import CoachDetails from '../pages/CoachDetails';
import PlayersList from '../pages/PlayersList';
import PlayerDetails from '../pages/PlayerDetails';
import TrainingsList from '../pages/TrainingsList';
import TrainingDetails from '../pages/TrainingDetails';
import MatchesList from '../pages/MatchesList';
import NotificationsPage from '../pages/NotificationsPage';
import ProfilePage from '../pages/ProfilePage';

const AppRouter = () => {
  const { user } = useAuth();

  // Composant pour rediriger vers le bon dashboard selon le rôle
  const DashboardRouter = () => {
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
      case 'admin':
        return <DashboardAdmin />;
      case 'coach':
        return <DashboardCoach />;
      case 'player':
        return <DashboardPlayer />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard (redirige selon le rôle) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        {/* Gestion des coachs (Admin seulement) */}
        <Route
          path="/coaches"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CoachsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coaches/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CoachDetails />
            </ProtectedRoute>
          }
        />

        {/* Gestion des joueurs (Admin + Coach) */}
        <Route
          path="/players"
          element={
            <ProtectedRoute allowedRoles={['admin', 'coach']}>
              <PlayersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players/:id"
          element={
            <ProtectedRoute>
              <PlayerDetails />
            </ProtectedRoute>
          }
        />

        {/* Gestion des entraînements */}
        <Route
          path="/trainings"
          element={
            <ProtectedRoute>
              <TrainingsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainings/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'coach']}>
              <TrainingDetails />
            </ProtectedRoute>
          }
        />

        {/* Matchs (tous les rôles) */}
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <MatchesList />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Profil */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;