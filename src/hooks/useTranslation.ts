import { useLanguage } from '../context/LanguageContext';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

const translations = {
  en: enTranslations,
  es: esTranslations,
};

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    // Debug log for benefitCustomer
    if (key.startsWith('benefitCustomer')) {
      console.log('Translation debug - key:', key, 'language:', currentLanguage);
      console.log('Translation debug - available translations:', translations[currentLanguage]);
    }
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return the key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return {
    t,
    currentLanguage,
  };
}; 