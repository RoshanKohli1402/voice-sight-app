
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  quote: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, quote, delay = 0 }: FeatureCardProps) => {
  return (
    <Card 
      className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 border-purple-500/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-purple-300 font-medium mb-3">{description}</p>
        <p className="text-sm text-blue-200 italic leading-relaxed">"{quote}"</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
