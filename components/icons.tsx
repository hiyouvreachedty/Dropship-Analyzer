
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-blue-500 transition-colors ${className}`}>
        {children}
    </div>
);

const SVGIcon: React.FC<{ d: string }> = ({ d }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

const DressIcon = () => <IconWrapper><SVGIcon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" /></IconWrapper>;
const TopIcon = () => <IconWrapper><SVGIcon d="M13 10V3L4 14h7v7l9-11h-7z" /></IconWrapper>;
const PantsIcon = () => <IconWrapper><SVGIcon d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0-6V4a1 1 0 011-1h4a1 1 0 011 1v3m-6 10h6m6 0l-5.447-2.724A1 1 0 0015 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 13v-6m0-6V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3" /></IconWrapper>;
const JacketIcon = () => <IconWrapper><SVGIcon d="M8 17l4 4 4-4m-8-5l4 4 4-4m-8-5l4-4 4 4" /></IconWrapper>;
const ShoesIcon = () => <IconWrapper><SVGIcon d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" /></IconWrapper>;
const AccessoryIcon = () => <IconWrapper><SVGIcon d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></IconWrapper>;
const SkirtIcon = () => <IconWrapper><SVGIcon d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" /></IconWrapper>;
const MiscIcon = () => <IconWrapper><SVGIcon d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.43 2.43 3 3 0 001.128 5.78 2.25 2.25 0 012.43 2.43 3 3 0 005.78-1.128 2.25 2.25 0 012.43-2.43 3 3 0 00-1.128-5.78 2.25 2.25 0 01-2.43-2.43zM11.878 4.122a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.43-2.43 3 3 0 001.128-5.78A2.25 2.25 0 014.57 2.43a3 3 0 005.78 1.128 2.25 2.25 0 012.43 2.43 3 3 0 00-1.128 5.78 2.25 2.25 0 01-2.43 2.43z" /></IconWrapper>;

export const getIcon = (iconName: string): React.ReactElement => {
    switch (iconName?.toLowerCase()) {
        case 'dress': return <DressIcon />;
        case 'top': return <TopIcon />;
        case 'pants': return <PantsIcon />;
        case 'jacket': return <JacketIcon />;
        case 'shoes': return <ShoesIcon />;
        case 'accessory': return <AccessoryIcon />;
        case 'skirt': return <SkirtIcon />;
        default: return <MiscIcon />;
    }
};
