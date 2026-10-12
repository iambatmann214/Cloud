import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Scale,
  GitCompare,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Info,
  Network,
  Sparkles,
} from 'lucide-react';
import { allComparisons } from '../content/comparisons';
import QuestionCard from '../components/common/QuestionCard';

export default function ComparisonDetail() {
  const { id } = useParams<{ id: string }>();

  const currentIndex = allComparisons.findIndex(c => c.id === id);
  const comparison = currentIndex !== -1 ? allComparisons[currentIndex] : null;

  const prevComp = currentIndex > 0 ? allComparisons[currentIndex - 1] : null;
  const nextComp = currentIndex >= 0 && currentIndex < allComparisons.length - 1 ? allComparisons[currentIndex + 1] : null;

  if (!comparison || !id) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Comparison Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          The requested service comparison does not exist or may have been renamed.
        </p>
        <Link
          to="/comparisons"
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
          Back to Comparisons
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
      {/* 1. Breadcrumb */}
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
        <Link to="/comparisons" style={{ color: 'var(--text-link)', textDecoration: 'none' }}>
          Comparisons
        </Link>
        <span>/</span>
        <span style={{ textTransform: 'capitalize' }}>{comparison.category}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{comparison.title}</span>
      </nav>

      {/* 2. Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              background: 'rgba(33, 150, 243, 0.1)',
              color: 'var(--color-cool-blue)',
              border: '1px solid rgba(33, 150, 243, 0.2)',
            }}
          >
            {comparison.category}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Scale size={14} /> Architectural Decision Matrix
          </span>
        </div>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            marginBottom: '12px',
          }}
        >
          {comparison.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(255, 153, 0, 0.12)',
              color: 'var(--color-aws-orange-dark)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {comparison.serviceA}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-tertiary)' }}>vs</span>
          <div
            style={{
              background: 'rgba(33, 150, 243, 0.12)',
              color: 'var(--color-cool-blue)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {comparison.serviceB}
          </div>
        </div>
      </header>

      {/* 3. Problem Section */}
      <section
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={20} color="var(--color-cool-blue)" />
          The Architectural Dilemma
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {comparison.problem}
        </p>
      </section>

      {/* 4. Decisive Differences */}
      <section
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--color-aws-orange)" />
          Decisive Architectural Differences
        </h2>
        <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8 }}>
          {comparison.decisiveDifferences.map((diff, idx) => (
            <li key={idx} style={{ marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-primary)' }}>{diff}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. When to Choose Each (Two Columns) */}
      <section
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
          When to Choose Each
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Column A */}
          <div
            style={{
              background: 'rgba(255, 153, 0, 0.04)',
              border: '1px solid rgba(255, 153, 0, 0.25)',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-aws-orange-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} />
              Choose {comparison.serviceA} when:
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              {comparison.whenToChooseA.map((reason, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Column B */}
          <div
            style={{
              background: 'rgba(33, 150, 243, 0.04)',
              border: '1px solid rgba(33, 150, 243, 0.25)',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-cool-blue)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} />
              Choose {comparison.serviceB} when:
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              {comparison.whenToChooseB.map((reason, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. When They Work Together */}
      {comparison.workTogether && (
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={20} color="var(--color-success)" />
            How They Work Together (Synergy)
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {comparison.workTogether}
          </p>
        </section>
      )}

      {/* 7. Tradeoffs Table */}
      {comparison.tradeoffs && comparison.tradeoffs.length > 0 && (
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '28px',
            overflowX: 'auto',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Tradeoff Analysis Matrix
          </h2>
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
                <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 700, width: '25%' }}>
                  Dimension
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--color-aws-orange-dark)', fontWeight: 700, width: '37.5%' }}>
                  {comparison.serviceA}
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--color-cool-blue)', fontWeight: 700, width: '37.5%' }}>
                  {comparison.serviceB}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.tradeoffs.map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border-primary)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.dimension}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.optionA}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.optionB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 8. Practical Scenario */}
      {comparison.scenario && (
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--color-intermediate)" />
            Real-World Architecture Scenario
          </h2>
          <div
            style={{
              background: 'var(--bg-primary)',
              borderLeft: '4px solid var(--color-intermediate)',
              padding: '16px 20px',
              borderRadius: '0 8px 8px 0',
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            {comparison.scenario}
          </div>
        </section>
      )}

      {/* 9. Decision Question (QuestionCard) */}
      {comparison.question && (
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="var(--color-aws-orange)" />
            Architecture Scenario Decision Check
          </h2>
          <QuestionCard
            question={comparison.question}
            title={`Architectural Decision: ${comparison.serviceA} vs ${comparison.serviceB}`}
          />
        </section>
      )}

      {/* 10. Sources */}
      {comparison.sources && comparison.sources.length > 0 && (
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExternalLink size={18} color="var(--color-cool-blue)" />
            References & Architecture Guides
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {comparison.sources.map((src, idx) => (
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

      {/* 11. Prev / Next Navigation */}
      <nav
        aria-label="Comparison pagination"
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
        {prevComp ? (
          <Link
            to={`/comparisons/${prevComp.id}`}
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
            <span>Prev: {prevComp.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextComp ? (
          <Link
            to={`/comparisons/${nextComp.id}`}
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
            <span>Next: {nextComp.title}</span>
            <ChevronRight size={18} />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
