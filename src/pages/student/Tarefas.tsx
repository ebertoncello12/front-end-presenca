import React, { useState } from 'react';
import { 
  FileQuestion,
  Calendar,
  Clock,
  Upload,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  Send
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'file' | 'quiz';
  dueDate: string;
  subject: string;
  professor: string;
  questions?: Question[];
  allowedFileTypes?: string[];
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  submission?: {
    file?: string;
    answers?: { [key: string]: string };
    submittedAt: string;
  };
}

const Tarefas = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Trabalho de Programação Web',
      description: 'Desenvolver uma API REST com Node.js e Express',
      type: 'file',
      dueDate: '2024-04-15',
      subject: 'Programação Web',
      professor: 'Dr. Silva',
      allowedFileTypes: ['.pdf', '.zip', '.rar'],
      status: 'pending'
    },
    {
      id: '2',
      title: 'Quiz - Estruturas de Dados',
      description: 'Avaliação sobre Árvores Binárias e Balanceamento',
      type: 'quiz',
      dueDate: '2024-04-10',
      subject: 'Estruturas de Dados',
      professor: 'Dra. Santos',
      questions: [
        {
          id: '1',
          text: 'Qual é a altura máxima de uma árvore AVL com 7 nós?',
          options: [
            { id: '1', text: '2', isCorrect: false },
            { id: '2', text: '3', isCorrect: true },
            { id: '3', text: '4', isCorrect: false },
            { id: '4', text: '5', isCorrect: false }
          ]
        },
        {
          id: '2',
          text: 'Em uma árvore AVL, qual é o fator de balanceamento máximo permitido?',
          options: [
            { id: '1', text: '1', isCorrect: true },
            { id: '2', text: '2', isCorrect: false },
            { id: '3', text: '3', isCorrect: false },
            { id: '4', text: '4', isCorrect: false }
          ]
        }
      ],
      status: 'pending'
    }
  ]);

  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar']
    },
    maxSize: 10485760, // 10MB
    onDrop: (acceptedFiles) => {
      console.log('Arquivos recebidos:', acceptedFiles);
    }
  });

  const handleStartQuiz = (task: Task) => {
    setSelectedTask(task);
    setSelectedAnswers({});
    setShowQuizModal(true);
  };

  const handleSubmitQuiz = () => {
    if (!selectedTask) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === selectedTask.id
        ? {
            ...task,
            status: 'submitted',
            submission: {
              answers: selectedAnswers,
              submittedAt: new Date().toISOString()
            }
          }
        : task
    );
    
    setTasks(updatedTasks);
    setShowQuizModal(false);
    setSelectedAnswers({});
    setShowSubmitConfirmation(true);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'graded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'submitted':
        return 'Enviado';
      case 'graded':
        return 'Corrigido';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto scrollbar-hide" style={{ height: 'calc(100vh - 4rem)' }}>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Tarefas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50">
                    {task.type === 'quiz' ? (
                      <FileQuestion className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {task.subject} • {task.professor}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Entrega: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                </div>
                {task.submission && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Enviado em: {new Date(task.submission.submittedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.type === 'quiz'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {task.type === 'quiz' ? 'Quiz' : 'Arquivo'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {task.description}
                </p>
                {task.status === 'pending' && (
                  <button
                    onClick={() => task.type === 'quiz' ? handleStartQuiz(task) : null}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    {task.type === 'quiz' ? (
                      <>
                        <FileQuestion size={20} />
                        <span>Iniciar Quiz</span>
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        <span>Enviar Arquivo</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal do Quiz */}
      {showQuizModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTask.title}
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {selectedTask.subject}
                </p>
              </div>
              <button
                onClick={() => setShowQuizModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedTask.questions?.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {index + 1}. {question.text}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={selectedAnswers[question.id] === option.id}
                          onChange={() => setSelectedAnswers({
                            ...selectedAnswers,
                            [question.id]: option.id
                          })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {option.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Send size={20} />
                <span>Enviar Respostas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Envio */}
      {showSubmitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quiz Enviado!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Suas respostas foram enviadas com sucesso. Você receberá o resultado em breve.
            </p>
            <button
              onClick={() => setShowSubmitConfirmation(false)}
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tarefas;