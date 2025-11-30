import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import BarChartComponent from '../components/Charts/BarChartComponent';
import PieChartComponent from '../components/Charts/PieChartComponent';
import { Users, Calendar, Trophy, TrendingUp } from 'lucide-react';
import statsService from '../services/statsService';

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await statsService.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <p className="text-white">Erreur de chargement des statistiques</p>
      </div>
    );
  }

  // Données pour les graphiques
  const playersPerTeamData = stats.teams.map(team => ({
    name: team.name,
    joueurs: team.players
  }));

  const rolesDistributionData = [
    { name: 'Joueurs', value: stats.users.players },
    { name: 'Coaches', value: stats.users.coaches },
    { name: 'Admins', value: stats.users.admins },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
            <p className="text-gray-400">Vue d'ensemble de la gestion du club</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Joueurs"
              value={stats.players.total}
              icon={Users}
              color="neon-green"
            />
            <StatsCard
              title="Séances d'entraînement"
              value={stats.trainings.total}
              icon={Calendar}
              color="blue-500"
            />
            <StatsCard
              title="Matchs"
              value={stats.matches.total}
              icon={Trophy}
              color="yellow-500"
            />
            <StatsCard
              title="Taux de présence"
              value={`${stats.attendance.overall_rate}%`}
              icon={TrendingUp}
              color="green-500"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BarChartComponent
              data={playersPerTeamData}
              dataKey="joueurs"
              xKey="name"
              title="Nombre de joueurs par équipe"
            />
            <PieChartComponent 
              data={rolesDistributionData} 
              title="Répartition des rôles" 
            />
          </div>

          {/* Stats Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Players Status */}
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Statut des joueurs</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Actifs</span>
                  <span className="text-green-500 font-semibold">{stats.players.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Blessés</span>
                  <span className="text-yellow-500 font-semibold">{stats.players.injured}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Suspendus</span>
                  <span className="text-red-500 font-semibold">{stats.players.suspended}</span>
                </div>
              </div>
            </div>

            {/* Trainings Status */}
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Entraînements</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Planifiés</span>
                  <span className="text-blue-500 font-semibold">{stats.trainings.scheduled}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Terminés</span>
                  <span className="text-green-500 font-semibold">{stats.trainings.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Annulés</span>
                  <span className="text-red-500 font-semibold">{stats.trainings.cancelled}</span>
                </div>
              </div>
            </div>

            {/* Matches Status */}
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Matchs</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Victoires</span>
                  <span className="text-green-500 font-semibold">{stats.matches.wins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Défaites</span>
                  <span className="text-red-500 font-semibold">{stats.matches.losses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Nuls</span>
                  <span className="text-yellow-500 font-semibold">{stats.matches.draws}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Teams Overview */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-6">Vue d'ensemble des équipes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.teams.map((team, index) => (
                <div key={index} className="bg-dark-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">{team.name}</h4>
                  <p className="text-gray-400 text-sm mb-1">Coach: {team.coach}</p>
                  <p className="text-neon-green font-bold">{team.players} joueurs</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;