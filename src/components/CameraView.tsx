
import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  onCapture: () => void;
}

const CameraView = ({ onCapture }: CameraViewProps) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setError('');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">Camera View</h3>
        <p className="text-purple-200">Position your camera to capture what you want to analyze</p>
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {isActive ? (
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
              <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white rounded-full bg-white/20"></div>
            </div>
            {/* Status indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-green-600/80 backdrop-blur-sm rounded-full px-3 py-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Camera Active</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            {error ? (
              <div className="text-center p-4">
                <CameraOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-300 mb-4">{error}</p>
                <Button
                  onClick={startCamera}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">Initializing camera...</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={onCapture}
          disabled={!isActive}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="w-5 h-5 mr-2" />
          Analyze Image
        </Button>
        
        <Button
          onClick={isActive ? stopCamera : startCamera}
          variant="outline"
          className="border-2 border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-purple-900 font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105"
        >
          {isActive ? <CameraOff className="w-5 h-5 mr-2" /> : <Camera className="w-5 h-5 mr-2" />}
          {isActive ? 'Stop Camera' : 'Start Camera'}
        </Button>
      </div>

      <div className="bg-blue-800/30 backdrop-blur-sm rounded-lg p-4">
        <h4 className="text-blue-300 font-semibold mb-2">Camera Tips:</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• Keep the camera steady for better results</li>
          <li>• Ensure good lighting for clearer detection</li>
          <li>• Position objects within the center frame</li>
          <li>• For text reading, keep text flat and well-lit</li>
        </ul>
      </div>
    </div>
  );
};

export default CameraView;
