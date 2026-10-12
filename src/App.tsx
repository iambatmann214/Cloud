import { HashRouter, Routes, Route } from 'react-router-dom';
import { ProgressContext } from './contexts/ProgressContext';
import { useProgress } from './hooks/useProgress';
import AppShell from './components/layout/AppShell';
import { lazy, Suspense } from 'react';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ServiceExplorer = lazy(() => import('./pages/ServiceExplorer'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const LearningPathsPage = lazy(() => import('./pages/LearningPathsPage'));
const LearningPathDetail = lazy(() => import('./pages/LearningPathDetail'));
const LessonDetail = lazy(() => import('./pages/LessonDetail'));
const ComparisonsPage = lazy(() => import('./pages/ComparisonsPage'));
const ComparisonDetail = lazy(() => import('./pages/ComparisonDetail'));
const ArchitecturesPage = lazy(() => import('./pages/ArchitecturesPage'));
const ArchitectureDetail = lazy(() => import('./pages/ArchitectureDetail'));
const LabsPage = lazy(() => import('./pages/LabsPage'));
const LabDetail = lazy(() => import('./pages/LabDetail'));
const TroubleshootingPage = lazy(() => import('./pages/TroubleshootingPage'));
const TroubleshootingDetail = lazy(() => import('./pages/TroubleshootingDetail'));
const QuizzesPage = lazy(() => import('./pages/QuizzesPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      color: 'var(--text-secondary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-primary)',
          borderTop: '3px solid var(--color-aws-orange)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function App() {
  const progressHook = useProgress();

  return (
    <ProgressContext.Provider value={progressHook}>
      <HashRouter>
        <AppShell>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/services" element={<ServiceExplorer />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/paths" element={<LearningPathsPage />} />
              <Route path="/paths/:pathId" element={<LearningPathDetail />} />
              <Route path="/paths/:pathId/lessons/:lessonId" element={<LessonDetail />} />
              <Route path="/comparisons" element={<ComparisonsPage />} />
              <Route path="/comparisons/:id" element={<ComparisonDetail />} />
              <Route path="/architectures" element={<ArchitecturesPage />} />
              <Route path="/architectures/:id" element={<ArchitectureDetail />} />
              <Route path="/labs" element={<LabsPage />} />
              <Route path="/labs/:id" element={<LabDetail />} />
              <Route path="/troubleshooting" element={<TroubleshootingPage />} />
              <Route path="/troubleshooting/:id" element={<TroubleshootingDetail />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppShell>
      </HashRouter>
    </ProgressContext.Provider>
  );
}

export default App;
