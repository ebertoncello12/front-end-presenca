import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SkeletonLoader from '../SkeletonLoader';

// Lazy load the menus
const StudentDrawer = React.lazy(() => import('./Drawer'));
const ProfessorDrawer = React.lazy(() => import('./ProfessorDrawer'));

const MenuContainer = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Suspense fallback={<SkeletonLoader variant="rectangular" className="h-screen w-64" />}>
      {user?.role === 'professor' ? <ProfessorDrawer /> : <StudentDrawer />}
    </Suspense>
  );
};

export default MenuContainer;