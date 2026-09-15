"use client";

interface FilterSidebarProps {
  locations: string[];
  selectedLocations: string[];
  onToggleLocation: (loc: string) => void;
  minPrice: number;
  maxPrice: number;
  priceRange: number;
  onPriceChange: (val: number) => void;
  selectedStars: number[];
  onToggleStar: (star: number) => void;
  shuttleTypes: string[];
  onToggleShuttle: (val: string) => void;
  stayTypes: string[];
  onToggleStayType: (val: string) => void;
  onClear: () => void;
}

export default function FilterSidebar({
  locations,
  selectedLocations,
  onToggleLocation,
  minPrice,
  maxPrice,
  priceRange,
  onPriceChange,
  selectedStars,
  onToggleStar,
  shuttleTypes,
  onToggleShuttle,
  stayTypes,
  onToggleStayType,
  onClear,
}: FilterSidebarProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md sticky top-[100px]">
      <div className="flex items-center justify-between mb-md pb-sm border-b border-outline-variant">
        <h3 className="font-headline-md text-headline-md text-primary">Filters</h3>
        <button onClick={onClear} className="font-label-sm text-label-sm text-secondary hover:underline">
          Clear all
        </button>
      </div>

      {/* Location — real, from getFilters() */}
      <div className="mb-lg">
        <h4 className="font-label-bold text-label-bold text-primary mb-sm">Location</h4>
        <div className="flex flex-col gap-sm">
          {locations.map((loc) => (
            <label key={loc} className="flex items-center gap-sm cursor-pointer group">
              <input
                checked={selectedLocations.includes(loc)}
                onChange={() => onToggleLocation(loc)}
                className="w-5 h-5 rounded border-outline-variant text-[#F5A623] focus:ring-[#0B1D3A]"
                type="checkbox"
              />
              <span className="font-body-md text-body-md text-on-surface group-hover:text-primary">{loc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range — real, from getFilters() max_price */}
      <div className="mb-lg">
        <h4 className="font-label-bold text-label-bold text-primary mb-sm">Price Range (AED)</h4>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={50}
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-1 bg-surface-container-highest appearance-none cursor-pointer accent-[#F5A623]"
        />
        <div className="flex justify-between mt-2 text-on-surface-variant font-label-sm text-label-sm">
          <span>{minPrice}</span>
          <span>{priceRange} AED</span>
        </div>
      </div>

      {/* Star rating — real, filters via getHotelsList's rating param */}
      <div className="mb-lg">
        <h4 className="font-label-bold text-label-bold text-primary mb-sm">Star Rating</h4>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onToggleStar(star)}
              className={`py-2 rounded-md border text-sm font-bold transition-colors ${
                selectedStars.includes(star)
                  ? "border-[#F5A623] bg-[#FFF4E5] text-primary"
                  : "border-outline-variant text-on-surface hover:border-[#F5A623]"
              }`}
            >
              {star}
            </button>
          ))}
        </div>
      </div>

      {/* Airport-specific — UI ready, inactive until backend fields exist */}
      <div className="mb-lg">
        <h4 className="font-label-bold text-label-bold text-primary mb-sm">Airport Shuttle</h4>
        <div className="flex flex-col gap-sm">
          {[
            { value: "free", label: "Free Shuttle" },
            { value: "paid", label: "Paid Shuttle" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-sm cursor-pointer group">
              <input
                checked={shuttleTypes.includes(opt.value)}
                onChange={() => onToggleShuttle(opt.value)}
                className="w-5 h-5 rounded border-outline-variant text-[#F5A623] focus:ring-[#0B1D3A]"
                type="checkbox"
              />
              <span className="font-body-md text-body-md text-on-surface group-hover:text-primary">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-lg">
        <h4 className="font-label-bold text-label-bold text-primary mb-sm">Stay Type</h4>
        <div className="flex flex-col gap-sm">
          {[
            { value: "day_use", label: "Day-use (Transit)" },
            { value: "overnight", label: "Overnight" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-sm cursor-pointer group">
              <input
                checked={stayTypes.includes(opt.value)}
                onChange={() => onToggleStayType(opt.value)}
                className="w-5 h-5 rounded border-outline-variant text-[#F5A623] focus:ring-[#0B1D3A]"
                type="checkbox"
              />
              <span className="font-body-md text-body-md text-on-surface group-hover:text-primary">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-on-surface-variant/60 italic">
        Distance &amp; shuttle filters apply once that data is available for a hotel.
      </p>
    </div>
  );
}