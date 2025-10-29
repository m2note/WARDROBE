import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(currentApiKey || '');
    }
  }, [isOpen, currentApiKey]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (apiKeyInput.trim()) {
      onSave(apiKeyInput.trim());
    }
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={handleOverlayClick}
    >
      <div className="bg-slate-800 rounded-lg shadow-2xl p-6 border border-slate-700 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Gemini API Key</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          To use this application, you need to provide your own Google Gemini API key. Your key is stored securely in your browser's local storage and is never sent to our servers.
        </p>
        
        <div className="text-slate-400 text-sm mb-4 border-l-2 border-slate-600 pl-4 py-2 space-y-1 bg-slate-800/50 rounded-r-lg">
            <p className="font-semibold text-slate-300">How to get your API key:</p>
            <ol className="list-decimal list-inside text-xs space-y-1">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-semibold">Google AI Studio</a>.</li>
                <li>Sign in with your Google account.</li>
                <li>Click the <strong>"Get API key"</strong> or <strong>"Create API key"</strong> button.</li>
                <li>Copy the generated key and paste it in the field below.</li>
            </ol>
        </div>

        <div>
          <label htmlFor="api-key-input" className="block text-sm font-medium text-slate-300 mb-1">
            Your API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter your API key..."
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKeyInput.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};