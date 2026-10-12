import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Server,
  BookOpen,
  GitCompare,
  Building,
  FlaskConical,
  Wrench,
  Brain,
  BookA,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export type SearchItemType =
  | 'Service'
  | 'Lesson'
  | 'Comparison'
  | 'Architecture'
  | 'Lab'
  | 'Troubleshooting'
  | 'Quiz'
  | 'Glossary';

export interface SearchItem {
  id: string;
  title: string;
  description?: string;
  type: SearchItemType;
  url: string;
  category?: string;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SearchItem[];
  onNavigate: (url: string) => void;
}

const TYPE_ICONS: Record<
  SearchItemType,
  React.ComponentType<{ size?: number; style?: React.CSSProperties }>
> = {
  Service: Server,
  Lesson: BookOpen,
  Comparison: GitCompare,
  Architecture: Building,
  Lab: FlaskConical,
  Troubleshooting: Wrench,
  Quiz: Brain,
  Glossary: BookA,
};

const TYPE_BADGE_COLORS: Record<SearchItemType, { bg: string; text: string }> = {
  Service: { bg: '#e0f2fe', text: '#0369a1' },
  Lesson: { bg: '#dcfce7', text: '#15803d' },
  Comparison: { bg: '#fef3c7', text: '#b45309' },
  Architecture: { bg: '#ede9fe', text: '#6d28d9' },
  Lab: { bg: '#fee2e2', text: '#b91c1c' },
  Troubleshooting: { bg: '#ffedd5', text: '#c2410c' },
  Quiz: { bg: '#f3e8ff', text: '#7e22ce' },
  Glossary: { bg: '#f1f5f9', text: '#475569' },
};

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items = [],
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsListRef = useRef<HTMLDivElement>(null);

  // Suggested keywords when search is empty
  const suggestedQueries = ['EC2', 'S3', 'VPC', 'DynamoDB', 'Lambda', 'Serverless', 'Terraform'];

  // Reset query and focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Filter items matching query
  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }
    return items.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(trimmed);
      const matchDesc = item.description?.toLowerCase().includes(trimmed);
      const matchCategory = item.category?.toLowerCase().includes(trimmed);
      const matchType = item.type.toLowerCase().includes(trimmed);
      return matchTitle || matchDesc || matchCategory || matchType;
    });
  }, [items, query]);

  // Group items by type for grouped display
  const groupedResults = useMemo(() => {
    const map = new Map<SearchItemType, SearchItem[]>();
    filteredItems.forEach((item) => {
      const existing = map.get(item.type) || [];
      existing.push(item);
      map.set(item.type, existing);
    });
    return map;
  }, [filteredItems]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsListRef.current) {
      const activeEl = resultsListRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems.length > 0 && filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex].url);
      }
    }
  };

  const handleSelectItem = (url: string) => {
    onNavigate(url);
    onClose();
  };

  if (!isOpen) return null;

  // Compute item index map for keyboard selection mapping across groups
  let runningIndex = 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search AWS Academy Content"
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 16px 16px',
      }}
    >
      {/* Dark backdrop */}
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 27, 45, 0.75)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal Dialog Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '640px',
          maxHeight: 'calc(100vh - 100px)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl, 16px)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 101,
          animation: 'searchFadeIn 150ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-card)',
            gap: '12px',
          }}
        >
          <Search size={20} style={{ color: 'var(--color-aws-orange)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, lessons, labs, architectures..."
            aria-label="Search query"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 'var(--text-base, 1rem)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50%',
              }}
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search dialog"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-sm, 4px)',
              color: 'var(--text-secondary)',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div
          ref={resultsListRef}
          style={{
            overflowY: 'auto',
            padding: '12px',
            flex: 1,
            maxHeight: '440px',
          }}
        >
          {/* Case 1: Empty Query - Show Quick Suggestions */}
          {!query && (
            <div style={{ padding: '16px 8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-tertiary)',
                  fontSize: 'var(--text-xs, 0.75rem)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px',
                }}
              >
                <Sparkles size={14} style={{ color: 'var(--color-aws-orange)' }} />
                <span>Popular Topics</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {suggestedQueries.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full, 9999px)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm, 0.875rem)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                      e.currentTarget.style.borderColor = 'var(--color-aws-orange)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                      e.currentTarget.style.borderColor = 'var(--border-primary)';
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-tertiary)',
                  fontSize: 'var(--text-xs, 0.75rem)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px',
                }}
              >
                <Clock size={14} />
                <span>Quick Navigation</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: 'All 20 Learning Paths', url: '/paths' },
                  { label: 'AWS Services Directory', url: '/services' },
                  { label: 'Architectures & System Diagrams', url: '/architectures' },
                  { label: 'Service Comparisons', url: '/comparisons' },
                  { label: 'Hands-on Labs', url: '/labs' },
                ].map((item) => (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => handleSelectItem(item.url)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md, 8px)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm, 0.875rem)',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Case 2: Query has no matches */}
          {query && filteredItems.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 16px',
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: 'var(--text-tertiary)',
                }}
              >
                <Search size={24} />
              </div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p style={{ fontSize: 'var(--text-sm, 0.875rem)' }}>
                Try searching for service names (EC2, S3), concepts, or architecture patterns.
              </p>
            </div>
          )}

          {/* Case 3: Grouped Search Results */}
          {query && filteredItems.length > 0 && (
            <div>
              {Array.from(groupedResults.entries()).map(([type, typeItems]) => (
                <div key={type} style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-tertiary)',
                      padding: '4px 8px',
                      marginBottom: '4px',
                    }}
                  >
                    {type}s ({typeItems.length})
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {typeItems.map((item) => {
                      const itemFlatIndex = runningIndex++;
                      const isSelected = itemFlatIndex === selectedIndex;
                      const Icon = TYPE_ICONS[item.type] || Server;
                      const badgeTheme = TYPE_BADGE_COLORS[item.type] || {
                        bg: 'var(--bg-secondary)',
                        text: 'var(--text-secondary)',
                      };

                      return (
                        <div
                          key={item.id}
                          data-index={itemFlatIndex}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleSelectItem(item.url)}
                          onMouseEnter={() => setSelectedIndex(itemFlatIndex)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-md, 8px)',
                            background: isSelected ? 'var(--bg-active)' : 'transparent',
                            border: isSelected
                              ? '1px solid var(--color-aws-orange)'
                              : '1px solid transparent',
                            cursor: 'pointer',
                            transition: 'background var(--transition-fast)',
                          }}
                        >
                          {/* Item Icon */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: 'var(--radius-md, 8px)',
                              background: isSelected
                                ? 'var(--color-aws-orange)'
                                : 'var(--bg-secondary)',
                              color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            <Icon size={16} />
                          </div>

                          {/* Item Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: 'var(--text-sm, 0.875rem)',
                                  color: 'var(--text-primary)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.title}
                              </span>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  padding: '2px 6px',
                                  borderRadius: 'var(--radius-full, 9999px)',
                                  background: badgeTheme.bg,
                                  color: badgeTheme.text,
                                  textTransform: 'uppercase',
                                  flexShrink: 0,
                                }}
                              >
                                {item.type}
                              </span>
                            </div>

                            {item.description && (
                              <p
                                style={{
                                  fontSize: 'var(--text-xs, 0.75rem)',
                                  color: 'var(--text-secondary)',
                                  margin: '3px 0 0',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with Keyboard Shortcuts Hint */}
        <div
          style={{
            padding: '10px 18px',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs, 0.75rem)',
            color: 'var(--text-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>
              <kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', borderRadius: '3px' }}>↑</kbd>{' '}
              <kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', borderRadius: '3px' }}>↓</kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', borderRadius: '3px' }}>↵</kbd>{' '}
              Select
            </span>
            <span>
              <kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', borderRadius: '3px' }}>ESC</kbd>{' '}
              Close
            </span>
          </div>
          <div>{filteredItems.length > 0 ? `${filteredItems.length} results` : ''}</div>
        </div>
      </div>

      <style>{`
        @keyframes searchFadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SearchModal;
