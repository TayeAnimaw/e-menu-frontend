export default function SiteFooter({ className = '' }) {
  return (
    <footer className={`border-t border-ink-100 px-6 text-center text-xs text-ink-400 ${className}`}>
      Powered by{' '}
      <a
        href="https://tayeanimaw.com"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-brand-600 hover:underline"
      >
        Taye Animaw
      </a>
    </footer>
  )
}
