import { create } from 'zustand';
import { User } from 'firebase/auth';

interface HealthMetrics {
  heartRate: number;
  steps: number;
  sleepHours: number;
  sleepMinutes: number;
  healthScore: number;
}

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  notes?: string;
}

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeToTake: string;
  expiryDate: string;
  stock: number;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phoneNumber: string;
  address?: string;
  email?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'medicine' | 'appointment' | 'system' | 'emergency';
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  healthMetrics: HealthMetrics;
  appointments: Appointment[];
  medicines: Medicine[];
  emergencyContacts: EmergencyContact[];
  doctors: Doctor[];
  notifications: Notification[];
  setUser: (user: User | null) => void;
  setHealthMetrics: (metrics: Partial<HealthMetrics>) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void;
  deleteEmergencyContact: (id: string) => void;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const useStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  healthMetrics: {
    heartRate: 72,
    steps: 6532,
    sleepHours: 7,
    sleepMinutes: 45,
    healthScore: 85,
  },
  appointments: [],
  medicines: [],
  emergencyContacts: [],
  doctors: [],
  notifications: [],
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setHealthMetrics: (metrics) =>
    set((state) => ({
      healthMetrics: { ...state.healthMetrics, ...metrics },
    })),
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
  updateAppointment: (id, appointment) =>
    set((state) => ({
      appointments: state.appointments.map((app) =>
        app.id === id ? { ...app, ...appointment } : app
      ),
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((app) => app.id !== id),
    })),
  addMedicine: (medicine) =>
    set((state) => ({
      medicines: [...state.medicines, medicine],
    })),
  updateMedicine: (id, medicine) =>
    set((state) => ({
      medicines: state.medicines.map((med) =>
        med.id === id ? { ...med, ...medicine } : med
      ),
    })),
  deleteMedicine: (id) =>
    set((state) => ({
      medicines: state.medicines.filter((med) => med.id !== id),
    })),
  addEmergencyContact: (contact) =>
    set((state) => ({
      emergencyContacts: [...state.emergencyContacts, contact],
    })),
  updateEmergencyContact: (id, contact) =>
    set((state) => ({
      emergencyContacts: state.emergencyContacts.map((cont) =>
        cont.id === id ? { ...cont, ...contact } : cont
      ),
    })),
  deleteEmergencyContact: (id) =>
    set((state) => ({
      emergencyContacts: state.emergencyContacts.filter((cont) => cont.id !== id),
    })),
  addDoctor: (doctor) =>
    set((state) => ({
      doctors: [...state.doctors, doctor],
    })),
  updateDoctor: (id, doctor) =>
    set((state) => ({
      doctors: state.doctors.map((doc) =>
        doc.id === id ? { ...doc, ...doctor } : doc
      ),
    })),
  deleteDoctor: (id) =>
    set((state) => ({
      doctors: state.doctors.filter((doc) => doc.id !== id),
    })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          read: false,
        },
      ],
    })),
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
    })),
  clearNotifications: () =>
    set({
      notifications: [],
    }),
}));

export default useStore;