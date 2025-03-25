import React, { useState } from 'react';
import { Bell, LogOut, Sun, Moon, GraduationCap, Book, Calendar, ClipboardList, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationsPanel from './NotificationsPanel';
import { Notification } from '../../types/notification';

const mockProfessorNotifications: Notification[] = [
  {
    id: '1',
    title: 'Entrega de Notas',
    message: 'Prazo para entrega das notas do primeiro bimestre termina em 3 dias',
    type: 'warning',
    time: '2h atrás',
    read: false,
    category: 'academic',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Nova Atividade',
    message: 'Alunos enviaram 5 novas atividades para correção',
    type: 'info',
    time: '5h atrás',
    read: false,
    category: 'academic',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Reunião Pedagógica',
    message: 'Reunião de colegiado marcada para próxima segunda-feira',
    type: 'info',
    time: '1d atrás',
    read: true,
    category: 'general',
    priority: 'medium'
  }
];

const ProfessorTopBar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockProfessorNotifications);

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

  const quickActions = [
    { icon: Book, label: 'Plano de Aula', path: '/professor/plano-aula' },
    { icon: Calendar, label: 'Agendar Prova', path: '/professor/agendar-prova' },
    { icon: ClipboardList, label: 'Lançar Notas', path: '/professor/notas' },
    { icon: Users, label: 'Lista de Presença', path: '/professor/chamada' },
  ];

  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <span className="text-gray-500 dark:text-gray-400">Departamento:</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          Ciências da Computação
        </span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <action.icon size={18} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>

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
                {user?.name || 'Professor'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Professor Titular
              </span>
            </div>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
                {/* Professor Card */}
                <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
                  <div className="absolute top-4 right-4">
                    <GraduationCap className="h-8 w-8 opacity-50" />
                  </div>
                  <div className="flex items-start space-x-4">
                    <img
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Foto do Professor"
                      className="w-24 h-24 rounded-lg object-cover border-2 border-white/50"
                    />
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-white/70">Nome</p>
                        <p className="font-medium">{user?.name || 'Professor Silva'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/70">Matrícula</p>
                        <p className="font-medium">PROF2024001</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/70">Departamento</p>
                        <p className="font-medium">Ciências da Computação</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/70">Disciplinas</p>
                      <p className="font-medium">6 turmas ativas</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Alunos</p>
                      <p className="font-medium">180 alunos</p>
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

export default ProfessorTopBar;