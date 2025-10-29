import React, { useCallback, useState } from 'react';

interface UploadScreenProps {
  onImageUpload: (file: File) => void;
}

const PhotoIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const UploadScreen: React.FC<UploadScreenProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full max-w-2xl text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
        Create Your Professional Headshot in Seconds
      </h1>
      <p className="text-lg text-slate-400 mb-8">
        Upload a photo and let our AI transform it into a high-quality, studio-grade headshot.
      </p>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative block w-full rounded-lg border-2 border-dashed ${isDragging ? 'border-blue-400 bg-slate-800/50' : 'border-slate-700'} p-12 text-center transition-colors`}
      >
        <PhotoIcon className="mx-auto h-12 w-12 text-slate-500" />
        <span className="mt-2 block font-semibold text-slate-300">
          Drop your photo here or{' '}
          <label htmlFor="file-upload" className="cursor-pointer text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 rounded-md">
            choose a file
          </label>
        </span>
        <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
      </div>
    </div>
  );
};
