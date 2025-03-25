import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, AlertCircle, ChevronRight, User, Calendar, X } from 'lucide-react';

interface Disciplina {
  codigo: string;
  nome: string;
  creditos: number;
  status: 'concluida' | 'cursando' | 'pendente';
  prerequisitos: string[];
  cargaHoraria: number;
  semestre: number;
  professor: string;
  horario: string;
  ementa: string;
  bibliografia: string[];
  objetivos: string[];
}

const GradeCurricular = () => {
  const [selectedSemestre, setSelectedSemestre] = useState<number | null>(null);
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [showModal, setShowModal] = useState(false);

  const disciplinas: Disciplina[] = [
    {
      codigo: 'MAT101',
      nome: 'Cálculo I',
      creditos: 6,
      status: 'concluida',
      prerequisitos: [],
      cargaHoraria: 90,
      semestre: 1,
      professor: 'Dr. Silva',
      horario: 'Segunda e Quarta, 08:00 - 10:00',
      ementa: 'Limites, continuidade, derivadas e suas aplicações, integral definida e indefinida.',
      bibliografia: [
        'Stewart, J. Cálculo, Volume 1',
        'Thomas, G. B. Cálculo, Volume 1',
        'Guidorizzi, H. L. Um Curso de Cálculo, Volume 1'
      ],
      objetivos: [
        'Compreender os conceitos fundamentais do cálculo diferencial e integral',
        'Desenvolver habilidades de resolução de problemas',
        'Aplicar os conceitos em situações práticas'
      ]
    },
    {
      codigo: 'FIS101',
      nome: 'Física I',
      creditos: 4,
      status: 'concluida',
      prerequisitos: [],
      cargaHoraria: 60,
      semestre: 1,
      professor: 'Dr. Santos',
      horario: 'Terça e Quinta, 10:00 - 12:00',
      ementa: 'Mecânica Newtoniana, cinemática, dinâmica, energia e momento.',
      bibliografia: [
        'Halliday, D. Fundamentos de Física, Volume 1',
        'Tipler, P. Física para Cientistas e Engenheiros, Volume 1'
      ],
      objetivos: [
        'Compreender os princípios fundamentais da mecânica',
        'Resolver problemas práticos de física mecânica',
        'Desenvolver pensamento analítico'
      ]
    },
    {
      codigo: 'PROG101',
      nome: 'Introdução à Programação',
      creditos: 4,
      status: 'concluida',
      prerequisitos: [],
      cargaHoraria: 60,
      semestre: 1,
      professor: 'Dra. Costa',
      horario: 'Segunda e Quarta, 14:00 - 16:00',
      ementa: 'Lógica de programação, estruturas de controle, funções e arrays.',
      bibliografia: [
        'Deitel, H. Como Programar em C',
        'Kernighan, B. W. C: A Linguagem de Programação'
      ],
      objetivos: [
        'Desenvolver lógica de programação',
        'Aprender sintaxe básica de C',
        'Criar programas simples'
      ]
    },
    {
      codigo: 'MAT102',
      nome: 'Cálculo II',
      creditos: 6,
      status: 'concluida',
      prerequisitos: ['MAT101'],
      cargaHoraria: 90,
      semestre: 2,
      professor: 'Dr. Silva',
      horario: 'Segunda e Quarta, 08:00 - 10:00',
      ementa: 'Sequências e séries, funções de várias variáveis, derivadas parciais.',
      bibliografia: [
        'Stewart, J. Cálculo, Volume 2',
        'Thomas, G. B. Cálculo, Volume 2'
      ],
      objetivos: [
        'Aprofundar conhecimentos de cálculo',
        'Compreender funções multivariáveis',
        'Aplicar conceitos em problemas complexos'
      ]
    },
    {
      codigo: 'FIS102',
      nome: 'Física II',
      creditos: 4,
      status: 'concluida',
      prerequisitos: ['FIS101'],
      cargaHoraria: 60,
      semestre: 2,
      professor: 'Dr. Santos',
      horario: 'Terça e Quinta, 10:00 - 12:00',
      ementa: 'Eletromagnetismo, campos elétricos e magnéticos.',
      bibliografia: [
        'Halliday, D. Fundamentos de Física, Volume 3',
        'Tipler, P. Física para Cientistas e Engenheiros, Volume 3'
      ],
      objetivos: [
        'Compreender princípios do eletromagnetismo',
        'Resolver problemas de campos elétricos e magnéticos',
        'Aplicar conceitos em situações práticas'
      ]
    },
    {
      codigo: 'PROG102',
      nome: 'Estruturas de Dados',
      creditos: 4,
      status: 'concluida',
      prerequisitos: ['PROG101'],
      cargaHoraria: 60,
      semestre: 2,
      professor: 'Dra. Costa',
      horario: 'Segunda e Quarta, 14:00 - 16:00',
      ementa: 'Listas, pilhas, filas, árvores e grafos.',
      bibliografia: [
        'Cormen, T. H. Algoritmos: Teoria e Prática',
        'Sedgewick, R. Algorithms in C'
      ],
      objetivos: [
        'Compreender estruturas de dados básicas e avançadas',
        'Implementar estruturas de dados',
        'Analisar complexidade de algoritmos'
      ]
    },
    {
      codigo: 'MAT103',
      nome: 'Cálculo III',
      creditos: 6,
      status: 'cursando',
      prerequisitos: ['MAT102'],
      cargaHoraria: 90,
      semestre: 3,
      professor: 'Dr. Silva',
      horario: 'Segunda e Quarta, 08:00 - 10:00',
      ementa: 'Integrais múltiplas, cálculo vetorial.',
      bibliografia: [
        'Stewart, J. Cálculo, Volume 3',
        'Thomas, G. B. Cálculo, Volume 3'
      ],
      objetivos: [
        'Dominar integrais múltiplas',
        'Compreender cálculo vetorial',
        'Aplicar conceitos em problemas práticos'
      ]
    },
    {
      codigo: 'FIS103',
      nome: 'Física III',
      creditos: 4,
      status: 'cursando',
      prerequisitos: ['FIS102'],
      cargaHoraria: 60,
      semestre: 3,
      professor: 'Dr. Santos',
      horario: 'Terça e Quinta, 10:00 - 12:00',
      ementa: 'Ondas, óptica e física moderna.',
      bibliografia: [
        'Halliday, D. Fundamentos de Física, Volume 4',
        'Tipler, P. Física para Cientistas e Engenheiros, Volume 4'
      ],
      objetivos: [
        'Compreender fenômenos ondulatórios',
        'Estudar princípios de óptica',
        'Introduzir conceitos de física moderna'
      ]
    },
    {
      codigo: 'PROG103',
      nome: 'Programação Orientada a Objetos',
      creditos: 4,
      status: 'cursando',
      prerequisitos: ['PROG102'],
      cargaHoraria: 60,
      semestre: 3,
      professor: 'Dra. Costa',
      horario: 'Segunda e Quarta, 14:00 - 16:00',
      ementa: 'Classes, objetos, herança, polimorfismo e encapsulamento.',
      bibliografia: [
        'Deitel, H. Java: Como Programar',
        'Sierra, K. Use a Cabeça! Java'
      ],
      objetivos: [
        'Compreender paradigma orientado a objetos',
        'Desenvolver aplicações em Java',
        'Aplicar padrões de projeto'
      ]
    },
    {
      codigo: 'MAT104',
      nome: 'Cálculo Numérico',
      creditos: 4,
      status: 'pendente',
      prerequisitos: ['MAT103'],
      cargaHoraria: 60,
      semestre: 4,
      professor: 'Dr. Silva',
      horario: 'Segunda e Quarta, 10:00 - 12:00',
      ementa: 'Métodos numéricos para resolução de equações e sistemas lineares.',
      bibliografia: [
        'Burden, R. L. Análise Numérica',
        'Ruggiero, M. A. G. Cálculo Numérico'
      ],
      objetivos: [
        'Implementar métodos numéricos',
        'Analisar erros e convergência',
        'Resolver problemas práticos'
      ]
    },
    {
      codigo: 'PROG104',
      nome: 'Banco de Dados',
      creditos: 4,
      status: 'pendente',
      prerequisitos: ['PROG103'],
      cargaHoraria: 60,
      semestre: 4,
      professor: 'Dra. Costa',
      horario: 'Terça e Quinta, 14:00 - 16:00',
      ementa: 'Modelagem de dados, SQL, normalização.',
      bibliografia: [
        'Elmasri, R. Sistemas de Banco de Dados',
        'Date, C. J. Introdução a Sistemas de Bancos de Dados'
      ],
      objetivos: [
        'Projetar bancos de dados relacionais',
        'Desenvolver consultas SQL',
        'Implementar sistemas com banco de dados'
      ]
    },
    {
      codigo: 'REDES101',
      nome: 'Redes de Computadores',
      creditos: 4,
      status: 'pendente',
      prerequisitos: ['PROG102'],
      cargaHoraria: 60,
      semestre: 4,
      professor: 'Dr. Oliveira',
      horario: 'Segunda e Quarta, 16:00 - 18:00',
      ementa: 'Protocolos de rede, TCP/IP, arquitetura cliente-servidor.',
      bibliografia: [
        'Tanenbaum, A. S. Redes de Computadores',
        'Kurose, J. F. Redes de Computadores e a Internet'
      ],
      objetivos: [
        'Compreender protocolos de rede',
        'Implementar aplicações em rede',
        'Configurar redes básicas'
      ]
    }
  ];

  const semestres = Array.from(new Set(disciplinas.map(d => d.semestre))).sort();

  const getStatusColor = (status: Disciplina['status']) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cursando':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pendente':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: Disciplina['status']) => {
    switch (status) {
      case 'concluida':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'cursando':
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'pendente':
        return <AlertCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
    }
  };

  const handleDisciplinaClick = (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Grade Curricular
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-gray-600 dark:text-gray-400">Concluída</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
              <span className="text-gray-600 dark:text-gray-400">Cursando</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
              <span className="text-gray-600 dark:text-gray-400">Pendente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="space-y-8">
        {semestres.map((semestre) => (
          <div key={semestre} className="relative">
            <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 py-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {semestre}º Semestre
              </h2>
            </div>
            
            <div className="mt-4 space-y-4">
              {disciplinas
                .filter(d => d.semestre === semestre)
                .map((disciplina) => (
                  <div
                    key={disciplina.codigo}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
                    onClick={() => handleDisciplinaClick(disciplina)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900">
                            <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {disciplina.nome}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {disciplina.codigo} • {disciplina.creditos} créditos
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(disciplina.status)}`}>
                            {disciplina.status.charAt(0).toUpperCase() + disciplina.status.slice(1)}
                          </span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedDisciplina && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedDisciplina.nome}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Código: {selectedDisciplina.codigo}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Informações Gerais
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <User className="h-5 w-5 mr-2" />
                        <span>Professor: {selectedDisciplina.professor}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>Horário: {selectedDisciplina.horario}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>Carga Horária: {selectedDisciplina.cargaHoraria}h</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Pré-requisitos
                    </h3>
                    {selectedDisciplina.prerequisitos.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedDisciplina.prerequisitos.map(prereq => (
                          <span
                            key={prereq}
                            className="px-2 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        Não há pré-requisitos
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Ementa
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedDisciplina.ementa}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Objetivos
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                      {selectedDisciplina.objetivos.map((objetivo, index) => (
                        <li key={index}>{objetivo}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Bibliografia
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {selectedDisciplina.bibliografia.map((livro, index) => (
                    <li key={index} className="flex items-start">
                      <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-primary-600 dark:text-primary-400" />
                      <span>{livro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeCurricular;