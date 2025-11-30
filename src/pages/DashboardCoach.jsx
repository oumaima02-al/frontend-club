import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import { Users, Calendar, TrendingUp, Award } from 'lucide-react';
import statsService from '../services/statsService';

const DashboardCoach = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await statsService.getCoachStats();
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

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Coach</h1>
            <p className="text-gray-400">Équipe : <span className="text-neon-green font-semibold">{stats.team}</span></p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Mes Joueurs"
              value={stats.players.total}
              icon={Users}
              color="neon-green"
            />
            <StatsCard
              title="Séances"
              value={stats.trainings.total}
              icon={Calendar}
              color="blue-500"
            />
            <StatsCard
              title="Performance moyenne"
              value={stats.performance.average ? `${stats.performance.average}/10` : 'N/A'}
              icon={Award}
              color="yellow-500"
            />
            <StatsCard
              title="Taux de présence"
              value={`${stats.attendance.overall_rate}%`}
              icon={TrendingUp}
              color="green-500"
            />
          </div>

          {/* Stats Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                  <span className="text-red-500 font-semibold">{stats.trainings.cancelled || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Players */}
          {stats.top_players && stats.top_players.length > 0 && (
            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Top Joueurs de l'équipe</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Poste</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">N°</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Présence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {stats.top_players.map((player) => (
                      <tr key={player.id} className="hover:bg-dark-700/50">
                        <td className="px-6 py-4 text-white">{player.name}</td>
                        <td className="px-6 py-4 text-gray-300">{player.position}</td>
                        <td className="px-6 py-4 text-gray-300">{player.jersey_number}</td>
                        <td className="px-6 py-4 text-neon-green font-semibold">{player.attendance_rate}%</td>
                        <td className="px-6 py-4 text-yellow-500 font-semibold">
                          {player.average_performance ? `${player.average_performance}/10` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <button
              onClick={() => (window.location.href = '/trainings')}
              className="card hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
            >
              <Calendar size={48} className="text-neon-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nouvelle séance</h3>
              <p className="text-gray-400 text-sm">Planifier un entraînement</p>
            </button>

            <button
              onClick={() => (window.location.href = '/players')}
              className="card hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
            >
              <Users size={48} className="text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Mes joueurs</h3>
              <p className="text-gray-400 text-sm">Gérer l'équipe</p>
            </button>

            <button
              onClick={() => (window.location.href = '/matches')}
              className="card hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
            >
              <Award size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Matchs</h3>
              <p className="text-gray-400 text-sm">Voir le calendrier</p>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardCoach;