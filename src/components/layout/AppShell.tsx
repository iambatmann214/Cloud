import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import SearchModal from './SearchModal';
import type { SearchItem } from './SearchModal';
import { useProgressContext } from '../../contexts/ProgressContext';
import { allServices } from '../../content/services';
import { allComparisons } from '../../content/comparisons';
import { allLearningPaths } from '../../content/learningPaths';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { progress, toggleTheme, getTotalProgress } = useProgressContext();
  const navigate = useNavigate();
  const location = useLocation();

  const totalLessons = useMemo(() => {
    return allLearningPaths.reduce((acc, p) => acc + p.lessons.length, 0);
  }, []);

  const progressPercent = getTotalProgress(totalLessons);

  const searchItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];
    allServices.forEach(s => {
      items.push({
        id: s.id,
        title: s.shortName || s.name,
        description: s.tagline,
        type: 'Service',
        url: `/services/${s.id}`,
        category: s.category,
      });
    });
    allComparisons.forEach(c => {
      items.push({
        id: c.id,
        title: c.title,
        description: c.problem,
        type: 'Comparison',
        url: `/comparisons/${c.id}`,
        category: c.category,
      });
    });
    allLearningPaths.forEach(p => {
      items.push({
        id: p.id,
        title: p.title,
        description: p.description,
        type: 'Lesson',
        url: `/paths/${p.id}`,
      });
      p.lessons.forEach(l => {
        items.push({
          id: l.id,
          title: l.title,
          description: l.description,
          type: 'Lesson',
          url: `/paths/${p.id}/lessons/${l.id}`,
        });
      });
    });
    return items;
  }, []);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    setSearchOpen(false);
  }, [navigate]);

  const currentPath = location.pathname;

  return (
    <div className="app-shell">
      <TopBar
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isMenuOpen={sidebarOpen}
        onSearchOpen={() => setSearchOpen(true)}
        theme={progress.theme}
        onThemeToggle={toggleTheme}
        progressPercent={progressPercent}
      />
      <div className="app-body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPath={currentPath}
        />
        <main className="main-content with-sidebar" role="main">
          {children}
        </main>
      </div>
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={searchItems}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
