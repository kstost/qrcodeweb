
import React from 'react';
import { WarningIcon } from './icons';

const UnsupportedView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900">
       <div className="mb-6">
        <div className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
          <WarningIcon className="w-12 h-12 text-yellow-500" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Browser Not Supported</h1>
      <p className="text-gray-400 max-w-sm">
        Unfortunately, your browser does not support the technology required for real-time QR code scanning.
        Please try using a modern browser like Google Chrome on Android for the best experience.
      </p>
    </div>
  );
};

export default UnsupportedView;