import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Mail, Phone, Award, Calendar } from 'lucide-react';
import coachesService from '../services/coachesService';

const CoachDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoachDetails();
  }, [id]);

  const fetchCoachDetails = async () => {
    try {
      setLoading(true);
      const data = await coachesService.getCoachById(id);
      setCoach(data);
    } catch (error) {
      console.error('Erreur lors du chargement du coach:', error);
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
                src={coach.photo || '/default-avatar.png'}
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
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Joueurs gérés</p>
              <p className="text-3xl font-bold text-neon-green">{coach.players_count || 0}</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Entraînements créés</p>
              <p className="text-3xl font-bold text-blue-500">{coach.trainings_count || 0}</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Taux de présence moyen</p>
              <p className="text-3xl font-bold text-yellow-500">{coach.avg_attendance || 0}%</p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-6">Activités récentes</h3>
            <div className="space-y-4">
              {coach.recent_activities && coach.recent_activities.length > 0 ? (
                coach.recent_activities.map((activity, index) => (
                  <div key={index} className="bg-dark-700 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-gray-400 text-sm">{activity.description}</p>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(activity.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">Aucune activité récente</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoachDetails;