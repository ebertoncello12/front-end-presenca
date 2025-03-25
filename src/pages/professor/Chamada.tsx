import React, { useState } from 'react';
import { 
  QrCode,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Timer,
  MapPin,
  BookOpen,
  Search,
  Filter,
  Download,
  ChevronRight
} from 'lucide-react';
import TeacherService from '../../services/teacher.service';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  photo: string;
  checkInTime?: string;
  status: 'present' | 'absent' | 'late';
}

interface ActiveClass {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  totalStudents: number;
  presentStudents: number;
  qrCodeExpiration: number;
  status: 'not_started' | 'in_progress' | 'finished';
  students: Student[];
}

const mockActiveClasses: ActiveClass[] = [
  {
    id: '1',
    subject: 'Programação Web',
    date: '2024-03-21',
    startTime: '19:00',
    endTime: '22:30',
    room: 'Lab 01',
    totalStudents: 35,
    presentStudents: 28,
    qrCodeExpiration: 300,
    status: 'in_progress',
    students: [
      {
        id: '1',
        name: 'Ana Silva',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        checkInTime: '19:05',
        status: 'present'
      },
      {
        id: '2',
        name: 'Carlos Santos',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        checkInTime: '19:15',
        status: 'late'
      }
    ]
  },
  {
    id: '2',
    subject: 'Banco de Dados',
    date: '2024-03-21',
    startTime: '19:00',
    endTime: '22:30',
    room: 'Lab 02',
    totalStudents: 40,
    presentStudents: 32,
    qrCodeExpiration: 300,
    status: 'in_progress',
    students: [
      {
        id: '3',
        name: 'Maria Oliveira',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        checkInTime: '19:02',
        status: 'present'
      }
    ]
  }
];

const Chamada = () => {
  const [selectedClass, setSelectedClass] = useState<ActiveClass | null>(null);
  const [qrCodeActive, setQrCodeActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ qrCode: string; expirationTime: number } | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  console.log(qrCodeData)

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getClassStatusColor = (status: ActiveClass['status']) => {
    switch (status) {
      case 'in_progress':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'not_started':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'finished':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
  };

  const handleGenerateQR = async (classData: ActiveClass) => {
    try {
      setIsGeneratingQR(true);
      const response = await TeacherService.generateQRCode('550e8400-e29b-41d4-a716-446655440017', classData.qrCodeExpiration / 60);
      setQrCodeData(response);
      setSelectedClass(classData);
      setShowQRModal(true);
      setTimeLeft(classData.qrCodeExpiration);

      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setQrCodeActive(false);
            setShowQRModal(false);
            setQrCodeData(null);
            return classData.qrCodeExpiration;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Erro ao gerar QR code. Tente novamente.');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeData?.qrcode.image) {
      const link = document.createElement('a');
      link.href = qrCodeData?.qrcode.image;
      link.download = `qrcode-${selectedClass?.subject}-${new Date().toISOString()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleClassSelect = (classData: ActiveClass) => {
    setSelectedClass(classData);
  };

  const filteredStudents = selectedClass?.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Chamada
        </h1>
      </div>

      {/* Active Classes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockActiveClasses.map((classData) => (
          <div
            key={classData.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:border-primary-500 dark:hover:border-primary-500 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50">
                    <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {classData.subject}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {classData.room}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getClassStatusColor(classData.status)}`}>
                  {classData.status === 'in_progress' && 'Em Andamento'}
                  {classData.status === 'not_started' && 'Não Iniciada'}
                  {classData.status === 'finished' && 'Finalizada'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  {classData.startTime} - {classData.endTime}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  {classData.presentStudents}/{classData.totalStudents} alunos presentes
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleClassSelect(classData)}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                >
                  Ver Detalhes
                </button>
                {classData.status === 'in_progress' && (
                  <button
                    onClick={() => handleGenerateQR(classData)}
                    className="flex items-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <QrCode size={16} />
                    <span>Gerar QR</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Class Details */}
      {selectedClass && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedClass.subject}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedClass.room} • {selectedClass.startTime} - {selectedClass.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {/* Implement export functionality */}}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download size={20} />
                  <span>Exportar Lista</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Taxa de Presença
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round((selectedClass.presentStudents / selectedClass.totalStudents) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${(selectedClass.presentStudents / selectedClass.totalStudents) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
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

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Horário de Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.checkInTime || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(student.status)}
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                            {student.status === 'present' && 'Presente'}
                            {student.status === 'late' && 'Atrasado'}
                            {student.status === 'absent' && 'Ausente'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
                  <QrCode className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  QR Code de Presença
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {selectedClass.subject} - {selectedClass.room}
                </p>
              </div>

              {/* QR Code Display */}
              <div className="bg-white p-4 rounded-lg shadow-inner mx-auto w-64 h-64 flex items-center justify-center">
                {isGeneratingQR ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
                ) : qrCodeData ? (
                  <img 
                    src={qrCodeData.qrcode.image}
                    alt="QR Code" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    QR Code não disponível
                  </div>
                )}
              </div>

              {/* Timer */}
              <div className="mt-6 flex items-center justify-center space-x-2">
                <Timer className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                {qrCodeData && (
                  <button
                    onClick={handleDownloadQR}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Download size={20} />
                    <span>Download QR Code</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowQRModal(false);
                    setQrCodeData(null);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chamada;