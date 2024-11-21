import React, { createContext, useContext, useEffect, useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";

interface VisibilityProviderValue {
  setPage: (page: string) => void;
  visiblePage: string;
}

const VisibilityCtx = createContext<VisibilityProviderValue | undefined>(undefined);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visiblePage, setVisiblePage] = useState(''); // Store the page to be displayed

  // Use useNuiEvent to set the visible page
  useNuiEvent<string>('setPage', (page) => {
    setVisiblePage(page);
  });

  return (
    <VisibilityCtx.Provider
      value={{
        setPage: setVisiblePage,
        visiblePage,
      }}
    >
      <div style={{ visibility: visiblePage ? 'visible' : 'hidden', height: '100%' }}>
        {children}
      </div>
    </VisibilityCtx.Provider>
  );
}

export const usePage = (): VisibilityProviderValue => {
  const context = useContext(VisibilityCtx);
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
}
