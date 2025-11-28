import axiosInstance from './axiosInstance';

const playersService = {
  // Obtenir tous les joueurs
  getAllPlayers: async () => {
    const response = await axiosInstance.get('/players');
    return response.data;
  },

  // Obtenir un joueur par ID
  getPlayerById: async (id) => {
    const response = await axiosInstance.get(`/players/${id}`);
    return response.data;
  },

  // Créer un nouveau joueur
  createPlayer: async (formData) => {
    const response = await axiosInstance.post('/players', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour un joueur
  updatePlayer: async (id, formData) => {
    const response = await axiosInstance.post(`/players/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer un joueur
  deletePlayer: async (id) => {
    const response = await axiosInstance.delete(`/players/${id}`);
    return response.data;
  },
};

export default playersService;