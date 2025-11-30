import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NotificationsList from '../components/NotificationsList';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import notificationsService from '../services/notificationsService';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target_role: 'all', // Use exact values from backend
    type: 'info', // Use exact values from backend
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      // Données factices
      const fakeNotifications = [
        {
          id: 1,
          title: 'Nouvel entraînement planifié',
          message: 'Un nouvel entraînement a été ajouté pour le 15 janvier à 18h00.',
          read: false,
          created_at: '2025-01-10T10:30:00',
        },
        {
          id: 2,
          title: 'Match à venir',
          message: 'N\'oubliez pas le match contre Paris Volley ce samedi.',
          read: true,
          created_at: '2025-01-08T14:20:00',
        },
        {
          id: 3,
          title: 'Réunion d\'équipe',
          message: 'Réunion d\'équipe prévue le 20 janvier à 17h00 au club.',
          read: false,
          created_at: '2025-01-07T09:15:00',
        },
      ];
      setNotifications(fakeNotifications);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await notificationsService.createNotification(formData);
      fetchNotifications();
      closeModal();
      alert('Notification envoyée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi de la notification');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(
        notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      try {
        await notificationsService.deleteNotification(id);
        setNotifications(notifications.filter((notif) => notif.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      title: '',
      message: '',
      target_role: 'all',
      type: 'info',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-gray-400">
                {notifications.filter((n) => !n.read).length} notification(s) non lue(s)
              </p>
            </div>
            {(user?.role === 'admin' || user?.role === 'coach') && (
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
                <Plus size={20} />
                <span>Créer une notification</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <NotificationsList
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-400">Aucune notification</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal Create Notification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-2xl font-bold text-white">Créer une notification</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Titre</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Ex: Nouvel entraînement planifié"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="4"
                  placeholder="Écrivez votre message..."
                  required
                />
              </div>

              {/* Type Field - Updated with exact backend values */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type de notification</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="info">Information</option>
                  <option value="warning">Avertissement</option>
                  <option value="success">Succès</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Target Role Field - Updated with exact backend values */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destinataires</label>
                <select
                  name="target_role"
                  value={formData.target_role}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="all">Tous les membres</option>
                  <option value="player">Joueurs uniquement</option>
                  <option value="coach">Coaches uniquement</option>
                  <option value="admin">Administrateurs uniquement</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;