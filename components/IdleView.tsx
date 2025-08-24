
import React from 'react';
import { ScanIcon } from './icons';

interface IdleViewProps {
  onStartScan: () => void;
}

const IdleView: React.FC<IdleViewProps> = ({ onStartScan }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900">
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
           <ScanIcon className="w-20 h-20 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-white">QR Code Scanner</h1>
      <p className="text-gray-400 mb-8 max-w-xs">
        Scan QR codes instantly using your device's camera. No app installation required.
      </p>
      <button
        onClick={onStartScan}
        className="w-full max-w-xs px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100"
      >
        Start Scanning
      </button>
    </div>
  );
};

export default IdleView;