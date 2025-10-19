import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, Eye, Brain, Bone, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Fruit {
  name: string;
  emoji: string;
  benefits: string[];
  vitamins: string[];
  bodyParts: { name: string; key: string; icon: any }[];
  color: string;
  fruitKey: string;
}

interface FruitDetailModalProps {
  fruit: Fruit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bodyPartIcons = {
  Heart,
  Activity,
  Eye,
  Brain,
  Bone,
  Shield,
};

const FruitDetailModal = ({ fruit, open, onOpenChange }: FruitDetailModalProps) => {
  const { t, getFruitData } = useLanguage();

  if (!fruit) return null;

  const fruitData = getFruitData(fruit.fruitKey);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-3xl">
            <span className="text-5xl">{fruit.emoji}</span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t(`fruit.${fruit.fruitKey}`)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vitamins Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t("modal.vitamins")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {fruitData.vitamins.map((vitamin, index) => (
                <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                  {vitamin}
                </Badge>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-success" />
              {t("modal.benefits")}
            </h3>
            <ul className="grid gap-2">
              {fruitData.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <span className="text-success mt-1">✓</span>
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Body Parts Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">{t("modal.bodyHelps")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fruit.bodyParts.map((part, index) => {
                const IconComponent = part.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/10 hover:border-primary/30 transition-all"
                  >
                    <IconComponent className={`h-8 w-8 text-${fruit.color}`} />
                    <span className="text-sm font-medium text-center">{t(`body.${part.key}`)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Body Indicator */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border">
            <p className="text-center text-muted-foreground">
              {t("modal.conclusion", { fruit: t(`fruit.${fruit.fruitKey}`).toLowerCase() })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FruitDetailModal;
