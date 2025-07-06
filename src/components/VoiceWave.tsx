
import { useEffect, useState } from "react";

interface VoiceWaveProps {
  isActive: boolean;
}

const VoiceWave = ({ isActive }: VoiceWaveProps) => {
  const [waves, setWaves] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setWaves(prev => {
          const newWaves = Array.from({ length: 8 }, () => Math.random() * 100);
          return newWaves;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setWaves([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(4)].map((_, ring) => (
        <div
          key={ring}
          className={`absolute rounded-full border-2 border-purple-300 animate-ping opacity-75`}
          style={{
            width: `${120 + ring * 40}px`,
            height: `${120 + ring * 40}px`,
            animationDelay: `${ring * 0.5}s`,
            animationDuration: '2s'
          }}
        />
      ))}
      
      <div className="absolute flex items-end justify-center space-x-1">
        {waves.map((height, index) => (
          <div
            key={index}
            className="bg-purple-300 rounded-full transition-all duration-200"
            style={{
              width: '2px',
              height: `${Math.max(height * 0.3, 10)}px`,
              opacity: 0.8
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VoiceWave;
