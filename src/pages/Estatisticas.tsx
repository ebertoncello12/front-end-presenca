import React from 'react';
import { BarChart2, PieChart, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Estatisticas = () => {
  // Dados para o gráfico
  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Presença (%)',
        data: [65, 70, 75, 80, 85, 82],
        backgroundColor: 'rgba(79, 70, 229, 0.8)', // Cor das barras
        borderColor: 'rgba(79, 70, 229, 1)', // Cor da borda das barras
        borderWidth: 1,
        borderRadius: 8, // Bordas arredondadas nas barras
        hoverBackgroundColor: 'rgba(79, 70, 229, 0.6)', // Cor ao passar o mouse
      },
    ],
  };

  // Opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Oculta a legenda
      },
      title: {
        display: false, // Oculta o título
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Cor do tooltip
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove as linhas de grade do eixo X
        },
        ticks: {
          color: '#6B7280', // Cor dos rótulos do eixo X
        },
      },
      y: {
        grid: {
          color: '#E5E7EB', // Cor das linhas de grade do eixo Y
        },
        ticks: {
          color: '#6B7280', // Cor dos rótulos do eixo Y
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Estatísticas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Presença Geral
            </h2>
            <PieChart className="text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            85%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Média de presença em todas as aulas
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total de Aulas
            </h2>
            <BarChart2 className="text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            48
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aulas registradas no semestre
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tendência
            </h2>
            <TrendingUp className="text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            +2.5%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aumento na frequência este mês
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Presença por Disciplina
          </h2>
          <div className="space-y-4">
            {['Cálculo III', 'Física II', 'Programação Web'].map(
              (disciplina) => (
                <div key={disciplina} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {disciplina}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      78%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-2 bg-primary-600 dark:bg-primary-500 rounded-full"
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Histórico Mensal
          </h2>
          <div className="h-64">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estatisticas;
