import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Category, createState, fetchCategories, MoodStateDto, searchUsers, UserSummary } from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function GeneratePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categoryName, stateCategoryName } = useCategoryTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStepDone, setUserStepDone] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<MoodStateDto | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSummary[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
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
  }, [query]);

  function pickUser(user: UserSummary) {
    setSelectedUser(user);
    setUserStepDone(true);
  }

  function skipUser() {
    setSelectedUser(null);
    setUserStepDone(true);
  }

  function backToUserStep() {
    setUserStepDone(false);
    setSelectedUser(null);
    setQuery('');
    setResults([]);
  }

  // Associating to a known user notifies them directly, so there is nothing
  // left to share manually — go straight back to the dashboard.
  // No recipient to notify, so the sender has to share the link themselves.
  async function handleSelectCategory(category: Category) {
    setGenerating(true);
    setError(null);
    try {
      if (selectedUser) {
        await createState(category.id, selectedUser.id);
        navigate('/');
      } else {
        const state = await createState(category.id);
        setResult(state);
      }
    } catch {
      setError(t('generate.generationFailed'));
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
            <h2 style={{ fontSize: 22, margin: 0, textAlign: 'center' }}>
              {stateCategoryName(result.categoryId, result.categoryName)}
            </h2>
            <button onClick={copyUrl}>{copied ? t('common.copied') : t('common.copy')}</button>
            <Link to="/" className="button primary">
              {t('common.backToHome')}
            </Link>
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
        {error && <p className="error">{error}</p>}

        {!userStepDone && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="section-label">{t('generate.associateWith')}</span>

            <div className="user-search">
              <input
                type="text"
                placeholder={t('generate.searchUserPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {searching && <p className="hint">{t('generate.searching')}</p>}
              {!searching && query.trim() && results.length === 0 && (
                <p className="hint">{t('generate.noUserFound')}</p>
              )}
              {!searching && results.length > 0 && (
                <ul className="user-results">
                  {results.map((u) => (
                    <li key={u.id}>
                      <button className="user-result-item" onClick={() => pickUser(u)}>
                        @{u.username}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="link-button" onClick={skipUser}>
              {t('generate.skipAssociation')}
            </button>
          </div>
        )}

        {userStepDone && (
          <div className="category-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="section-label">{t('generate.category')}</span>
              <button className="link-button" disabled={generating} onClick={backToUserStep}>
                {t('common.back')}
              </button>
            </div>
            {selectedUser && (
              <p className="hint">{t('generate.about', { username: selectedUser.username })}</p>
            )}
            <div className="category-grid">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className="button category-button"
                  disabled={generating}
                  onClick={() => handleSelectCategory(c)}
                >
                  <span className="category-button-name">{categoryName(c)}</span>
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
