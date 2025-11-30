import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../routes/ProtectedRoute';
import matchesService from '../services/matchesService';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    opponent_team: '',
    match_date: '',
    match_time: '',
    location: '',
    match_type: 'friendly'
  });

  const { user, hasRole } = useAuth();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await matchService.getAll();
      setMatches(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const matchData = {
        opponent_team: formData.opponent_team,
        match_date: formData.match_date,
        match_time: formData.match_time,
        location: formData.location,
        match_type: formData.match_type
      };
      await matchesService.createMatch(matchData);
      setShowAddForm(false);
      setFormData({ opponent_team: '', match_date: '', match_time: '', location: '', match_type: 'friendly' });
      loadMatches();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du match:', error);
      alert('Erreur lors de l\'ajout du match: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateMatchStatus = async (matchId, status) => {
    try {
      await matchService.updateStatus(matchId, { status });
      loadMatches();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const canManageMatches = hasRole('admin');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredPermission="matches">
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                Calendrier des Matches
              </h1>
              {canManageMatches && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Ajouter un Match
                </button>
              )}
            </div>

            {/* Formulaire d'ajout (Admin seulement) */}
            {showAddForm && canManageMatches && (
              <div className="bg-gray-700 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Nouveau Match</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Adversaire
                    </label>
                    <input
                      type="text"
                      name="opponent_team"
                      value={formData.opponent_team}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Nom de l'équipe adverse"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="match_date"
                      value={formData.match_date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heure
                    </label>
                    <input
                      type="time"
                      name="match_time"
                      value={formData.match_time}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Lieu
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Lieu du match"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type de match
                    </label>
                    <select
                      name="match_type"
                      value={formData.match_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="friendly">Amical</option>
                      <option value="league">Championnat</option>
                      <option value="cup">Coupe</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300"
                    >
                      Créer le Match
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

            {/* Liste des matches */}
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">ClubVolley</div>
                          <div className="text-sm text-gray-300">Domicile</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">VS</div>
                          <div className="text-xs text-gray-400">{match.type}</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{match.opponent}</div>
                          <div className="text-sm text-gray-300">Extérieur</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center space-x-6 text-sm text-gray-300">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {match.location}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(match.date).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        match.status === 'completed' ? 'bg-green-100 text-green-800' :
                        match.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {match.status === 'completed' ? 'Terminé' :
                         match.status === 'ongoing' ? 'En cours' : 'À venir'}
                      </span>
                      
                      {match.status === 'completed' && match.score && (
                        <div className="mt-2 text-lg font-bold text-white">
                          Score: {match.score}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions pour l'admin */}
                  {canManageMatches && (
                    <div className="mt-4 pt-4 border-t border-gray-600 flex space-x-3">
                      <select
                        value={match.status}
                        onChange={(e) => updateMatchStatus(match.id, e.target.value)}
                        className="bg-gray-600 text-white text-sm rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="upcoming">À venir</option>
                        <option value="ongoing">En cours</option>
                        <option value="completed">Terminé</option>
                      </select>
                      
                      {match.status === 'completed' && (
                        <input
                          type="text"
                          placeholder="Score final"
                          className="bg-gray-600 text-white text-sm rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                          onBlur={(e) => matchService.updateScore(match.id, { score: e.target.value })}
                        />
                      )}
                      
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Modifier
                      </button>
                      <button className="text-red-400 hover:text-red-300 text-sm">
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {matches.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Aucun match programmé
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Matches;