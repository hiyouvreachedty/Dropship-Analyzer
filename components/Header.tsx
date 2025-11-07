
import React from 'react';

const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M19 3v4M17 5h4M12 21v-4M10 19h4M5 19v-4M3 17h4M19 19v-4M17 17h4M12 3v4M10 5h4" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10 border-b border-base-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <SparklesIcon />
                        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                            DropShip <span className="text-brand-primary">Analyzer</span>
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};
