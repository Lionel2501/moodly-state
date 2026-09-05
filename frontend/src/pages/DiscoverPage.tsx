import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { discoverSharedState, SharedStateDto } from '../api/client';
import BrandMark from '../components/BrandMark';

export default function DiscoverPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<SharedStateDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const state = await discoverSharedState(code.trim());
      setResult(state);
    } catch (err) {
      setError(isAxiosError(err) && err.response?.status === 404 ? 'Code introuvable.' : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-centered">
      <BrandMark size="lg" />
      <p className="tagline">Découvre la valeur d'un état</p>

      <div className="card" style={{ marginTop: 8 }}>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Code unique"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Découvrir'}
          </button>
        </form>

        {result && (
          <div className="public-state-card" style={{ marginTop: 20 }}>
            <span className="public-category">{result.stepName}</span>
            <h2 className="public-feeling">{result.feeling}</h2>
          </div>
        )}

        <div className="divider">
          <span>envie d'aller plus loin ?</span>
        </div>

        <div className="promo-card">
          <p>
            Kanjo t'aide à dire ce que tu ressens, <em>sans les mots</em> — crée ton compte pour
            partager tes propres émotions et laisser les tiens les découvrir.
          </p>
          <Link to="/register" className="button primary" style={{ width: '100%' }}>
            Créer mon compte gratuitement
          </Link>
        </div>

        <p className="hint" style={{ marginTop: 16 }}>
          <Link to="/login">Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
}
