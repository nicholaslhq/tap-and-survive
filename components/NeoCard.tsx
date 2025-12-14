import React from 'react';

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({ 
  children, 
  className = '', 
  color = 'bg-white' 
}) => {
  return (
    <div className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 ${color} ${className}`}>
      {children}
    </div>
  );
};
