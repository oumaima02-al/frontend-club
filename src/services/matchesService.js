import axiosInstance from './axiosInstance';

const matchesService = {
  // Obtenir tous les matchs
  getAllMatches: async () => {
    const response = await axiosInstance.get('/matches');
    return response.data;
  },

  // Obtenir un match par ID
  getMatchById: async (id) => {
    const response = await axiosInstance.get(`/matches/${id}`);
    return response.data;
  },

  // Créer un nouveau match
  createMatch: async (matchData) => {
    const response = await axiosInstance.post('/matches', matchData);
    return response.data;
  },

  // Mettre à jour un match
  updateMatch: async (id, matchData) => {
    const response = await axiosInstance.put(`/matches/${id}`, matchData);
    return response.data;
  },

  // Supprimer un match
  deleteMatch: async (id) => {
    const response = await axiosInstance.delete(`/matches/${id}`);
    return response.data;
  },
};

export default matchesService;