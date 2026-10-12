import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  type: 'service' | 'lesson' | 'comparison' | 'lab' | 'architecture' | 'glossary' | 'troubleshooting';
  path: string;
  category?: string;
  searchTerms?: string[];
}

interface SearchResult {
  item: SearchItem;
  score: number;
}

export function useSearch(items: SearchItem[]) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.2 },
        { name: 'searchTerms', weight: 0.3 },
        { name: 'category', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [items]);

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query, { limit: 20 }).map(r => ({
      item: r.item,
      score: r.score ?? 1,
    }));
  }, [fuse, query]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape') {
      close();
    }
  }, [results.length, close]);

  // Global keyboard shortcut
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return {
    query,
    setQuery,
    results,
    isOpen,
    open,
    close,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    inputRef,
  };
}

export type { SearchItem, SearchResult };
