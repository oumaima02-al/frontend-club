import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import BarChartComponent from '../components/Charts/BarChartComponent';
import LineChartComponent from '../components/Charts/LineChartComponent';
import PieChartComponent from '../components/Charts/PieChartComponent';
import MatchesTable from '../components/MatchesTable';
import { Users, Calendar, Trophy, TrendingUp } from 'lucide-react';
import statsService from '../services/statsService';
import matchesService from '../services/matchesService';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalTrainings: 0,
    totalMatches: 0,
    attendanceRate: 0,
  });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données factices pour les graphiques (à remplacer par vraies données API)
  const playersPerTeamData = [
    { name: 'U18 Masculin', joueurs: 15 },
    { name: 'Seniors Féminin', joueurs: 18 },
    { name: 'Vétérans Mixte', joueurs: 12 },
    { name: 'U15 Féminin', joueurs: 14 },
  ];

  const attendanceEvolutionData = [
    { mois: 'Sep', taux: 85 },
    { mois: 'Oct', taux: 88 },
    { mois: 'Nov', taux: 82 },
    { mois: 'Déc', taux: 90 },
    { mois: 'Jan', taux: 87 },
    { mois: 'Fév', taux: 91 },
  ];

  const rolesDistributionData = [
    { name: 'Joueurs', value: 45 },
    { name: 'Coaches', value: 5 },
    { name: 'Admins', value: 2 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les statistiques globales
      // const globalStats = await statsService.getGlobalStats();
      // setStats(globalStats);

      // Récupérer les derniers matchs
      const matchesData = await matchesService.getAllMatches();
      setMatches(matchesData.slice(0, 5)); // Les 5 derniers

      // Données factices en attendant l'API
      setStats({
        totalPlayers: 52,
        totalTrainings: 128,
        totalMatches: 24,
        attendanceRate: 87,
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
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
            <p className="text-gray-400">Vue d'ensemble de la gestion du club</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Joueurs"
              value={stats.totalPlayers}
              icon={Users}
              color="neon-green"
              trend={8}
            />
            <StatsCard
              title="Séances d'entraînement"
              value={stats.totalTrainings}
              icon={Calendar}
              color="blue-500"
              trend={12}
            />
            <StatsCard
              title="Matchs"
              value={stats.totalMatches}
              icon={Trophy}
              color="yellow-500"
              trend={5}
            />
            <StatsCard
              title="Taux de présence"
              value={`${stats.attendanceRate}%`}
              icon={TrendingUp}
              color="green-500"
              trend={3}
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
            <LineChartComponent
              data={attendanceEvolutionData}
              dataKey="taux"
              xKey="mois"
              title="Évolution du taux de présence"
            />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PieChartComponent data={rolesDistributionData} title="Répartition des rôles" />
            
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6">Actions rapides</h3>
              <div className="space-y-4">
                <button
                  onClick={() => (window.location.href = '/players')}
                  className="w-full btn-primary text-left flex items-center justify-between"
                >
                  <span>Gérer les joueurs</span>
                  <Users size={20} />
                </button>
                <button
                  onClick={() => (window.location.href = '/trainings')}
                  className="w-full btn-secondary text-left flex items-center justify-between"
                >
                  <span>Planifier un entraînement</span>
                  <Calendar size={20} />
                </button>
                <button
                  onClick={() => (window.location.href = '/matches')}
                  className="w-full btn-secondary text-left flex items-center justify-between"
                >
                  <span>Ajouter un match</span>
                  <Trophy size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Derniers matchs</h3>
              <button
                onClick={() => (window.location.href = '/matches')}
                className="text-neon-green hover:underline text-sm"
              >
                Voir tout
              </button>
            </div>
            {matches.length > 0 ? (
              <MatchesTable matches={matches} />
            ) : (
              <p className="text-gray-400 text-center py-8">Aucun match enregistré</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin; 