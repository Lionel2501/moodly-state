import { Link } from 'react-router-dom';

export default function BrandMark({ size = 'sm', inline = false }: { size?: 'sm' | 'lg'; inline?: boolean }) {
  return (
    <Link to="/" className="brand-link">
      <div className={`brand brand-${size}${inline ? ' brand-inline' : ''}`}>
        <span className="brand-icon">
          <svg viewBox="0 0 44 44">
            <circle cx="20" cy="20" r="19" fill="var(--secondary)" />
            <circle cx="30" cy="30" r="9" fill="var(--accent)" />
          </svg>
        </span>
        <span>Kanjo</span>
      </div>
    </Link>
  );
}
