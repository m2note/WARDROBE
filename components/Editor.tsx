import React, { useState } from 'react';
import { ImageComparator } from './ImageComparator';
import { Toolbox } from './Toolbox';
import { InteractiveFrame } from './InteractiveFrame';

interface EditOptions {
  referenceImage?: {
    base64: string;
    mimeType: string;
  };
}
interface EditorProps {
  originalImage: string;
  currentImage: string;
  onEdit: (prompt: string, message: string, options?: EditOptions) => void;
  onFrameEdit: (frame: { width: number, height: number, top: number, left: number }, originalImgElement: HTMLImageElement) => void;
  onRevertToAuto: () => void;
  onRevertToOriginal: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  toolboxKey: number;
}

const UndoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
const RedoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);


export const Editor: React.FC<EditorProps> = ({ 
    originalImage, 
    currentImage, 
    onEdit, 
    onFrameEdit,
    onRevertToAuto, 
    onRevertToOriginal,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    toolboxKey 
}) => {
  const [isFramingMode, setIsFramingMode] = useState(false);

  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `SnazzyHeadshot_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleGenerateFrame = (frame: { width: number, height: number, top: number, left: number }, originalImgElement: HTMLImageElement) => {
    onFrameEdit(frame, originalImgElement);
    setIsFramingMode(false);
  }

  return (
    <div className="w-full h-full flex-grow flex flex-col lg:flex-row gap-8 items-stretch">
      <div className="flex-grow flex flex-col items-center justify-center lg:w-3/4">
        <div className="w-full max-w-3xl mx-auto aspect-[3/4] relative">
            {isFramingMode ? (
                <InteractiveFrame 
                    imageSrc={currentImage}
                    onGenerate={handleGenerateFrame}
                    onCancel={() => setIsFramingMode(false)}
                />
            ) : (
                <ImageComparator before={originalImage} after={currentImage} />
            )}
        </div>

        <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-4 w-full max-w-md">
            <div className="col-span-2 flex justify-center space-x-4">
                 <button
                   onClick={onUndo}
                   disabled={!canUndo}
                   className="flex items-center justify-center w-16 bg-slate-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all transform hover:scale-105"
                   aria-label="Undo"
                 >
                    <UndoIcon className="w-6 h-6" />
                 </button>
                 <button
                   onClick={onRedo}
                   disabled={!canRedo}
                   className="flex items-center justify-center w-16 bg-slate-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all transform hover:scale-105"
                   aria-label="Redo"
                 >
                    <RedoIcon className="w-6 h-6" />
                 </button>
            </div>
             <button
               onClick={onRevertToOriginal}
               className="bg-slate-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-500 transition-all transform hover:scale-105"
             >
                Reset to Original
             </button>
             <button
               onClick={handleDownload}
               className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-500 transition-all transform hover:scale-105"
             >
                Download
             </button>
        </div>
      </div>
      <aside className="w-full lg:w-1/4 lg:max-w-sm flex-shrink-0">
        <Toolbox 
            onEdit={onEdit} 
            onRevert={onRevertToAuto} 
            key={toolboxKey} 
            isFramingMode={isFramingMode}
            setIsFramingMode={setIsFramingMode}
        />
      </aside>
    </div>
  );
};