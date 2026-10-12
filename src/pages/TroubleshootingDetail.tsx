import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  FileEdit,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Terminal,
  Compass,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';
import { allTroubleshootingFlows } from '../content/troubleshooting';
import { useProgressContext } from '../contexts/ProgressContext';
import type { TroubleshootingCause } from '../types';

export default function TroubleshootingDetail() {
  const { id } = useParams<{ id: string }>();
  const { toggleBookmark, isBookmarked, getNote, setNote, setLastVisited } = useProgressContext();

  const flow = allTroubleshootingFlows.find(f => f.id === id);

  const [expandedCauses, setExpandedCauses] = useState<Record<string, boolean>>({});
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    if (id) {
      setLastVisited(`/troubleshooting/${id}`);
      setNoteText(getNote(id) || '');
    }
  }, [id, getNote, setLastVisited]);

  // Sort causes by likelihood: high first, then medium, then low
  const sortedCauses = useMemo(() => {
    if (!flow) return [];
    const order: Record<string, number> = { high: 1, medium: 2, low: 3 };
    return [...flow.causes].sort((a, b) => (order[a.likelihood] || 4) - (order[b.likelihood] || 4));
  }, [flow]);

  // Default expand the first cause
  useEffect(() => {
    if (sortedCauses.length > 0) {
      setExpandedCauses({ [sortedCauses[0].id]: true });
    }
  }, [flow?.id, sortedCauses]);

  const toggleCause = (causeId: string) => {
    setExpandedCauses(prev => ({
      ...prev,
      [causeId]: !prev[causeId],
    }));
  };

  const handleCopy = (codeKey: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(codeKey);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleSaveNote = () => {
    if (id) {
      setNote(id, noteText);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    }
  };

  if (!flow) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Troubleshooting Guide Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          The requested diagnostic runbook "{id}" could not be found.
        </p>
        <Link
          to="/troubleshooting"
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
          <ArrowLeft size={16} /> Back to Troubleshooting
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(flow.id);

  const likelihoodBadge = (likelihood: 'high' | 'medium' | 'low') => {
    switch (likelihood) {
      case 'high':
        return {
          text: 'HIGH LIKELIHOOD',
          bg: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: 'rgba(239, 68, 68, 0.3)',
        };
      case 'medium':
        return {
          text: 'MEDIUM LIKELIHOOD',
          bg: 'rgba(245, 158, 11, 0.1)',
          color: '#f59e0b',
          border: 'rgba(245, 158, 11, 0.3)',
        };
      case 'low':
      default:
        return {
          text: 'LOW LIKELIHOOD',
          bg: 'rgba(34, 197, 94, 0.1)',
          color: '#22c55e',
          border: 'rgba(34, 197, 94, 0.3)',
        };
    }
  };

  const isDestructive = (text: string) => {
    const lower = text.toLowerCase();
    return lower.includes('terminate') ||
      lower.includes('delete') ||
      lower.includes('drop ') ||
      lower.includes('force-reboot') ||
      lower.includes('rm -rf');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
      {/* Top Bar Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)',
      }}>
        <Link
          to="/troubleshooting"
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
          <ArrowLeft size={16} /> All Incident Runbooks
        </Link>

        <button
          type="button"
          onClick={() => toggleBookmark(flow.id)}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this runbook'}
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

      {/* Main Header / Symptom & Impact Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-primary)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-8)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
          <AlertOctagon size={16} /> Outage Incident Diagnosis
        </div>

        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-tight)' }}>
          {flow.title}
        </h1>

        {/* Symptom detail */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
          borderLeft: '4px solid var(--color-warning)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Reported Symptom
          </div>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 'var(--leading-normal)' }}>
            {flow.symptom}
          </p>
        </div>

        {/* Impact detail */}
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          borderLeft: '4px solid var(--color-error)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Business & Operational Impact
          </div>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 'var(--leading-normal)' }}>
            {flow.impact}
          </p>
        </div>
      </div>

      {/* Causes Section */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="causes-heading">
        <h2 id="causes-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <LifeBuoy size={20} color="var(--color-aws-orange)" /> Diagnostic Trees ({sortedCauses.length} Causes, Ordered by Likelihood)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {sortedCauses.map((c: TroubleshootingCause, idx: number) => {
            const isExpanded = !!expandedCauses[c.id];
            const badge = likelihoodBadge(c.likelihood);
            const destructiveWarning = isDestructive(c.fix);

            return (
              <div
                key={c.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: isExpanded ? '1px solid var(--color-aws-orange)' : '1px solid var(--border-primary)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                {/* Cause Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleCause(c.id)}
                  aria-expanded={isExpanded}
                  style={{
                    width: '100%',
                    padding: 'var(--space-4) var(--space-6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isExpanded ? 'var(--bg-secondary)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: 'var(--space-4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: '1' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      flexShrink: 0,
                    }}>
                      {badge.text}
                    </span>
                    <span style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}>
                      {idx + 1}. {c.cause}
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
                </button>

                {/* Expanded Diagnostic Body */}
                {isExpanded && (
                  <div style={{
                    padding: 'var(--space-6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-6)',
                    borderTop: '1px solid var(--border-primary)',
                  }}>
                    {/* Diagnostic Checks */}
                    <div>
                      <h3 style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--color-cool-blue)',
                        marginBottom: 'var(--space-3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <Compass size={16} /> Diagnostic Investigation Steps
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {c.checks.map((check, checkIdx) => (
                          <div
                            key={checkIdx}
                            style={{
                              backgroundColor: 'var(--bg-secondary)',
                              borderRadius: 'var(--radius-md)',
                              padding: 'var(--space-4)',
                              border: '1px solid var(--border-secondary)',
                            }}
                          >
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                              Action: {check.action}
                            </div>

                            {/* Command */}
                            {check.command && (
                              <div style={{
                                backgroundColor: 'var(--color-navy)',
                                borderRadius: 'var(--radius-sm)',
                                overflow: 'hidden',
                                marginBottom: 'var(--space-2)',
                              }}>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '4px 10px',
                                  backgroundColor: 'var(--color-charcoal)',
                                  fontSize: '11px',
                                  color: '#94a3b8',
                                  fontFamily: 'var(--font-mono)',
                                }}>
                                  <span>CLI Diagnostic Command</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(`${c.id}-${checkIdx}`, check.command!)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: copiedCmd === `${c.id}-${checkIdx}` ? 'var(--color-success)' : '#cbd5e1',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '11px',
                                    }}
                                  >
                                    {copiedCmd === `${c.id}-${checkIdx}` ? <Check size={12} /> : <Copy size={12} />}
                                    {copiedCmd === `${c.id}-${checkIdx}` ? 'Copied' : 'Copy'}
                                  </button>
                                </div>
                                <pre style={{
                                  margin: 0,
                                  padding: '10px 12px',
                                  color: '#38bdf8',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: 'var(--text-xs)',
                                  overflowX: 'auto',
                                }}>
                                  {check.command}
                                </pre>
                              </div>
                            )}

                            {/* Console Location */}
                            {check.consoleLocation && (
                              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                                <strong>AWS Console Location:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{check.consoleLocation}</span>
                              </div>
                            )}

                            {/* Interpretation */}
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', lineHeight: 'var(--leading-normal)' }}>
                              <strong style={{ color: 'var(--color-aws-orange)' }}>How to Interpret: </strong>
                              {check.interpretation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Safety Alert for Destructive Fixes */}
                    {destructiveWarning && (
                      <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--color-error)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-3) var(--space-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-error)',
                        fontWeight: 600,
                      }}>
                        <AlertTriangle size={16} />
                        <span>Safety Warning: This resolution command modifies or replaces resources. Ensure backups exist before executing.</span>
                      </div>
                    )}

                    {/* Fix / Remediation */}
                    <div style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                      borderLeft: '4px solid var(--color-success)',
                    }}>
                      <h4 style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--color-success)',
                        marginBottom: 'var(--space-2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <CheckCircle size={15} /> Remediation & Fix Procedure
                      </h4>
                      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
                        {c.fix}
                      </p>
                    </div>

                    {/* Verification and Prevention Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                      <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-4)',
                        border: '1px solid var(--border-secondary)',
                      }}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-cool-blue)', marginBottom: '4px' }}>
                          VERIFICATION
                        </div>
                        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-primary)', lineHeight: 'var(--leading-normal)' }}>
                          {c.verification}
                        </p>
                      </div>

                      <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-4)',
                        border: '1px solid var(--border-secondary)',
                      }}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-aws-orange)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={14} /> ARCHITECTURAL PREVENTION
                        </div>
                        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-primary)', lineHeight: 'var(--leading-normal)' }}>
                          {c.prevention}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Incident Notes Section */}
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
          <FileEdit size={20} color="var(--color-aws-orange)" /> Runbook Post-Mortem & Team Notes
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
            placeholder="Record post-incident observations, custom environment IDs, or specific team procedures..."
            rows={4}
            aria-label="Notes for this troubleshooting guide"
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
            {noteSaved && (
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
