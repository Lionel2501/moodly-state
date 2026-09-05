import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

const LABELS: Record<string, string> = { fr: 'FR', en: 'EN', es: 'ES' };

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div className="language-switcher" role="group" aria-label={t('languageSwitcher.label')}>
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          className={`language-switcher-option${current === lng ? ' language-switcher-option-active' : ''}`}
          onClick={() => i18n.changeLanguage(lng)}
        >
          {LABELS[lng]}
        </button>
      ))}
    </div>
  );
}
