'use client'

import { useEffect, useMemo, useState } from 'react'

export function TypingAnimation({
  children,
  duration = 45,
  delay = 200,
  className,
  style,
}) {
  const text = useMemo(() => String(children ?? ''), [children])
  const [displayedText, setDisplayedText] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers = []

    if (prefersReducedMotion) {
      timers.push(
        window.setTimeout(() => {
          setDisplayedText(text)
          setIsDone(true)
        }, 0)
      )
      return () => timers.forEach((timer) => window.clearTimeout(timer))
    }

    timers.push(
      window.setTimeout(() => {
        setDisplayedText('')
        setIsDone(false)
      }, 0)
    )

    const characters = Array.from(text)

    if (characters.length === 0) {
      timers.push(
        window.setTimeout(() => {
          setIsDone(true)
        }, 0)
      )
      return () => timers.forEach((timer) => window.clearTimeout(timer))
    }

    characters.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setDisplayedText(characters.slice(0, index + 1).join(''))
          if (index === characters.length - 1) {
            setIsDone(true)
          }
        }, delay + index * duration)
      )
    })

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [delay, duration, text])

  return (
    <span
      className={className}
      aria-label={text}
      style={{
        display: 'inline-grid',
        position: 'relative',
        whiteSpace: 'normal',
        ...style,
      }}
    >
      <span aria-hidden="true" style={{ gridArea: '1 / 1', visibility: 'hidden' }}>
        {text}
      </span>
      <span aria-hidden="true" style={{ gridArea: '1 / 1' }}>
        {displayedText}
        <span
          style={{
            display: 'inline-block',
            width: '0.08em',
            height: '0.9em',
            marginLeft: '0.08em',
            backgroundColor: 'currentColor',
            verticalAlign: '-0.08em',
            opacity: isDone ? 0 : 1,
            animation: 'deepguard-type-caret 900ms steps(2, start) infinite',
            transition: 'opacity 180ms ease',
          }}
        />
      </span>
      <style>{`
        @keyframes deepguard-type-caret {
          0%, 45% { opacity: 1; }
          46%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}
