import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BrandMark from '../components/BrandMark';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="page-centered">
      <BrandMark size="sm" />
      <h1 style={{ fontSize: 22, margin: 0 }}>{t('notFound.title')}</h1>
      <p className="hint">{t('notFound.hint')}</p>
      <Link to="/">{t('common.backToHome')}</Link>
    </div>
  );
}
