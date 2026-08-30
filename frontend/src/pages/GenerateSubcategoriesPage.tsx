import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createState, fetchCategories, MoodStateDto, Step } from '../api/client';

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
          <h1>moodly state</h1>
        </header>
        <main className="content">
          <div className="card result-card">
            <h2>State généré</h2>
            <p>
              <strong>{result.stepName}</strong> — {result.feeling}
            </p>
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
        <h1>moodly state</h1>
        <Link to="/generate" className="link-button">
          Retour
        </Link>
      </header>
      <main className="content">
        <h2>{step?.name ?? '...'}</h2>
        {loading && <p>Chargement...</p>}
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
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
