import React, { useState } from 'react';
import { BookOpen, X, Filter, Clock, MapPin, User, Search, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

interface Aula {
  id: string;
  tema: string;
  data: string;
  horario: string;
  sala: string;
  material?: string;
  status: 'realizada' | 'proxima' | 'cancelada';
}

interface Disciplina {
  id: string;
  nome: string;
  professor: string;
  presenca: string;
  aulas: Aula[];
}

const Aulas = () => {
  const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);
  const [statusFilter, setStatusFilter] = useState<'todas' | 'realizada' | 'proxima' | 'cancelada'>('todas');
  const [isLoading, setIsLoading] = useState(false);

  const disciplinas: Disciplina[] = [
    {
      id: '1',
      nome: 'Cálculo III',
      professor: 'Dr. Silva',
      presenca: '90%',
      aulas: [
        {
          id: '1',
          tema: 'Derivadas Parciais',
          data: '2024-03-20',
          horario: '08:00 - 10:00',
          sala: 'A-101',
          material: 'Capítulo 5 do livro',
          status: 'realizada'
        },
        {
          id: '2',
          tema: 'Integrais Múltiplas',
          data: '2024-03-27',
          horario: '08:00 - 10:00',
          sala: 'A-101',
          material: 'Capítulo 6 do livro',
          status: 'proxima'
        },
        {
          id: '3',
          tema: 'Teorema de Green',
          data: '2024-04-03',
          horario: '08:00 - 10:00',
          sala: 'A-101',
          status: 'proxima'
        }
      ]
    },
    {
      id: '2',
      nome: 'Física II',
      professor: 'Dra. Santos',
      presenca: '85%',
      aulas: [
        {
          id: '4',
          tema: 'Eletromagnetismo',
          data: '2024-03-21',
          horario: '10:00 - 12:00',
          sala: 'B-203',
          material: 'Slides da aula',
          status: 'realizada'
        },
        {
          id: '5',
          tema: 'Lei de Gauss',
          data: '2024-03-28',
          horario: '10:00 - 12:00',
          sala: 'B-203',
          status: 'proxima'
        }
      ]
    }
  ];

  const getStatusColor = (status: Aula['status']) => {
    switch (status) {
      case 'realizada':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'proxima':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const toggleDisciplina = (id: string) => {
    setExpandedDisciplina(expandedDisciplina === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <SkeletonLoader variant="text" size="lg" width={200} />
          <div className="flex space-x-4">
            <SkeletonLoader variant="rectangular" width={200} height={40} />
            <SkeletonLoader variant="rectangular" width={150} height={40} />
          </div>
        </div>

        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <SkeletonLoader variant="text" size="lg" width={300} />
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <SkeletonLoader variant="text" width={200} />
                  <SkeletonLoader variant="circular" size="sm" width={40} />
                </div>
                <SkeletonLoader variant="text" count={3} className="mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Aulas</h1>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar aulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="todas">Todos os Status</option>
            <option value="realizada">Realizadas</option>
            <option value="proxima">Próximas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {disciplinas.map((disciplina) => (
          <div
            key={disciplina.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => toggleDisciplina(disciplina.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {disciplina.nome}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {disciplina.professor} • {disciplina.aulas.length} aulas
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                  {disciplina.presenca}
                </span>
                {expandedDisciplina === disciplina.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedDisciplina === disciplina.id && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Buscar aulas desta disciplina..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {disciplina.aulas
                      .filter(aula => 
                        aula.tema.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        (statusFilter === 'todas' || aula.status === statusFilter)
                      )
                      .map((aula) => (
                        <div
                          key={aula.id}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {new Date(aula.data).toLocaleDateString('pt-BR')}
                              </h3>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(aula.status)}`}>
                              {aula.status.charAt(0).toUpperCase() + aula.status.slice(1)}
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {aula.tema}
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {aula.horario}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {aula.sala}
                            </div>
                          </div>

                          {aula.material && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Material:</span> {aula.material}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && selectedAula && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedAula.tema}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {disciplinas.find(d => d.aulas.some(a => a.id === selectedAula.id))?.nome}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Informações da Aula
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{new Date(selectedAula.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{selectedAula.horario}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{selectedAula.sala}</span>
                  </div>
                </div>
              </div>

              {selectedAula.material && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Material de Apoio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{selectedAula.material}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aulas;