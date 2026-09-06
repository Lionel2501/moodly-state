import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Category,
  createState,
  fetchCategories,
  fetchStates,
  MoodStateDto,
  searchUsers,
  UserSummary,
} from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function GeneratePage() {
  const { t } = useTranslation();
  const { categoryName, stateCategoryName } = useCategoryTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<MoodStateDto | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [existingStates, setExistingStates] = useState<MoodStateDto[]>([]);

  const category = categories.find((c) => c.id === selectedCategoryId) ?? null;

  useEffect(() => {
    fetchStates().then(setExistingStates);
  }, []);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
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

  async function handleConfirm() {
    if (!category || !selectedUser) return;
    setGenerating(true);
    setError(null);
    try {
      const state = await createState(category.id, selectedUser.id);
      setResult(state);
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
            <h2 style={{ fontSize: 22, margin: 0 }}>
              {stateCategoryName(result.categoryId, result.categoryName)}
            </h2>
            {result.aboutUser && (
              <p className="hint">{t('generate.about', { username: result.aboutUser.username })}</p>
            )}
            <div className="state-url-row">
              <code className="state-url">{result.url}</code>
              <button onClick={copyUrl}>{copied ? t('common.copied') : t('common.copy')}</button>
            </div>
            <Link to="/" className="button primary">
              {t('common.backToHome')}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (category) {
    const replacedState = existingStates.find((s) => s.aboutUser?.id === selectedUser?.id);
    return (
      <div className="page">
        <header className="topbar">
          <BrandMark size="sm" inline />
        </header>
        <main className="content">
          <div className="card result-card fade-in">
            <h2 style={{ fontSize: 22, margin: 0 }}>{categoryName(category)}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="section-label">{t('generate.associateWith')}</span>

              {selectedUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="selected-user">
                    <span className="selected-user-name">@{selectedUser.username}</span>
                    <button className="link-button" onClick={() => setSelectedUser(null)}>
                      {t('generate.change')}
                    </button>
                  </div>
                  {replacedState && (
                    <p className="hint">
                      {t('generate.replacesCurrentState', {
                        category: stateCategoryName(replacedState.categoryId, replacedState.categoryName),
                      })}
                    </p>
                  )}
                </div>
              ) : (
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
              {generating ? t('generate.associating') : t('generate.confirm')}
            </button>
            <button disabled={generating} onClick={() => setSelectedCategoryId(null)}>
              {t('generate.changeState')}
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

        <div className="category-section">
          <span className="section-label">{t('generate.category')}</span>
          <div className="category-grid">
            {categories.map((c) => (
              <button
                key={c.id}
                className="button category-button"
                onClick={() => setSelectedCategoryId(c.id)}
              >
                <span className="category-button-name">{categoryName(c)}</span>
                <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
