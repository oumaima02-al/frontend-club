import React from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';

const NotificationsList = ({ notifications, onMarkAsRead, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div 
          key={notif.id}
          className={`card flex items-start justify-between ${!notif.read ? 'border-l-4 border-neon-green' : ''}`}
        >
          <div className="flex items-start space-x-4 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                !notif.read ? 'bg-neon-green/20' : 'bg-dark-700'
              }`}
            >
              <Bell 
                size={20} 
                className={!notif.read ? 'text-neon-green' : 'text-gray-400'} 
              />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-1">{notif.title}</h4>
              <p className="text-gray-400 text-sm mb-2">{notif.message}</p>
              <span className="text-gray-500 text-xs">{formatDate(notif.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!notif.read && (
              <button
                onClick={() => onMarkAsRead(notif.id)}
                className="p-2 text-neon-green hover:bg-neon-green/10 rounded-lg transition"
                title="Marquer comme lu"
              >
                <Check size={18} />
              </button>
            )}
            <button
              onClick={() => onDelete(notif.id)}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;