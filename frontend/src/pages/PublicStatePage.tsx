import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchPublicState, PublicStateDto } from '../api/client';
import BrandMark from '../components/BrandMark';
import { useCategoryTranslation } from '../i18n/categories';

export default function PublicStatePage() {
  const { t } = useTranslation();
  const { stateStepName, stateFeeling } = useCategoryTranslation();
  const { username, code } = useParams<{ username: string; code: string }>();
  const [state, setState] = useState<PublicStateDto | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username || !code) return;
    fetchPublicState(username, code)
      .then(setState)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username, code]);

  if (loading) {
    return <div className="page-centered">{t('common.loading')}</div>;
  }

  if (notFound || !state) {
    return (
      <div className="page-centered">
        <BrandMark size="sm" />
        <h1 style={{ fontSize: 22, margin: 0 }}>{t('publicState.notFoundTitle')}</h1>
        <p className="hint">{t('publicState.notFoundHint')}</p>
      </div>
    );
  }

  return (
    <div className="page-centered">
      <BrandMark size="sm" />
      <p className="hint" style={{ marginTop: 24 }}>
        {t('publicState.sharesWithYou', { username: state.username })}
      </p>
      <span className="public-category">{stateStepName(state.stepId, state.stepName)}</span>
      <p className="public-feeling">{stateFeeling(state.feeling)}</p>
      <Link to="/register" className="button outline" style={{ width: '100%', maxWidth: 320, marginTop: 28 }}>
        {t('publicState.createMyKanjo')}
      </Link>
    </div>
  );
}
