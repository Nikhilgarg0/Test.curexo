'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import AppLayout from '@/components/layout/AppLayout';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useStore from '@/store/useStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AppointmentFormData {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  notes?: string;
}

const AppointmentsPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, setUser, appointments, addAppointment, updateAppointment, deleteAppointment } = useStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    id: '',
    doctorName: '',
    date: '',
    time: '',
    notes: ''
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

  const handleOpenForm = (appointment?: typeof appointments[0]) => {
    if (appointment) {
      setFormData(appointment);
      setIsEditing(true);
    } else {
      setFormData({
        id: uuidv4(),
        doctorName: '',
        date: '',
        time: '',
        notes: ''
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateAppointment(formData.id, formData);
    } else {
      addAppointment(formData);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(id);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <h1 className="text-2xl font-bold text-white">Appointments</h1>
          <p className="text-white/70">Manage your medical appointments</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="flex items-center gap-2">
          <Plus size={16} />
          Add Appointment
        </Button>
      </div>

      {appointments.length === 0 ? (
        <GlassmorphicCard className="p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-white/70 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No appointments scheduled</h3>
          <p className="text-white/70 mb-4">Schedule your medical appointments to receive reminders</p>
          <Button onClick={() => handleOpenForm()}>Schedule Your First Appointment</Button>
        </GlassmorphicCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appointment) => (
            <GlassmorphicCard key={appointment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{appointment.doctorName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={14} className="text-white/70" />
                    <p className="text-white/70 text-sm">{formatDate(appointment.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-white/70" />
                    <p className="text-white/70 text-sm">{appointment.time}</p>
                  </div>
                  {appointment.notes && (
                    <div className="flex items-start gap-2 mt-2">
                      <FileText size={14} className="text-white/70 mt-1" />
                      <p className="text-white/70 text-sm">{appointment.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenForm(appointment)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Edit size={16} className="text-white" />
                  </button>
                  <button 
                    onClick={() => handleDelete(appointment.id)}
                    className="p-2 rounded-full bg-white/10 hover:bg-red-500/50 transition-colors"
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
              {isEditing ? 'Edit Appointment' : 'Add New Appointment'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Doctor Name"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-white">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-white/50"
                  placeholder="Any special instructions or notes"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Schedule'} Appointment
                </Button>
              </div>
            </form>
          </GlassmorphicCard>
        </div>
      )}
    </AppLayout>
  );
};

export default AppointmentsPage;