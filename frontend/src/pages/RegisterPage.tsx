import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';
import BrandMark from '../components/BrandMark';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const confirmation = await register(email);
      setMessage(confirmation);
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : null;
      setError(
        Array.isArray(message) ? message.join(', ') : typeof message === 'string' ? message : t('register.genericError'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (message) {
    return (
      <div className="page-centered">
        <BrandMark size="sm" />
        <div className="card">
          <h1 style={{ fontSize: 22, textAlign: 'center', margin: 0 }}>{t('register.almostReady')}</h1>
          <p style={{ textAlign: 'center' }}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-centered">
      <BrandMark size="sm" />
      <div className="card">
        <h1 style={{ fontSize: 22, margin: 0 }}>{t('register.title')}</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder={t('register.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? '...' : t('register.submit')}
          </button>
        </form>
        <p className="hint" style={{ marginTop: 16 }}>
          <Link to="/login">{t('register.alreadyHaveAccount')}</Link>
        </p>
      </div>
    </div>
  );
}
