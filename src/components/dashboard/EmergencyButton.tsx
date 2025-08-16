import React from 'react';

interface EmergencyButtonProps {
  onClick: () => void;
  className?: string;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-4 px-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-bold text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 ${className}`}
    >
      EMERGENCY
    </button>
  );
};

export default EmergencyButton;