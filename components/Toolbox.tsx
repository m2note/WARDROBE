import React, { useState, useEffect, useRef, useCallback } from 'react';

interface EditOptions {
  referenceImage?: {
    base64: string;
    mimeType: string;
  };
}

interface ToolboxProps {
    onEdit: (prompt: string, message: string, options?: EditOptions) => void;
    onRevert: () => void;
    isFramingMode: boolean; 
    setIsFramingMode: (isFraming: boolean) => void;
}

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    onToggle?: (isOpen: boolean) => void;
    disabled?: boolean;
}

// --- SVG Icons for Tools ---

const SuitIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12,13L8,21" /><path d="M12,13L16,21" /><path d="M12,13l-2-2.5" /><path d="M12,13l2-2.5" /><path d="M6,8 l-2,5 h16 l-2,-5 Z" /><path d="M12,3L6,8" /><path d="M12,3L18,8" />
    </svg>
);
const ShirtIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13v8M9 21h6M9 13a5 5 0 0 1-5-5V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a5 5 0 0 1-5 5Z"/><path d="M14 8L8 13"/>
    </svg>
);
const PoloIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13v8M9 21h6M9 13a5 5 0 0 1-5-5V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a5 5 0 0 1-5 5Z"/><path d="M12 10V6l-2 2"/>
    </svg>
);
const BlouseIcon: React.FC = () => (
     <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 13a5 5 0 0 1-5-5V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a5 5 0 0 1-5 5Z"/><path d="M12 13c-2.8 0-5 2.2-5 5v3h10v-3c0-2.8-2.2-5-5-5Z"/><path d="M12 10a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2Z"/>
    </svg>
);
const TurtleneckIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13v8M9 21h6M9 13a5 5 0 0 1-5-5V5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3a5 5 0 0 1-5 5Z"/><path d="M10 2a2 2 0 1 0 4 0V5h-4V2Z"/>
    </svg>
);
const PassportIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M9 16a3 3 0 016 0" />
    </svg>
);
const TurnLeftIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 17l-3-3 3-3" /><path d="M17 14H7" /><circle cx="12" cy="12" r="10" />
    </svg>
);
const TurnRightIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 17l3-3-3-3" /><path d="M7 14h10" /><circle cx="12" cy="12" r="10" />
    </svg>
);
const SmileIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
);
const HairIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13s3-1 7-1 8 1 8 1" /><path d="M2 18s3-1 7-1 8 1 8 1" /><path d="M5 8c-2.5 1.5-3 5-3 5" /><path d="M19 8c2.5 1.5 3 5 3 5" /><path d="M12 4c-3 3-4 7-4 7" /><path d="M12 4c3 3 4 7 4 7" />
    </svg>
);
const PhotoIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// --- New Wardrobe Icons ---
const DressShirtIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 13a5 5 0 0 1-5-5V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a5 5 0 0 1-5 5Z"/><path d="M12 13v8m-3 0h6"/><path d="m15 8-6 5"/>
    </svg>
);
const BlazerIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 8 6-5 6 5v7l-6 5-6-5Z"/><path d="m6 8 6 5 6-5"/><path d="M12 22V13"/>
    </svg>
);
const VNeckSweaterIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13v8m-3 0h6"/><path d="M17 6.5A5.5 5.5 0 0 0 6.5 6.5V13h11V6.5Z"/><path d="m12 6.5-3 4.5h6l-3-4.5Z"/>
    </svg>
);
const CardiganIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M12 4v16"/><path d="M12 4a4 4 0 0 0-4 4"/>
    </svg>
);
const LeatherJacketIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><path d="M4 14h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="m4.5 12.5-1-2 2 2"/><path d="m19.5 12.5 1-2-2 2"/><path d="M12 12V8"/>
    </svg>
);
const DenimJacketIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><path d="M4 14h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M8 10V8m8 2V8"/><path d="M12 12V8"/>
    </svg>
);
const TrenchCoatIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 8 6-5 6 5v11l-6 5-6-5Z"/><path d="m6 8 6 5 6-5"/><path d="M12 22V13"/><path d="M4 14h16"/>
    </svg>
);
const TShirtIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13v8m-3 0h6"/><path d="M15 8.5a4 4 0 0 0-6 0v5h6v-5Z"/><path d="M5.5 12.5a2 2 0 0 0 2-2H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1.5"/><path d="M18.5 12.5a2 2 0 0 1-2-2H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1.5"/>
    </svg>
);
const TieIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2 4 4-2 1-4.5 4.5-2-2 4.5-7.5Z"/><path d="M11 22 7.5 17l1-1 3.5 3.5 3.5-3.5 1 1Z"/>
    </svg>
);
const ScarfIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21s-2-2-2-6 2-6 2-6"/><path d="M16 3s2 2 2 6-2 6-2 6"/><path d="M8 8c2.5 1 4 2 4 4s-1.5 3-4 4"/><path d="M16 16c-2.5-1-4-2-4-4s1.5-3 4-4"/>
    </svg>
);
const CrewNeckSweaterIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13v8m-3 0h6"/><path d="M17 8a5 5 0 0 0-10 0v5h10V8Z"/>
    </svg>
);
const HoodieIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13v8m-3 0h6"/><path d="M17 8a5 5 0 0 0-10 0v5h10V8Z"/><path d="M12 8a3 3 0 0 0-3-3h-.5a3.5 3.5 0 0 0-3.5 3.5V10"/>
    </svg>
);
const PeaCoatIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 8 6-5 6 5v7l-6 5-6-5Z"/><path d="M12 13 6 8"/><path d="M12 13 18 8"/><circle cx="10" cy="11" r=".5" fill="currentColor"/><circle cx="14" cy="11" r=".5" fill="currentColor"/><circle cx="10" cy="14" r=".5" fill="currentColor"/><circle cx="14" cy="14" r=".5" fill="currentColor"/>
    </svg>
);
const BomberJacketIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><path d="M4 14h16v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z"/><path d="M12 12V8"/><path d="M10 8a2 2 0 0 0-2-2h-1"/><path d="M14 8a2 2 0 0 1 2-2h1"/>
    </svg>
);
const VestIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 8 8v7l4 4 4-4V8l-4-5Z"/><path d="M12 3v18"/><path d="M8 8H4v7h4"/><path d="M16 8h4v7h-4"/>
    </svg>
);
const BowTieIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12s-3-2-3-4 1.5-4 3-4 3 2 3 4-3 4-3 4Z"/><path d="M12 12s-3 2-3 4 1.5 4 3 4 3-2 3-4-3-4-3-4Z"/>
    </svg>
);
const HenleyShirtIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13v8m-3 0h6"/><path d="M17 8a5 5 0 0 0-10 0v5h10V8Z"/><path d="M12 8v4"/><circle cx="12" cy="9.5" r=".5" fill="currentColor"/><circle cx="12" cy="11.5" r=".5" fill="currentColor"/>
    </svg>
);
const LabCoatIcon: React.FC = () => (
    <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 8 6-5 6 5v11l-6 5-6-5Z"/><path d="m6 8 6 5 6-5"/><path d="M12 22V13"/><path d="M8 14h2v2H8z"/>
    </svg>
);

