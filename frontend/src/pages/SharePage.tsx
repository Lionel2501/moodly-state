import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CategoryEmotion, createSharedState, fetchCategories, SharedStateDto, Step } from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function SharePage() {
  const { t } = useTranslation();
  const { stepName, stepDescription, emotionLabel, stateStepName, stateFeeling } = useCategoryTranslation();
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<CategoryEmotion | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<SharedStateDto | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = steps.find((s) => s.id === selectedStepId) ?? null;

  function discoverUrl(code: string) {
    return `${window.location.origin}/discover/${code}`;
  }

  useEffect(() => {
    fetchCategories()
      .then(setSteps)
      .finally(() => setLoading(false));
  }, []);

  function handleSelectStep(stepId: number) {
    setSelectedStepId(stepId || null);
    setSelectedEmotion(null);
  }

  async function handleConfirm() {
    if (!step || !selectedEmotion) return;
    setGenerating(true);
    setError(null);
    try {
      const state = await createSharedState(step.id, selectedEmotion.key);
      setResult(state);
    } catch {
      setError(t('share.generationFailed'));
    } finally {
      setGenerating(false);
    }
  }

  async function copyCode() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(discoverUrl(result.code));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable, ignore silently
    }
  }

  if (result) {
    return (
      <div className="page">
        <header className="topbar">
          <BrandMark size="sm" inline />
        </header>
        <main className="content">
          <div className="card result-card">
            <span className="public-category">{stateStepName(result.stepId, result.stepName)}</span>
            <h2 style={{ fontSize: 22, margin: 0 }}>{stateFeeling(result.feeling)}</h2>
            <p className="hint">{t('share.yourUniqueLink')}</p>
            <div className="state-url-row">
              <code className="state-url">{discoverUrl(result.code)}</code>
              <button onClick={copyCode}>{copied ? t('common.copied') : t('common.copy')}</button>
            </div>
            <Link to={`/discover/${result.code}`} className="button primary">
              {t('share.goToDiscover')}
            </Link>
            <Link to="/login" className="button">
              {t('common.backToHome')}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (step && selectedEmotion) {
    return (
      <div className="page">
        <header className="topbar">
          <BrandMark size="sm" inline />
        </header>
        <main className="content">
          <div className="card result-card fade-in">
            <span className="public-category">{stepName(step)}</span>
            <h2 style={{ fontSize: 22, margin: 0 }}>{emotionLabel(selectedEmotion)}</h2>
            {error && <p className="error">{error}</p>}
            <button className="button primary" disabled={generating} onClick={handleConfirm}>
              {generating ? t('share.generating') : t('share.confirm')}
            </button>
            <button disabled={generating} onClick={() => setSelectedEmotion(null)}>
              {t('share.changeState')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="topbar">
        <BrandMark size="sm" inline />
      </header>
      <main className="content">
        {loading && <p className="hint">{t('common.loading')}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="category-grid">
            {steps.map((s) => (
              <button
                key={s.id}
                className={`button category-button${s.id === selectedStepId ? ' category-button-active' : ''}${
                  selectedStepId && s.id !== selectedStepId ? ' category-button-collapsed' : ''
                }`}
                onClick={() => handleSelectStep(s.id === selectedStepId ? 0 : s.id)}
              >
                <span className="category-button-text">
                  <span className="category-button-name">{stepName(s)}</span>
                  <span className="category-button-description">{stepDescription(s)}</span>
                </span>
                <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {step && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="category-grid">
              {step.emotions.map((emotion) => (
                <button
                  key={emotion.key}
                  className="button category-button"
                  onClick={() => setSelectedEmotion(emotion)}
                >
                  {emotionLabel(emotion)}
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
