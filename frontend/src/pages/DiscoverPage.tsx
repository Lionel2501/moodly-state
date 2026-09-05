import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { discoverSharedState, SharedStateDto } from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function DiscoverPage() {
  const { t } = useTranslation();
  const { stateStepName, stateFeeling } = useCategoryTranslation();
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
      <p className="tagline">{t('discover.tagline')}</p>

      <div className="card" style={{ marginTop: 8 }}>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder={t('discover.codePlaceholder')}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? '...' : t('discover.submit')}
          </button>
        </form>

        {result && (
          <div className="public-state-card" style={{ marginTop: 20 }}>
            <span className="public-category">{stateStepName(result.stepId, result.stepName)}</span>
            <h2 className="public-feeling">{stateFeeling(result.feeling)}</h2>
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
