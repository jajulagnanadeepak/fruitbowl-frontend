import { createContext, useContext, useState, ReactNode } from "react";
import { translations, fruitTranslations } from "@/data/translations";

type Language = "en" | "te";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  getFruitData: (fruitKey: string) => { benefits: string[]; vitamins: string[] };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[language][key] || key;
    
    // Replace parameters in the translation
    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  };

  const getFruitData = (fruitKey: string) => {
    return fruitTranslations[language][fruitKey] || fruitTranslations.en[fruitKey];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getFruitData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
