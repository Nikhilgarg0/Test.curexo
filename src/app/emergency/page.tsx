'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Plus, Edit, Trash2, AlertCircle, ShieldAlert, Heart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useStore from '@/store/useStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import theme from '@/styles/theme';

interface EmergencyContactFormData {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
}

const EmergencyPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, setUser, emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = useStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmergencyContactFormData>({
    id: '',
    name: '',
    relationship: '',
    phoneNumber: ''
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

  const handleOpenForm = (contact?: typeof emergencyContacts[0]) => {
    if (contact) {
      setFormData(contact);
      setIsEditing(true);
    } else {
      setFormData({
        id: uuidv4(),
        name: '',
        relationship: '',
        phoneNumber: ''
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
      updateEmergencyContact(formData.id, formData);
    } else {
      addEmergencyContact(formData);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this emergency contact?')) {
      deleteEmergencyContact(id);
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    );
  }
  
  const emergencyServices = [
    {
      id: 'emergency',
      name: 'Emergency Services',
      number: '112',
      icon: ShieldAlert,
      color: theme.colors.status.error,
    },
    {
      id: 'women-helpline',
      name: 'Women Helpline',
      number: '1091',
      icon: Heart,
      color: theme.colors.status.warning,
    }
  ];

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Emergency Contacts</h1>
        <p className="text-gray-600">Quick access to emergency services and contacts</p>
      </div>

      {/* Emergency Services Quick Call Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {emergencyServices.map((service) => (
          <div 
            key={service.id}
            className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 bg-white"
            style={{ borderLeftColor: service.color, borderLeftWidth: '4px' }}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: `${service.color}15` }} // 15 is hex for 10% opacity
              >
                <service.icon size={24} color={service.color} />
              </div>
              <h3 className="font-medium">{service.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{service.number}</p>
              <Button 
                onClick={() => handleCall(service.number)}
                className="w-full flex items-center justify-center gap-1"
                style={{ backgroundColor: service.color }}
              >
                <Phone size={16} />
                Call Now
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">My Emergency Contacts</h2>
        <Button 
          onClick={() => handleOpenForm()} 
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus size={14} />
          Add Contact
        </Button>
      </div>

      {emergencyContacts.length === 0 ? (
        <div className="p-8 flex flex-col items-center justify-center text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <AlertCircle size={40} className="text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-1">No emergency contacts added</h3>
          <p className="text-gray-500 mb-4">Add your emergency contacts for quick access</p>
          <Button onClick={() => handleOpenForm()}>Add Your First Contact</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.relationship}</p>
                  <p className="text-sm font-medium">{contact.phoneNumber}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCall(contact.phoneNumber)}
                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                  >
                    <Phone size={16} />
                  </button>
                  <button 
                    onClick={() => handleOpenForm(contact)}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md p-6 m-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Relationship</label>
                <Input
                  name="relationship"
                  placeholder="e.g., Spouse, Parent, Doctor"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
               <div className="flex gap-2 justify-end pt-2">
                 <Button type="button" variant="outline" onClick={handleCloseForm}>
                   Cancel
                 </Button>
                 <Button type="submit">
                   {isEditing ? 'Update' : 'Add'}
                 </Button>
               </div>
             </form>
           </div>
         </div>
       )}
    </AppLayout>
  );
};

export default EmergencyPage;