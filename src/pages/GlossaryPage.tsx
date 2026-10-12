import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, Hash, ExternalLink } from 'lucide-react';
import { allGlossaryEntries } from '../content/glossary';

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allGlossaryEntries.forEach(item => set.add(item.category));
    return ['all', ...Array.from(set).sort()];
  }, []);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return allGlossaryEntries.filter(entry => {
      const matchesCat = selectedCategory === 'all' || entry.category === selectedCategory;
      const matchesQuery = !searchQuery.trim() ||
        entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.relatedTerms.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Group terms by first letter (A-Z)
  const groupedByLetter = useMemo(() => {
    const groups: Record<string, typeof allGlossaryEntries> = {};
    filteredTerms.forEach(entry => {
      const firstLetter = entry.term.charAt(0).toUpperCase();
      const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });

    // Sort terms inside each group
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.term.localeCompare(b.term));
    });

    return groups;
  }, [filteredTerms]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const activeLetters = new Set(Object.keys(groupedByLetter));

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-charcoal) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        color: '#ffffff',
        marginBottom: 'var(--space-6)',
        boxShadow: 'var(--shadow-md)',
      }}>
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
          marginBottom: 'var(--space-4)',
        }}>
          <BookOpen size={14} /> Cloud Terminology Index
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: '#ffffff' }}>
          AWS Architectural Glossary
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: '#cbd5e1', maxWidth: '700px', lineHeight: 'var(--leading-relaxed)' }}>
          Authoritative definitions of critical cloud primitives, architectures, acronyms, and distributed computing design patterns.
        </p>
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
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '280px', flex: '1', maxWidth: '440px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search acronyms, definitions, services..."
            aria-label="Search glossary terms"
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

        {/* Category chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={14} color="var(--text-secondary)" />
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isSelected}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--color-aws-orange)' : '1px solid var(--border-primary)',
                  backgroundColor: isSelected ? 'var(--color-aws-orange)' : 'var(--bg-card)',
                  color: isSelected ? '#0f1b2d' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* A-Z Letter Navigation Bar */}
      <nav aria-label="Alphabetical index" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        backgroundColor: 'var(--bg-card)',
        padding: '10px 16px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-primary)',
        marginBottom: 'var(--space-8)',
        justifyContent: 'center',
      }}>
        {alphabet.map(letter => {
          const hasTerms = activeLetters.has(letter);
          return (
            <button
              key={letter}
              type="button"
              disabled={!hasTerms}
              onClick={() => scrollToLetter(letter)}
              aria-label={`Jump to letter ${letter}`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: hasTerms ? 'var(--bg-secondary)' : 'transparent',
                color: hasTerms ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontWeight: 700,
                fontSize: 'var(--text-xs)',
                cursor: hasTerms ? 'pointer' : 'default',
                opacity: hasTerms ? 1 : 0.4,
              }}
            >
              {letter}
            </button>
          );
        })}
      </nav>

      {/* Grouped Terms Listing */}
      {Object.keys(groupedByLetter).length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-12)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-secondary)',
        }}>
          <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            No glossary entries match your search
          </h3>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Try clearing your search query or selecting "All" categories.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {alphabet.filter(l => groupedByLetter[l]).map(letter => (
            <section key={letter} id={`letter-${letter}`} aria-labelledby={`header-${letter}`}>
              {/* Section Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-4)',
                borderBottom: '2px solid var(--color-aws-orange)',
                paddingBottom: '4px',
              }}>
                <span id={`header-${letter}`} style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 800,
                  color: 'var(--color-aws-orange)',
                }}>
                  {letter}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  ({groupedByLetter[letter].length} terms)
                </span>
              </div>

              {/* Term Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 'var(--space-4)',
              }}>
                {groupedByLetter[letter].map(entry => (
                  <div
                    key={entry.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-primary)',
                      padding: 'var(--space-5)',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                      <h3 style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}>
                        {entry.term}
                      </h3>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--color-cool-blue)',
                        border: '1px solid var(--border-secondary)',
                      }}>
                        {entry.category}
                      </span>
                    </div>

                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      lineHeight: 'var(--leading-relaxed)',
                      marginBottom: 'var(--space-4)',
                      flex: '1',
                    }}>
                      {entry.definition}
                    </p>

                    {/* Related terms as links */}
                    {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                      <div style={{
                        paddingTop: 'var(--space-3)',
                        borderTop: '1px solid var(--border-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                          Related:
                        </span>
                        {entry.relatedTerms.map((rel, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => setSearchQuery(rel)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(33, 150, 243, 0.08)',
                              color: 'var(--color-cool-blue)',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}
                          >
                            {rel}
                          </button>
                        ))}
                      </div>
                    )}

                    {entry.learnMoreLink && (
                      <div style={{ marginTop: 'var(--space-2)' }}>
                        <Link
                          to={entry.learnMoreLink}
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-aws-orange)',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          Deep-dive service <ExternalLink size={10} />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
