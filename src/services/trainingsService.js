import axiosInstance from './axiosInstance';

const trainingsService = {
  // Obtenir toutes les séances
  getAllTrainings: async () => {
    const response = await axiosInstance.get('/trainings');
    return response.data;
  },

  // Obtenir une séance par ID
  getTrainingById: async (id) => {
    const response = await axiosInstance.get(`/trainings/${id}`);
    return response.data;
  },

  // Créer une nouvelle séance
  createTraining: async (trainingData) => {
    const response = await axiosInstance.post('/trainings', trainingData);
    return response.data;
  },

  // Mettre à jour une séance
  updateTraining: async (id, trainingData) => {
    const response = await axiosInstance.put(`/trainings/${id}`, trainingData);
    return response.data;
  },

  // Supprimer une séance
  deleteTraining: async (id) => {
    const response = await axiosInstance.delete(`/trainings/${id}`);
    return response.data;
  },

  // Enregistrer la présence et les performances
  recordAttendance: async (trainingId, attendanceData) => {
    const response = await axiosInstance.post(
      `/trainings/${trainingId}/attendance`,
      attendanceData
    );
    return response.data;
  },
};

export default trainingsService;