import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { fetchStates, MoodStateDto } from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function MainPage() {
  const { t } = useTranslation();
  const { stateStepName, stateFeeling } = useCategoryTranslation();
  const { user, logout } = useAuth();
  const [states, setStates] = useState<MoodStateDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchStates()
      .then(setStates)
      .finally(() => setLoading(false));
  }, []);

  async function copyUrl(state: MoodStateDto) {
    try {
      await navigator.clipboard.writeText(state.url);
      setCopiedId(state.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard API unavailable, ignore silently
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <BrandMark size="sm" inline />
        <div className="topbar-actions">
          <button className="link-button" onClick={() => logout()}>
            {t('main.logout')}
          </button>
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
        </div>
      </header>

      <main className="content">
        <Link to="/generate" className="button primary generate-button">
          {t('main.generate')}
        </Link>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="section-label">{t('main.myStates')}</span>
          {loading && <p className="hint">{t('common.loading')}</p>}
          {!loading && states.length === 0 && <p className="hint">{t('main.noStatesYet')}</p>}
          <ul className="state-list">
            {states.map((state) => (
              <li key={state.id} className="state-card">
                <div className="state-info">
                  <span className="state-step">{stateStepName(state.stepId, state.stepName)}</span>
                  <span className="state-feeling">{stateFeeling(state.feeling)}</span>
                  {state.aboutUser && (
                    <span className="state-about">
                      {t('main.about', { username: state.aboutUser.username })}
                    </span>
                  )}
                </div>
                <div className="state-url-row">
                  <code className="state-url">{state.url}</code>
                  <button onClick={() => copyUrl(state)}>
                    {copiedId === state.id ? t('common.copied') : t('common.copy')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
