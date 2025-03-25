import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Clock, X, MapPin, User } from 'lucide-react';

type Event = {
  date: Date;
  title: string;
  type: string;
  time: string;
  professor: string;
  sala: string;
  tema?: string;
  metodologia?: string;
  observacoes?: string;
  disciplina: string;
};

type Subject = {
  nome: string;
  professor: string;
  aulas: Event[];
};

const Calendario = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek'>('dayGridMonth');

  const subjects: Subject[] = [
    {
      nome: 'Cálculo III',
      professor: 'Dr. Silva',
      aulas: [
        {
          date: new Date(),
          title: 'Derivadas Parciais',
          type: 'class',
          time: '08:00 - 10:00',
          professor: 'Dr. Silva',
          sala: 'A-101',
          tema: 'Introdução às Derivadas Parciais',
          metodologia: 'Aula expositiva com exercícios práticos',
          observacoes: 'Trazer calculadora científica',
          disciplina: 'Cálculo III'
        },
        {
          date: new Date(Date.now() + 86400000),
          title: 'Integrais Múltiplas',
          type: 'class',
          time: '08:00 - 10:00',
          professor: 'Dr. Silva',
          sala: 'A-101',
          tema: 'Conceitos Básicos de Integrais Múltiplas',
          metodologia: 'Resolução de problemas em grupo',
          disciplina: 'Cálculo III'
        }
      ]
    },
    {
      nome: 'Física II',
      professor: 'Dra. Santos',
      aulas: [
        {
          date: new Date(),
          title: 'Eletromagnetismo',
          type: 'class',
          time: '10:00 - 12:00',
          professor: 'Dra. Santos',
          sala: 'B-203',
          tema: 'Campos Elétricos',
          metodologia: 'Aula prática em laboratório',
          observacoes: 'Usar jaleco e óculos de proteção',
          disciplina: 'Física II'
        }
      ]
    }
  ];

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const getEventClassNames = (disciplina: string) => {
    switch (disciplina) {
      case 'Cálculo III':
        return 'event-calculus';
      case 'Física II':
        return 'event-physics';
      case 'Programação Web':
        return 'event-programming';
      default:
        return '';
    }
  };

  const calendarEvents = subjects.flatMap(subject =>
    subject.aulas.map(aula => ({
      title: `${aula.disciplina}\n${aula.title}`,
      start: new Date(aula.date.setHours(
        parseInt(aula.time.split(':')[0]),
        parseInt(aula.time.split(' - ')[0].split(':')[1])
      )),
      end: new Date(aula.date.setHours(
        parseInt(aula.time.split(' - ')[1].split(':')[0]),
        parseInt(aula.time.split(' - ')[1].split(':')[1])
      )),
      className: getEventClassNames(aula.disciplina),
      extendedProps: {
        ...aula,
        displayTime: aula.time,
        location: aula.sala
      }
    }))
  );

  const handleViewChange = (newView: 'dayGridMonth' | 'timeGridWeek') => {
    // Add a class to trigger the transition
    const calendarEl = document.querySelector('.fc');
    if (calendarEl) {
      calendarEl.classList.add('calendar-transition');
      setTimeout(() => {
        calendarEl.classList.remove('calendar-transition');
      }, 300); // Match this with the CSS transition duration
    }
    setView(newView);
  };

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
            eventClick={(info) => handleEventClick(info.event.extendedProps)}
            slotMinTime="07:00:00"
            slotMaxTime="23:00:00"
            allDaySlot={false}
            slotDuration="00:30:00"
            expandRows={true}
            dayMaxEvents={true}
            weekends={view === 'dayGridMonth'} // Show weekends only in month view
            hiddenDays={view === 'timeGridWeek' ? [0, 6] : []} // Hide weekends only in week view
            eventContent={(eventInfo) => {
              if (view === 'timeGridWeek') {
                return (
                  <div className="event-content">
                    <div className="event-time">
                      {eventInfo.event.extendedProps.displayTime}
                    </div>
                    <div className="event-title">
                      {eventInfo.event.extendedProps.disciplina}
                    </div>
                    <div className="event-description">
                      {eventInfo.event.extendedProps.title}
                    </div>
                    <div className="event-location">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{eventInfo.event.extendedProps.location}</span>
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
                  {selectedEvent.title}
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
                    {selectedEvent.tema && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Tema
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {selectedEvent.tema}
                        </p>
                      </div>
                    )}
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