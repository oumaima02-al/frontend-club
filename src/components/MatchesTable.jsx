import React from 'react';
import { Trophy, Calendar, Edit, Trash2, Bell } from 'lucide-react';

const MatchesTable = ({ matches, onEdit, onDelete }) => {
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
      'Voulez-vous notifier les membres de cette annulation ?\nCliquez sur "OK" pour notifier, "Annuler" pour supprimer sans notification.'
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
              Équipe 1
            </th>
            <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Équipe 2
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Lieu
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Statut
            </th>
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700">
          {matches.map((match) => (
            <tr key={match.id} className="hover:bg-dark-700/50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-neon-green" />
                  <span className="text-white">{formatDate(match.match_date)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                Notre équipe
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-bold text-neon-green">
                    {match.our_score ?? '-'}
                  </span>
                  <span className="text-gray-500">:</span>
                  <span className="text-2xl font-bold text-neon-green">
                    {match.opponent_score ?? '-'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                {match.opponent_team}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {match.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    match.status === 'completed'
                      ? 'bg-green-500/10 text-green-500'
                      : match.status === 'upcoming'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}
                >
                  {match.status === 'completed'
                    ? 'Terminé'
                    : match.status === 'upcoming'
                    ? 'À venir'
                    : 'En cours'}
                </span>
              </td>
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(match)}
                        className="p-2 text-neon-green hover:bg-neon-green/10 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => handleDeleteWithAnnounce(match.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchesTable;