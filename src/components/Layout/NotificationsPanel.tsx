import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, X, ExternalLink } from 'lucide-react';
import { Notification, NotificationType } from '../../types/notification';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notificações</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              Marcar todas como lidas
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${getNotificationColor(notification.type)} ${
                  !notification.read ? 'bg-opacity-50 dark:bg-opacity-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {notification.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {notification.category}
                          </span>
                        )}
                        {notification.priority && (
                          <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                          </span>
                        )}
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                    {notification.link && (
                      <a
                        href={notification.link}
                        className="mt-2 inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        Ver mais
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Nenhuma notificação no momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;