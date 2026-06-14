export default function SiteFooter({ className = '' }) {
  return (
    <footer className={`border-t border-ink-100 px-6 py-4 text-center ${className}`}>
      <p className="text-xs text-ink-400">
        Powered by{' '}
        <a
          href="https://t.me/JustListenNow"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-600 hover:underline"
        >
          Taye Animaw
        </a>
      </p>
      <p className="mt-1 text-xs text-ink-400">
        Want a modern digital menu for your cafe?{' '}
        <a
          href="tel:0921438827"
          className="font-semibold text-brand-600 hover:underline"
        >
          Call&nbsp;0921&nbsp;438&nbsp;827
        </a>{' '}
        or{' '}
        <a
          href="https://wa.me/251921438827"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-600 hover:underline"
        >
          WhatsApp us
        </a>
      </p>
    </footer>
  )
}
