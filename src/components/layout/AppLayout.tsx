import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
