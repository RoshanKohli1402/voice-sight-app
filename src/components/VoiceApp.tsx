
import { useState, useEffect, useRef } from 'react';
import { Mic, Camera, Volume2, Eye, DollarSign, FileText, Scan, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CameraView from './CameraView';

type AppMode = 'home' | 'object' | 'currency' | 'text' | 'scene';
type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

const VoiceApp = () => {
  const [mode, setMode] = useState<AppMode>('home');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [result, setResult] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;
    
    // Initialize speech recognition with better error handling
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('🎤 Speech recognition started');
        setVoiceState('listening');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        console.log('🗣️ Speech recognized:', transcriptText);
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          handleVoiceCommand(transcriptText.toLowerCase().trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceState('idle');
        
        // Provide user feedback for common errors
        if (event.error === 'not-allowed') {
          speak("Microphone permission denied. Please allow microphone access and try again.");
        } else if (event.error === 'no-speech') {
          speak("No speech detected. Please try speaking again.");
        }
      };

      recognitionRef.current.onend = () => {
        console.log('🛑 Speech recognition ended');
        setIsListening(false);
        setVoiceState('idle');
      };
    } else {
      console.error('❌ Speech recognition not supported');
      speak("Speech recognition is not supported in this browser. Please use Chrome, Firefox, or Safari.");
    }

    // Welcome message on app start
    setTimeout(() => {
      speak("Welcome to AI Vision Assistant. What would you like me to help you with? You can say detect object, read currency, read text, or describe scene.");
    }, 1000);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (synthRef.current) {
      console.log('Speaking:', text);
      setVoiceState('speaking');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setVoiceState('idle');
        // Automatically start listening after speaking
        setTimeout(startListening, 500);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      console.log('Starting to listen...');
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log('Stopping listening...');
      recognitionRef.current.stop();
    }
  };

  const handleVoiceCommand = (command: string) => {
    console.log('🎯 Processing command:', command);
    setLastCommand(command);
    setVoiceState('processing');
    
    // Enhanced voice command processing with better camera integration
    if (command.includes('detect object') || command.includes('identify object') || command.includes('object detection')) {
      console.log('📱 Switching to object detection mode');
      setMode('object');
      setShowCamera(true);
      speak("Opening camera for object detection. Please point your camera at the object you want to identify and make sure to allow camera permissions.");
    } else if (command.includes('currency') || command.includes('money') || command.includes('note') || command.includes('bill')) {
      console.log('💰 Switching to currency detection mode');
      setMode('currency');
      setShowCamera(true);
      speak("Opening camera for currency detection. Please place the currency note in front of the camera, ensure good lighting, and allow camera permissions if prompted.");
    } else if (command.includes('read text') || command.includes('text') || command.includes('reading')) {
      console.log('📖 Switching to text reading mode');
      setMode('text');
      setShowCamera(true);
      speak("Opening camera for text reading. Please point your camera at the text you want me to read and ensure camera permissions are allowed.");
    } else if (command.includes('describe scene') || command.includes('scene') || command.includes('surroundings')) {
      console.log('🌍 Switching to scene description mode');
      setMode('scene');
      setShowCamera(true);
      speak("Opening camera for scene description. I will describe what I can see around you once camera permissions are granted.");
    } else if (command.includes('go back') || command.includes('home') || command.includes('main menu')) {
      console.log('🏠 Going back to home');
      setMode('home');
      setShowCamera(false);
      setResult('');
      speak("Going back to main menu. What would you like me to help you with?");
    } else if (command.includes('help') || command.includes('what can you do')) {
      speak("I can help you with four things: detect objects, read currency notes, read printed text, and describe scenes. Just say what you need help with.");
    } else if (command.includes('camera') && command.includes('not working')) {
      speak("If the camera isn't working, please make sure to allow camera permissions in your browser, close other apps that might be using the camera, and try again.");
    } else {
      speak("I didn't understand that command. You can say detect object, read currency, read text, describe scene, or say help for more options.");
    }
  };

  const simulateAIProcessing = () => {
    console.log('🤖 Starting AI processing for mode:', mode);
    setVoiceState('processing');
    setResult('Processing...');
    
    setTimeout(() => {
      let aiResult = '';
      
      switch (mode) {
        case 'object':
          aiResult = "I can see a smartphone in your hand. It appears to be a black rectangular device with a screen and appears to be in good condition.";
          break;
        case 'currency':
          aiResult = "I detected a 100 rupee note. This is a one hundred rupee Indian currency note with Gandhi's image and security features visible.";
          break;
        case 'text':
          aiResult = "The text reads: Welcome to our store. We are open Monday through Saturday from 9 AM to 8 PM. Thank you for visiting us today.";
          break;
        case 'scene':
          aiResult = "I can see you're in an indoor environment with good lighting. There appears to be a table or surface in front of you, and I can see some objects nearby. The lighting seems to be coming from natural sources.";
          break;
        default:
          aiResult = "Processing complete. Please try again with a clear view of what you want me to analyze.";
      }
      
      console.log('✅ AI Result generated:', aiResult);
      setResult(aiResult);
      speak(aiResult + " Would you like me to try again or help you with something else?");
    }, 3000);
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'object': return Eye;
      case 'currency': return DollarSign;
      case 'text': return FileText;
      case 'scene': return Scan;
      default: return Mic;
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'object': return 'Object Detection';
      case 'currency': return 'Currency Reader';
      case 'text': return 'Text Reader';
      case 'scene': return 'Scene Detection';
      default: return 'AI Vision Assistant';
    }
  };

  const IconComponent = getModeIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <IconComponent className={`w-16 h-16 text-blue-400 transition-all duration-1000 ${voiceState === 'listening' ? 'scale-110 text-blue-300' : 'scale-100'}`} />
              {voiceState === 'listening' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[...Array(3)].map((_, ring) => (
                    <div
                      key={ring}
                      className="absolute rounded-full border-2 border-blue-400 animate-ping opacity-75"
                      style={{
                        width: `${80 + ring * 20}px`,
                        height: `${80 + ring * 20}px`,
                        animationDelay: `${ring * 0.3}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
            {getModeTitle()}
          </h1>
          
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm ${
              voiceState === 'listening' ? 'bg-green-500/30 border-2 border-green-400' :
              voiceState === 'processing' ? 'bg-orange-500/30 border-2 border-orange-400' :
              voiceState === 'speaking' ? 'bg-blue-500/30 border-2 border-blue-400' :
              'bg-gray-500/30 border-2 border-gray-400'
            }`}>
              {voiceState === 'listening' ? <Mic className="w-5 h-5 text-green-300" /> :
               voiceState === 'speaking' ? <Volume2 className="w-5 h-5 text-blue-300" /> :
               <MicOff className="w-5 h-5 text-gray-300" />}
              <span className="text-sm font-bold text-white">
                {voiceState === 'listening' ? 'Listening...' :
                 voiceState === 'processing' ? 'Processing...' :
                 voiceState === 'speaking' ? 'Speaking...' :
                 'Ready'}
              </span>
            </div>
          </div>

          {transcript && (
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 mb-4 border border-blue-400/30">
              <p className="text-blue-300 text-sm mb-1 font-semibold">You said:</p>
              <p className="text-white font-bold text-lg">"{transcript}"</p>
            </div>
          )}
        </div>

        {/* Camera View */}
        {showCamera && (
          <Card className="bg-black/60 backdrop-blur-sm border-2 border-blue-400/50 mb-6">
            <CardContent className="p-6">
              <CameraView onCapture={simulateAIProcessing} />
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card className="bg-green-900/60 backdrop-blur-sm border-2 border-green-400/50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Volume2 className="w-6 h-6 text-green-300 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-green-200 mb-2">AI Result:</h3>
                  <p className="text-white leading-relaxed text-lg font-medium">{result}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 border-2 border-red-400' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-2 border-purple-400'
            } text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105`}
          >
            {isListening ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
          
          {mode !== 'home' && (
            <Button
              onClick={() => handleVoiceCommand('go back')}
              variant="outline"
              className="border-2 border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105"
            >
              Go Back to Menu
            </Button>
          )}
        </div>

        {/* Voice Commands Help */}
        <Card className="bg-blue-900/40 backdrop-blur-sm border-2 border-blue-400/50 mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-blue-200 mb-4 text-center">Voice Commands</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-white font-medium"><strong className="text-blue-300">"Detect object"</strong> - Identify objects</p>
                <p className="text-white font-medium"><strong className="text-blue-300">"Read currency"</strong> - Recognize money</p>
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium"><strong className="text-blue-300">"Read text"</strong> - Read printed text</p>
                <p className="text-white font-medium"><strong className="text-blue-300">"Describe scene"</strong> - Describe surroundings</p>
              </div>
            </div>
            <p className="text-center text-blue-200 mt-4 text-sm font-medium">Say <strong className="text-blue-300">"help"</strong> anytime for assistance or <strong className="text-blue-300">"go back"</strong> to return to menu</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceApp;
