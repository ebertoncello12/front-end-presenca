import React, { useState } from 'react';
import { Bell, Eye, User, Globe, Moon, Palette, Volume2 } from 'lucide-react';

const Configuracoes = () => {
  const [notificacoes, setNotificacoes] = useState({
    inicioAula: true,
    faltaRegistro: true,
    lembretes: true,
    avisos: true
  });

  const [acessibilidade, setAcessibilidade] = useState({
    altoContraste: false,
    fonteGrande: false,
    reducaoMovimento: false
  });

  const [preferencias, setPreferencias] = useState({
    idiomaInterface: 'pt-BR',
    formatoHora: '24h',
    temaInterface: 'sistema'
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Configurações
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil Acadêmico */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Perfil Acadêmico
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Curso
              </label>
              <input
                type="text"
                value="Ciência da Computação"
                disabled
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Matrícula
              </label>
              <input
                type="text"
                value="2024001234"
                disabled
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período Atual
              </label>
              <input
                type="text"
                value="4º Semestre"
                disabled
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notificações
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(notificacoes).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  {key === 'inicioAula' && 'Início das Aulas'}
                  {key === 'faltaRegistro' && 'Falta de Registro de Presença'}
                  {key === 'lembretes' && 'Lembretes de Atividades'}
                  {key === 'avisos' && 'Avisos Gerais'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => setNotificacoes(prev => ({ ...prev, [key]: !prev[key] }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Acessibilidade */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Acessibilidade
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(acessibilidade).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  {key === 'altoContraste' && 'Alto Contraste'}
                  {key === 'fonteGrande' && 'Fonte Grande'}
                  {key === 'reducaoMovimento' && 'Redução de Movimento'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => setAcessibilidade(prev => ({ ...prev, [key]: !prev[key] }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Preferências */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Preferências
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Idioma da Interface
              </label>
              <select
                value={preferencias.idiomaInterface}
                onChange={(e) => setPreferencias(prev => ({ ...prev, idiomaInterface: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                value={preferencias.formatoHora}
                onChange={(e) => setPreferencias(prev => ({ ...prev, formatoHora: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="24h">24 horas</option>
                <option value="12h">12 horas (AM/PM)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tema da Interface
              </label>
              <select
                value={preferencias.temaInterface}
                onChange={(e) => setPreferencias(prev => ({ ...prev, temaInterface: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="sistema">Seguir Sistema</option>
                <option value="claro">Modo Claro</option>
                <option value="escuro">Modo Escuro</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;