import React, { createContext, useState, useContext } from 'react';

const WidgetContext = createContext();

export function WidgetProvider({ children }) {
  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);

  return (
    <WidgetContext.Provider value={{
      widgets,
      setWidgets,
      selectedWidget,
      setSelectedWidget
    }}>
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidgets() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgets must be used within a WidgetProvider');
  }
  return context;
}