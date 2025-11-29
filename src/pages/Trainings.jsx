import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { trainingService } from '../services/trainings';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    duration: '90',
    objectives: '',
    notes: ''
  });

  const { user, hasRole } = useAuth();

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const response = await trainingService.getAll();
      setTrainings(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des entraînements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await trainingService.create(formData);
      setShowAddForm(false);
      setFormData({ title: '', date: '', duration: '90', objectives: '', notes: '' });
      loadTrainings();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entraînement:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const canManageTrainings = hasRole('admin') || hasRole('coach');
  const isCoach = hasRole('coach');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredPermission="trainings">
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                Planning des Entraînements
              </h1>
              {canManageTrainings && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Ajouter un Entraînement
                </button>
              )}
            </div>

            {/* Formulaire d'ajout (Admin et Coach) */}
            {showAddForm && canManageTrainings && (
              <div className="bg-gray-700 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Nouvel Entraînement</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Titre de l'entraînement
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ex: Entraînement technique"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date et heure
                      </label>
                      <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Durée (minutes)
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                        <option value="120">120 minutes</option>
                        <option value="150">150 minutes</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Objectifs
                    </label>
                    <textarea
                      name="objectives"
                      value={formData.objectives}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Objectifs de cette séance..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes supplémentaires
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Équipement nécessaire, consignes spéciales..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300"
                    >
                      Planifier l'Entraînement
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition duration-300"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Liste des entraînements */}
            <div className="space-y-4">
              {trainings.map((training) => (
                <div key={training.id} className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {training.title}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(training.date).toLocaleString('fr-FR')}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {training.duration} minutes
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            training.status === 'completed' ? 'bg-green-100 text-green-800' :
                            training.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {training.status === 'completed' ? 'Terminé' :
                             training.status === 'ongoing' ? 'En cours' : 'À venir'}
                          </span>
                        </div>
                      </div>

                      {training.objectives && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-300 mb-1">Objectifs :</h4>
                          <p className="text-sm text-gray-400">{training.objectives}</p>
                        </div>
                      )}

                      {training.notes && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-300 mb-1">Notes :</h4>
                          <p className="text-sm text-gray-400">{training.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions selon le rôle */}
                    <div className="flex space-x-2 ml-4">
                      {isCoach && training.status === 'upcoming' && (
                        <>
                          <button 
                            onClick={() => trainingService.updateStatus(training.id, { status: 'ongoing' })}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                          >
                            Démarrer
                          </button>
                          <button 
                            onClick={() => trainingService.updateStatus(training.id, { status: 'completed' })}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                          >
                            Terminer
                          </button>
                        </>
                      )}
                      
                      {canManageTrainings && (
                        <button className="text-red-400 hover:text-red-300 text-sm">
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section présence/performance (Coach seulement) */}
                  {isCoach && training.status === 'completed' && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">
                        Gestion des présences et performances
                      </h4>
                      <div className="space-y-2">
                        {/* Liste des joueurs avec statut de présence */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">Joueur 1</span>
                          <select className="bg-gray-600 text-white text-sm rounded px-2 py-1">
                            <option value="present">Présent</option>
                            <option value="absent">Absent</option>
                            <option value="excused">Excusé</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder="Note performance"
                            className="bg-gray-600 text-white text-sm rounded px-2 py-1 w-24"
                          />
                        </div>
                        {/* Répéter pour chaque joueur */}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {trainings.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Aucun entraînement planifié
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Trainings;