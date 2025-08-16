'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, Phone, MessageSquare, User } from 'lucide-react';
import theme from '@/styles/theme';

const BottomNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Pill, label: 'Cabinet', href: '/cabinet' },
    { icon: Phone, label: 'Emergency', href: '/emergency' },
    { icon: MessageSquare, label: 'Chatbot', href: '/chatbot' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-sm">
      <div className="flex justify-between items-center px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-1 transition-colors duration-200 ${isActive ? 'font-medium' : ''}`}
              style={{
                color: isActive ? theme.colors.primary : theme.colors.text.secondary,
              }}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;