import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/client';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const confirmation = await forgotPassword(identifier);
      setMessage(confirmation);
    } catch {
      setMessage('Si un compte existe, un email a été envoyé');
    } finally {
      setSubmitting(false);
    }
  }

  if (message) {
    return (
      <div className="page-centered">
        <div className="card">
          <h1>moodly state</h1>
          <p className="subtitle">Vérifie tes emails</p>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-centered">
      <div className="card">
        <h1>moodly state</h1>
        <p className="subtitle">Mot de passe oublié</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Nom d'utilisateur ou email
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? '...' : 'Envoyer le lien de réinitialisation'}
          </button>
        </form>
        <p className="hint">
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
