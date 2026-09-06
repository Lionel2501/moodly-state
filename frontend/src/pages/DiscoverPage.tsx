import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { discoverSharedState, SharedStateDto } from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function DiscoverPage() {
  const { t } = useTranslation();
  const { stateCategoryName } = useCategoryTranslation();
  const { code } = useParams<{ code?: string }>();
  const [result, setResult] = useState<SharedStateDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const REVEAL_DELAY_MS = 1000;

  async function handleDiscover() {
    if (!code) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const startedAt = Date.now();
    try {
      const state = await discoverSharedState(code.trim());
      await waitForRemainder(startedAt);
      setResult(state);
    } catch (err) {
      await waitForRemainder(startedAt);
      setError(
        isAxiosError(err) && err.response?.status === 404
          ? t('discover.codeNotFound')
          : t('discover.genericError'),
      );
    } finally {
      setLoading(false);
    }
  }

  function waitForRemainder(startedAt: number) {
    const remaining = REVEAL_DELAY_MS - (Date.now() - startedAt);
    return remaining > 0 ? new Promise((resolve) => setTimeout(resolve, remaining)) : Promise.resolve();
  }

  return (
    <div className="discover-page">
      <BrandMark size="lg" />

      <div className="discover-page-main">
        <div className={`card ${loading ? 'card-anticipation' : ''}`}>
          {!result && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p className="tagline text-center">{t('discover.explainPrompt')}</p>
              {error && <p className="error">{error}</p>}
              <button
                type="button"
                className="button primary gift-button"
                style={{ width: '100%' }}
                disabled={loading || !code}
                onClick={handleDiscover}
              >
                <svg
                  className={`gift-icon ${loading ? 'gift-icon-shake' : ''}`}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
                {loading ? t('discover.revealing') : t('discover.submit')}
              </button>
            </div>
          )}

          {result && (
            <div className="public-state-card text-center reveal-pop">
              <p className="hint text-fade-in" style={{ animationDelay: '150ms' }}>
                {t('discover.sharesWithYou')}
              </p>
              <h2 className="public-feeling text-fade-in" style={{ animationDelay: '300ms' }}>
                {stateCategoryName(result.categoryId, result.categoryName)}
              </h2>
            </div>
          )}

          {result && (
            <Link to="/share" className="button outline fade-in" style={{ width: '100%', marginTop: 16 }}>
              {t('login.sharePrompt')}
            </Link>
          )}
        </div>
      </div>

      <div className="discover-page-footer">
        <div className="promo-suggestion fade-in">
          <p className="promo-suggestion-label">{t('discover.wantMore')}</p>
          <p className="promo-suggestion-text">
            {t('discover.promoBefore')} <em>{t('discover.promoEmphasis')}</em> {t('discover.promoAfter')}
          </p>
          <Link to="/register" className="button outline" style={{ width: '100%' }}>
            {t('discover.createFreeAccount')}
          </Link>
        </div>

        <p className="hint">
          <Link to="/login">{t('common.backToHome')}</Link>
        </p>
      </div>
    </div>
  );
}
