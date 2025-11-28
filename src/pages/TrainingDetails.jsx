import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Save, User } from 'lucide-react';
import trainingsService from '../services/trainingsService';
import playersService from '../services/playersService';

const TrainingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState(null);
  const [players, setPlayers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingDetails();
    fetchPlayers();
  }, [id]);

  const fetchTrainingDetails = async () => {
    try {
      setLoading(true);
      const data = await trainingsService.getTrainingById(id);
      setTraining(data);
      
      // Initialiser les présences
      if (data.attendance) {
        const attendanceMap = {};
        data.attendance.forEach((att) => {
          attendanceMap[att.player_id] = {
            present: att.present,
            performance: att.performance || '',
            comment: att.comment || '',
          };
        });
        setAttendance(attendanceMap);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la séance:', error);
      // Données factices
      setTraining({
        id: 1,
        date: '2025-01-15',
        time: '18:00',
        description: 'Entraînement technique - Service et réception',
        location: 'Gymnase principal',
        coach_name: 'Pierre Dubois',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const data = await playersService.getAllPlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs:', error);
      // Données factices
      setPlayers([
        { id: 1, name: 'Jean Dupont', photo: 'https://i.pravatar.cc/150?img=1' },
        { id: 2, name: 'Marie Martin', photo: 'https://i.pravatar.cc/150?img=5' },
        { id: 3, name: 'Pierre Lefebvre', photo: 'https://i.pravatar.cc/150?img=3' },
      ]);
    }
  };

  const handleAttendanceChange = (playerId, field, value) => {
    setAttendance({
      ...attendance,
      [playerId]: {
        ...attendance[playerId],
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const attendanceData = Object.keys(attendance).map((playerId) => ({
        player_id: parseInt(playerId),
        present: attendance[playerId].present || false,
        performance: attendance[playerId].performance || null,
        comment: attendance[playerId].comment || '',
      }));

      await trainingsService.recordAttendance(id, { attendance: attendanceData });
      alert('Présences enregistrées avec succès !');
      navigate('/trainings');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert('Erreur lors de l\'enregistrement des présences');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <p className="text-white">Séance non trouvée</p>
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
            onClick={() => navigate('/trainings')}
            className="flex items-center space-x-2 text-gray-400 hover:text-neon-green mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span>Retour aux séances</span>
          </button>

          {/* Training Info */}
          <div className="card mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">{training.description}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-400">
              <div>
                <p className="text-sm mb-1">Date</p>
                <p className="text-white font-semibold">
                  {new Date(training.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm mb-1">Heure</p>
                <p className="text-white font-semibold">{training.time}</p>
              </div>
              <div>
                <p className="text-sm mb-1">Lieu</p>
                <p className="text-white font-semibold">{training.location}</p>
              </div>
            </div>
          </div>

          {/* Attendance Form */}
          <form onSubmit={handleSubmit}>
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Feuille de présence</h3>
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Save size={20} />
                  <span>Enregistrer les présences</span>
                </button>
              </div>

              <div className="space-y-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-dark-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <img
                        src={player.photo || 'https://i.pravatar.cc/150'}
                        alt={player.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">{player.name}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={attendance[player.id]?.present || false}
                          onChange={(e) =>
                            handleAttendanceChange(player.id, 'present', e.target.checked)
                          }
                          className="w-5 h-5 rounded border-gray-600 text-neon-green focus:ring-neon-green"
                        />
                        <span className="text-gray-300">Présent</span>
                      </label>

                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="Note /10"
                        value={attendance[player.id]?.performance || ''}
                        onChange={(e) =>
                          handleAttendanceChange(player.id, 'performance', e.target.value)
                        }
                        disabled={!attendance[player.id]?.present}
                        className="input-field w-24"
                      />

                      <input
                        type="text"
                        placeholder="Commentaire"
                        value={attendance[player.id]?.comment || ''}
                        onChange={(e) =>
                          handleAttendanceChange(player.id, 'comment', e.target.value)
                        }
                        disabled={!attendance[player.id]?.present}
                        className="input-field flex-1 min-w-[200px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Joueurs présents</p>
              <p className="text-3xl font-bold text-neon-green">
                {Object.values(attendance).filter((a) => a.present).length} / {players.length}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Taux de présence</p>
              <p className="text-3xl font-bold text-blue-500">
                {players.length > 0
                  ? Math.round(
                      (Object.values(attendance).filter((a) => a.present).length / players.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm mb-2">Performance moyenne</p>
              <p className="text-3xl font-bold text-yellow-500">
                {(() => {
                  const scores = Object.values(attendance)
                    .filter((a) => a.present && a.performance)
                    .map((a) => parseFloat(a.performance));
                  return scores.length > 0
                    ? (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1)
                    : '-';
                })()}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainingDetails;