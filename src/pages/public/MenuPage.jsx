import { useEffect, useMemo, useState } from "react";
import apiClient from "../../api/client";
import CategoryTabs from "../../components/CategoryTabs";
import MenuItemCard from "../../components/MenuItemCard";
import MenuItemCardSkeleton from "../../components/MenuItemCardSkeleton";
import SiteFooter from "../../components/SiteFooter";

export default function MenuPage({ subdomain, hideFooter = false }) {
  const [menu, setMenu] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not-found | error
  const [activeCategory, setActiveCategory] = useState(null); // null = All
  const [search, setSearch] = useState("");
  const [sortPrice, setSortPrice] = useState("none"); // none | asc | desc

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");
    setMenu(null);
    setActiveCategory(null);
    setSearch("");
    setSortPrice("none");

    apiClient
      .get(`/menu/${subdomain}`)
      .then(({ data }) => {
        if (cancelled) return;
        setMenu(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus(error.response?.status === 404 ? "not-found" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [subdomain]);

  // Filter categories/items by search query
  const filteredCategories = useMemo(() => {
    if (!menu) return [];
    const query = search.trim().toLowerCase();
    if (!query) return menu.categories;

    return menu.categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.tags?.some((tag) => tag.toLowerCase().includes(query))
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [menu, search]);

  // Items to display based on active category + search
  const baseItems = useMemo(() => {
    if (search.trim()) {
      return filteredCategories.flatMap((c) => c.items);
    }
    if (activeCategory === null) {
      return filteredCategories.flatMap((c) => c.items);
    }
    return filteredCategories.find((c) => c.id === activeCategory)?.items ?? [];
  }, [filteredCategories, activeCategory, search]);

  // Apply price sort on top
  const itemsToShow = useMemo(() => {
    if (sortPrice === "none") return baseItems;
    return [...baseItems].sort((a, b) =>
      sortPrice === "asc" ? a.price - b.price : b.price - a.price
    );
  }, [baseItems, sortPrice]);

  if (status === "loading") {
    return (
      <div className="bg-menu-pattern-light min-h-screen bg-ink-50">
        <div className="sticky top-0 z-10 border-b border-ink-100 bg-white/80 px-4 py-7 backdrop-blur-sm">
          <div className="h-7 w-48 animate-pulse rounded-full bg-ink-100" />
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <MenuItemCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="bg-menu-pattern-light flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-50 px-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Menu not found
        </h1>
        <p className="max-w-sm text-ink-500">
          We couldn't find a published menu at "{subdomain}". Double-check the
          link or subdomain and try again.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-menu-pattern-light flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-50 px-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Something went wrong
        </h1>
        <p className="max-w-sm text-ink-500">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-menu-pattern-light min-h-screen bg-ink-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 px-4 pb-4 pt-5 shadow-sm backdrop-blur-sm sm:px-6">

        {/* Top row: cafe name (left) | welcome badge (right) */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900 truncate sm:text-3xl">
            {menu.cafe.name}
          </h1>

          {/* Welcome badge — horizontal single row */}
          <span className="shrink-0 flex items-center gap-2 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 px-4 py-2.5 ring-1 ring-emerald-200 shadow-sm">
            <span className="text-xl leading-none">🙏</span>
            <span className="text-sm font-bold text-emerald-700 sm:text-base">እኛን ስለመረጡ እናመሰናለን</span>
          </span>
        </div>

        {/* Subtitle — below both the cafe name and the badge */}
        <p className="mt-1 text-xs italic font-medium text-emerald-600 tracking-wide sm:text-sm">
          የአገልግሎቶቻችንን ዝርዝሮች ይመልከቱ
        </p>

        {/* Search (left) + Sort (right) side by side */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ምግቦችን፣ መጠጦችን ፈልጉ..."
              className="w-full rounded-full border border-ink-200 bg-ink-50 py-3 pl-11 pr-4 text-base text-ink-900 shadow-inner placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>

          {/* Sort — two toggle buttons only (clicking active one resets to default) */}
          <div className="flex shrink-0 items-center gap-1.5">
            {[
              { value: "asc",  label: "ዋጋ ↑" },
              { value: "desc", label: "ዋጋ ↓" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortPrice(sortPrice === opt.value ? "none" : opt.value)}
                className={`rounded-full px-4 py-3 text-sm font-bold transition-all ${
                  sortPrice === opt.value
                    ? "bg-brand-600 text-white shadow-md"
                    : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Category tabs — always shown (includes "All") */}
      {menu.categories.length > 0 && !search.trim() && (
        <div className="sticky top-37 z-10 border-b border-ink-100 bg-ink-50/95 backdrop-blur sm:top-40.5">
          <CategoryTabs
            categories={menu.categories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      )}

      {/* Items */}
      <main className="px-4 py-4 sm:px-6">
        {menu.categories.length === 0 && (
          <p className="py-10 text-center text-ink-500">
            This menu doesn't have any items yet.
          </p>
        )}

        {search.trim() && (
          <h2 className="mb-3 text-sm font-medium text-ink-500">
            {itemsToShow.length} result{itemsToShow.length === 1 ? "" : "s"}{" "}
            for &ldquo;{search}&rdquo;
          </h2>
        )}

        {itemsToShow.length === 0 && menu.categories.length > 0 && (
          <p className="py-10 text-center text-ink-500">
            {search.trim() ? "No items match your search." : "No items in this category yet."}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itemsToShow.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </main>

      {!hideFooter && <SiteFooter className="py-4" />}
    </div>
  );
}
