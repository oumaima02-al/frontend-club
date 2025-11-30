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

  // ✅ Créer un nouveau coach - CORRIGÉ
  createCoach: async (coachData) => {
    const formData = new FormData();
    
    // ✅ Ajouter les champs requis
    formData.append('name', coachData.name);
    formData.append('email', coachData.email);
    formData.append('password', coachData.password);
    formData.append('team', coachData.team);
    
    if (coachData.phone) {
      formData.append('phone', coachData.phone);
    }
    
    if (coachData.speciality) {
      formData.append('speciality', coachData.speciality);
    }

    if (coachData.photo) {
      formData.append('photo', coachData.photo);
    }

    // ✅ Debug
    console.log('📤 Sending coach data:');
    for (let pair of formData.entries()) {
      console.log(pair[0], ':', pair[1]);
    }

    const response = await axiosInstance.post('/coaches', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // ✅ Mettre à jour un coach - CORRIGÉ
  updateCoach: async (id, coachData) => {
    const formData = new FormData();
    
    formData.append('_method', 'PUT');
    
    if (coachData.name) formData.append('name', coachData.name);
    if (coachData.email) formData.append('email', coachData.email);
    if (coachData.team) formData.append('team', coachData.team);
    if (coachData.phone) formData.append('phone', coachData.phone);
    if (coachData.speciality) formData.append('speciality', coachData.speciality);

    if (coachData.photo) {
      formData.append('photo', coachData.photo);
    }

    console.log('📤 Updating coach:', id);
    for (let pair of formData.entries()) {
      console.log(pair[0], ':', pair[1]);
    }

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