// --- Face Refine Icons ---
const SkinIcon = () => <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.8 0 1.5-.1 2.2-.3"/><path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10c-.8 0-1.5-.1-2.2-.3"/></svg>;
const EyeIcon = () => <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><path d="m14 10 2-2"/></svg>;
const TeethIcon = () => <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.3 13.2c-1.2-1.2-2.8-2-4.5-2.2"/><path d="M3.7 13.2c1.2-1.2 2.8-2 4.5-2.2"/><path d="M12 18s-4-3-4-5V8c0-1.7 1.3-3 3-3h2c1.7 0 3 1.3 3 3v5c0 2-4 5-4 5Z"/><path d="M8 8h8v2H8Z"/></svg>;
const BlemishIcon = () => <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 3 1.9 3.8 4.2.6-3 2.9.7 4.2-3.8-2-3.8 2 .7-4.2-3-2.9 4.2-.6z"/></svg>;


// --- Lighting Icons ---
const RembrandtIcon = () => <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M14.2 15.5a1 1 0 0 0 -1.5 1l1.5 -1Z"/></svg>;
const ButterflyIcon = () => <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M10.5 14.5s.5 1 1.5 1 1.5-1 1.5-1"/></svg>;
const SplitIcon = () => <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="currentColor"><path d="M12 2 A10 10 0 0 0 12 22 Z"/></svg>;
const LoopIcon = () => <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M14 15a1 1 0 0 1 -2 0c0-.5.5-1 1-1Z"/></svg>;
const RimIcon = () => <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="7"/><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1 -10 10 10 10 0 0 1 -10-10 10 10 0 0 1 10-10Z"/></svg>;


// --- UI Components ---

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, defaultOpen = false, onToggle, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleToggle = () => {
        if (disabled) return;
        const newState = !isOpen;
        setIsOpen(newState);
        onToggle?.(newState);
    };

    // Close accordion if it becomes disabled while open
    useEffect(() => {
        if (disabled && isOpen) {
            setIsOpen(false);
        }
    }, [disabled, isOpen]);

    return (
        <div className={`border-b border-slate-700 ${disabled ? 'opacity-50' : ''}`}>
            <h2>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-4 font-medium text-left text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed"
                    onClick={handleToggle}
                    disabled={disabled}
                    aria-expanded={isOpen}
                >
                    <span>{title}</span>
                    <svg className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen && !disabled ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </h2>
            {isOpen && !disabled && <div className="p-4 pt-0">{children}</div>}
        </div>
    );
};


const ToolOption: React.FC<{
  label: string;
  onClick: () => void;
  preview: React.ReactNode;
  isActive?: boolean;
}> = ({ label, onClick, preview, isActive = false }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-start space-y-2 text-center group w-20"
    aria-label={label}
  >
    <div className={`w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden bg-slate-700/50 border-2  group-hover:border-blue-400 transition-all duration-200 shadow-inner ${isActive ? 'border-blue-500' : 'border-slate-700'}`}>
      {preview}
    </div>
    <span className={`text-xs group-hover:text-slate-200 transition-colors h-8 flex items-center text-center leading-tight ${isActive ? 'text-slate-100 font-semibold' : 'text-slate-400'}`}>
      {label}
    </span>
  </button>
);

