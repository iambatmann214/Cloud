import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Lightbulb,
  FileEdit,
  Layers,
  Shield,
  DollarSign,
  Terminal,
  Cpu,
  BookOpen,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useProgressContext } from '../contexts/ProgressContext';
import { allServices } from '../content/services';
import QuestionCard from '../components/common/QuestionCard';

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
        marginBottom: '12px',
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

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    isBookmarked,
    toggleBookmark,
    isLessonComplete,
    markLessonComplete,
    getNote,
    setNote,
  } = useProgressContext();

  const currentIndex = allServices.findIndex(s => s.id === id);
  const service = currentIndex !== -1 ? allServices[currentIndex] : null;

  const prevService = currentIndex > 0 ? allServices[currentIndex - 1] : null;
  const nextService = currentIndex >= 0 && currentIndex < allServices.length - 1 ? allServices[currentIndex + 1] : null;

  const [activeTab, setActiveTab] = useState<'console' | 'cli' | 'python' | 'iac'>('console');
  const [noteText, setNoteText] = useState(() => (id ? getNote(id) : ''));
  const [noteSaved, setNoteSaved] = useState(false);

  // If service not found
  if (!service || !id) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Service Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          The requested AWS service could not be found. It may have been relocated or renamed.
        </p>
        <Link
          to="/services"
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
          Return to Service Explorer
        </Link>
      </div>
    );
  }

  const isCompleted = isLessonComplete(service.id);
  const bookmarked = isBookmarked(service.id);

  const handleSaveNote = () => {
    setNote(service.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const getDifficultyBadge = () => {
    switch (service.difficulty) {
      case 'beginner':
        return { color: 'var(--color-beginner)', bg: 'rgba(34, 197, 94, 0.12)' };
      case 'intermediate':
        return { color: 'var(--color-intermediate)', bg: 'rgba(245, 158, 11, 0.12)' };
      case 'advanced':
        return { color: 'var(--color-advanced)', bg: 'rgba(239, 68, 68, 0.12)' };
    }
  };

  const diffBadge = getDifficultyBadge();

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
        <Link to="/services" style={{ color: 'var(--text-link)', textDecoration: 'none' }}>
          Services
        </Link>
        <span>/</span>
        <span style={{ textTransform: 'capitalize' }}>{service.category}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{service.name}</span>
      </nav>

      {/* 2. Page Header */}
      <header
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {/* Category */}
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                {service.category}
              </span>

              {/* Difficulty */}
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: diffBadge.bg,
                  color: diffBadge.color,
                }}
              >
                {service.difficulty}
              </span>

              {/* Importance */}
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: 'rgba(33, 150, 243, 0.1)',
                  color: 'var(--color-cool-blue)',
                }}
              >
                {service.importance} Importance
              </span>
            </div>

            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span>{service.name}</span>
              {service.shortName && (
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--color-aws-orange)',
                    background: 'rgba(255, 153, 0, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {service.shortName}
                </span>
              )}
            </h1>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => toggleBookmark(service.id)}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark service'}
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
              onClick={() => markLessonComplete(service.id)}
              aria-label={isCompleted ? 'Mark service incomplete' : 'Mark service completed'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
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

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {service.tagline}
        </p>
      </header>

      {/* Main Content Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Section 1: At a Glance (Tagline + Mental Model) */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} color="var(--color-aws-orange)" />
            1. At a Glance & Mental Model
          </h2>
          <div
            style={{
              background: 'rgba(255, 153, 0, 0.08)',
              borderLeft: '4px solid var(--color-aws-orange)',
              padding: '16px 20px',
              borderRadius: '0 8px 8px 0',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-aws-orange)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Mental Model
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6 }}>
              "{service.mentalModel}"
            </p>
          </div>
        </section>

        {/* Section 2: Problem It Solves */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={20} color="var(--color-cool-blue)" />
            2. Problem It Solves
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {service.problemItSolves}
          </p>
        </section>

        {/* Section 3: How It Works */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="var(--color-aws-orange)" />
            3. How It Works
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
            {service.howItWorks}
          </p>

          {service.components && service.components.length > 0 && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Key Structural Components:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {service.components.map((comp, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>
                      {comp.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {comp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Section 4: Real-World Example */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--color-cool-blue)" />
            4. Real-World Architecture Example
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {service.realWorldExample}
          </p>
        </section>

        {/* Section 5: When to Use / When Not to Use */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
            5. Decision Matrix: When to Use & When to Avoid
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* When to Use */}
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.04)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-success)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} />
                When to Choose {service.shortName || service.name}
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                {service.whenToUse.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* When Not to Use */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-advanced)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} />
                When NOT to Choose / Anti-Patterns
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                {service.whenNotToUse.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6: Practical Implementation Tabs */}
        {service.practicalImplementation && (
          <section
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={20} color="var(--color-aws-orange)" />
              6. Practical Implementation & Code
            </h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px' }}>
              {(['console', 'cli', 'python', 'iac'] as const).map(tab => {
                const available = !!service.practicalImplementation?.[tab];
                if (!available) return null;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: isActive ? 'var(--color-aws-orange)' : 'var(--bg-primary)',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tab === 'iac' ? 'IaC / Terraform / CDK' : tab}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div style={{ marginTop: '16px' }}>
              {activeTab === 'console' && service.practicalImplementation.console && (
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    AWS Management Console Walkthrough:
                  </div>
                  <div
                    style={{
                      background: 'var(--bg-primary)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {service.practicalImplementation.console}
                  </div>
                </div>
              )}

              {activeTab === 'cli' && service.practicalImplementation.cli && (
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    AWS CLI v2 Commands:
                  </div>
                  <CodeBlock code={service.practicalImplementation.cli} language="bash" />
                </div>
              )}

              {activeTab === 'python' && service.practicalImplementation.python && (
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    AWS SDK for Python (Boto3):
                  </div>
                  <CodeBlock code={service.practicalImplementation.python} language="python" />
                </div>
              )}

              {activeTab === 'iac' && service.practicalImplementation.iac && (
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Infrastructure as Code (Terraform / CloudFormation / CDK):
                  </div>
                  <CodeBlock code={service.practicalImplementation.iac} language="hcl" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 7: Security */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--color-advanced)" />
            7. Security & Governance Considerations
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {service.security}
          </p>
        </section>

        {/* Section 8: Cost Drivers */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} color="var(--color-intermediate)" />
            8. Cost Drivers & Financial Engineering
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {service.costDrivers}
          </p>
        </section>

        {/* Section 9: Limitations & Common Mistakes */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
            9. Architectural Limitations & Production Pitfalls
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Limitations */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Service Limitations & Quotas
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                {service.limitations.map((limit, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>
                    {limit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-advanced)', marginBottom: '12px' }}>
                Common Mistakes in Engineering
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                {service.commonMistakes.map((mistake, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 10: Alternatives & Related Services */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
            10. Alternative Options & Related Services
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              When to consider alternatives:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {service.alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--color-aws-orange)', fontSize: '14px' }}>
                    {alt.service}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {alt.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {service.relatedServices && service.relatedServices.length > 0 && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Directly Related AWS Services:
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {service.relatedServices.map((relId, idx) => {
                  const target = allServices.find(s => s.id === relId);
                  return (
                    <Link
                      key={idx}
                      to={`/services/${relId}`}
                      style={{
                        padding: '6px 12px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: 'var(--text-link)',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      {target ? target.name : relId} →
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Section 11: Scenario Check (QuestionCard) */}
        {service.scenarioQuestion && (
          <section
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={20} color="var(--color-aws-orange)" />
              11. Scenario Evaluation Check
            </h2>
            <QuestionCard
              question={service.scenarioQuestion}
              title={`Exam & Interview Scenario for ${service.shortName || service.name}`}
            />
          </section>
        )}

        {/* Section 12: Quick Revision */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--color-aws-orange)" />
            12. Quick Revision Cheatsheet
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
            {service.quickRevision.map((point, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 13: Sources & External Documentation */}
        {service.sources && service.sources.length > 0 && (
          <section
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ExternalLink size={20} color="var(--color-cool-blue)" />
              13. Official AWS Documentation & Resources
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {service.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--text-link)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ExternalLink size={14} />
                  {src.title}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Notes Textarea Section */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileEdit size={18} color="var(--color-aws-orange)" />
              Personal Study Notes
            </h2>
            {noteSaved && (
              <span style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>
                ✓ Notes saved!
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Write down your observations, key exam pointers, or project architecture ideas. Notes persist locally.
          </p>
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder={`Add personal notes about ${service.name}...`}
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

        {/* Previous / Next Navigation */}
        <nav
          aria-label="Service navigation"
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
          {prevService ? (
            <Link
              to={`/services/${prevService.id}`}
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
              <span>Previous: {prevService.name}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextService ? (
            <Link
              to={`/services/${nextService.id}`}
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
              <span>Next: {nextService.name}</span>
              <ChevronRight size={18} />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </div>
  );
}
