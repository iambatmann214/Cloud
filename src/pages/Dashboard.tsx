import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  GitCompare,
  Network,
  HelpCircle,
  FlaskConical,
  Wrench,
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  ArrowRight,
  Bookmark,
  Lightbulb,
  Sparkles,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { useProgressContext } from '../contexts/ProgressContext';
import { allLearningPaths } from '../content/learningPaths';

const DAILY_TIPS = [
  {
    title: 'S3 Strong Read-After-Write Consistency',
    tip: 'Amazon S3 automatically delivers strong read-after-write consistency for PUT and DELETE requests of objects across all regions with no performance penalty or additional cost.',
    category: 'Storage',
  },
  {
    title: 'DynamoDB Partition Key Cardinality',
    tip: 'Avoid hot partitions by choosing partition keys with high cardinality (e.g., UUID or device ID) rather than low-cardinality attributes like status codes or date strings.',
    category: 'Database',
  },
  {
    title: 'VPC Gateway vs Interface Endpoints',
    tip: 'Gateway Endpoints (for S3 and DynamoDB) are route-table targets and free of charge. Interface Endpoints (AWS PrivateLink) use ENIs, incur hourly + per-GB data processing fees.',
    category: 'Networking',
  },
  {
    title: 'IAM Policy Evaluation Logic',
    tip: 'By default, all requests are implicitly denied. An explicit deny in ANY applicable policy (SCP, Permission Boundary, Identity Policy, Resource Policy) ALWAYS overrides an explicit allow.',
    category: 'Security',
  },
  {
    title: 'Lambda Provisioned Concurrency',
    tip: 'For latency-sensitive workloads with predictable spikes, provisioned concurrency keeps pre-warmed execution environments ready to serve requests with sub-10ms latency.',
    category: 'Serverless',
  },
  {
    title: 'Aurora Global Database Replication',
    tip: 'Aurora Global Database uses dedicated storage-level physical replication across regions with typical replication latency under 1 second, with no performance impact on the primary DB cluster.',
    category: 'Database',
  },
  {
    title: 'Cost Allocation Tags Activation',
    tip: 'Creating user tags in AWS resources does not automatically track costs in AWS Cost Explorer! You must explicitly activate user-defined tags in the AWS Billing and Cost Management console.',
    category: 'Cost Optimization',
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgressContext();

  // Calculate totals and lesson map safely
  const { totalLessons, lessonMap, currentPathObj, firstLessonUrl } = useMemo(() => {
    const paths = Array.isArray(allLearningPaths) ? allLearningPaths : [];
    let count = 0;
    const map = new Map<string, { title: string; pathId: string }>();
    let firstUrl = '/services';

    paths.forEach(path => {
      if (Array.isArray(path.lessons)) {
        count += path.lessons.length;
        path.lessons.forEach((lesson, idx) => {
          map.set(lesson.id, { title: lesson.title, pathId: path.id });
          if (idx === 0 && firstUrl === '/services') {
            firstUrl = `/paths/${path.id}/lessons/${lesson.id}`;
          }
        });
      }
    });

    const activePath = paths.find(p => p.id === progress.currentPath) || paths[0] || null;

    return {
      totalLessons: count || 40,
      lessonMap: map,
      currentPathObj: activePath,
      firstLessonUrl: firstUrl,
    };
  }, [progress.currentPath]);

  // Total labs reference count (standard curriculum: 20 labs)
  const totalLabs = 20;

  // Quiz accuracy calculation
  const quizAccuracy = useMemo(() => {
    if (!progress.quizAttempts || progress.quizAttempts.length === 0) {
      return null;
    }
    const correctCount = progress.quizAttempts.filter(a => a.correct).length;
    return Math.round((correctCount / progress.quizAttempts.length) * 100);
  }, [progress.quizAttempts]);

  // Current learning path progress
  const currentPathProgress = useMemo(() => {
    if (!currentPathObj || !currentPathObj.lessons || currentPathObj.lessons.length === 0) {
      return 0;
    }
    const completedInPath = currentPathObj.lessons.filter(l =>
      progress.completedLessons.includes(l.id)
    ).length;
    return Math.round((completedInPath / currentPathObj.lessons.length) * 100);
  }, [currentPathObj, progress.completedLessons]);

  // Continue learning link
  const continueUrl = progress.lastVisited || firstLessonUrl;

  // Tip of the day
  const todayTip = useMemo(() => {
    const day = new Date().getDate();
    return DAILY_TIPS[day % DAILY_TIPS.length];
  }, []);

  // Quick launch cards configuration
  const quickLaunchCards = [
    {
      title: 'Service Explorer',
      description: 'Explore comprehensive AWS services with architectural deep dives',
      path: '/services',
      icon: <Compass size={24} style={{ color: 'var(--color-aws-orange)' }} />,
      badge: 'Services',
    },
    {
      title: 'Compare Services',
      description: 'Head-to-head architectural decision guides and tradeoffs',
      path: '/comparisons',
      icon: <GitCompare size={24} style={{ color: 'var(--color-cool-blue)' }} />,
      badge: 'Decisions',
    },
    {
      title: 'Architecture Explorer',
      description: 'Production patterns, request flows, and failure modes',
      path: '/architectures',
      icon: <Network size={24} style={{ color: '#8b5cf6' }} />,
      badge: 'Designs',
    },
    {
      title: 'Practice Quizzes',
      description: 'Scenario-based certification practice questions with detailed explanations',
      path: '/quizzes',
      icon: <HelpCircle size={24} style={{ color: 'var(--color-success)' }} />,
      badge: 'Exams',
    },
    {
      title: 'Hands-On Labs',
      description: 'Step-by-step engineering tutorials with verification steps',
      path: '/labs',
      icon: <FlaskConical size={24} style={{ color: 'var(--color-warning)' }} />,
      badge: 'Hands-on',
    },
    {
      title: 'Troubleshooting',
      description: 'Debug production cloud outages and diagnostic decision trees',
      path: '/troubleshooting',
      icon: <Wrench size={24} style={{ color: 'var(--color-error)' }} />,
      badge: 'Runbooks',
    },
  ];

  // Recently completed lessons (last 5, reversed)
  const recentCompletedLessons = useMemo(() => {
    return [...progress.completedLessons].reverse().slice(0, 5);
  }, [progress.completedLessons]);

  // Bookmarks (first 5)
  const displayBookmarks = useMemo(() => {
    return progress.bookmarks.slice(0, 5);
  }, [progress.bookmarks]);

  return (
    <div className="content-container" style={{ paddingBottom: 'var(--space-12)' }}>
      {/* Welcome Hero */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-charcoal) 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,153,0,0.15) 0%, rgba(255,153,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              backgroundColor: 'rgba(255, 153, 0, 0.15)',
              color: 'var(--color-aws-orange)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-4)',
              border: '1px solid rgba(255, 153, 0, 0.3)',
            }}
          >
            <Sparkles size={14} />
            Professional Cloud Architect & Engineer Curriculum
          </div>

          <h1
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 800,
              lineHeight: 'var(--leading-tight)',
              marginBottom: 'var(--space-3)',
              color: '#ffffff',
            }}
          >
            AWS Cloud Engineering Interactive Academy
          </h1>

          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-grey-300)',
              lineHeight: 'var(--leading-relaxed)',
              marginBottom: 'var(--space-6)',
            }}
          >
            Master AWS cloud architecture through interactive service breakdowns, architectural
            tradeoff matrices, hands-on labs, and production-tested troubleshooting guides.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Link
              to={continueUrl}
              className="btn btn-primary btn-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                boxShadow: '0 4px 14px rgba(255, 153, 0, 0.35)',
              }}
            >
              <span>Continue Learning</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/paths"
              className="btn"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <BookOpen size={18} />
              <span>Browse Learning Paths</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <BarChart3 size={20} style={{ color: 'var(--color-aws-orange)' }} />
          Learning Progress
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {/* Lessons Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(255, 153, 0, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-aws-orange)',
                flexShrink: 0,
              }}
            >
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Completed Lessons
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {progress.completedLessons.length}
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                  {' '}/ {totalLessons}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-aws-orange)', marginTop: '2px' }}>
                {Math.round((progress.completedLessons.length / (totalLessons || 1)) * 100)}% overall completion
              </div>
            </div>
          </div>

          {/* Labs Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(33, 150, 243, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-cool-blue)',
                flexShrink: 0,
              }}
            >
              <FlaskConical size={24} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Completed Labs
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {progress.completedLabs.length}
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                  {' '}/ {totalLabs}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-cool-blue)', marginTop: '2px' }}>
                Hands-on practicals verified
              </div>
            </div>
          </div>

          {/* Quiz Accuracy Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-success)',
                flexShrink: 0,
              }}
            >
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Quiz Accuracy
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {quizAccuracy !== null ? `${quizAccuracy}%` : 'N/A'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                {progress.quizAttempts.length > 0
                  ? `${progress.quizAttempts.length} questions attempted`
                  : 'Start quizzes to test recall'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Learning Path & Suggestion of the Day in 2 Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {/* Current Learning Path Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-3)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--color-aws-orange)',
                }}
              >
                Active Learning Track
              </span>
              <span className="badge badge-essential">
                {currentPathProgress}% Complete
              </span>
            </div>

            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {currentPathObj ? currentPathObj.title : 'Cloud Architecture Foundations'}
            </h3>

            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                marginBottom: 'var(--space-4)',
              }}
            >
              {currentPathObj
                ? currentPathObj.description
                : 'Build fundamental cloud computing principles, core networking, compute patterns, and IAM foundations.'}
            </p>
          </div>

          <div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <span>Track Progress</span>
                <span>
                  {currentPathObj && currentPathObj.lessons
                    ? `${currentPathObj.lessons.filter(l => progress.completedLessons.includes(l.id)).length} / ${currentPathObj.lessons.length} lessons`
                    : '0 / 8 lessons'}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${currentPathProgress}%` }}
                />
              </div>
            </div>

            <Link
              to={currentPathObj ? `/paths/${currentPathObj.id}` : '/paths'}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              View Path Curriculum
            </Link>
          </div>
        </div>

        {/* Suggestion / Tip of the Day */}
        <div
          className="card"
          style={{
            borderLeft: '4px solid var(--color-aws-orange)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
              }}
            >
              <Lightbulb size={18} style={{ color: 'var(--color-aws-orange)' }} />
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--color-aws-orange)',
                  letterSpacing: '0.05em',
                }}
              >
                Architectural Tip of the Day
              </span>
              <span
                className="badge"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  marginLeft: 'auto',
                }}
              >
                {todayTip.category}
              </span>
            </div>

            <h4
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {todayTip.title}
            </h4>

            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              {todayTip.tip}
            </p>
          </div>

          <div
            style={{
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Rotates daily with production design patterns
            </span>
            <Link
              to="/services"
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-link)',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              Explore services <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards (6 Cards Grid) */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Quick Launch Academy Hubs
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {quickLaunchCards.map(item => (
            <div
              key={item.path}
              className="card card-clickable"
              onClick={() => navigate(item.path)}
              tabIndex={0}
              role="button"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(item.path);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'var(--space-5)',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    lineHeight: 'var(--leading-normal)',
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--color-aws-orange)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  marginTop: 'var(--space-4)',
                }}
              >
                <span>Launch Hub</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Completed & Bookmarks in 2 Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {/* Recently Completed Lessons */}
        <section className="card">
          <h3
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <Clock size={18} style={{ color: 'var(--color-cool-blue)' }} />
            Recently Completed Lessons
          </h3>

          {recentCompletedLessons.length === 0 ? (
            <div
              style={{
                padding: 'var(--space-6)',
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <BookOpen size={28} style={{ margin: '0 auto var(--space-2)', opacity: 0.5 }} />
              <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                You have not completed any lessons yet.
              </p>
              <Link to="/paths" className="btn btn-secondary btn-sm">
                Explore Tracks
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {recentCompletedLessons.map(lessonId => {
                const info = lessonMap.get(lessonId);
                const title = info ? info.title : `Lesson: ${lessonId}`;
                const pathId = info ? info.pathId : 'foundations';

                return (
                  <Link
                    key={lessonId}
                    to={`/paths/${pathId}/lessons/${lessonId}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <CheckCircle size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                        {title}
                      </span>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Bookmarks Section */}
        <section className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <Bookmark size={18} style={{ color: 'var(--color-aws-orange)' }} />
              Quick Bookmarks ({progress.bookmarks.length})
            </h3>
            {progress.bookmarks.length > 5 && (
              <Link
                to="/bookmarks"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-link)', fontWeight: 600 }}
              >
                View All
              </Link>
            )}
          </div>

          {displayBookmarks.length === 0 ? (
            <div
              style={{
                padding: 'var(--space-6)',
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Bookmark size={28} style={{ margin: '0 auto var(--space-2)', opacity: 0.5 }} />
              <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                No bookmarks saved yet. Star services, comparisons, or architectures to find them here quickly!
              </p>
              <Link to="/services" className="btn btn-secondary btn-sm">
                Browse Services
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {displayBookmarks.map(id => {
                // Determine destination
                const targetUrl = id.includes('-vs-')
                  ? `/comparisons/${id}`
                  : `/services/${id}`;

                const cleanLabel = id
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                return (
                  <Link
                    key={id}
                    to={targetUrl}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Bookmark size={15} style={{ color: 'var(--color-aws-orange)' }} />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                        {cleanLabel}
                      </span>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
