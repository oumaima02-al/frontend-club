import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PlayersTable from '../components/PlayersTable';
import FileUpload from '../components/FileUpload';
import { Plus, X, Search } from 'lucide-react';
import playersService from '../services/playersService';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const PlayersList = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);


  // ✅ UNE SEULE PHOTO PAR DÉFAUT POUR TOUS LES JOUEURS
  const defaultPlayerPhoto = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKIRUzMjZZw7GkeTYxgRmXrU-7YR90CZfGxH75AJY5qrk42jQhjJaNmA7q160XlO1222w&usqp=CAU';

  // ✅ Photos optionnelles pour la galerie (mais par défaut on utilise la même)
  const optionalPlayerPhotos = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKIRUzMjZZw7GkeTYxgRmXrU-7YR90CZfGxH75AJY5qrk42jQhjJaNmA7q160XlO1222w&usqp=CAU',
    'https://media.istockphoto.com/id/472117493/fr/photo/jeune-volley-ball-joueur-en-action.jpg',
    'https://media.istockphoto.com/id/1306125679/fr/photo/jeune-joueur-de-volley-ball-en-action.jpg',
    'https://media.istockphoto.com/id/1322196647/fr/photo/joueur-de-volley-ball-en-action.jpg',
    'https://media.istockphoto.com/id/1397190654/fr/photo/joueur-de-volley-ball-sautant-pour-une-attaque.jpg'
  ];

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
    photo: defaultPlayerPhoto, // ✅ Photo par défaut direct
    cv: null,
  });

  const [photoPreview, setPhotoPreview] = useState(defaultPlayerPhoto); // ✅ Preview avec photo par défaut
  const [cvPreview, setCvPreview] = useState('');
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const data = await playersService.getAllPlayers();
        console.log('📥 Players received:', data);
        
        // ✅ TOUS les joueurs reçoivent la même photo par défaut s'ils n'en ont pas
        const playersWithDefaultPhotos = data.map(player => ({
          ...player,
          photo: player.photo || defaultPlayerPhoto
        }));
        
        setPlayers(playersWithDefaultPhotos);
        setFilteredPlayers(playersWithDefaultPhotos);
      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
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
      
      // ✅ Même traitement - tous avec la même photo par défaut
      const playersWithDefaultPhotos = data.map(player => ({
        ...player,
        photo: player.photo || defaultPlayerPhoto
      }));
      
      setPlayers(playersWithDefaultPhotos);
      setFilteredPlayers(playersWithDefaultPhotos);
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
      setPhotoPreview(defaultPlayerPhoto); // ✅ Retour à la photo par défaut
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

  // ✅ Fonction pour utiliser la photo par défaut
  const useDefaultPhoto = () => {
    setPhotoPreview(defaultPlayerPhoto);
    setFormData({ ...formData, photo: defaultPlayerPhoto });
  };

  // ✅ Fonction pour sélectionner une photo spécifique
  const selectPhoto = (photoUrl) => {
    setPhotoPreview(photoUrl);
    setFormData({ ...formData, photo: photoUrl });
    setShowPhotoGallery(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('🔄 handleSubmit called');

  // Validation
  if (!editingPlayer && formData.password !== formData.password_confirmation) {
    showError('Les mots de passe ne correspondent pas');
    return;
  }

  if (!formData.name || !formData.email || !formData.age || !formData.team || !formData.position || !formData.number) {
    showError('Veuillez remplir tous les champs obligatoires');
    return;
  }

  try {
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      team: formData.team,
      position: formData.position,
      number: parseInt(formData.number),
      phone: formData.phone || '',
      photo: formData.photo,
      cv: formData.cv,
    };

    if (!editingPlayer) {
      dataToSend.password = formData.password;
    }

    console.log('📤 Preparing to send:', dataToSend);

    if (editingPlayer) {
      console.log('🔄 Updating player ID:', editingPlayer.id);
      const updateResult = await playersService.updatePlayer(editingPlayer.id, dataToSend);
      console.log('✅ Update result:', updateResult);
      showSuccess('Joueur modifié avec succès');
    } else {
      console.log('🆕 Creating new player');
      const createResult = await playersService.createPlayer(dataToSend);
      console.log('✅ Create result:', createResult);
      showSuccess('Joueur créé avec succès');
    }

    fetchPlayers();
    closeModal();
  } catch (error) {
    console.error('❌ Full error:', error);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error data:', error.response?.data);
    
    let errorMessage = 'Erreur lors de la sauvegarde';
    
    if (error.response?.status === 405) {
      errorMessage = 'Erreur 405: Méthode non autorisée. Le serveur refuse la requête.';
    } else if (error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).flat().join(', ');
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    showError(errorMessage);
  }
};

 const handleEdit = (player) => {
  console.log('🔄 handleEdit called with player:', player);
  
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
    photo: player.photo || defaultPlayerPhoto,
    cv: null,
  });
  setPhotoPreview(player.photo || defaultPlayerPhoto);
  setShowModal(true);
  
  console.log('✅ Modal should open now');
};

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
      try {
        await playersService.deletePlayer(id);
        fetchPlayers();
        showSuccess('Joueur supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showError(error.response?.data?.error || 'Erreur lors de la suppression du joueur');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowPhotoGallery(false);
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
      photo: defaultPlayerPhoto, // ✅ Retour à la photo par défaut
      cv: null,
    });
    setPhotoPreview(defaultPlayerPhoto); // ✅ Retour à la photo par défaut
    setCvPreview('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  // ✅ Permissions: Admin can manage all players, Coach can manage players from their team
  const canAdd = user?.role === 'admin' || user?.role === 'coach';
  const canEdit = user?.role === 'admin' || user?.role === 'coach';
  const canDelete = user?.role === 'admin' || user?.role === 'coach';

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

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-400'}`}>
              {message}
            </div>
          )}

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
          <div className="bg-dark-800 rounded-xl max-w-4xl w-full my-8 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-2xl font-bold text-white">
                {editingPlayer ? 'Modifier le joueur' : 'Ajouter un joueur'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <FileUpload
                label="CV (PDF)"
                accept=".pdf"
                onChange={handleCvChange}
                preview={cvPreview}
                type="pdf"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ... Les autres champs du formulaire ... */}
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Équipe *</label>
                  <select
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    className="input-field"
                    required
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