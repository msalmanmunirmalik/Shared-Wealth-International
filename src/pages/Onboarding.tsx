import React from 'react';
import { useTranslation } from 'react-i18next';

const Onboarding: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{t('onboarding')}</h1>
      <p>{t('onboardingWelcome') || 'Welcome! Let’s get your organization started on the Wealth Pioneers Network.'}</p>
      <ol style={{ marginTop: '1rem' }}>
        <li>{t('onboardingStep1') || 'Step 1: Complete your profile'}</li>
        <li>{t('onboardingStep2') || 'Step 2: Set your organization’s goals'}</li>
        <li>{t('onboardingStep3') || 'Step 3: Connect with partners and resources'}</li>
      </ol>
      <p style={{ marginTop: '1rem' }}>{t('onboardingNote') || 'You can revisit onboarding anytime from your dashboard.'}</p>
    </div>
  );
};

export default Onboarding; 