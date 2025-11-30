import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import LineChartComponent from '../components/Charts/LineChartComponent';
import { Calendar, TrendingUp, Award, Target, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import statsService from '../services/statsService';

const DashboardPlayer = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await statsService.getPlayerStats();
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
            <h1 className="text-3xl font-bold text-white mb-2">
              Bonjour, {stats.player.name} 👋
            </h1>
            <p className="text-gray-400">
              {stats.player.team} - {stats.player.position} - N°{stats.player.jersey_number}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Séances suivies"
              value={stats.trainings_attended}
              icon={Calendar}
              color="neon-green"
            />
            <StatsCard
              title="Taux de présence"
              value={`${stats.attendance_rate}%`}
              icon={TrendingUp}
              color="blue-500"
            />
            <StatsCard
              title="Performance moyenne"
              value={stats.average_performance ? `${stats.average_performance}/10` : 'N/A'}
              icon={Award}
              color="yellow-500"
            />
            <StatsCard
              title="Prochains matchs"
              value={stats.upcoming_matches?.length || 0}
              icon={Target}
              color="red-500"
            />
          </div>

          {/* Performance Chart */}
          {stats.recent_performances && stats.recent_performances.length > 0 && (
            <div className="mb-8">
              <LineChartComponent
                data={stats.recent_performances}
                dataKey="score"
                xKey="date"
                title="Évolution de mes performances"
              />
            </div>
          )}

          {/* Upcoming Trainings */}
          {stats.upcoming_trainings && stats.upcoming_trainings.length > 0 && (
            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Prochains entraînements</h3>
              <div className="space-y-4">
                {stats.upcoming_trainings.map((training) => (
                  <div
                    key={training.id}
                    className="bg-dark-700 rounded-lg p-4 flex items-center justify-between hover:bg-dark-600 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar size={16} className="text-neon-green" />
                        <span className="text-neon-green font-semibold">
                          {new Date(training.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                        <span className="text-gray-500">•</span>
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-400">{training.time}</span>
                      </div>
                      <h4 className="text-white font-medium mb-1">{training.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <MapPin size={14} />
                        <span>{training.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Matches */}
          {stats.upcoming_matches && stats.upcoming_matches.length > 0 && (
            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Mes prochains matchs</h3>
              <div className="space-y-4">
                {stats.upcoming_matches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-dark-700 rounded-lg p-4 flex items-center justify-between hover:bg-dark-600 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar size={16} className="text-neon-green" />
                        <span className="text-neon-green font-semibold">
                          {new Date(match.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                        <span className="text-gray-500">•</span>
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-400">{match.time}</span>
                      </div>
                      <h4 className="text-white font-medium mb-1">
                        vs {match.opponent_team}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <MapPin size={14} />
                        <span>{match.location}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                      À venir
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance History */}
          {stats.recent_performances && stats.recent_performances.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6">Historique de présence</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                        Entraînement
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {stats.recent_performances.map((item, index) => (
                      <tr key={index} className="hover:bg-dark-700/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-white">{item.date}</td>
                        <td className="px-6 py-4 text-gray-300">{item.training}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-neon-green font-semibold">
                            {item.score}/10
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty States */}
          {(!stats.recent_performances || stats.recent_performances.length === 0) && (
            <div className="card text-center py-12">
              <Award size={64} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucune donnée de performance disponible</p>
              <p className="text-gray-500 text-sm mt-2">
                Participez aux entraînements pour voir vos statistiques
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPlayer;