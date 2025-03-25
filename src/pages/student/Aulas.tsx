import React, { useState } from 'react';
import { 
  Search,
  Calendar,
  Clock,
  MapPin,
  Info
} from 'lucide-react';
import { currentSemesterSubjects, getIconBgColor } from '../../data/subjects';

const Aulas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todas' | 'realizada' | 'proxima' | 'cancelada'>('proxima');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizada':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'proxima':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'futura':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredSubjects = currentSemesterSubjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.professor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const topicStatus = (index: number) => index === 0 ? 'realizada' : index === 1 ? 'proxima' : 'futura';
    const hasMatchingStatus = statusFilter === 'todas' || 
                             subject.topics.some((_, index) => topicStatus(index) === statusFilter);
    
    return matchesSearch && hasMatchingStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Aulas</h1>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar aulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="todas">Todos os Status</option>
            <option value="realizada">Realizadas</option>
            <option value="proxima">Próximas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
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
                      {subject.professor}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Presença
                  </div>
                  <div className={`text-lg font-bold ${getIconBgColor(subject.color)}`}>
                    {subject.attendance}%
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {subject.topics
                  .map((topic, index) => ({
                    topic,
                    status: index === 0 ? 'realizada' : index === 1 ? 'proxima' : 'futura'
                  }))
                  .filter(({ status }) => statusFilter === 'todas' || status === statusFilter)
                  .map(({ topic, status }, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className={`h-5 w-5 ${getIconBgColor(subject.color)}`} />
                          <span className="text-gray-900 dark:text-white">
                            {new Date().toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>

                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {topic}
                      </h4>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {subject.schedule.split(', ')[1]}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {subject.room}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aulas;