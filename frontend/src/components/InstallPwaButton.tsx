import { useTranslation } from 'react-i18next';
import { usePwaInstall } from '../hooks/usePwaInstall';

export default function InstallPwaButton({ className = 'button outline small' }: { className?: string }) {
  const { t } = useTranslation();
  const { canInstall, install } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <button type="button" className={className} onClick={() => install()}>
      {t('pwa.installButton')}
    </button>
  );
}
