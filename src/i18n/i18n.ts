// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import amTranslation from './locales/am/translation.json';

i18n.use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass the i18n instance to react-i18next
    .init({
        fallbackLng: 'en', // Default language
        debug: true, // Enable debug mode in development
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        resources: {
            en: {
                translation: enTranslation,
            },
            am: {
                translation: amTranslation,
            },
        },
    });

export default i18n;
