import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createSharedState, fetchCategories, SharedStateDto, Step } from '../api/client';
import BrandMark from '../components/BrandMark';

export default function SharePage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<SharedStateDto | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = steps.find((s) => s.id === selectedStepId) ?? null;

  useEffect(() => {
    fetchCategories()
      .then(setSteps)
      .finally(() => setLoading(false));
  }, []);

  function handleSelectStep(stepId: number) {
    setSelectedStepId(stepId || null);
    setSelectedFeeling(null);
  }

  async function handleConfirm() {
    if (!step || !selectedFeeling) return;
    setGenerating(true);
    setError(null);
    try {
      const state = await createSharedState(step.id, selectedFeeling);
      setResult(state);
    } catch {
      setError('La génération a échoué, réessaie.');
    } finally {
      setGenerating(false);
    }
  }

  async function copyCode() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.code);
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
            <span className="public-category">{result.stepName}</span>
            <h2 style={{ fontSize: 22, margin: 0 }}>{result.feeling}</h2>
            <p className="hint">Ton code unique — partage-le pour que quelqu'un le découvre :</p>
            <div className="state-url-row">
              <code className="state-url code-display">{result.code}</code>
              <button onClick={copyCode}>{copied ? 'Copié !' : 'Copier'}</button>
            </div>
            <Link to="/discover" className="button primary">
              Aller à Discover
            </Link>
            <Link to="/login" className="button">
              Retour à l'accueil
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (step && selectedFeeling) {
    return (
      <div className="page">
        <header className="topbar">
          <BrandMark size="sm" inline />
        </header>
        <main className="content">
          <div className="card result-card fade-in">
            <span className="public-category">{step.name}</span>
            <h2 style={{ fontSize: 22, margin: 0 }}>{selectedFeeling}</h2>
            {error && <p className="error">{error}</p>}
            <button className="button primary" disabled={generating} onClick={handleConfirm}>
              {generating ? 'Génération...' : 'Confirmer'}
            </button>
            <button disabled={generating} onClick={() => setSelectedFeeling(null)}>
              Changer d'état
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
        {loading && <p className="hint">Chargement...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="section-label">Catégorie</span>
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
                  <span className="category-button-name">{s.name}</span>
                  <span className="category-button-description">{s.description}</span>
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
            <span className="section-label">Sous-catégorie</span>
            <div className="category-grid">
              {step.emotions.map((emotion) => (
                <button
                  key={emotion.key}
                  className="button category-button"
                  onClick={() => setSelectedFeeling(emotion.label)}
                >
                  {emotion.label}
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