const KelvinSlider: React.FC<{
    value: number;
    onChange: (value: number) => void;
}> = ({ value, onChange }) => {
    const getGradientColor = () => {
        const percent = (value - 3200) / (7500 - 3200);
        const r = 255;
        const g = Math.round(150 + (105 * (1 - percent)));
        const b = Math.round(0 + (255 * (1 - percent)));
        const rCool = Math.round(180 + (75 * percent));
        const gCool = Math.round(220 + (35 * percent));
        const bCool = 255;

        const finalR = Math.round(r * (1-percent) + rCool * percent);
        const finalG = Math.round(g * (1-percent) + gCool * percent);
        const finalB = Math.round(b * (1-percent) + bCool * percent);

        return `rgb(${finalR}, ${finalG}, ${finalB})`;
    };

    return (
        <div className="p-2">
            <label htmlFor="kelvin-slider" className="flex justify-between items-center text-sm font-medium text-slate-300 mb-2">
                <span>Color Temperature</span>
                <span className="font-bold px-2 py-1 rounded-md" style={{backgroundColor: getGradientColor(), color: value > 5500 ? 'black' : 'white', textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}>
                    {value}K
                </span>
            </label>
            <input
                id="kelvin-slider"
                type="range"
                min="3200"
                max="7500"
                step="50"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-lg appearance-none cursor-pointer"
            />
             <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Warm</span>
                <span>Cool</span>
            </div>
        </div>
    );
};

const LightDirectionKnob: React.FC<{
    angle: number;
    setAngle: (angle: number) => void;
}> = ({ angle, setAngle }) => {
    const knobRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        if (!knobRef.current) return;
        const rect = knobRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        const rad = Math.atan2(deltaY, deltaX);
        let deg = rad * (180 / Math.PI);
        deg = (deg + 450) % 360; // Adjust to make 0deg at the top
        setAngle(Math.round(deg));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        handleInteraction(e);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
            handleInteraction(e as unknown as React.MouseEvent);
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
    
    return (
        <div className="flex flex-col items-center p-2">
            <div
                ref={knobRef}
                onMouseDown={handleMouseDown}
                className="relative w-32 h-32 bg-slate-700 rounded-full border-4 border-slate-600 cursor-pointer flex items-center justify-center shadow-inner"
                role="slider"
                aria-valuenow={angle}
                aria-valuemin={0}
                aria-valuemax={359}
                aria-label="Light direction control"
            >
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{angle}°</span>
                </div>
                <div 
                    className="absolute top-1/2 left-1/2 w-4 h-4 -m-2 bg-blue-400 rounded-full border-2 border-slate-900"
                    style={{ transform: `rotate(${angle}deg) translate(56px)` }}
                />
            </div>
        </div>
    );
};

// --- Easy Mode Presets Data ---
const easyModePresets = [
    {
        label: "Corporate Leader",
        prompt: "Transform this image into a powerful corporate headshot. Change the person's outfit to a sharp, professional dark business suit. Replace the background with a modern, high-end office with large windows, subtly blurred. Adjust the lighting to be confident and professional, with a clear key light. The final image should feel polished and authoritative. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-slate-800 flex items-center justify-center"><SuitIcon /></div>
    },
    {
        label: "Creative Professional",
        prompt: "Transform this into a headshot for a creative professional. Change the outfit to a stylish dark turtleneck sweater. Replace the background with a rustic, textured brick wall. The lighting should be slightly dramatic, like Rembrandt or loop lighting, to add character. The final image should feel artistic and confident. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-red-900/80 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:12px_6px] flex items-center justify-center"><TurtleneckIcon /></div>
    },
    {
        label: "Tech Startup",
        prompt: "Transform this into a friendly and modern tech startup headshot. Change the outfit to a smart casual polo shirt. Replace the background with a bright, open-plan office or a colorful wall, softly blurred. Use bright, natural-looking lighting. The final image should feel approachable and innovative. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-cyan-500/80 flex items-center justify-center"><PoloIcon/></div>
    },
    {
        label: "Academic / Author",
        prompt: "Transform this into a headshot for an academic or author. Change the outfit to a smart sweater or tweed blazer. Replace the background with a warm, aesthetically pleasing bookshelf or library, softly blurred. The lighting should be warm and soft. The final image should feel intelligent and thoughtful. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-amber-900/70 flex justify-around p-1 gap-1"><div className="w-1 h-full bg-red-900/70 rounded-sm"></div><div className="w-1 h-full bg-green-900/70 rounded-sm"></div><div className="w-1 h-full bg-blue-900/70 rounded-sm"></div></div>
    },
    {
        label: "Healthcare Pro",
        prompt: "Transform this into a professional headshot for a healthcare worker. Change the outfit to clean, simple scrubs (e.g., blue or green) or a white medical coat. Replace the background with a clean, minimalist, out-of-focus medical office or clinic setting. Lighting should be bright, clean, and trustworthy. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-teal-500/80 flex items-center justify-center"><svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L12 12L22 12"/><path d="M12 12L2 12"/><path d="M12 22L12 12"/><circle cx="12" cy="12" r="10"/></svg></div>
    },
    {
        label: "Outdoor Natural",
        prompt: "Transform this into a natural-light outdoor headshot. Change the outfit to a casual jacket or outdoor wear. Replace the background with a beautiful, softly blurred natural setting like a park or forest. The lighting should mimic natural sunlight, creating a warm and approachable feel. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-green-700/80 blur-sm flex items-center justify-center"><svg className="w-10 h-10 text-slate-300 filter-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg></div>
    },
     {
        label: "Studio Classic (B&W)",
        prompt: "Transform this into a timeless, classic black and white studio headshot. The outfit should be simple and dark. The background should be a solid, textured studio gray. Convert the entire image to a rich, high-contrast black and white with dramatic lighting that sculpts the face. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-gray-500 grayscale flex items-center justify-center"><SplitIcon/></div>
    },
    {
        label: "Friendly & Approachable",
        prompt: "Transform this into a friendly and approachable headshot. Change the outfit to a casual button-down shirt or a simple blouse. Replace the background with the warm, inviting, and softly blurred interior of a modern coffee shop. The lighting should be soft and flattering. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-amber-800/80 flex items-center justify-center"><SmileIcon/></div>
    },
    {
        label: "Minimalist Modern",
        prompt: "Transform this into a modern, minimalist headshot. Change the outfit to a simple, elegant top with clean lines (e.g., a solid color blouse or shirt). Replace the background with a clean, bright, minimalist architectural space (e.g., a white wall with an interesting shadow line), softly blurred. Use high-key, airy lighting. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-gray-200 flex items-center justify-center"><div className="w-1/2 h-full bg-gray-300"></div></div>
    },
     {
        label: "Glamour & Beauty",
        prompt: "Transform this into a glamorous beauty headshot. The outfit should be elegant. The background should be dark and moody. The lighting should be flattering and dramatic, like butterfly lighting with a rim light to separate the subject from the background. Skin should be smooth but natural. Critically, the person's face and identity must be perfectly preserved.",
        preview: <div className="w-full h-full bg-purple-900/80 flex items-center justify-center"><ButterflyIcon/></div>
    }
];



export const Toolbox: React.FC<ToolboxProps> = ({ onEdit, onRevert, isFramingMode, setIsFramingMode }) => {
    const [mode, setMode] = useState<'easy' | 'advanced'>('easy');
    const [kelvinValue, setKelvinValue] = useState(5500);
    const [lightAngle, setLightAngle] = useState(45);
    const [customPrompt, setCustomPrompt] = useState('');
    const [referenceImage, setReferenceImage] = useState<{ base64: string; mimeType: string; dataUrl: string; } | null>(null);
    
    const handleReferenceUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64Data = dataUrl.split(',')[1];
            setReferenceImage({ base64: base64Data, mimeType: file.type, dataUrl });
        };
        reader.readAsDataURL(file);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleReferenceUpload(e.target.files[0]);
        }
    };

    const handleToolClick = (prompt: string, message: string) => {
        let finalPrompt = prompt;
        if (referenceImage) {
            finalPrompt += " The first image provided is a style reference. Heavily reference it for overall mood, color grading, lighting, and texture when performing the requested edit on the second image.";
        }
        onEdit(finalPrompt, message, { referenceImage: referenceImage || undefined });
    };
    
    const handleKelvinApply = () => {
      const prompt = `Adjust the lighting color temperature to approximately ${kelvinValue}K. A lower value should be warmer (more orange/yellow) and a higher value should be cooler (more blue).`;
      handleToolClick(prompt, `Adjusting light to ${kelvinValue}K...`);
    };

    const handleLightDirectionApply = () => {
        let direction = '';
        if (lightAngle >= 337.5 || lightAngle < 22.5) direction = 'from the top';
        else if (lightAngle >= 22.5 && lightAngle < 67.5) direction = 'from the top-right';
        else if (lightAngle >= 67.5 && lightAngle < 112.5) direction = 'from the right';
        else if (lightAngle >= 112.5 && lightAngle < 157.5) direction = 'from the bottom-right';
        else if (lightAngle >= 157.5 && lightAngle < 202.5) direction = 'from the bottom';
        else if (lightAngle >= 202.5 && lightAngle < 247.5) direction = 'from the bottom-left';
        else if (lightAngle >= 247.5 && lightAngle < 292.5) direction = 'from the left';
        else if (lightAngle >= 292.5 && lightAngle < 337.5) direction = 'from the top-left';
        
        const prompt = `Change the main light source (the key light) to be positioned ${direction} relative to the subject. This should illuminate that side of their face more brightly and create soft shadows on the opposite side.`;
        handleToolClick(prompt, `Adjusting key light to ${lightAngle}°...`);
    };

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 w-full h-full flex flex-col">
            <div className="p-4 border-b border-slate-700">
                <h3 className="font-bold text-lg text-white">AI Editing Tools</h3>
                 <div className="mt-3">
                    <div className="flex bg-slate-700/50 rounded-lg p-1">
                        <button 
                            onClick={() => setMode('easy')}
                            disabled={isFramingMode}
                            className={`w-1/2 rounded-md py-1.5 text-sm font-semibold transition-colors disabled:opacity-50 ${mode === 'easy' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
                        >
                            Easy
                        </button>
                        <button 
                            onClick={() => setMode('advanced')}
                            disabled={isFramingMode}
                            className={`w-1/2 rounded-md py-1.5 text-sm font-semibold transition-colors disabled:opacity-50 ${mode === 'advanced' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
                        >
                            Advanced
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="overflow-y-auto">
            {mode === 'easy' && (
                <div className="p-4">
                    <p className="text-sm text-slate-400 mb-4">Choose a preset to instantly transform your headshot.</p>
                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {easyModePresets.map(preset => (
                            <ToolOption
                                key={preset.label}
                                label={preset.label}
                                onClick={() => handleToolClick(preset.prompt, `Applying ${preset.label} preset...`)}
                                preview={preset.preview}
                            />
                        ))}
                    </div>
                </div>
            )}

            {mode === 'advanced' && (
                <div>
                     <AccordionItem title="Style Reference" disabled={isFramingMode}>
                        <div className="p-2 space-y-4">
                            {!referenceImage ? (
                                <div>
                                     <label htmlFor="ref-upload" className="cursor-pointer relative block w-full rounded-lg border-2 border-dashed border-slate-600 hover:border-blue-400 p-6 text-center transition-colors">
                                        <PhotoIcon className="mx-auto h-8 w-8 text-slate-500" />
                                        <span className="mt-2 block text-sm font-semibold text-slate-300">
                                          Upload style reference
                                        </span>
                                     </label>
                                     <input id="ref-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <img src={referenceImage.dataUrl} alt="Style Reference" className="w-full rounded-lg" />
                                        <button
                                            onClick={() => setReferenceImage(null)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remove reference image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 text-center italic px-2">
                                        Style reference is active. It will now influence all other AI edits. You can also apply its style directly.
                                    </p>
                                    <button
                                        onClick={() => handleToolClick(
                                            "Re-imagine the headshot to match the overall style, mood, and color palette of the provided reference image. Adapt the lighting and texture to be consistent with the reference, without changing the subject's identity.",
                                            "Applying style reference..."
                                        )}
                                        className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-all"
                                    >
                                        Apply Style
                                    </button>
                                </div>
                            )}
                        </div>
                    </AccordionItem>
                    <AccordionItem title="AI Wardrobe" defaultOpen={true} disabled={isFramingMode}>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2">
                            <ToolOption label="Suit (Dark)" onClick={() => handleToolClick("Change the person's outfit into a professional dark-colored business suit. Ensure the result is photorealistic and fits the person's body naturally. Do not change the face, hair, or background.", "Adding Formal Suit...")} preview={<SuitIcon />} />
                            <ToolOption label="Suit (Light)" onClick={() => handleToolClick("Change the person's outfit into a professional light-colored (e.g., grey, beige) business suit. Ensure the result is photorealistic and fits the person's body naturally. Do not change the face, hair, or background.", "Adding Formal Suit...")} preview={<SuitIcon />} />
                            <ToolOption label="Blouse" onClick={() => handleToolClick("Change the person's outfit into a professional and elegant blouse. Ensure the result is photorealistic and fits the person's body naturally. Do not change the face, hair, or background.", "Adding Blouse...")} preview={<BlouseIcon />} />
                            <ToolOption label="Polo Shirt" onClick={() => handleToolClick("Change the person's outfit into a smart casual polo shirt. Ensure the result is photorealistic and fits the person's body naturally. Do not change the face, hair, or background.", "Adding Polo Shirt...")} preview={<PoloIcon />} />
                            <ToolOption label="Turtleneck" onClick={() => handleToolClick("Change the person's outfit into a classy turtleneck sweater. Ensure the result is photorealistic and fits the person's body naturally. Do not change the face, hair, or background.", "Adding Turtleneck...")} preview={<TurtleneckIcon />} />
                            <ToolOption label="Casual Shirt" onClick={() => handleToolClick("Change the person's outfit into a smart casual button-down shirt. Ensure the result is photorealistic and fits the person's body naturally. Do not change the face, hair, or background.", "Adding Casual Shirt...")} preview={<ShirtIcon />} />
                            <ToolOption label="Dress Shirt" onClick={() => handleToolClick("Change the person's outfit into a crisp, professional dress shirt. Ensure the result is photorealistic and fits the person's body naturally. Do not change the face, hair, or background.", "Adding Dress Shirt...")} preview={<DressShirtIcon />} />
                            <ToolOption label="Blazer" onClick={() => handleToolClick("Change the person's outfit to a stylish blazer over a simple top. Ensure the result is photorealistic and fits the person's body naturally. Do not change the face, hair, or background.", "Adding Blazer...")} preview={<BlazerIcon />} />
                            <ToolOption label="V-Neck" onClick={() => handleToolClick("Change the person's outfit into a smart v-neck sweater. It can be worn over a collared shirt or on its own. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding V-Neck...")} preview={<VNeckSweaterIcon />} />
                            <ToolOption label="Cardigan" onClick={() => handleToolClick("Change the person's outfit into a comfortable yet professional cardigan sweater over a simple shirt. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Cardigan...")} preview={<CardiganIcon />} />
                            <ToolOption label="T-Shirt" onClick={() => handleToolClick("Change the person's outfit into a simple, high-quality, well-fitting plain t-shirt (e.g., black, white, or gray). The look should be minimalist and modern. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding T-Shirt...")} preview={<TShirtIcon />} />
                            <ToolOption label="Leather Jacket" onClick={() => handleToolClick("Change the person's outfit into a stylish and modern leather jacket. Ensure the result is photorealistic and looks cool and confident. Do not change the face, hair, or background.", "Adding Leather Jacket...")} preview={<LeatherJacketIcon />} />
                            <ToolOption label="Denim Jacket" onClick={() => handleToolClick("Change the person's outfit into a casual but stylish denim jacket. Perfect for a creative or approachable look. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Denim Jacket...")} preview={<DenimJacketIcon />} />
                            <ToolOption label="Trench Coat" onClick={() => handleToolClick("Change the person's outfit to be wearing a classic, sophisticated trench coat, either open or closed. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Trench Coat...")} preview={<TrenchCoatIcon />} />
                            <ToolOption label="Add Tie" onClick={() => handleToolClick("If the person is wearing a collared shirt, add a professional tie. If they are not, first change the shirt to a dress shirt and then add the tie. The tie should complement the outfit. Do not change the face, hair, or background.", "Adding Tie...")} preview={<TieIcon />} />
                            <ToolOption label="Add Scarf" onClick={() => handleToolClick("Add a stylish and professional scarf to the person's outfit. The scarf should complement the existing clothing. Ensure the result is photorealistic and looks natural. Do not change the face, hair, or background.", "Adding Scarf...")} preview={<ScarfIcon />} />
                            <ToolOption label="Crew Neck" onClick={() => handleToolClick("Change the person's outfit into a classic crew neck sweater. The look should be smart and clean. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Sweater...")} preview={<CrewNeckSweaterIcon />} />
                            <ToolOption label="Hoodie" onClick={() => handleToolClick("Change the person's outfit to a stylish, well-fitting hoodie for a modern and casual-tech look. Avoid large logos or graphics. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Hoodie...")} preview={<HoodieIcon />} />
                            <ToolOption label="Pea Coat" onClick={() => handleToolClick("Change the person's outfit to be wearing a classic, sophisticated pea coat. The coat should look professional and warm. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Pea Coat...")} preview={<PeaCoatIcon />} />
                            <ToolOption label="Bomber Jacket" onClick={() => handleToolClick("Change the person's outfit into a modern and stylish bomber jacket. The look should be confident and contemporary. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Bomber Jacket...")} preview={<BomberJacketIcon />} />
                            <ToolOption label="Vest" onClick={() => handleToolClick("Change the person's outfit to include a smart waistcoat (vest) over a dress shirt. The look should be sharp and professional. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Vest...")} preview={<VestIcon />} />
                            <ToolOption label="Bow Tie" onClick={() => handleToolClick("If the person is wearing a collared shirt, add a formal bow tie. If they are not, first change the shirt to a dress shirt and then add the bow tie. The bow tie should be stylish. Do not change the face, hair, or background.", "Adding Bow Tie...")} preview={<BowTieIcon />} />
                            <ToolOption label="Henley Shirt" onClick={() => handleToolClick("Change the person's outfit into a comfortable yet stylish long-sleeve Henley shirt. The look should be casual but put-together. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Henley Shirt...")} preview={<HenleyShirtIcon />} />
                            <ToolOption label="Lab Coat" onClick={() => handleToolClick("Change the person's outfit to a professional white lab coat, worn over simple clothing. The look should be suitable for a scientist or researcher. Ensure the result is photorealistic. Do not change the face, hair, or background.", "Adding Lab Coat...")} preview={<LabCoatIcon />} />
                        </div>
                         <div className="p-2 pt-4">
                            <button onClick={onRevert} className="w-full text-center px-4 py-2 text-sm text-slate-300 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors font-semibold">
                                Revert to Auto-Transformed
                            </button>
                        </div>
                    </AccordionItem>
                    
                    <AccordionItem title="Frame & Aspect Ratio" onToggle={(isOpen) => setIsFramingMode(isOpen)}>
                         {isFramingMode ? (
                             <p className="px-2 pb-2 text-sm text-center text-blue-300 italic">
                                Frame controls are active on the image canvas.
                             </p>
                        ) : (
                            <p className="px-2 pb-2 text-sm text-slate-400">
                                Click to activate Frame Mode to expand the canvas.
                            </p>
                        )}
                    </AccordionItem>

                    <AccordionItem title="AI Background" disabled={isFramingMode}>
                        <div className="px-2 pt-2">
                            <h4 className="px-2 pb-2 text-sm font-semibold text-slate-400">Solid Colors</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                <ToolOption label="Light Gray" onClick={() => handleToolClick("Replace the background with a solid professional light gray (#e5e7eb). Ensure perfect subject masking and lighting consistency.", "Changing Background...")} preview={<div className="w-full h-full bg-gray-200"/>} />
                                <ToolOption label="Dark Gray" onClick={() => handleToolClick("Replace the background with a solid professional dark gray (#374151). Ensure perfect subject masking and lighting consistency.", "Changing Background...")} preview={<div className="w-full h-full bg-gray-700"/>} />
                                <ToolOption label="Navy Blue" onClick={() => handleToolClick("Replace the background with a solid professional navy blue (#1e3a8a). Ensure perfect subject masking and lighting consistency.", "Changing Background...")} preview={<div className="w-full h-full bg-blue-900"/>} />
                                <ToolOption label="Studio Red" onClick={() => handleToolClick("Replace the background with a solid professional studio red (#b91c1c). Ensure perfect subject masking and lighting consistency.", "Changing Background...")} preview={<div className="w-full h-full bg-red-700"/>} />
                            </div>
                             <h4 className="px-2 pt-4 pb-2 text-sm font-semibold text-slate-400">Environments</h4>
                             <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                                <ToolOption label="Office" onClick={() => handleToolClick("Replace the background with a subtly blurred, modern office environment. The subject should be in sharp focus.", "Applying Office Background...")} preview={<div className="w-full h-full bg-slate-500 blur-sm flex items-center justify-center"><div className="w-1/2 h-1/3 bg-slate-400 rounded-sm"></div></div>} />
                                <ToolOption label="Studio" onClick={() => handleToolClick("Replace the background with a professional photography studio backdrop with a textured gray appearance. The subject should be in sharp focus.", "Applying Studio Background...")} preview={<div className="w-full h-full bg-gray-700 shadow-inner"></div>} />
                                <ToolOption label="Bookshelf" onClick={() => handleToolClick("Replace the background with a well-lit, aesthetically pleasing bookshelf. The books should be softly blurred. The subject should be in sharp focus.", "Applying Bookshelf Background...")} preview={<div className="w-full h-full bg-amber-900/70 flex justify-around p-1 gap-1"><div className="w-1 h-full bg-red-900/70 rounded-sm"></div><div className="w-1 h-full bg-green-900/70 rounded-sm"></div><div className="w-1 h-full bg-blue-900/70 rounded-sm"></div><div className="w-1 h-full bg-yellow-200/70 rounded-sm"></div></div>} />
                                <ToolOption label="Brick Wall" onClick={() => handleToolClick("Replace the background with a stylish, rustic brick wall. The lighting on the wall should match the subject. The subject should be in sharp focus.", "Applying Brick Background...")} preview={<div className="w-full h-full bg-red-900/80 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:12px_6px]"></div>} />
                                <ToolOption label="Wall Art" onClick={() => handleToolClick("Replace the background with a minimalist, modern interior wall featuring a single piece of abstract art. The subject should be in sharp focus.", "Applying Wall Art Background...")} preview={<div className="w-full h-full bg-gray-200 flex items-center justify-center p-2"><div className="w-3/4 h-3/4 bg-gradient-to-br from-cyan-400 to-blue-500"></div></div>} />
                                <ToolOption label="Cafe" onClick={() => handleToolClick("Replace the background with the warm, inviting, and softly blurred interior of a modern coffee shop. The subject should be in sharp focus.", "Applying Cafe Background...")} preview={<div className="w-full h-full bg-amber-800/80 blur-sm"></div>} />
                                <ToolOption label="Wood Panel" onClick={() => handleToolClick("Replace the background with clean, vertical wooden panels. The lighting should be soft and even. The subject should be in sharp focus.", "Applying Wood Background...")} preview={<div className="w-full h-full bg-amber-800 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2)_2px,transparent_2px,transparent_16px)]"></div>} />
                                <ToolOption label="Gradient" onClick={() => handleToolClick("Replace the background with a smooth, professional studio gradient from a medium blue to a light gray. The subject should be in sharp focus.", "Applying Gradient Background...")} preview={<div className="w-full h-full bg-gradient-to-br from-blue-700 to-gray-500"></div>} />
                                <ToolOption label="Ind. Loft" onClick={() => handleToolClick("Replace the background with an industrial loft setting, featuring elements like exposed brick and metal pipes, softly blurred. The subject should be in sharp focus.", "Applying Loft Background...")} preview={<div className="w-full h-full bg-slate-700"></div>} />
                                <ToolOption label="Minimalist" onClick={() => handleToolClick("Replace the background with a clean, minimalist white room with simple, elegant architectural details, softly blurred. The subject should be in sharp focus.", "Applying Minimalist Background...")} preview={<div className="w-full h-full bg-gray-100"></div>} />
                            </div>
                        </div>
                    </AccordionItem>
                    
                    <AccordionItem title="Official Documents" disabled={isFramingMode}>
                         <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2">
                            <ToolOption label="Passport/VISA" onClick={() => handleToolClick("Transform this into a formal headshot suitable for a passport or VISA application. The background must be a solid, uniform off-white. The person's expression should be neutral, with eyes open and mouth closed. Lighting should be even, without shadows on the face or background. Do not crop the image, but ensure the head and shoulders are clearly visible.", "Creating Document Photo...")} preview={<PassportIcon />} />
                         </div>
                    </AccordionItem>

                    <AccordionItem title="Smart Face Refine" disabled={isFramingMode}>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2">
                            <ToolOption label="Smooth Skin" onClick={() => handleToolClick("Subtly smooth the skin while preserving natural texture. Do not alter other facial features.", "Applying Skin Smoothing...")} preview={<SkinIcon />} />
                            <ToolOption label="Brighten Eyes" onClick={() => handleToolClick("Slightly brighten the eyes and enhance their clarity to make them gently pop.", "Brightening Eyes...")} preview={<EyeIcon />} />
                            <ToolOption label="Whiten Teeth" onClick={() => handleToolClick("Gently whiten the teeth to a natural, healthy shade.", "Whitening Teeth...")} preview={<TeethIcon />} />
                            <ToolOption label="Remove Blemish" onClick={() => handleToolClick("Remove minor blemishes, stray hairs, and skin imperfections.", "Removing Blemishes...")} preview={<BlemishIcon />} />
                            <ToolOption label="Refine Hair" onClick={() => handleToolClick("Subtly refine the person's hair to look neater and more styled. Tidy up stray hairs and add a slight, healthy sheen.", "Refining Hair...")} preview={<HairIcon />} />
                        </div>
                    </AccordionItem>
                    
                    <AccordionItem title="Studio Lighting" disabled={isFramingMode}>
                        <KelvinSlider value={kelvinValue} onChange={setKelvinValue} />
                         <div className="p-2 pt-0">
                            <button onClick={handleKelvinApply} className="w-full text-center px-4 py-2 text-sm text-slate-200 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors font-semibold">
                                Apply Temperature
                            </button>
                        </div>
                        <div className="border-t border-slate-700 mx-2 my-4"></div>
                        <h4 className="px-4 pb-2 text-sm font-semibold text-slate-400">Key Light Direction</h4>
                        <LightDirectionKnob angle={lightAngle} setAngle={setLightAngle} />
                        <div className="p-2 pt-0">
                            <button onClick={handleLightDirectionApply} className="w-full text-center px-4 py-2 text-sm text-slate-200 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors font-semibold">
                                Apply Lighting Direction
                            </button>
                        </div>
                         <div className="border-t border-slate-700 mx-2 my-4"></div>
                         <h4 className="px-4 pb-2 text-sm font-semibold text-slate-400">Lighting Styles</h4>
                         <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2 pt-0">
                            <ToolOption label="Rembrandt" onClick={() => handleToolClick("Re-light the subject using Rembrandt lighting. This should create a distinct triangle of light on the cheek that is in shadow. The effect should be dramatic and add depth.", "Applying Rembrandt Light...")} preview={<RembrandtIcon />} />
                            <ToolOption label="Butterfly" onClick={() => handleToolClick("Re-light the subject using Butterfly lighting, also known as Paramount lighting. This should create a symmetrical, butterfly-shaped shadow directly under the nose. The overall effect should be glamorous and flattering.", "Applying Butterfly Light...")} preview={<ButterflyIcon />} />
                            <ToolOption label="Split" onClick={() => handleToolClick("Re-light the subject using Split lighting. Exactly half of the face should be illuminated, while the other half is in shadow, creating a strong line down the center of the face for a very dramatic effect.", "Applying Split Light...")} preview={<SplitIcon />} />
                            <ToolOption label="Loop" onClick={() => handleToolClick("Re-light the subject using Loop lighting. This should create a small 'loop' of shadow from the nose on the cheek. It should be less dramatic than split lighting but more defined than flat lighting.", "Applying Loop Light...")} preview={<LoopIcon />} />
                            <ToolOption label="Rim Light" onClick={() => handleToolClick("Add a strong backlight to create a 'rim' of light around the subject's hair and shoulders. This will help separate them from the background and add a professional, dramatic outline.", "Adding Rim Light...")} preview={<RimIcon />} />
                         </div>
                         <div className="border-t border-slate-700 mx-2 my-4"></div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 pt-0">
                            <button onClick={() => handleToolClick("Make the lighting brighter and more vibrant, as if in a well-lit professional studio.", "Applying Bright Light...")} className="w-full text-left px-4 py-2 text-sm text-slate-300 rounded-md hover:bg-slate-700 transition-colors">Bright & Vibrant</button>
                            <button onClick={() => handleToolClick("Soften the lighting and reduce harsh shadows for a more flattering, gentle appearance.", "Applying Soft Light...")} className="w-full text-left px-4 py-2 text-sm text-slate-300 rounded-md hover:bg-slate-700 transition-colors">Soft & Diffused</button>
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Pose & Expression" disabled={isFramingMode}>
                         <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2">
                            <ToolOption label="Turn Left" onClick={() => handleToolClick("Subtly alter the person's pose. Turn their head slightly to their left (from the viewer's perspective). The change should be minimal and look natural. Do not change their identity, expression, clothing, or the background.", "Adjusting Pose...")} preview={<TurnLeftIcon />} />
                            <ToolOption label="Turn Right" onClick={() => handleToolClick("Subtly alter the person's pose. Turn their head slightly to their right (from the viewer's perspective). The change should be minimal and look natural. Do not change their identity, expression, clothing, or the background.", "Adjusting Pose...")} preview={<TurnRightIcon />} />
                            <ToolOption label="Slight Smile" onClick={() => handleToolClick("Subtly alter the person's expression to a gentle, closed-mouth smile. The change should be minor and look authentic. Do not change their identity, pose, clothing, or the background.", "Adjusting Expression...")} preview={<SmileIcon />} />
                        </div>
                    </AccordionItem>
                    
                    <AccordionItem title="AI Outfit Refine" disabled={isFramingMode}>
                        <div className="space-y-2 p-2">
                            <button onClick={() => handleToolClick("Make minor refinements to the person's clothing. Remove small wrinkles and slightly sharpen fabric details to look neater.", "Refining Outfit...")} className="w-full text-left px-4 py-2 text-sm text-slate-300 rounded-md hover:bg-slate-700 transition-colors">Remove Wrinkles & Sharpen</button>
                        </div>
                    </AccordionItem>
                     <AccordionItem title="Custom Prompt" disabled={isFramingMode}>
                        <div className="p-2 space-y-2">
                            <textarea 
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                className="w-full h-24 p-2 bg-slate-900 border border-slate-600 rounded-md text-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="e.g., 'add subtle eyeglasses', 'make the hair slightly shorter'..."
                            />
                            <button 
                                onClick={() => {
                                    if (customPrompt.trim()) {
                                        handleToolClick(customPrompt, 'Applying custom instructions...');
                                    }
                                }}
                                disabled={!customPrompt.trim()}
                                className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
                            >
                                Apply Custom Prompt
                            </button>
                        </div>
                    </AccordionItem>
                </div>
            )}
            </div>
        </div>
    );
};