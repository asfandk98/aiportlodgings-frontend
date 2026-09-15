import Link from "next/link";
import type { HotelProperty } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

interface ExtendedHotel extends HotelProperty {
  nearest_terminal?: string;
  distance_to_terminal_minutes?: number;
  shuttle_available?: boolean;
  day_use_available?: boolean;
  day_use_price?: number | string;
  day_use_hours?: number;
}

function getImage(h: HotelProperty): string | null {
  return (
    toAbsoluteImageUrl(h.image_url) ??
    toAbsoluteImageUrl(h.image) ??
    toAbsoluteImageUrl(h.thumbnail) ??
    toAbsoluteImageUrl(h.images?.[0]) ??
    null
  );
}

export default function HotelListingCard({ hotel }: { hotel: HotelProperty }) {
  const h = hotel as ExtendedHotel;
  const image = getImage(hotel);
  const name = hotel.title ?? hotel.name ?? "Untitled Property";
  const price = hotel.active_price ?? hotel.price ?? hotel.pricePerNight;
  const rating = Number(hotel.rating ?? 0);
  const href = hotel.slug ? `/hotels/${hotel.slug}` : `/hotels/${hotel.id}`;

  const hasDistance = h.distance_to_terminal_minutes != null && h.nearest_terminal;
  const isDayUse = h.day_use_available && h.day_use_price;

  return (
    <Link
      href={href}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col sm:flex-row hover:border-primary-container transition-colors group"
      style={{ boxShadow: "0px 4px 12px rgba(26, 43, 66, 0.08)" }}
    >
      <div className="relative w-full sm:w-[280px] h-48 sm:h-auto shrink-0">
        {image ? (
          <img className="w-full h-full object-cover" src={image} alt={name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-highest text-3xl">🏨</div>
        )}

        {(hasDistance || h.shuttle_available) && (
          <div className="absolute top-sm left-sm flex flex-col gap-xs">
            <div className="bg-[#E2E8F0] text-[#0B1D3A] px-2 py-1 rounded-full flex items-center gap-1 w-max">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                airport_shuttle
              </span>
              <span className="font-label-sm text-label-sm font-bold">
                {hasDistance ? `${h.distance_to_terminal_minutes} mins to ${h.nearest_terminal}` : "Free Shuttle"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-md flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-headline-md text-headline-md text-primary font-bold group-hover:text-secondary-container transition-colors line-clamp-2">
              {name}
            </h3>
            {rating > 0 && (
              <div className="flex items-center bg-primary-container text-on-primary px-2 py-1 rounded-md ml-2 shrink-0">
                <span className="font-label-bold text-label-bold">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-secondary mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: `'FILL' ${i <= Math.round(rating) ? 1 : 0}` }}>
                star
              </span>
            ))}
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-sm">{hotel.location ?? hotel.city}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mt-auto border-t border-outline-variant pt-sm">
          <div className="mb-sm sm:mb-0 text-right sm:text-left w-full sm:w-auto">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {isDayUse ? `Day-use (${h.day_use_hours ?? 6} hours)` : "Overnight"}
            </p>
            <p className="font-headline-md text-headline-md text-primary font-bold">
              from AED {isDayUse ? h.day_use_price : (price ?? "—")}
            </p>
          </div>
          <span className="bg-[#F5A623] hover:bg-[#e0961f] text-[#0B1D3A] font-label-bold text-label-bold px-6 h-[44px] rounded-lg transition-all duration-150 w-full sm:w-auto flex justify-center items-center">
            View Options
          </span>
        </div>
      </div>
    </Link>
  );
}