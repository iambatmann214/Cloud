import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkX, Server, BookOpen, ExternalLink } from 'lucide-react';
import { useProgressContext } from '../contexts/ProgressContext';
import { allServices } from '../content/services';
import { allLearningPaths } from '../content/learningPaths';

export default function BookmarksPage() {
  const { progress, toggleBookmark } = useProgressContext();

  const bookmarkedServices = useMemo(() => {
    return allServices.filter(s => progress.bookmarks.includes(s.id));
  }, [progress.bookmarks]);

  const bookmarkedLessons = useMemo(() => {
    const lessons: { id: string; title: string; pathId: string; pathTitle: string }[] = [];
    allLearningPaths.forEach(path => {
      path.lessons.forEach(lesson => {
        if (progress.bookmarks.includes(lesson.id)) {
          lessons.push({ id: lesson.id, title: lesson.title, pathId: path.id, pathTitle: path.title });
        }
      });
    });
    return lessons;
  }, [progress.bookmarks]);

  const hasBookmarks = bookmarkedServices.length > 0 || bookmarkedLessons.length > 0;

  return (
    <div className="content-container" style={{ paddingBottom: '64px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bookmark size={28} style={{ color: 'var(--color-aws-orange)' }} />
          Bookmarks
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
          Your saved services, lessons, and topics for quick access.
        </p>
      </div>

      {!hasBookmarks ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-tertiary)' }}>
          <Bookmark size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>No bookmarks yet</h2>
          <p style={{ marginBottom: '24px' }}>Bookmark services and lessons to save them here for quick access.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-primary">Browse Services</Link>
            <Link to="/paths" className="btn btn-secondary">View Learning Paths</Link>
          </div>
        </div>
      ) : (
        <>
          {bookmarkedServices.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={20} /> Services ({bookmarkedServices.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {bookmarkedServices.map(service => (
                  <div key={service.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <Link to={`/services/${service.id}`} style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {service.shortName || service.name}
                      </Link>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>{service.tagline}</p>
                      <span className={`badge badge-${service.difficulty}`} style={{ marginTop: '8px' }}>{service.difficulty}</span>
                    </div>
                    <button onClick={() => toggleBookmark(service.id)} className="btn-ghost" aria-label="Remove bookmark" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-aws-orange)', padding: '4px' }}>
                      <BookmarkX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {bookmarkedLessons.length > 0 && (
            <section>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} /> Lessons ({bookmarkedLessons.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {bookmarkedLessons.map(lesson => (
                  <div key={lesson.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <Link to={`/paths/${lesson.pathId}/lessons/${lesson.id}`} style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {lesson.title}
                      </Link>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>{lesson.pathTitle}</p>
                    </div>
                    <button onClick={() => toggleBookmark(lesson.id)} className="btn-ghost" aria-label="Remove bookmark" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-aws-orange)', padding: '4px' }}>
                      <BookmarkX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
