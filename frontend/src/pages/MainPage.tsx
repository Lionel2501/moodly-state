import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchStates, MoodStateDto } from '../api/client';

export default function MainPage() {
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
        <h1>moodly state</h1>
        <div className="topbar-actions">
          <span className="username">@{user?.username}</span>
          <button className="link-button" onClick={() => logout()}>
            Déconnexion
          </button>
        </div>
      </header>

      <main className="content">
        <Link to="/generate" className="button primary generate-button">
          Generate
        </Link>

        <section>
          <h2>Mes states générés</h2>
          {loading && <p>Chargement...</p>}
          {!loading && states.length === 0 && (
            <p className="hint">Aucun state pour l'instant, clique sur "Generate" pour en créer un.</p>
          )}
          <ul className="state-list">
            {states.map((state) => (
              <li key={state.id} className="state-card">
                <div className="state-info">
                  <span className="state-step">{state.stepName}</span>
                  <span className="state-feeling">{state.feeling}</span>
                </div>
                <div className="state-url-row">
                  <code className="state-url">{state.url}</code>
                  <button onClick={() => copyUrl(state)}>
                    {copiedId === state.id ? 'Copié !' : 'Copier'}
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
