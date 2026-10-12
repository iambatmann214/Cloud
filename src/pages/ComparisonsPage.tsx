import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight,
  GitCompare,
  Layers,
  Scale,
  Sparkles,
  Server,
  Database,
  Shield,
  Network,
  Cpu,
  Zap,
} from 'lucide-react';
import { allComparisons } from '../content/comparisons';

export default function ComparisonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    allComparisons.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return ['all', ...Array.from(set).sort()];
  }, []);

  const filteredComparisons = useMemo(() => {
    return allComparisons.filter(comp => {
      if (selectedCategory !== 'all' && comp.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = comp.title.toLowerCase().includes(query);
        const problemMatch = comp.problem.toLowerCase().includes(query);
        const aMatch = comp.serviceA?.toLowerCase().includes(query);
        const bMatch = comp.serviceB?.toLowerCase().includes(query);
        return titleMatch || problemMatch || aMatch || bMatch;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-aws-orange)', marginBottom: '8px' }}>
          <Scale size={24} />
          <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Decision Frameworks
          </span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          AWS Architecture & Service Comparisons
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: 1.5 }}>
          Clear architectural face-offs, decisive differences, tradeoffs, and practical scenarios to guide your AWS service selection.
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
            }}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search comparisons (e.g. SQS vs SNS, DynamoDB vs RDS, ECS vs EKS)..."
            aria-label="Search comparisons"
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              borderRadius: '8px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Filter by Domain
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isActive}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--color-aws-orange)' : '1px solid var(--border-primary)',
                  background: isActive ? 'var(--color-aws-orange)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  textTransform: 'capitalize',
                }}
              >
                {cat === 'all' ? 'All Comparisons' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Count and Clear */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Showing <strong>{filteredComparisons.length}</strong> of {allComparisons.length} comparisons
        </span>
        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-aws-orange)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Comparisons Grid */}
      {filteredComparisons.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <Scale size={40} style={{ margin: '0 auto 12px', color: 'var(--text-tertiary)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No comparisons found
          </h3>
          <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto 16px' }}>
            Try searching with broader terms or selecting all categories.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'var(--color-aws-orange)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredComparisons.map(comp => (
            <Link
              key={comp.id}
              to={`/comparisons/${comp.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                <div>
                  {/* Category Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background: 'rgba(33, 150, 243, 0.1)',
                        color: 'var(--color-cool-blue)',
                        border: '1px solid rgba(33, 150, 243, 0.2)',
                      }}
                    >
                      {comp.category}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GitCompare size={14} />
                      Head-to-head
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                      marginBottom: '10px',
                    }}
                  >
                    {comp.title}
                  </h2>

                  {/* Problem Summary */}
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {comp.problem}
                  </p>
                </div>

                {/* Card Footer */}
                <div
                  style={{
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    {comp.tradeoffs?.length || 0} tradeoffs analyzed
                  </span>

                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-aws-orange)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Compare Details <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
