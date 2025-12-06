import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/tropical-bowl.webp";
import sdLogo from "@/assets/sd-logo.webp";
import fruitsTheme from "@/assets/fruitstheme.webp";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${fruitsTheme})` }}
    >
      <div className="max-w-4xl w-full mx-auto px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-8">
          <img src={heroImage} alt="hero" className="rounded-3xl shadow-2xl w-96 h-64 object-cover" />

          <div className="flex flex-col items-center gap-2">
            <img
              src={sdLogo}
              alt="SD Logo"
              className="w-36 h-16 object-contain bg-transparent mix-blend-multiply"
            />
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow">
              FRUITS BOWL
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <Button size="lg" onClick={() => navigate('/home')}>
                Enter
              </Button>
              <Button size="lg" onClick={() => navigate('/poster')}>
                Poster
              </Button>
              <Button size="lg" onClick={() => navigate('/dates')}>
                Dates
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;