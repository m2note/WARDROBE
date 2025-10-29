import React, { useState, useRef, useEffect, useCallback } from 'react';

const MIN_SIZE = 50; // Minimum size for the frame in pixels

const aspectRatios: { [key: string]: number | null } = {
  'Custom': null,
  '1:1': 1 / 1,
  '3:4': 3 / 4,
  '2:3': 2 / 3,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
  '16:9': 16 / 9,
  '9:16': 9 / 16,
};

// --- Sub-Components ---
const AspectRatioSelector: React.FC<{
    selected: string;
    onSelect: (ratio: string) => void;
}> = ({ selected, onSelect }) => (
    <div className="p-2">
        <h4 className="px-2 pb-2 text-sm font-semibold text-slate-400">Aspect Ratio</h4>
        <div className="grid grid-cols-4 gap-2">
            {Object.keys(aspectRatios).map(ratio => (
                <button 
                    key={ratio}
                    onClick={() => onSelect(ratio)}
                    className={`p-2 text-sm rounded-md transition-colors ${selected === ratio ? 'bg-blue-600 text-white font-bold' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                >
                    {ratio}
                </button>
            ))}
        </div>
    </div>
);


export const InteractiveFrame: React.FC<{
    imageSrc: string;
    onGenerate: (frame: { width: number, height: number, top: number, left: number }, originalImgElement: HTMLImageElement) => void;
    onCancel: () => void;
}> = ({ imageSrc, onGenerate, onCancel }) => {
    const [aspectRatioKey, setAspectRatioKey] = useState<string>('3:4');
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
    const [frame, setFrame] = useState({ x: 0, y: 0, width: 300, height: 400 });
    const [imageState, setImageState] = useState({ x: 0, y: 0, width: 300, height: 400 });

    const initCanvas = useCallback(() => {
        if (!containerRef.current || !imageRef.current || !imageRef.current.complete) return;
        
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const img = imageRef.current;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        
        let initialWidth, initialHeight;

        if (containerWidth / containerHeight > imgRatio) {
            initialHeight = containerHeight * 0.8;
            initialWidth = initialHeight * imgRatio;
        } else {
            initialWidth = containerWidth * 0.8;
            initialHeight = initialWidth / imgRatio;
        }
        
        const initialX = (containerWidth - initialWidth) / 2;
        const initialY = (containerHeight - initialHeight) / 2;
        
        const initialState = {
            width: initialWidth,
            height: initialHeight,
            x: initialX,
            y: initialY,
        };
        setImageState(initialState);
        setFrame(initialState);

    }, [imageSrc]);

    useEffect(() => {
        const img = imageRef.current;
        if (img) {
            img.onload = initCanvas;
            if (img.complete) initCanvas();
        }
        window.addEventListener('resize', initCanvas);
        return () => window.removeEventListener('resize', initCanvas);
    }, [initCanvas]);
    
    useEffect(() => {
        const ratio = aspectRatios[aspectRatioKey];
        if (ratio) {
            setFrame(f => ({ ...f, height: f.width / ratio }));
        }
    }, [aspectRatioKey]);

    const handleFrameResize = (e: React.MouseEvent | React.TouchEvent, handle: string) => {
        e.preventDefault();
        const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const startFrame = { ...frame };

        const doDrag = (moveEvent: MouseEvent | TouchEvent) => {
            const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
            let dx = currentX - startX;
            let dy = currentY - startY;

            let { x, y, width, height } = startFrame;

            if (handle.includes('right')) width += dx;
            if (handle.includes('left')) { width -= dx; x += dx; }
            if (handle.includes('bottom')) height += dy;
            if (handle.includes('top')) { height -= dy; y += dy; }
            
            if (width < MIN_SIZE) width = MIN_SIZE;
            if (height < MIN_SIZE) height = MIN_SIZE;

            const ratio = aspectRatios[aspectRatioKey];
            if (ratio && aspectRatioKey !== 'Custom') {
                 if (handle.includes('right') || handle.includes('left')) {
                     height = width / ratio;
                 } else {
                     width = height * ratio;
                 }
                 if(handle === 'top-left' || handle === 'bottom-left') x = startFrame.x + startFrame.width - width;
                 if(handle === 'top-left' || handle === 'top-right') y = startFrame.y + startFrame.height - height;
            }
            setFrame({ x, y, width, height });
        };
        
        const stopDrag = () => {
            window.removeEventListener('mousemove', doDrag as any);
            window.removeEventListener('mouseup', stopDrag);
            window.removeEventListener('touchmove', doDrag as any);
            window.removeEventListener('touchend', stopDrag);
        };

        window.addEventListener('mousemove', doDrag as any);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchmove', doDrag as any);
        window.addEventListener('touchend', stopDrag);
    };
    
    const handleImageDrag = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const startImagePos = { ...imageState };

        const doDrag = (moveEvent: MouseEvent | TouchEvent) => {
            const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
            let dx = currentX - startX;
            let dy = currentY - startY;
            setImageState(prev => ({...prev, x: startImagePos.x + dx, y: startImagePos.y + dy}));
        };
        
        const stopDrag = () => {
            window.removeEventListener('mousemove', doDrag as any);
            window.removeEventListener('mouseup', stopDrag);
            window.removeEventListener('touchmove', doDrag as any);
            window.removeEventListener('touchend', stopDrag);
        };
        
        window.addEventListener('mousemove', doDrag as any);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchmove', doDrag as any);
        window.addEventListener('touchend', stopDrag);
    };


    const handleGenerateClick = () => {
        if (!imageRef.current) return;
        
        const scale = imageRef.current.naturalWidth / imageState.width;
        
        const finalWidth = frame.width * scale;
        const finalHeight = frame.height * scale;
        const finalImageX = (imageState.x - frame.x) * scale;
        const finalImageY = (imageState.y - frame.y) * scale;
        
        onGenerate({
            width: finalWidth,
            height: finalHeight,
            left: finalImageX,
            top: finalImageY,
        }, imageRef.current);
    }
    
    return (
        <div className="w-full h-full flex flex-col bg-slate-800/80 rounded-lg overflow-hidden border border-slate-700">
            <div ref={containerRef} className="flex-grow w-full h-full relative overflow-hidden select-none">
                <div className="absolute inset-0 bg-slate-900/50" />
                
                <img
                    ref={imageRef}
                    src={imageSrc}
                    className="absolute cursor-move"
                    style={{
                        width: `${imageState.width}px`,
                        height: `${imageState.height}px`,
                        transform: `translate(${imageState.x}px, ${imageState.y}px)`,
                    }}
                    onMouseDown={handleImageDrag}
                    onTouchStart={handleImageDrag}
                    draggable={false}
                    alt=""
                />
                 <div
                    className="absolute border-2 border-dashed border-white pointer-events-none"
                    style={{
                        width: `${frame.width}px`,
                        height: `${frame.height}px`,
                        transform: `translate(${frame.x}px, ${frame.y}px)`,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                    }}
                />

                <div className="absolute" style={{
                    width: `${frame.width}px`,
                    height: `${frame.height}px`,
                    transform: `translate(${frame.x}px, ${frame.y}px)`,
                    pointerEvents: 'none'
                }}>
                    {/* Handles */}
                    {['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right'].map(handle => (
                        <div
                            key={handle}
                            onMouseDown={e => handleFrameResize(e, handle)}
                            onTouchStart={e => handleFrameResize(e, handle)}
                            className={`absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full -m-2 pointer-events-auto
                                ${handle.includes('top') ? 'top-0' : ''} ${handle.includes('bottom') ? 'bottom-0' : ''} 
                                ${handle.includes('left') ? 'left-0' : ''} ${handle.includes('right') ? 'right-0' : ''}
                                ${handle === 'top' || handle === 'bottom' ? 'left-1/2' : ''}
                                ${handle === 'left' || handle === 'right' ? 'top-1/2' : ''}
                                ${handle.includes('left') && handle.includes('right') ? '' : (handle.includes('top') || handle.includes('bottom') ? 'cursor-ns-resize' : 'cursor-ew-resize')}
                                ${handle === 'top-left' || handle === 'bottom-right' ? 'cursor-nwse-resize' : ''}
                                ${handle === 'top-right' || handle === 'bottom-left' ? 'cursor-nesw-resize' : ''}
                            `}
                        />
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0 bg-slate-800 p-2 border-t border-slate-700">
                <AspectRatioSelector selected={aspectRatioKey} onSelect={setAspectRatioKey} />
                 <div className="p-2 grid grid-cols-2 gap-4">
                     <button
                       onClick={onCancel}
                       className="w-full bg-slate-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-500 transition-all transform hover:scale-105"
                     >
                        Cancel
                     </button>
                     <button
                       onClick={handleGenerateClick}
                       className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-500 transition-all transform hover:scale-105"
                     >
                        Apply Frame & Generate
                     </button>
                 </div>
            </div>
        </div>
    );
};