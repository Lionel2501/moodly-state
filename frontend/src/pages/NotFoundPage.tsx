import { Link } from 'react-router-dom';
import BrandMark from '../components/BrandMark';

export default function NotFoundPage() {
  return (
    <div className="page-centered">
      <BrandMark size="sm" />
      <h1 style={{ fontSize: 22, margin: 0 }}>Page introuvable</h1>
      <p className="hint">Cette page n'existe pas.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}
