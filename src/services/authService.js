import axiosInstance from './axiosInstance';


const authService = {
  // Connexion
  login: async (email, password) => {
    const response = await axiosInstance.post('/login', { email, password });
    return response.data;
  },

  // Obtenir l'utilisateur connecté
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/me');
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    const response = await axiosInstance.post('/logout');
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (currentPassword, newPassword) => {
    const response = await axiosInstance.put('/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  // Mettre à jour le profil
  updateProfile: async (formData) => {
    const response = await axiosInstance.post('/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default authService;
// Supprimer toutes les fonctions d'inscription