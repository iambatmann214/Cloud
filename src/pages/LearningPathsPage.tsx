import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Clock,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Network,
  Layers,
  Cloud,
  Server,
  Database,
  Shield,
  Monitor,
  Wrench,
  Box,
  Terminal,
  GitBranch,
  Key,
  DollarSign,
  AlertCircle,
  LucideIcon,
} from 'lucide-react';
import { useProgressContext } from '../contexts/ProgressContext';
import { allLearningPaths } from '../content/learningPaths';

const iconMap: Record<string, LucideIcon> = {
  Cpu,
  Network,
  Layers,
  Cloud,
  Server,
  Database,
  Shield,
  Monitor,
  Wrench,
  Box,
  Terminal,
  GitBranch,
  Key,
  DollarSign,
  BookOpen,
};

function PathIcon({ name, size = 24 }: { name: string; size?: number }) {
  const IconComponent = iconMap[name] || BookOpen;
  return <IconComponent size={size} />;
}

export default function LearningPathsPage() {
  const { isLessonComplete } = useProgressContext();

  const sortedPaths = useMemo(() => {
    return [...allLearningPaths].sort((a, b) => a.order - b.order);
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-aws-orange)', marginBottom: '8px' }}>
          <Compass size={24} />
          <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Structured Curricula
          </span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          AWS Engineering Learning Paths
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.6 }}>
          Step-by-step learning roadmaps engineered from hardware fundamentals to distributed cloud architecture, VPC networking, microservices, and Infrastructure as Code.
        </p>
      </div>

      {/* Path Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {sortedPaths.map(path => {
          const totalLessons = path.lessons.length;
          const completedCount = path.lessons.filter(l => isLessonComplete(l.id)).length;
          const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
          const isComplete = percent === 100 && totalLessons > 0;

          return (
            <div
              key={path.id}
              style={{
                background: 'var(--bg-card)',
                border: isComplete ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-primary)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
              }}
            >
              <div>
                {/* Top Row: Path Icon & Order Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      background: 'rgba(255, 153, 0, 0.1)',
                      color: 'var(--color-aws-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PathIcon name={path.icon} size={26} />
                  </div>

                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--text-tertiary)',
                      background: 'var(--bg-secondary)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    Track #{path.order}
                  </span>
                </div>

                {/* Path Title */}
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}
                >
                  {path.title}
                </h2>

                {/* Path Description */}
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                  }}
                >
                  {path.description}
                </p>

                {/* Prerequisites if any */}
                {path.prerequisites && path.prerequisites.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                      Prerequisites:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {path.prerequisites.map((prereqId, idx) => {
                        const prereqPath = allLearningPaths.find(p => p.id === prereqId);
                        return (
                          <span
                            key={idx}
                            style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'var(--bg-primary)',
                              border: '1px solid var(--border-primary)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {prereqPath ? prereqPath.title : prereqId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Section: Stats & Progress Bar & Link */}
              <div>
                {/* Meta stats */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <BookOpen size={15} color="var(--text-tertiary)" />
                    {totalLessons} lessons
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={15} color="var(--text-tertiary)" />
                    ~{path.estimatedHours} hrs
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                      marginBottom: '4px',
                    }}
                  >
                    <span>Progress</span>
                    <span>
                      {completedCount} / {totalLessons} ({percent}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${percent}%`,
                        background: isComplete ? 'var(--color-success)' : 'var(--color-aws-orange)',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* CTA Link */}
                <Link
                  to={`/paths/${path.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: isComplete ? 'var(--bg-secondary)' : 'var(--color-aws-orange)',
                    color: isComplete ? 'var(--text-primary)' : '#ffffff',
                    border: isComplete ? '1px solid var(--border-primary)' : 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  {isComplete ? (
                    <>
                      <CheckCircle2 size={16} color="var(--color-success)" />
                      Review Path
                    </>
                  ) : completedCount > 0 ? (
                    <>
                      Continue Path <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      Start Path <ArrowRight size={16} />
                    </>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
