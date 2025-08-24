import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/Toast';

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextType {
  toasts: ToastData[];
  toast: (toast: Omit<ToastData, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((toastData: Omit<ToastData, 'id'>) => {
    console.log('Toast function called with:', toastData);
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toastData, id };
    
    console.log('Adding new toast:', newToast);
    setToasts(prev => {
      const newToasts = [...prev, newToast];
      console.log('Updated toasts array:', newToasts);
      return newToasts;
    });
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      console.log('Auto-dismissing toast:', id);
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  console.log('ToastContext rendering with toasts:', toasts);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
