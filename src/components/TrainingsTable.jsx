import React from 'react';
import { Eye, Trash2, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainingsTable = ({ trainings, onDelete, canManage }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDeleteWithAnnounce = (id) => {
    const shouldAnnounce = window.confirm(
      'Voulez-vous notifier les joueurs de cette annulation ?\nCliquez sur "OK" pour notifier, "Annuler" pour supprimer sans notification.'
    );
    
    if (shouldAnnounce !== null) {
      onDelete(id, shouldAnnounce);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-dark-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Heure
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Lieu
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Participants
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700">
          {trainings.map((training) => (
            <tr key={training.id} className="hover:bg-dark-700/50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-neon-green" />
                  <span className="text-white">{formatDate(training.date)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {training.time}
              </td>
              <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                {training.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {training.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    training.status === 'completed'
                      ? 'bg-green-500/10 text-green-500'
                      : training.status === 'upcoming'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}
                >
                  {training.status === 'completed'
                    ? 'Terminée'
                    : training.status === 'upcoming'
                    ? 'À venir'
                    : 'En cours'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {training.participants_count || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/trainings/${training.id}`)}
                    className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition"
                    title="Voir détails"
                  >
                    <Eye size={18} />
                  </button>
                  {canManage && (
                    <button
                      onClick={() => handleDeleteWithAnnounce(training.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingsTable;