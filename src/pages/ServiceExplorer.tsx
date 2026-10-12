import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Server,
  Database,
  Shield,
  Cloud,
  Network,
  Monitor,
  Box,
  Zap,
  DollarSign,
  Building2,
  ArrowUpDown,
  Cpu,
  Layers,
  Wrench,
} from 'lucide-react';
import { useProgressContext } from '../contexts/ProgressContext';
import { allServices } from '../content/services';
import type { ServiceCategory, Difficulty } from '../types';

export default function ServiceExplorer() {
  const { isBookmarked, toggleBookmark, isLessonComplete, markLessonComplete } = useProgressContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'difficulty'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Derive unique categories present in dataset
  const categories = useMemo(() => {
    const set = new Set<string>();
    allServices.forEach(s => set.add(s.category));
    return ['all', ...Array.from(set).sort()];
  }, []);

  const difficulties: { label: string; value: string }[] = [
    { label: 'All Difficulties', value: 'all' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  // Filter & sort services
  const filteredServices = useMemo(() => {
    return allServices
      .filter(service => {
        // Category filter
        if (selectedCategory !== 'all' && service.category !== selectedCategory) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all' && service.difficulty !== selectedDifficulty) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const nameMatch = service.name.toLowerCase().includes(query);
          const shortNameMatch = service.shortName?.toLowerCase().includes(query);
          const taglineMatch = service.tagline.toLowerCase().includes(query);
          const searchTermsMatch = service.searchTerms?.some(t => t.toLowerCase().includes(query));
          return nameMatch || shortNameMatch || taglineMatch || searchTermsMatch;
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') {
          comp = a.name.localeCompare(b.name);
        } else if (sortBy === 'category') {
          comp = a.category.localeCompare(b.category);
        } else if (sortBy === 'difficulty') {
          const weight: Record<Difficulty, number> = { beginner: 1, intermediate: 2, advanced: 3 };
          comp = (weight[a.difficulty] || 0) - (weight[b.difficulty] || 0);
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy, sortOrder]);

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'compute':
        return <Cpu size={16} />;
      case 'storage':
        return <Server size={16} />;
      case 'database':
        return <Database size={16} />;
      case 'networking':
        return <Network size={16} />;
      case 'security':
        return <Shield size={16} />;
      case 'monitoring':
        return <Monitor size={16} />;
      case 'iac':
      case 'devops':
        return <Wrench size={16} />;
      case 'containers':
        return <Box size={16} />;
      case 'serverless':
        return <Zap size={16} />;
      case 'cost':
        return <DollarSign size={16} />;
      case 'enterprise':
        return <Building2 size={16} />;
      default:
        return <Cloud size={16} />;
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'beginner':
        return { color: 'var(--color-beginner)', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)' };
      case 'intermediate':
        return { color: 'var(--color-intermediate)', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' };
      case 'advanced':
        return { color: 'var(--color-advanced)', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)' };
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-aws-orange)', marginBottom: '8px' }}>
          <Cloud size={24} />
          <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AWS Knowledge Base
          </span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          AWS Service Explorer
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: 1.5 }}>
          Explore core AWS cloud services with hands-on architectural deep dives, CLI examples, security best practices, and decision scenarios.
        </p>
      </div>

      {/* Search & Sort Controls */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 300px',
            minWidth: '240px',
          }}
        >
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
            placeholder="Search by name, shortname, tagline, or keyword..."
            aria-label="Search AWS services"
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              borderRadius: '8px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={16} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            aria-label="Sort services by"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="difficulty">Difficulty</option>
          </select>

          <button
            onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            aria-label="Toggle sort order"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {sortOrder === 'asc' ? '▲ Asc' : '▼ Desc'}
          </button>
        </div>
      </div>

      {/* Filter Chips: Category */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Category
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isActive}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--color-aws-orange)' : '1px solid var(--border-primary)',
                  background: isActive ? 'var(--color-aws-orange)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  textTransform: cat === 'all' ? 'capitalize' : 'capitalize',
                }}
              >
                {cat !== 'all' && getCategoryIcon(cat)}
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Chips: Difficulty */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Layers size={14} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Difficulty
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {difficulties.map(diff => {
            const isActive = selectedDifficulty === diff.value;
            return (
              <button
                key={diff.value}
                onClick={() => setSelectedDifficulty(diff.value)}
                aria-pressed={isActive}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--color-cool-blue)' : '1px solid var(--border-primary)',
                  background: isActive ? 'var(--color-cool-blue)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {diff.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Reset */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Showing <strong>{filteredServices.length}</strong> of {allServices.length} services
        </span>
        {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
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
            Clear all filters
          </button>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
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
          <Search size={40} style={{ margin: '0 auto 12px', color: 'var(--text-tertiary)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No AWS services found
          </h3>
          <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto 16px' }}>
            We could not find any service matching your current search or filter combination.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredServices.map(service => {
            const isDone = isLessonComplete(service.id);
            const bookmarked = isBookmarked(service.id);
            const diffStyle = getDifficultyColor(service.difficulty);

            return (
              <div
                key={service.id}
                style={{
                  background: 'var(--bg-card)',
                  border: isDone ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-primary)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Accent top stripe */}
                <div
                  style={{
                    height: '4px',
                    width: '100%',
                    background: isDone
                      ? 'var(--color-success)'
                      : service.category === 'compute'
                      ? 'var(--color-aws-orange)'
                      : 'var(--color-cool-blue)',
                  }}
                />

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Top row: Badges & Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {/* Category Badge */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-primary)',
                        }}
                      >
                        {getCategoryIcon(service.category)}
                        {service.category}
                      </span>

                      {/* Difficulty Badge */}
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          background: diffStyle.bg,
                          color: diffStyle.color,
                          border: `1px solid ${diffStyle.border}`,
                        }}
                      >
                        {service.difficulty}
                      </span>
                    </div>

                    {/* Bookmark & Complete Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          markLessonComplete(service.id);
                        }}
                        title={isDone ? 'Mark Incomplete' : 'Mark Complete'}
                        aria-label={isDone ? `Mark ${service.name} incomplete` : `Mark ${service.name} complete`}
                        style={{
                          background: isDone ? 'rgba(34, 197, 94, 0.15)' : 'none',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px',
                          cursor: 'pointer',
                          color: isDone ? 'var(--color-success)' : 'var(--text-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.15s ease',
                        }}
                      >
                        <CheckCircle2 size={18} />
                      </button>

                      <button
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleBookmark(service.id);
                        }}
                        title={bookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                        aria-label={bookmarked ? `Remove bookmark for ${service.name}` : `Bookmark ${service.name}`}
                        style={{
                          background: bookmarked ? 'rgba(255, 153, 0, 0.15)' : 'none',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px',
                          cursor: 'pointer',
                          color: bookmarked ? 'var(--color-aws-orange)' : 'var(--text-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.15s ease',
                        }}
                      >
                        {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Title & ShortName */}
                  <Link
                    to={`/services/${service.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>{service.name}</span>
                      {service.shortName && (
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--color-aws-orange)',
                            background: 'rgba(255, 153, 0, 0.1)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {service.shortName}
                        </span>
                      )}
                    </h2>
                  </Link>

                  {/* Tagline */}
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      flex: 1,
                    }}
                  >
                    {service.tagline}
                  </p>

                  {/* Bottom Footer Link */}
                  <div
                    style={{
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      Importance:{' '}
                      <strong style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                        {service.importance}
                      </strong>
                    </span>

                    <Link
                      to={`/services/${service.id}`}
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-link)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
