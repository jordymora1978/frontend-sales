import React from 'react';
import { Package } from 'lucide-react';

const DropuxLogo = ({ size = 32, className = "" }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`} 
      style={{ 
        padding: '8px 12px',
        gap: '6px'
      }}
    >
      {/* Caja a la izquierda */}
      <Package size={32} color="white" strokeWidth={2} />
      
      {/* Texto Dropux a la derecha */}
      <span 
        style={{ 
          color: 'white', 
          fontSize: '28px', 
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        Dropux
      </span>
    </div>
  );
};

export default DropuxLogo;