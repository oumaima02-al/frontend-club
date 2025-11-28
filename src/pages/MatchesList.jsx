import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MatchesTable from '../components/MatchesTable';
import { Plus, X, Search } from 'lucide-react';
import matchesService from '../services/matchesService';

const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    team1: '',
    team2: '',
    location: '',
    score1: '',
    score2: '',
    status: 'upcoming',
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    const filtered = matches.filter(
      (match) =>
        match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMatches(filtered);
  }, [searchTerm, matches]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await matchesService.getAllMatches();
      setMatches(data);
      setFilteredMatches(data);
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
      // Données factices
      const fakeMatches = [
        {
          id: 1,
          date: '2025-01-15',
          time: '18:00',
          team1: 'VolleyClub A',
          team2: 'Paris Volley',
          location: 'Domicile',
          score1: 3,
          score2: 1,
          status: 'completed',
        },
        {
          id: 2,
          date: '2025-01-22',
          time: '20:00',
          team1: 'Lyon Volley',
          team2: 'VolleyClub A',
          location: 'Extérieur',
          score1: null,
          score2: null,
          status: 'upcoming',
        },
        {
          id: 3,
          date: '2025-01-29',
          time: '19:00',
          team1: 'VolleyClub A',
          team2: 'Marseille Volley',
          location: 'Domicile',
          score1: null,
          score2: null,
          status: 'upcoming',
        },
      ];
      setMatches(fakeMatches);
      setFilteredMatches(fakeMatches);
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
      await matchesService.createMatch(formData);
      fetchMatches();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création du match');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      date: '',
      time: '',
      team1: '',
      team2: '',
      location: '',
      score1: '',
      score2: '',
      status: 'upcoming',
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
              <h1 className="text-3xl font-bold text-white mb-2">Gestion des Matchs</h1>
              <p className="text-gray-400">{matches.length} matchs enregistrés</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
              <Plus size={20} />
              <span>Ajouter un match</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="card mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un match..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Matches Table */}
          <div className="card">
            {filteredMatches.length > 0 ? (
              <MatchesTable matches={filteredMatches} />
            ) : (
              <p className="text-gray-400 text-center py-8">Aucun match trouvé</p>
            )}
          </div>
        </main>
      </div>

      {/* Modal Create Match */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-2xl font-bold text-white">Ajouter un match</h2>
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Équipe 1</label>
                  <input
                    type="text"
                    name="team1"
                    value={formData.team1}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Ex: VolleyClub A"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Équipe 2</label>
                  <input
                    type="text"
                    name="team2"
                    value={formData.team2}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Ex: Paris Volley"
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
                    placeholder="Ex: Domicile"
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
                    required
                  >
                    <option value="upcoming">À venir</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminé</option>
                  </select>
                </div>

                {formData.status === 'completed' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Score Équipe 1</label>
                      <input
                        type="number"
                        name="score1"
                        value={formData.score1}
                        onChange={handleInputChange}
                        className="input-field"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Score Équipe 2</label>
                      <input
                        type="number"
                        name="score2"
                        value={formData.score2}
                        onChange={handleInputChange}
                        className="input-field"
                        min="0"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Ajouter le match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesList;