import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : null;
      setError(
        Array.isArray(message) ? message.join(', ') : typeof message === 'string' ? message : "Inscription impossible",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-centered">
      <div className="card">
        <h1>moodly state</h1>
        <p className="subtitle">Créer un compte</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Nom d'utilisateur
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="ex: lionel"
              pattern="[a-z0-9_\-]{3,24}"
              title="3 à 24 caractères : lettres minuscules, chiffres, _ ou -"
              required
            />
          </label>
          <p className="hint">
            Il sera visible dans l'url que tu partages : domain/{username || 'username'}/code
          </p>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? '...' : 'Créer mon compte'}
          </button>
        </form>
        <p className="hint">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
