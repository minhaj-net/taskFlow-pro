'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Home, Zap, DollarSign, Info, Mail, LogIn, LogOut, Rocket } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isLoggedIn: boolean
  dashboardPath: string
  onLogout: () => void
}

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/features', label: 'Features', icon: Zap },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
]

export default function MobileMenu({ isOpen, onClose, isLoggedIn, dashboardPath, onLogout }: MobileMenuProps) {
  const pathname = usePathname()
  const firstFocusableRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => firstFocusableRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col',
          'bg-card border-l border-border shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-tf-indigo shadow-md shadow-primary/25">
              <Zap size={16} className="text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-sm font-semibold text-foreground">TaskFlow Pro</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              aria-label="Close menu"
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg',
                'text-muted-foreground hover:bg-muted hover:text-foreground',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
          <ul className="space-y-1" role="list">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted',
                    )}
                  >
                    <Icon
                      size={18}
                      className={isActive ? 'text-primary' : 'text-muted-foreground'}
                    />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Auth buttons */}
        <div className="border-t border-border px-4 py-6 space-y-3">
          {isLoggedIn ? (
            <button
              onClick={() => { onLogout(); onClose() }}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3',
                'text-sm font-medium text-foreground',
                'border border-border bg-background hover:bg-muted',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <LogOut size={16} />
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3',
                'text-sm font-medium text-foreground',
                'border border-border bg-background hover:bg-muted',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <LogIn size={16} />
              Log in
            </Link>
          )}
          <Link
            href={isLoggedIn ? dashboardPath : '/login'}
            onClick={onClose}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3',
              'text-sm font-semibold text-primary-foreground',
              'bg-gradient-to-r from-primary to-tf-indigo',
              'shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35',
              'active:scale-[0.98] transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
          >
            <Rocket size={16} />
            {isLoggedIn ? 'Dashboard' : 'Get Started'}
          </Link>
        </div>
      </div>
    </>
  )
}
