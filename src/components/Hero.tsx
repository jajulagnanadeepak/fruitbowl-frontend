import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/fruit-bowl-hero.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-success/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Fresh & Healthy</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Nourish Your Body with{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                Nature's Finest
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover the incredible health benefits of fresh fruits. From vitamins to minerals, 
              each fruit is packed with nutrients designed to boost your wellness.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                Explore Our Fruits
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20" />
            <img 
              src={heroImage} 
              alt="Fresh fruit bowl" 
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
