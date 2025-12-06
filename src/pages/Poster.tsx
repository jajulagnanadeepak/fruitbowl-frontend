import posterImg from "@/assets/poster.webp";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Poster = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur rounded-2xl p-6 shadow-2xl border">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
        </div>
        <div className="text-center">
          <img src={posterImg} alt="Poster" className="mx-auto rounded-lg shadow-lg w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Poster;
