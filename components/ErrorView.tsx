
import React from 'react';
import { WarningIcon } from './icons';

interface ErrorViewProps {
  error: { title: string; description: string };
  onRetry: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
          <WarningIcon className="w-12 h-12 text-red-500" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-red-400 mb-2">{error.title}</h1>
      <p className="text-gray-400 mb-8 max-w-sm">{error.description}</p>
      <button
        onClick={onRetry}
        className="w-full max-w-xs px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorView;