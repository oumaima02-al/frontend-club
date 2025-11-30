import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Save, User, X, Bell } from 'lucide-react';
import trainingsService from '../services/trainingsService';
import playersService from '../services/playersService';
import notificationsService from '../services/notificationsService';
import { useAuth } from '../context/AuthContext';

const TrainingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [training, setTraining] = useState(null);
  const [players, setPlayers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editFormData, setEditFormData] = useState({
    status: '',
    announce_status: false,
  });

  useEffect(() => {
    fetchTrainingDetails();
    fetchPlayers();
  }, [id]);

  const fetchTrainingDetails = async () => {
    try {
      setLoading(true);
      const data = await trainingsService.getTrainingById(id);
      setTraining(data);
      
      setEditFormData({
        status: data.status || 'upcoming',
        announce_status: false,
      });

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
      fetchTrainingDetails();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert('Erreur lors de l\'enregistrement des présences');
    }
  };

  const handleEditStatusChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEditFormData({
      ...editFormData,
      [e.target.name]: value,
    });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    try {
      await trainingsService.updateTraining(id, { status: editFormData.status });

      // Si l'utilisateur veut annoncer le changement de statut
      if (editFormData.announce_status) {
        const statusText = {
          upcoming: 'à venir',
          in_progress: 'en cours',
          completed: 'terminé',
        };

        await notificationsService.createNotification({
          title: 'Changement de statut d\'entraînement',
          message: `L'entraînement du ${new Date(training.date).toLocaleDateString('fr-FR')} est maintenant "${statusText[editFormData.status]}".`,
          target: 'players',
        });
      }

      alert('Statut mis à jour' + (editFormData.announce_status ? ' et notifié' : ''));
      setShowEditModal(false);
      fetchTrainingDetails();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du statut');
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

  const canManage = user?.role === 'coach' || user?.role === 'admin';

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
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-4">{training.description}</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-400">
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
                    <p className="text-white font-semibold">{training.start_time} - {training.end_time}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1">Lieu</p>
                    <p className="text-white font-semibold">{training.location}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1">Statut</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        training.status === 'completed'
                          ? 'bg-green-500/10 text-green-500'
                          : training.status === 'upcoming'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {training.status === 'completed'
                        ? 'Terminée'
                        : training.status === 'upcoming'
                        ? 'À venir'
                        : 'En cours'}
                    </span>
                  </div>
                </div>
              </div>

              {canManage && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <span>Modifier le statut</span>
                </button>
              )}
            </div>
          </div>

          {/* Attendance Form */}
          {canManage ? (
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
                        <div>
                          <span className="text-white font-medium block">{player.name}</span>
                          <span className="text-gray-400 text-sm">{player.team} - {player.position}</span>
                        </div>
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
                          step="0.5"
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
          ) : (
            <div className="card mb-6">
              <h3 className="text-xl font-semibold text-white mb-6">Liste des participants</h3>
              <div className="space-y-4">
                {players.map((player) => (
                  <div key={player.id} className="bg-dark-700 rounded-lg p-4 flex items-center space-x-3">
                    <img
                      src={player.photo || 'https://i.pravatar.cc/150'}
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <span className="text-white font-medium block">{player.name}</span>
                      <span className="text-gray-400 text-sm">{player.team} - {player.position}</span>
                    </div>
                    {attendance[player.id]?.present && (
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                        Présent
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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

      {/* Modal Edit Status */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-2xl font-bold text-white">Modifier le statut</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nouveau statut</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditStatusChange}
                  className="input-field"
                  required
                >
                  <option value="upcoming">À venir</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminée</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="announce_status"
                  name="announce_status"
                  checked={editFormData.announce_status}
                  onChange={handleEditStatusChange}
                  className="w-5 h-5 rounded border-gray-600 text-neon-green focus:ring-neon-green"
                />
                <label htmlFor="announce_status" className="text-gray-300 cursor-pointer flex items-center space-x-2">
                  <Bell size={16} />
                  <span>Notifier les joueurs du changement de statut</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDetails;