
import { useState, useEffect } from "react";
import { Mic, Speaker, Waves, Download, Play, Eye, DollarSign, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VoiceWave from "@/components/VoiceWave";
import FeatureCard from "@/components/FeatureCard";
import VoiceDemo from "@/components/VoiceDemo";

const Index = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Eye,
      title: "Object Detection",
      description: "Know what's in your hand",
      quote: "Instantly identify everyday objects with AI precision"
    },
    {
      icon: DollarSign,
      title: "Currency Reader",
      description: "Count your money confidently",
      quote: "Recognize bills and coins with voice confirmation"
    },
    {
      icon: FileText,
      title: "Text Reader",
      description: "Hear every word clearly",
      quote: "Transform printed text into clear speech"
    },
    {
      icon: Camera,
      title: "Scene Detection",
      description: "Understand your surroundings",
      quote: "Get detailed descriptions of your environment"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Mic className={`w-24 h-24 text-purple-300 transition-all duration-1000 ${isAnimating ? 'scale-110 text-purple-200' : 'scale-100'}`} />
              <VoiceWave isActive={isAnimating} />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-fade-in">
            AI Vision Assistant
          </h1>
          
          <p className="text-2xl md:text-3xl mb-8 text-purple-200 font-light animate-fade-in delay-300">
            See Without Seeing
          </p>
          
          <p className="text-lg md:text-xl mb-12 text-blue-200 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-500">
            Experience the world through AI-powered voice assistance. Completely offline, entirely accessible, 
            designed for independence and empowerment.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center animate-fade-in delay-700">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              <Download className="mr-2 h-5 w-5" />
              Download APK
            </Button>
            <Button variant="outline" className="border-2 border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-purple-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105">
              <Play className="mr-2 h-5 w-5" />
              Try Voice Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Voice Guide Section */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Speaker className="w-16 h-16 text-blue-300 animate-bounce" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
            Your Voice, Your Guide
          </h2>
          <p className="text-xl text-blue-200 mb-8 leading-relaxed">
            Navigate your world with simple voice commands. No touching, no scrolling, just speak and listen.
          </p>
          <div className="flex justify-center">
            <Waves className="w-32 h-16 text-purple-300 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
            Four Powerful Modes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                quote={feature.quote}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Voice Demo Section */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-indigo-800/30 to-purple-800/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text">
            Voice Interaction Demo
          </h2>
          <VoiceDemo />
        </div>
      </section>

      {/* Offline Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text">
            No Internet? No Problem.
          </h2>
          <p className="text-xl text-green-200 mb-8 leading-relaxed">
            Complete AI processing happens on your device. Your privacy is protected, 
            and assistance is always available, anywhere, anytime.
          </p>
          <div className="inline-block p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm text-green-300 mt-4">Always Connected to Independence</p>
        </div>
      </section>

      {/* Freedom Section */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-pink-800/30 to-purple-800/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text">
            Freedom in Every Word
          </h2>
          <blockquote className="text-2xl md:text-3xl text-pink-200 font-light italic mb-8 leading-relaxed">
            "Technology should adapt to us, not the other way around. 
            This is independence redefined."
          </blockquote>
          <div className="flex justify-center space-x-4">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            Ready to Transform Your Experience?
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              <Download className="mr-2 h-5 w-5" />
              Download Now
            </Button>
            <Button variant="outline" className="border-2 border-blue-300 text-blue-300 hover:bg-blue-300 hover:text-blue-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105">
              <Play className="mr-2 h-5 w-5" />
              Watch in Action
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
