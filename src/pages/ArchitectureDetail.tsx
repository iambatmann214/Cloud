import { useState, useEffect, useRef, useId } from 'react';
import { useParams, Link } from 'react-router-dom';
import mermaid from 'mermaid';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  FileEdit,
  Shield,
  AlertTriangle,
  DollarSign,
  Layers,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { allArchitectures } from '../content/architectures';
import { useProgressContext } from '../contexts/ProgressContext';
import QuestionCard from '../components/common/QuestionCard';

function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
    });
    const render = async () => {
      if (ref.current) {
        try {
          const sanitizedId = `mermaid-${id.replace(/:/g, '')}`;
          const { svg } = await mermaid.render(sanitizedId, chart);
          ref.current.innerHTML = svg;
        } catch {
          ref.current.innerHTML = `<pre style="text-align: left; background: var(--bg-secondary); padding: 16px; border-radius: 8px; font-family: var(--font-mono); overflow: auto;">${chart}</pre>`;
        }
      }
    };
    render();
  }, [chart, id]);

  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center',
        overflow: 'auto',
        padding: 'var(--space-6)',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-sm)',
      }}
    />
  );
}

export default function ArchitectureDetail() {
  const { id } = useParams<{ id: string }>();
  const { toggleBookmark, isBookmarked, getNote, setNote, setLastVisited } = useProgressContext();

  const architecture = allArchitectures.find(a => a.id === id);

  const [expandedFailureModes, setExpandedFailureModes] = useState<Record<number, boolean>>({});
  const [noteText, setNoteText] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  useEffect(() => {
    if (id) {
      setLastVisited(`/architectures/${id}`);
      setNoteText(getNote(id) || '');
    }
  }, [id, getNote, setLastVisited]);

  const handleSaveNote = () => {
    if (id) {
      setNote(id, noteText);
      setIsNoteSaved(true);
      setTimeout(() => setIsNoteSaved(false), 2000);
    }
  };

  const toggleFailureMode = (idx: number) => {
    setExpandedFailureModes(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (!architecture) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Architecture Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          The requested architecture diagram "{id}" could not be found.
        </p>
        <Link
          to="/architectures"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-aws-orange)',
            color: '#0f1b2d',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to Architectures
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(architecture.id);

  const diffColors = {
    beginner: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
    intermediate: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    advanced: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
  }[architecture.difficulty];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
      {/* Top Navigation & Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)',
      }}>
        <Link
          to="/architectures"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} /> All Architectures
        </Link>

        <button
          type="button"
          onClick={() => toggleBookmark(architecture.id)}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this architecture'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: bookmarked ? '1px solid var(--color-aws-orange)' : '1px solid var(--border-primary)',
            backgroundColor: bookmarked ? 'rgba(255, 153, 0, 0.1)' : 'var(--bg-card)',
            color: bookmarked ? 'var(--color-aws-orange)' : 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      {/* Main Header Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-primary)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-8)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            backgroundColor: diffColors.bg,
            color: diffColors.color,
            border: `1px solid ${diffColors.border}`,
          }}>
            {architecture.difficulty}
          </span>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
          }}>
            ID: {architecture.id}
          </span>
        </div>

        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
          {architecture.title}
        </h1>

        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
          {architecture.description}
        </p>

        {/* Services Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {architecture.services.map(srv => (
            <span
              key={srv}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {srv}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 1: Mermaid Architecture Diagram */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="diagram-heading">
        <h2 id="diagram-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Layers size={20} color="var(--color-aws-orange)" /> System Architecture Diagram
        </h2>
        <MermaidDiagram chart={architecture.diagram} />
      </section>

      {/* SECTION 2: Request / Data Flow */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="flow-heading">
        <h2 id="flow-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <ArrowRight size={20} color="var(--color-cool-blue)" /> Request & Data Flow
        </h2>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}>
          {architecture.requestFlow.map(flow => (
            <div
              key={flow.step}
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                alignItems: 'flex-start',
                paddingBottom: 'var(--space-4)',
                borderBottom: flow.step === architecture.requestFlow.length ? 'none' : '1px solid var(--border-secondary)',
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-navy)',
                color: 'var(--color-aws-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                flexShrink: 0,
              }}>
                {flow.step}
              </div>
              <div style={{ flex: '1' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
                  {flow.description}
                </p>
                {flow.service && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-cool-blue)',
                    backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    Service: {flow.service}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Service Selection Rationale */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="rationale-heading">
        <h2 id="rationale-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <CheckCircle size={20} color="var(--color-success)" /> Service Selection Rationale
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {architecture.selectionRationale.map((rat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                color: 'var(--color-aws-orange)',
                marginBottom: 'var(--space-2)',
                textTransform: 'uppercase',
              }}>
                {rat.service}
              </div>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                lineHeight: 'var(--leading-normal)',
                marginBottom: 'var(--space-3)',
                flex: '1',
              }}>
                {rat.reason}
              </p>
              {rat.alternatives && (
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                  paddingTop: 'var(--space-2)',
                  borderTop: '1px dashed var(--border-secondary)',
                }}>
                  <strong>Alternatives evaluated:</strong> {rat.alternatives}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Security Considerations */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="security-heading">
        <h2 id="security-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Shield size={20} color="var(--color-success)" /> Security Considerations
        </h2>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-6)',
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {architecture.securityConsiderations.map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                <span style={{
                  color: 'var(--color-success)',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 5: Failure Modes (Expandable Cards) */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="failures-heading">
        <h2 id="failures-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertTriangle size={20} color="var(--color-warning)" /> Failure Modes & Mitigations
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {architecture.failureModes.map((fm, idx) => {
            const isExpanded = !!expandedFailureModes[idx];
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFailureMode(idx)}
                  aria-expanded={isExpanded}
                  style={{
                    width: '100%',
                    padding: 'var(--space-4) var(--space-5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                  }}>
                    <AlertTriangle size={16} color="var(--color-warning)" />
                    {fm.scenario}
                  </span>
                  {isExpanded ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
                </button>

                {isExpanded && (
                  <div style={{
                    padding: '0 var(--space-5) var(--space-5)',
                    borderTop: '1px solid var(--border-secondary)',
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                  }}>
                    <div style={{ marginTop: 'var(--space-3)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-error)', marginBottom: '2px' }}>
                        IMPACT:
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>
                        {fm.impact}
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-success)', marginBottom: '2px' }}>
                        MITIGATION:
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>
                        {fm.mitigation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: Cost Drivers */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="cost-heading">
        <h2 id="cost-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <DollarSign size={20} color="var(--color-aws-orange)" /> Primary Cost Drivers
        </h2>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-6)',
        }}>
          <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {architecture.costDrivers.map((cost, idx) => (
              <li key={idx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 'var(--leading-normal)' }}>
                {cost}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 7: Scenario Practice Question */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="quiz-heading">
        <h2 id="quiz-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <HelpCircle size={20} color="var(--color-cool-blue)" /> Scenario Challenge Question
        </h2>
        <QuestionCard question={architecture.scenarioQuestion} title="Architectural Decision Challenge" />
      </section>

      {/* SECTION 8: Personal Notes */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="notes-heading">
        <h2 id="notes-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <FileEdit size={20} color="var(--color-aws-orange)" /> Architecture Notes
        </h2>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-6)',
        }}>
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Record your architectural observations, design thoughts, or implementation questions..."
            rows={4}
            aria-label="Notes for this architecture"
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none',
              marginBottom: 'var(--space-3)',
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-3)' }}>
            {isNoteSaved && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 600 }}>
                ✓ Notes saved
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveNote}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-navy)',
                color: '#ffffff',
                border: 'none',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Save Note
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
