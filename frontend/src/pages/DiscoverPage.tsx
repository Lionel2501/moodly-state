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

  async function handleDiscover() {
    if (!code) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const state = await discoverSharedState(code.trim());
      setResult(state);
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 404
          ? t('discover.codeNotFound')
          : t('discover.genericError'),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-centered">
      <BrandMark size="lg" />

      <div className="card" style={{ marginTop: 8 }}>
        {!result && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p className="tagline">{t('discover.explainPrompt')}</p>
            {error && <p className="error">{error}</p>}
            <button
              type="button"
              className="button primary"
              style={{ width: '100%' }}
              disabled={loading || !code}
              onClick={handleDiscover}
            >
              {loading ? '...' : t('discover.submit')}
            </button>
          </div>
        )}

        {result && (
          <div className="public-state-card fade-in">
            <h2 className="public-feeling">{stateCategoryName(result.categoryId, result.categoryName)}</h2>
          </div>
        )}

        <div className="divider">
          <span>{t('discover.wantMore')}</span>
        </div>

        <div className="promo-card">
          <p>
            {t('discover.promoBefore')} <em>{t('discover.promoEmphasis')}</em> {t('discover.promoAfter')}
          </p>
          <Link to="/register" className="button primary" style={{ width: '100%' }}>
            {t('discover.createFreeAccount')}
          </Link>
        </div>

        <p className="hint" style={{ marginTop: 16 }}>
          <Link to="/login">{t('common.backToHome')}</Link>
        </p>
      </div>
    </div>
  );
}
