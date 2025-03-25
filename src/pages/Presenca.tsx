import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Eye, X, MapPin, BookOpen, User } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext.tsx";
import StudentService from "../services/student.service.ts";
import SkeletonLoader from "../components/SkeletonLoader";

const Presenca = () => {
  type AttendanceRecord = {
    data: string;
    status: string;
    horario: string;
    desc: string;
    sala: string;
    professor: string;
    disciplina: string;
    observacoes?: string;
    metodologia?: string;
  };

  type SubjectAttendance = {
    nome: string;
    registros: AttendanceRecord[];
  };

  type AttendanceData = SubjectAttendance[];
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();


  const handleViewDetails = (registro: AttendanceRecord) => {
    setSelectedRecord(registro);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      
    </div>
  );
};

export default Presenca;