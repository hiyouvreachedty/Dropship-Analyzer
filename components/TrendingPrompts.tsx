import React from 'react';
import type { TrendingPrompt } from '../types';
import { getIcon } from './icons';

interface TrendingPromptsProps {
  prompts: TrendingPrompt[];
  onPromptClick: (prompt: string) => void;
  isProcessing: boolean;
}

const MarqueeRow: React.FC<{
  prompts: TrendingPrompt[];
  onPromptClick: (prompt: string) => void;
  isProcessing: boolean;
  direction?: 'left' | 'right';
}> = ({ prompts, onPromptClick, isProcessing, direction = 'left' }) => {
  if (!prompts || prompts.length === 0) {
    return null;
  }
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="overflow-hidden flex">
      <div className={`flex-shrink-0 flex items-center space-x-4 ${animationClass}`}>
        {[...prompts, ...prompts].map((p, index) => (
           <button
              key={`${p.prompt}-${index}`}
              onClick={() => onPromptClick(p.prompt)}
              disabled={isProcessing}
              className="group flex-shrink-0 flex items-center bg-base-200 p-2 pr-5 rounded-full shadow-md hover:bg-base-300/80 hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-base-300"
              aria-label={`Analyze ${p.prompt}`}
            >
              {getIcon(p.icon)}
              <span className="font-semibold text-text-primary whitespace-nowrap">{p.prompt}</span>
            </button>
        ))}
      </div>
    </div>
  );
};


export const TrendingPrompts: React.FC<TrendingPromptsProps> = ({ prompts, onPromptClick, isProcessing }) => {
  if (!prompts.length) {
    return (
        <div className="w-full text-center p-8">
            <div className="animate-pulse text-text-secondary">Loading trending prompts...</div>
        </div>
    );
  }

  const itemsPerRow = Math.ceil(prompts.length / 3);
  const promptRows = Array.from({ length: 3 }, (_, i) => 
      prompts.slice(i * itemsPerRow, (i + 1) * itemsPerRow)
  ).filter(row => row.length > 0);


  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex items-center mb-6">
        <div className="flex-grow border-t border-base-300"></div>
        <span className="flex-shrink mx-4 text-text-secondary">Or try a trending search</span>
        <div className="flex-grow border-t border-base-300"></div>
      </div>
      
      <div className="w-full space-y-4">
        {promptRows.map((row, index) => (
           <MarqueeRow
            key={index}
            prompts={row}
            onPromptClick={onPromptClick}
            isProcessing={isProcessing}
            direction={index % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </div>
  );
};