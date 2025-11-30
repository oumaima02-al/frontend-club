import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MatchesTable from '../components/MatchesTable';
import { Plus, X, Search, Edit } from 'lucide-react';
import matchesService from '../services/matchesService';
import notificationsService from '../services/notificationsService';
import { useAuth } from '../context/AuthContext';

const MatchesList = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  const [formData, setFormData] = useState({
    match_date: '',
    match_time: '',
    opponent_team: '',
    location: '',
    our_score: '',
    opponent_score: '',
    result: 'pending',
    status: 'scheduled',
    match_type: 'friendly',
    notes: '',
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    const filtered = matches.filter(
      (match) =>
        (match.team1 || match.opponent_team || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (match.team2 || match.opponent_team || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      if (editingMatch) {
        await matchesService.updateMatch(editingMatch.id, formData);

        // Si annonce de modification et changement de statut
        if (formData.announce) {
          const statusText = {
            scheduled: 'programmé',
            completed: 'terminé',
            cancelled: 'annulé',
          };

          await notificationsService.createNotification({
            title: 'Mise à jour de match',
            message: `Le match contre ${formData.opponent_team} est maintenant "${statusText[formData.status]}".${
              formData.status === 'completed' && formData.our_score && formData.opponent_score
                ? ` Score final: ${formData.our_score} - ${formData.opponent_score}`
                : ''
            }`,
            type: 'info',
            target_role: 'all',
          });
        }

        alert('Match mis à jour avec succès' + (formData.announce ? ' et annoncé' : ''));
      } else {
        await matchesService.createMatch(formData);

        // Si annonce de création
        if (formData.announce) {
          await notificationsService.createNotification({
            title: 'Nouveau match planifié',
            message: `Un match contre ${formData.opponent_team} a été planifié le ${new Date(
              formData.match_date
            ).toLocaleDateString('fr-FR')} à ${formData.match_time}. Lieu: ${formData.location}`,
            type: 'info',
            target_role: 'all',
          });
        }

        alert('Match créé avec succès' + (formData.announce ? ' et annoncé' : ''));
      }

      fetchMatches();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du match');
    }
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
    setFormData({
      match_date: match.match_date || match.date,
      match_time: match.match_time || match.time || '',
      opponent_team: match.opponent_team || match.team2 || '',
      location: match.location,
      our_score: match.our_score || match.score1 || '',
      opponent_score: match.opponent_score || match.score2 || '',
      result: match.result || 'pending',
      status: match.status || 'scheduled',
      match_type: match.match_type || 'friendly',
      notes: match.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id, shouldAnnounce = false) => {
    const confirmMessage = shouldAnnounce
      ? 'Voulez-vous supprimer ce match ET en notifier tous les membres ?'
      : 'Êtes-vous sûr de vouloir supprimer ce match ?';

    if (window.confirm(confirmMessage)) {
      try {
        const match = matches.find((m) => m.id === id);

        await matchesService.deleteMatch(id);

        // Si demande d'annonce
        if (shouldAnnounce && match) {
          await notificationsService.createNotification({
            title: 'Match annulé',
            message: `Le match contre ${match.opponent_team} prévu le ${new Date(
              match.match_date
            ).toLocaleDateString('fr-FR')} à ${match.match_time} a été annulé.`,
            type: 'warning',
            target_role: 'all',
          });
        }

        fetchMatches();
        alert('Match supprimé' + (shouldAnnounce ? ' et annulation notifiée' : ''));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du match');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMatch(null);
    setFormData({
      match_date: '',
      match_time: '',
      opponent_team: '',
      location: '',
      our_score: '',
      opponent_score: '',
      result: 'pending',
      status: 'scheduled',
      match_type: 'friendly',
      notes: '',
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

  const canManage = user?.role === 'admin';

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
            {canManage && (
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
                <Plus size={20} />
                <span>Ajouter un match</span>
              </button>
            )}
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
              <MatchesTable
                matches={filteredMatches}
                onEdit={canManage ? handleEdit : null}
                onDelete={canManage ? handleDelete : null}
              />
            ) : (
              <p className="text-gray-400 text-center py-8">Aucun match trouvé</p>
            )}
          </div>
        </main>
      </div>

      {/* Modal Add/Edit Match */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-2xl font-bold text-white">
                {editingMatch ? 'Modifier le match' : 'Ajouter un match'}
              </h2>
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
                    name="match_date"
                    value={formData.match_date}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Heure *</label>
                  <input
                    type="time"
                    name="match_time"
                    value={formData.match_time}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Équipe adverse *</label>
                  <input
                    type="text"
                    name="opponent_team"
                    value={formData.opponent_team}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Ex: Paris Volley"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type de match</label>
                  <select
                    name="match_type"
                    value={formData.match_type}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="friendly">Amical</option>
                    <option value="league">Championnat</option>
                    <option value="cup">Coupe</option>
                    <option value="tournament">Tournoi</option>
                  </select>
                </div>

                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Informations supplémentaires sur le match..."
                    rows="3"
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
                    <option value="scheduled">Programmé</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Résultat</label>
                  <select
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="pending">En attente</option>
                    <option value="win">Victoire</option>
                    <option value="loss">Défaite</option>
                    <option value="draw">Match nul</option>
                  </select>
                </div>

                {formData.status === 'completed' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Notre score</label>
                      <input
                        type="number"
                        name="our_score"
                        value={formData.our_score}
                        onChange={handleInputChange}
                        className="input-field"
                        min="0"
                        placeholder="Score"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Score adverse</label>
                      <input
                        type="number"
                        name="opponent_score"
                        value={formData.opponent_score}
                        onChange={handleInputChange}
                        className="input-field"
                        min="0"
                        placeholder="Score"
                      />
                    </div>
                  </>
                )}
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
                  {editingMatch
                    ? 'Notifier tous les membres de cette modification'
                    : 'Notifier tous les membres de ce nouveau match'}
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingMatch ? 'Mettre à jour' : 'Ajouter le match'}
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