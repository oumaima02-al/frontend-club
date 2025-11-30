import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LineChartComponent from '../components/Charts/LineChartComponent';
import { ArrowLeft, Mail, Phone, Calendar, Award, Download } from 'lucide-react';
import playersService from '../services/playersService';

const PlayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlayerDetails();
  }, [id]);

  const fetchPlayerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching player ID:', id);
      console.log('🔑 Token in localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing');

      const data = await playersService.getPlayerById(id);
      console.log('✅ Player data received:', data);

      if (!data) {
        throw new Error('Aucune donnée reçue pour ce joueur');
      }

      setPlayer(data);
    } catch (error) {
      console.error('❌ Error loading player:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);

      let errorMessage = 'Erreur lors du chargement du joueur';
      if (error.response?.status === 401) {
        errorMessage = 'Vous devez être connecté pour voir les détails du joueur';
      } else if (error.response?.status === 404) {
        errorMessage = 'Joueur non trouvé';
      } else if (error.response?.status === 403) {
        errorMessage = 'Accès refusé à ce joueur';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button onClick={() => navigate('/players')} className="btn-primary">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Joueur non trouvé</p>
          <button onClick={() => navigate('/players')} className="btn-primary">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  // ✅ Préparer les données pour le graphique
  const performanceData = player.attendances && player.attendances.length > 0
    ? player.attendances
        .filter(att => att.performance)
        .slice(0, 10)
        .reverse()
        .map(att => ({
          date: att.date,
          score: att.performance
        }))
    : [];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/players')}
            className="flex items-center space-x-2 text-gray-400 hover:text-neon-green mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span>Retour à la liste</span>
          </button>

          {/* Player Header */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={player.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(player.name)}
                alt={player.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-neon-green"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{player.name}</h1>
                <div className="flex flex-wrap gap-4 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-neon-green" />
                    <span>{player.email}</span>
                  </div>
                  {player.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-neon-green" />
                      <span>{player.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-neon-green" />
                    <span>Rejoint le {new Date(player.joinDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
              {player.cv && (
                <a
                  href={player.cv}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>Télécharger CV</span>
                </a>
              )}
            </div>
          </div>

          {/* Player Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Équipe</p>
              <p className="text-2xl font-bold text-neon-green">{player.team}</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Poste</p>
              <p className="text-2xl font-bold text-white">{player.position}</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Numéro</p>
              <p className="text-2xl font-bold text-white">{player.number}</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Âge</p>
              <p className="text-2xl font-bold text-white">{player.age} ans</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Taux de présence</p>
                  <p className="text-3xl font-bold text-neon-green">{player.attendance_rate}%</p>
                </div>
                <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center">
                  <Calendar size={32} className="text-neon-green" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Performance moyenne</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {player.avgPerformance ? `${player.avgPerformance}/10` : 'N/A'}
                  </p>
                </div>
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <Award size={32} className="text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Séances suivies</p>
                  <p className="text-3xl font-bold text-blue-500">
                    {player.attendances ? player.attendances.length : 0}
                  </p>
                </div>
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Calendar size={32} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          {performanceData.length > 0 && (
            <div className="mb-8">
              <LineChartComponent
                data={performanceData}
                dataKey="score"
                xKey="date"
                title="Évolution des performances"
              />
            </div>
          )}

          {/* Attendance History */}
          {player.attendances && player.attendances.length > 0 && (
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
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {player.attendances.map((item, index) => (
                      <tr key={index} className="hover:bg-dark-700/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-white">{item.date}</td>
                        <td className="px-6 py-4 text-gray-300">{item.training}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.performance ? (
                            <span className="text-neon-green font-semibold">{item.performance}/10</span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'present' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {item.status === 'present' ? 'Présent' : 'Absent'}
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
          {(!player.attendances || player.attendances.length === 0) && (
            <div className="card text-center py-12">
              <Award size={64} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucune donnée de performance disponible</p>
              <p className="text-gray-500 text-sm mt-2">
                Les statistiques apparaîtront après les entraînements
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PlayerDetails;