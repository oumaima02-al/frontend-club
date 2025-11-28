import axiosInstance from './axiosInstance';

const statsService = {
  // Statistiques globales (Admin)
  getGlobalStats: async () => {
    const response = await axiosInstance.get('/stats/global');
    return response.data;
  },

  // Statistiques par équipe
  getTeamStats: async () => {
    const response = await axiosInstance.get('/stats/teams');
    return response.data;
  },

  // Statistiques de présence
  getAttendanceStats: async () => {
    const response = await axiosInstance.get('/stats/attendance');
    return response.data;
  },

  // Statistiques d'un joueur
  getPlayerStats: async (playerId) => {
    const response = await axiosInstance.get(`/stats/players/${playerId}`);
    return response.data;
  },
};

export default statsService;