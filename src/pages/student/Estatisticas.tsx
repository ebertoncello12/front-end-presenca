import React, { useState } from 'react';
import { 
  BarChart2, 
  PieChart as PieChartIcon, 
  TrendingUp,
  Calendar,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { currentSemesterSubjects } from '../../data/subjects';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Estatisticas = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'semester'>('semester');
  const [selectedSubject, setSelectedSubject] = useState<string>(currentSemesterSubjects[0].id);
  const [selectedPerformanceSubject, setSelectedPerformanceSubject] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Map the subjects to statistics format
  const subjectStats = currentSemesterSubjects.map(subject => ({
    name: subject.name,
    attendance: subject.attendance,
    grade: subject.grade || 0,
    trend: 0.5,
    lastGrades: [7.5, 8.0, 8.5, 8.8, 8.5],
    attendanceHistory: [85, 88, 92, 90, 90, 89],
    status: subject.attendance >= 90 ? 'good' : subject.attendance >= 75 ? 'warning' : 'risk'
  }));

  const overallStats = {
    averageGrade: 8.2,
    averageAttendance: 85,
    totalClasses: 180,
    completedClasses: 152,
    missedClasses: 8,
    upcomingTests: 3,
    gradeTrend: 2.5,
    attendanceTrend: 1.8
  };

  const getStatusColor = (status: 'good' | 'warning' | 'risk') => {
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'risk':
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getStatusBg = (status: 'good' | 'warning' | 'risk') => {
    switch (status) {
      case 'good':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'risk':
        return 'bg-red-100 dark:bg-red-900/20';
    }
  };

  // Performance data for specific subjects
  const getPerformanceData = (subjectName: string) => {
    if (subjectName === 'all') {
      return {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Média Geral',
            data: [7.8, 8.0, 8.2, 8.5, 8.2, 8.4],
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      };
    }

    const subject = subjectStats.find(s => s.name === subjectName);
    return {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: `Média - ${subjectName}`,
          data: subject?.lastGrades || [],
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  // Chart data for attendance distribution
  const attendanceData = {
    labels: ['> 90%', '75-90%', '< 75%'],
    datasets: [{
      data: [8, 4, 1],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(234, 179, 8)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 1
    }]
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Estatísticas Acadêmicas
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              selectedPeriod === 'month'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setSelectedPeriod('semester')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              selectedPeriod === 'semester'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Semestre
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Média Geral</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {overallStats.averageGrade.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <Award className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+{overallStats.gradeTrend}%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">vs. último período</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Presença Média</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {overallStats.averageAttendance}%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+{overallStats.attendanceTrend}%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">vs. último período</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aulas Completadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {overallStats.completedClasses}/{overallStats.totalClasses}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-gray-600 dark:text-gray-400">
              {overallStats.missedClasses} aulas perdidas
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Próximas Avaliações</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {overallStats.upcomingTests}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-gray-600 dark:text-gray-400">
              Próxima em 5 dias
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Evolução do Desempenho
            </h2>
            <select
              value={selectedPerformanceSubject}
              onChange={(e) => setSelectedPerformanceSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Geral</option>
              {subjectStats.map(subject => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <Line
              data={getPerformanceData(selectedPerformanceSubject)}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 5,
                    max: 10
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Distribuição de Frequência
          </h2>
          <div className="h-64">
            <Pie
              data={attendanceData}
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
      </div>

      {/* Subject Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Desempenho por Disciplina
            </h2>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {subjectStats.map(subject => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {subjectStats
              .filter(s => s.name === selectedSubject)
              .map((subject) => (
                <div
                  key={subject.name}
                  className={`p-6 rounded-lg ${getStatusBg(subject.status)}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-800">
                        <BookOpen className={`h-6 w-6 ${getStatusColor(subject.status)}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {subject.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Média: {subject.grade.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Presença: {subject.attendance}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {subject.trend > 0 ? (
                        <ArrowUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDown className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`text-sm ${
                        subject.trend > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {Math.abs(subject.trend)}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Notas</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {subject.grade.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
                          style={{ width: `${(subject.grade / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Presença</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {subject.attendance}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 dark:bg-green-500 rounded-full"
                          style={{ width: `${subject.attendance}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Bar
                      data={{
                        labels: ['Prova 1', 'Prova 2', 'Trabalho 1', 'Trabalho 2', 'Projeto'],
                        datasets: [{
                          label: 'Notas',
                          data: subject.lastGrades,
                          backgroundColor: 'rgba(79, 70, 229, 0.8)',
                          borderRadius: 4
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 10
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estatisticas;