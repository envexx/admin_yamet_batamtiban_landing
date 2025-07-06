import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ModalAlertProvider } from './components/UI/ModalAlertContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalAlertProvider>
      <App />
    </ModalAlertProvider>
  </StrictMode>
);
