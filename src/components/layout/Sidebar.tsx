import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Server,
  GitCompare,
  Building,
  FlaskConical,
  Wrench,
  Brain,
  BookA,
  Bookmark,
  PenLine,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

export interface LearningPathNavItem {
  id: string;
  number: number;
  title: string;
}

export const LEARNING_PATHS_LIST: LearningPathNavItem[] = [
  { id: 'foundations', number: 1, title: 'Cloud Foundations & Core Concepts' },
  { id: 'compute', number: 2, title: 'Compute Services (EC2, ECS, Lambda)' },
  { id: 'storage', number: 3, title: 'Storage & Data Management (S3, EBS, EFS)' },
  { id: 'networking', number: 4, title: 'Networking & VPC Architecture' },
  { id: 'databases', number: 5, title: 'Databases & Caching (RDS, DynamoDB)' },
  { id: 'security', number: 6, title: 'Security, IAM & Compliance' },
  { id: 'serverless', number: 7, title: 'Serverless Architecture & Event-Driven' },
  { id: 'containers', number: 8, title: 'Containers & Orchestration (EKS, ECS)' },
  { id: 'iac', number: 9, title: 'Infrastructure as Code (Terraform, CDK)' },
  { id: 'monitoring', number: 10, title: 'Monitoring, Logging & Observability' },
  { id: 'reliability', number: 11, title: 'High Availability & Fault Tolerance' },
  { id: 'cost-optimization', number: 12, title: 'Cost Optimization & FinOps' },
  { id: 'enterprise-governance', number: 13, title: 'Enterprise & Multi-Account Setup' },
  { id: 'migration', number: 14, title: 'Migration & Modernization' },
  { id: 'devops-cicd', number: 15, title: 'CI/CD & DevOps Automation' },
  { id: 'messaging', number: 16, title: 'Messaging & Asynchronous Systems' },
  { id: 'analytics', number: 17, title: 'Analytics & Big Data Processing' },
  { id: 'edge-networking', number: 18, title: 'Edge Networking & CDN (CloudFront)' },
  { id: 'disaster-recovery', number: 19, title: 'Disaster Recovery & Business Continuity' },
  { id: 'well-architected', number: 20, title: 'Well-Architected Solutions Design' },
];

interface MainNavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  badge?: string;
}

const PRIMARY_NAV_ITEMS: MainNavItem[] = [
  { label: 'Dashboard', to: '/', icon: Home },
  { label: 'Service Explorer', to: '/services', icon: Server },
  { label: 'Comparisons', to: '/comparisons', icon: GitCompare },
  { label: 'Architectures', to: '/architectures', icon: Building },
  { label: 'Labs', to: '/labs', icon: FlaskConical },
  { label: 'Troubleshooting', to: '/troubleshooting', icon: Wrench },
  { label: 'Quizzes', to: '/quizzes', icon: Brain },
  { label: 'Glossary', to: '/glossary', icon: BookA },
];

