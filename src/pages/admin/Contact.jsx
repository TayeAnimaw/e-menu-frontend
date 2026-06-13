import SiteFooter from '../../components/SiteFooter'

const SUPPORT_EMAIL = 'tayeanimaw7@gmail.com'
const SUPPORT_PHONE = '0921438827'
const TELEGRAM_USERNAME = 'JustListenNow'
const TELEGRAM_URL = 'https://t.me/JustListenNow'

export default function Contact() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Contact us</h1>
        <p className="mt-1 text-sm text-ink-500">
          Have a question, found a bug, or need help with billing? Reach out any time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-ink-100 transition hover:shadow-md hover:ring-brand-300"
        >
          <h3 className="font-display text-base font-semibold text-ink-900">Email</h3>
          <p className="mt-1.5 break-all text-sm text-brand-600">{SUPPORT_EMAIL}</p>
          <p className="mt-1 text-xs text-ink-500">We usually reply within one business day.</p>
        </a>

        <a
          href={`tel:${SUPPORT_PHONE}`}
          className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-ink-100 transition hover:shadow-md hover:ring-brand-300"
        >
          <h3 className="font-display text-base font-semibold text-ink-900">Phone / WhatsApp</h3>
          <p className="mt-1.5 text-sm text-brand-600">{SUPPORT_PHONE}</p>
          <p className="mt-1 text-xs text-ink-500">Available during business hours.</p>
        </a>

        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-ink-100 transition hover:shadow-md hover:ring-brand-300"
        >
          <h3 className="font-display text-base font-semibold text-ink-900">Telegram</h3>
          <p className="mt-1.5 text-sm text-brand-600">@{TELEGRAM_USERNAME}</p>
          <p className="mt-1 text-xs text-ink-500">Message us directly on Telegram.</p>
        </a>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-ink-100">
        <h3 className="font-display text-base font-semibold text-ink-900">Send us a message</h3>
        <p className="mt-1 text-sm text-ink-500">
          Open your email app with a pre-filled message describing your issue.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('E-Menu support request')}`}
          className="mt-4 inline-flex rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800"
        >
          Compose email
        </a>
      </div>

      <SiteFooter className="-mx-4 py-4 sm:-mx-6" />
    </div>
  )
}
