'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import theme from '@/styles/theme';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes?: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
}

const CabinetPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('medicines');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: '1', name: 'Aspirin', dosage: '100mg', frequency: 'Once daily', time: '08:00' },
    { id: '2', name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', time: '09:00' },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { 
      id: '1', 
      doctorName: 'Dr. Smith', 
      specialty: 'Cardiologist',
      date: '2023-06-15', 
      time: '10:00', 
      location: 'Heart Clinic, 123 Main St' 
    },
    { 
      id: '2', 
      doctorName: 'Dr. Johnson', 
      specialty: 'Dermatologist',
      date: '2023-06-20', 
      time: '14:30', 
      location: 'Skin Care Center, 456 Oak Ave' 
    },
  ]);
  
  // State for add/edit forms
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState<Medicine | null>(null);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  
  // Medicine CRUD functions
  const addMedicine = (medicine: Omit<Medicine, 'id'>) => {
    const newMedicine = {
      ...medicine,
      id: Date.now().toString(),
    };
    setMedicines([...medicines, newMedicine as Medicine]);
    setShowMedicineForm(false);
    setCurrentMedicine(null);
  };
  
  const updateMedicine = (medicine: Medicine) => {
    setMedicines(medicines.map(m => m.id === medicine.id ? medicine : m));
    setShowMedicineForm(false);
    setCurrentMedicine(null);
  };
  
  const deleteMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };
  
  // Appointment CRUD functions
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments([...appointments, newAppointment as Appointment]);
    setShowAppointmentForm(false);
    setCurrentAppointment(null);
  };
  
  const updateAppointment = (appointment: Appointment) => {
    setAppointments(appointments.map(a => a.id === appointment.id ? appointment : a));
    setShowAppointmentForm(false);
    setCurrentAppointment(null);
  };
  
  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: theme.colors.primary }}>My Cabinet</h1>
        
        <Tabs defaultValue="medicines" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-50">
            <TabsTrigger value="medicines" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Medicines</TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Appointments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="medicines" className="space-y-4 mt-4">
            {!showMedicineForm ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">My Medicines</h2>
                  <Button 
                    onClick={() => {
                      setCurrentMedicine(null);
                      setShowMedicineForm(true);
                    }}
                    size="sm"
                  >
                    <Plus size={16} className="mr-1" /> Add Medicine
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {medicines.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">No medicines added yet</p>
                  ) : (
                    medicines.map(medicine => (
                      <div 
                        key={medicine.id} 
                        className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{medicine.name}</h3>
                            <p className="text-sm text-gray-600">{medicine.dosage} • {medicine.frequency}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              <span>{medicine.time}</span>
                            </div>
                            {medicine.notes && <p className="mt-2 text-sm">{medicine.notes}</p>}
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setCurrentMedicine(medicine);
                                setShowMedicineForm(true);
                              }}
                              className="p-1 text-gray-500 hover:text-gray-700"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => deleteMedicine(medicine.id)}
                              className="p-1 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                  {currentMedicine ? 'Edit Medicine' : 'Add Medicine'}
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Medicine Name</label>
                    <Input 
                      placeholder="Medicine name" 
                      defaultValue={currentMedicine?.name || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dosage</label>
                    <Input 
                      placeholder="e.g. 100mg" 
                      defaultValue={currentMedicine?.dosage || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Frequency</label>
                    <Input 
                      placeholder="e.g. Once daily" 
                      defaultValue={currentMedicine?.frequency || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <Input 
                      type="time" 
                      defaultValue={currentMedicine?.time || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <Input 
                      placeholder="Additional notes" 
                      defaultValue={currentMedicine?.notes || ''}
                    />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      type="button"
                      onClick={() => {
                        // In a real app, we would save the form data
                        setShowMedicineForm(false);
                      }}
                    >
                      {currentMedicine ? 'Update' : 'Add'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => {
                        setShowMedicineForm(false);
                        setCurrentMedicine(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="appointments" className="space-y-4 mt-4">
            {!showAppointmentForm ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">My Appointments</h2>
                  <Button 
                    onClick={() => {
                      setCurrentAppointment(null);
                      setShowAppointmentForm(true);
                    }}
                    size="sm"
                  >
                    <Plus size={16} className="mr-1" /> Add Appointment
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {appointments.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">No appointments scheduled</p>
                  ) : (
                    appointments.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{appointment.doctorName}</h3>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar size={14} className="mr-1" />
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              <Clock size={14} className="ml-3 mr-1" />
                              <span>{appointment.time}</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{appointment.location}</p>
                            {appointment.notes && <p className="mt-2 text-sm">{appointment.notes}</p>}
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setCurrentAppointment(appointment);
                                setShowAppointmentForm(true);
                              }}
                              className="p-1 text-gray-500 hover:text-gray-700"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => deleteAppointment(appointment.id)}
                              className="p-1 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                  {currentAppointment ? 'Edit Appointment' : 'Add Appointment'}
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Doctor Name</label>
                    <Input 
                      placeholder="Doctor name" 
                      defaultValue={currentAppointment?.doctorName || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Specialty</label>
                    <Input 
                      placeholder="e.g. Cardiologist" 
                      defaultValue={currentAppointment?.specialty || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input 
                      type="date" 
                      defaultValue={currentAppointment?.date || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <Input 
                      type="time" 
                      defaultValue={currentAppointment?.time || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input 
                      placeholder="Clinic address" 
                      defaultValue={currentAppointment?.location || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <Input 
                      placeholder="Additional notes" 
                      defaultValue={currentAppointment?.notes || ''}
                    />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      type="button"
                      onClick={() => {
                        // In a real app, we would save the form data
                        setShowAppointmentForm(false);
                      }}
                    >
                      {currentAppointment ? 'Update' : 'Add'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => {
                        setShowAppointmentForm(false);
                        setCurrentAppointment(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CabinetPage;