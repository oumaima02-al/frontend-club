import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PlayersTable from '../components/PlayersTable';
import FileUpload from '../components/FileUpload';
import { Plus, X, Search } from 'lucide-react';
import playersService from '../services/playersService';
import { useAuth } from '../context/AuthContext';

const PlayersList = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    age: '',
    team: '',
    position: '',
    number: '',
    phone: '',
    photo: null,
    cv: null,
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [cvPreview, setCvPreview] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    const filtered = players.filter(
      (player) =>
        (player.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (player.team?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (player.position?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    setFilteredPlayers(filtered);
  }, [searchTerm, players]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await playersService.getAllPlayers();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs:', error);
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

  const handlePhotoChange = (file) => {
    setFormData({ ...formData, photo: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview('');
    }
  };

  const handleCvChange = (file) => {
    setFormData({ ...formData, cv: file });
    if (file) {
      setCvPreview(file.name);
    } else {
      setCvPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingPlayer && formData.password !== formData.password_confirmation) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] && key !== 'password_confirmation') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingPlayer) {
        await playersService.updatePlayer(editingPlayer.id, formDataToSend);
        alert('Joueur modifié avec succès');
      } else {
        await playersService.createPlayer(formDataToSend);
        alert('Joueur créé avec succès');
      }

      fetchPlayers();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du joueur');
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      email: player.email,
      password: '',
      password_confirmation: '',
      age: player.age,
      team: player.team,
      position: player.position,
      number: player.number,
      phone: player.phone || '',
      photo: null,
      cv: null,
    });
    setPhotoPreview(player.photo || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
      try {
        await playersService.deletePlayer(id);
        fetchPlayers();
        alert('Joueur supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(error.response?.data?.error || 'Erreur lors de la suppression du joueur');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlayer(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      age: '',
      team: '',
      position: '',
      number: '',
      phone: '',
      photo: null,
      cv: null,
    });
    setPhotoPreview('');
    setCvPreview('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  // ✅ VÉRIFIER LES PERMISSIONS
  const canAdd = user?.role === 'admin' || user?.role === 'coach';
  const canEdit = user?.role === 'admin';
  const canDelete = user?.role === 'admin';

  // ✅ SI COACH, FILTRER PAR SON ÉQUIPE
  const availableTeams = user?.role === 'coach' && user?.team
    ? [user.team]
    : ['U18 Masculin', 'Seniors Féminin', 'Seniors Masculin', 'U18 Féminin', 'U15 Masculin', 'U15 Féminin'];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gestion des Joueurs</h1>
              <p className="text-gray-400">{players.length} joueurs enregistrés</p>
              {user?.role === 'coach' && user?.team && (
                <p className="text-neon-green text-sm">Équipe : {user.team}</p>
              )}
            </div>
            {canAdd && (
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
                <Plus size={20} />
                <span>Ajouter un joueur</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="card mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un joueur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Players Table */}
          <div className="card">
            {filteredPlayers.length > 0 ? (
              <PlayersTable
                players={filteredPlayers}
                onDelete={canDelete ? handleDelete : null}
                onEdit={canEdit ? handleEdit : null}
                canEdit={canEdit}
              />
            ) : (
              <p className="text-gray-400 text-center py-8">Aucun joueur trouvé</p>
            )}
          </div>
        </main>
      </div>

      {/* Modal Add/Edit Player */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-dark-800 rounded-xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-2xl font-bold text-white">
                {editingPlayer ? 'Modifier le joueur' : 'Ajouter un joueur'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Photo Upload */}
              <FileUpload
                label="Photo du joueur"
                accept="image/*"
                onChange={handlePhotoChange}
                preview={photoPreview}
                type="image"
              />

              {/* CV Upload */}
              <FileUpload
                label="CV (PDF)"
                accept=".pdf"
                onChange={handleCvChange}
                preview={cvPreview}
                type="pdf"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                {!editingPlayer && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-field"
                        required={!editingPlayer}
                        placeholder="Minimum 6 caractères"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer mot de passe *</label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        className="input-field"
                        required={!editingPlayer}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Âge *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    min="10"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Numéro *</label>
                  <input
                    type="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    min="1"
                    max="99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                {/* ✅ ÉQUIPE - Si coach, seulement son équipe */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Équipe *</label>
                  <select
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={user?.role === 'coach'} // Coach ne peut pas changer l'équipe
                  >
                    <option value="">Sélectionner une équipe</option>
                    {availableTeams.map((team) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Poste *</label>
                  <select name="position" value={formData.position} onChange={handleInputChange} className="input-field" required>
                    <option value="">Sélectionner un poste</option>
                    <option value="Attaquant">Attaquant</option>
                    <option value="Passeur">Passeur</option>
                    <option value="Central">Central</option>
                    <option value="Libéro">Libéro</option>
                    <option value="Réceptionneur-Attaquant">Réceptionneur-Attaquant</option>
                    <option value="Pointu">Pointu</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingPlayer ? 'Mettre à jour' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersList;