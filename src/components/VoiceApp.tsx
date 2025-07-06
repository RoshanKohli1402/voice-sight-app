
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
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setVoiceState('listening');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          handleVoiceCommand(transcriptText.toLowerCase().trim());
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setVoiceState('idle');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setVoiceState('idle');
      };
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
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceCommand = (command: string) => {
    setLastCommand(command);
    setVoiceState('processing');
    
    // Process voice commands
    if (command.includes('detect object') || command.includes('identify object') || command.includes('object detection')) {
      setMode('object');
      setShowCamera(true);
      speak("Opening camera for object detection. Please point your camera at the object you want to identify.");
    } else if (command.includes('currency') || command.includes('money') || command.includes('note') || command.includes('bill')) {
      setMode('currency');
      setShowCamera(true);
      speak("Opening camera for currency detection. Please place the currency note in front of the camera.");
    } else if (command.includes('read text') || command.includes('text') || command.includes('reading')) {
      setMode('text');
      setShowCamera(true);
      speak("Opening camera for text reading. Please point your camera at the text you want me to read.");
    } else if (command.includes('describe scene') || command.includes('scene') || command.includes('surroundings')) {
      setMode('scene');
      setShowCamera(true);
      speak("Opening camera for scene description. I will describe what I can see around you.");
    } else if (command.includes('go back') || command.includes('home') || command.includes('main menu')) {
      setMode('home');
      setShowCamera(false);
      setResult('');
      speak("Going back to main menu. What would you like me to help you with?");
    } else if (command.includes('help') || command.includes('what can you do')) {
      speak("I can help you with four things: detect objects, read currency notes, read printed text, and describe scenes. Just say what you need help with.");
    } else {
      speak("I didn't understand that command. You can say detect object, read currency, read text, describe scene, or say help for more options.");
    }
  };

  const simulateAIProcessing = () => {
    setVoiceState('processing');
    setResult('Processing...');
    
    setTimeout(() => {
      let aiResult = '';
      
      switch (mode) {
        case 'object':
          aiResult = "I can see a smartphone in your hand. It appears to be a black rectangular device with a screen.";
          break;
        case 'currency':
          aiResult = "I detected a 100 rupee note. This is a one hundred rupee Indian currency note.";
          break;
        case 'text':
          aiResult = "The text reads: Welcome to our store. Opening hours are 9 AM to 8 PM Monday through Saturday.";
          break;
        case 'scene':
          aiResult = "I can see you're in an indoor environment. There's a table in front of you with some items on it, and there appears to be natural light coming from a window on the left side.";
          break;
        default:
          aiResult = "Processing complete.";
      }
      
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <IconComponent className={`w-16 h-16 text-purple-300 transition-all duration-1000 ${voiceState === 'listening' ? 'scale-110 text-purple-200' : 'scale-100'}`} />
              {voiceState === 'listening' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[...Array(3)].map((_, ring) => (
                    <div
                      key={ring}
                      className="absolute rounded-full border-2 border-purple-300 animate-ping opacity-75"
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
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
            {getModeTitle()}
          </h1>
          
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              voiceState === 'listening' ? 'bg-green-500/20 border border-green-400' :
              voiceState === 'processing' ? 'bg-yellow-500/20 border border-yellow-400' :
              voiceState === 'speaking' ? 'bg-blue-500/20 border border-blue-400' :
              'bg-gray-500/20 border border-gray-400'
            }`}>
              {voiceState === 'listening' ? <Mic className="w-5 h-5 text-green-400" /> :
               voiceState === 'speaking' ? <Volume2 className="w-5 h-5 text-blue-400" /> :
               <MicOff className="w-5 h-5 text-gray-400" />}
              <span className="text-sm font-medium">
                {voiceState === 'listening' ? 'Listening...' :
                 voiceState === 'processing' ? 'Processing...' :
                 voiceState === 'speaking' ? 'Speaking...' :
                 'Ready'}
              </span>
            </div>
          </div>

          {transcript && (
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg p-4 mb-4">
              <p className="text-purple-200 text-sm mb-1">You said:</p>
              <p className="text-white font-medium">"{transcript}"</p>
            </div>
          )}
        </div>

        {/* Camera View */}
        {showCamera && (
          <Card className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 border-purple-500/30 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <CameraView onCapture={simulateAIProcessing} />
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card className="bg-gradient-to-br from-green-800/50 to-blue-800/50 border-green-500/30 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Volume2 className="w-6 h-6 text-green-400 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-green-300 mb-2">AI Result:</h3>
                  <p className="text-white leading-relaxed">{result}</p>
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
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            } text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105`}
          >
            {isListening ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
          
          {mode !== 'home' && (
            <Button
              onClick={() => handleVoiceCommand('go back')}
              variant="outline"
              className="border-2 border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-purple-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105"
            >
              Go Back to Menu
            </Button>
          )}
        </div>

        {/* Voice Commands Help */}
        <Card className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 border-indigo-500/30 backdrop-blur-sm mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-indigo-300 mb-4 text-center">Voice Commands</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-purple-200"><strong>"Detect object"</strong> - Identify objects</p>
                <p className="text-purple-200"><strong>"Read currency"</strong> - Recognize money</p>
              </div>
              <div className="space-y-2">
                <p className="text-purple-200"><strong>"Read text"</strong> - Read printed text</p>
                <p className="text-purple-200"><strong>"Describe scene"</strong> - Describe surroundings</p>
              </div>
            </div>
            <p className="text-center text-indigo-200 mt-4 text-sm">Say "help" anytime for assistance or "go back" to return to menu</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceApp;
