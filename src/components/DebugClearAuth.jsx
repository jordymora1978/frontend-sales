/**
 * Debug component to clear all authentication data
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugClearAuth = () => {
  const { logout } = useAuth();

  const clearEverything = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.dropux.co";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    
    // Force reload
    window.location.reload();
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'red', 
      color: 'white', 
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>🐛 DEBUG MODE</div>
      <button onClick={clearEverything} style={{ 
        background: 'white', 
        color: 'red', 
        border: 'none', 
        padding: '5px',
        margin: '5px 0',
        cursor: 'pointer'
      }}>
        Clear All Auth Data
      </button>
      <div>Current URL: {window.location.hostname}</div>
      <div>Storage items: {Object.keys(localStorage).length}</div>
    </div>
  );
};

export default DebugClearAuth;