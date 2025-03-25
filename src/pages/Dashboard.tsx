import React, { useState } from 'react';
import { BookOpen, Users, Clock, QrCode, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(null);

  const stats = [
    { title: 'Disciplinas Cursando', value: '6', icon: BookOpen },
    { title: 'Presença Total', value: '85%', icon: Users },
    { title: 'Próxima Aula', value: '14:00', icon: Clock },
  ];

  const materias = [
    {
      nome: 'Cálculo III',
      presenca: '90%',
      professor: 'Dr. Silva',
      horario: 'Seg 08:00',
      aulas: [
        { data: '18/03', tema: 'Derivadas Parciais', status: 'realizada' },
        { data: '25/03', tema: 'Integrais Múltiplas', status: 'proxima' },
        { data: '01/04', tema: 'Teorema de Green', status: 'futura' },
      ]
    },
    {
      nome: 'Física II',
      presenca: '85%',
      professor: 'Dra. Santos',
      horario: 'Ter 10:00',
      aulas: [
        { data: '19/03', tema: 'Eletromagnetismo', status: 'realizada' },
        { data: '26/03', tema: 'Lei de Gauss', status: 'proxima' },
        { data: '02/04', tema: 'Campo Elétrico', status: 'futura' },
      ]
    },
    {
      nome: 'Programação Web',
      presenca: '95%',
      professor: 'Dr. Oliveira',
      horario: 'Qua 14:00',
      aulas: [
        { data: '20/03', tema: 'React Hooks', status: 'realizada' },
        { data: '27/03', tema: 'Context API', status: 'proxima' },
        { data: '03/04', tema: 'Redux', status: 'futura' },
      ]
    },
  ];

  const toggleDisciplina = (nome: string) => {
    setExpandedDisciplina(expandedDisciplina === nome ? null : nome);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button
          onClick={() => navigate('/registrar-presenca')}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <QrCode size={20} />
          <span>Bater Presença</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300">
                <stat.icon size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Minhas Disciplinas</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {materias.map((materia) => (
            <div key={materia.nome} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <button
                onClick={() => toggleDisciplina(materia.nome)}
                className="w-full p-6 flex justify-between items-center"
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {materia.nome}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Professor: {materia.professor} • Horário: {materia.horario}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">Presença</div>
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {materia.presenca}
                    </div>
                  </div>
                  {expandedDisciplina === materia.nome ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {expandedDisciplina === materia.nome && (
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3">
                      <div>Data</div>
                      <div>Tema</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-600">
                      {materia.aulas.map((aula, index) => (
                        <div key={index} className="grid grid-cols-3 p-3 text-sm">
                          <div className="text-gray-900 dark:text-gray-200">{aula.data}</div>
                          <div className="text-gray-900 dark:text-gray-200">{aula.tema}</div>
                          <div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium
                                ${aula.status === 'realizada'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : aula.status === 'proxima'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                }`}
                            >
                              {aula.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;