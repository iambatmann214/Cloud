import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, AlertTriangle, ChevronRight, Search, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { allTroubleshootingFlows } from '../content/troubleshooting';
import { useProgressContext } from '../contexts/ProgressContext';

export default function TroubleshootingPage() {
  const { progress } = useProgressContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlows = useMemo(() => {
    if (!searchQuery.trim()) return allTroubleshootingFlows;
    const q = searchQuery.toLowerCase();
    return allTroubleshootingFlows.filter(flow =>
      flow.title.toLowerCase().includes(q) ||
      flow.symptom.toLowerCase().includes(q) ||
      flow.impact.toLowerCase().includes(q) ||
      flow.causes.some(c => c.cause.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-charcoal) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        color: '#ffffff',
        marginBottom: 'var(--space-8)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid var(--color-error)',
            color: '#fca5a5',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-4)',
          }}>
            <Wrench size={14} /> Production Incident Resolution
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: '#ffffff' }}>
            Diagnostic & Troubleshooting Guides
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: '#cbd5e1', maxWidth: '720px', lineHeight: 'var(--leading-relaxed)' }}>
            Systematic runbooks for the most notorious AWS operational outages. Inspect root causes, diagnostic verification commands, safe remediations, and architectural preventions.
          </p>
        </div>
      </div>

      {/* Search Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredFlows.length}</strong> incident scenarios
        </div>

        <div style={{ position: 'relative', minWidth: '280px', flex: '1', maxWidth: '420px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, errors, or services..."
            aria-label="Search troubleshooting guides"
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Grid of Diagnostic Scenarios */}
      {filteredFlows.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-12)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-secondary)',
        }}>
          <Layers size={48} style={{ opacity: 0.3, marginBottom: 'var(--space-4)' }} />
          <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            No incident guides match your search
          </h3>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Try searching for terms like "timeout", "permission denied", "EC2", or "database".
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {filteredFlows.map(flow => {
            const isBookmarked = progress.bookmarks.includes(flow.id);
            const highLikelihoodCount = flow.causes.filter(c => c.likelihood === 'high').length;

            return (
              <Link
                key={flow.id}
                to={`/troubleshooting/${flow.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-primary)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast)',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--color-aws-orange)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                }}
              >
                {/* Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--color-error)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                  }}>
                    <ShieldAlert size={12} /> {flow.causes.length} Potential Causes
                  </span>

                  {isBookmarked && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-aws-orange)',
                      fontWeight: 600,
                    }}>
                      <Sparkles size={12} /> Saved
                    </span>
                  )}
                </div>

                {/* Symptom Title */}
                <h2 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)',
                  lineHeight: 'var(--leading-tight)',
                }}>
                  {flow.title}
                </h2>

                {/* Impact Statement Preview */}
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-3)',
                  marginBottom: 'var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  lineHeight: 'var(--leading-normal)',
                  flex: '1',
                }}>
                  <strong style={{ color: 'var(--color-error)' }}>Impact: </strong>
                  {flow.impact}
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border-secondary)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-cool-blue)',
                  fontWeight: 600,
                }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>
                    {highLikelihoodCount} High Likelihood
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Open Diagnostic Runbook <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
