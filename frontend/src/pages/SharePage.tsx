import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Category, createSharedState, fetchCategories, SharedStateDto } from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function SharePage() {
  const { t } = useTranslation();
  const { categoryName, stateCategoryName } = useCategoryTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<SharedStateDto | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function discoverUrl(code: string) {
    return `${window.location.origin}/discover/${code}`;
  }

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  async function handleSelect(category: Category) {
    setGenerating(true);
    setError(null);
    try {
      const state = await createSharedState(category.id);
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
        <main className="content content-center">
          <div className="card result-card">
            <h2 style={{ fontSize: 22, margin: 0 }}>
              {stateCategoryName(result.categoryId, result.categoryName)}
            </h2>
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

  return (
    <div className="page">
      <header className="topbar">
        <BrandMark size="sm" inline />
      </header>
      <main className="content">
        {loading && <p className="hint">{t('common.loading')}</p>}
        {error && <p className="error">{error}</p>}

        <div className="category-section">
          <div className="category-grid">
            {categories.map((c) => (
              <button
                key={c.id}
                className="button category-button"
                disabled={generating}
                onClick={() => handleSelect(c)}
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
