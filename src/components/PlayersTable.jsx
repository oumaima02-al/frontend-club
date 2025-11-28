import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlayersTable = ({ players, onDelete, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-dark-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Photo
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Équipe
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Poste
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Numéro
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Âge
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700">
          {players.map((player) => (
            <tr key={player.id} className="hover:bg-dark-700/50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={player.photo || '/default-avatar.png'}
                  alt={player.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                {player.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {player.team}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {player.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {player.number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {player.age} ans
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/players/${player.id}`)}
                    className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition"
                    title="Voir"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(player)}
                    className="p-2 text-neon-green hover:bg-neon-green/10 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(player.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersTable;