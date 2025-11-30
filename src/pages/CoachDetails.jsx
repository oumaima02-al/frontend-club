import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Mail, Phone, Award, Calendar, Users, BookOpen, TrendingUp } from 'lucide-react';
import coachesService from '../services/coachesService';
import trainingsService from '../services/trainingsService';
import playersService from '../services/playersService';

const CoachDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [coachStats, setCoachStats] = useState({
    playersCount: 0,
    trainingsCount: 0,
    avgAttendance: 0,
    recentTrainings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoachDetails();
  }, [id]);

  const fetchCoachDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch coach basic data
      const coachData = await coachesService.getCoachById(id);
      setCoach(coachData);

      // Fetch coach's trainings
      const trainingsResponse = await trainingsService.getAllTrainings();
      const coachTrainings = trainingsResponse.filter(training => training.coach_id == id);

      // Fetch players in coach's team
      const playersResponse = await playersService.getAllPlayers();
      const teamPlayers = playersResponse.filter(player => player.team === coachData.team);

      // Calculate stats
      const avgAttendance = teamPlayers.length > 0
        ? Math.round(teamPlayers.reduce((sum, player) => sum + (player.attendance_rate || 0), 0) / teamPlayers.length)
        : 0;

      // Get recent trainings (last 5)
      const recentTrainings = coachTrainings
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setCoachStats({
        playersCount: teamPlayers.length,
        trainingsCount: coachTrainings.length,
        avgAttendance: avgAttendance,
        recentTrainings: recentTrainings
      });

    } catch (error) {
      console.error('Erreur lors du chargement du coach:', error);
      setError('Erreur lors du chargement des données du coach');
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

  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <p className="text-white">Coach non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/coaches')}
            className="flex items-center space-x-2 text-gray-400 hover:text-neon-green mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span>Retour à la liste</span>
          </button>

          {/* Coach Header */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={coach.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKIRUzMjZZw7GkeTYxgRmXrU-7YR90CZfGxH75AJY5qrk42jQhjJaNmA7q160XlO1222w&usqp=CAU'}
                alt={coach.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-neon-green"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{coach.name}</h1>
                <div className="flex flex-wrap gap-4 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-neon-green" />
                    <span>{coach.email}</span>
                  </div>
                  {coach.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-neon-green" />
                      <span>{coach.phone}</span>
                    </div>
                  )}
                  {coach.speciality && (
                    <div className="flex items-center space-x-2">
                      <Award size={16} className="text-neon-green" />
                      <span>{coach.speciality}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-neon-green" />
                    <span>Rejoint le {new Date(coach.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Joueurs gérés</p>
                  <p className="text-3xl font-bold text-neon-green">{coachStats.playersCount}</p>
                </div>
                <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center">
                  <Users size={32} className="text-neon-green" />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Entraînements créés</p>
                  <p className="text-3xl font-bold text-blue-500">{coachStats.trainingsCount}</p>
                </div>
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <BookOpen size={32} className="text-blue-500" />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Taux de présence moyen</p>
                  <p className="text-3xl font-bold text-yellow-500">{coachStats.avgAttendance}%</p>
                </div>
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <TrendingUp size={32} className="text-yellow-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Trainings */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-6">Entraînements récents</h3>
            <div className="space-y-4">
              {coachStats.recentTrainings && coachStats.recentTrainings.length > 0 ? (
                coachStats.recentTrainings.map((training, index) => (
                  <div key={index} className="bg-dark-700 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{training.title || `Entraînement ${training.id}`}</p>
                      <p className="text-gray-400 text-sm">
                        {training.description || `Équipe: ${training.team || 'Non spécifiée'}`}
                      </p>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(training.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">Aucun entraînement récent</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoachDetails;