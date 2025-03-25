import React, {useEffect, useState} from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  QrCode,
  ChevronRight,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { currentSemesterSubjects, getIconBgColor } from '../../data/subjects';
import StudentService from "../../services/student.service.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studentSubjectsSemester, setStudentSubjectsSemester] = useState<any | null>(null);
  const [studentData, setStudentData] = useState<any | null>(null);
  const { user } = useAuth();

  console.log(user)


  const stats = [
    { 
      title: 'Disciplinas Cursando', 
      value: studentData?.subjectCount,
      icon: BookOpen,
      color: 'purple',
      trend: '+2 desde o último semestre'
    },
    { 
      title: 'Presença Total', 
      value: `${studentData?.totalAttendance}%`,
      icon: Users,
      color: 'green',
      trend: '+5% este mês'
    },
    { 
      title: 'Próxima Aula', 
      value: currentSemesterSubjects[0].schedule.split(', ')[1].split(' - ')[0], 
      icon: Clock,
      color: 'orange',
      trend: `${currentSemesterSubjects[0].name}`
    },
  ];

  const getStatusColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600 dark:text-green-400';
    if (attendance >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setShowDetailsModal(true);
  };



  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await StudentService.getInfoDash();
        setStudentData(data);
        const subjectsData = await StudentService.getSubjectsDash(user?.id);
        setStudentSubjectsSemester(subjectsData);
      } catch (error) {
        console.error("Erro ao buscar informações do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button
          onClick={() => navigate('/registrar-presenca')}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <QrCode size={20} />
          <span>Bater Presença</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${getIconBgColor(stat.color)}`}>
                <stat.icon size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Minhas Disciplinas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {currentSemesterSubjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getIconBgColor(subject.color)}`}>
                      <subject.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {subject.schedule.split(', ')[1]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubjectClick(subject.id);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Info size={20} />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Presença</span>
                    <span className={`font-medium ${getStatusColor(subject.attendance)}`}>
                      {subject.attendance}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        subject.attendance >= 90
                          ? 'bg-green-500'
                          : subject.attendance >= 75
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.attendance}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Details Modal */}
      {showDetailsModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              {currentSemesterSubjects.map(subject => subject.id === selectedSubject && (
                <div key={subject.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getIconBgColor(subject.color)}`}>
                      <subject.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {subject.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {subject.professor}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6">
              {currentSemesterSubjects.map(subject => subject.id === selectedSubject && (
                <div key={subject.id} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Informações da Disciplina
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <Clock className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{subject.schedule}</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <Users className="h-5 w-5 mr-2 text-gray-400" />
                          <span>Sala {subject.room}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Próximos Tópicos
                      </h3>
                      <div className="space-y-2">
                        {subject.topics.map((topic, index) => (
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

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Desempenho
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Presença</span>
                          <span className={`font-medium ${getStatusColor(subject.attendance)}`}>
                            {subject.attendance}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              subject.attendance >= 90
                                ? 'bg-green-500'
                                : subject.attendance >= 75
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${subject.attendance}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Média</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {subject.grade?.toFixed(1) || '-'}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${((subject.grade || 0) / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;