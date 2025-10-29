
import React, { useState, useRef, useEffect } from 'react';

interface ImageComparatorProps {
  before: string;
  after: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(parseFloat(e.target.value));
  };
  
  const handleMove = (clientX: number) => {
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        setSliderPos(percentage);
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

  const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
  };


  return (
    <div className="w-full max-w-3xl mx-auto aspect-[3/4] relative select-none rounded-2xl overflow-hidden shadow-2xl bg-slate-800" ref={containerRef}>
      <img src={before} alt="Original" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={after} alt="Edited" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      </div>
      
      <div
          className="absolute top-0 bottom-0 cursor-ew-resize"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
      >
          <div className="w-1.5 h-full bg-white/50 backdrop-blur-sm shadow-lg"></div>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm cursor-ew-resize">
              <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
              </svg>
          </div>
      </div>
      <div className="absolute top-2 left-4 bg-black/50 text-white px-3 py-1 text-sm font-semibold rounded-full">ORIGINAL</div>
      <div className="absolute top-2 right-4 bg-black/50 text-white px-3 py-1 text-sm font-semibold rounded-full" style={{ opacity: sliderPos > 50 ? 1 : 0, transition: 'opacity 0.2s' }}>EDITED</div>
    </div>
  );
};
