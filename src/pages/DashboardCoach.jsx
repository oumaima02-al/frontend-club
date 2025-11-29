import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import LineChartComponent from '../components/Charts/LineChartComponent';
import RadarChartComponent from '../components/Charts/RadarChartComponent';
import TrainingsTable from '../components/TrainingsTable';
import { Users, Calendar, TrendingUp, Award } from 'lucide-react';
import trainingsService from '../services/trainingsService';

const DashboardCoach = () => {
  const [stats, setStats] = useState({
    myPlayers: 0,
    recentTrainings: 0,
    avgPerformance: 0,
    attendanceRate: 0,
  });
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données factices pour les graphiques
  const performanceEvolutionData = [
    { semaine: 'S1', moyenne: 7.2 },
    { semaine: 'S2', moyenne: 7.5 },
    { semaine: 'S3', moyenne: 7.8 },
    { semaine: 'S4', moyenne: 8.1 },
    { semaine: 'S5', moyenne: 7.9 },
    { semaine: 'S6', moyenne: 8.3 },
  ];

  const playerProfileData = [
    { subject: 'Attaque', value: 85 },
    { subject: 'Défense', value: 78 },
    { subject: 'Service', value: 82 },
    { subject: 'Réception', value: 88 },
    { subject: 'Passe', value: 75 },
    { subject: 'Contre', value: 80 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Récupérer les séances récentes
      const trainingsData = await trainingsService.getAllTrainings();
      setTrainings(trainingsData.slice(0, 5));

      // Données factices
      setStats({
        myPlayers: 18,
        recentTrainings: 12,
        avgPerformance: 8.1,
        attendanceRate: 89,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTraining = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      try {
        await trainingsService.deleteTraining(id);
        setTrainings(trainings.filter((t) => t.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
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
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Coach</h1>
            <p className="text-gray-400">Suivez les performances de vos joueurs</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Mes Joueurs"
              value={stats.myPlayers}
              icon={Users}
              color="neon-green"
            />
            <StatsCard
              title="Séances récentes"
              value={stats.recentTrainings}
              icon={Calendar}
              color="blue-500"
            />
            <StatsCard
              title="Performance moyenne"
              value={`${stats.avgPerformance}/10`}
              icon={Award}
              color="yellow-500"
            />
            <StatsCard
              title="Taux de présence"
              value={`${stats.attendanceRate}%`}
              icon={TrendingUp}
              color="green-500"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <LineChartComponent
              data={performanceEvolutionData}
              dataKey="moyenne"
              xKey="semaine"
              title="Évolution des performances moyennes"
            />
            <RadarChartComponent
              data={playerProfileData}
              title="Profil de performance moyen"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
              <p className="text-gray-400 text-sm">Voir la liste complète</p>
            </button>

            <button
              onClick={() => (window.location.href = '/matches')}
              className="card hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
            >
              <Award size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Statistiques</h3>
              <p className="text-gray-400 text-sm">Analyser les performances</p>
            </button>
          </div>

          {/* Recent Trainings */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Séances récentes</h3>
              <button
                onClick={() => (window.location.href = '/trainings')}
                className="text-neon-green hover:underline text-sm"
              >
                Voir tout
              </button>
            </div>
            {trainings.length > 0 ? (
              <TrainingsTable trainings={trainings} onDelete={handleDeleteTraining} />
            ) : (
              <p className="text-gray-400 text-center py-8">Aucune séance enregistrée</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardCoach; 