'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, LogOut, User, Mail, Calendar, Ruler, Weight, Activity } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
// Using useAuth hook for authentication functions
import theme from '@/styles/theme';

interface UserProfile {
  name: string;
  email: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '1990-01-01',
    height: '175',
    weight: '70',
    bloodType: 'O+',
    allergies: 'None',
    chronicConditions: 'None',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
    // In a real app, we would fetch the user profile from Firebase here
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await user.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would update the user profile in Firebase here
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    );
  }

  const profileItems = [
    { icon: User, label: 'Name', value: profile.name, field: 'name' },
    { icon: Mail, label: 'Email', value: profile.email, field: 'email' },
    { icon: Calendar, label: 'Date of Birth', value: profile.dateOfBirth, field: 'dateOfBirth' },
    { icon: Ruler, label: 'Height (cm)', value: profile.height, field: 'height' },
    { icon: Weight, label: 'Weight (kg)', value: profile.weight, field: 'weight' },
    { icon: Activity, label: 'Blood Type', value: profile.bloodType, field: 'bloodType' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <Edit2 size={14} />
              Edit Profile
            </Button>
          )}
        </div>

        {!isEditing ? (
          <>
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 flex flex-col items-center border-b border-gray-200">
                <div 
                  className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${theme.colors.primary}15` }}
                >
                  <User size={40} color={theme.colors.primary} />
                </div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-gray-500">{profile.email}</p>
              </div>
              
              <div className="p-4 space-y-4">
                {profileItems.slice(2).map((item) => (
                  <div key={item.field} className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: `${theme.colors.primary}10` }}
                    >
                      <item.icon size={18} color={theme.colors.primary} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
              <h3 className="font-semibold mb-3">Medical Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Allergies</p>
                  <p>{profile.allergies}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chronic Conditions</p>
                  <p>{profile.chronicConditions}</p>
                </div>
              </div>
            </div>

            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              
              {profileItems.map((item) => (
                <div key={item.field}>
                  <label className="block text-sm font-medium mb-1">{item.label}</label>
                  <Input
                    name={item.field}
                    value={profile[item.field as keyof UserProfile]}
                    onChange={handleInputChange}
                    type={item.field === 'dateOfBirth' ? 'date' : 'text'}
                  />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
              <h3 className="font-semibold">Medical Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Allergies</label>
                <Input
                  name="allergies"
                  value={profile.allergies}
                  onChange={handleInputChange}
                  placeholder="List any allergies or 'None'"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Chronic Conditions</label>
                <Input
                  name="chronicConditions"
                  value={profile.chronicConditions}
                  onChange={handleInputChange}
                  placeholder="List any chronic conditions or 'None'"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfilePage;