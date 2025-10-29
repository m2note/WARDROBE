import React from 'react';

interface HeaderProps {
  onNewUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewUpload }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
            </div>
            <span className="font-bold text-xl text-slate-100 tracking-tight">SnazzyHeadshot</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              My Snazzy Headshots
            </button>
            <button 
              onClick={onNewUpload}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
            >
              New Headshot
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
