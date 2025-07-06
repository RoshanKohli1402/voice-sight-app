
import { useState, useEffect } from "react";
import { Mic, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const VoiceDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const demoSteps = [
    {
      type: "user",
      text: "Detect currency",
      icon: Mic,
      delay: 0
    },
    {
      type: "app",
      text: "Place the note in front of the camera...",
      icon: Volume2,
      delay: 2000
    },
    {
      type: "app",
      text: "₹100 note detected. One hundred rupees.",
      icon: Volume2,
      delay: 4000
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      {demoSteps.map((step, index) => (
        <Card
          key={index}
          className={`transition-all duration-500 ${
            index <= currentStep 
              ? 'bg-gradient-to-r from-indigo-800/70 to-purple-800/70 border-indigo-400/50 opacity-100 scale-100' 
              : 'bg-gray-800/30 border-gray-600/30 opacity-50 scale-95'
          } ${index === currentStep && isAnimating ? 'animate-pulse' : ''}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                step.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
              }`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium mb-1 ${
                  step.type === 'user' ? 'text-blue-300' : 'text-purple-300'
                }`}>
                  {step.type === 'user' ? 'You say:' : 'AI responds:'}
                </div>
                <div className="text-white text-lg font-medium">
                  "{step.text}"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center mt-6">
        <div className="flex justify-center space-x-2">
          {demoSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-purple-300 mt-2">Voice interaction simulation</p>
      </div>
    </div>
  );
};

export default VoiceDemo;
