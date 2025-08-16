import React, { ReactNode } from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // No longer need navItems as they're defined in BottomNavigation

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 w-full">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-4 overflow-auto max-w-md w-full bg-white rounded-t-xl mt-2 shadow-sm">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;