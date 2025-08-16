import React from 'react';
import GlassmorphicCard from '../ui/GlassmorphicCard';
import { Heart, Footprints, Moon } from 'lucide-react';

interface HealthMetricsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: 'heart' | 'steps' | 'sleep';
  className?: string;
}

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({
  title,
  value,
  unit,
  icon,
  className = '',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'heart':
        return <Heart className="text-pink-400" size={24} />;
      case 'steps':
        return <Footprints className="text-blue-400" size={24} />;
      case 'sleep':
        return <Moon className="text-indigo-400" size={24} />;
      default:
        return null;
    }
  };

  return (
    <GlassmorphicCard className={`${className}`}>
      <h3 className="text-lg font-medium text-white/80 mb-2">{title}</h3>
      <div className="flex items-center">
        {getIcon()}
        <div className="ml-2 flex items-baseline">
          <span className="text-3xl font-bold text-white">{value}</span>
          {unit && <span className="ml-1 text-sm text-white/70">{unit}</span>}
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default HealthMetricsCard;