import axiosInstance from './axiosInstance';

const statsService = {
  // Statistiques globales (Admin)
  getGlobalStats: async () => {
    const response = await axiosInstance.get('/dashboard/stats');
    return response.data;
  },

  // Rapport de présence
  getAttendanceReport: async () => {
    const response = await axiosInstance.get('/dashboard/attendance-report');
    return response.data;
  },

  // Rapport de performance
  getPerformanceReport: async () => {
    const response = await axiosInstance.get('/dashboard/performance-report');
    return response.data;
  },

  // Statistiques de matchs
  getMatchStats: async () => {
    const response = await axiosInstance.get('/dashboard/match-stats');
    return response.data;
  },

  // Top joueurs
  getTopPlayers: async () => {
    const response = await axiosInstance.get('/dashboard/top-players');
    return response.data;
  },

  // Statistiques d'un joueur
  getPlayerStats: async (playerId) => {
    const response = await axiosInstance.get(`/players/${playerId}`);
    return response.data;
  },
};

export default statsService;