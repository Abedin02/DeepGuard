'use client'

import { AnimatedThemeToggler } from '@/registry/magicui/animated-theme-toggler'

export default function DarkModeToggle() {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
    }}>
      <AnimatedThemeToggler />
    </div>
  )
}
