'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import theme from '@/styles/theme';

const Header = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="px-4 py-3 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: theme.colors.primary }}>CUREXO</h1>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {getGreeting()}{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
          </p>
        </div>
        
        <Link href="/notifications">
          <div className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Bell size={20} color={theme.colors.text.secondary} />
            {/* Notification badge - show if there are unread notifications */}
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.colors.status.error }}
            ></span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;