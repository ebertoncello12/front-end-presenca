import React, { useState } from 'react';
import { 
  QrCode,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { currentSemesterSubjects, getIconBgColor } from '../../data/subjects';

const Presenca = () => {
  const navigate = useNavigate();
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'late' | 'absent'>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  // Map the subjects to attendance records
  const attendanceRecords = currentSemesterSubjects.map(subject => ({
    ...subject,
    totalClasses: 30,
    attendedClasses: Math.round((subject.attendance / 100) * 30),
    attendancePercentage: subject.attendance,
    lastClass: {
      date: new Date().toISOString(),
      status: 'present' as const
    },
    nextClass: {
      date: new Date(Date.now() + 86400000).toISOString(),
      time: subject.schedule.split(', ')[1].split(' - ')[0]
    },
    records: [
      { id: '1', date: new Date().toISOString(), status: 'present', time: '07:55' },
      { id: '2', date: new Date(Date.now() - 86400000).toISOString(), status: 'present', time: '07:58' }
    ]
  }));

  const getStatusColor = (status: 'present' | 'late' | 'absent') => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getStatusIcon = (status: 'present' | 'late' | 'absent') => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'late':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
  };

  const getAttendanceIndicator = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleShowDetails = (subject: any) => {
    setSelectedSubject(subject);
    setShowDetailsModal(true);
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.lastClass.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Controle de Presença
        </h1>
        <button
          onClick={() => navigate('/registrar-presenca')}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <QrCode size={20} />
          <span>Bater Presença</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Buscar disciplina..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="present">Presente</option>
          <option value="late">Atrasado</option>
          <option value="absent">Ausente</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((subject) => (
          <div
            key={subject.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
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
                <button
                  onClick={() => handleShowDetails(subject)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <Info size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Presença Total</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {subject.attendancePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getAttendanceIndicator(subject.attendancePercentage)} rounded-full transition-all duration-500`}
                      style={{ width: `${subject.attendancePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">Última Aula</p>
                    {subject.lastClass && (
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">
                          {new Date(subject.lastClass.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subject.lastClass.status)}`}>
                          {subject.lastClass.status === 'present' && 'Presente'}
                          {subject.lastClass.status === 'late' && 'Atrasado'}
                          {subject.lastClass.status === 'absent' && 'Ausente'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">Próxima Aula</p>
                    {subject.nextClass && (
                      <div className="mt-1">
                        <p className="text-gray-900 dark:text-white">
                          {new Date(subject.nextClass.date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {subject.nextClass.time}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Details Modal */}
      {showDetailsModal && selectedSubject && (
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
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedSubject.professor}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total de Aulas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {selectedSubject.totalClasses}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Presenças</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {selectedSubject.attendedClasses}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Frequência</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                    {selectedSubject.attendancePercentage}%
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Histórico de Presenças
                </h3>
                <div className="space-y-3">
                  {selectedSubject.records.map((record: any) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(record.date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Horário: {record.time}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status === 'present' && 'Presente'}
                        {record.status === 'late' && 'Atrasado'}
                        {record.status === 'absent' && 'Ausente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Presenca;