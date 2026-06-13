import { useEffect, useState } from 'react'
import { onInstallPromptAvailable, clearDeferredPrompt, isStandalone } from '../utils/pwaInstall'

export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem('pwa-install-dismissed')) return

    return onInstallPromptAvailable((event) => {
      setDeferredPrompt(event)
      setVisible(true)
    })
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('pwa-install-dismissed', '1')
    setVisible(false)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    clearDeferredPrompt()
    setDeferredPrompt(null)
    dismiss()
  }

  if (!visible) return null

  return (
    <div className="animate-bounce-in fixed right-4 top-20 z-50 w-72 max-w-[calc(100%-2rem)] sm:right-6 sm:top-24">
      <div className="animate-wiggle relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-4 text-white shadow-2xl shadow-brand-600/30 ring-1 ring-brand-700/50">
        <div className="animate-float pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15 blur-2xl" />

        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-3 pr-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl">
            📲
          </span>
          <div>
            <p className="font-display text-sm font-semibold leading-tight">
              Get the E-Menu app!
            </p>
            <p className="mt-0.5 text-xs text-brand-50">
              Install for quick, app-like access — no app store needed.
            </p>
          </div>
        </div>

        <button
          onClick={handleInstall}
          className="mt-3 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow transition hover:scale-105 hover:bg-brand-50"
        >
          Install app
        </button>
      </div>
    </div>
  )
}
