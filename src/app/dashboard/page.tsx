'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Search, Calendar, Clock, Pill, Activity, Heart } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useStore from '@/store/useStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import theme from '@/styles/theme';

const DashboardPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, setUser, healthMetrics, appointments, medicines } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router, setUser]);

  const handleEmergency = () => {
    router.push('/emergency');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    );
  }
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // Health quotes
  const healthQuotes = [
    "The greatest wealth is health.",
    "Take care of your body. It's the only place you have to live.",
    "Health is not valued until sickness comes.",
    "Your health is an investment, not an expense.",
    "The first wealth is health."
  ];
  
  const randomQuote = healthQuotes[Math.floor(Math.random() * healthQuotes.length)];
  
  // Calculate BMI
  const height = 175; // cm
  const weight = 70; // kg
  const bmi = (weight / ((height/100) * (height/100))).toFixed(1);
  
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: theme.colors.status.warning };
    if (bmi < 25) return { category: 'Normal', color: theme.colors.status.success };
    if (bmi < 30) return { category: 'Overweight', color: theme.colors.status.warning };
    return { category: 'Obese', color: theme.colors.status.error };
  };
  
  const bmiStatus = getBmiCategory(parseFloat(bmi));
  
  // Mock data for next medicine and upcoming appointment
  const nextMedicine = {
    name: 'Aspirin',
    dosage: '100mg',
    time: '08:00 AM'
  };
  
  const upcomingAppointment = {
    doctorName: 'Dr. Smith',
    specialty: 'Cardiologist',
    date: '2023-06-15',
    time: '10:00 AM'
  };

  return (
    <AppLayout>
      {/* Search Bar */}
      <div className="mb-4 relative">
        <div className="relative">
          <Input 
            placeholder="Search for medicines, symptoms, or health info..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>
      
      {/* Health Quote */}
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-gray-600 italic text-sm">"{randomQuote}"</p>
      </div>
      
      {/* Health Score and BMI */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: `${theme.colors.status.success}15` }}
            >
              <Heart size={24} color={theme.colors.status.success} />
            </div>
            <p className="text-sm text-gray-500 mb-1">Health Score</p>
            <p className="text-2xl font-bold" style={{ color: theme.colors.status.success }}>85</p>
            <p className="text-xs text-gray-500">Good</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: `${bmiStatus.color}15` }}
            >
              <Activity size={24} color={bmiStatus.color} />
            </div>
            <p className="text-sm text-gray-500 mb-1">BMI</p>
            <p className="text-2xl font-bold" style={{ color: bmiStatus.color }}>{bmi}</p>
            <p className="text-xs text-gray-500">{bmiStatus.category}</p>
          </div>
        </div>
      </div>
      
      {/* Upcoming Appointment */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Upcoming Appointment</h2>
        <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: `${theme.colors.primary}15` }}
            >
              <Calendar size={20} color={theme.colors.primary} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{upcomingAppointment.doctorName}</h3>
              <p className="text-sm text-gray-500">{upcomingAppointment.specialty}</p>
              <div className="flex items-center mt-2 text-sm">
                <Calendar size={14} className="mr-1 text-gray-400" />
                <span className="text-gray-600 mr-3">{new Date(upcomingAppointment.date).toLocaleDateString()}</span>
                <Clock size={14} className="mr-1 text-gray-400" />
                <span className="text-gray-600">{upcomingAppointment.time}</span>
              </div>
            </div>
            <Link href="/cabinet?tab=appointments">
              <Button size="sm" variant="outline">View All</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Next Medicine */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Next Medicine</h2>
        <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: `${theme.colors.accent}15` }}
            >
              <Pill size={20} color={theme.colors.accent} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{nextMedicine.name}</h3>
              <p className="text-sm text-gray-500">{nextMedicine.dosage}</p>
              <div className="flex items-center mt-2 text-sm">
                <Clock size={14} className="mr-1 text-gray-400" />
                <span className="text-gray-600">{nextMedicine.time}</span>
              </div>
            </div>
            <Link href="/cabinet?tab=medicines">
              <Button size="sm" variant="outline">View All</Button>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;