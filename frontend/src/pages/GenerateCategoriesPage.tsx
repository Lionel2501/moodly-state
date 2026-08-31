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
        <Link to="/" className="back-link">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Choisis ton état
        </Link>
      </header>
      <main className="content">
        {loading && <p className="hint">Chargement...</p>}
        <div className="category-grid">
          {steps.map((step) => (
            <Link key={step.id} to={`/generate/${step.id}`} className="button category-button">
              <span className="category-button-text">
                <span className="category-button-name">{step.name}</span>
                <span className="category-button-description">{step.description}</span>
              </span>
              <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
