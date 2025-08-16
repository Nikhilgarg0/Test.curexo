'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import AppLayout from '@/components/layout/AppLayout';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useStore from '@/store/useStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface MedicineFormData {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeToTake: string;
  expiryDate: string;
  stock: number;
}

const MedicinesPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, setUser, medicines, addMedicine, updateMedicine, deleteMedicine } = useStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MedicineFormData>({
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    timeToTake: '',
    expiryDate: '',
    stock: 0
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

  const handleOpenForm = (medicine?: typeof medicines[0]) => {
    if (medicine) {
      setFormData(medicine);
      setIsEditing(true);
    } else {
      setFormData({
        id: uuidv4(),
        name: '',
        dosage: '',
        frequency: '',
        timeToTake: '',
        expiryDate: '',
        stock: 0
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
      [name]: name === 'stock' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMedicine(formData.id, formData);
    } else {
      addMedicine(formData);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      deleteMedicine(id);
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Medicine Cabinet</h1>
          <p className="text-white/70">Manage your medications</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="flex items-center gap-2">
          <Plus size={16} />
          Add Medicine
        </Button>
      </div>

      {medicines.length === 0 ? (
        <GlassmorphicCard className="p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-white/70 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No medicines added yet</h3>
          <p className="text-white/70 mb-4">Add your medications to receive reminders and track your inventory</p>
          <Button onClick={() => handleOpenForm()}>Add Your First Medicine</Button>
        </GlassmorphicCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {medicines.map((medicine) => (
            <GlassmorphicCard key={medicine.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{medicine.name}</h3>
                  <p className="text-white/70 text-sm">{medicine.dosage} - {medicine.frequency}</p>
                  <p className="text-white/70 text-sm">Take at: {medicine.timeToTake}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full bg-white/10 text-white/90 text-xs">
                      Stock: {medicine.stock}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-white/90 text-xs">
                      Expires: {medicine.expiryDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenForm(medicine)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Edit size={16} className="text-white" />
                  </button>
                  <button 
                    onClick={() => handleDelete(medicine.id)}
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
              {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Medicine Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Dosage"
                name="dosage"
                placeholder="e.g., 500mg"
                value={formData.dosage}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Frequency"
                name="frequency"
                placeholder="e.g., Twice daily"
                value={formData.frequency}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Time to Take"
                name="timeToTake"
                type="time"
                value={formData.timeToTake}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Stock (quantity)"
                name="stock"
                type="number"
                min="0"
                value={formData.stock.toString()}
                onChange={handleInputChange}
                required
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Add'} Medicine
                </Button>
              </div>
            </form>
          </GlassmorphicCard>
        </div>
      )}
    </AppLayout>
  );
};

export default MedicinesPage;