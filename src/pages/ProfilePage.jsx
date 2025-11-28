import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FileUpload from '../components/FileUpload';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);

  // Profile Info
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  // Password Change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (file) => {
    setProfileData({ ...profileData, avatar: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(user?.avatar || '');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

        try {
        const formData = new FormData();
        formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    if (profileData.avatar) {
        formData.append('avatar', profileData.avatar);
    }

    await authService.updateProfile(formData);
    alert('Profil mis à jour avec succès !');
    } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de la mise à jour du profil');
    } finally {
    setLoading(false);
    }
    };
    const handlePasswordChange = (e) => {
    setPasswordData({
    ...passwordData,
    [e.target.name]: e.target.value,
    });
    };
    const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
  alert('Les mots de passe ne correspondent pas');
  return;
}

setLoading(true);

try {
  await authService.changePassword(
    passwordData.current_password,
    passwordData.new_password
  );
  alert('Mot de passe modifié avec succès !');
  setPasswordData({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
} catch (error) {
  console.error('Erreur:', error);
  alert('Erreur lors du changement de mot de passe');
} finally {
  setLoading(false);
}
};
return (
<div className="min-h-screen bg-dark-900">
<Navbar />
<div className="flex">
<Sidebar />
<main className="flex-1 ml-64 mt-16 p-8">
{/* Header */}
<div className="mb-8">
<h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
<p className="text-gray-400">Gérez vos informations personnelles</p>
</div>
{/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-dark-700">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-4 px-2 font-medium transition ${
            activeTab === 'info'
              ? 'text-neon-green border-b-2 border-neon-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Informations personnelles
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`pb-4 px-2 font-medium transition ${
            activeTab === 'password'
              ? 'text-neon-green border-b-2 border-neon-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Changer le mot de passe
        </button>
      </div>

      {/* Profile Info Tab */}
      {activeTab === 'info' && (
        <div className="card max-w-2xl">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <FileUpload
              label="Photo de profil"
              accept="image/*"
              onChange={handleAvatarChange}
              preview={avatarPreview}
              type="image"
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User size={16} className="inline mr-2" />
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rôle</label>
              <input
                type="text"
                value={user?.role || ''}
                className="input-field bg-dark-600 cursor-not-allowed"
                disabled
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center space-x-2">
              <Save size={20} />
              <span>{loading ? 'Enregistrement...' : 'Sauvegarder les modifications'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="card max-w-2xl">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock size={16} className="inline mr-2" />
                Mot de passe actuel
              </label>
              <input
                type="password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock size={16} className="inline mr-2" />
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock size={16} className="inline mr-2" />
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                name="new_password_confirmation"
                value={passwordData.new_password_confirmation}
                onChange={handlePasswordChange}
                className="input-field"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center space-x-2">
              <Lock size={20} />
              <span>{loading ? 'Modification...' : 'Changer le mot de passe'}</span>
            </button>
          </form>
        </div>
      )}
    </main>
  </div>
</div>
);
};
export default ProfilePage;