import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createState, fetchCategories, MoodStateDto, Step } from '../api/client';
import BrandMark from '../components/BrandMark';

export default function GenerateSubcategoriesPage() {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<MoodStateDto | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((steps) => {
        const found = steps.find((s) => s.id === Number(stepId));
        if (!found) {
          navigate('/generate', { replace: true });
          return;
        }
        setStep(found);
      })
      .finally(() => setLoading(false));
  }, [stepId, navigate]);

  async function handleSelect(feeling: string) {
    if (!step) return;
    setGenerating(true);
    setError(null);
    try {
      const state = await createState(step.id, feeling);
      setResult(state);
    } catch {
      setError("La génération a échoué, réessaie.");
    } finally {
      setGenerating(false);
    }
  }

  async function copyUrl() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
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
            <div className="state-url-row">
              <code className="state-url">{result.url}</code>
              <button onClick={copyUrl}>{copied ? 'Copié !' : 'Copier'}</button>
            </div>
            <Link to="/" className="button primary">
              Retour à l'accueil
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="topbar">
        <Link to="/generate" className="back-link">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {step?.name ?? '...'}
        </Link>
      </header>
      <main className="content">
        {loading && <p className="hint">Chargement...</p>}
        {error && <p className="error">{error}</p>}
        <div className="category-grid">
          {step?.feelings.map((feeling) => (
            <button
              key={feeling}
              className="button category-button"
              disabled={generating}
              onClick={() => handleSelect(feeling)}
            >
              {feeling}
              <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
