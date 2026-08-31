import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/client';
import BrandMark from '../components/BrandMark';

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
        <BrandMark size="sm" />
        <div className="card">
          <h1 style={{ fontSize: 22, textAlign: 'center', margin: 0 }}>Vérifie tes emails</h1>
          <p style={{ textAlign: 'center' }}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-centered">
      <BrandMark size="sm" />
      <div className="card">
        <h1 style={{ fontSize: 22, textAlign: 'center', margin: 0 }}>Mot de passe oublié</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Nom d'utilisateur ou email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? '...' : 'Envoyer le lien'}
          </button>
        </form>
        <p className="hint" style={{ marginTop: 16 }}>
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
