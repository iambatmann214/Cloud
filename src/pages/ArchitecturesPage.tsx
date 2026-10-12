import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Network, Layers, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';
import { allArchitectures } from '../content/architectures';
import { useProgressContext } from '../contexts/ProgressContext';
import type { Difficulty } from '../types';

export default function ArchitecturesPage() {
  const { progress } = useProgressContext();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArchitectures = useMemo(() => {
    return allArchitectures.filter(arch => {
      const matchesDifficulty = selectedDifficulty === 'all' || arch.difficulty === selectedDifficulty;
      const matchesQuery = !searchQuery.trim() ||
        arch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        arch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        arch.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDifficulty && matchesQuery;
    });
  }, [selectedDifficulty, searchQuery]);

  const difficultyColors: Record<Difficulty, { bg: string; color: string; border: string }> = {
    beginner: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
    intermediate: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    advanced: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
      {/* Header Banner */}
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
            background: 'rgba(255, 153, 0, 0.2)',
            border: '1px solid var(--color-aws-orange)',
            color: 'var(--color-aws-orange)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-4)',
          }}>
            <Network size={14} /> Production Blueprints
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: '#ffffff' }}>
            Reference Architectures Gallery
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: '#cbd5e1', maxWidth: '700px', lineHeight: 'var(--leading-relaxed)' }}>
            Deep-dive into battle-tested cloud architectures. Explore request flows, service tradeoffs, resilience failure modes, and security controls.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)',
      }}>
        {/* Difficulty Filter Chips */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }} role="group" aria-label="Difficulty filters">
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginRight: 'var(--space-2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Level:
          </span>
          {['all', 'beginner', 'intermediate', 'advanced'].map(diff => {
            const isActive = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                aria-pressed={isActive}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--color-aws-orange)' : '1px solid var(--border-primary)',
                  backgroundColor: isActive ? 'var(--color-aws-orange)' : 'var(--bg-card)',
                  color: isActive ? '#0f1b2d' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ minWidth: '260px', flex: '1', maxWidth: '400px' }}>
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, service, keyword..."
            aria-label="Search architectures"
            style={{
              width: '100%',
              padding: '10px 14px',
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

      {/* Grid of Architectures */}
      {filteredArchitectures.length === 0 ? (
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
            No architectures found
          </h3>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Try adjusting your search criteria or resetting the difficulty filter.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {filteredArchitectures.map(arch => {
            const diffStyle = difficultyColors[arch.difficulty];
            const isBookmarked = progress.bookmarks.includes(arch.id);

            return (
              <Link
                key={arch.id}
                to={`/architectures/${arch.id}`}
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
                {/* Header: Difficulty Badge + Bookmark indicator */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backgroundColor: diffStyle.bg,
                    color: diffStyle.color,
                    border: `1px solid ${diffStyle.border}`,
                  }}>
                    {arch.difficulty}
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
                      <Sparkles size={13} /> Bookmarked
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)',
                  lineHeight: 'var(--leading-tight)',
                }}>
                  {arch.title}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 'var(--leading-normal)',
                  marginBottom: 'var(--space-4)',
                  flex: '1',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {arch.description}
                </p>

                {/* Services Badges */}
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
                    AWS SERVICES INVOLVED:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {arch.services.map(srv => (
                      <span
                        key={srv}
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-primary)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Link Prompt */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border-primary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--color-cool-blue)',
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={15} color="var(--color-aws-orange)" />
                    {arch.requestFlow.length} flow steps
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Inspect Blueprint <ChevronRight size={16} />
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
