import axiosInstance from './axiosInstance';

const notificationsService = {
  // Obtenir toutes les notifications
  getAllNotifications: async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },

  // Créer une nouvelle notification
  createNotification: async (notificationData) => {
    const response = await axiosInstance.post('/notifications', notificationData);
    return response.data;
  },

  // Marquer comme lue
  markAsRead: async (id) => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Supprimer une notification
  deleteNotification: async (id) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationsService;