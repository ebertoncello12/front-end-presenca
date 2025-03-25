import React from 'react';
import { Outlet } from 'react-router-dom';
import Drawer from './Drawer';
import TopBar from './TopBar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Drawer />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;