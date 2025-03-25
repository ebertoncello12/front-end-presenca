import React, { useState } from 'react';
import { 
  FileText,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  Target,
  List,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  duration: number;
  objectives: string[];
  content: string[];
  methodology: string;
  resources: string[];
  evaluation: string;
  status: 'draft' | 'published';
}

const PlanoAula = () => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([
    {
      id: '1',
      title: 'Introdução ao React',
      subject: 'Programação Web',
      class: 'CC-2024-1',
      date: '2024-04-15',
      duration: 120,
      objectives: [
        'Compreender os conceitos básicos do React',
        'Entender o funcionamento do Virtual DOM',
        'Criar componentes funcionais simples'
      ],
      content: [
        'O que é React?',
        'Virtual DOM e seu funcionamento',
        'Componentes e Props',
        'Estado e Ciclo de Vida'
      ],
      methodology: 'Aula expositiva com exemplos práticos e exercícios em laboratório',
      resources: [
        'Computadores com Node.js instalado',
        'Projetor',
        'Material de apoio em PDF'
      ],
      evaluation: 'Exercícios práticos durante a aula e projeto em grupo',
      status: 'published'
    }
  ]);

  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const getStatusColor = (status: LessonPlan['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Planos de Aula
        </h1>
        <button
          onClick={() => setShowNewPlanModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          <span>Novo Plano</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessonPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50">
                    <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {plan.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {plan.subject} • {plan.class}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                  {plan.status === 'draft' ? 'Rascunho' : 'Publicado'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Data: {new Date(plan.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Duração: {plan.duration} minutos</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ver detalhes
                  </span>
                  {expandedPlan === plan.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {expandedPlan === plan.id && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Objetivos
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {plan.objectives.map((objective, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Conteúdo
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {plan.content.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Metodologia
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.methodology}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recursos
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {plan.resources.map((resource, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Avaliação
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.evaluation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanoAula;