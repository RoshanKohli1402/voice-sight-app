
import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  onCapture: () => void;
}

const CameraView = ({ onCapture }: CameraViewProps) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [initStep, setInitStep] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    checkCameraSupport();
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const checkCameraSupport = () => {
    console.log('🔍 Checking camera support...');
    console.log('Navigator.mediaDevices available:', !!navigator.mediaDevices);
    console.log('getUserMedia available:', !!navigator.mediaDevices?.getUserMedia);
    console.log('User agent:', navigator.userAgent);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not supported in this browser. Please use Chrome, Firefox, or Safari.');
      return false;
    }
    return true;
  };

  const checkPermissions = async (): Promise<boolean> => {
    console.log('📋 Checking camera permissions...');
    setInitStep('Checking permissions...');
    
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log('Permission state:', permission.state);
        setPermissionState(permission.state as 'granted' | 'denied');
        
        if (permission.state === 'denied') {
          setError('Camera access denied. Please enable camera permissions in your browser settings and reload the page.');
          return false;
        }
      }
      return true;
    } catch (err) {
      console.log('Permission check failed, will try direct access:', err);
      return true; // Continue with direct access attempt
    }
  };

  const startCamera = async () => {
    console.log('🎬 Starting camera initialization...');
    setIsLoading(true);
    setError('');
    setInitStep('Initializing...');
    
    if (!checkCameraSupport()) {
      setIsLoading(false);
      return;
    }

    const permissionOk = await checkPermissions();
    if (!permissionOk) {
      setIsLoading(false);
      return;
    }

    // Try multiple camera configurations
    const cameraConfigs = [
      // Configuration 1: Ideal settings
      {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      },
      // Configuration 2: Simplified settings
      {
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      },
      // Configuration 3: Basic settings
      {
        video: { facingMode: 'environment' },
        audio: false
      },
      // Configuration 4: Most basic
      {
        video: true,
        audio: false
      }
    ];

    for (let i = 0; i < cameraConfigs.length; i++) {
      try {
        console.log(`📹 Attempting camera config ${i + 1}:`, cameraConfigs[i]);
        setInitStep(`Trying camera configuration ${i + 1}...`);
        
        const stream = await navigator.mediaDevices.getUserMedia(cameraConfigs[i]);
        
        console.log('✅ Camera access successful!');
        console.log('Stream tracks:', stream.getTracks().map(track => ({
          kind: track.kind,
          label: track.label,
          enabled: track.enabled,
          readyState: track.readyState
        })));
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          setInitStep('Connecting to video element...');
          videoRef.current.srcObject = stream;
          
          try {
            await videoRef.current.play();
            console.log('✅ Video playback started');
            setIsActive(true);
            setError('');
            setPermissionState('granted');
            setInitStep('');
          } catch (playError) {
            console.error('❌ Video play error:', playError);
            throw new Error('Failed to start video playback');
          }
        }
        
        setIsLoading(false);
        return; // Success, exit the loop
        
      } catch (err) {
        console.error(`❌ Camera config ${i + 1} failed:`, err);
        
        if (i === cameraConfigs.length - 1) {
          // Last attempt failed
          let errorMessage = 'Unable to access camera. ';
          
          if (err instanceof Error) {
            console.log('Error details:', {
              name: err.name,
              message: err.message
            });
            
            switch (err.name) {
              case 'NotAllowedError':
                errorMessage += 'Please allow camera permissions and try again. Check your browser settings if needed.';
                setPermissionState('denied');
                break;
              case 'NotFoundError':
                errorMessage += 'No camera found on this device.';
                break;
              case 'NotReadableError':
                errorMessage += 'Camera is being used by another application. Please close other apps using the camera.';
                break;
              case 'OverconstrainedError':
              case 'ConstraintNotSatisfiedError':
                errorMessage += 'Camera configuration not supported. Please try with a different device.';
                break;
              case 'AbortError':
                errorMessage += 'Camera access was interrupted. Please try again.';
                break;
              case 'SecurityError':
                errorMessage += 'Camera access blocked for security reasons. Please ensure you\'re using HTTPS.';
                break;
              default:
                errorMessage += `${err.message}. Please check your camera settings and try again.`;
            }
          }
          
          setError(errorMessage);
          setIsActive(false);
        }
      }
    }
    
    setIsLoading(false);
  };

  const stopCamera = () => {
    console.log('🛑 Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`🛑 Camera track stopped: ${track.kind}`);
      });
      streamRef.current = null;
    }
    setIsActive(false);
    setInitStep('');
  };

  const restartCamera = () => {
    console.log('🔄 Restarting camera...');
    stopCamera();
    setTimeout(startCamera, 500);
  };

  const requestPermissions = async () => {
    console.log('🔐 Manually requesting camera permissions...');
    try {
      // Try to get a minimal stream to trigger permission dialog
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Permission granted via manual request');
      setPermissionState('granted');
      startCamera();
    } catch (err) {
      console.error('❌ Manual permission request failed:', err);
      setPermissionState('denied');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Camera View</h3>
        <p className="text-blue-200 font-medium text-lg">Position your camera to capture what you want to analyze</p>
      </div>

      <div className="relative bg-black rounded-xl overflow-hidden border-2 border-blue-400/50" style={{ aspectRatio: '16/9' }}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-white font-bold text-lg">Starting camera...</p>
              {initStep && (
                <p className="text-blue-300 text-sm mt-2">{initStep}</p>
              )}
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
              <div className="absolute inset-4 border-4 border-blue-400/70 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-4 border-white rounded-full bg-white/30"></div>
              
              {/* Corner guides */}
              <div className="absolute top-8 left-8 w-6 h-6 border-l-4 border-t-4 border-blue-400"></div>
              <div className="absolute top-8 right-8 w-6 h-6 border-r-4 border-t-4 border-blue-400"></div>
              <div className="absolute bottom-8 left-8 w-6 h-6 border-l-4 border-b-4 border-blue-400"></div>
              <div className="absolute bottom-8 right-8 w-6 h-6 border-r-4 border-b-4 border-blue-400"></div>
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
              <div className="text-center p-6 max-w-md">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-300 mb-6 text-base font-medium leading-relaxed">{error}</p>
                <div className="space-y-3">
                  <Button
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-blue-400 w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  {permissionState === 'denied' && (
                    <Button
                      onClick={requestPermissions}
                      variant="outline"
                      className="border-2 border-orange-400 text-orange-300 hover:bg-orange-400 hover:text-black w-full"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Request Permissions
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-white font-bold text-lg">Initializing camera...</p>
                {initStep && (
                  <p className="text-blue-300 text-sm mt-2">{initStep}</p>
                )}
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
          className="border-2 border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-black font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 text-lg"
        >
          {isActive ? <CameraOff className="w-5 h-5 mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
          {isActive ? 'Stop Camera' : 'Restart Camera'}
        </Button>
      </div>

      <div className="bg-blue-900/50 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-400/50">
        <h4 className="text-blue-200 font-bold mb-3 text-lg">Camera Tips:</h4>
        <ul className="text-white text-base space-y-2 font-medium">
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            Allow camera permissions when prompted
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            Ensure good lighting for clearer detection
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            Position objects within the center frame
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            For currency, place note flat and well-lit
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            Close other apps that might be using the camera
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CameraView;
