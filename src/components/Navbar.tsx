import { Phone, Truck, Languages, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import sdLogo from "@/assets/sd-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "te" : "en");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b shadow-sm backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            {location.pathname !== "/" && location.pathname !== "/landing" && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mr-2 -ml-4 hidden sm:inline-flex">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <img src={sdLogo} alt="SD Fruits" className="h-12 w-auto" />
            <span className="hidden md:inline-block text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={async () => {
                const phone = "+91 9505644392";
                // try navigator clipboard first
                try {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(phone);
                  } else {
                    // fallback
                    const ta = document.createElement("textarea");
                    ta.value = phone;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand("copy");
                    document.body.removeChild(ta);
                  }
                  toast({ title: t("nav.phoneCopiedTitle"), description: t("nav.phoneCopiedDesc") });
                } catch (err) {
                  // show error toast
                  toast({ title: t("nav.phoneCopyError") });
                }
              }}
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+91 9505644392</span>
              <span className="sm:hidden">{t("nav.call")}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Login</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
