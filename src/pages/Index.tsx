import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FruitCard from "@/components/FruitCard";
import FruitDetailModal from "@/components/FruitDetailModal";
import { fruitsData } from "@/data/fruitsData";
import strawberryBowl from "@/assets/strawberry-bowl.jpg";
import tropicalBowl from "@/assets/tropical-bowl.jpg";
import appleBowl from "@/assets/apple-bowl.jpg";

const Index = () => {
  const [selectedFruit, setSelectedFruit] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFruitClick = (fruit: any) => {
    setSelectedFruit(fruit);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero />

      {/* Fruits Gallery Section */}
      <section id="fruits" className="py-20 relative overflow-hidden">
        <div className="absolute top-20 right-10 opacity-20 hidden lg:block">
          <img src={strawberryBowl} alt="" className="w-64 h-64 object-cover rounded-full blur-sm" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-20 hidden lg:block">
          <img src={tropicalBowl} alt="" className="w-64 h-64 object-cover rounded-full blur-sm" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                Fresh Selection
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Click on any fruit to discover its incredible health benefits, vitamin content, 
              and how it supports your body.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-scale-in">
            {fruitsData.map((fruit, index) => (
              <div
                key={fruit.name}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in"
              >
                <FruitCard
                  name={fruit.name}
                  emoji={fruit.emoji}
                  gradient={fruit.gradient}
                  onClick={() => handleFruitClick(fruit)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-10 right-20 opacity-10 hidden lg:block">
          <img src={appleBowl} alt="" className="w-96 h-96 object-cover rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SD Fruits Bowl
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're passionate about bringing you the freshest, most nutritious fruits. 
              Each piece is carefully selected to ensure maximum flavor and health benefits. 
              With free delivery and expert guidance on nutrition, we make healthy eating 
              easy and delicious.
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="p-6 rounded-xl bg-card border-2 hover:border-primary transition-colors">
                <div className="text-4xl mb-3">🚚</div>
                <h3 className="font-bold text-lg mb-2">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Fresh fruits delivered to your door at no extra cost
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border-2 hover:border-accent transition-colors">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Handpicked fruits from trusted farms
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border-2 hover:border-success transition-colors">
                <div className="text-4xl mb-3">💚</div>
                <h3 className="font-bold text-lg mb-2">Health First</h3>
                <p className="text-sm text-muted-foreground">
                  Expert nutrition information for every fruit
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 SD Fruits Bowl. Bringing health and happiness through nature's finest.
          </p>
        </div>
      </footer>

      <FruitDetailModal
        fruit={selectedFruit}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Index;
