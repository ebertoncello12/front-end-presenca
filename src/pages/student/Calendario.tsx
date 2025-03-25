import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Clock, X, MapPin, User } from 'lucide-react';
import StudentService from "../../services/student.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from 'react-hot-toast';

interface Aula {
  id: string;
  tema: string;
  date: string;
  title: string;
  type: string;
  disciplina: string;
  metodologia: string;
  observacoes: string;
  room: string;
  time: string;
}

interface Subject {
  nome: string;
  professor: string;
  aulas: Aula[];
}

const mockData: Subject[] = [
  {
    nome: 'Cálculo III',
    professor: 'Dr. Silva',
    aulas: [
      {
        id: '1',
        tema: 'Derivadas Parciais',
        date: new Date().toISOString(),
        title: 'Derivadas Parciais',
        type: 'class',
        disciplina: 'Cálculo III',
        metodologia: 'Aula expositiva com exercícios práticos',
        observacoes: 'Trazer calculadora científica',
        room: 'A-101',
        time: '08:00 - 10:00'
      },
      {
        id: '2',
        tema: 'Integrais Múltiplas',
        date: new Date(Date.now() + 86400000).toISOString(),
        title: 'Integrais Múltiplas',
        type: 'class',
        disciplina: 'Cálculo III',
        metodologia: 'Resolução de problemas em grupo',
        observacoes: '',
        room: 'A-101',
        time: '08:00 - 10:00'
      }
    ]
  },
  {
    nome: 'Física II',
    professor: 'Dra. Santos',
    aulas: [
      {
        id: '3',
        tema: 'Eletromagnetismo',
        date: new Date().toISOString(),
        title: 'Eletromagnetismo',
        type: 'class',
        disciplina: 'Física II',
        metodologia: 'Aula prática em laboratório',
        observacoes: 'Usar jaleco e óculos de proteção',
        room: 'B-203',
        time: '10:00 - 12:00'
      }
    ]
  }
];

const Calendario = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Aula | null>(null);
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek'>('dayGridMonth');
  const [calendarData, setCalendarData] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await StudentService.getCalender(user?.id);
        setCalendarData(data || mockData);
      } catch (error) {
        console.error("Erro ao buscar informações do calendário:", error);
        toast.error("Erro ao carregar o calendário. Usando dados offline.");
        setCalendarData(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleEventClick = (eventInfo: any) => {
    setSelectedEvent(eventInfo.event.extendedProps);
    setShowModal(true);
  };

  const getEventClassNames = (disciplina: string) => {
    const normalizedDisciplina = disciplina.trim();
    
    switch (normalizedDisciplina) {
      case 'Cálculo III':
        return 'event-calculus';
      case 'Física II':
        return 'event-physics';
      default:
        return 'event-programming';
    }
  };

  const calendarEvents = calendarData.flatMap(subject =>
    subject.aulas.map(aula => ({
      id: aula.id,
      title: `${aula.disciplina.trim()} - ${aula.tema}`,
      start: new Date(aula.date),
      end: new Date(aula.date),
      className: getEventClassNames(aula.disciplina),
      extendedProps: {
        ...aula,
        professor: subject.professor,
        sala: aula.room,
        disciplina: aula.disciplina.trim()
      }
    }))
  );

  const handleViewChange = (newView: 'dayGridMonth' | 'timeGridWeek') => {
    const calendarEl = document.querySelector('.fc');
    if (calendarEl) {
      calendarEl.classList.add('calendar-transition');
      setTimeout(() => {
        calendarEl.classList.remove('calendar-transition');
      }, 300);
    }
    setView(newView);
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
          Calendário Acadêmico
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => handleViewChange('dayGridMonth')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              view === 'dayGridMonth'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => handleViewChange('timeGridWeek')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              view === 'timeGridWeek'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Semana
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView={view}
            locale="pt-br"
            events={calendarEvents}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
            height="auto"
            eventClick={handleEventClick}
            slotMinTime="07:00:00"
            slotMaxTime="23:00:00"
            allDaySlot={false}
            slotDuration="00:30:00"
            expandRows={true}
            dayMaxEvents={true}
            weekends={view === 'dayGridMonth'}
            hiddenDays={view === 'timeGridWeek' ? [0, 6] : []}
            eventContent={(eventInfo) => {
              if (view === 'timeGridWeek') {
                return (
                  <div className="event-content">
                    <div className="event-time">
                      {eventInfo.event.extendedProps.time}
                    </div>
                    <div className="event-title">
                      {eventInfo.event.extendedProps.disciplina}
                    </div>
                    <div className="event-description">
                      {eventInfo.event.extendedProps.tema}
                    </div>
                    <div className="event-location">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{eventInfo.event.extendedProps.sala}</span>
                    </div>
                  </div>
                );
              }
              return (
                <div className="month-event">
                  <div className="text-sm font-medium truncate">
                    {eventInfo.event.extendedProps.disciplina}
                  </div>
                </div>
              );
            }}
            views={{
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                dayHeaderFormat: { weekday: 'long', day: 'numeric' }
              }
            }}
          />
        </div>
      </div>

      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedEvent.tema}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {selectedEvent.disciplina}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Informações Gerais
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Clock className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <MapPin className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                      <span>{selectedEvent.sala}</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <User className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                      <span>{selectedEvent.professor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Detalhes da Aula
                  </h3>
                  <div className="space-y-3">
                    {selectedEvent.metodologia && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Metodologia
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {selectedEvent.metodologia}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedEvent.observacoes && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Observações
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedEvent.observacoes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;