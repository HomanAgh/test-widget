import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi) // To load translation files
  .use(LanguageDetector) // To detect user language
  .use(initReactI18next) // To integrate with React
  .init({
    supportedLngs: ['en', 'sv'], // Define supported languages
    fallbackLng: 'en', // Default language
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'], // Cache language preference
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
