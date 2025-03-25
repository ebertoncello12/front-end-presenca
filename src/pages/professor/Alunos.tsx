import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  Calendar,
  BookOpen,
  BarChart2,
  AlertTriangle,
  CheckCircle,
  X,
  User,
  GraduationCap
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  registration: string;
  photo: string;
  course: string;
  semester: number;
  phone: string;
  birthdate: string;
  subjects: {
    name: string;
    attendance: number;
    grades: {
      name: string;
      value: number;
      weight: number;
    }[];
    status: 'regular' | 'attention' | 'risk';
  }[];
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    registration: '2024001',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    course: 'Ciência da Computação',
    semester: 4,
    phone: '(11) 98765-4321',
    birthdate: '1999-05-15',
    subjects: [
      {
        name: 'Programação Web',
        attendance: 85,
        grades: [
          { name: 'Prova 1', value: 8.5, weight: 0.4 },
          { name: 'Projeto', value: 9.0, weight: 0.6 }
        ],
        status: 'regular'
      },
      {
        name: 'Banco de Dados',
        attendance: 75,
        grades: [
          { name: 'Prova 1', value: 7.0, weight: 0.5 },
          { name: 'Trabalho', value: 8.0, weight: 0.5 }
        ],
        status: 'attention'
      }
    ]
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@email.com',
    registration: '2024002',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    course: 'Ciência da Computação',
    semester: 4,
    phone: '(11) 98765-4322',
    birthdate: '2000-03-20',
    subjects: [
      {
        name: 'Programação Web',
        attendance: 92,
        grades: [
          { name: 'Prova 1', value: 9.5, weight: 0.4 },
          { name: 'Projeto', value: 9.0, weight: 0.6 }
        ],
        status: 'regular'
      }
    ]
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    registration: '2024003',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    course: 'Ciência da Computação',
    semester: 4,
    phone: '(11) 98765-4323',
    birthdate: '2000-08-10',
    subjects: [
      {
        name: 'Programação Web',
        attendance: 65,
        grades: [
          { name: 'Prova 1', value: 6.0, weight: 0.4 },
          { name: 'Projeto', value: 7.0, weight: 0.6 }
        ],
        status: 'risk'
      }
    ]
  }
];

const Alunos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'regular' | 'attention' | 'risk'>('all');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const subjects = Array.from(
    new Set(mockStudents.flatMap(student => student.subjects.map(subject => subject.name)))
  );

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.registration.includes(searchTerm) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || 
                          student.subjects.some(subject => subject.name === selectedSubject);
    
    const matchesStatus = selectedStatus === 'all' ||
                         student.subjects.some(subject => subject.status === selectedStatus);
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const getStatusColor = (status: 'regular' | 'attention' | 'risk') => {
    switch (status) {
      case 'regular':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'risk':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getStatusIcon = (status: 'regular' | 'attention' | 'risk') => {
    switch (status) {
      case 'regular':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'attention':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
  };

  const calculateFinalGrade = (grades: { value: number; weight: number }[]) => {
    return grades.reduce((acc, grade) => acc + grade.value * grade.weight, 0).toFixed(1);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Alunos
        </h1>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          onClick={() => {/* Implement export functionality */}}
        >
          <Download size={20} />
          <span>Exportar Lista</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, matrícula ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todas as Disciplinas</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="regular">Regular</option>
                <option value="attention">Atenção</option>
                <option value="risk">Risco</option>
              </select>
            </div>
          </div>
        </div>

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
                  Disciplinas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Frequência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Média
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => handleStudentClick(student)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="h-10 w-10 rounded-full"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {student.subjects.map(subject => subject.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.subjects.map(subject => (
                      <div key={subject.name} className="text-sm text-gray-900 dark:text-white">
                        {subject.attendance}%
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.subjects.map(subject => (
                      <div key={subject.name} className="text-sm text-gray-900 dark:text-white">
                        {calculateFinalGrade(subject.grades)}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.subjects.map(subject => (
                      <div
                        key={subject.name}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subject.status)}`}
                      >
                        {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedStudent.photo}
                  alt={selectedStudent.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedStudent.registration}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Info Card */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <GraduationCap className="h-16 w-16 text-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-white/70">Email</p>
                      <p className="font-medium">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Telefone</p>
                      <p className="font-medium">{selectedStudent.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Data de Nascimento</p>
                      <p className="font-medium">
                        {new Date(selectedStudent.birthdate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-white/70">Curso</p>
                      <p className="font-medium">{selectedStudent.course}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Semestre</p>
                      <p className="font-medium">{selectedStudent.semester}º Semestre</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Performance */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Desempenho Acadêmico
                </h3>
                
                {selectedStudent.subjects.map(subject => (
                  <div
                    key={subject.name}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {subject.name}
                        </h4>
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subject.status)}`}>
                        {getStatusIcon(subject.status)}
                        <span className="ml-2">
                          {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Notas
                        </h5>
                        <div className="space-y-2">
                          {subject.grades.map((grade, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-600 dark:text-gray-300">
                                {grade.name}
                              </span>
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Peso: {(grade.weight * 100)}%
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {grade.value.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-900 dark:text-white">
                                Média Final
                              </span>
                              <span className="font-bold text-primary-600 dark:text-primary-400">
                                {calculateFinalGrade(subject.grades)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Frequência
                        </h5>
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-300">
                              Presença Total
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {subject.attendance}%
                            </span>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                            <div
                              style={{ width: `${subject.attendance}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                subject.attendance >= 75
                                  ? 'bg-green-500'
                                  : subject.attendance >= 65
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alunos;