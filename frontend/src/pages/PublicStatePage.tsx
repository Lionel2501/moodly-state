import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPublicState, PublicStateDto } from '../api/client';
import BrandMark from '../components/BrandMark';

export default function PublicStatePage() {
  const { username, code } = useParams<{ username: string; code: string }>();
  const [state, setState] = useState<PublicStateDto | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username || !code) return;
    fetchPublicState(username, code)
      .then(setState)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username, code]);

  if (loading) {
    return <div className="page-centered">Chargement...</div>;
  }

  if (notFound || !state) {
    return (
      <div className="page-centered">
        <BrandMark size="sm" />
        <h1 style={{ fontSize: 22, margin: 0 }}>Introuvable</h1>
        <p className="hint">Cet état n'existe pas ou plus.</p>
      </div>
    );
  }

  return (
    <div className="page-centered">
      <BrandMark size="sm" />
      <p className="hint" style={{ marginTop: 24 }}>@{state.username} te partage</p>
      <span className="public-category">{state.stepName}</span>
      <p className="public-feeling">{state.feeling}</p>
      <Link to="/register" className="button outline" style={{ width: '100%', maxWidth: 320, marginTop: 28 }}>
        Créer mon Kanjo
      </Link>
    </div>
  );
}
