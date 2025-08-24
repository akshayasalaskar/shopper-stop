import React from 'react';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, title, description, variant = 'default', onDismiss }) => {
  const isDestructive = variant === 'destructive';
  
  console.log('Toast component rendered with:', { id, title, description, variant });

  return (
    <div className={`max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
      isDestructive ? 'border-red-500' : 'border-green-500'
    }`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isDestructive ? (
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              isDestructive ? 'text-red-800' : 'text-gray-900'
            }`}>
              {title}
            </p>
            {description && (
              <p className={`mt-1 text-sm ${
                isDestructive ? 'text-red-700' : 'text-gray-500'
              }`}>
                {description}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => onDismiss(id)}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDestructive
                  ? 'text-red-400 hover:text-red-500 focus:ring-red-500'
                  : 'text-gray-400 hover:text-gray-500 focus:ring-gray-500'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
