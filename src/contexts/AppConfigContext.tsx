import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAppConfig } from '../services/api';

interface AppConfig {
  appName: string;
  logoUrl: string;
  colorSchema: string;
}

const defaultConfig: AppConfig = {
  appName: 'YAMET',
  logoUrl: '',
  colorSchema: '#2563eb', // default biru
};

const AppConfigContext = createContext<AppConfig>(defaultConfig);

export const useAppConfig = () => useContext(AppConfigContext);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  useEffect(() => {
    getAppConfig().then(res => {
      if (res.data && res.data.status === 'success') {
        setConfig(res.data.data);
      }
    });
  }, []);

  // Set CSS variable untuk colorSchema
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', config.colorSchema || '#2563eb');
  }, [config.colorSchema]);

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
}; 