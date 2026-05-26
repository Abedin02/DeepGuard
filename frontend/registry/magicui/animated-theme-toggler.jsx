'use client'

import { useTheme } from '@/context/ThemeContext'
import { RippleButton } from '@/registry/magicui/ripple-button'

export function AnimatedThemeToggler() {
  const { darkMode, toggleDarkMode, theme } = useTheme()

  return (
    <RippleButton
      type="button"
      rippleColor="rgba(147, 197, 253, 0.45)"
      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={darkMode}
      onClick={toggleDarkMode}
      style={{
        width: '56px',
        height: '56px',
        border: `1px solid ${theme.border}`,
        borderRadius: '999px',
        background: darkMode
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #eef4ff 100%)',
        color: darkMode ? '#f8fafc' : '#0f172a',
        cursor: 'pointer',
        display: 'inline-grid',
        placeItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: darkMode
          ? '0 14px 28px rgba(0,0,0,0.35)'
          : '0 14px 28px rgba(30,58,138,0.14)',
        transition: 'background 260ms ease, border-color 260ms ease, box-shadow 260ms ease, transform 160ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseDown={(event) => {
        event.currentTarget.style.transform = 'scale(0.94)'
      }}
      onMouseUp={(event) => {
        event.currentTarget.style.transform = 'scale(1)'
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = 'scale(1)'
      }}
      onFocus={(event) => {
        event.currentTarget.style.outline = `3px solid ${darkMode ? '#60a5fa' : '#93c5fd'}`
        event.currentTarget.style.outlineOffset = '3px'
      }}
      onBlur={(event) => {
        event.currentTarget.style.outline = 'none'
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '7px',
          borderRadius: '999px',
          background: darkMode
            ? 'radial-gradient(circle at 62% 38%, transparent 0 8px, #f8fafc 9px 18px)'
            : 'radial-gradient(circle, #fbbf24 0 11px, transparent 12px)',
          transition: 'background 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1)',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '7px',
          height: '7px',
          top: '14px',
          left: '15px',
          borderRadius: '999px',
          backgroundColor: '#93c5fd',
          opacity: darkMode ? 1 : 0,
          transform: darkMode ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.2)',
          transition: 'opacity 220ms ease, transform 260ms ease',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          right: '16px',
          bottom: '15px',
          borderRadius: '999px',
          backgroundColor: '#bfdbfe',
          opacity: darkMode ? 1 : 0,
          transform: darkMode ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.2)',
          transition: 'opacity 220ms ease, transform 260ms ease',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: darkMode
            ? 'inset 0 0 0 1px rgba(255,255,255,0.05)'
            : 'inset 0 0 0 1px rgba(30,58,138,0.04)',
        }}
      />
    </RippleButton>
  )
}
