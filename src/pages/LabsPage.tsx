import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Clock, CheckCircle2, Circle, Filter, ChevronRight, Layers } from 'lucide-react';
import { allLabs } from '../content/labs';
import { useProgressContext } from '../contexts/ProgressContext';
import type { Difficulty } from '../types';

export default function LabsPage() {
  const { progress } = useProgressContext();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLabs = useMemo(() => {
    return allLabs
      .filter(lab => {
        const matchesDiff = selectedDifficulty === 'all' || lab.difficulty === selectedDifficulty;
        const matchesQuery = !searchQuery.trim() ||
          lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesDiff && matchesQuery;
      })
      .sort((a, b) => a.order - b.order);
  }, [selectedDifficulty, searchQuery]);

  const completedCount = useMemo(() => {
    return allLabs.filter(lab => progress.completedLabs.includes(lab.id)).length;
  }, [progress.completedLabs]);

  const diffColors: Record<Difficulty, { bg: string; color: string; border: string }> = {
    beginner: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
    intermediate: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    advanced: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
  };

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
            background: 'rgba(255, 153, 0, 0.2)',
            border: '1px solid var(--color-aws-orange)',
            color: 'var(--color-aws-orange)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-4)',
          }}>
            <Terminal size={14} /> Practical Engineering
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: '#ffffff' }}>
            Hands-On Labs
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: '#cbd5e1', maxWidth: '700px', lineHeight: 'var(--leading-relaxed)' }}>
            Step-by-step infrastructure labs using AWS CLI, Console, and CloudFormation. Master real-world provisioning, security hardening, and cleanup.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: 'var(--space-4)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
          }}>
            <span>Completed: <strong>{completedCount}</strong> of <strong>{allLabs.length}</strong> labs</span>
            <div style={{
              width: '120px',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${allLabs.length > 0 ? (completedCount / allLabs.length) * 100 : 0}%`,
                height: '100%',
                backgroundColor: 'var(--color-aws-orange)',
                borderRadius: 'var(--radius-full)',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)',
      }}>
        {/* Difficulty Filter Chips */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }} role="group" aria-label="Filter by difficulty">
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginRight: 'var(--space-2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Difficulty:
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

        {/* Search */}
        <div style={{ minWidth: '260px', flex: '1', maxWidth: '400px' }}>
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search labs by service or topic..."
            aria-label="Search labs"
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

      {/* Lab List */}
      {filteredLabs.length === 0 ? (
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
            No labs match your criteria
          </h3>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Try resetting your difficulty filters or search query.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filteredLabs.map(lab => {
            const isCompleted = progress.completedLabs.includes(lab.id);
            const diffStyle = diffColors[lab.difficulty];

            return (
              <Link
                key={lab.id}
                to={`/labs/${lab.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: isCompleted ? '1px solid var(--color-success)' : '1px solid var(--border-primary)',
                  padding: 'var(--space-5) var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast)',
                  gap: 'var(--space-5)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--color-aws-orange)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = isCompleted ? 'var(--color-success)' : 'var(--border-primary)';
                }}
              >
                {/* Lab Order / Completion Circle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isCompleted ? (
                    <CheckCircle2 size={32} color="var(--color-success)" />
                  ) : (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '2px solid var(--border-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 'var(--text-sm)',
                    }}>
                      {lab.order}
                    </div>
                  )}
                </div>

                {/* Lab Content */}
                <div style={{ flex: '1', minWidth: 0 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor: diffStyle.bg,
                      color: diffStyle.color,
                      border: `1px solid ${diffStyle.border}`,
                    }}>
                      {lab.difficulty}
                    </span>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                    }}>
                      <Clock size={12} /> {lab.estimatedMinutes} mins
                    </span>

                    {isCompleted && (
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-success)',
                        fontWeight: 600,
                      }}>
                        Completed
                      </span>
                    )}
                  </div>

                  <h2 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-1)',
                    lineHeight: 'var(--leading-tight)',
                  }}>
                    {lab.title}
                  </h2>

                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    lineHeight: 'var(--leading-normal)',
                    marginBottom: 'var(--space-3)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {lab.description}
                  </p>

                  {/* Services tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {lab.services.map(svc => (
                      <span
                        key={svc}
                        style={{
                          fontSize: 'var(--text-xs)',
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-secondary)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '1px 6px',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Arrow */}
                <div style={{ flexShrink: 0, color: 'var(--text-secondary)' }}>
                  <ChevronRight size={20} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
