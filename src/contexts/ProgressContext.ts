import { createContext, useContext } from 'react';
import type { QuizAttempt, UserProgress } from '../types';

interface ProgressContextType {
  progress: UserProgress;
  toggleTheme: () => void;
  markLessonComplete: (lessonId: string) => void;
  markLabComplete: (labId: string) => void;
  toggleBookmark: (id: string) => void;
  setNote: (id: string, note: string) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  setLastVisited: (page: string) => void;
  setCurrentPath: (pathId: string) => void;
  toggleLabStep: (labId: string, stepId: string) => void;
  isLessonComplete: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  getNote: (id: string) => string;
  getQuizAttemptsForQuestion: (questionId: string) => QuizAttempt[];
  getTotalProgress: (totalLessons: number) => number;
  clearAllData: () => void;
  exportData: () => void;
}

export const ProgressContext = createContext<ProgressContextType | null>(null);

export function useProgressContext() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within ProgressProvider');
  }
  return context;
}
