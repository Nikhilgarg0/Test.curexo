'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Trash2, AlertCircle, Calendar, Pill } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Button from '@/components/ui/Button';
import useStore from '@/store/useStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const NotificationsPage = () => {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    setUser, 
    notifications, 
    markNotificationAsRead,
    deleteNotification 
  } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router, setUser]);

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={18} className="text-blue-400" />;
      case 'medicine':
        return <Pill size={18} className="text-green-400" />;
      case 'emergency':
        return <AlertCircle size={18} className="text-red-400" />;
      default:
        return <Bell size={18} className="text-purple-400" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <p className="text-white/70">Manage your health alerts and reminders</p>
      </div>

      {notifications.length === 0 ? (
        <GlassmorphicCard className="p-6 text-center">
          <Bell size={40} className="mx-auto mb-4 text-white/50" />
          <h2 className="text-xl font-semibold text-white mb-2">No Notifications</h2>
          <p className="text-white/70">
            You don't have any notifications at the moment. We'll notify you about important health events, medication reminders, and appointment updates.
          </p>
        </GlassmorphicCard>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <GlassmorphicCard 
              key={notification.id} 
              className={`p-4 ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{notification.title}</h3>
                  <p className="text-white/70 text-sm">{notification.message}</p>
                  <div className="flex items-center text-xs text-white/50 mt-1">
                    <span>
                      {new Date(notification.timestamp).toLocaleDateString()} at {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {notification.read && (
                      <span className="ml-2 flex items-center">
                        <Check size={12} className="mr-1" /> Read
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notification.read && (
                    <Button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="h-8 w-8 p-0 bg-blue-500/20 hover:bg-blue-500/40"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleDelete(notification.id)}
                    className="h-8 w-8 p-0 bg-red-500/20 hover:bg-red-500/40"
                    title="Delete notification"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </GlassmorphicCard>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default NotificationsPage;