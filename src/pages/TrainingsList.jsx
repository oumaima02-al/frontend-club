import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TrainingsTable from '../components/TrainingsTable';
import { Plus, X, Search } from 'lucide-react';
import trainingsService from '../services/trainingsService';

const TrainingsList = () => {
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
    coach_id: '',
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    const filtered = trainings.filter(
      (training) =>
        training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.coach_name.toLowerCase().includes(searchTerm.toLowerCase())
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
      // Données factices
      const fakeTrainings = [
        {
          id: 1,
          date: '2025-01-15',
          time: '18:00',
          description: 'Entraînement technique - Service et réception',
          location: 'Gymnase principal',
          coach_name: 'Pierre Dubois',
          participants_count: 15,
        },
        {
          id: 2,
          date: '2025-01-17',
          time: '19:00',
          description: 'Préparation physique et cardio',
          location: 'Salle de fitness',
          coach_name: 'Marie Laurent',
          participants_count: 12,
        },
        {
          id: 3,
          date: '2025-01-20',
          time: '18:30',
          description: 'Match amical - Équipe A vs Équipe B',
          location: 'Terrain extérieur',
          coach_name: 'Pierre Dubois',
          participants_count: 20,
        },
      ];
      setTrainings(fakeTrainings);
      setFilteredTrainings(fakeTrainings);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await trainingsService.createTraining(formData);
      fetchTrainings();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de la séance');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      try {
        await trainingsService.deleteTraining(id);
        fetchTrainings();
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
      coach_id: '',
    });
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gestion des Entraînements</h1>
              <p className="text-gray-400">{trainings.length} séances planifiées</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
              <Plus size={20} />
              <span>Créer une séance</span>
            </button>
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
              <TrainingsTable trainings={filteredTrainings} onDelete={handleDelete} />
            ) : (
              <p className="text-gray-400 text-center py-8">Aucune séance trouvée</p>
            )}
          </div>
        </main>
      </div>

      {/* Modal Create Training */}
      {showModal && (
        <div className ="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Heure</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Lieu</label>
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
  )}
</div>
);
};
export default TrainingsList;