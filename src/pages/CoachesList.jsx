import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Plus, X, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import coachesService from '../services/coachesService';
import FileUpload from '../components/FileUpload';

const CoachsList = () => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    speciality: '',
    team: '', // ✅ AJOUTÉ
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchCoaches();
  }, []);

  useEffect(() => {
    const filtered = coaches.filter(
      (coach) =>
        coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coach.team && coach.team.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCoaches(filtered);
  }, [searchTerm, coaches]);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const data = await coachesService.getAllCoaches();
      setCoaches(data);
      setFilteredCoaches(data);
    } catch (error) {
      console.error('Erreur lors du chargement des coachs:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingCoach && formData.password !== formData.password_confirmation) {
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

      if (editingCoach) {
        await coachesService.updateCoach(editingCoach.id, formDataToSend);
        alert('Coach modifié avec succès');
      } else {
        await coachesService.createCoach(formDataToSend);
        alert('Coach créé avec succès');
      }

      fetchCoaches();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du coach');
    }
  };

  const handleEdit = (coach) => {
    setEditingCoach(coach);
    setFormData({
      name: coach.name,
      email: coach.email,
      password: '',
      password_confirmation: '',
      phone: coach.phone || '',
      speciality: coach.speciality || '',
      team: coach.team || '', // ✅ AJOUTÉ
      photo: null,
    });
    setPhotoPreview(coach.photo || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce coach ?')) {
      try {
        await coachesService.deleteCoach(id);
        fetchCoaches();
        alert('Coach supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du coach');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoach(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      speciality: '',
      team: '', // ✅ AJOUTÉ
      photo: null,
    });
    setPhotoPreview('');
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
              <h1 className="text-3xl font-bold text-white mb-2">Gestion des Coachs</h1>
              <p className="text-gray-400">{coaches.length} coachs enregistrés</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
              <Plus size={20} />
              <span>Ajouter un coach</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="card mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un coach (nom, email, équipe)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Coaches Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    {/* ✅ NOUVELLE COLONNE ÉQUIPE */}
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Équipe
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Spécialité
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {filteredCoaches.map((coach) => (
                    <tr key={coach.id} className="hover:bg-dark-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={coach.photo || '/default-avatar.png'}
                          alt={coach.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                        {coach.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {coach.email}
                      </td>
                      {/* ✅ AFFICHAGE DE L'ÉQUIPE */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coach.team ? (
                          <span className="px-3 py-1 bg-neon-green/10 text-neon-green rounded-full text-xs font-medium">
                            {coach.team}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">Non assigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {coach.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {coach.speciality || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/coaches/${coach.id}`)}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition"
                            title="Voir"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(coach)}
                            className="p-2 text-neon-green hover:bg-neon-green/10 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(coach.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Message si aucun coach */}
              {filteredCoaches.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">Aucun coach trouvé</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Add/Edit Coach */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-dark-800 rounded-xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-2xl font-bold text-white">
                {editingCoach ? 'Modifier le coach' : 'Ajouter un coach'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Photo Upload */}
              <FileUpload
                label="Photo du coach"
                accept="image/*"
                onChange={handlePhotoChange}
                preview={photoPreview}
                type="image"
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

                {/* ✅ CHAMP ÉQUIPE */}
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
                    <option value="U18 Masculin">U18 Masculin</option>
                    <option value="Seniors Féminin">Seniors Féminin</option>
                    <option value="Seniors Masculin">Seniors Masculin</option>
                    <option value="U18 Féminin">U18 Féminin</option>
                    <option value="U15 Masculin">U15 Masculin</option>
                    <option value="U15 Féminin">U15 Féminin</option>
                  </select>
                </div>

                {!editingCoach && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-field"
                        required={!editingCoach}
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
                        required={!editingCoach}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Ex: 0612345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Spécialité</label>
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Ex: Préparation physique"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingCoach ? 'Mettre à jour' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachsList;