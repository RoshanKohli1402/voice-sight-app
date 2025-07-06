
import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  onCapture: () => void;
}

const CameraView = ({ onCapture }: CameraViewProps) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      });
      
      console.log('Camera access granted');
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
        setError('');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = 'Unable to access camera. ';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera permissions and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (err.name === 'NotReadableError') {
          errorMessage += 'Camera is being used by another application.';
        } else {
          errorMessage += 'Please check your camera settings and try again.';
        }
      }
      
      setError(errorMessage);
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped');
      });
      streamRef.current = null;
    }
    setIsActive(false);
  };

  const restartCamera = () => {
    stopCamera();
    setTimeout(startCamera, 500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Camera View</h3>
        <p className="text-yellow-200 font-medium text-lg">Position your camera to capture what you want to analyze</p>
      </div>

      <div className="relative bg-black rounded-xl overflow-hidden border-2 border-yellow-400/50" style={{ aspectRatio: '16/9' }}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-spin" />
              <p className="text-white font-bold text-lg">Starting camera...</p>
            </div>
          </div>
        ) : isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Camera overlay guides */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border-4 border-yellow-400/70 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-4 border-white rounded-full bg-white/30"></div>
              
              {/* Corner guides */}
              <div className="absolute top-8 left-8 w-6 h-6 border-l-4 border-t-4 border-yellow-400"></div>
              <div className="absolute top-8 right-8 w-6 h-6 border-r-4 border-t-4 border-yellow-400"></div>
              <div className="absolute bottom-8 left-8 w-6 h-6 border-l-4 border-b-4 border-yellow-400"></div>
              <div className="absolute bottom-8 right-8 w-6 h-6 border-r-4 border-b-4 border-yellow-400"></div>
            </div>
            {/* Status indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-green-600/90 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-bold">Camera Active</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            {error ? (
              <div className="text-center p-6">
                <CameraOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-300 mb-6 text-lg font-medium leading-relaxed max-w-md">{error}</p>
                <Button
                  onClick={startCamera}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-blue-400"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-white font-bold text-lg">Initializing camera...</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={onCapture}
          disabled={!isActive}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-green-400 text-lg"
        >
          <Camera className="w-5 h-5 mr-2" />
          Analyze Image
        </Button>
        
        <Button
          onClick={isActive ? stopCamera : restartCamera}
          variant="outline"
          className="border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 text-lg"
        >
          {isActive ? <CameraOff className="w-5 h-5 mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
          {isActive ? 'Stop Camera' : 'Restart Camera'}
        </Button>
      </div>

      <div className="bg-blue-900/50 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-400/50">
        <h4 className="text-blue-200 font-bold mb-3 text-lg">Camera Tips:</h4>
        <ul className="text-white text-base space-y-2 font-medium">
          <li className="flex items-start">
            <span className="text-yellow-400 mr-2">•</span>
            Keep the camera steady for better results
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-2">•</span>
            Ensure good lighting for clearer detection
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-2">•</span>
            Position objects within the center frame
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-2">•</span>
            For currency, place note flat and well-lit
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CameraView;
