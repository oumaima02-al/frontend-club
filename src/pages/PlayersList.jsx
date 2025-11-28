import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PlayersTable from '../components/PlayersTable';
import FileUpload from '../components/FileUpload';
import { Plus, X, Search } from 'lucide-react';
import playersService from '../services/playersService';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    team: '',
    position: '',
    number: '',
    photo: null,
    cv: null,
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [cvPreview, setCvPreview] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    // Filtrer les joueurs selon la recherche
    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase())
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
      // Données factices pour le développement
      const fakePlayers = [
        {
          id: 1,
          name: 'Jean Dupont',
          email: 'jean@example.com',
          age: 24,
          team: 'U18 Masculin',
          position: 'Attaquant',
          number: 10,
          photo: 'https://i.pravatar.cc/150?img=1',
        },
        {
          id: 2,
          name: 'Marie Martin',
          email: 'marie@example.com',
          age: 22,
          team: 'Seniors Féminin',
          position: 'Passeuse',
          number: 5,
          photo: 'https://i.pravatar.cc/150?img=5',
        },
        {
          id: 3,
          name: 'Pierre Lefebvre',
          email: 'pierre@example.com',
          age: 26,
          team: 'Seniors Masculin',
          position: 'Libéro',
          number: 8,
          photo: 'https://i.pravatar.cc/150?img=3',
        },
      ];
      setPlayers(fakePlayers);
      setFilteredPlayers(fakePlayers);
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

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingPlayer) {
        await playersService.updatePlayer(editingPlayer.id, formDataToSend);
      } else {
        await playersService.createPlayer(formDataToSend);
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
      age: player.age,
      team: player.team,
      position: player.position,
      number: player.number,
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
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du joueur');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlayer(null);
    setFormData({
      name: '',
      email: '',
      age: '',
      team: '',
      position: '',
      number: '',
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
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
              <Plus size={20} />
              <span>Ajouter un joueur</span>
            </button>
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
              <PlayersTable players={filteredPlayers} onDelete={handleDelete} onEdit={handleEdit} />
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Âge</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Numéro</label>
                  <input
                    type="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Équipe</label>
                  <select name="team" value={formData.team} onChange={handleInputChange} className="input-field" required>
                    <option value="">Sélectionner une équipe</option>
                    <option value="U18 Masculin">U18 Masculin</option>
                    <option value="Seniors Féminin">Seniors Féminin</option>
                    <option value="Seniors Masculin">Seniors Masculin</option>
                    <option value="Vétérans Mixte">Vétérans Mixte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Poste</label>
                  <select name="position" value={formData.position} onChange={handleInputChange} className="input-field" required>
                    <option value="">Sélectionner un poste</option>
                    <option value="Attaquant">Attaquant</option>
                    <option value="Passeur">Passeur</option>
                    <option value="Central">Central</option>
                    <option value="Libéro">Libéro</option>
                    <option value="Réceptionneur-Attaquant">Réceptionneur-Attaquant</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingPlayer ? 'Mettre à jour' : 'Ajouter'}
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