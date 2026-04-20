import React, { createContext, useState, useContext } from 'react';

const PreviewContext = createContext();

export function PreviewProvider({ children }) {
  const [settings, setSettings] = useState({
    fontSize: '14px',
    buttonColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: '8px',
    shadowIntensity: 'soft',
    animation: 'slide',
    position: 'bottom-right'
  });
  
  const [currentWidget, setCurrentWidget] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <PreviewContext.Provider value={{
      settings,
      updateSettings,
      currentWidget,
      setCurrentWidget,
      isVisible,
      setIsVisible
    }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
}