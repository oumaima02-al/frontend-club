import axiosInstance from './axiosInstance';

const playersService = {
  // Obtenir tous les joueurs
  getAllPlayers: async () => {
    const response = await axiosInstance.get('/players');
    return response.data;
  },

  // Obtenir un joueur par ID
  getPlayerById: async (id) => {
    try {
      console.log('🔍 Fetching player with ID:', id);
      const response = await axiosInstance.get(`/players/${id}`);
      console.log('✅ Player API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Player API Error:', error);
      console.error('❌ Error details:', error.response?.data);
      throw error;
    }
  },

  // ✅ Créer un nouveau joueur - CORRIGÉ
  createPlayer: async (playerData) => {
    // ✅ Construire FormData correctement
    const formData = new FormData();
    
    // ✅ Ajouter les champs simples
    formData.append('name', playerData.name);
    formData.append('email', playerData.email);
    formData.append('password', playerData.password);
    formData.append('age', playerData.age);
    formData.append('team', playerData.team);
    formData.append('position', playerData.position);
    formData.append('number', playerData.number);
    
    if (playerData.phone) {
      formData.append('phone', playerData.phone);
    }

    // ✅ Ajouter les fichiers
    if (playerData.photo) {
      formData.append('photo', playerData.photo);
    }

    if (playerData.cv) {
      formData.append('cv', playerData.cv);
    }

    // ✅ Debug - voir ce qu'on envoie
    console.log('📤 Sending player data:');
    for (let pair of formData.entries()) {
      console.log(pair[0], ':', pair[1]);
    }

    const response = await axiosInstance.post('/players', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // ✅ Mettre à jour un joueur - CORRIGÉ
 updatePlayer: async (id, playerData) => {
  const formData = new FormData();
  
  // ✅ Ajouter _method pour Laravel (IMPORTANT)
  formData.append('_method', 'PUT');
  
  // ✅ Ajouter TOUS les champs requis
  formData.append('name', playerData.name || '');
  formData.append('email', playerData.email || '');
  formData.append('age', playerData.age || '');
  formData.append('team', playerData.team || '');
  formData.append('position', playerData.position || '');
  formData.append('number', playerData.number || '');
  formData.append('phone', playerData.phone || '');
  
  // ✅ Gérer la photo (string URL ou fichier)
  if (playerData.photo) {
    if (typeof playerData.photo === 'string') {
      // Si c'est une URL, l'envoyer comme string
      formData.append('photo_url', playerData.photo);
    } else {
      // Si c'est un fichier, l'envoyer comme fichier
      formData.append('photo', playerData.photo);
    }
  }

  if (playerData.cv) {
    formData.append('cv', playerData.cv);
  }

  console.log('📤 Updating player:', id);
  for (let pair of formData.entries()) {
    console.log(pair[0], ':', pair[1]);
  }

  try {
    const response = await axiosInstance.post(`/players/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Update successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Update failed:', error);
    console.error('❌ Error response:', error.response?.data);
    throw error;
  }
},

  // Supprimer un joueur
  deletePlayer: async (id) => {
    const response = await axiosInstance.delete(`/players/${id}`);
    return response.data;
  },
};

export default playersService;