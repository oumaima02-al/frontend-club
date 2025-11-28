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

  // Données factices pour les performances
  const performanceData = [
    { date: '01/12', score: 7.2 },
    { date: '08/12', score: 7.5 },
    { date: '15/12', score: 7.8 },
    { date: '22/12', score: 8.1 },
    { date: '29/12', score: 7.9 },
    { date: '05/01', score: 8.3 },
  ];

  const attendanceHistory = [
    { date: '05/01/2025', type: 'Entraînement', performance: 8.3, status: 'Présent' },
    { date: '29/12/2024', type: 'Entraînement', performance: 7.9, status: 'Présent' },
    { date: '22/12/2024', type: 'Match', performance: 8.5, status: 'Présent' },
    { date: '15/12/2024', type: 'Entraînement', performance: 7.8, status: 'Présent' },
    { date: '08/12/2024', type: 'Entraînement', performance: null, status: 'Absent' },
  ];

  useEffect(() => {
    fetchPlayerDetails();
  }, [id]);

  const fetchPlayerDetails = async () => {
    try {
      setLoading(true);
      const data = await playersService.getPlayerById(id);
      setPlayer(data);
    } catch (error) {
      console.error('Erreur lors du chargement du joueur:', error);
      // Données factices
      setPlayer({
        id: 1,
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '+33 6 12 34 56 78',
        age: 24,
        team: 'U18 Masculin',
        position: 'Attaquant',
        number: 10,
        photo: 'https://i.pravatar.cc/300?img=1',
        joinDate: '2023-09-01',
        attendanceRate: 92,
        avgPerformance: 8.0,
        cv: 'cv_jean_dupont.pdf',
      });
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

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <p className="text-white">Joueur non trouvé</p>
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
                src={player.photo}
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
                
                <a href={`/api/players/${player.id}/cv`}
                  download
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
                  <p className="text-3xl font-bold text-neon-green">{player.attendanceRate}%</p>
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
                  <p className="text-3xl font-bold text-yellow-500">{player.avgPerformance}/10</p>
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
                  <p className="text-3xl font-bold text-blue-500">24</p>
                </div>
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Calendar size={32} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="mb-8">
            <LineChartComponent
              data={performanceData}
              dataKey="score"
              xKey="date"
              title="Évolution des performances"
            />
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
                  {attendanceHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-dark-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-white">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{item.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.performance ? (
                          <span className="text-neon-green font-semibold">{item.performance}/10</span>
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

export default PlayerDetails;