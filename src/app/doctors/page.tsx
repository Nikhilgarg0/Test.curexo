'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import AppLayout from '@/components/layout/AppLayout';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useStore from '@/store/useStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface DoctorFormData {
  id: string;
  name: string;
  specialty: string;
  phoneNumber: string;
  address?: string;
  email?: string;
}

const DoctorsPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, setUser, doctors, addDoctor, updateDoctor, deleteDoctor } = useStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DoctorFormData>({
    id: '',
    name: '',
    specialty: '',
    phoneNumber: '',
    address: '',
    email: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router, setUser]);

  const handleOpenForm = (doctor?: typeof doctors[0]) => {
    if (doctor) {
      setFormData(doctor);
      setIsEditing(true);
    } else {
      setFormData({
        id: uuidv4(),
        name: '',
        specialty: '',
        phoneNumber: '',
        address: '',
        email: ''
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateDoctor(formData.id, formData);
    } else {
      addDoctor(formData);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      deleteDoctor(id);
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleMap = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Doctors</h1>
          <p className="text-white/70">Manage your healthcare providers</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="flex items-center gap-2">
          <Plus size={16} />
          Add Doctor
        </Button>
      </div>

      {doctors.length === 0 ? (
        <GlassmorphicCard className="p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-white/70 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No doctors added yet</h3>
          <p className="text-white/70 mb-4">Add your healthcare providers for easy access to their information</p>
          <Button onClick={() => handleOpenForm()}>Add Your First Doctor</Button>
        </GlassmorphicCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {doctors.map((doctor) => (
            <GlassmorphicCard key={doctor.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
                  <p className="text-white/70 text-sm mb-2">{doctor.specialty}</p>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-white/70" />
                      <p className="text-white/70 text-sm">{doctor.phoneNumber}</p>
                    </div>
                    
                    {doctor.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-white/70" />
                        <p className="text-white/70 text-sm">{doctor.email}</p>
                      </div>
                    )}
                    
                    {doctor.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-white/70" />
                        <p className="text-white/70 text-sm">{doctor.address}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  <button 
                    onClick={() => handleCall(doctor.phoneNumber)}
                    className="p-2 rounded-full bg-green-500/30 hover:bg-green-500/50 transition-colors"
                    title="Call"
                  >
                    <Phone size={16} className="text-white" />
                  </button>
                  
                  {doctor.email && (
                    <button 
                      onClick={() => handleEmail(doctor.email || '')}
                      className="p-2 rounded-full bg-blue-500/30 hover:bg-blue-500/50 transition-colors"
                      title="Email"
                    >
                      <Mail size={16} className="text-white" />
                    </button>
                  )}
                  
                  {doctor.address && (
                    <button 
                      onClick={() => handleMap(doctor.address || '')}
                      className="p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-colors"
                      title="View on Map"
                    >
                      <MapPin size={16} className="text-white" />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleOpenForm(doctor)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} className="text-white" />
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(doctor.id)}
                    className="p-2 rounded-full bg-white/10 hover:bg-red-500/50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </GlassmorphicCard>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <GlassmorphicCard className="w-full max-w-md p-6 m-4">
            <h2 className="text-xl font-bold text-white mb-4">
              {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Doctor Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Specialty"
                name="specialty"
                placeholder="e.g., Cardiologist, Pediatrician"
                value={formData.specialty}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Email (Optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                label="Address (Optional)"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Add'} Doctor
                </Button>
              </div>
            </form>
          </GlassmorphicCard>
        </div>
      )}
    </AppLayout>
  );
};

export default DoctorsPage;