import React, { useState } from 'react';
import { 
  ClipboardList,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Edit,
  Save,
  X
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  photo: string;
  registration: string;
  grades: {
    [key: string]: number | null;
  };
}

interface Subject {
  id: string;
  name: string;
  evaluations: {
    id: string;
    name: string;
    weight: number;
    maxScore: number;
  }[];
  students: Student[];
}

const Notas = () => {
  const [subjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Programação Web',
      evaluations: [
        { id: '1', name: 'Prova 1', weight: 0.4, maxScore: 10 },
        { id: '2', name: 'Projeto', weight: 0.6, maxScore: 10 }
      ],
      students: [
        {
          id: '1',
          name: 'Ana Silva',
          registration: '2024001',
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          grades: {
            '1': 8.5,
            '2': 9.0
          }
        },
        {
          id: '2',
          name: 'Carlos Santos',
          registration: '2024002',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          grades: {
            '1': 7.5,
            '2': 8.0
          }
        }
      ]
    }
  ]);

  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGrade, setEditingGrade] = useState<{
    studentId: string;
    evaluationId: string;
    value: string;
  } | null>(null);

  const currentSubject = subjects.find(s => s.id === selectedSubject)!;

  const calculateFinalGrade = (grades: { [key: string]: number | null }) => {
    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return 0;

    return subject.evaluations.reduce((acc, evaluation) => {
      const grade = grades[evaluation.id];
      return acc + (grade || 0) * evaluation.weight;
    }, 0);
  };

  const handleGradeEdit = (studentId: string, evaluationId: string, currentGrade: number | null) => {
    setEditingGrade({
      studentId,
      evaluationId,
      value: currentGrade?.toString() || ''
    });
  };

  const handleGradeSave = () => {
    if (!editingGrade) return;
    // In a real app, this would make an API call to update the grade
    setEditingGrade(null);
  };

  const filteredStudents = currentSubject.students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Lançamento de Notas
        </h1>
        <button
          onClick={() => {/* Implement export functionality */}}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download size={20} />
          <span>Exportar Notas</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aluno
                </th>
                {currentSubject.evaluations.map(evaluation => (
                  <th
                    key={evaluation.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {evaluation.name}
                    <span className="block text-xs font-normal">
                      Peso: {(evaluation.weight * 100)}%
                    </span>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Média Final
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
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
                          {student.registration}
                        </div>
                      </div>
                    </div>
                  </td>
                  {currentSubject.evaluations.map(evaluation => (
                    <td key={evaluation.id} className="px-6 py-4 whitespace-nowrap">
                      {editingGrade?.studentId === student.id && 
                       editingGrade?.evaluationId === evaluation.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max={evaluation.maxScore}
                            step="0.1"
                            value={editingGrade.value}
                            onChange={(e) => setEditingGrade({
                              ...editingGrade,
                              value: e.target.value
                            })}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={handleGradeSave}
                            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingGrade(null)}
                            className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 dark:text-white">
                            {student.grades[evaluation.id]?.toFixed(1) || '-'}
                          </span>
                          <button
                            onClick={() => handleGradeEdit(
                              student.id,
                              evaluation.id,
                              student.grades[evaluation.id]
                            )}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {calculateFinalGrade(student.grades).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notas;