import React, { Context, createContext, useContext, useEffect, useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";

const VisibilityCtx = createContext<VisibilityProviderValue | null>(null);

interface VisibilityProviderValue {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  isGizmoActive: boolean;
  setGizmoActive: (active: boolean) => void;
}

export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [isGizmoActive, setGizmoActive] = useState(false);

  useNuiEvent<boolean>('setVisible', setVisible);

  // Handle pressing escape/backspace
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === "Escape" && !isGizmoActive) {
        if (!isEnvBrowser()) fetchNui("hideFrame");
        else setVisible(false);
      }
    };

    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible, isGizmoActive]);

  return (
    <VisibilityCtx.Provider
      value={{
        visible,
        setVisible,
        isGizmoActive,
        setGizmoActive,
      }}
    >
      <div style={{ visibility: visible ? 'visible' : 'hidden', height: '100%' }}>
        {children}
      </div>
    </VisibilityCtx.Provider>
  );
};

export const useVisibility = () => useContext<VisibilityProviderValue>(VisibilityCtx as Context<VisibilityProviderValue>);
