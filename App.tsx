
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScannerState, type AppState, type CameraDevice } from './types';
import IdleView from './components/IdleView';
import ScannerView from './components/ScannerView';
import ResultView from './components/ResultView';
import ErrorView from './components/ErrorView';
import UnsupportedView from './components/UnsupportedView';

// BarcodeDetector is not in standard TS libs yet, so we declare it.
declare global {
  interface Window {
    BarcodeDetector: any;
  }
  const BarcodeDetector: any;

  // Extending MediaStreamTrack capabilities and constraints for torch support
  interface MediaTrackCapabilities {
    torch?: boolean;
  }

  interface MediaTrackConstraintSet {
    torch?: ConstrainBoolean;
  }
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ state: ScannerState.IDLE });
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const stopScan = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
    setTorchSupported(false);
  }, []);

  const handleError = (title: string, description: string) => {
    stopScan();
    setAppState({ state: ScannerState.ERROR, error: { title, description } });
  };

  const startScan = useCallback(async (deviceId?: string) => {
    stopScan();
    setAppState({ state: ScannerState.INITIALIZING });

    if (!('BarcodeDetector' in window)) {
      setAppState({ state: ScannerState.UNSUPPORTED });
      return;
    }
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: deviceId ? undefined : { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      streamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play();
      }
      
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      setTorchSupported(!!capabilities.torch);

      // Populate camera list on first scan
      if (cameras.length === 0) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setCameras(videoDevices.map(d => ({ deviceId: d.deviceId, label: d.label })));
      }

      detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
      setAppState({ state: ScannerState.SCANNING });

      const detect = async () => {
        if (videoRef.current && detectorRef.current && videoRef.current.readyState >= 2) {
            const barcodes = await detectorRef.current.detect(videoRef.current);
            if (barcodes.length > 0) {
              const result = barcodes[0].rawValue;
              stopScan();
              setAppState({ state: ScannerState.FOUND, result });
              navigator.vibrate?.(200);
            }
        }
        if (streamRef.current) { // Only continue loop if stream is active
          animationFrameId.current = requestAnimationFrame(detect);
        }
      };
      detect();

    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        handleError('Permission Denied', 'Camera access was denied. Please allow camera access in your browser settings to continue.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        handleError('No Camera Found', 'Could not find a camera on your device.');
      } else {
        handleError('Camera Error', `An unexpected error occurred: ${err.message}`);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopScan, cameras.length]);

  const switchCamera = () => {
    if (cameras.length > 1) {
      const nextIndex = (activeCameraIndex + 1) % cameras.length;
      setActiveCameraIndex(nextIndex);
      startScan(cameras[nextIndex].deviceId);
    }
  };

  const toggleTorch = async () => {
    if (streamRef.current && torchSupported) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      try {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !torchOn }]
        });
        setTorchOn(!torchOn);
      } catch (err) {
        console.error('Failed to toggle torch:', err);
      }
    }
  };

  const reset = () => {
    stopScan();
    setAppState({ state: ScannerState.IDLE });
  };
  
  useEffect(() => {
    return () => stopScan(); // Cleanup on unmount
  }, [stopScan]);

  const renderContent = () => {
    switch (appState.state) {
      case ScannerState.IDLE:
        return <IdleView onStartScan={() => startScan()} />;
      case ScannerState.INITIALIZING:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-gray-900">
            <h1 className="text-2xl font-bold mb-4">Starting Camera...</h1>
            <p className="text-gray-400">Please allow camera permission if prompted.</p>
          </div>
        );
      case ScannerState.SCANNING:
        return (
          <ScannerView
            videoRef={videoRef}
            onSwitchCamera={switchCamera}
            onToggleTorch={toggleTorch}
            canSwitchCamera={cameras.length > 1}
            isTorchOn={torchOn}
            isTorchSupported={torchSupported}
          />
        );
      case ScannerState.FOUND:
        return <ResultView result={appState.result} onRescan={reset} />;
      case ScannerState.ERROR:
        return <ErrorView error={appState.error} onRetry={reset} />;
      case ScannerState.UNSUPPORTED:
        return <UnsupportedView />;
      default:
        return <IdleView onStartScan={() => startScan()} />;
    }
  };

  return <div className="h-full w-full max-w-lg mx-auto bg-black">{renderContent()}</div>;
};

export default App;