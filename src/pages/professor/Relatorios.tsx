import React, { useState } from 'react';
import { 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface SubjectStats {
  name: string;
  totalStudents: number;
  averageAttendance: number;
  averageGrade: number;
  riskStudents: number;
  topPerformers: number;
  attendanceTrend: number[];
  gradeTrend: number[];
}

const mockSubjectStats: SubjectStats[] = [
  {
    name: 'Programação Web',
    totalStudents: 35,
    averageAttendance: 85,
    averageGrade: 7.8,
    riskStudents: 4,
    topPerformers: 8,
    attendanceTrend: [82, 85, 83, 87, 85, 88],
    gradeTrend: [7.2, 7.5, 7.8, 7.6, 7.9, 7.8]
  },
  {
    name: 'Banco de Dados',
    totalStudents: 40,
    averageAttendance: 82,
    averageGrade: 7.5,
    riskStudents: 6,
    topPerformers: 10,
    attendanceTrend: [80, 82, 81, 83, 82, 84],
    gradeTrend: [7.0, 7.2, 7.5, 7.4, 7.6, 7.5]
  }
];

const Relatorios = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'semester'>('month');
  const [selectedSubject, setSelectedSubject] = useState<string>(mockSubjectStats[0].name);
  const [expandedSection, setExpandedSection] = useState<string | null>('performance');

  const currentStats = mockSubjectStats.find(s => s.name === selectedSubject)!;

  // Performance Distribution Data
  const performanceData = {
    labels: ['Excelente (>9.0)', 'Bom (7.0-8.9)', 'Regular (5.0-6.9)', 'Risco (<5.0)'],
    datasets: [{
      data: [currentStats.topPerformers, 15, 8, currentStats.riskStudents],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
        'rgb(234, 179, 8)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 1
    }]
  };

  // Attendance Trend Data
  const trendData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6'],
    datasets: [
      {
        label: 'Frequência',
        data: currentStats.attendanceTrend,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Notas',
        data: currentStats.gradeTrend,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Relatórios
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {mockSubjectStats.map(subject => (
              <option key={subject.name} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={() => {/* Implement export functionality */}}
          >
            <Download size={20} />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {currentStats.totalStudents}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+5%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">vs. último período</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Média de Notas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {currentStats.averageGrade.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <BarChart2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+2.3%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">vs. último período</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Frequência Média</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {currentStats.averageAttendance}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+3%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">vs. último período</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Alunos em Risco</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {currentStats.riskStudents}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
            <span className="text-red-500">-2</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">vs. último período</span>
          </div>
        </div>
      </div>

      {/* Detailed Reports Sections */}
      <div className="space-y-6">
        {/* Performance Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('performance')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Análise de Desempenho
              </h2>
            </div>
            {expandedSection === 'performance' ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {expandedSection === 'performance' && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Distribuição de Desempenho
                  </h3>
                  <div className="h-64">
                    <Pie
                      data={performanceData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Tendências
                  </h3>
                  <div className="h-64">
                    <Line
                      data={trendData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            min: 0,
                            max: 100
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-medium text-green-800 dark:text-green-200">
                      Alto Desempenho
                    </h4>
                  </div>
                  <p className="mt-2 text-sm text-green-600 dark:text-green-300">
                    {currentStats.topPerformers} alunos com média acima de 9.0
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                      Atenção
                    </h4>
                  </div>
                  <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-300">
                    8 alunos com média entre 5.0 e 6.9
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <h4 className="font-medium text-red-800 dark:text-red-200">
                      Risco
                    </h4>
                  </div>
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                    {currentStats.riskStudents} alunos com média abaixo de 5.0
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">
                      Evolução
                    </h4>
                  </div>
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-300">
                    +15% de melhoria em relação ao início
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attendance Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('attendance')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Análise de Frequência
              </h2>
            </div>
            {expandedSection === 'attendance' ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {expandedSection === 'attendance' && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Distribuição de Frequência
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Acima de 90%</span>
                        <span className="text-gray-900 dark:text-white">12 alunos</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '40%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">75% - 90%</span>
                        <span className="text-gray-900 dark:text-white">15 alunos</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '50%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">60% - 75%</span>
                        <span className="text-gray-900 dark:text-white">6 alunos</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Abaixo de 60%</span>
                        <span className="text-gray-900 dark:text-white">2 alunos</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: '7%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Análise Temporal
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Média de Presença
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {currentStats.averageAttendance}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-2 bg-primary-500 rounded-full"
                          style={{ width: `${currentStats.averageAttendance}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                          Maior Frequência
                        </h4>
                        <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                          95%
                        </p>
                        <p className="mt-1 text-sm text-green-600 dark:text-green-300">
                          Terça-feira, 14:00
                        </p>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Menor Frequência
                        </h4>
                        <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                          65%
                        </p>
                        <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                          Quinta-feira, 16:00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <button
            onClick={() => toggleSection('recommendations')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recomendações
              </h2>
            </div>
            {expandedSection === 'recommendations' ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {expandedSection === 'recommendations' && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h3 className="flex items-center text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Pontos de Atenção
                    </h3>
                    <ul className="space-y-2 text-yellow-600 dark:text-yellow-300">
                      <li>• 4 alunos com frequência abaixo de 75%</li>
                      <li>• Queda no desempenho nas últimas avaliações</li>
                      <li>• Alta taxa de atrasos nas aulas matutinas</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="flex items-center text-lg font-medium text-green-800 dark:text-green-200 mb-2">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Pontos Positivos
                    </h3>
                    <ul className="space-y-2 text-green-600 dark:text-green-300">
                      <li>• Aumento na participação em atividades práticas</li>
                      <li>• Melhoria na média geral da turma</li>
                      <li>• Redução no número de faltas não justificadas</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Ações Sugeridas
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-medium">1</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Acompanhamento Individual
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Agendar reuniões com os 4 alunos em situação crítica de frequência
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-medium">2</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Revisão de Conteúdo
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Organizar sessão de revisão para tópicos com menor desempenho
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-medium">3</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Atividades Complementares
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Implementar exercícios práticos adicionais para reforço
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
