import Link from "next/link";
import type { HotelProperty } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

function getImage(h: HotelProperty): string | null {
  return (
    toAbsoluteImageUrl(h.image_url) ??
    toAbsoluteImageUrl(h.image) ??
    toAbsoluteImageUrl(h.thumbnail) ??
    toAbsoluteImageUrl(h.images?.[0]) ??
    null
  );
}

interface ExtendedHotel extends HotelProperty {
  nearest_terminal?: string;
  distance_to_terminal_minutes?: number;
  shuttle_available?: boolean;
  featured?: boolean;
  reviews_count?: number;
}

export default function FeaturedHotels({
  hotels,
}: {
  hotels: HotelProperty[];
}) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <section className="bg-background px-container-margin py-xl">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}
        <div className="mb-xl flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-secondary-container" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Airport Hotels
              </span>
            </div>

            <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary-container md:font-headline-lg md:text-headline-lg">
              Stay Close to Your Terminal
            </h2>

            <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
              Comfortable hotels near Dubai International Airport and
              Al Maktoum International Airport, perfect for layovers,
              overnight stays and early flights.
            </p>
          </div>

          <Link
            href="/hotels"
            className="
              inline-flex
              h-11
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-primary-container
              px-5
              text-sm
              font-semibold
              text-primary-container
              transition-all
              duration-200
              hover:bg-primary-container
              hover:text-white
            "
          >
            View All Hotels

            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* =====================================================
            HOTEL GRID
        ====================================================== */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {hotels.slice(0, 4).map((hotel, index) => {
            const h = hotel as ExtendedHotel;

            const image = getImage(hotel);

            const name =
              hotel.title ??
              hotel.name ??
              "Untitled Property";

            const price =
              hotel.active_price ??
              hotel.price ??
              hotel.pricePerNight;

            const rating = Number(hotel.rating ?? 0);

            const href = hotel.slug
              ? `/hotels/${hotel.slug}`
              : `/hotels/${hotel.id}`;

            const hasDistance =
              h.distance_to_terminal_minutes != null &&
              h.nearest_terminal;

            return (
              <Link
                key={hotel.id ?? hotel.slug ?? index}
                href={href}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-outline-variant/60
                  bg-surface-container-lowest
                  shadow-[0_6px_25px_rgba(11,29,58,0.07)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-secondary-container/60
                  hover:shadow-[0_16px_40px_rgba(11,29,58,0.14)]
                "
              >
                {/* =================================================
                    IMAGE
                ================================================== */}
                <div className="relative h-60 overflow-hidden sm:h-64">

                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        bg-surface-container-highest
                        text-5xl
                      "
                    >
                      🏨
                    </div>
                  )}

                  {/* Dark gradient */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/70
                      via-black/10
                      to-transparent
                    "
                  />

                  {/* Featured badge */}
                  {h.featured && (
                    <div
                      className="
                        absolute
                        left-4
                        top-4
                        flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-secondary-container
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-on-secondary-container
                        shadow-lg
                      "
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        star
                      </span>

                      Featured
                    </div>
                  )}

                  {/* Default badge for first property */}
                  {!h.featured && index === 0 && (
                    <div
                      className="
                        absolute
                        left-4
                        top-4
                        rounded-full
                        bg-white/95
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-primary-container
                        shadow-lg
                        backdrop-blur-sm
                      "
                    >
                      Popular Choice
                    </div>
                  )}

                  {/* Rating */}
                  {rating > 0 && (
                    <div
                      className="
                        absolute
                        right-4
                        top-4
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        bg-white/95
                        px-2.5
                        py-2
                        shadow-lg
                        backdrop-blur-sm
                      "
                    >
                      <span
                        className="
                          material-symbols-outlined
                          text-[17px]
                          text-secondary-container
                        "
                        style={{
                          fontVariationSettings:
                            "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20",
                        }}
                      >
                        star
                      </span>

                      <span className="text-sm font-bold text-primary-container">
                        {rating.toFixed(1)}
                      </span>

                      {h.reviews_count != null && h.reviews_count > 0 && (
                        <span className="hidden text-xs text-on-surface-variant sm:inline">
                          ({h.reviews_count})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Airport distance */}
                  {hasDistance && (
                    <div className="absolute bottom-4 left-4">
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-white/20
                          bg-primary-container/90
                          px-3
                          py-2
                          text-white
                          shadow-lg
                          backdrop-blur-md
                        "
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          flight
                        </span>

                        <span className="text-xs font-semibold">
                          {h.distance_to_terminal_minutes} min to{" "}
                          {h.nearest_terminal}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Shuttle */}
                  {!hasDistance && h.shuttle_available && (
                    <div className="absolute bottom-4 left-4">
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-white/20
                          bg-primary-container/90
                          px-3
                          py-2
                          text-white
                          shadow-lg
                          backdrop-blur-md
                        "
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          airport_shuttle
                        </span>

                        <span className="text-xs font-semibold">
                          Free Airport Shuttle
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* =================================================
                    CONTENT
                ================================================== */}
                <div className="p-5">

                  {/* Hotel name */}
                  <h3
                    className="
                      line-clamp-1
                      font-headline-md
                      text-headline-md
                      font-bold
                      text-primary-container
                      transition-colors
                      duration-200
                      group-hover:text-secondary
                    "
                  >
                    {name}
                  </h3>

                  {/* Stars */}
                  {rating > 0 && (
                    <div className="mt-2 flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="material-symbols-outlined text-[16px] text-secondary-container"
                          style={{
                            fontVariationSettings:
                              `'FILL' ${
                                star <= Math.round(rating) ? 1 : 0
                              }, 'wght' 500, 'GRAD' 0, 'opsz' 20`,
                          }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Location */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <span
                      className="
                        material-symbols-outlined
                        text-[18px]
                        text-secondary
                      "
                    >
                      location_on
                    </span>

                    <p className="line-clamp-1 text-sm text-on-surface-variant">
                      {hotel.location ??
                        hotel.city ??
                        "Dubai"}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="my-5 h-px bg-outline-variant/50" />

                  {/* Bottom section */}
                  <div className="flex items-end justify-between gap-4">

                    {/* Price */}
                    <div>
                      <p className="text-xs text-on-surface-variant">
                        Room from
                      </p>

                      <div className="mt-0.5 flex items-baseline gap-1">
                        <span
                          className="
                            font-headline-md
                            text-headline-md
                            font-bold
                            text-primary-container
                          "
                        >
                          AED {price ?? "—"}
                        </span>
                      </div>

                      <p className="mt-0.5 text-[11px] text-on-surface-variant">
                        per night
                      </p>
                    </div>

                    {/* CTA */}
                    <span
                      className="
                        inline-flex
                        h-11
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-secondary-container
                        px-5
                        font-label-bold
                        text-label-bold
                        font-semibold
                        text-on-secondary-container
                        shadow-sm
                        transition-all
                        duration-200
                        group-hover:bg-primary-container
                        group-hover:text-white
                        group-hover:shadow-md
                      "
                    >
                      Book Now

                      <span
                        className="
                          material-symbols-outlined
                          text-[18px]
                          transition-transform
                          duration-200
                          group-hover:translate-x-1
                        "
                      >
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}