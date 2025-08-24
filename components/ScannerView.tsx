
import React from 'react';
import { CameraSwitchIcon, TorchOnIcon, TorchOffIcon } from './icons';

interface ScannerViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onSwitchCamera: () => void;
  onToggleTorch: () => void;
  canSwitchCamera: boolean;
  isTorchOn: boolean;
  isTorchSupported: boolean;
}

const ScannerView: React.FC<ScannerViewProps> = ({
  videoRef,
  onSwitchCamera,
  onToggleTorch,
  canSwitchCamera,
  isTorchOn,
  isTorchSupported,
}) => {
  return (
    <div className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        autoPlay
        muted
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/4 max-w-[300px] h-auto aspect-square relative">
          <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-indigo-400 rounded-br-lg"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500/50 animate-scan"></div>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex flex-col space-y-4">
        {canSwitchCamera && (
          <button
            onClick={onSwitchCamera}
            className="p-3 bg-black/50 rounded-full text-white hover:bg-black/75 transition"
            aria-label="Switch camera"
          >
            <CameraSwitchIcon className="w-6 h-6" />
          </button>
        )}
        {isTorchSupported && (
          <button
            onClick={onToggleTorch}
            className="p-3 bg-black/50 rounded-full text-white hover:bg-black/75 transition"
            aria-label="Toggle flash"
          >
            {isTorchOn ? <TorchOnIcon className="w-6 h-6" /> : <TorchOffIcon className="w-6 h-6" />}
          </button>
        )}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white bg-black/50 px-4 py-2 rounded-lg">
        <p>Point your camera at a QR code</p>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-120px); }
          50% { transform: translateY(120px); }
          100% { transform: translateY(-120px); }
        }
        .animate-scan {
          animation: scan 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ScannerView;