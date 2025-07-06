import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import ModalAlert, { ModalAlertType } from './ModalAlert';

interface ModalAlertState {
  open: boolean;
  type: ModalAlertType;
  title: string;
  message: string;
  autoClose?: number;
}

interface ModalAlertContextType {
  showAlert: (options: Partial<Omit<ModalAlertState, 'open'>>) => void;
  closeAlert: () => void;
}

const ModalAlertContext = createContext<ModalAlertContextType | undefined>(undefined);

export const ModalAlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ModalAlertState>({
    open: false,
    type: 'info',
    title: '',
    message: '',
    autoClose: 2000,
  });

  const showAlert = useCallback((options: Partial<Omit<ModalAlertState, 'open'>>) => {
    setState({
      open: true,
      type: options.type || 'info',
      title: options.title || '',
      message: options.message || '',
      autoClose: options.autoClose ?? 2000,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setState(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <ModalAlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      <ModalAlert
        open={state.open}
        type={state.type}
        title={state.title}
        message={state.message}
        onClose={closeAlert}
        autoClose={state.autoClose}
      />
    </ModalAlertContext.Provider>
  );
};

export function useModalAlert() {
  const ctx = useContext(ModalAlertContext);
  if (!ctx) throw new Error('useModalAlert must be used within a ModalAlertProvider');
  return ctx;
} 