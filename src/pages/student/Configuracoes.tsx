import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Volume2, 
  Eye, 
  Shield, 
  Smartphone,
  Palette,
  User,
  Mail,
  Lock,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

const Configuracoes = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [notifications, setNotifications] = useState({
    activities: true,
    tests: true,
    assignments: true,
    classes: true,
    grades: true,
    announcements: true,
    reminders: true
  });

  const [preferences, setPreferences] = useState({
    language: 'pt-BR',
    timeFormat: '24h',
    theme: 'system',
    fontSize: 'normal',
    highContrast: false,
    reduceMotion: false,
    soundEffects: true,
    vibration: true
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: true,
    sessionTimeout: '30min',
    saveLoginHistory: true
  });

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
        <button
          onClick={handleSaveSettings}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Save size={20} />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notificações
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  {key === 'activities' && 'Atividades'}
                  {key === 'tests' && 'Provas'}
                  {key === 'assignments' && 'Tarefas'}
                  {key === 'classes' && 'Aulas'}
                  {key === 'grades' && 'Notas'}
                  {key === 'announcements' && 'Avisos'}
                  {key === 'reminders' && 'Lembretes'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance & Accessibility */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Aparência e Acessibilidade
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Tema Escuro</span>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Idioma
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Formato de Hora
                </label>
                <select
                  value={preferences.timeFormat}
                  onChange={(e) => setPreferences(prev => ({ ...prev, timeFormat: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                >
                  <option value="24h">24 horas</option>
                  <option value="12h">12 horas (AM/PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamanho da Fonte
                </label>
                <select
                  value={preferences.fontSize}
                  onChange={(e) => setPreferences(prev => ({ ...prev, fontSize: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                >
                  <option value="small">Pequena</option>
                  <option value="normal">Normal</option>
                  <option value="large">Grande</option>
                  <option value="xlarge">Extra Grande</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Alto Contraste</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.highContrast}
                    onChange={() => setPreferences(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Reduzir Animações</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.reduceMotion}
                    onChange={() => setPreferences(prev => ({ ...prev, reduceMotion: !prev.reduceMotion }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Segurança
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-gray-700 dark:text-gray-300">Autenticação de Dois Fatores</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Adicione uma camada extra de segurança
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.twoFactor}
                  onChange={() => setSecurity(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-gray-700 dark:text-gray-300">Login Biométrico</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Use sua digital ou Face ID
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.biometric}
                  onChange={() => setSecurity(prev => ({ ...prev, biometric: !prev.biometric }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tempo Limite da Sessão
              </label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="15min">15 minutos</option>
                <option value="30min">30 minutos</option>
                <option value="1h">1 hora</option>
                <option value="4h">4 horas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Device Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preferências do Dispositivo
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Efeitos Sonoros</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.soundEffects}
                  onChange={() => setPreferences(prev => ({ ...prev, soundEffects: !prev.soundEffects }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Vibração</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.vibration}
                  onChange={() => setPreferences(prev => ({ ...prev, vibration: !prev.vibration }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Armazenamento Local
                  </h4>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    O aplicativo está usando 256MB de armazenamento local. Você pode limpar os dados do cache para liberar espaço.
                  </p>
                  <button className="mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100">
                    Limpar Cache
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;