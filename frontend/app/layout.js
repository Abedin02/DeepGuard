'use client'
import Navbar from '@/components/Navbar'
import DarkModeToggle from '@/components/DarkModeToggle'
import { ResultsProvider } from '@/context/ResultsContext'
import { ThemeProvider, useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { GridPattern } from '@/registry/magicui/grid-pattern'

function AppContent({ children }) {
  const { theme } = useTheme()

  return (
    <body suppressHydrationWarning style={{
      margin: 0,
      background: theme.bg,
      color: theme.text,
      fontFamily: "'Jost', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <ResultsProvider>
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            color: theme.primary,
            opacity: theme.bg === '#ffffff' ? 0.14 : 0.18,
          }}
        >
          <GridPattern
            squares={[
              [4, 4],
              [5, 1],
              [8, 2],
              [5, 3],
              [5, 5],
              [10, 10],
              [12, 15],
              [15, 10],
              [10, 15],
              [15, 10],
              [10, 15],
              [15, 10],
            ]}
            className={cn(
              'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
            )}
            style={{
              inset: '-30% 0',
              height: '200%',
              transform: 'skewY(12deg)',
              WebkitMaskImage: 'radial-gradient(400px circle at center, white, transparent)',
              maskImage: 'radial-gradient(400px circle at center, white, transparent)',
            }}
          />
        </div>
        <Navbar />
        <main style={{ paddingTop: '72px', flex: 1, position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <DarkModeToggle />
      </ResultsProvider>
    </body>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
        `}</style>
      </head>
      <ThemeProvider>
        <AppContent>{children}</AppContent>
      </ThemeProvider>
    </html>
  )
}
