import React from 'react';

export type ModalAlertType = 'success' | 'error' | 'info' | 'warning';

interface ModalAlertProps {
  open: boolean;
  type?: ModalAlertType;
  title?: string;
  message?: string;
  onClose?: () => void;
  autoClose?: number; // ms
}

const iconMap: Record<ModalAlertType, JSX.Element> = {
  success: (
    <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" /></svg>
  ),
  error: (
    <svg className="w-12 h-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" /></svg>
  ),
  info: (
    <svg className="w-12 h-12 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" /></svg>
  ),
  warning: (
    <svg className="w-12 h-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" /></svg>
  ),
};

const ModalAlert: React.FC<ModalAlertProps> = ({ open, type = 'info', title, message, onClose, autoClose = 2000 }) => {
  React.useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [open, autoClose, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center animate-fadeInUp">
        <div className="mb-2">{iconMap[type]}</div>
        {title && <h3 className="text-lg font-bold mb-1">{title}</h3>}
        {message && <div className="text-gray-700 mb-4">{message}</div>}
        <button
          className="mt-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold focus:outline-none"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
      <style>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ModalAlert; 