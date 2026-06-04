'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Render a same-size placeholder before mount to avoid layout shift
  if (!mounted) {
    return (
      <div
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card"
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-lg',
        'border border-border bg-card text-muted-foreground',
        'hover:bg-muted hover:text-foreground',
        'transition-all duration-200 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <span
        className={cn(
          'absolute transition-all duration-300 ease-in-out',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
        aria-hidden="true"
      >
        <Sun size={16} strokeWidth={2} />
      </span>
      <span
        className={cn(
          'absolute transition-all duration-300 ease-in-out',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
        aria-hidden="true"
      >
        <Moon size={16} strokeWidth={2} />
      </span>
    </button>
  )
}
