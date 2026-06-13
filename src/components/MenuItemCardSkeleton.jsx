export default function MenuItemCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-100">
      <div className="aspect-[4/3] w-full shimmer" />
      <div className="flex flex-col gap-2 p-3 sm:p-4">
        <div className="h-4 w-2/3 shimmer rounded" />
        <div className="h-3 w-full shimmer rounded" />
        <div className="h-3 w-5/6 shimmer rounded" />
      </div>
    </div>
  )
}
