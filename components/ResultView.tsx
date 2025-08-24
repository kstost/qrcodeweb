
import React, { useState } from 'react';
import { CopyIcon, LinkIcon, ScanIcon } from './icons';

interface ResultViewProps {
  result: string;
  onRescan: () => void;
}

const isURL = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
};

const ResultView: React.FC<ResultViewProps> = ({ result, onRescan }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.');
    });
  };

  const isLink = isURL(result);

  return (
    <div className="flex flex-col h-full bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-white">Scan Result</h1>
      
      <div className="flex-grow bg-gray-800 rounded-lg p-4 mb-6 relative overflow-hidden">
        <pre className="whitespace-pre-wrap break-words text-gray-300 font-mono text-sm h-full overflow-y-auto">
          {result}
        </pre>
      </div>
      
      <div className="flex flex-col space-y-4">
        {isLink && (
          <a
            href={result}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100"
          >
            <LinkIcon className="w-5 h-5 mr-2" />
            Open Link
          </a>
        )}
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center w-full px-6 py-4 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-100 ${
            copied
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              : 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500'
          } text-white focus:outline-none focus:ring-2 focus:ring-opacity-75`}
        >
          <CopyIcon className="w-5 h-5 mr-2" />
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button
          onClick={onRescan}
          className="flex items-center justify-center w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100"
        >
          <ScanIcon className="w-5 h-5 mr-2" />
          Scan Again
        </button>
      </div>
    </div>
  );
};

export default ResultView;