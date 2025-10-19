import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FruitCard from "@/components/FruitCard";
import FruitDetailModal from "@/components/FruitDetailModal";
import { fruitsData } from "@/data/fruitsData";
import strawberryBowl from "@/assets/strawberry-bowl.jpg";
import tropicalBowl from "@/assets/tropical-bowl.jpg";
import appleBowl from "@/assets/apple-bowl.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
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
              {t("fruits.title1")}{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                {t("fruits.title2")}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("fruits.description")}
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
                  name={t(`fruit.${fruit.fruitKey}`)}
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
              {t("about.title1")}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("about.title2")}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.description")}
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="p-6 rounded-xl bg-card border-2 hover:border-primary transition-colors">
                <div className="text-4xl mb-3">🚚</div>
                <h3 className="font-bold text-lg mb-2">{t("about.delivery.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("about.delivery.desc")}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border-2 hover:border-accent transition-colors">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="font-bold text-lg mb-2">{t("about.quality.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("about.quality.desc")}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border-2 hover:border-success transition-colors">
                <div className="text-4xl mb-3">💚</div>
                <h3 className="font-bold text-lg mb-2">{t("about.health.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("about.health.desc")}
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
            {t("footer.text")}
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
