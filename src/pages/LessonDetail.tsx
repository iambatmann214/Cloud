import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Copy,
  Check,
  Lightbulb,
  Layers,
  FileEdit,
} from 'lucide-react';
import { useProgressContext } from '../contexts/ProgressContext';
import { allLearningPaths } from '../content/learningPaths';
import type { Difficulty, ContentSection } from '../types';

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: 'var(--bg-code-block)',
        color: 'var(--text-code-block)',
        padding: '16px',
        borderRadius: '8px',
        position: 'relative',
        overflowX: 'auto',
        fontSize: '14px',
        fontFamily: 'var(--font-mono)',
        border: '1px solid var(--border-primary)',
        marginTop: '12px',
        marginBottom: '16px',
      }}
    >
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#9ca3af',
          border: 'none',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {copied ? (
          <>
            <Check size={12} color="#22c55e" />
            <span style={{ color: '#22c55e' }}>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={12} />
            <span>Copy</span>
          </>
        )}
      </button>
      {language && (
        <span
          style={{
            position: 'absolute',
            top: 8,
            left: 12,
            color: '#6b7280',
            fontSize: '11px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {language}
        </span>
      )}
      <pre style={{ margin: language ? '20px 0 0' : 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionRenderer({ section }: { section: ContentSection }) {
  return (
    <section
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
      }}
    >
      {section.title && (
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}
        >
          {section.title}
        </h3>
      )}

      {/* Render based on section type */}
      {section.type === 'text' && (
        <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
          {section.content}
        </div>
      )}

      {section.type === 'callout' && (
        <div
          style={{
            background: 'rgba(255, 153, 0, 0.08)',
            borderLeft: '4px solid var(--color-aws-orange)',
            padding: '16px 20px',
            borderRadius: '0 8px 8px 0',
            fontSize: '15px',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--color-aws-orange)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
            <Lightbulb size={16} /> Key Architectural Concept
          </div>
          <div>{section.content}</div>
        </div>
      )}

      {section.type === 'code' && (
        <div>
          {section.content && !section.content.startsWith('#') && !section.content.startsWith('//') && (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Reference implementation:
            </p>
          )}
          <CodeBlock code={section.content} language={section.language || 'bash'} />
        </div>
      )}

      {section.type === 'table' && (
        <div>
          {section.content && (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {section.content}
            </p>
          )}
          {section.tableData && (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                  textAlign: 'left',
                }}
              >
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-primary)' }}>
                    {section.tableData.headers.map((head, idx) => (
                      <th
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          color: 'var(--text-primary)',
                          fontWeight: 700,
                        }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.tableData.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      style={{
                        borderBottom: '1px solid var(--border-primary)',
                        background: rIdx % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                      }}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          style={{
                            padding: '10px 14px',
                            color: cIdx === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: cIdx === 0 ? 600 : 400,
                            lineHeight: 1.5,
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {section.type === 'steps' && (
        <div>
          {section.content && (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {section.content}
            </p>
          )}
          {section.steps && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {section.steps.map((st, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'var(--bg-primary)',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--color-aws-orange)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {sIdx + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {st.title}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {st.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section.type === 'diagram' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--color-cool-blue)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            <Layers size={14} /> Architecture Diagram
          </div>
          <CodeBlock code={section.content} language="mermaid" />
        </div>
      )}

      {section.type === 'comparison' && (
        <div
          style={{
            background: 'var(--bg-primary)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          {section.content}
        </div>
      )}
    </section>
  );
}

export default function LessonDetail() {
  const { pathId, lessonId } = useParams<{ pathId: string; lessonId: string }>();
  const {
    isBookmarked,
    toggleBookmark,
    isLessonComplete,
    markLessonComplete,
    getNote,
    setNote,
  } = useProgressContext();

  const path = allLearningPaths.find(p => p.id === pathId);
  const sortedLessons = path ? [...path.lessons].sort((a, b) => a.order - b.order) : [];
  const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);
  const lesson = currentIndex !== -1 ? sortedLessons[currentIndex] : null;

  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;

  const [noteText, setNoteText] = useState(() => (lessonId ? getNote(lessonId) : ''));
  const [noteSaved, setNoteSaved] = useState(false);

  if (!path || !lesson || !lessonId || !pathId) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Lesson Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          The requested lesson does not exist in this learning path.
        </p>
        <Link
          to={path ? `/paths/${path.id}` : '/paths'}
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
          {path ? `Back to ${path.title}` : 'Back to Paths'}
        </Link>
      </div>
    );
  }

  const isCompleted = isLessonComplete(lesson.id);
  const bookmarked = isBookmarked(lesson.id);

  const handleSaveNote = () => {
    setNote(lesson.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

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

  const diffBadge = getDifficultyBadge(lesson.difficulty);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
      {/* 1. Breadcrumbs */}
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
        <Link to={`/paths/${path.id}`} style={{ color: 'var(--text-link)', textDecoration: 'none' }}>
          {path.title}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Lesson {lesson.order}</span>
      </nav>

      {/* 2. Lesson Header */}
      <header
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-aws-orange)',
                background: 'rgba(255, 153, 0, 0.1)',
              }}
            >
              Module {lesson.order} of {sortedLessons.length}
            </span>

            {/* Difficulty Badge */}
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'capitalize',
                background: diffBadge.bg,
                color: diffBadge.color,
              }}
            >
              {lesson.difficulty}
            </span>

            {/* Time */}
            <span
              style={{
                fontSize: '13px',
                color: 'var(--text-tertiary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Clock size={14} />
              {lesson.estimatedMinutes} minutes
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => toggleBookmark(lesson.id)}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-primary)',
                background: bookmarked ? 'rgba(255, 153, 0, 0.15)' : 'var(--bg-primary)',
                color: bookmarked ? 'var(--color-aws-orange)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>

            <button
              onClick={() => markLessonComplete(lesson.id)}
              aria-label={isCompleted ? 'Mark lesson incomplete' : 'Mark lesson complete'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isCompleted ? 'var(--color-success)' : 'var(--color-aws-orange)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <CheckCircle2 size={16} />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>

        <h1
          style={{
            fontSize: '30px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            marginBottom: '10px',
          }}
        >
          {lesson.title}
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {lesson.description}
        </p>
      </header>

      {/* 3. Content Sections */}
      <div>
        {lesson.content && lesson.content.sections && lesson.content.sections.map(sec => (
          <SectionRenderer key={sec.id} section={sec} />
        ))}
      </div>

      {/* 4. Notes Section */}
      <section
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileEdit size={18} color="var(--color-aws-orange)" />
            Lesson Study Notes
          </h3>
          {noteSaved && (
            <span style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>
              ✓ Saved!
            </span>
          )}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Record your insights, commands to remember, or key exam patterns.
        </p>
        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Type notes for this lesson..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'var(--font-sans)',
            lineHeight: 1.5,
            outline: 'none',
            resize: 'vertical',
            marginBottom: '12px',
          }}
        />
        <button
          onClick={handleSaveNote}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: 'var(--color-aws-orange)',
            color: '#ffffff',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Save Notes
        </button>
      </section>

      {/* 5. Prev / Next Navigation */}
      <nav
        aria-label="Lesson navigation"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-primary)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {prevLesson ? (
          <Link
            to={`/paths/${path.id}/lessons/${prevLesson.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <ChevronLeft size={18} />
            <span>Prev: {prevLesson.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            to={`/paths/${path.id}/lessons/${nextLesson.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <span>Next: {nextLesson.title}</span>
            <ChevronRight size={18} />
          </Link>
        ) : (
          <Link
            to={`/paths/${path.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.12)',
              color: 'var(--color-success)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={18} />
            Back to Curriculum Overview
          </Link>
        )}
      </nav>
    </div>
  );
}
