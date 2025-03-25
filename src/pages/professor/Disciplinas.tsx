import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  FileText,
  GraduationCap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Subject } from '../../types/professor';

// Mock data
const mockSubjects: Subject[] = [
  {
    id: '1',
    code: 'CC101',
    name: 'Programação Web',
    schedule: 'Segunda e Quarta, 19:00 - 20:40',
    room: 'Lab 01',
    students: [
      {
        id: '1',
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        registration: '2024001',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        attendance: 85,
        grades: {
          'Prova 1': 8.5,
          'Projeto': 9.0
        }
      },
      {
        id: '2',
        name: 'Carlos Santos',
        email: 'carlos.santos@email.com',
        registration: '2024002',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        attendance: 92,
        grades: {
          'Prova 1': 7.5,
          'Projeto': 8.5
        }
      }
    ],
    classes: [
      {
        id: '1',
        date: '2024-03-18',
        topic: 'Introdução ao React',
        content: 'Componentes, Props e Estado',
        status: 'completed',
        attendance: {
          present: 28,
          total: 30
        }
      },
      {
        id: '2',
        date: '2024-03-20',
        topic: 'Hooks e Ciclo de Vida',
        content: 'useState, useEffect e Custom Hooks',
        status: 'in-progress',
        attendance: {
          present: 25,
          total: 30
        }
      }
    ],
    syllabus: [
      'Fundamentos de React',
      'Gerenciamento de Estado',
      'Roteamento e Navegação',
      'Integração com APIs'
    ],
    evaluations: [
      {
        name: 'Prova 1',
        weight: 40,
        date: '2024-04-15'
      },
      {
        name: 'Projeto',
        weight: 60,
        date: '2024-05-20'
      }
    ]
  },
  {
    id: '2',
    code: 'CC102',
    name: 'Banco de Dados',
    schedule: 'Terça e Quinta, 19:00 - 20:40',
    room: 'Lab 02',
    students: [
      {
        id: '3',
        name: 'Maria Oliveira',
        email: 'maria.oliveira@email.com',
        registration: '2024003',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        attendance: 88,
        grades: {
          'Prova 1': 9.0,
          'Trabalho Prático': 8.5
        }
      }
    ],
    classes: [
      {
        id: '3',
        date: '2024-03-19',
        topic: 'Modelagem de Dados',
        content: 'Modelo ER e Normalização',
        status: 'completed',
        attendance: {
          present: 32,
          total: 35
        }
      }
    ],
    syllabus: [
      'Introdução a Banco de Dados',
      'SQL',
      'Normalização',
      'Índices e Performance'
    ],
    evaluations: [
      {
        name: 'Prova 1',
        weight: 50,
        date: '2024-04-20'
      },
      {
        name: 'Trabalho Prático',
        weight: 50,
        date: '2024-05-25'
      }
    ]
  }
];

const Disciplinas = () => {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'students' | 'classes'>('info');

  const toggleSubject = (id: string) => {
    setExpandedSubject(expandedSubject === id ? null : id);
    setActiveTab('info');
  };

  const getStatusColor = (status: Class['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Minhas Disciplinas
      </h1>

      <div className="space-y-4">
        {mockSubjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => toggleSubject(subject.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50">
                  <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subject.code} • {subject.students.length} alunos
                  </p>
                </div>
              </div>
              {expandedSubject === subject.id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedSubject === subject.id && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex">
                    {[
                      { key: 'info', label: 'Informações', icon: FileText },
                      { key: 'students', label: 'Alunos', icon: Users },
                      { key: 'classes', label: 'Aulas', icon: Calendar }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`flex-1 px-6 py-3 text-sm font-medium text-center border-b-2 ${
                          activeTab === tab.key
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <tab.icon size={18} />
                          <span>{tab.label}</span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'info' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <span>{subject.schedule}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <span>{subject.room}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Avaliações
                          </h4>
                          <div className="space-y-2">
                            {subject.evaluations.map((evaluation, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gray-600 dark:text-gray-300">
                                  {evaluation.name}
                                </span>
                                <div className="flex items-center space-x-4">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {evaluation.weight}%
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {new Date(evaluation.date).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Ementa
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                          {subject.syllabus.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'students' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Aluno
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Matrícula
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Frequência
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Notas
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {subject.students.map((student) => (
                            <tr key={student.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    src={student.photo}
                                    alt={student.name}
                                    className="h-8 w-8 rounded-full"
                                  />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {student.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {student.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {student.registration}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="ml-2 text-sm text-gray-900 dark:text-white">
                                    {student.attendance}%
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="space-y-1">
                                  {Object.entries(student.grades).map(([name, grade]) => (
                                    <div key={name} className="text-sm">
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {name}:
                                      </span>
                                      <span className="ml-2 text-gray-900 dark:text-white">
                                        {grade}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'classes' && (
                    <div className="space-y-4">
                      {subject.classes.map((class_) => (
                        <div
                          key={class_.id}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                              <span className="text-gray-900 dark:text-white">
                                {new Date(class_.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(class_.status)}`}>
                              {class_.status === 'completed' && 'Realizada'}
                              {class_.status === 'in-progress' && 'Em Andamento'}
                              {class_.status === 'scheduled' && 'Agendada'}
                              {class_.status === 'cancelled' && 'Cancelada'}
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {class_.topic}
                          </h4>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {class_.content}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                              <Users className="h-4 w-4" />
                              <span>
                                Presença: {class_.attendance.present}/{class_.attendance.total} alunos
                              </span>
                            </div>
                            {class_.status === 'completed' && (
                              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                <CheckCircle className="h-4 w-4" />
                                <span>Chamada realizada</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Disciplinas;