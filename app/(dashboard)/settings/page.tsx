'use client'

import { useEffect, useState } from 'react'
import { Settings, RefreshCw, Bell, Sliders, Monitor, Globe, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import type { User } from '@/types'

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  if (!currentUser) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your dashboard preferences, notification options, and system parameters.
        </p>
      </div>

      {/* Main card */}
      <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        {/* Profile Settings Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Sliders size={16} className="text-primary" />
            General Preferences
          </h2>
          
          <div className="space-y-3">
            {/* Theme Mode toggle (custom UI) */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div>
                <span className="font-semibold text-foreground block">Dark Mode</span>
                <span className="text-[11px] text-muted-foreground">Toggle the visual interface theme preference.</span>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                  darkMode ? 'bg-primary' : 'bg-muted border border-border'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings Section */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Bell size={16} className="text-primary" />
            Notification Prefs
          </h2>
          
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground block">Email Notifications</span>
                <span className="text-[11px] text-muted-foreground">Receive daily digest updates for overdue deadlines.</span>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotif(!emailNotif)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                  emailNotif ? 'bg-primary' : 'bg-muted border border-border'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
                    emailNotif ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground block">Push Notifications</span>
                <span className="text-[11px] text-muted-foreground">Receive real-time dashboard notifications.</span>
              </div>
              <button
                type="button"
                onClick={() => setPushNotif(!pushNotif)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                  pushNotif ? 'bg-primary' : 'bg-muted border border-border'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
                    pushNotif ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            {/* Weekly digests */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground block">Weekly Digest Email</span>
                <span className="text-[11px] text-muted-foreground">A clean summary of your task workload every Monday.</span>
              </div>
              <button
                type="button"
                onClick={() => setWeeklyDigest(!weeklyDigest)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                  weeklyDigest ? 'bg-primary' : 'bg-muted border border-border'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
                    weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <span className={cn(
            'text-xs font-semibold text-emerald transition-opacity duration-300',
            saveSuccess ? 'opacity-100' : 'opacity-0'
          )}>
            Preferences saved successfully!
          </span>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-5 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  )
}
