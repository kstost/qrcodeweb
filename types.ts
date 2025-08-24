
export enum ScannerState {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  SCANNING = 'SCANNING',
  FOUND = 'FOUND',
  ERROR = 'ERROR',
  UNSUPPORTED = 'UNSUPPORTED',
}

export type AppState =
  | { state: ScannerState.IDLE }
  | { state: ScannerState.INITIALIZING }
  | { state: ScannerState.SCANNING }
  | { state: ScannerState.FOUND; result: string }
  | { state: ScannerState.ERROR; error: { title: string; description: string } }
  | { state: ScannerState.UNSUPPORTED };

export interface CameraDevice {
  deviceId: string;
  label: string;
}