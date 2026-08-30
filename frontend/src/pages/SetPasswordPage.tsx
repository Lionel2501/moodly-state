import { FormEvent, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';

export default function SetPasswordPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { setPassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setSubmitting(true);
    try {
      await setPassword(username ?? '', token, password);
      navigate('/');
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : null;
      setError(typeof message === 'string' ? message : 'Lien invalide ou expiré');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-centered">
      <div className="card">
        <h1>moodly state</h1>
        <p className="subtitle">Choisis ton mot de passe, {username}</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPasswordValue(e.target.value)}
              minLength={8}
              required
            />
          </label>
          <label>
            Confirmer le mot de passe
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? '...' : 'Activer mon compte'}
          </button>
        </form>
      </div>
    </div>
  );
}
