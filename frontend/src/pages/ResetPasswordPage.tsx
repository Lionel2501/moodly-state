import { FormEvent, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';
import BrandMark from '../components/BrandMark';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t('resetPassword.mismatch'));
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(username ?? '', token, password);
      navigate('/');
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : null;
      setError(typeof message === 'string' ? message : t('resetPassword.invalidOrExpired'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-centered">
      <BrandMark size="sm" />
      <div className="card">
        <h1 style={{ fontSize: 22, textAlign: 'center', margin: 0 }}>{t('resetPassword.title', { username })}</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="password"
            placeholder={t('resetPassword.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <input
            type="password"
            placeholder={t('resetPassword.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? '...' : t('resetPassword.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
