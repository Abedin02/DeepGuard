'use client'

import { useEffect, useRef, useState } from 'react'

export function DiaTextReveal({
  text,
  colors,
  className,
  style,
}) {
  const revealColors = colors?.length ? colors : ['currentColor']
  const rootRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      const timer = window.setTimeout(() => setIsVisible(true), 0)
      return () => window.clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsVisible(true)
        observer.disconnect()
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <span
      ref={rootRef}
      className={className}
      style={{
        display: 'inline-block',
        color: 'inherit',
        ...style,
      }}
    >
      {Array.from(text).map((character, index) => (
        <span
          key={`${character}-${index}`}
          className="deepguard-dia-text-reveal-character"
          style={{
            display: character === ' ' ? 'inline' : 'inline-block',
            color: revealColors[index % revealColors.length],
            opacity: isVisible ? undefined : 0,
            animationName: isVisible ? 'deepguard-dia-reveal' : 'none',
            animationDuration: '560ms',
            animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
            animationFillMode: 'both',
            animationDelay: isVisible ? `${index * 28}ms` : '0ms',
          }}
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
      <style>{`
        @keyframes deepguard-dia-reveal {
          from {
            opacity: 0;
            transform: translateY(0.35em) rotateX(72deg);
            filter: blur(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            filter: blur(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .deepguard-dia-text-reveal-character {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>
    </span>
  )
}
