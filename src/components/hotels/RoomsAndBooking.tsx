"use client";

import { useState } from "react";
import Link from "next/link";
import type { HotelDetail, HotelRoom } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";
import { iconForAmenity } from "@/lib/amenityIcons";

function roomImage(room: HotelRoom): string | null {
  const first = room.images?.[0];

  const galleryUrl =
    typeof first === "string"
      ? first
      : first?.url ?? first?.path ?? null;

  return (
    toAbsoluteImageUrl(room.image_url) ??
    toAbsoluteImageUrl(room.image) ??
    toAbsoluteImageUrl(galleryUrl)
  );
}

export default function RoomsAndBooking({
  hotel,
}: {
  hotel: HotelDetail;
}) {
  const rooms = hotel.rooms ?? [];

  const [selectedRoom, setSelectedRoom] =
    useState<HotelRoom | null>(null);

  const validPrices = rooms
    .map((room) =>
      Number(room.active_price ?? room.price)
    )
    .filter((price) => Number.isFinite(price) && price > 0);

  const startPrice =
    validPrices.length > 0
      ? Math.min(...validPrices)
      : Number(hotel.price ?? 0);

  const hotelRating = Math.round(
    Number(hotel.stars ?? hotel.rating ?? 5)
  );

  const hotelName =
    hotel.title ??
    hotel.name ??
    "Luxury Hotel";

  const handleSelectRoom = (room: HotelRoom) => {
    setSelectedRoom(room);

    setTimeout(() => {
      document
        .getElementById("booking-card")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 50);
  };

  return (
    <>
      {/* =========================================================
          HOTEL INFORMATION + BOOKING
      ========================================================= */}
      <section
        className="
          max-w-container-max
          mx-auto
          px-gutter
          mt-10
          md:mt-14
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-10
            lg:gap-14
          "
        >
          {/* =====================================================
              HOTEL INFORMATION
          ===================================================== */}
          <div className="lg:col-span-2">
            {/* Rating */}
            <div className="flex flex-wrap items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="
                    material-symbols-outlined
                    text-secondary
                    text-[19px]
                  "
                  style={{
                    fontVariationSettings: `'FILL' ${
                      star <= hotelRating ? 1 : 0
                    }`,
                  }}
                >
                  star
                </span>
              ))}

              <span
                className="
                  ml-2
                  font-label-caps
                  text-[11px]
                  tracking-[0.14em]
                  text-on-surface-variant
                "
              >
                {hotelRating}-STAR HOTEL
              </span>
            </div>

            {/* Hotel Name */}
            <h2
              className="
                font-display-lg
                text-display-lg
                text-primary
                text-[32px]
                md:text-[40px]
                leading-tight
                mb-5
              "
            >
              {hotelName}
            </h2>

            {/* Location */}
            {(hotel.location || hotel.city) && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-6
                  text-on-surface-variant
                "
              >
                <span className="material-symbols-outlined text-primary text-[20px]">
                  location_on
                </span>

                <span className="text-body-md">
                  {hotel.location ?? hotel.city}
                </span>
              </div>
            )}

            {/* Description */}
            {hotel.description && (
              <p
                className="
                  font-body-lg
                  text-body-lg
                  text-on-surface-variant
                  leading-relaxed
                  max-w-3xl
                "
              >
                {hotel.description}
              </p>
            )}

            {/* =================================================
                AMENITIES
            ================================================= */}
            {hotel.amenities &&
              hotel.amenities.length > 0 && (
                <div className="mt-10 md:mt-14">
                  <div className="mb-6">
                    <span
                      className="
                        font-label-caps
                        text-[11px]
                        tracking-[0.16em]
                        text-secondary
                        uppercase
                      "
                    >
                      Hotel Facilities
                    </span>

                    <h3
                      className="
                        font-headline-md
                        text-headline-md
                        text-primary
                        mt-2
                      "
                    >
                      World-Class Amenities
                    </h3>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-2
                      sm:grid-cols-3
                      md:grid-cols-4
                      gap-3
                      md:gap-4
                    "
                  >
                    {hotel.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="
                          flex
                          flex-col
                          items-center
                          justify-center
                          text-center
                          min-h-[110px]
                          p-4
                          bg-surface-container-low
                          border
                          border-outline-variant/50
                          rounded-xl
                          transition-all
                          duration-300
                          hover:bg-white
                          hover:border-secondary/50
                          hover:shadow-md
                        "
                      >
                        <span
                          className="
                            material-symbols-outlined
                            text-primary
                            text-[28px]
                            mb-3
                          "
                        >
                          {iconForAmenity(amenity)}
                        </span>

                        <span
                          className="
                            font-label-bold
                            text-label-bold
                            text-on-surface
                            leading-tight
                          "
                        >
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* =====================================================
              BOOKING CARD
          ===================================================== */}
          <div className="lg:col-span-1">
            <div
              id="booking-card"
              className="
                lg:sticky
                lg:top-28
                bg-white
                border
                border-outline-variant/60
                rounded-xl
                p-6
                md:p-8
                shadow-[0_8px_30px_rgba(3,9,41,0.08)]
              "
            >
              {/* Price */}
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                  mb-6
                  pb-6
                  border-b
                  border-outline-variant/40
                "
              >
                <div>
                  <span
                    className="
                      block
                      font-label-caps
                      text-[10px]
                      tracking-[0.16em]
                      text-on-surface-variant
                      mb-1
                    "
                  >
                    FROM
                  </span>

                  <div className="flex items-baseline gap-1">
                    <span
                      className="
                        text-primary
                        font-display-lg
                        text-3xl
                        md:text-4xl
                        font-bold
                      "
                    >
                      AED {startPrice > 0 ? startPrice : "—"}
                    </span>

                    <span className="text-on-surface-variant text-sm">
                      /night
                    </span>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1
                    text-secondary
                  "
                >
                  <span className="material-symbols-outlined text-[17px]">
                    verified
                  </span>

                  <span
                    className="
                      text-[10px]
                      font-bold
                      tracking-[0.1em]
                      whitespace-nowrap
                    "
                  >
                    BEST PRICE
                  </span>
                </div>
              </div>

              {/* Selected Room */}
              {selectedRoom ? (
                <div
                  className="
                    mb-6
                    p-4
                    rounded-lg
                    bg-secondary-container/20
                    border
                    border-secondary/30
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mb-2
                    "
                  >
                    <span className="material-symbols-outlined text-secondary text-[17px]">
                      check_circle
                    </span>

                    <p
                      className="
                        font-label-caps
                        text-[10px]
                        tracking-[0.12em]
                        text-secondary
                      "
                    >
                      SELECTED ROOM
                    </p>
                  </div>

                  <p
                    className="
                      font-body-md
                      font-semibold
                      text-primary
                      mb-1
                    "
                  >
                    {selectedRoom.name ??
                      selectedRoom.title ??
                      "Selected Room"}
                  </p>

                  <p className="text-on-surface-variant text-sm">
                    AED{" "}
                    {selectedRoom.active_price ??
                      selectedRoom.price}{" "}
                    /night
                  </p>
                </div>
              ) : (
                <div
                  className="
                    mb-6
                    p-4
                    rounded-lg
                    bg-surface-container-low
                    border
                    border-outline-variant/40
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">
                      info
                    </span>

                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Select a room below to continue with your booking.
                    </p>
                  </div>
                </div>
              )}

              {/* CTA */}
              <Link
                href={
                  selectedRoom
                    ? `/hotels/${
                        hotel.slug ?? hotel.id
                      }/reserve?room=${
                        selectedRoom.slug ??
                        selectedRoom.id
                      }`
                    : "#rooms"
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  w-full
                  py-4
                  px-6
                  bg-primary
                  text-on-primary
                  rounded-lg
                  font-bold
                  text-sm
                  tracking-[0.12em]
                  uppercase
                  transition-all
                  duration-300
                  hover:bg-secondary
                  hover:text-on-secondary
                "
              >
                {selectedRoom
                  ? "Check Availability"
                  : "Select a Room"}

                <span className="material-symbols-outlined text-[19px]">
                  arrow_forward
                </span>
              </Link>

              {/* Trust */}
              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  mt-4
                  text-on-surface-variant
                "
              >
                <span className="material-symbols-outlined text-[16px]">
                  lock
                </span>

                <span className="text-xs">
                  Secure booking • No payment required today
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          AVAILABLE ROOMS
      ========================================================= */}
      {rooms.length > 0 && (
        <section
          id="rooms"
          className="
            max-w-container-max
            mx-auto
            px-gutter
            mt-section-gap-lg
          "
        >
          {/* Header */}
          <div className="mb-8 md:mb-10">
            <span
              className="
                font-label-caps
                text-[11px]
                tracking-[0.16em]
                text-secondary
                uppercase
              "
            >
              Choose Your Stay
            </span>

            <h3
              className="
                font-headline-md
                text-headline-md
                text-primary
                mt-2
              "
            >
              Available Rooms
            </h3>

            <p className="text-body-md text-on-surface-variant mt-2">
              Select the room that best suits your stay.
            </p>
          </div>

          {/* Room Cards */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
              md:gap-8
            "
          >
            {rooms.map((room) => {
              const image = roomImage(room);

              const isSelected =
                selectedRoom?.id === room.id;

              const currentPrice =
                room.active_price ??
                room.price;

              return (
                <article
                  key={room.id}
                  className={`
                    group
                    bg-white
                    border
                    rounded-xl
                    overflow-hidden
                    flex
                    flex-col
                    transition-all
                    duration-300
                    ${
                      isSelected
                        ? "border-secondary shadow-[0_8px_30px_rgba(131,85,0,0.12)]"
                        : "border-outline-variant/60 shadow-sm hover:shadow-lg"
                    }
                  `}
                >
                  {/* Image */}
                  <div
                    className="
                      h-56
                      md:h-64
                      relative
                      overflow-hidden
                      bg-surface-container-high
                    "
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={
                          room.name ??
                          room.title ??
                          "Hotel room"
                        }
                        loading="lazy"
                        className="
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                          text-primary
                        "
                      >
                        <span className="material-symbols-outlined text-5xl">
                          bed
                        </span>
                      </div>
                    )}

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-60" />

                    {/* Offer */}
                    {room.is_on_offer && (
                      <span
                        className="
                          absolute
                          top-4
                          right-4
                          bg-error
                          text-on-error
                          px-3
                          py-1.5
                          rounded-full
                          font-label-caps
                          text-[10px]
                          tracking-[0.08em]
                          font-bold
                          shadow-lg
                        "
                      >
                        -{room.discount_percent}% OFF
                      </span>
                    )}

                    {/* Selected */}
                    {isSelected && (
                      <span
                        className="
                          absolute
                          top-4
                          left-4
                          flex
                          items-center
                          gap-1.5
                          bg-white
                          text-primary
                          px-3
                          py-1.5
                          rounded-full
                          text-[10px]
                          font-bold
                          tracking-[0.08em]
                        "
                      >
                        <span className="material-symbols-outlined text-[14px] text-secondary">
                          check_circle
                        </span>

                        SELECTED
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className="
                      p-5
                      md:p-7
                      flex
                      flex-col
                      flex-grow
                    "
                  >
                    {/* Title */}
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                        mb-4
                      "
                    >
                      <h4
                        className="
                          font-headline-md
                          text-headline-md
                          text-primary
                          leading-tight
                        "
                      >
                        {room.name ??
                          room.title ??
                          "Hotel Room"}
                      </h4>

                      {room.tag && (
                        <span
                          className="
                            bg-secondary-container
                            text-on-secondary-container
                            px-3
                            py-1
                            rounded-full
                            font-label-caps
                            text-[9px]
                            tracking-[0.08em]
                            shrink-0
                          "
                        >
                          {room.tag}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {room.description && (
                      <p
                        className="
                          text-on-surface-variant
                          font-body-md
                          text-sm
                          leading-relaxed
                          mb-6
                          flex-grow
                        "
                      >
                        {room.description}
                      </p>
                    )}

                    {/* Price / Button */}
                    <div
                      className="
                        pt-5
                        border-t
                        border-outline-variant/40
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-5
                      "
                    >
                      {/* Price */}
                      <div>
                        {room.is_on_offer &&
                          room.original_price && (
                            <span
                              className="
                                block
                                text-on-surface-variant
                                line-through
                                text-sm
                                mb-0.5
                              "
                            >
                              AED {room.original_price}
                            </span>
                          )}

                        <div className="flex items-baseline gap-1">
                          <span
                            className="
                              font-display-lg
                              text-2xl
                              font-bold
                              text-primary
                            "
                          >
                            AED {currentPrice}
                          </span>

                          <span className="text-on-surface-variant text-xs">
                            /night
                          </span>
                        </div>
                      </div>

                      {/* Select Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectRoom(room)
                        }
                        className={`
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          px-6
                          py-3
                          rounded-lg
                          font-bold
                          text-xs
                          tracking-[0.1em]
                          uppercase
                          transition-all
                          duration-300
                          ${
                            isSelected
                              ? "bg-secondary text-on-secondary"
                              : "bg-primary text-on-primary hover:bg-secondary"
                          }
                        `}
                      >
                        {isSelected
                          ? "Selected"
                          : "Select Room"}

                        <span className="material-symbols-outlined text-[17px]">
                          {isSelected
                            ? "check"
                            : "arrow_forward"}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}