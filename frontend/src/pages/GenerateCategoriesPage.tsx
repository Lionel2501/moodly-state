import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, Step } from '../api/client';

export default function GenerateCategoriesPage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setSteps)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <header className="topbar">
        <h1>moodly state</h1>
        <Link to="/" className="link-button">
          Annuler
        </Link>
      </header>
      <main className="content">
        <h2>Choisis une catégorie</h2>
        {loading && <p>Chargement...</p>}
        <div className="category-grid">
          {steps.map((step) => (
            <Link key={step.id} to={`/generate/${step.id}`} className="button category-button">
              {step.name}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
