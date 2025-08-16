import React from 'react';
import GlassmorphicCard from '../ui/GlassmorphicCard';
import { Calendar } from 'lucide-react';

interface AppointmentCardProps {
  doctorName: string;
  time: string;
  date: string;
  className?: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctorName,
  time,
  date,
  className = '',
}) => {
  return (
    <GlassmorphicCard className={`${className}`}>
      <h3 className="text-lg font-medium text-white/80 mb-2">Appointments</h3>
      <div className="flex items-start">
        <Calendar className="text-blue-400 mt-1" size={20} />
        <div className="ml-2">
          <p className="text-white font-medium">{doctorName}- {time}</p>
          <p className="text-sm text-white/70">{date}</p>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default AppointmentCard;