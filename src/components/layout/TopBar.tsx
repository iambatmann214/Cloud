import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Search, Sun, Moon, Menu, X } from 'lucide-react';

export interface TopBarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onSearchOpen: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  progressPercent: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onMenuToggle,
  isMenuOpen,
  onSearchOpen,
  theme,
  onThemeToggle,
  progressPercent = 0,
}) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  const clampedProgress = Math.min(100, Math.max(0, Math.round(progressPercent)));
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--topbar-height, 60px)',
        background: 'var(--bg-topbar)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4, 16px)',
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)',
        transition: 'background var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      {/* Left: Mobile Menu Toggle + Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3, 12px)' }}>
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="app-sidebar"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            padding: 0,
            background: 'transparent',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md, 8px)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'background var(--transition-fast), color var(--transition-fast)',
          }}
          className="topbar-mobile-menu-btn"
        >
          {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>

        <Link
          to="/"
          aria-label="AWS Cloud Engineering Academy Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2, 8px)',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 'var(--text-lg, 1.125rem)',
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md, 8px)',
              background: 'linear-gradient(135deg, #ff9900 0%, #e88a00 100%)',
              color: '#ffffff',
              boxShadow: '0 2px 4px rgba(255, 153, 0, 0.35)',
              flexShrink: 0,
            }}
          >
            <Cloud size={20} strokeWidth={2.5} aria-hidden="true" />
          </div>
          <span className="topbar-brand-title" style={{ whiteSpace: 'nowrap' }}>
            <span style={{ color: 'var(--color-aws-orange)' }}>AWS</span>{' '}
            <span style={{ fontWeight: 600 }}>Cloud Academy</span>
          </span>
        </Link>
      </div>

      {/* Center: Search Button / Trigger */}
      <div style={{ flex: '1', maxWidth: '480px', margin: '0 var(--space-4, 16px)' }}>
        <button
          type="button"
          onClick={onSearchOpen}
          aria-label="Search Academy lessons, services, and architectures"
          style={{
            width: '100%',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-3, 12px)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-full, 9999px)',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--text-sm, 0.875rem)',
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast), background var(--transition-fast)',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-secondary)';
            e.currentTarget.style.background = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.background = 'var(--bg-secondary)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-focus)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2, 8px)' }}>
            <Search size={16} aria-hidden="true" style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Search academy...</span>
          </div>
          <kbd
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 7px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-sm, 4px)',
              lineHeight: 1,
            }}
          >
            {isMac ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>
      </div>

      {/* Right: Progress indicator + Theme toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3, 12px)' }}>
        {/* Progress Indicator */}
        <div
          title={`Overall Progress: ${clampedProgress}% completed`}
          aria-label={`Overall progress: ${clampedProgress} percent`}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2, 8px)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full, 9999px)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 36 36"
            style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}
            aria-hidden="true"
          >
            {/* Background Circle */}
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke="var(--border-secondary)"
              strokeWidth="3.2"
            />
            {/* Foreground Fill */}
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke="var(--color-aws-orange)"
              strokeWidth="3.2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset var(--transition-normal)',
              }}
            />
          </svg>
          <div
            className="topbar-progress-text"
            style={{
              fontSize: 'var(--text-xs, 0.75rem)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              minWidth: '32px',
            }}
          >
            {clampedProgress}%
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md, 8px)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'background var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-secondary)';
            e.currentTarget.style.background = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.background = 'var(--bg-secondary)';
          }}
        >
          {theme === 'light' ? (
            <Moon size={18} aria-hidden="true" style={{ color: 'var(--color-charcoal)' }} />
          ) : (
            <Sun size={18} aria-hidden="true" style={{ color: 'var(--color-aws-orange)' }} />
          )}
        </button>
      </div>

      {/* Responsive Style Tag for TopBar media queries */}
      <style>{`
        @media (max-width: 1024px) {
          .topbar-mobile-menu-btn {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .topbar-brand-title {
            display: none !important;
          }
          .topbar-progress-text {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default TopBar;
