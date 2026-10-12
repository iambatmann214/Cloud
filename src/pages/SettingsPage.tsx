import { useState, useMemo } from 'react';
import { Settings, Sun, Moon, Download, Trash2, AlertTriangle, BarChart3, BookOpen, CheckCircle2, Brain, FlaskConical } from 'lucide-react';
import { useProgressContext } from '../contexts/ProgressContext';
import { allLearningPaths } from '../content/learningPaths';
import { allServices } from '../content/services';
import { allLabs } from '../content/labs';

export default function SettingsPage() {
  const { progress, toggleTheme, clearAllData, exportData } = useProgressContext();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalLessons = useMemo(() => allLearningPaths.reduce((a, p) => a + p.lessons.length, 0), []);
  const quizAccuracy = useMemo(() => {
    const attempts = progress.quizAttempts;
    if (attempts.length === 0) return null;
    const correct = attempts.filter(a => a.correct).length;
    return Math.round((correct / attempts.length) * 100);
  }, [progress.quizAttempts]);

  return (
    <div className="content-container" style={{ paddingBottom: '64px', maxWidth: '700px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={28} style={{ color: 'var(--color-aws-orange)' }} />
          Settings
        </h1>
      </div>

      {/* Theme */}
      <section className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '16px' }}>Appearance</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 500 }}>Theme</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Currently using {progress.theme} mode
            </p>
          </div>
          <button onClick={toggleTheme} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {progress.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            Switch to {progress.theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </section>

      {/* Progress Stats */}
      <section className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={20} /> Progress Statistics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <BookOpen size={24} style={{ color: 'var(--color-cool-blue)', marginBottom: '8px' }} />
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{progress.completedLessons.length}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>of {totalLessons} Lessons</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <FlaskConical size={24} style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{progress.completedLabs.length}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>of {allLabs.length} Labs</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={24} style={{ color: 'var(--color-aws-orange)', marginBottom: '8px' }} />
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{progress.bookmarks.length}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Bookmarks</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <Brain size={24} style={{ color: 'var(--color-warning)', marginBottom: '8px' }} />
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{quizAccuracy !== null ? `${quizAccuracy}%` : '—'}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Quiz Accuracy ({progress.quizAttempts.length} attempts)</div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '16px' }}>Data Management</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontWeight: 500 }}>Export Learning Data</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Download your progress, notes, and bookmarks as JSON</p>
            </div>
            <button onClick={exportData} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={16} /> Export
            </button>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontWeight: 500, color: 'var(--color-error)' }}>Clear All Data</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Remove all progress, notes, bookmarks, and quiz history</p>
            </div>
            {!showClearConfirm ? (
              <button onClick={() => setShowClearConfirm(true)} className="btn" style={{ background: 'var(--color-error)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={16} /> Clear Data
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-error)', fontWeight: 500 }}>
                  <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Are you sure?
                </span>
                <button onClick={() => { clearAllData(); setShowClearConfirm(false); }} className="btn" style={{ background: 'var(--color-error)', color: '#fff', fontSize: 'var(--text-sm)' }}>
                  Yes, Delete
                </button>
                <button onClick={() => setShowClearConfirm(false)} className="btn btn-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="card">
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '16px' }}>About</h2>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
          <p style={{ marginBottom: '12px' }}>
            <strong>AWS Cloud Engineering Interactive Academy</strong> is a static learning application that runs entirely in your browser.
          </p>
          <p style={{ marginBottom: '12px' }}>
            All learning data (progress, bookmarks, notes, quiz history) is stored in your browser's <code style={{ background: 'var(--bg-code)', padding: '2px 6px', borderRadius: '4px' }}>localStorage</code>. No data is sent to any server. Data does not sync between devices or browsers.
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>Services covered:</strong> {allServices.length} AWS services and tools<br />
            <strong>Learning paths:</strong> {allLearningPaths.length} structured paths<br />
            <strong>Total lessons:</strong> {totalLessons}
          </p>
          <p>
            AWS service names are trademarks of Amazon Web Services, Inc. Quiz questions are original certification-style practice questions and do not contain leaked exam content.
          </p>
        </div>
      </section>
    </div>
  );
}
