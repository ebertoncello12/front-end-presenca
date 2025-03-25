import React, { useState } from 'react';
import { 
  PenTool,
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'essay';
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  points: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  subject: string;
  class: string;
  questions: Question[];
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed';
  totalPoints: number;
  submissions: number;
}

const Provas = () => {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Prova 1 - Programação Web',
      description: 'Avaliação sobre React e APIs REST',
      date: '2024-04-20',
      duration: 120,
      subject: 'Programação Web',
      class: 'CC-2024-1',
      questions: [
        {
          id: '1',
          text: 'O que é o Virtual DOM no React?',
          type: 'multiple_choice',
          options: [
            { id: '1', text: 'Uma cópia do DOM real', isCorrect: true },
            { id: '2', text: 'Um DOM paralelo', isCorrect: false },
            { id: '3', text: 'Um DOM físico', isCorrect: false },
            { id: '4', text: 'Um DOM virtual', isCorrect: false }
          ],
          points: 2
        }
      ],
      status: 'scheduled',
      totalPoints: 10,
      submissions: 0
    }
  ]);

  const [showNewExamModal, setShowNewExamModal] = useState(false);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  const getStatusColor = (status: Exam['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getStatusText = (status: Exam['status']) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'scheduled':
        return 'Agendada';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluída';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Provas
        </h1>
        <button
          onClick={() => setShowNewExamModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nova Prova</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50">
                    <PenTool className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {exam.subject} • {exam.class}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                  {getStatusText(exam.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Data: {new Date(exam.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Duração: {exam.duration} minutos</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{exam.submissions} entregas</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {exam.questions.length} questões • {exam.totalPoints} pontos
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                      <Edit size={18} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Provas;