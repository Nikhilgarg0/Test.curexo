import React, { ReactNode } from 'react';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`relative backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-lg p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;