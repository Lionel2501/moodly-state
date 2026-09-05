import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createState, fetchCategories, fetchStates, MoodStateDto, searchUsers, Step, UserSummary } from '../api/client';
import BrandMark from '../components/BrandMark';

export default function GeneratePage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<MoodStateDto | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [existingStates, setExistingStates] = useState<MoodStateDto[]>([]);

  const step = steps.find((s) => s.id === selectedStepId) ?? null;

  useEffect(() => {
    fetchStates().then(setExistingStates);
  }, []);

  useEffect(() => {
    fetchCategories()
      .then(setSteps)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim() || selectedUser) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(() => {
      searchUsers(query)
        .then(setResults)
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, selectedUser]);

  function selectUser(u: UserSummary) {
    setSelectedUser(u);
    setQuery('');
    setResults([]);
  }

  function handleSelectStep(stepId: number) {
    setSelectedStepId(stepId || null);
    setSelectedFeeling(null);
  }

  async function handleConfirm() {
    if (!step || !selectedFeeling || !selectedUser) return;
    setGenerating(true);
    setError(null);
    try {
      const state = await createState(step.id, selectedFeeling, selectedUser.id);
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
            {result.aboutUser && (
              <p className="hint">à propos de @{result.aboutUser.username}</p>
            )}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="section-label">Associer à</span>

              {selectedUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="selected-user">
                    <span className="selected-user-name">@{selectedUser.username}</span>
                    <button className="link-button" onClick={() => setSelectedUser(null)}>
                      Changer
                    </button>
                  </div>
                  {existingStates.find((s) => s.aboutUser?.id === selectedUser.id) && (
                    <p className="hint">
                      Remplace l'état actuel :{' '}
                      {existingStates.find((s) => s.aboutUser?.id === selectedUser.id)?.feeling}
                    </p>
                  )}
                </div>
              ) : (
                <div className="user-search">
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {searching && <p className="hint">Recherche...</p>}
                  {!searching && query.trim() && results.length === 0 && (
                    <p className="hint">Aucun utilisateur trouvé.</p>
                  )}
                  {results.length > 0 && (
                    <ul className="user-results">
                      {results.map((u) => (
                        <li key={u.id}>
                          <button className="user-result-item" onClick={() => selectUser(u)}>
                            @{u.username}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {error && <p className="error">{error}</p>}
            <button
              className="button primary"
              disabled={generating || !selectedUser}
              onClick={handleConfirm}
            >
              {generating ? 'Association...' : 'Confirmer'}
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
