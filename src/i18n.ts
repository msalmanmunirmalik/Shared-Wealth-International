import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Wealth Pioneers Network!',
      knowledgeHub: 'Knowledge Hub',
      onboarding: 'Get Started',
      feedback: 'Feedback',
      resources: 'Resources',
      articles: 'Articles',
      userContributions: 'User Contributions',
      onboardingWelcome: 'Welcome! Let’s get your organization started on the Wealth Pioneers Network.',
      onboardingStep1: 'Step 1: Complete your profile',
      onboardingStep2: 'Step 2: Set your organization’s goals',
      onboardingStep3: 'Step 3: Connect with partners and resources',
      onboardingNote: 'You can revisit onboarding anytime from your dashboard.',
      // Add more keys as needed
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue sur le réseau Wealth Pioneers !',
      knowledgeHub: 'Centre de connaissances',
      onboarding: 'Commencer',
      feedback: 'Retour',
      resources: 'Ressources',
      articles: 'Articles',
      userContributions: 'Contributions des utilisateurs',
      onboardingWelcome: 'Bienvenue ! Commençons l’intégration de votre organisation sur le réseau Wealth Pioneers.',
      onboardingStep1: 'Étape 1 : Complétez votre profil',
      onboardingStep2: 'Étape 2 : Définissez les objectifs de votre organisation',
      onboardingStep3: 'Étape 3 : Connectez-vous avec des partenaires et des ressources',
      onboardingNote: 'Vous pouvez reprendre l’intégration à tout moment depuis votre tableau de bord.',
      // Add more keys as needed
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n; 