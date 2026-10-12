import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Trash2, FileText } from 'lucide-react';
import { useProgressContext } from '../contexts/ProgressContext';
import { allServices } from '../content/services';
import { allLearningPaths } from '../content/learningPaths';

export default function NotesPage() {
  const { progress, setNote } = useProgressContext();

  const notesWithContext = useMemo(() => {
    const entries: { id: string; title: string; path: string; note: string; type: string }[] = [];

    Object.entries(progress.notes).forEach(([id, note]) => {
      if (!note.trim()) return;

      // Check services
      const service = allServices.find(s => s.id === id);
      if (service) {
        entries.push({ id, title: service.shortName || service.name, path: `/services/${id}`, note, type: 'Service' });
        return;
      }

      // Check lessons
      for (const path of allLearningPaths) {
        const lesson = path.lessons.find(l => l.id === id);
        if (lesson) {
          entries.push({ id, title: lesson.title, path: `/paths/${path.id}/lessons/${id}`, note, type: 'Lesson' });
          return;
        }
      }

      // Generic fallback
      entries.push({ id, title: id, path: '#', note, type: 'Other' });
    });

    return entries;
  }, [progress.notes]);

  return (
    <div className="content-container" style={{ paddingBottom: '64px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PenLine size={28} style={{ color: 'var(--color-aws-orange)' }} />
          My Notes
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your personal notes from services and lessons. Stored in this browser only.
        </p>
      </div>

      {notesWithContext.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-tertiary)' }}>
          <FileText size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>No notes yet</h2>
          <p style={{ marginBottom: '24px' }}>Add notes to services and lessons using the notes section at the bottom of each page.</p>
          <Link to="/services" className="btn btn-primary">Browse Services</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            {notesWithContext.length} note{notesWithContext.length !== 1 ? 's' : ''}
          </p>
          {notesWithContext.map(entry => (
            <div key={entry.id} className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <Link to={entry.path} style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {entry.title}
                  </Link>
                  <span className="badge badge-essential" style={{ marginLeft: '8px' }}>{entry.type}</span>
                </div>
                <button
                  onClick={() => setNote(entry.id, '')}
                  aria-label={`Delete note for ${entry.title}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 'var(--leading-relaxed)' }}>
                {entry.note.length > 300 ? entry.note.slice(0, 300) + '...' : entry.note}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
