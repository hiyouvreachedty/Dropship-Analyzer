
import React from 'react';
import type { AppState } from '../types';

interface LoadingIndicatorProps {
  state: AppState;
}

const Spinner: React.FC = () => (
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
);

const getLoadingMessage = (state: AppState): string => {
  switch (state) {
    case 'identifying':
      return 'Analyzing image with AI...';
    case 'sourcing':
      return 'Searching for sourcing options...';
    case 'pricing':
      return 'Calculating profit potential...';
    default:
      return 'Processing...';
  }
};

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ state }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <Spinner />
      <p className="text-xl font-semibold text-text-secondary animate-pulse">{getLoadingMessage(state)}</p>
    </div>
  );
};
