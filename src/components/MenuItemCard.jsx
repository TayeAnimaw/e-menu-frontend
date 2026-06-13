import LazyImage from './LazyImage'
import DietaryTagBadge from './DietaryTagBadge'

export default function MenuItemCard({ item }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-50">
        <LazyImage src={item.image_url} alt={item.name} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-900/60 to-ink-800/60 backdrop-blur-sm">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-800 shadow">
              Currently unavailable
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-ink-900 sm:text-lg">{item.name}</h3>
          <span className="whitespace-nowrap rounded-full bg-gradient-to-br from-brand-50 to-brand-100 px-2.5 py-1 text-sm font-bold text-brand-700 shadow-sm">
            {Number(item.price).toFixed(2)} ETB
          </span>
        </div>

        {item.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-ink-500">{item.description}</p>
        )}

        {item.tags?.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <DietaryTagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
