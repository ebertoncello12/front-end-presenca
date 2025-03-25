import { 
  BookOpen, 
  Atom, 
  Cpu, 
  Terminal, 
  Database, 
  Network,
  Code,
  Brain,
  Palette,
  Shield
} from 'lucide-react';

export interface Subject {
  id: string;
  name: string;
  code: string;
  professor: string;
  schedule: string;
  room: string;
  attendance: number;
  grade?: number;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange' | 'cyan' | 'pink' | 'indigo';
  icon: any;
  topics: string[];
}

export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Cálculo III',
    code: 'MAT301',
    professor: 'Dr. Silva',
    schedule: 'Segunda e Quarta, 08:00 - 10:00',
    room: 'A-101',
    attendance: 90,
    grade: 8.5,
    color: 'primary',
    icon: BookOpen,
    topics: [
      'Derivadas Parciais',
      'Integrais Múltiplas',
      'Teorema de Green',
      'Campos Vetoriais'
    ]
  },
  {
    id: '2',
    name: 'Física II',
    code: 'FIS201',
    professor: 'Dra. Santos',
    schedule: 'Terça e Quinta, 10:00 - 12:00',
    room: 'B-203',
    attendance: 85,
    grade: 7.8,
    color: 'success',
    icon: Atom,
    topics: [
      'Eletromagnetismo',
      'Lei de Gauss',
      'Campo Elétrico',
      'Potencial Elétrico'
    ]
  },
  {
    id: '3',
    name: 'Arquitetura de Computadores',
    code: 'ARC201',
    professor: 'Dr. Oliveira',
    schedule: 'Segunda e Quarta, 14:00 - 16:00',
    room: 'Lab 03',
    attendance: 92,
    grade: 8.7,
    color: 'warning',
    icon: Cpu,
    topics: [
      'Pipeline',
      'Cache Memory',
      'RISC vs CISC',
      'Arquiteturas Paralelas'
    ]
  },
  {
    id: '4',
    name: 'Sistemas Operacionais',
    code: 'SIS301',
    professor: 'Dra. Lima',
    schedule: 'Segunda e Quarta, 16:00 - 18:00',
    room: 'Lab 02',
    attendance: 88,
    grade: 8.2,
    color: 'danger',
    icon: Terminal,
    topics: [
      'Processos',
      'Threads',
      'Escalonamento',
      'Memória Virtual'
    ]
  },
  {
    id: '5',
    name: 'Banco de Dados',
    code: 'BDA201',
    professor: 'Dr. Costa',
    schedule: 'Terça e Quinta, 08:00 - 10:00',
    room: 'Lab 01',
    attendance: 95,
    grade: 9.0,
    color: 'info',
    icon: Database,
    topics: [
      'Modelagem ER',
      'Normalização',
      'SQL',
      'Índices'
    ]
  },
  {
    id: '6',
    name: 'Redes de Computadores',
    code: 'RED201',
    professor: 'Dr. Pereira',
    schedule: 'Terça e Quinta, 10:00 - 12:00',
    room: 'Lab 04',
    attendance: 87,
    grade: 8.4,
    color: 'purple',
    icon: Network,
    topics: [
      'TCP/IP',
      'Roteamento',
      'Segurança',
      'Protocolos'
    ]
  }
];

// Keep only the first 6 subjects for the current semester
export const currentSemesterSubjects = subjects;

// The remaining subjects are available for planning
export const availableSubjects = [
  {
    id: '7',
    name: 'Programação Web',
    code: 'WEB301',
    professor: 'Dra. Rodrigues',
    schedule: 'Quarta e Sexta, 14:00 - 16:00',
    room: 'Lab 05',
    attendance: 0,
    color: 'orange',
    icon: Code,
    topics: [
      'HTML/CSS',
      'JavaScript',
      'React',
      'Node.js'
    ]
  },
  {
    id: '8',
    name: 'Inteligência Artificial',
    code: 'IAR301',
    professor: 'Dr. Mendes',
    schedule: 'Segunda e Quarta, 10:00 - 12:00',
    room: 'Lab 06',
    attendance: 0,
    color: 'cyan',
    icon: Brain,
    topics: [
      'Machine Learning',
      'Redes Neurais',
      'Algoritmos Genéticos',
      'Processamento de Linguagem Natural'
    ]
  },
  {
    id: '9',
    name: 'Computação Gráfica',
    code: 'CGR301',
    professor: 'Dra. Almeida',
    schedule: 'Terça e Quinta, 16:00 - 18:00',
    room: 'Lab 07',
    attendance: 0,
    color: 'pink',
    icon: Palette,
    topics: [
      'OpenGL',
      'Transformações 3D',
      'Iluminação',
      'Texturas'
    ]
  },
  {
    id: '10',
    name: 'Segurança da Informação',
    code: 'SEG301',
    professor: 'Dr. Ferreira',
    schedule: 'Quarta e Sexta, 08:00 - 10:00',
    room: 'Lab 08',
    attendance: 0,
    color: 'indigo',
    icon: Shield,
    topics: [
      'Criptografia',
      'Segurança de Redes',
      'Análise de Vulnerabilidades',
      'Forense Digital'
    ]
  }
];

export const getIconBgColor = (color: Subject['color']) => {
  switch (color) {
    case 'primary':
      return 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400';
    case 'success':
      return 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400';
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400';
    case 'danger':
      return 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400';
    case 'info':
      return 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400';
    case 'purple':
      return 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400';
    case 'orange':
      return 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400';
    case 'cyan':
      return 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400';
    case 'pink':
      return 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400';
    case 'indigo':
      return 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400';
    default:
      return 'bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400';
  }
};

// Helper functions
export const getCurrentSemesterSubjects = (): Subject[] => {
  return currentSemesterSubjects;
};

export const getAvailableSubjects = (): Subject[] => {
  return availableSubjects;
};