import { useEffect, useMemo, useState } from "react";
import apiClient from "../../api/client";
import CategoryTabs from "../../components/CategoryTabs";
import MenuItemCard from "../../components/MenuItemCard";
import MenuItemCardSkeleton from "../../components/MenuItemCardSkeleton";
import SiteFooter from "../../components/SiteFooter";

export default function MenuPage({ subdomain }) {
  const [menu, setMenu] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not-found | error
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");
    setMenu(null);

    apiClient
      .get(`/menu/${subdomain}`)
      .then(({ data }) => {
        if (cancelled) return;
        setMenu(data);
        setActiveCategory(data.categories[0]?.id ?? null);
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

  const activeItems =
    filteredCategories.find((c) => c.id === activeCategory)?.items ?? [];
  const displayedCategories = search.trim()
    ? filteredCategories
    : filteredCategories.filter((c) => c.id === activeCategory);
  const itemsToShow = search.trim()
    ? filteredCategories.flatMap((c) => c.items)
    : activeItems;

  return (
    <div className="bg-menu-pattern-light min-h-screen bg-ink-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/80 px-4 pb-5 pt-7 text-ink-900 shadow-sm backdrop-blur-sm sm:px-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-4xl">
          {menu.cafe.name}
        </h1>
        <p className="text-sm text-ink-500">Browse our menu</p>

        <div className="mt-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, drinks, dietary tags..."
            className="w-full rounded-full border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
      </header>

      {/* Category tabs */}
      {!search.trim() && menu.categories.length > 0 && (
        <div className="sticky top-[110px] z-10 border-b border-ink-100 bg-ink-50/95 backdrop-blur sm:top-[124px]">
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
            {itemsToShow.length} result{itemsToShow.length === 1 ? "" : "s"} for
            "{search}"
          </h2>
        )}

        {itemsToShow.length === 0 && menu.categories.length > 0 && (
          <p className="py-10 text-center text-ink-500">
            No items match your search.
          </p>
        )}

        {!search.trim() ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itemsToShow.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {displayedCategories.map((category) => (
              <div key={category.id}>
                <h3 className="font-display mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <SiteFooter className="py-4" />
    </div>
  );
}
