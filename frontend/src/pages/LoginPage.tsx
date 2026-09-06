import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';
import BrandMark from '../components/BrandMark';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : null;
      setError(typeof message === 'string' ? message : t('login.genericError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-centered">
      <BrandMark size="lg" />
      <p className="tagline">What about us</p>

      <svg className="illustration" viewBox="0 0 240 260" width="180" height="195" fill="none">
        <path
          d="M120 244 C 118 184, 130 144, 118 94 C 110 64, 118 34, 130 14"
          stroke="var(--secondary)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M118 154 C 90 144, 70 114, 78 84"
          stroke="var(--secondary)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M122 114 C 152 106, 176 80, 172 50"
          stroke="var(--secondary)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <ellipse cx="78" cy="84" rx="17" ry="9" transform="rotate(-35 78 84)" stroke="var(--secondary)" strokeWidth="1.4" />
        <ellipse cx="172" cy="50" rx="17" ry="9" transform="rotate(35 172 50)" stroke="var(--secondary)" strokeWidth="1.4" />
        <circle cx="130" cy="14" r="7" fill="var(--accent)" />
      </svg>

      <div className="card" style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/share" className="button outline">
            {t('login.sharePrompt')}
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="section-label">{t('login.connexion')}</span>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="hint" style={{ textAlign: 'right', margin: 0 }}>
            <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
          </p>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? '...' : t('login.submit')}
          </button>
        </form>
        <p className="hint" style={{ margin: 0 }}>
          <Link to="/register">{t('login.createAccount')}</Link>
        </p>
      </div>
    </div>
  );
}
