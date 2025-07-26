import React from 'react';
import { useTranslation } from 'react-i18next';

const KnowledgeHub: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{t('knowledgeHub')}</h1>
      <section style={{ marginTop: '2rem' }}>
        <h2>{t('resources') || 'Resources'}</h2>
        <p>Coming soon: curated guides, tools, and templates for shared wealth and governance.</p>
      </section>
      <section style={{ marginTop: '2rem' }}>
        <h2>{t('articles') || 'Articles'}</h2>
        <p>Coming soon: expert articles, case studies, and community stories.</p>
      </section>
      <section style={{ marginTop: '2rem' }}>
        <h2>{t('userContributions') || 'User Contributions'}</h2>
        <p>Coming soon: share your own resources, insights, and best practices.</p>
      </section>
    </div>
  );
};

export default KnowledgeHub; 