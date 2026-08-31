import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';
import BrandMark from '../components/BrandMark';

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const confirmation = await register(username, email);
      setMessage(confirmation);
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : null;
      setError(
        Array.isArray(message) ? message.join(', ') : typeof message === 'string' ? message : "Inscription impossible",
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
          <h1 style={{ fontSize: 22, textAlign: 'center', margin: 0 }}>Presque prêt !</h1>
          <p style={{ textAlign: 'center' }}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-centered">
      <BrandMark size="sm" />
      <div className="card">
        <h1 style={{ fontSize: 22, margin: 0 }}>Créer un compte</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Nom d'utilisateur"
            pattern="[a-z0-9_\-]{3,24}"
            title="3 à 24 caractères : lettres minuscules, chiffres, _ ou -"
            required
          />
          <p className="hint" style={{ textAlign: 'left', margin: '-4px 0 0' }}>
            Il sera visible dans l'url que tu partages : domain/{username || 'username'}/code
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? '...' : 'Créer mon compte'}
          </button>
        </form>
        <p className="hint" style={{ marginTop: 16 }}>
          <Link to="/login">J'ai déjà un compte</Link>
        </p>
      </div>
    </div>
  );
}
