import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CategoryEmotion,
  createState,
  fetchCategories,
  fetchStates,
  MoodStateDto,
  searchUsers,
  Step,
  UserSummary,
} from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function GeneratePage() {
  const { t } = useTranslation();
  const { stepName, stepDescription, emotionLabel, stateStepName, stateFeeling } = useCategoryTranslation();
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<CategoryEmotion | null>(null);
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
    setSelectedEmotion(null);
  }

  async function handleConfirm() {
    if (!step || !selectedEmotion || !selectedUser) return;
    setGenerating(true);
    setError(null);
    try {
      const state = await createState(step.id, selectedEmotion.key, selectedUser.id);
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
            <span className="public-category">{stateStepName(result.stepId, result.stepName)}</span>
            <h2 style={{ fontSize: 22, margin: 0 }}>{stateFeeling(result.feeling)}</h2>
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

  if (step && selectedEmotion) {
    const replacedState = existingStates.find((s) => s.aboutUser?.id === selectedUser?.id);
    return (
      <div className="page">
        <header className="topbar">
          <BrandMark size="sm" inline />
        </header>
        <main className="content">
          <div className="card result-card fade-in">
            <span className="public-category">{stepName(step)}</span>
            <h2 style={{ fontSize: 22, margin: 0 }}>{emotionLabel(selectedEmotion)}</h2>

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
                      {t('generate.replacesCurrentState', { feeling: stateFeeling(replacedState.feeling) })}
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
            <button disabled={generating} onClick={() => setSelectedEmotion(null)}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="section-label">{t('generate.category')}</span>
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
            <span className="section-label">{t('generate.subcategory')}</span>
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
