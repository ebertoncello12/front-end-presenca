export interface Student {
  id: string;
  name: string;
  email: string;
  registration: string;
  photo: string;
  attendance: number;
  grades: {
    [key: string]: number;
  };
}

export interface Class {
  id: string;
  date: string;
  topic: string;
  content: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  attendance: {
    present: number;
    total: number;
  };
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  schedule: string;
  room: string;
  students: Student[];
  classes: Class[];
  syllabus: string[];
  evaluations: {
    name: string;
    weight: number;
    date: string;
  }[];
}