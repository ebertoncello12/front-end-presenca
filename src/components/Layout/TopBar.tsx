import React, { useState } from 'react';
import { Bell, LogOut, Sun, Moon, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationsPanel from './NotificationsPanel';
import { Notification } from '../../types/notification';

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Prova Agendada',
    message: 'Prova de Cálculo III marcada para próxima semana - Conteúdo: Derivadas Parciais e Integrais Múltiplas',
    type: 'warning',
    time: '2h atrás',
    read: false,
    category: 'exam',
    priority: 'high',
    link: '/calendario'
  },
  {
    id: '2',
    title: 'Material Disponível',
    message: 'Novo material de Física II disponível no portal - Eletromagnetismo e Lei de Gauss',
    type: 'info',
    time: '5h atrás',
    read: false,
    category: 'academic',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Presença Registrada',
    message: 'Sua presença na aula de Programação Web foi registrada com sucesso',
    type: 'success',
    time: '1d atrás',
    read: true,
    category: 'attendance',
    priority: 'low'
  },
  {
    id: '4',
    title: 'Limite de Faltas',
    message: 'Atenção: Você está próximo do limite de faltas em Física II',
    type: 'error',
    time: '2d atrás',
    read: false,
    category: 'attendance',
    priority: 'high'
  }
];

const TopBar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 dark:text-gray-400">Curso:</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Ciência da Computação
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 dark:text-gray-400">Semestre:</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">
            4º Semestre
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationsPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}
        </div>
        
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.studentName || 'Usuário'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'student' ? 'Aluno' : 'Professor'}
              </span>
            </div>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="relative"
            >
              <img
                src="https://i.ibb.co/kDXYYXd/enzzo.jpg"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            >
              <LogOut size={20} />
            </button>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                {/* Carteirinha de Estudante */}
                <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
                  <div className="absolute top-4 right-4">
                    <GraduationCap className="h-8 w-8 opacity-50" />
                  </div>
                  <div className="flex items-start space-x-4">
                    <img
                      src="https://i.ibb.co/kDXYYXd/enzzo.jpg"
                      alt="Foto do Aluno"
                      className="w-24 h-24 rounded-lg object-cover border-2 border-white/50"
                    />
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-white/70">Nome</p>
                        <p className="font-medium">{user?.name || 'Nome do Aluno'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/70">RA</p>
                        <p className="font-medium">2024001234</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/70">Curso</p>
                        <p className="font-medium">Ciência da Computação</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/70">Semestre</p>
                      <p className="font-medium">4º Semestre</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Validade</p>
                      <p className="font-medium">12/2024</p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <div className="flex items-center space-x-2 opacity-50">
                      <GraduationCap className="h-5 w-5" />
                      <span className="font-semibold">UniPresença</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;