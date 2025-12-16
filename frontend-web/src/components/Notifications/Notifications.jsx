import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [nonLuesCount, setNonLuesCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Charger les notifications
  const loadNotifications = async () => {
    if (!userId) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/etudiant/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      }
    } catch (err) {
      console.error("Erreur chargement notifications:", err);
    }
  };

  // Charger le nombre de notifications non lues
  const loadNonLuesCount = async () => {
    if (!userId) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/etudiant/${userId}/count`);
      if (res.ok) {
        const data = await res.json();
        setNonLuesCount(data.count || 0);
      }
    } catch (err) {
      console.error("Erreur chargement count:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      loadNotifications();
      loadNonLuesCount();
      
      // Rafraîchir toutes les 30 secondes
      const interval = setInterval(() => {
        loadNotifications();
        loadNonLuesCount();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Marquer une notification comme lue
  const marquerCommeLu = async (notificationId, examenId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/${notificationId}/lu`, {
        method: 'PUT',
      });
      if (res.ok) {
        // Mettre à jour l'état local
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, lu: true } : n)
        );
        setNonLuesCount(prev => Math.max(0, prev - 1));
        
        // Rediriger vers l'examen si disponible
        if (examenId) {
          navigate(`/etudiant/exams/${examenId}`);
          setIsOpen(false);
        }
      }
    } catch (err) {
      console.error("Erreur marquer comme lu:", err);
    }
  };

  // Marquer toutes comme lues
  const marquerToutesCommeLues = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/etudiant/${userId}/toutes-lues`, {
        method: 'PUT',
      });
      if (res.ok) {
        await loadNotifications();
        await loadNonLuesCount();
      }
    } catch (err) {
      console.error("Erreur marquer toutes comme lues:", err);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une notification
  const supprimerNotification = async (notificationId, e) => {
    e.stopPropagation(); // Empêcher le clic de déclencher marquerCommeLu
    
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Retirer la notification de la liste
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        // Mettre à jour le compteur si la notification n'était pas lue
        const notif = notifications.find(n => n.id === notificationId);
        if (notif && !notif.lu) {
          setNonLuesCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error("Erreur suppression notification:", err);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {nonLuesCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {nonLuesCount > 9 ? '9+' : nonLuesCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <div className="flex items-center gap-2">
              {nonLuesCount > 0 && (
                <button
                  onClick={marquerToutesCommeLues}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  {loading ? '...' : 'Tout marquer comme lu'}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notif.lu ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        !notif.lu ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => marquerCommeLu(notif.id, notif.examenId)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-semibold ${
                            !notif.lu ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notif.titre}
                          </h4>
                          <div className="flex items-center gap-2">
                            {!notif.lu && (
                              <span className="flex-shrink-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                Nouveau
                              </span>
                            )}
                            <button
                              onClick={(e) => supprimerNotification(notif.id, e)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
                              title="Supprimer la notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(notif.dateCreation)}
                          </span>
                          {notif.examenId && (
                            <span className="text-xs text-blue-600 font-medium">
                              Voir l'examen →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;

