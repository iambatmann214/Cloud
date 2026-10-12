import { useState, useMemo } from 'react';
import {
  HelpCircle,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { allServices } from '../content/services';
import { allComparisons } from '../content/comparisons';
import { useProgressContext } from '../contexts/ProgressContext';
import type { QuizQuestion, ServiceCategory } from '../types';

interface QuizCategory {
  id: string;
  name: string;
  description: string;
  questions: QuizQuestion[];
}

export default function QuizzesPage() {
  const { recordQuizAttempt } = useProgressContext();

  // Gather all available questions
  const allQuestions: { question: QuizQuestion; category: string }[] = useMemo(() => {
    const list: { question: QuizQuestion; category: string }[] = [];
    const seenIds = new Set<string>();

    allServices.forEach(srv => {
      if (srv.scenarioQuestion && !seenIds.has(srv.scenarioQuestion.id)) {
        seenIds.add(srv.scenarioQuestion.id);
        list.push({ question: srv.scenarioQuestion, category: srv.category });
      }
    });

    allComparisons.forEach(cmp => {
      if (cmp.question && !seenIds.has(cmp.question.id)) {
        seenIds.add(cmp.question.id);
        list.push({ question: cmp.question, category: cmp.category });
      }
    });

    return list;
  }, []);

  // Group by category
  const categories: QuizCategory[] = useMemo(() => {
    const map = new Map<string, QuizQuestion[]>();

    allQuestions.forEach(item => {
      const cat = item.category || 'general';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item.question);
    });

    const categoryList: QuizCategory[] = [
      {
        id: 'all',
        name: 'Comprehensive Cloud Exam',
        description: 'Complete practice covering all architectural pillars and AWS service domains.',
        questions: allQuestions.map(q => q.question),
      },
    ];

    map.forEach((questions, catId) => {
      categoryList.push({
        id: catId,
        name: catId.charAt(0).toUpperCase() + catId.slice(1) + ' Mastery',
        description: `Test your architectural decisions and scenario trade-offs in ${catId}.`,
        questions,
      });
    });

    return categoryList;
  }, [allQuestions]);

  // Quiz active session state
  const [activeSession, setActiveSession] = useState<{
    categoryName: string;
    questions: QuizQuestion[];
    currentIndex: number;
    selectedAnswers: number[];
    isSubmitted: boolean;
    answersLog: { question: QuizQuestion; selected: number[]; isCorrect: boolean }[];
    isFinished: boolean;
  } | null>(null);

  // Review mistakes mode
  const [isReviewMode, setIsReviewMode] = useState(false);

  const startQuiz = (cat: QuizCategory) => {
    // Shuffle questions for freshness
    const shuffled = [...cat.questions].sort(() => Math.random() - 0.5);
    setActiveSession({
      categoryName: cat.name,
      questions: shuffled,
      currentIndex: 0,
      selectedAnswers: [],
      isSubmitted: false,
      answersLog: [],
      isFinished: false,
    });
    setIsReviewMode(false);
  };

  const currentQ = activeSession ? activeSession.questions[activeSession.currentIndex] : null;
  const isMulti = currentQ?.type === 'multi';

  const handleOptionToggle = (idx: number) => {
    if (!activeSession || activeSession.isSubmitted) return;

    if (isMulti) {
      setActiveSession(prev => {
        if (!prev) return null;
        const exists = prev.selectedAnswers.includes(idx);
        return {
          ...prev,
          selectedAnswers: exists
            ? prev.selectedAnswers.filter(i => i !== idx)
            : [...prev.selectedAnswers, idx].sort(),
        };
      });
    } else {
      setActiveSession(prev => (prev ? { ...prev, selectedAnswers: [idx] } : null));
    }
  };

  const handleSubmitAnswer = () => {
    if (!activeSession || !currentQ || activeSession.selectedAnswers.length === 0) return;

    const sortedSel = [...activeSession.selectedAnswers].sort();
    const sortedCor = [...currentQ.correctAnswers].sort();
    const isCorrect = sortedSel.length === sortedCor.length && sortedSel.every((val, i) => val === sortedCor[i]);

    recordQuizAttempt({
      questionId: currentQ.id,
      selectedAnswers: activeSession.selectedAnswers,
      correct: isCorrect,
      timestamp: Date.now(),
    });

    setActiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isSubmitted: true,
        answersLog: [
          ...prev.answersLog,
          { question: currentQ, selected: prev.selectedAnswers, isCorrect },
        ],
      };
    });
  };

  const handleNextQuestion = () => {
    if (!activeSession) return;
    if (activeSession.currentIndex + 1 >= activeSession.questions.length) {
      setActiveSession(prev => (prev ? { ...prev, isFinished: true } : null));
    } else {
      setActiveSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
          selectedAnswers: [],
          isSubmitted: false,
        };
      });
    }
  };

  const handleReviewMistakes = () => {
    if (!activeSession) return;
    const mistakes = activeSession.answersLog.filter(a => !a.isCorrect).map(a => a.question);
    if (mistakes.length === 0) return;

    setActiveSession({
      categoryName: `${activeSession.categoryName} (Review Mistakes)`,
      questions: mistakes,
      currentIndex: 0,
      selectedAnswers: [],
      isSubmitted: false,
      answersLog: [],
      isFinished: false,
    });
    setIsReviewMode(true);
  };

  // 1. ACTIVE QUIZ SESSION RENDER
  if (activeSession && !activeSession.isFinished && currentQ) {
    const isSelected = (idx: number) => activeSession.selectedAnswers.includes(idx);
    const isCorrectChoice = (idx: number) => currentQ.correctAnswers.includes(idx);

    return (
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
        {/* Top Header bar with exit */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          <div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-aws-orange)', textTransform: 'uppercase' }}>
              {activeSession.categoryName}
            </span>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Question {activeSession.currentIndex + 1} of {activeSession.questions.length}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveSession(null)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Exit Quiz
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: 'var(--space-8)',
        }}>
          <div style={{
            width: `${((activeSession.currentIndex + 1) / activeSession.questions.length) * 100}%`,
            height: '100%',
            backgroundColor: 'var(--color-aws-orange)',
            transition: 'width var(--transition-fast)',
          }} />
        </div>

        {/* Question Container Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: 'var(--space-6)',
        }}>
          {/* Question Text */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{
              display: 'inline-block',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              color: 'var(--color-cool-blue)',
              marginBottom: 'var(--space-3)',
            }}>
              {isMulti ? `Select ALL that apply (${currentQ.correctAnswers.length} choices)` : 'Select the SINGLE best answer'}
            </div>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 'var(--leading-relaxed)',
              margin: 0,
            }}>
              {currentQ.question}
            </h3>
          </div>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            {currentQ.options.map((option, idx) => {
              const selected = isSelected(idx);
              const submitted = activeSession.isSubmitted;
              const correct = isCorrectChoice(idx);

              let borderColor = 'var(--border-primary)';
              let bgColor = 'var(--bg-secondary)';
              let icon = null;

              if (submitted) {
                if (correct) {
                  borderColor = 'var(--color-success)';
                  bgColor = 'rgba(34, 197, 94, 0.08)';
                  icon = <CheckCircle2 size={18} color="var(--color-success)" />;
                } else if (selected && !correct) {
                  borderColor = 'var(--color-error)';
                  bgColor = 'rgba(239, 68, 68, 0.08)';
                  icon = <XCircle size={18} color="var(--color-error)" />;
                }
              } else if (selected) {
                borderColor = 'var(--color-aws-orange)';
                bgColor = 'rgba(255, 153, 0, 0.08)';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionToggle(idx)}
                  disabled={submitted}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-4) var(--space-5)',
                    borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 'var(--leading-normal)',
                    cursor: submitted ? 'default' : 'pointer',
                    transition: 'all var(--transition-fast)',
                    gap: 'var(--space-3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: isMulti ? '4px' : '50%',
                      border: selected ? '2px solid var(--color-aws-orange)' : '2px solid var(--border-secondary)',
                      backgroundColor: selected ? 'var(--color-aws-orange)' : 'transparent',
                      color: selected ? '#0f1b2d' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}>
                      {selected && <Check size={14} />}
                    </div>
                    <span>{option}</span>
                  </div>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          {!activeSession.isSubmitted ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={activeSession.selectedAnswers.length === 0}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activeSession.selectedAnswers.length > 0 ? 'var(--color-aws-orange)' : 'var(--bg-secondary)',
                  color: activeSession.selectedAnswers.length > 0 ? '#0f1b2d' : 'var(--text-tertiary)',
                  border: 'none',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  cursor: activeSession.selectedAnswers.length > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                Submit Answer
              </button>
            </div>
          ) : (
            /* Post-Submission Explanation */
            <div style={{
              borderTop: '1px solid var(--border-primary)',
              paddingTop: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}>
              {/* Clue and Explanation */}
              <div style={{
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
                borderLeft: '4px solid var(--color-cool-blue)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-cool-blue)',
                  marginBottom: 'var(--space-2)',
                  textTransform: 'uppercase',
                }}>
                  <Lightbulb size={16} /> Architectural Explanation
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
                  {currentQ.explanation}
                </p>
                {currentQ.decisiveClue && (
                  <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    <strong>Key Decisive Clue:</strong> {currentQ.decisiveClue}
                  </div>
                )}
              </div>

              {/* Why Others Wrong */}
              {currentQ.whyOthersWrong && currentQ.whyOthersWrong.length > 0 && (
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                    WHY DISTRACTORS ARE INCORRECT:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {currentQ.whyOthersWrong.map((why, i) => (
                      <li key={i}>{why}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Question Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-navy)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {activeSession.currentIndex + 1 >= activeSession.questions.length ? 'View Results' : 'Next Question'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. QUIZ RESULTS SUMMARY SCREEN
  if (activeSession && activeSession.isFinished) {
    const total = activeSession.answersLog.length;
    const correct = activeSession.answersLog.filter(a => a.isCorrect).length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const hasMistakes = correct < total;

    return (
      <div style={{ maxWidth: '720px', margin: '40px auto', padding: '0 var(--space-4)' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-10) var(--space-8)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <Award size={64} color={percentage >= 70 ? 'var(--color-success)' : 'var(--color-aws-orange)'} style={{ marginBottom: 'var(--space-4)' }} />

          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            {percentage >= 80 ? 'Mastery Achieved!' : percentage >= 60 ? 'Well Done!' : 'Keep Practicing!'}
          </h2>

          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            You scored <strong>{correct}</strong> out of <strong>{total}</strong> questions correctly ({percentage}%).
          </p>

          {/* Progress circle metric */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            border: `6px solid ${percentage >= 70 ? 'var(--color-success)' : 'var(--color-aws-orange)'}`,
            fontSize: 'var(--text-3xl)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-8)',
          }}>
            {percentage}%
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            {hasMistakes && (
              <button
                type="button"
                onClick={handleReviewMistakes}
                style={{
                  padding: '12px 22px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--color-error)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <RotateCcw size={16} /> Review Mistakes ({total - correct})
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveSession(null)}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-aws-orange)',
                color: '#0f1b2d',
                border: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Back to Quiz Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. QUIZ HUB VIEW
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-charcoal) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        color: '#ffffff',
        marginBottom: 'var(--space-8)',
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
          <HelpCircle size={14} /> Knowledge Validation
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: '#ffffff' }}>
          Interactive Architectural Quizzes
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: '#cbd5e1', maxWidth: '700px', lineHeight: 'var(--leading-relaxed)' }}>
          Scenario-driven questions calibrated against real AWS certification and systems architecture interview standards.
        </p>
      </div>

      {/* Categories Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 'var(--space-6)',
      }}>
        {categories.map(cat => (
          <div
            key={cat.id}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-aws-orange)',
                backgroundColor: 'rgba(255, 153, 0, 0.1)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
              }}>
                {cat.questions.length} Scenario Questions
              </span>
            </div>

            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
              {cat.name}
            </h2>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-normal)', marginBottom: 'var(--space-6)', flex: '1' }}>
              {cat.description}
            </p>

            <button
              type="button"
              onClick={() => startQuiz(cat)}
              disabled={cat.questions.length === 0}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: cat.questions.length > 0 ? 'var(--color-navy)' : 'var(--bg-secondary)',
                color: cat.questions.length > 0 ? '#ffffff' : 'var(--text-tertiary)',
                border: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: cat.questions.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Launch Quiz Session <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
