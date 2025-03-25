import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  User, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Lock,
  Plus,
  X,
  Save,
  ChevronRight,
  Info,
  GraduationCap
} from 'lucide-react';
import { currentSemesterSubjects, availableSubjects, getIconBgColor } from '../../data/subjects';

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  workload: number;
  semester: number;
  status: 'completed' | 'in_progress' | 'available' | 'locked';
  professor?: string;
  schedule?: string;
  prerequisites: string[];
  description: string;
  grade?: number;
}

interface PlannedSubject extends Subject {
  isSelected?: boolean;
}

const GradeCurricular = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'planning'>('current');
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [plannedSemester, setPlannedSemester] = useState<PlannedSubject[]>([]);
  const [showPlanningConfirmation, setShowPlanningConfirmation] = useState(false);

  // Constants for credit limits
  const MIN_CREDITS = 16;
  const MAX_CREDITS = 32;
  const TOTAL_COURSE_CREDITS = 240;

  // Calculate total credits selected
  const selectedCredits = plannedSemester
    .filter(subject => subject.isSelected)
    .reduce((sum, subject) => sum + subject.credits, 0);

  // Calculate remaining course credits
  const completedCredits = currentSemesterSubjects.reduce((sum, subject) => sum + subject.credits, 0);
  const remainingCredits = TOTAL_COURSE_CREDITS - completedCredits;

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowSubjectModal(true);
  };

  const toggleSubjectSelection = (subject: PlannedSubject) => {
    if (subject.status === 'locked') return;

    const newIsSelected = !subject.isSelected;
    const newTotalCredits = selectedCredits + (newIsSelected ? subject.credits : -subject.credits);

    if (newTotalCredits > MAX_CREDITS) {
      alert(`Você não pode selecionar mais de ${MAX_CREDITS} créditos por semestre.`);
      return;
    }

    const updatedSubjects = plannedSemester.map(s =>
      s.id === subject.id ? { ...s, isSelected: newIsSelected } : s
    );
    setPlannedSemester(updatedSubjects);
  };

  const startPlanning = () => {
    setIsPlanning(true);
    setPlannedSemester(availableSubjects.map(subject => ({
      ...subject,
      isSelected: false,
      status: 'available',
      prerequisites: [],
      semester: currentSemesterSubjects[0].semester + 1,
      credits: 4,
      workload: 60
    })));
  };

  const savePlannedSemester = () => {
    if (selectedCredits < MIN_CREDITS) {
      alert(`Você precisa selecionar no mínimo ${MIN_CREDITS} créditos.`);
      return;
    }
    setShowPlanningConfirmation(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Grade Curricular
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'current'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Semestre Atual
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'planning'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Montar Grade Futura
          </button>
        </div>
      </div>

      {activeTab === 'current' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSemesterSubjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
              onClick={() => handleSubjectClick(subject)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getIconBgColor(subject.color)}`}>
                      <subject.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {subject.code} • 4 créditos
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Cursando
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    <span>{subject.professor}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{subject.schedule}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Planejamento do Próximo Semestre
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Créditos selecionados: {selectedCredits}/{MAX_CREDITS} • 
                  Créditos restantes no curso: {remainingCredits}
                </p>
              </div>
              {!isPlanning ? (
                <button
                  onClick={startPlanning}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Iniciar Planejamento</span>
                </button>
              ) : (
                <button
                  onClick={savePlannedSemester}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Save size={20} />
                  <span>Salvar Planejamento</span>
                </button>
              )}
            </div>
          </div>

          {isPlanning ? (
            <div className="p-6">
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Selecione entre {MIN_CREDITS} e {MAX_CREDITS} créditos para o próximo semestre.
                      Você ainda precisa completar {remainingCredits} créditos para se formar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {plannedSemester.map((subject) => (
                  <div
                    key={subject.id}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      subject.isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } cursor-pointer`}
                    onClick={() => toggleSubjectSelection(subject)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getIconBgColor(subject.color)}`}>
                          <subject.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {subject.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {subject.code} • {subject.credits} créditos • {subject.workload}h
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {subject.schedule}
                        </span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          subject.isSelected
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          {subject.isSelected && <CheckCircle size={16} />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="max-w-sm mx-auto">
                <GraduationCap className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Monte sua Grade Futura
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Planeje as disciplinas que deseja cursar no próximo semestre.
                  Você precisa completar {remainingCredits} créditos para se formar.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subject Details Modal */}
      {showSubjectModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${getIconBgColor(selectedSubject.color)}`}>
                    <selectedSubject.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedSubject.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {selectedSubject.code}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSubjectModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Informações Gerais
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <User className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                      <span>{selectedSubject.professor}</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Clock className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                      <span>{selectedSubject.schedule}</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Calendar className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                      <span>60h • 4 créditos</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Tópicos
                  </h3>
                  <div className="space-y-2">
                    {selectedSubject.topics.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Planning Confirmation Modal */}
      {showPlanningConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Planejamento Salvo!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Seu planejamento para o próximo semestre foi salvo com sucesso.
              Total de créditos selecionados: {selectedCredits}
            </p>
            <button
              onClick={() => {
                setShowPlanningConfirmation(false);
                setIsPlanning(false);
                setActiveTab('current');
              }}
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

export default GradeCurricular;