import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (imei: string) => void;
  onClose: () => void;
  onError: (error: string) => void;
}

export function QRScanner({ onScan, onClose, onError }: QRScannerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-scanner-container';

  // Fonction pour gérer les erreurs de manière cohérente
  const handleError = (error: unknown, context: string) => {
    console.error(`Erreur ${context}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
    setError(errorMessage);
    onError(errorMessage);
    setIsLoading(false);
  };

  // Fonction pour vérifier et demander les permissions
  const checkCameraPermissions = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      handleError(error, 'lors de la vérification des permissions');
      return false;
    }
  };

  // Fonction pour initialiser le scanner
  const initializeScanner = async () => {
    try {
      if (!await checkCameraPermissions()) {
        return;
      }

      setHasPermission(true);
      const devices = await Html5Qrcode.getCameras();
      
      if (devices && devices.length > 0) {
        setCameras(devices);
        setSelectedCamera(devices[0].deviceId);
      } else {
        throw new Error('Aucune caméra disponible');
      }
    } catch (error) {
      handleError(error, 'lors de l\'initialisation du scanner');
    }
  };

  // Fonction pour démarrer le scanner
  const startScanner = async (cameraId: string) => {
    try {
      // Arrêter le scanner existant si nécessaire
      if (scannerRef.current) {
        await scannerRef.current.stop();
      }

      // Créer une nouvelle instance du scanner
      const scanner = new Html5Qrcode(scannerContainerId, {
        verbose: false,
        formatsToSupport: ['QR_CODE']
      });
      
      scannerRef.current = scanner;

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText: string) => {
          const imeiRegex = /^\d{15}$/;
          if (imeiRegex.test(decodedText)) {
            onScan(decodedText);
            scanner.stop().catch(console.error);
            onClose();
          } else {
            setError('QR Code invalide. L\'IMEI doit contenir exactement 15 chiffres.');
          }
        },
        (errorMessage: string) => {
          // Ignorer les erreurs de scan silencieuses
          if (errorMessage.includes('No QR code found')) {
            return;
          }
          console.debug('Scan en cours...', errorMessage);
        }
      );

      setIsLoading(false);
      setError(null);
    } catch (error) {
      handleError(error, 'lors du démarrage du scanner');
    }
  };

  // Effet pour l'initialisation
  useEffect(() => {
    initializeScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Effet pour démarrer le scanner quand une caméra est sélectionnée
  useEffect(() => {
    if (selectedCamera && hasPermission) {
      startScanner(selectedCamera);
    }
  }, [selectedCamera, hasPermission]);

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    setIsLoading(true);
    setError(null);
  };

  const handleRequestPermission = async () => {
    const hasPermission = await checkCameraPermissions();
    if (hasPermission) {
      setHasPermission(true);
      initializeScanner();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-[600px] w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scanner le QR Code</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cameras.length > 1 && (
          <div className="mb-4">
            <select
              value={selectedCamera || ''}
              onChange={(e) => handleCameraChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Caméra ${camera.deviceId}`}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              {!hasPermission && (
                <button
                  onClick={handleRequestPermission}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Autoriser l'accès à la caméra
                </button>
              )}
            </div>
          ) : (
            <div className="scanner-container">
              <div 
                id={scannerContainerId} 
                className="w-full h-[400px] bg-black rounded-lg overflow-hidden"
              />
              <p className="text-sm text-gray-500 mt-4 text-center">
                Placez le QR Code contenant l'IMEI dans le cadre pour le scanner
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}