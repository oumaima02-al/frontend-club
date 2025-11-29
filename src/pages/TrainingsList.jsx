import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TrainingsTable from '../components/TrainingsTable';
import { Plus, X, Search } from 'lucide-react';
import trainingsService from '../services/trainingsService';
import notificationsService from '../services/notificationsService';
import { useAuth } from '../context/AuthContext';

const TrainingsList = () => {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: '',
    location: '',
    status: 'upcoming',
    announce: false,
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    const filtered = trainings.filter(
      (training) =>
        training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrainings(filtered);
  }, [searchTerm, trainings]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const data = await trainingsService.getAllTrainings();
      setTrainings(data);
      setFilteredTrainings(data);
    } catch (error) {
      console.error('Erreur lors du chargement des séances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await trainingsService.createTraining(formData);

      // Si l'utilisateur a coché "Annoncer"
      if (formData.announce) {
        await notificationsService.createNotification({
          title: 'Nouvel entraînement planifié',
          message: `Un entraînement a été planifié le ${new Date(formData.date).toLocaleDateString('fr-FR')} à ${formData.time}. Lieu: ${formData.location}`,
          target: 'players',
        });
      }

      alert('Entraînement créé avec succès' + (formData.announce ? ' et annoncé aux joueurs' : ''));
      fetchTrainings();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de la séance');
    }
  };

  const handleDelete = async (id, shouldAnnounce = false) => {
    const confirmMessage = shouldAnnounce
      ? 'Voulez-vous supprimer cet entraînement ET en notifier les joueurs ?'
      : 'Êtes-vous sûr de vouloir supprimer cet entraînement ?';

    if (window.confirm(confirmMessage)) {
      try {
        const training = trainings.find(t => t.id === id);
        
        await trainingsService.deleteTraining(id);

        // Si demande d'annonce
        if (shouldAnnounce && training) {
          await notificationsService.createNotification({
            title: 'Entraînement annulé',
            message: `L'entraînement du ${new Date(training.date).toLocaleDateString('fr-FR')} à ${training.time} a été annulé.`,
            target: 'players',
          });
        }

        fetchTrainings();
        alert('Entraînement supprimé' + (shouldAnnounce ? ' et annulation notifiée' : ''));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la séance');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      date: '',
      time: '',
      description: '',
      location: '',
      status: 'upcoming',
      announce: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  const canCreate = user?.role === 'coach' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gestion des Entraînements</h1>
              <p className="text-gray-400">{trainings.length} séances planifiées</p>
            </div>
            {canCreate && (
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
                <Plus size={20} />
                <span>Créer une séance</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="card mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher une séance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Trainings Table */}
          <div className="card">
            {filteredTrainings.length > 0 ? (
              <TrainingsTable 
                trainings={filteredTrainings} 
                onDelete={handleDelete}
                canManage={canCreate}
              />
            ) : (
              <p className="text-gray-400 text-center py-8">Aucune séance trouvée</p>
            )}
          </div>
        </main>
      </div>

      {/* Modal Create Training */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-2xl font-bold text-white">Créer une séance d'entraînement</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Heure *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
                  placeholder="Ex: Entraînement technique - Service et réception"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lieu *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Ex: Gymnase principal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleInputChange} 
                  className="input-field"
                >
                  <option value="upcoming">À venir</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminée</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="announce"
                  name="announce"
                  checked={formData.announce}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-600 text-neon-green focus:ring-neon-green"
                />
                <label htmlFor="announce" className="text-gray-300 cursor-pointer">
                  Notifier tous les joueurs de ce nouvel entraînement</label> </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              Créer la séance
            </button>
          </div>
        </form>
      </div>
    </div>
  )};
</div>
);
};
export default TrainingsList;
