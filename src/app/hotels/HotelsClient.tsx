"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getHotelsList, getFilters, type HotelProperty } from "@/lib/api";
import HotelListingCard from "@/components/hotels/HotelListingCard";
import FilterSidebar from "@/components/hotels/FilterSidebar";

const SORT_OPTIONS = [
  { value: "recommended", label: "Closest to Terminal" }, // real distance sort not available yet — falls back to recommended
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const PER_LOAD = 6;

export default function HotelsClient() {
  const searchParams = useSearchParams();

  const [hotels, setHotels] = useState<HotelProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PER_LOAD);
  const [sort, setSort] = useState("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState<{ locations: string[]; max_price: number }>({
    locations: [],
    max_price: 2000,
  });

  const initialLocation = searchParams.get("location");
  const [activeLocations, setActiveLocations] = useState<string[]>(initialLocation ? [initialLocation] : []);
  const [activePriceMax, setActivePriceMax] = useState(2000);
  const [activeStars, setActiveStars] = useState<number[]>([]);
  const [activeShuttle, setActiveShuttle] = useState<string[]>([]);
  const [activeStayTypes, setActiveStayTypes] = useState<string[]>([]);

  useEffect(() => {
    getFilters().then((data) => {
      const locations = data.locations ?? ["Dubai", "Abu Dhabi", "Sharjah"];
      const maxPrice = data.max_price ?? 2000;
      setFilterOptions({ locations, max_price: maxPrice });
      setActivePriceMax(maxPrice);
    });
  }, []);

  const fetchHotels = useCallback(() => {
    setLoading(true);
    getHotelsList({
      location: activeLocations.join(",") || undefined,
      max_price: activePriceMax,
      rating: activeStars.length ? Math.min(...activeStars) : undefined,
      sort,
    }).then(({ hotels }) => {
      setHotels(hotels);
      setVisibleCount(PER_LOAD);
      setLoading(false);
    });
  }, [activeLocations, activePriceMax, activeStars, sort]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const toggleLocation = (loc: string) =>
    setActiveLocations((prev) => (prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]));

  const toggleStar = (star: number) =>
    setActiveStars((prev) => (prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]));

  const toggleShuttle = (val: string) =>
    setActiveShuttle((prev) => (prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]));

  const toggleStayType = (val: string) =>
    setActiveStayTypes((prev) => (prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]));

  const clearFilters = () => {
    setActiveLocations([]);
    setActivePriceMax(filterOptions.max_price);
    setActiveStars([]);
    setActiveShuttle([]);
    setActiveStayTypes([]);
  };

  // Client-side pass for airport-specific fields — no-op until those
  // columns exist on a hotel; nothing gets incorrectly excluded.
  const filtered = hotels.filter((hotel) => {
    const h = hotel as HotelProperty & { shuttle_available?: boolean; day_use_available?: boolean };
    if (activeShuttle.includes("free") && h.shuttle_available === false) return false;
    if (activeStayTypes.includes("day_use") && h.day_use_available === false) return false;
    return true;
  });

  const visibleHotels = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((v) => v + PER_LOAD);
      setLoadingMore(false);
    }, 300);
  };

  const sidebarProps = {
    locations: filterOptions.locations,
    selectedLocations: activeLocations,
    onToggleLocation: toggleLocation,
    minPrice: 0,
    maxPrice: filterOptions.max_price,
    priceRange: activePriceMax,
    onPriceChange: setActivePriceMax,
    selectedStars: activeStars,
    onToggleStar: toggleStar,
    shuttleTypes: activeShuttle,
    onToggleShuttle: toggleShuttle,
    stayTypes: activeStayTypes,
    onToggleStayType: toggleStayType,
    onClear: clearFilters,
  };

  return (
    <main className="w-full max-w-[1280px] mx-auto px-container-margin md:px-lg grid grid-cols-1 md:grid-cols-12 gap-lg pt-md pb-xl mt-14 md:mt-20">
      <div className="md:col-span-12 mb-sm flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-1">
            {activeLocations.length > 0 ? activeLocations.join(", ") : "All Hotels Near DXB & DWC"}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {loading ? "Searching…" : `Showing ${filtered.length} hotel${filtered.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
        <div className="flex gap-sm">
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-xs px-md h-[44px] bg-surface-container-low border border-outline-variant rounded-lg font-label-bold text-label-bold text-primary hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">sort</span>
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-outline-variant rounded-lg shadow-lg z-30 overflow-hidden">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      setSort(o.value);
                      setSortOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-sm hover:bg-surface-container-low transition-colors"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            aria-label="Filters"
            className="md:hidden flex items-center justify-center w-[44px] h-[44px] bg-surface-container-low border border-outline-variant rounded-lg text-primary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      <aside className="hidden md:block col-span-3">
        <FilterSidebar {...sidebarProps} />
      </aside>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileFiltersOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-md overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-4">
              <button onClick={() => setMobileFiltersOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <FilterSidebar {...sidebarProps} />
          </div>
        </div>
      )}

      <div className="col-span-1 md:col-span-9 flex flex-col gap-md">
        {loading ? (
          <div className="flex flex-col gap-md">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-surface-container-highest rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-headline-md text-primary mb-2">No properties match your filters</p>
            <p className="text-on-surface-variant mb-6">Try adjusting your search criteria</p>
            <button
              onClick={clearFilters}
              className="border border-primary-container text-primary-container px-8 py-3 rounded-lg font-label-bold text-label-bold hover:bg-primary-container hover:text-white transition-all"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <>
            {visibleHotels.map((hotel) => (
              <HotelListingCard key={hotel.id ?? hotel.slug} hotel={hotel} />
            ))}

            {hasMore && (
              <div className="flex justify-center mt-sm">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="h-[44px] px-lg rounded-full border border-outline-variant font-label-bold text-label-bold text-primary hover:bg-surface-container transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "Load More Hotels"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}