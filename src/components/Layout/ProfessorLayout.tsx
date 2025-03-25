import React from 'react';
import { Outlet } from 'react-router-dom';
import ProfessorDrawer from './ProfessorDrawer';
import ProfessorTopBar from './ProfessorTopBar';

const ProfessorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfessorDrawer />
      <div className="flex-1 flex flex-col">
        <ProfessorTopBar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfessorLayout;