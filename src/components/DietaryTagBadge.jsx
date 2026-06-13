const TAG_STYLES = {
  vegan: "bg-emerald-100 text-emerald-800 ring-emerald-200/50",
  vegetarian: "bg-emerald-100 text-emerald-800 ring-emerald-200/50",
  "gluten-free": "bg-amber-100 text-amber-800 ring-amber-200/50",
  "dairy-free": "bg-sky-100 text-sky-800 ring-sky-200/50",
  "nut-free": "bg-yellow-100 text-yellow-800 ring-yellow-200/50",
  halal: "bg-teal-100 text-teal-800 ring-teal-200/50",
  keto: "bg-purple-100 text-purple-800 ring-purple-200/50",
  spicy: "bg-red-100 text-red-800 ring-red-200/50",
};

const DEFAULT_STYLE = "bg-ink-100 text-ink-700 ring-ink-200/50";

export default function DietaryTagBadge({ tag }) {
  const style = TAG_STYLES[tag.toLowerCase()] || DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 transition ${style}`}
    >
      {tag}
    </span>
  );
}
