import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  Shield,
  Trash2,
  HelpCircle,
  Award,
  Bookmark,
  BookmarkCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import { allLabs } from '../content/labs';
import { useProgressContext } from '../contexts/ProgressContext';
import type { LabStep } from '../types';

export default function LabDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    progress,
    toggleLabStep,
    markLabComplete,
    toggleBookmark,
    isBookmarked,
    setLastVisited,
  } = useProgressContext();

  const lab = allLabs.find(l => l.id === id);
  const [copiedStepCode, setCopiedStepCode] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLastVisited(`/labs/${id}`);
    }
  }, [id, setLastVisited]);

  const handleCopyCode = (stepId: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedStepCode(stepId);
    setTimeout(() => setCopiedStepCode(null), 2000);
  };

  if (!lab) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Lab Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          The requested lab "{id}" could not be found.
        </p>
        <Link
          to="/labs"
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
          <ArrowLeft size={16} /> Back to Labs
        </Link>
      </div>
    );
  }

  const completedStepIds = progress.labChecklist[lab.id] || [];
  const isLabFinished = progress.completedLabs.includes(lab.id);
  const bookmarked = isBookmarked(lab.id);

  const diffColors = {
    beginner: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
    intermediate: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    advanced: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
  }[lab.difficulty];

  const allStepsCompleted = lab.steps.length > 0 && lab.steps.every(s => completedStepIds.includes(s.id));

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
          to="/labs"
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
          <ArrowLeft size={16} /> All Labs
        </Link>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            type="button"
            onClick={() => toggleBookmark(lab.id)}
            aria-label={bookmarked ? 'Remove lab bookmark' : 'Bookmark this lab'}
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
      </div>

      {/* Main Lab Header */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-primary)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-6)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: diffColors.bg,
            color: diffColors.color,
            border: `1px solid ${diffColors.border}`,
          }}>
            {lab.difficulty}
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
          }}>
            <Clock size={13} /> {lab.estimatedMinutes} minutes
          </span>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
          }}>
            Lab #{lab.order}
          </span>
        </div>

        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
          {lab.title}
        </h1>

        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
          {lab.description}
        </p>

        {/* Services Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-6)' }}>
          {lab.services.map(svc => (
            <span
              key={svc}
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
              {svc}
            </span>
          ))}
        </div>

        {/* Step Progress Bar */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-primary)' }}>
              Lab Progress: {completedStepIds.length} of {lab.steps.length} steps completed
            </span>
            <span style={{ color: 'var(--color-aws-orange)' }}>
              {Math.round((completedStepIds.length / (lab.steps.length || 1)) * 100)}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--border-primary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(completedStepIds.length / (lab.steps.length || 1)) * 100}%`,
              height: '100%',
              backgroundColor: isLabFinished ? 'var(--color-success)' : 'var(--color-aws-orange)',
              borderRadius: 'var(--radius-full)',
              transition: 'width var(--transition-normal)',
            }} />
          </div>
        </div>
      </div>

      {/* Cost Warning Callout */}
      {lab.costWarning && (
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          borderLeft: '4px solid var(--color-warning)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'flex-start',
        }}>
          <AlertTriangle size={20} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
              Cost Advisory & Resource Provisioning
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 'var(--leading-normal)' }}>
              {lab.costWarning}
            </div>
          </div>
        </div>
      )}

      {/* Objectives & Prerequisites Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)',
      }}>
        {/* Objectives */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle size={18} color="var(--color-success)" /> Lab Objectives
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {lab.objectives.map((obj, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prerequisites */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Terminal size={18} color="var(--color-cool-blue)" /> Prerequisites
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {lab.prerequisites.map((req, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--color-cool-blue)', fontWeight: 'bold' }}>•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Step Checklist Section */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="steps-heading">
        <h2 id="steps-heading" style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <Terminal size={24} color="var(--color-aws-orange)" /> Step-by-Step Instructions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {lab.steps.map((step: LabStep, index: number) => {
            const isStepDone = completedStepIds.includes(step.id);

            return (
              <div
                key={step.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: isStepDone ? '1px solid var(--color-success)' : '1px solid var(--border-primary)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                }}
              >
                {/* Step Header with Checkbox */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                  <input
                    type="checkbox"
                    id={`step-${step.id}`}
                    checked={isStepDone}
                    onChange={() => toggleLabStep(lab.id, step.id)}
                    aria-label={`Mark Step ${index + 1}: ${step.title} as done`}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      marginTop: '4px',
                      accentColor: 'var(--color-success)',
                    }}
                  />
                  <div style={{ flex: '1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--color-aws-orange)',
                      }}>
                        Step {index + 1}
                      </span>
                      {step.isAdvanced && (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 700,
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: 'var(--color-error)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                        }}>
                          Advanced
                        </span>
                      )}
                    </div>
                    <label
                      htmlFor={`step-${step.id}`}
                      style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textDecoration: isStepDone ? 'line-through' : 'none',
                        opacity: isStepDone ? 0.8 : 1,
                      }}
                    >
                      {step.title}
                    </label>
                  </div>
                </div>

                {/* Instructions */}
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 'var(--leading-relaxed)',
                  marginBottom: 'var(--space-4)',
                  paddingLeft: '36px',
                }}>
                  {step.instructions}
                </p>

                {/* Code Block */}
                {step.code && (
                  <div style={{ marginLeft: '36px', marginBottom: 'var(--space-4)' }}>
                    <div style={{
                      backgroundColor: 'var(--color-navy)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-primary)',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 14px',
                        backgroundColor: 'var(--color-charcoal)',
                        color: '#94a3b8',
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        <span>{step.codeLanguage || 'bash / cli'}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(step.id, step.code!)}
                          aria-label={`Copy command for step ${index + 1}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: copiedStepCode === step.id ? 'var(--color-success)' : '#cbd5e1',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: 'var(--text-xs)',
                          }}
                        >
                          {copiedStepCode === step.id ? <Check size={14} /> : <Copy size={14} />}
                          {copiedStepCode === step.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre style={{
                        margin: 0,
                        padding: 'var(--space-4)',
                        color: '#f8fafc',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-sm)',
                        lineHeight: 'var(--leading-normal)',
                        overflowX: 'auto',
                      }}>
                        {step.code}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Expected Output */}
                {step.expectedOutput && (
                  <div style={{
                    marginLeft: '36px',
                    marginBottom: 'var(--space-3)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-3)',
                    borderLeft: '3px solid var(--color-cool-blue)',
                  }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-cool-blue)', marginBottom: '4px' }}>
                      EXPECTED OUTPUT:
                    </div>
                    <pre style={{
                      margin: 0,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {step.expectedOutput}
                    </pre>
                  </div>
                )}

                {/* Warnings or Tips */}
                {step.warning && (
                  <div style={{
                    marginLeft: '36px',
                    marginBottom: 'var(--space-3)',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-3)',
                    borderLeft: '3px solid var(--color-error)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-error)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <AlertTriangle size={14} />
                    <span><strong>Warning:</strong> {step.warning}</span>
                  </div>
                )}

                {step.tips && (
                  <div style={{
                    marginLeft: '36px',
                    backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-3)',
                    borderLeft: '3px solid var(--color-cool-blue)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-cool-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <Zap size={14} />
                    <span><strong>Tip:</strong> {step.tips}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Verification Callout */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="verification-heading">
        <h2 id="verification-heading" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <CheckCircle size={20} color="var(--color-success)" /> Verification & Success Criteria
        </h2>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-6)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-primary)',
          lineHeight: 'var(--leading-relaxed)',
        }}>
          {lab.verification}
        </div>
      </section>

      {/* Common Errors & Solutions */}
      {lab.commonErrors && lab.commonErrors.length > 0 && (
        <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="errors-heading">
          <h2 id="errors-heading" style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <HelpCircle size={20} color="var(--color-warning)" /> Common Errors & Solutions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {lab.commonErrors.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  padding: 'var(--space-4) var(--space-5)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-error)', marginBottom: '4px' }}>
                  ✕ {item.error}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-normal)' }}>
                  <strong>Fix:</strong> {item.solution}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Troubleshooting and Security Notes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)',
      }}>
        {/* Troubleshooting */}
        {lab.troubleshooting && lab.troubleshooting.length > 0 && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)',
            padding: 'var(--space-6)',
          }}>
            <h2 style={{
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertTriangle size={18} color="var(--color-warning)" /> Troubleshooting
            </h2>
            <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-5)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {lab.troubleshooting.map((t, idx) => (
                <li key={idx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Security Notes */}
        {lab.securityNotes && lab.securityNotes.length > 0 && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)',
            padding: 'var(--space-6)',
          }}>
            <h2 style={{
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Shield size={18} color="var(--color-success)" /> Security Notes
            </h2>
            <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-5)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {lab.securityNotes.map((s, idx) => (
                <li key={idx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mandatory Cleanup Callout */}
      <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="cleanup-heading">
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--color-error)',
          padding: 'var(--space-6)',
        }}>
          <h2 id="cleanup-heading" style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 800,
            color: 'var(--color-error)',
            marginBottom: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Trash2 size={20} color="var(--color-error)" /> Resource Teardown & Cleanup Checklist
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            To prevent unexpected AWS billing charges, verify all created resources are terminated:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {lab.cleanup.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--color-error)', fontWeight: 'bold' }}>✕</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mark Lab Complete Action Banner */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-primary)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
        boxShadow: 'var(--shadow-md)',
      }}>
        <Award size={48} color={isLabFinished ? 'var(--color-success)' : 'var(--color-aws-orange)'} />
        <div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
            {isLabFinished ? 'Lab Completed!' : 'Finished Hands-On Steps?'}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            {isLabFinished
              ? 'Great work! This lab has been marked as complete in your academy progress.'
              : allStepsCompleted
              ? 'All checkboxes checked! Click below to officially log your completion.'
              : 'Complete the checklist steps above and mark this lab done.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => markLabComplete(lab.id)}
          aria-label={isLabFinished ? 'Mark lab as incomplete' : 'Mark lab as complete'}
          style={{
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isLabFinished ? 'var(--bg-secondary)' : 'var(--color-aws-orange)',
            color: isLabFinished ? 'var(--text-primary)' : '#0f1b2d',
            border: isLabFinished ? '1px solid var(--border-primary)' : 'none',
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle size={18} />
          {isLabFinished ? 'Mark as Incomplete' : 'Mark Lab Complete'}
        </button>
      </div>
    </div>
  );
}
