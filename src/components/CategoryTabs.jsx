export default function CategoryTabs({ categories, activeId, onSelect }) {
  const btnClass = (active) =>
    `flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/25'
        : 'bg-white text-ink-600 ring-1 ring-ink-100 hover:bg-ink-50 hover:text-ink-900'
    }`

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
      {/* All tab — active when activeId is null */}
      <button onClick={() => onSelect(null)} className={btnClass(activeId === null)}>
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={btnClass(activeId === category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
