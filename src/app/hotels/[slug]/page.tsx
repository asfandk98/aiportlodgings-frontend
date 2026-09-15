import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

import HotelGallery from "@/components/hotels/HotelGallery";
import HotelInteractiveSection from "@/components/hotels/HotelInteractiveSection";
import NearbyHotels from "@/components/hotels/NearbyHotels";

import { getHotel } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";
import { iconForAmenity } from "@/lib/amenityIcons";

interface ExtendedHotel {
  nearest_terminal?: string;
  distance_to_terminal_minutes?: number;
  shuttle_available?: boolean;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const hotel = await getHotel(slug);

  if (!hotel) {
    return {
      title: "Hotel Not Found | AirportHotelDubai",
      description:
        "The requested hotel could not be found on AirportHotelDubai.",
    };
  }

  const name =
    hotel.title ??
    hotel.name ??
    "Airport Hotel Dubai";

  return {
    title: `${name} | AirportHotelDubai`,
    description:
      hotel.description ??
      `Book ${name} with AirportHotelDubai and enjoy a comfortable stay near Dubai International Airport.`,
  };
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /*
   * Fetch hotel from Laravel API
   */
  const hotel = await getHotel(slug);

  /*
   * If hotel does not exist
   */
  if (!hotel) {
    notFound();
  }

  const h = hotel as typeof hotel & ExtendedHotel;

  const name =
    hotel.title ??
    hotel.name ??
    "Airport Hotel Dubai";

  /*
   * -------------------------------------------------------
   * HOTEL GALLERY
   * -------------------------------------------------------
   */

  const galleryItems =
    hotel.images && hotel.images.length > 0
      ? hotel.images.map((img) =>
          typeof img === "string"
            ? img
            : img.url ?? img.path
        )
      : [
          hotel.image_url ??
            hotel.image ??
            null,
        ];

  const gallery = galleryItems
    .map((src) =>
      toAbsoluteImageUrl(src ?? undefined)
    )
    .filter(
      (src): src is string =>
        Boolean(src)
    );

  /*
   * -------------------------------------------------------
   * AIRPORT SHUTTLE
   * -------------------------------------------------------
   */

  const shuttleBadge =
    h.distance_to_terminal_minutes != null &&
    h.nearest_terminal
      ? `${h.distance_to_terminal_minutes} min free shuttle to ${h.nearest_terminal}`
      : h.shuttle_available
        ? "Free airport shuttle"
        : null;

  /*
   * -------------------------------------------------------
   * RATING
   * -------------------------------------------------------
   */

  const rating = Math.min(
    5,
    Math.max(
      0,
      Math.round(
        Number(
          hotel.stars ??
            hotel.rating ??
            0
        )
      )
    )
  );

  /*
   * -------------------------------------------------------
   * AMENITIES
   * -------------------------------------------------------
   */

  const amenities =
    hotel.amenities ?? [];

  /*
   * -------------------------------------------------------
   * ROOMS
   * -------------------------------------------------------
   */

  const rooms =
    hotel.rooms ?? [];

  /*
   * -------------------------------------------------------
   * NEARBY HOTELS
   * -------------------------------------------------------
   */

  const nearbyHotels =
    hotel.nearby ?? [];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background pt-16 pb-24 md:pt-24 md:pb-28">

        {/* =================================================
            HOTEL GALLERY
        ================================================= */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HotelGallery
            images={gallery}
            alt={name}
            shuttleBadge={shuttleBadge}
          />
        </section>

        {/* =================================================
            HOTEL INFORMATION
        ================================================= */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-14">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="lg:col-span-2">

              {/* Rating */}

              {rating > 0 && (
                <div className="flex items-center gap-1 mb-4">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <span
                        key={star}
                        className="material-symbols-outlined text-secondary text-[18px]"
                        style={{
                          fontVariationSettings:
                            `'FILL' ${
                              star <= rating
                                ? 1
                                : 0
                            }`,
                        }}
                      >
                        star
                      </span>
                    )
                  )}

                  <span className="ml-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-on-surface-variant">
                    {rating}-STAR HOTEL
                  </span>

                </div>
              )}

              {/* Hotel name */}

              <h1 className="text-primary text-3xl md:text-4xl font-bold leading-tight mb-5">
                {name}
              </h1>

              {/* Location */}

              {(hotel.location ||
                hotel.city) && (
                <div className="flex items-start gap-2 mb-6 text-on-surface-variant">

                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                    location_on
                  </span>

                  <span className="text-body-md">
                    {hotel.location ??
                      hotel.city}
                  </span>

                </div>
              )}

              {/* Description */}

              {hotel.description && (
                <p className="text-body-md md:text-body-lg text-on-surface-variant leading-relaxed max-w-3xl">
                  {hotel.description}
                </p>
              )}

              {/* =================================================
                  AMENITIES
              ================================================= */}

              {amenities.length > 0 && (
                <>
                  <hr className="border-outline-variant/40 my-10 md:my-12" />

                  <section>

                    <div className="mb-7">

                      <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-secondary">
                        Hotel Facilities
                      </span>

                      <h2 className="font-headline-md text-headline-md text-primary mt-2">
                        Key Amenities
                      </h2>

                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">

                      {amenities.map(
                        (amenity) => (
                          <div
                            key={amenity}
                            className="group flex flex-col items-center justify-center text-center min-h-[110px] p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 transition-all duration-300 hover:bg-white hover:border-secondary/50 hover:shadow-md"
                          >

                            <span className="material-symbols-outlined text-primary text-[28px] mb-3 transition-colors duration-300 group-hover:text-secondary">
                              {iconForAmenity(
                                amenity
                              )}
                            </span>

                            <span className="font-label-bold text-label-bold text-on-surface leading-tight">
                              {amenity}
                            </span>

                          </div>
                        )
                      )}

                    </div>

                  </section>
                </>
              )}

            </div>

            {/* =================================================
                BOOKING WIDGET
            ================================================= */}

            {/* 
              BookingWidget is now controlled by
              HotelInteractiveSection because the selected
              room needs React state.
            */}

          </div>

        </section>

        {/* =================================================
            ROOMS + BOOKING WIDGET
        ================================================= */}

        {rooms.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">

            <HotelInteractiveSection
              hotel={hotel}
            />

          </section>
        )}

        {/* =================================================
            NEARBY HOTELS
        ================================================= */}

        {nearbyHotels.length > 0 && (
          <NearbyHotels
            hotels={nearbyHotels}
          />
        )}

      </main>

      <Footer />

      <BottomNav />
    </>
  );
}