const USER_NAV_ITEMS: MainNavItem[] = [
  { label: 'Bookmarks', to: '/bookmarks', icon: Bookmark },
  { label: 'Notes', to: '/notes', icon: PenLine },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPath }) => {
  const location = useLocation();
  const [isPathsExpanded, setIsPathsExpanded] = useState<boolean>(() => {
    return location.pathname.startsWith('/paths');
  });

  const isItemActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isCurrentLearningPath = (pathId: string): boolean => {
    return (
      location.pathname === `/paths/${pathId}` ||
      location.pathname.startsWith(`/paths/${pathId}/`) ||
      currentPath === pathId
    );
  };

  const handleLinkClick = () => {
    // Auto-close sidebar on mobile navigation
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          role="presentation"
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 27, 45, 0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 45,
            transition: 'opacity var(--transition-normal)',
          }}
          className="sidebar-mobile-backdrop"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        id="app-sidebar"
        role="navigation"
        aria-label="Main Navigation"
        className={`app-sidebar-container ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 'var(--topbar-height, 60px)',
          left: 0,
          bottom: 0,
          width: 'var(--sidebar-width, 280px)',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'transform var(--transition-normal), background var(--transition-normal)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Mobile Header in Sidebar */}
        <div
          className="sidebar-mobile-header"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-3, 12px) var(--space-4, 16px)',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'var(--color-aws-orange)' }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Navigation</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Items List */}
        <div style={{ padding: 'var(--space-3, 12px) var(--space-2, 8px)', flex: 1 }}>
          {/* Main Section */}
          <div style={{ marginBottom: 'var(--space-4, 16px)' }}>
            <div
              style={{
                padding: '4px var(--space-3, 12px)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-tertiary)',
                marginBottom: '4px',
              }}
            >
              Main
            </div>

            {/* Dashboard Link */}
            {(() => {
              const active = isItemActive('/');
              return (
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3, 12px)',
                    padding: '8px var(--space-3, 12px)',
                    margin: '2px 0',
                    borderRadius: 'var(--radius-md, 8px)',
                    color: active ? 'var(--color-aws-orange)' : 'var(--text-primary)',
                    background: active ? 'var(--bg-active)' : 'transparent',
                    borderLeft: active ? '3px solid var(--color-aws-orange)' : '3px solid transparent',
                    fontWeight: active ? 600 : 500,
                    fontSize: 'var(--text-sm, 0.875rem)',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Home size={18} style={{ flexShrink: 0 }} />
                  <span>Dashboard</span>
                </Link>
              );
            })()}

            {/* Learning Paths Collapsible Section */}
            <div style={{ margin: '2px 0' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px var(--space-3, 12px)',
                  borderRadius: 'var(--radius-md, 8px)',
                  background: isItemActive('/paths') ? 'var(--bg-active)' : 'transparent',
                  borderLeft: isItemActive('/paths')
                    ? '3px solid var(--color-aws-orange)'
                    : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!isItemActive('/paths')) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isItemActive('/paths')) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Link
                  to="/paths"
                  onClick={handleLinkClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3, 12px)',
                    color: isItemActive('/paths') ? 'var(--color-aws-orange)' : 'var(--text-primary)',
                    fontWeight: isItemActive('/paths') ? 600 : 500,
                    fontSize: 'var(--text-sm, 0.875rem)',
                    textDecoration: 'none',
                    flex: 1,
                  }}
                >
                  <BookOpen size={18} style={{ flexShrink: 0 }} />
                  <span>Learning Paths</span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full, 9999px)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                    }}
                  >
                    20
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPathsExpanded((prev) => !prev);
                  }}
                  aria-expanded={isPathsExpanded}
                  aria-label={isPathsExpanded ? 'Collapse Learning Paths' : 'Expand Learning Paths'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '2px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {isPathsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>

              {/* Nested 20 Learning Paths */}
              {isPathsExpanded && (
                <div
                  role="region"
                  aria-label="All Learning Paths"
                  style={{
                    marginTop: '4px',
                    marginLeft: '12px',
                    paddingLeft: '12px',
                    borderLeft: '1px dashed var(--border-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    maxHeight: '360px',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                  }}
                >
                  {LEARNING_PATHS_LIST.map((path) => {
                    const activePath = isCurrentLearningPath(path.id);
                    return (
                      <Link
                        key={path.id}
                        to={`/paths/${path.id}`}
                        onClick={handleLinkClick}
                        title={path.title}
                        aria-current={activePath ? 'page' : undefined}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-sm, 4px)',
                          fontSize: 'var(--text-xs, 0.75rem)',
                          color: activePath ? 'var(--color-aws-orange)' : 'var(--text-secondary)',
                          background: activePath ? 'var(--bg-active)' : 'transparent',
                          fontWeight: activePath ? 600 : 400,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          transition: 'background var(--transition-fast), color var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          if (!activePath) {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!activePath) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: activePath ? 'var(--color-aws-orange)' : 'var(--bg-secondary)',
                            color: activePath ? '#ffffff' : 'var(--text-tertiary)',
                            fontSize: '10px',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {path.number}
                        </span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {path.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Other Primary Items */}
            {PRIMARY_NAV_ITEMS.slice(1).map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleLinkClick}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3, 12px)',
                    padding: '8px var(--space-3, 12px)',
                    margin: '2px 0',
                    borderRadius: 'var(--radius-md, 8px)',
                    color: active ? 'var(--color-aws-orange)' : 'var(--text-primary)',
                    background: active ? 'var(--bg-active)' : 'transparent',
                    borderLeft: active ? '3px solid var(--color-aws-orange)' : '3px solid transparent',
                    fontWeight: active ? 600 : 500,
                    fontSize: 'var(--text-sm, 0.875rem)',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Workspace Section */}
          <div style={{ marginTop: 'var(--space-4, 16px)', borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-3, 12px)' }}>
            <div
              style={{
                padding: '4px var(--space-3, 12px)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-tertiary)',
                marginBottom: '4px',
              }}
            >
              Workspace
            </div>

            {USER_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleLinkClick}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3, 12px)',
                    padding: '8px var(--space-3, 12px)',
                    margin: '2px 0',
                    borderRadius: 'var(--radius-md, 8px)',
                    color: active ? 'var(--color-aws-orange)' : 'var(--text-primary)',
                    background: active ? 'var(--bg-active)' : 'transparent',
                    borderLeft: active ? '3px solid var(--color-aws-orange)' : '3px solid transparent',
                    fontWeight: active ? 600 : 500,
                    fontSize: 'var(--text-sm, 0.875rem)',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: 'var(--space-3, 12px) var(--space-4, 16px)',
            borderTop: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            fontSize: 'var(--text-xs, 0.75rem)',
            color: 'var(--text-tertiary)',
            textAlign: 'center',
          }}
        >
          AWS Cloud Engineering Academy v1.0
        </div>
      </aside>

      {/* Responsive Styles for Sidebar */}
      <style>{`
        @media (max-width: 1024px) {
          .app-sidebar-container {
            transform: translateX(-100%);
            box-shadow: var(--shadow-xl);
          }
          .app-sidebar-container.open {
            transform: translateX(0);
          }
          .sidebar-mobile-header {
            display: flex !important;
          }
        }
        @media (min-width: 1025px) {
          .sidebar-mobile-backdrop {
            display: none !important;
          }
          .app-sidebar-container {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
