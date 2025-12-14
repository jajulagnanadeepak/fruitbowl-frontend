import { Separator } from "./ui/separator";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="text-lg font-bold">SD Fruits Bowl</h4>
            <p className="text-sm text-muted-foreground">
              Fresh, healthy and handpicked fruits delivered to your door. Taste the difference with SD Fruits Bowl.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <a href="https://www.instagram.com/sd_fruits_bowl/?next=%2F" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Quick Links</h5>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li><a href="#home" className="hover:text-primary">Home</a></li>
              <li><a href="#fruits" className="hover:text-primary">Our Fruits</a></li>
              <li><a href="#about" className="hover:text-primary">About</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Contact</h5>
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> <span>+91 9505644392</span></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> <span>jajulagnanadeepak@gmail.com</span></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <span>Kothapalli, India</span></div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold">Credits</h5>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Ideas & Concept</div>
                  <div className="font-medium">Medisetti Syam Kumar</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Design & Development</div>
                  <div className="font-medium">Jajula Gnana Deepak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} SD Fruits Bowl. All rights reserved.</div>
          <div className="text-sm text-muted-foreground">Terms • Privacy • Cookies</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;