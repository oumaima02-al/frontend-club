import axiosInstance from './axiosInstance';

const coachesService = {
  // Obtenir tous les coachs
  getAllCoaches: async () => {
    const response = await axiosInstance.get('/coaches');
    return response.data;
  },

  // Obtenir un coach par ID
  getCoachById: async (id) => {
    const response = await axiosInstance.get(`/coaches/${id}`);
    return response.data;
  },

  // Créer un nouveau coach (avec création de compte)
  createCoach: async (formData) => {
    const response = await axiosInstance.post('/coaches', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour un coach
  updateCoach: async (id, formData) => {
    const response = await axiosInstance.post(`/coaches/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer un coach
  deleteCoach: async (id) => {
    const response = await axiosInstance.delete(`/coaches/${id}`);
    return response.data;
  },
};

export default coachesService;