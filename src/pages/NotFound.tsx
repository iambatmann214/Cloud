import { Link } from 'react-router-dom';
import { Home, Search, BookOpen, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="content-container" style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <AlertCircle size={64} style={{ color: 'var(--color-aws-orange)', opacity: 0.7 }} />
      </div>
      <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>
        404
      </h1>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-tertiary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
        The page you're looking for doesn't exist or may have been moved. Try navigating from the dashboard or searching for what you need.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Home size={16} /> Dashboard
        </Link>
        <Link to="/services" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} /> Service Explorer
        </Link>
        <Link to="/paths" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={16} /> Learning Paths
        </Link>
      </div>
    </div>
  );
}
