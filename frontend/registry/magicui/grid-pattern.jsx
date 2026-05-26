'use client'

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  squares,
  className,
  style,
  ...props
}) {
  const id = 'deepguard-grid-pattern'

  return (
    <svg
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            stroke="currentColor"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {squares?.map(([squareX, squareY], index) => (
        <rect
          key={`${squareX}-${squareY}-${index}`}
          width={width - 1}
          height={height - 1}
          x={squareX * width + 1}
          y={squareY * height + 1}
          fill="currentColor"
          fillOpacity="0.12"
          strokeWidth="0"
        />
      ))}
    </svg>
  )
}
