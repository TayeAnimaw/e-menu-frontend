const TAG_STYLES = {
  vegan: 'bg-green-100 text-green-800',
  vegetarian: 'bg-emerald-100 text-emerald-800',
  'gluten-free': 'bg-amber-100 text-amber-800',
  'dairy-free': 'bg-sky-100 text-sky-800',
  'nut-free': 'bg-yellow-100 text-yellow-800',
  halal: 'bg-teal-100 text-teal-800',
  keto: 'bg-purple-100 text-purple-800',
  spicy: 'bg-red-100 text-red-800',
}

const DEFAULT_STYLE = 'bg-gray-100 text-gray-700'

export default function DietaryTagBadge({ tag }) {
  const style = TAG_STYLES[tag.toLowerCase()] || DEFAULT_STYLE

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style}`}>
      {tag}
    </span>
  )
}
