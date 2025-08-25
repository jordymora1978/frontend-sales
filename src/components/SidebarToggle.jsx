import React, { useState } from 'react';
import { RotateCcw, Palette } from 'lucide-react';

const SidebarToggle = ({ sidebarVersion, setSidebarVersion }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '300px', 
      zIndex: 9999,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          border: 'none',
          background: 
            sidebarVersion === 'v1' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
            sidebarVersion === 'v2' ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' :
            sidebarVersion === 'crm' ? 'linear-gradient(135deg, #ff6b35 0%, #f56500 100%)' :
            'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          transform: isOpen ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <Palette size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '56px',
          right: '0',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          padding: '8px',
          minWidth: '200px',
          animation: 'slideDown 0.2s ease'
        }}>
          <div style={{ 
            padding: '8px 12px', 
            fontSize: '12px', 
            fontWeight: 600, 
            color: '#64748b',
            borderBottom: '1px solid #f1f5f9',
            marginBottom: '4px'
          }}>
            PROBAR DISEÑOS
          </div>

          {/* Sidebar V1 Option */}
          <button
            onClick={() => {
              setSidebarVersion('v1');
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: sidebarVersion === 'v1' ? '#f0fdf4' : 'transparent',
              border: sidebarVersion === 'v1' ? '1px solid #22c55e' : '1px solid transparent',
              borderRadius: '6px',
              color: sidebarVersion === 'v1' ? '#15803d' : '#374151',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: sidebarVersion === 'v1' ? '#22c55e' : '#cbd5e1'
            }} />
            <div>
              <div style={{ fontWeight: 500 }}>Sidebar Original</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Diseño actual funcional</div>
            </div>
          </button>

          {/* Sidebar V2 Option */}
          <button
            onClick={() => {
              setSidebarVersion('v2');
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: sidebarVersion === 'v2' ? '#f0f9ff' : 'transparent',
              border: sidebarVersion === 'v2' ? '1px solid #3b82f6' : '1px solid transparent',
              borderRadius: '6px',
              color: sidebarVersion === 'v2' ? '#1d4ed8' : '#374151',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: sidebarVersion === 'v2' ? '#3b82f6' : '#cbd5e1'
            }} />
            <div>
              <div style={{ fontWeight: 500 }}>Sidebar Enterprise</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Tema claro/oscuro + CRM</div>
            </div>
          </button>

          {/* Sidebar CRM Option */}
          <button
            onClick={() => {
              setSidebarVersion('crm');
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: sidebarVersion === 'crm' ? '#fff7ed' : 'transparent',
              border: sidebarVersion === 'crm' ? '1px solid #ff6b35' : '1px solid transparent',
              borderRadius: '6px',
              color: sidebarVersion === 'crm' ? '#c2410c' : '#374151',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: sidebarVersion === 'crm' ? '#ff6b35' : '#cbd5e1'
            }} />
            <div>
              <div style={{ fontWeight: 500 }}>Sidebar CRM</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Estilo DURALUX CRM profesional</div>
            </div>
          </button>

          {/* Sidebar Premium Option */}
          <button
            onClick={() => {
              setSidebarVersion('premium');
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: sidebarVersion === 'premium' ? '#f3f4f6' : 'transparent',
              border: sidebarVersion === 'premium' ? '2px solid #6366f1' : '1px solid transparent',
              borderRadius: '6px',
              color: sidebarVersion === 'premium' ? '#4338ca' : '#374151',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: sidebarVersion === 'premium' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#cbd5e1'
            }} />
            <div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>Sidebar Premium ✨</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>World-class CRM • Salesforce style</div>
            </div>
            {sidebarVersion === 'premium' && (
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '3px',
                height: '100%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
              }} />
            )}
          </button>

          {/* Reset Note */}
          <div style={{
            padding: '8px 12px',
            fontSize: '10px',
            color: '#64748b',
            borderTop: '1px solid #f1f5f9',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <RotateCcw size={10} />
            Siempre puedes volver al original
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarToggle;