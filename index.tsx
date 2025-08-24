"use strict";

(() => {
  type AppState =
    | { state: 'IDLE' }
    | { state: 'INITIALIZING' }
    | { state: 'SCANNING' }
    | { state: 'FOUND'; result: string }
    | { state: 'ERROR'; error: { title: string; description: string } }
    | { state: 'UNSUPPORTED' };

  // From types.ts
  const ScannerState = {
    IDLE: 'IDLE',
    INITIALIZING: 'INITIALIZING',
    SCANNING: 'SCANNING',
    FOUND: 'FOUND',
    ERROR: 'ERROR',
    UNSUPPORTED: 'UNSUPPORTED',
  };

  // From components/icons/index.tsx
  const ScanIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 4.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25-2.25h-13.5a2.25 2.25 0 01-2.25-2.25V4.5zM9.75 6.75h4.5v4.5h-4.5v-4.5zm0 6.75h4.5v4.5h-4.5v-4.5zM6 6.75h1.5v1.5H6v-1.5zm0 3.75h1.5v1.5H6v-1.5zm0 3.75h1.5v1.5H6v-1.5zm10.5-3.75h1.5v1.5h-1.5v-1.5zm0 3.75h1.5v1.5h-1.5v-1.5zm0-7.5h1.5v1.5h-1.5v-1.5z" })
  );
  const CameraSwitchIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 00-2.25-2.25h-4.5a2.25 2.25 0 00-2.25 2.25v4.992m11.667 0l-3.181 3.183a8.25 8.25 0 01-11.667 0l-3.181-3.183" })
  );
  const TorchOnIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" })
  );
  const TorchOffIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12.983 12.723L12 13.5H3.75l1.04-1.04M9.75 21.75L12 13.5m0 0l.983-.777M12 13.5L11.017 14.277M12 10.5H20.25L13.5 2.25 10.75 9.375" }),
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 3l18 18" })
  );
  const CopyIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5m-9 3c0 3.314 2.686 6 6 6h3c3.314 0 6-2.686 6-6v-2.892c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.125 0c-1.131.094-1.976 1.057-1.976 2.192V10.5M4.5 10.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v3z" })
  );
  const LinkIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" })
  );
  const WarningIcon = (props) => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" })
  );

  // From components/IdleView.tsx
  const IdleView = ({ onStartScan }) => {
    return React.createElement("div", { className: "flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900" },
      React.createElement("div", { className: "mb-8" },
        React.createElement("div", { className: "w-32 h-32 mx-auto bg-indigo-500 rounded-full flex items-center justify-center shadow-lg" },
          React.createElement(ScanIcon, { className: "w-20 h-20 text-white" })
        )
      ),
      React.createElement("h1", { className: "text-3xl font-bold mb-2 text-white" }, "QR Code Scanner"),
      React.createElement("p", { className: "text-gray-400 mb-8 max-w-xs" }, "Scan QR codes instantly using your device's camera. No app installation required."),
      React.createElement("button", {
        onClick: onStartScan,
        className: "w-full max-w-xs px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100"
      }, "Start Scanning")
    );
  };

  // From components/ScannerView.tsx
  const ScannerView = ({ videoRef, onSwitchCamera, onToggleTorch, canSwitchCamera, isTorchOn, isTorchSupported }) => {
    return React.createElement("div", { className: "relative h-full w-full bg-black" },
      React.createElement("video", { ref: videoRef, className: "h-full w-full object-cover", playsInline: true, autoPlay: true, muted: true }),
      React.createElement("div", { className: "absolute inset-0 flex items-center justify-center" },
        React.createElement("div", { className: "w-3/4 max-w-[300px] h-auto aspect-square relative" },
          React.createElement("div", { className: "absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" }),
          React.createElement("div", { className: "absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" }),
          React.createElement("div", { className: "absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" }),
          React.createElement("div", { className: "absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" }),
          React.createElement("div", { className: "absolute top-1/2 left-0 w-full h-1 bg-red-500/50 animate-scan" })
        )
      ),
      React.createElement("div", { className: "absolute top-4 right-4 flex flex-col space-y-4" },
        canSwitchCamera && React.createElement("button", { onClick: onSwitchCamera, className: "p-3 bg-black/50 rounded-full text-white hover:bg-black/75 transition", "aria-label": "Switch camera" },
          React.createElement(CameraSwitchIcon, { className: "w-6 h-6" })
        ),
        isTorchSupported && React.createElement("button", { onClick: onToggleTorch, className: "p-3 bg-black/50 rounded-full text-white hover:bg-black/75 transition", "aria-label": "Toggle flash" },
          isTorchOn ? React.createElement(TorchOnIcon, { className: "w-6 h-6" }) : React.createElement(TorchOffIcon, { className: "w-6 h-6" })
        )
      ),
      React.createElement("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white bg-black/50 px-4 py-2 rounded-lg" },
        React.createElement("p", null, "Point your camera at a QR code")
      ),
      React.createElement("style", null, `
        @keyframes scan {
          0% { transform: translateY(-120px); }
          50% { transform: translateY(120px); }
          100% { transform: translateY(-120px); }
        }
        .animate-scan {
          animation: scan 3s infinite ease-in-out;
        }
      `)
    );
  };

  // From components/ResultView.tsx
  const ResultView = ({ result, onRescan }) => {
    const [copied, setCopied] = React.useState(false);
    const isURL = (text) => {
      try {
        new URL(text);
        return true;
      } catch (_) {
        return false;
      }
    };

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

    return React.createElement("div", { className: "flex flex-col h-full bg-gray-900 p-6" },
      React.createElement("h1", { className: "text-2xl font-bold mb-4 text-center text-white" }, "Scan Result"),
      React.createElement("div", { className: "flex-grow bg-gray-800 rounded-lg p-4 mb-6 relative overflow-hidden" },
        React.createElement("pre", { className: "whitespace-pre-wrap break-words text-gray-300 font-mono text-sm h-full overflow-y-auto" }, result)
      ),
      React.createElement("div", { className: "flex flex-col space-y-4" },
        isLink && React.createElement("a", { href: result, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100" },
          React.createElement(LinkIcon, { className: "w-5 h-5 mr-2" }), "Open Link"
        ),
        React.createElement("button", { onClick: handleCopy, className: `flex items-center justify-center w-full px-6 py-4 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-100 ${copied ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500'} text-white focus:outline-none focus:ring-2 focus:ring-opacity-75` },
          React.createElement(CopyIcon, { className: "w-5 h-5 mr-2" }),
          copied ? 'Copied!' : 'Copy to Clipboard'
        ),
        React.createElement("button", { onClick: onRescan, className: "flex items-center justify-center w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100" },
          React.createElement(ScanIcon, { className: "w-5 h-5 mr-2" }), "Scan Again"
        )
      )
    );
  };

  // From components/ErrorView.tsx
  const ErrorView = ({ error, onRetry }) => {
    return React.createElement("div", { className: "flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900" },
      React.createElement("div", { className: "mb-6" },
        React.createElement("div", { className: "w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center" },
          React.createElement(WarningIcon, { className: "w-12 h-12 text-red-500" })
        )
      ),
      React.createElement("h1", { className: "text-2xl font-bold text-red-400 mb-2" }, error.title),
      React.createElement("p", { className: "text-gray-400 mb-8 max-w-sm" }, error.description),
      React.createElement("button", { onClick: onRetry, className: "w-full max-w-xs px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100" }, "Try Again")
    );
  };

  // From components/UnsupportedView.tsx
  const UnsupportedView = () => {
    return React.createElement("div", { className: "flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900" },
      React.createElement("div", { className: "mb-6" },
        React.createElement("div", { className: "w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center" },
          React.createElement(WarningIcon, { className: "w-12 h-12 text-yellow-500" })
        )
      ),
      React.createElement("h1", { className: "text-2xl font-bold text-yellow-400 mb-2" }, "Browser Not Supported"),
      React.createElement("p", { className: "text-gray-400 max-w-sm" }, "Unfortunately, your browser does not support the technology required for real-time QR code scanning. Please try using a modern browser like Google Chrome on Android for the best experience.")
    );
  };

  // From App.tsx
  const App = () => {
    const [appState, setAppState] = React.useState<AppState>({ state: ScannerState.IDLE });
    const [cameras, setCameras] = React.useState([]);
    const [activeCameraIndex, setActiveCameraIndex] = React.useState(0);
    const [torchSupported, setTorchSupported] = React.useState(false);
    const [torchOn, setTorchOn] = React.useState(false);

    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);
    const detectorRef = React.useRef(null);
    const animationFrameId = React.useRef(null);

    const stopScan = React.useCallback(() => {
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

    const handleError = (title, description) => {
      stopScan();
      setAppState({ state: ScannerState.ERROR, error: { title, description } });
    };

    const startScan = React.useCallback(async (deviceId?: string) => {
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

        const constraints = {
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
          if (streamRef.current) {
            animationFrameId.current = requestAnimationFrame(detect);
          }
        };
        detect();

      } catch (err) {
        if (err.name === 'NotAllowedError') {
          handleError('Permission Denied', 'Camera access was denied. Please allow camera access in your browser settings to continue.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          handleError('No Camera Found', 'Could not find a camera on your device.');
        } else {
          handleError('Camera Error', `An unexpected error occurred: ${err.message}`);
        }
      }
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

    React.useEffect(() => {
      return () => stopScan();
    }, [stopScan]);

    const renderContent = () => {
      switch (appState.state) {
        case ScannerState.IDLE:
          return React.createElement(IdleView, { onStartScan: () => startScan() });
        case ScannerState.INITIALIZING:
          return React.createElement("div", { className: "flex flex-col items-center justify-center h-full text-center p-4 bg-gray-900" },
            React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Starting Camera..."),
            React.createElement("p", { className: "text-gray-400" }, "Please allow camera permission if prompted.")
          );
        case ScannerState.SCANNING:
          return React.createElement(ScannerView, {
            videoRef: videoRef,
            onSwitchCamera: switchCamera,
            onToggleTorch: toggleTorch,
            canSwitchCamera: cameras.length > 1,
            isTorchOn: torchOn,
            isTorchSupported: torchSupported,
          });
        case ScannerState.FOUND:
          return React.createElement(ResultView, { result: appState.result, onRescan: reset });
        case ScannerState.ERROR:
          return React.createElement(ErrorView, { error: appState.error, onRetry: reset });
        case ScannerState.UNSUPPORTED:
          return React.createElement(UnsupportedView, null);
        default:
          return React.createElement(IdleView, { onStartScan: () => startScan() });
      }
    };

    return React.createElement("div", { className: "h-full w-full max-w-lg mx-auto bg-black" }, renderContent());
  };

  // From index.tsx (entry point)
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = (ReactDOM as any).createRoot(rootElement);
  root.render(
    React.createElement(React.StrictMode, null, React.createElement(App))
  );

})();
