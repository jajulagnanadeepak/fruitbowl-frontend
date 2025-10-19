import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface FruitCardProps {
  name: string;
  emoji: string;
  gradient: string;
  onClick: () => void;
}

const FruitCard = ({ name, emoji, gradient, onClick }: FruitCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      <div className="relative p-8 text-center space-y-4">
        <div className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </div>
        
        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
          <Sparkles className="h-4 w-4" />
          <span>Click to explore benefits</span>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 w-2 h-2 bg-success rounded-full animate-pulse" />
    </Card>
  );
};

export default FruitCard;
