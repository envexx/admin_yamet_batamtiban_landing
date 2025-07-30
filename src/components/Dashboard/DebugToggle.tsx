import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';

interface DebugToggleProps {
  children: React.ReactNode;
}

const DebugToggle: React.FC<DebugToggleProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Toggle Debug Panels"
      >
        {isVisible ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
      </button>

      {/* Debug Panels */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-40 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
          <div className="text-xs text-gray-500 mb-2">Debug Mode</div>
          {children}
        </div>
      )}
    </>
  );
};

export default DebugToggle; 