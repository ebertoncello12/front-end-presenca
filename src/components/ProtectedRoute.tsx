import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode,
  allowedRoles?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const {isAuthenticated, user} = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{from: location}} replace/>;
  }
  // Depois adicionar logica para redirecionar para o forbidden
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    console.log('provavelmente e aqui');
    const redirectPath = user.role === 'teacher' ? '/professor/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace/>;
  }
  console.log('teste')
  return <>{children}</>;
};

export default ProtectedRoute;