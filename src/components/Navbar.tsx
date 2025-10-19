import { Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import sdLogo from "@/assets/sd-logo.png";

const Navbar = () => {
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
              Home
            </a>
            <a href="#fruits" className="text-foreground hover:text-primary transition-colors font-medium">
              Our Fruits
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">Free Delivery</span>
            </div>
            <Button variant="default" size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+1 (555) 123-4567</span>
              <span className="sm:hidden">Call</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
