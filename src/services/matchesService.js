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
    // Map frontend fields to backend expected fields
    const backendData = {
      opponent_team: matchData.opponent_team,
      match_date: matchData.match_date,
      match_time: matchData.match_time,
      location: matchData.location,
      match_type: matchData.match_type,
      result: matchData.result || 'pending',
      status: matchData.status || 'scheduled',
      notes: matchData.notes || null,
    };

    const response = await axiosInstance.post('/matches', backendData);
    return response.data;
  },

  // Mettre à jour un match
  updateMatch: async (id, matchData) => {
    // Map frontend fields to backend expected fields
    const backendData = {
      opponent_team: matchData.opponent_team,
      match_date: matchData.match_date,
      match_time: matchData.match_time,
      location: matchData.location,
      match_type: matchData.match_type,
      our_score: matchData.our_score || null,
      opponent_score: matchData.opponent_score || null,
      result: matchData.result || 'pending',
      status: matchData.status,
      notes: matchData.notes || null,
    };

    const response = await axiosInstance.put(`/matches/${id}`, backendData);
    return response.data;
  },

  // Supprimer un match
  deleteMatch: async (id) => {
    const response = await axiosInstance.delete(`/matches/${id}`);
    return response.data;
  },
};

export default matchesService;