import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider } from './contexts/LoadingContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import ProfessorLayout from './components/Layout/ProfessorLayout';
import Login from './pages/Login';
import Forbidden from './pages/Forbidden';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAulas from './pages/student/Aulas';
import StudentCalendario from './pages/student/Calendario';
import StudentPresenca from './pages/student/Presenca';
import StudentEstatisticas from './pages/student/Estatisticas';
import StudentConfiguracoes from './pages/student/Configuracoes';
import StudentRegistrarPresenca from './pages/student/RegistrarPresenca';
import StudentGradeCurricular from './pages/student/GradeCurricular';
import StudentTarefas from './pages/student/Tarefas';

// Professor Pages
import ProfessorDashboard from './pages/professor/Dashboard';
import ProfessorDisciplinas from './pages/professor/Disciplinas';
import ProfessorCalendario from './pages/professor/Calendario';
import ProfessorChamada from './pages/professor/Chamada';
import ProfessorAlunos from './pages/professor/Alunos';
import ProfessorRelatorios from './pages/professor/Relatorios';
import ProfessorConfiguracoes from './pages/professor/Configuracoes';
import ProfessorTarefas from './pages/professor/Tarefas';
import ProfessorProvas from './pages/professor/Provas';
import ProfessorPlanoAula from './pages/professor/PlanoAula';
import ProfessorNotas from './pages/professor/Notas';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LoadingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Student Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="aulas" element={<StudentAulas />} />
                <Route path="calendario" element={<StudentCalendario />} />
                <Route path="presenca" element={<StudentPresenca />} />
                <Route path="estatisticas" element={<StudentEstatisticas />} />
                <Route path="configuracoes" element={<StudentConfiguracoes />} />
                <Route path="registrar-presenca" element={<StudentRegistrarPresenca />} />
                <Route path="registrar-presenca/:encryptedData" element={<StudentRegistrarPresenca />} />
                <Route path="grade-curricular" element={<StudentGradeCurricular />} />
                <Route path="tarefas" element={<StudentTarefas />} />
              </Route>

              {/* Professor Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <ProfessorLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="professor/dashboard" element={<ProfessorDashboard />} />
                <Route path="professor/disciplinas" element={<ProfessorDisciplinas />} />
                <Route path="professor/calendario" element={<ProfessorCalendario />} />
                <Route path="professor/chamada" element={<ProfessorChamada />} />
                <Route path="professor/alunos" element={<ProfessorAlunos />} />
                <Route path="professor/relatorios" element={<ProfessorRelatorios />} />
                <Route path="professor/configuracoes" element={<ProfessorConfiguracoes />} />
                <Route path="professor/tarefas" element={<ProfessorTarefas />} />
                <Route path="professor/provas" element={<ProfessorProvas />} />
                <Route path="professor/plano-aula" element={<ProfessorPlanoAula />} />
                <Route path="professor/notas" element={<ProfessorNotas />} />
              </Route>

              {/* Catch all route - redirect to forbidden */}
              <Route path="*" element={<Navigate to="/forbidden" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </LoadingProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;