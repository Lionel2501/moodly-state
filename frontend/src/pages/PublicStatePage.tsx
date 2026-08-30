import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPublicState, PublicStateDto } from '../api/client';

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
        <h1>Introuvable</h1>
        <p>Ce state n'existe pas ou plus.</p>
      </div>
    );
  }

  return (
    <div className="page-centered">
      <div className="card public-state-card">
        <p className="hint">@{state.username}</p>
        <h1>{state.stepName}</h1>
        <p className="public-feeling">{state.feeling}</p>
      </div>
    </div>
  );
}
