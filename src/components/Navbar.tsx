import { Phone, Truck, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import sdLogo from "@/assets/sd-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "te" : "en");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b shadow-sm backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <img src={sdLogo} alt="SD Fruits" className="h-12 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SD Fruits Bowl
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("nav.home")}
            </a>
            <a href="#fruits" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("nav.fruits")}
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("nav.about")}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2 font-semibold"
            >
              <Languages className="h-4 w-4" />
              {t("nav.language")}
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">{t("nav.freeDelivery")}</span>
            </div>
            <Button variant="default" size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+1 (555) 123-4567</span>
              <span className="sm:hidden">{t("nav.call")}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
