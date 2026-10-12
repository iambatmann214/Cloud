import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
  PlayCircle,
  Award,
} from 'lucide-react';
import { useProgressContext } from '../contexts/ProgressContext';
import { allLearningPaths } from '../content/learningPaths';
import type { Difficulty } from '../types';

export default function LearningPathDetail() {
  const { pathId } = useParams<{ pathId: string }>();
  const { isLessonComplete, markLessonComplete } = useProgressContext();

  const path = allLearningPaths.find(p => p.id === pathId);

  if (!path || !pathId) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Learning Path Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          The requested learning path does not exist.
        </p>
        <Link
          to="/paths"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--color-aws-orange)',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          <ChevronLeft size={18} />
          View All Learning Paths
        </Link>
      </div>
    );
  }

  const sortedLessons = [...path.lessons].sort((a, b) => a.order - b.order);
  const totalLessons = sortedLessons.length;
  const completedCount = sortedLessons.filter(l => isLessonComplete(l.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const firstUncompleted = sortedLessons.find(l => !isLessonComplete(l.id));

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'beginner':
        return { color: 'var(--color-beginner)', bg: 'rgba(34, 197, 94, 0.12)' };
      case 'intermediate':
        return { color: 'var(--color-intermediate)', bg: 'rgba(245, 158, 11, 0.12)' };
      case 'advanced':
        return { color: 'var(--color-advanced)', bg: 'rgba(239, 68, 68, 0.12)' };
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          marginBottom: '20px',
        }}
      >
        <Link to="/paths" style={{ color: 'var(--text-link)', textDecoration: 'none' }}>
          Learning Paths
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{path.title}</span>
      </nav>

      {/* Path Header */}
      <header
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-aws-orange)',
                background: 'rgba(255, 153, 0, 0.1)',
                marginBottom: '10px',
                textTransform: 'uppercase',
              }}
            >
              Curriculum Track #{path.order}
            </span>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.25,
                marginBottom: '12px',
              }}
            >
              {path.title}
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '750px' }}>
              {path.description}
            </p>
          </div>

          {/* Quick Action Button: Continue or Start */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {firstUncompleted ? (
              <Link
                to={`/paths/${path.id}/lessons/${firstUncompleted.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  background: 'var(--color-aws-orange)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <PlayCircle size={18} />
                {completedCount > 0 ? 'Continue Path' : 'Start Path'}
              </Link>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  color: 'var(--color-success)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                <Award size={18} />
                Path Completed!
              </div>
            )}
          </div>
        </div>

        {/* Prerequisites */}
        {path.prerequisites && path.prerequisites.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-primary)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-tertiary)', marginRight: '8px' }}>
              Recommended Prerequisites:
            </span>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {path.prerequisites.map((prereqId, idx) => {
                const targetPath = allLearningPaths.find(p => p.id === prereqId);
                return targetPath ? (
                  <Link
                    key={idx}
                    to={`/paths/${targetPath.id}`}
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-link)',
                      textDecoration: 'none',
                      padding: '3px 8px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '4px',
                    }}
                  >
                    {targetPath.title} →
                  </Link>
                ) : (
                  <span
                    key={idx}
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      padding: '3px 8px',
                      background: 'var(--bg-primary)',
                      borderRadius: '4px',
                    }}
                  >
                    {prereqId}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Path Progress & Meta */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-primary)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={16} color="var(--text-tertiary)" />
                {completedCount} of {totalLessons} lessons completed
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--text-tertiary)" />
                Estimated: {path.estimatedHours} hours
              </span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{progressPercent}%</span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '10px',
              background: 'var(--bg-secondary)',
              borderRadius: '5px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: progressPercent === 100 ? 'var(--color-success)' : 'var(--color-aws-orange)',
                borderRadius: '5px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </header>

      {/* Lesson List */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Curriculum Syllabus ({totalLessons} Modules)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedLessons.map((lesson, index) => {
            const isCompleted = isLessonComplete(lesson.id);
            const badge = getDifficultyBadge(lesson.difficulty);
            const isNextUp = firstUncompleted?.id === lesson.id;

            return (
              <div
                key={lesson.id}
                style={{
                  background: 'var(--bg-card)',
                  border: isNextUp
                    ? '1.5px solid var(--color-aws-orange)'
                    : isCompleted
                    ? '1px solid rgba(34, 197, 94, 0.3)'
                    : '1px solid var(--border-primary)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'background 0.15s ease',
                }}
              >
                {/* Left: Completion Checkbox & Lesson Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  {/* Completion toggle */}
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      markLessonComplete(lesson.id);
                    }}
                    aria-label={isCompleted ? `Mark lesson ${lesson.order} incomplete` : `Mark lesson ${lesson.order} complete`}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCompleted ? 'var(--color-success)' : 'var(--text-tertiary)',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                        Lesson {lesson.order}
                      </span>

                      {/* Difficulty */}
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: badge.bg,
                          color: badge.color,
                          textTransform: 'capitalize',
                        }}
                      >
                        {lesson.difficulty}
                      </span>

                      {/* Time */}
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-tertiary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Clock size={12} />
                        {lesson.estimatedMinutes} min
                      </span>

                      {isNextUp && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255, 153, 0, 0.15)',
                            color: 'var(--color-aws-orange)',
                          }}
                        >
                          Next Up
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/paths/${path.id}/lessons/${lesson.id}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: '4px',
                          lineHeight: 1.3,
                        }}
                      >
                        {lesson.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                          margin: 0,
                        }}
                      >
                        {lesson.description}
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Right: Enter Lesson Link */}
                <Link
                  to={`/paths/${path.id}/lessons/${lesson.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: isNextUp ? 'var(--color-aws-orange)' : 'var(--bg-primary)',
                    color: isNextUp ? '#ffffff' : 'var(--text-link)',
                    border: '1px solid var(--border-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isCompleted ? 'Review' : 'Open'} <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
