import React, { useState } from 'react';
import { 
  FileQuestion,
  Plus,
  Upload,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Save,
  PlusCircle,
  MinusCircle,
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
  class: string;
  questions?: Question[];
  allowedFileTypes?: string[];
  status: 'draft' | 'published';
  submissions: number;
  template?: boolean;
}

interface QuizTemplate {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
  createdAt: string;
}

const Tarefas = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('professorTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [quizTemplates, setQuizTemplates] = useState<QuizTemplate[]>(() => {
    const savedTemplates = localStorage.getItem('quizTemplates');
    return savedTemplates ? JSON.parse(savedTemplates) : [];
  });

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [templateTitle, setTemplateTitle] = useState('');
  const [showTaskOptionsMenu, setShowTaskOptionsMenu] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    type: 'file',
    status: 'draft',
    questions: []
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar']
    },
    maxSize: 10485760,
    onDrop: (acceptedFiles) => {
      console.log('Arquivos recebidos:', acceptedFiles);
    }
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.subject || !newTask.dueDate) {
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      type: newTask.type || 'file',
      dueDate: newTask.dueDate,
      subject: newTask.subject,
      class: newTask.class || '',
      status: 'draft',
      submissions: 0,
      questions: newTask.questions,
      allowedFileTypes: newTask.type === 'file' ? ['.pdf', '.zip', '.rar'] : undefined
    };

    setTasks([...tasks, task]);
    setShowNewTaskModal(false);
    
    if (task.type === 'quiz') {
      setShowSaveTemplateModal(true);
    } else {
      setNewTask({ type: 'file', status: 'draft', questions: [] });
    }
  };

  const handleSaveTemplate = () => {
    if (!templateTitle || !newTask.subject || !newTask.questions) return;

    const template: QuizTemplate = {
      id: Date.now().toString(),
      title: templateTitle,
      subject: newTask.subject,
      questions: newTask.questions,
      createdAt: new Date().toISOString()
    };

    setQuizTemplates([...quizTemplates, template]);
    setShowSaveTemplateModal(false);
    setTemplateTitle('');
    setNewTask({ type: 'file', status: 'draft', questions: [] });
  };

  const handleUseTemplate = (template: QuizTemplate) => {
    setNewTask({
      ...newTask,
      type: 'quiz',
      questions: template.questions,
      subject: template.subject
    });
    setShowTemplatesModal(false);
  };

  const handleAddQuestion = () => {
    const newQuestions = [...(newTask.questions || [])];
    newQuestions.push({
      id: Date.now().toString(),
      text: '',
      options: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false }
      ]
    });
    setNewTask({ ...newTask, questions: newQuestions });
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...(newTask.questions || [])];
    const currentOptions = newQuestions[questionIndex].options;
    
    if (currentOptions.length < 5) {
      currentOptions.push({
        id: Date.now().toString(),
        text: '',
        isCorrect: false
      });
      setNewTask({ ...newTask, questions: newQuestions });
    }
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...(newTask.questions || [])];
    const currentOptions = newQuestions[questionIndex].options;
    
    if (currentOptions.length > 2) {
      currentOptions.splice(optionIndex, 1);
      setNewTask({ ...newTask, questions: newQuestions });
    }
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...(newTask.questions || [])];
    newQuestions.splice(index, 1);
    setNewTask({ ...newTask, questions: newQuestions });
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const newQuestions = [...(newTask.questions || [])];
    if (field === 'text') {
      newQuestions[index].text = value;
    }
    setNewTask({ ...newTask, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    const newQuestions = [...(newTask.questions || [])];
    if (field === 'text') {
      newQuestions[questionIndex].options[optionIndex].text = value;
    } else if (field === 'isCorrect') {
      newQuestions[questionIndex].options.forEach((opt, idx) => {
        opt.isCorrect = idx === optionIndex;
      });
    }
    setNewTask({ ...newTask, questions: newQuestions });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => 
    selectedSubject === 'all' || task.subject === selectedSubject
  );

  const filteredTemplates = quizTemplates.filter(template =>
    selectedSubject === 'all' || template.subject === selectedSubject
  );

  return (
    <div className="space-y-6 overflow-y-auto scrollbar-hide" style={{ height: 'calc(100vh - 4rem)' }}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tarefas
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todas as Disciplinas</option>
            <option value="Programação Web">Programação Web</option>
            <option value="Estruturas de Dados">Estruturas de Dados</option>
          </select>
          <div className="relative">
            <button
              onClick={() => setShowTaskOptionsMenu(!showTaskOptionsMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={20} />
              <span>Nova Tarefa</span>
              <ChevronDown size={16} />
            </button>
            
            {showTaskOptionsMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowTaskOptionsMenu(false);
                      setShowNewTaskModal(true);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Plus size={18} />
                    <span>Criar Nova Tarefa</span>
                  </button>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                  
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Templates Disponíveis
                    </h3>
                  </div>
                  
                  {filteredTemplates.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Nenhum template disponível
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {filteredTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            handleUseTemplate(template);
                            setShowTaskOptionsMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center space-x-2">
                            <FileQuestion size={18} className="text-primary-600 dark:text-primary-400" />
                            <div className="text-left">
                              <div className="font-medium">{template.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {template.questions.length} questões
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUseTemplate(template)}
                            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-md transition-colors text-sm flex items-center space-x-1"
                          >
                            <FileQuestion size={14} />
                            <span>Usar</span>
                          </button>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
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
                      <Upload className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {task.subject} • {task.class}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Data: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{task.submissions} entregas</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {task.questions?.length || 0} questões
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                      <Edit size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nova Tarefa
              </h2>
              <div className="flex items-center space-x-4">
                {newTask.type === 'quiz' && (
                  <button
                    onClick={() => setShowTemplatesModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    <FileQuestion size={20} />
                    <span>Usar Template</span>
                  </button>
                )}
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Digite o título da tarefa"
                    value={newTask.title || ''}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Tarefa
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setNewTask({ ...newTask, type: 'file' })}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        newTask.type === 'file'
                          ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/50 dark:border-primary-400 dark:text-primary-300'
                          : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      Envio de Arquivo
                    </button>
                    <button
                      onClick={() => setNewTask({ ...newTask, type: 'quiz' })}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        newTask.type === 'quiz'
                          ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/50 dark:border-primary-400 dark:text-primary-300'
                          : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      Quiz
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder="Digite a descrição da tarefa"
                    value={newTask.description || ''}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Disciplina
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={newTask.subject || ''}
                      onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      <option value="Programação Web">Programação Web</option>
                      <option value="Estruturas de Dados">Estruturas de Dados</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Entrega
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={newTask.dueDate || ''}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                {newTask.type === 'quiz' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Questões
                      </h3>
                      <button
                        onClick={handleAddQuestion}
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <PlusCircle size={20} />
                        <span>Adicionar Questão</span>
                      </button>
                    </div>

                    {(newTask.questions || []).map((question, questionIndex) => (
                      <div key={question.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            Questão {questionIndex + 1}
                          </h4>
                          <button
                            onClick={() => handleRemoveQuestion(questionIndex)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <MinusCircle size={20} />
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pergunta
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Digite a pergunta"
                            value={question.text}
                            onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Alternativas
                            </label>
                            {question.options.length < 5 && (
                              <button
                                onClick={() => handleAddOption(questionIndex)}
                                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center space-x-1"
                              >
                                <PlusCircle size={16} />
                                <span>Adicionar Alternativa</span>
                              </button>
                            )}
                          </div>
                          {question.options.map((option, optionIndex) => (
                            <div key={option.id} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`question-${question.id}-correct`}
                                checked={option.isCorrect}
                                onChange={() => handleOptionChange(questionIndex, optionIndex, 'isCorrect', true)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                              />
                              <input
                                type="text"
                                placeholder={`Alternativa ${optionIndex + 1}`}
                                value={option.text}
                                onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              {question.options.length > 2 && (
                                <button
                                  onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <MinusCircle size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Templates Disponíveis
              </h2>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredTemplates.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Nenhum template disponível para esta disciplina
                  </p>
                ) : (
                  filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {template.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {template.subject} • {template.questions.length} questões
                          </p>
                        </div>
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors"
                        >
                          <FileQuestion size={20} />
                          <span>Usar Template</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Salvar como Template
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Template
                </label>
                <input
                  type="text"
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Digite um nome para o template"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowSaveTemplateModal(false);
                  setNewTask({ type: 'file', status: 'draft', questions: [] });
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Não Salvar
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Salvar Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tarefas;