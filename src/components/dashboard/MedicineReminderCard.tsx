import React from 'react';
import GlassmorphicCard from '../ui/GlassmorphicCard';
import { Pill } from 'lucide-react';

interface MedicineReminderCardProps {
  medicineName: string;
  time: string;
  className?: string;
}

const MedicineReminderCard: React.FC<MedicineReminderCardProps> = ({
  medicineName,
  time,
  className = '',
}) => {
  return (
    <GlassmorphicCard className={`${className}`}>
      <h3 className="text-lg font-medium text-white/80 mb-2">Medicine Reminder</h3>
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-white/10">
          <Pill className="text-purple-300" size={20} />
        </div>
        <div className="ml-3">
          <p className="text-white font-medium">{medicineName} -{time}</p>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default MedicineReminderCard;