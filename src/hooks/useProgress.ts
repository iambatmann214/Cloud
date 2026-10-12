import { useCallback, useEffect, useState } from 'react';
import type { QuizAttempt, UserProgress } from '../types';

const STORAGE_KEY = 'aws-academy-progress';

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedLabs: [],
  bookmarks: [],
  notes: {},
  quizAttempts: [],
  lastVisited: '',
  currentPath: 'foundations',
  theme: 'light',
  labChecklist: {},
  flashcardProgress: {},
};

function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch {
    // localStorage unavailable or corrupted
  }
  return { ...defaultProgress };
}

function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Silently fail if storage is full or unavailable
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', progress.theme);
  }, [progress.theme]);

  const toggleTheme = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(lessonId)
        ? prev.completedLessons.filter(id => id !== lessonId)
        : [...prev.completedLessons, lessonId],
    }));
  }, []);

  const markLabComplete = useCallback((labId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLabs: prev.completedLabs.includes(labId)
        ? prev.completedLabs.filter(id => id !== labId)
        : [...prev.completedLabs, labId],
    }));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setProgress(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(id)
        ? prev.bookmarks.filter(b => b !== id)
        : [...prev.bookmarks, id],
    }));
  }, []);

  const setNote = useCallback((id: string, note: string) => {
    setProgress(prev => ({
      ...prev,
      notes: { ...prev.notes, [id]: note },
    }));
  }, []);

  const recordQuizAttempt = useCallback((attempt: QuizAttempt) => {
    setProgress(prev => ({
      ...prev,
      quizAttempts: [...prev.quizAttempts, attempt],
    }));
  }, []);

  const setLastVisited = useCallback((page: string) => {
    setProgress(prev => ({
      ...prev,
      lastVisited: page,
    }));
  }, []);

  const setCurrentPath = useCallback((pathId: string) => {
    setProgress(prev => ({
      ...prev,
      currentPath: pathId,
    }));
  }, []);

  const toggleLabStep = useCallback((labId: string, stepId: string) => {
    setProgress(prev => {
      const existing = prev.labChecklist[labId] || [];
      const updated = existing.includes(stepId)
        ? existing.filter(s => s !== stepId)
        : [...existing, stepId];
      return {
        ...prev,
        labChecklist: { ...prev.labChecklist, [labId]: updated },
      };
    });
  }, []);

  const isLessonComplete = useCallback((id: string) => {
    return progress.completedLessons.includes(id);
  }, [progress.completedLessons]);

  const isBookmarked = useCallback((id: string) => {
    return progress.bookmarks.includes(id);
  }, [progress.bookmarks]);

  const getNote = useCallback((id: string) => {
    return progress.notes[id] || '';
  }, [progress.notes]);

  const getQuizAttemptsForQuestion = useCallback((questionId: string) => {
    return progress.quizAttempts.filter(a => a.questionId === questionId);
  }, [progress.quizAttempts]);

  const getTotalProgress = useCallback((totalLessons: number) => {
    if (totalLessons === 0) return 0;
    return Math.round((progress.completedLessons.length / totalLessons) * 100);
  }, [progress.completedLessons.length]);

  const clearAllData = useCallback(() => {
    setProgress({ ...defaultProgress });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  const exportData = useCallback(() => {
    const data = JSON.stringify(progress, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aws-academy-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [progress]);

  return {
    progress,
    toggleTheme,
    markLessonComplete,
    markLabComplete,
    toggleBookmark,
    setNote,
    recordQuizAttempt,
    setLastVisited,
    setCurrentPath,
    toggleLabStep,
    isLessonComplete,
    isBookmarked,
    getNote,
    getQuizAttemptsForQuestion,
    getTotalProgress,
    clearAllData,
    exportData,
  };
}
