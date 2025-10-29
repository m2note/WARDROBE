import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { UploadScreen } from './components/UploadScreen';
import { Editor } from './components/Editor';
import { editImageWithGemini } from './services/geminiService';
import { ImageState } from './types';
import { LoadingOverlay } from './components/LoadingOverlay';

interface EditOptions {
  referenceImage?: {
    base64: string;
    mimeType: string;
  };
}

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    original: null,
    history: [],
    historyIndex: -1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [toolboxKey, setToolboxKey] = useState(0);

  const currentImage = useMemo(() => {
    if (imageState.historyIndex === -1) return null;
    return imageState.history[imageState.historyIndex];
  }, [imageState.history, imageState.historyIndex]);

  const handleImageUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      const mimeType = file.type;
      
      const originalImageSrc = `data:${mimeType};base64,${base64Data}`;
      setImageState({ original: originalImageSrc, history: [originalImageSrc], historyIndex: 0 });

      setIsLoading(true);
      setLoadingMessage('Performing Snazzy Auto-Transform...');
      setError(null);
      
      try {
        const prompt = "Transform this photo into a professional headshot. Perform automatic adjustments for lighting, color correction, natural skin smoothing, and sharpen facial features for a high-quality, polished look. Do not crop the image.";
        const editedImage = await editImageWithGemini(base64Data, mimeType, prompt);
        setImageState({
          original: originalImageSrc,
          history: [originalImageSrc, editedImage],
          historyIndex: 1,
        });
      } catch (e) {
        console.error(e);
        setError('Failed to process the image with AI. Please check your API Key or try another photo.');
        setImageState({ original: null, history: [], historyIndex: -1 });
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    };
    reader.readAsDataURL(file);
  }, []);
  
  const pushToHistory = (newImage: string) => {
    setImageState(prev => {
        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push(newImage);
        return {
            ...prev,
            history: newHistory,
            historyIndex: newHistory.length - 1
        };
    });
  };

  const handleEdit = useCallback(async (prompt: string, message: string, options?: EditOptions) => {
    if (!currentImage) return;

    setIsLoading(true);
    setLoadingMessage(message);
    setError(null);

    try {
      const [header, base64Data] = currentImage.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      const editedImage = await editImageWithGemini(base64Data, mimeType, prompt, options?.referenceImage);
      pushToHistory(editedImage);
    } catch (e) {
      console.error(e);
      setError('An AI error occurred. Please try a different action.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [currentImage, imageState.history, imageState.historyIndex]);

  const handleFrameEdit = useCallback(async (frame: { width: number, height: number, top: number, left: number }, originalImgElement: HTMLImageElement) => {
        if (!currentImage) return;

        setIsLoading(true);
        setLoadingMessage("Generating new frame with AI...");
        setError(null);

        try {
            const canvas = document.createElement('canvas');
            canvas.width = frame.width;
            canvas.height = frame.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not get canvas context");

            ctx.drawImage(originalImgElement, frame.left, frame.top);
            
            const outpaintedImageBase64 = canvas.toDataURL('image/png').split(',')[1];
            const mimeType = 'image/png';
            
            const prompt = "This is an image with transparent areas that need to be filled. Perform an outpainting task to seamlessly extend the existing background and scene into the transparent regions. The final result should look natural, photorealistic, and have no transparency.";
            
            const editedImage = await editImageWithGemini(outpaintedImageBase64, mimeType, prompt);
            pushToHistory(editedImage);
        } catch (e) {
            console.error(e);
            setError('An AI error occurred during frame generation.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
  }, [currentImage]);


  const handleReset = () => {
    setImageState({ original: null, history: [], historyIndex: -1 });
    setError(null);
  }

  const handleRevertToAuto = () => {
    if (imageState.history.length > 1) {
        const newHistory = imageState.history.slice(0, imageState.historyIndex + 1);
        newHistory.push(imageState.history[1]);
        setImageState(prev => ({ 
            ...prev,
            history: newHistory,
            historyIndex: newHistory.length - 1
        }));
    }
  };

  const handleRevertToOriginal = () => {
    if (imageState.original) {
        pushToHistory(imageState.original);
    }
    setToolboxKey(prev => prev + 1);
  };

  const handleUndo = () => {
    setImageState(prev => ({ ...prev, historyIndex: Math.max(0, prev.historyIndex - 1) }));
  };

  const handleRedo = () => {
    setImageState(prev => ({ ...prev, historyIndex: Math.min(prev.history.length - 1, prev.historyIndex + 1) }));
  };

  const canUndo = imageState.historyIndex > 0;
  const canRedo = imageState.historyIndex < imageState.history.length - 1;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header onNewUpload={handleReset} />
      {isLoading && <LoadingOverlay message={loadingMessage} />}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {error && (
          <div className="absolute top-20 bg-red-500/90 text-white p-3 rounded-lg shadow-lg z-50">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="absolute top-1 right-2 font-bold">&times;</button>
          </div>
        )}
        {!currentImage ? (
          <UploadScreen onImageUpload={handleImageUpload} />
        ) : (
          <Editor 
            originalImage={imageState.original!}
            currentImage={currentImage}
            onEdit={handleEdit}
            onFrameEdit={handleFrameEdit}
            onRevertToAuto={handleRevertToAuto} 
            onRevertToOriginal={handleRevertToOriginal}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            toolboxKey={toolboxKey}
          />
        )}
      </main>
    </div>
  );
};

export default App;
