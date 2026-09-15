import Link from "next/link";
import type { NearbyHotel } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

export default function NearbyHotels({
  hotels,
}: {
  hotels: NearbyHotel[];
}) {
  if (!hotels || hotels.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 md:mt-20 lg:px-8">
      {/* Section heading */}
      <div className="mb-8 md:mb-10">
        <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-secondary">
          Explore More
        </span>

        <h2 className="mt-2 font-headline-md text-headline-md text-primary">
          Nearby Hotels
        </h2>

        <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
          Discover more comfortable stays close to this hotel and
          explore other accommodation options in the area.
        </p>
      </div>

      {/* Hotels */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.slice(0, 3).map((hotel) => {
          const image =
            toAbsoluteImageUrl(hotel.image_url) ??
            toAbsoluteImageUrl(hotel.image);

          const name =
            hotel.name ??
            hotel.title ??
            "Nearby Hotel";

          const location =
            hotel.location ??
            hotel.city ??
            "";

          const href =
            `/hotels/${hotel.slug ?? hotel.id}`;

          const price =
            hotel.active_price ??
            hotel.price ??
            hotel.pricePerNight;

          const rating =
            Number(hotel.rating ?? 0);

          return (
            <Link
              key={hotel.id ?? hotel.slug}
              href={href}
              className="
                group
                relative
                block
                overflow-hidden
                rounded-2xl
                border
                border-outline-variant/50
                bg-surface-container-lowest
                shadow-[0_5px_20px_rgba(11,29,58,0.06)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-secondary-container/60
                hover:shadow-[0_14px_35px_rgba(11,29,58,0.13)]
              "
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface-container-highest text-primary">
                    <span className="material-symbols-outlined text-5xl">
                      hotel
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Rating */}
                {rating > 0 && (
                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-2 shadow-lg backdrop-blur-sm">
                    <span
                      className="material-symbols-outlined text-[16px] text-secondary-container"
                      style={{
                        fontVariationSettings:
                          "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20",
                      }}
                    >
                      star
                    </span>

                    <span className="text-sm font-bold text-primary">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Distance */}
                {hotel.distance_km != null && (
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold tracking-[0.08em] text-primary shadow-md backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[14px]">
                        near_me
                      </span>

                      {hotel.distance_km} KM AWAY
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {location && (
                  <div className="mb-2 flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      location_on
                    </span>

                    <span className="line-clamp-1 text-xs">
                      {location}
                    </span>
                  </div>
                )}

                <h3 className="line-clamp-2 font-headline-md text-lg font-bold leading-tight text-primary transition-colors duration-200 group-hover:text-secondary">
                  {name}
                </h3>

                <div className="mt-5 flex items-end justify-between gap-4 border-t border-outline-variant/40 pt-4">
                  <div>
                    <p className="text-[11px] text-on-surface-variant">
                      Rooms from
                    </p>

                    <p className="mt-0.5 font-headline-md text-lg font-bold text-primary">
                      AED {price ?? "—"}
                    </p>

                    <p className="text-[10px] text-on-surface-variant">
                      per night
                    </p>
                  </div>

                  <span className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-secondary-container px-4 text-xs font-bold text-on-secondary-container transition-all duration-200 group-hover:bg-primary-container group-hover:text-white">
                    View Hotel

                    <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}