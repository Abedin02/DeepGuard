'use client'

import { useState } from 'react'

export function RippleButton({
  children,
  rippleColor = '#ADD8E6',
  style,
  disabled,
  onPointerDown,
  type = 'button',
  ...props
}) {
  const [ripples, setRipples] = useState([])

  const handlePointerDown = (event) => {
    onPointerDown?.(event)

    if (disabled || event.defaultPrevented) return

    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const ripple = {
      id: `${Date.now()}-${Math.random()}`,
      size,
      x: event.clientX - rect.left - size / 2,
      y: event.clientY - rect.top - size / 2,
    }

    setRipples((current) => [...current, ripple])
    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== ripple.id))
    }, 650)
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      style={{
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        ...style,
      }}
      {...props}
    >
      <span style={{ display: 'contents' }}>
        {children}
      </span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '999px',
            backgroundColor: rippleColor,
            pointerEvents: 'none',
            transform: 'scale(0)',
            opacity: 0.9,
            zIndex: 0,
            animation: 'deepguard-ripple 650ms ease-out forwards',
          }}
        />
      ))}
      <style>{`
        @keyframes deepguard-ripple {
          to {
            transform: scale(2.6);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}
