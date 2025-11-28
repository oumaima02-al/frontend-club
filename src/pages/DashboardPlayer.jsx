import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import LineChartComponent from '../components/Charts/LineChartComponent';
import BarChartComponent from '../components/Charts/BarChartComponent';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import statsService from '../services/statsService';

const DashboardPlayer = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    trainingsAttended: 0,
    attendanceRate: 0,
    avgPerformance: 0,
    upcomingMatches: 0,
  });
  const [loading, setLoading] = useState(true);

  // Données factices pour les graphiques
  const performanceEvolutionData = [
    { date: '01/12', score: 7.2 },
    { date: '08/12', score: 7.5 },
    { date: '15/12', score: 7.8 },
    { date: '22/12', score: 8.1 },
    { date: '29/12', score: 7.9 },
    { date: '05/01', score: 8.3 },
  ];

  const skillsComparisonData = [
    { competence: 'Attaque', score: 8.5 },
    { competence: 'Défense', score: 7.2 },
    { competence: 'Service', score: 8.0 },
    { competence: 'Réception', score: 7.8 },
    { competence: 'Passe', score: 7.5 },
  ];

  const upcomingMatches = [
    {
      id: 1,
      date: '15 Janvier 2025',
      opponent: 'Paris Volley',
      location: 'Domicile',
      time: '18:00',
    },
    {
      id: 2,
      date: '22 Janvier 2025',
      opponent: 'Lyon Volley',
      location: 'Extérieur',
      time: '20:00',
    },
    {
      id: 3,
      date: '29 Janvier 2025',
      opponent: 'Marseille Volley',
      location: 'Domicile',
      time: '19:00',
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Récupérer les stats du joueur
      // const playerStats = await statsService.getPlayerStats(user.id);
      // setStats(playerStats);

      // Données factices
      setStats({
        trainingsAttended: 24,
        attendanceRate: 92,
        avgPerformance: 8.0,
        upcomingMatches: 3,
      });
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

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bonjour, {user?.name} 👋
            </h1>
            <p className="text-gray-400">Bienvenue sur votre tableau de bord personnel</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Séances suivies"
              value={stats.trainingsAttended}
              icon={Calendar}
              color="neon-green"
            />
            <StatsCard
              title="Taux de présence"
              value={`${stats.attendanceRate}%`}
              icon={TrendingUp}
              color="blue-500"
            />
            <StatsCard
              title="Performance moyenne"
              value={`${stats.avgPerformance}/10`}
              icon={Award}
              color="yellow-500"
            />
            <StatsCard
              title="Prochains matchs"
              value={stats.upcomingMatches}
              icon={Target}
              color="red-500"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <LineChartComponent
              data={performanceEvolutionData}
              dataKey="score"
              xKey="date"
              title="Évolution de mes performances"
            />
            <BarChartComponent
              data={skillsComparisonData}
              dataKey="score"
              xKey="competence"
              title="Mes compétences par catégorie"
            />
          </div>

          {/* Upcoming Matches */}
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Mes prochains matchs</h3>
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-dark-700 rounded-lg p-4 flex items-center justify-between hover:bg-dark-600 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-neon-green font-semibold">{match.date}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{match.time}</span>
                    </div>
                    <h4 className="text-white font-medium mb-1">vs {match.opponent}</h4>
                    <p className="text-gray-400 text-sm">{match.location}</p>
                  </div>
                  <button className="btn-primary">
                    Détails
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance History */}
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
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {[
                    { date: '05/01/2025', type: 'Entraînement', performance: 8.3, status: 'Présent' },
                    { date: '29/12/2024', type: 'Entraînement', performance: 7.9, status: 'Présent' },
                    { date: '22/12/2024', type: 'Match', performance: 8.5, status: 'Présent' },
                    { date: '15/12/2024', type: 'Entraînement', performance: 7.8, status: 'Présent' },
                    { date: '08/12/2024', type: 'Entraînement', performance: null, status: 'Absent' },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-dark-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-white">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{item.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.performance ? (
                          <span className="text-neon-green font-semibold">
                            {item.performance}/10
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Présent'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPlayer;