
import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const Spinner: React.FC = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-400"></div>
);

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Spinner />
      <p className="mt-4 text-lg font-semibold text-white">{message}</p>
    </div>
  );
};
