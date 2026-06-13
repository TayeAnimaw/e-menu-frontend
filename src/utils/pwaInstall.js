// Captures the `beforeinstallprompt` event as early as possible (it can fire
// before React mounts), so components can react to it whenever they render.
let deferredEvent = null
const listeners = new Set()

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredEvent = event
  listeners.forEach((cb) => cb(event))
})

export function onInstallPromptAvailable(callback) {
  if (deferredEvent) callback(deferredEvent)
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export function clearDeferredPrompt() {
  deferredEvent = null
}

export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}
