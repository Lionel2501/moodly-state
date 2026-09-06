import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Category, createSharedState, fetchCategories, SharedStateDto } from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function SharePage() {
  const { t } = useTranslation();
  const { categoryName } = useCategoryTranslation();
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
            <p className="share-link-label">{t('share.yourUniqueLink')}</p>
            <p className="hint" style={{ fontStyle: 'italic', margin: 0 }}>{discoverUrl(result.code)}</p>
            <button className="button primary gift-button" onClick={copyCode}>
              <svg
                className="gift-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="9" rx="1.5" />
                <path d="M3 11h18" />
                <path d="M12 11v9" />
                <path d="M12 11c-1-3.2-4.2-5-6.4-3.4-1.6 1.2-.6 3.4 1.4 3.4" />
                <path d="M12 11c1-3.2 4.2-5 6.4-3.4 1.6 1.2.6 3.4-1.4 3.4" />
              </svg>
              {copied ? t('share.kanjoCopied') : t('share.copyKanjo')}
            </button>
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
          <span className="section-label" style={{ marginBottom: 16 }}>{t('share.chooseKanjo')}</span>
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
