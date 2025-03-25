
import api from '../services/api';

interface ClassProgress {
  startTime: string;
  currentProgress: number;
  isLate: boolean;
  lateMinutes?: number;
}

class StudentService {
  async getInfoDash(): Promise<any> {
    const response = await api.get<any>(`/students/dash/info`);
    return response.data;
  }
  async getSubjectsDash(id?: string): Promise<any> {
    const response = await api.get<any>(`/students/${id}/subjects/info`);
    return response.data;
  }
  async getAttendances(id?: string): Promise<any> {
    const response = await api.get<any>(`/students/${id}/attendances`);
    return response.data;
  }
  async getClasses(id?: string): Promise<any> {
    const response = await api.get<any>(`/students/${id}/classes`);
    return response.data;
  }
  async postAttendance(qrCodeObj?: any): Promise<any> {
    const response = await api.post<any>(`/attendance/qrcode`, qrCodeObj);
    return response.data;
  }
  async postFeedback(feedbackObj?: any): Promise<any> {
    const response = await api.post<any>(`/feedback/send/feedback`, feedbackObj);
    return response.data;
  }

  async getCalender(userId: string | undefined) {
    try {
      const response = await api.get(`/student/calendar/${userId}`);
      return response.data;
    } catch (error) {
      // Mock data for development/error cases
      return [
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
              tema: 'Prova 1',
              date: new Date(Date.now() + 7 * 86400000).toISOString(),
              title: 'Prova 1 - Derivadas Parciais',
              type: 'exam',
              disciplina: 'Cálculo III',
              metodologia: 'Prova Individual',
              observacoes: 'Trazer calculadora científica',
              room: 'A-101',
              time: '08:00 - 10:00'
            },
            {
              id: '3',
              tema: 'Trabalho - Integrais Múltiplas',
              date: new Date(Date.now() + 14 * 86400000).toISOString(),
              title: 'Entrega do Trabalho',
              type: 'assignment',
              disciplina: 'Cálculo III',
              metodologia: 'Trabalho em Grupo',
              room: 'A-101',
              time: '23:59'
            }
          ]
        },
        {
          nome: 'Física II',
          professor: 'Dra. Santos',
          aulas: [
            {
              id: '4',
              tema: 'Eletromagnetismo',
              date: new Date(Date.now() + 1 * 86400000).toISOString(),
              title: 'Eletromagnetismo',
              type: 'class',
              disciplina: 'Física II',
              metodologia: 'Aula prática em laboratório',
              observacoes: 'Usar jaleco e óculos de proteção',
              room: 'B-203',
              time: '10:00 - 12:00'
            },
            {
              id: '5',
              tema: 'Prova 2',
              date: new Date(Date.now() + 10 * 86400000).toISOString(),
              title: 'Prova 2 - Eletromagnetismo',
              type: 'exam',
              disciplina: 'Física II',
              metodologia: 'Prova Individual',
              room: 'B-203',
              time: '10:00 - 12:00'
            }
          ]
        },
        {
          nome: 'Arquitetura de Computadores',
          professor: 'Dr. Oliveira',
          aulas: [
            {
              id: '6',
              tema: 'Pipeline',
              date: new Date(Date.now() + 2 * 86400000).toISOString(),
              title: 'Pipeline',
              type: 'class',
              disciplina: 'Arquitetura de Computadores',
              metodologia: 'Aula teórica com simulações',
              room: 'Lab 3',
              time: '14:00 - 16:00'
            }
          ]
        }
      ];
    }
  }

}

export default new StudentService();