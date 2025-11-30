import axiosInstance from './axiosInstance';

const statsService = {
  // ✅ Stats Admin
  getAdminStats: async () => {
    const response = await axiosInstance.get('/dashboard/admin/stats');
    return response.data;
  },

  // ✅ Stats Coach
  getCoachStats: async () => {
    const response = await axiosInstance.get('/dashboard/coach/stats');
    return response.data;
  },

  // ✅ Stats Player
  getPlayerStats: async () => {
    const response = await axiosInstance.get('/dashboard/player/stats');
    return response.data;
  },
};

export default statsService;