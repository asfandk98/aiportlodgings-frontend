"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import type { HotelDetail, HotelRoom } from "@/lib/api";
import { addToWishlist, removeFromWishlist } from "@/lib/wishlist";

interface ExtendedHotel extends HotelDetail {
  day_use_available?: boolean;
  day_use_price?: number | string;
  day_use_hours?: number;
}

interface ExtendedRoom extends HotelRoom {
  day_use_available?: boolean;
  day_use_price?: number | string;
  day_use_hours?: number;
}

interface BookingWidgetProps {
  hotel: HotelDetail;
  selectedRoom?: HotelRoom | null;
}

export default function BookingWidget({
  hotel,
  selectedRoom = null,
}: BookingWidgetProps) {
  const h = hotel as ExtendedHotel;
  const r = selectedRoom as ExtendedRoom | null;

  const [saved, setSaved] = useState(false);

  /*
   * Day-use pricing
   * If a room is selected, use the room's day-use settings.
   * Otherwise use the hotel's day-use settings.
   */
  const isDayUse = Boolean(
    selectedRoom
      ? r?.day_use_available && r?.day_use_price
      : h.day_use_available && h.day_use_price
  );

  /*
   * Price
   */
  const price = selectedRoom
    ? isDayUse
      ? r?.day_use_price
      : selectedRoom.active_price ?? selectedRoom.price
    : isDayUse
      ? h.day_use_price
      : hotel.active_price ?? hotel.price;

  /*
   * Discount only applies to the hotel-level price.
   * Room discounts are handled separately by RoomsList.
   */
  const showDiscount = Boolean(
    !selectedRoom &&
      hotel.is_on_offer &&
      hotel.original_price &&
      Number(hotel.original_price) > Number(price)
  );

  /*
   * Reserve URL
   */
  const reserveHref = selectedRoom
    ? `/hotels/${hotel.slug ?? hotel.id}/reserve?room=${
        selectedRoom.slug ?? selectedRoom.id
      }`
    : `/hotels/${hotel.slug ?? hotel.id}/reserve`;

  /*
   * Wishlist
   */
  const toggleWishlist = async () => {
    try {
      if (saved) {
        await removeFromWishlist(String(hotel.id));

        setSaved(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(String(hotel.id));

        setSaved(true);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Please log in to save hotels");
    }
  };

  return (
    <div className="lg:col-span-1 relative">
      <div
        className="sticky top-24 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30"
        style={{
          boxShadow: "0px 4px 12px rgba(26,43,66,0.08)",
        }}
      >
        {/* Selected room */}
        {selectedRoom && (
          <div className="mb-5 p-3 bg-[#FFF4E5] border border-[#F5A623]/40 rounded-lg">
            <p className="text-[10px] font-bold tracking-[0.12em] text-primary/60 mb-1">
              SELECTED ROOM
            </p>

            <p className="text-sm font-semibold text-primary leading-snug">
              {selectedRoom.name ?? selectedRoom.title ?? "Selected Room"}
            </p>
          </div>
        )}

        {/* Price + wishlist */}
        <div className="flex justify-between items-start mb-6">
          <div>
            {showDiscount && (
              <span className="text-sm text-on-surface-variant line-through block mb-1">
                AED {hotel.original_price}
              </span>
            )}

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-primary">
                AED {price ?? "—"}
              </span>
            </div>

            <span className="text-xs text-on-surface-variant block mt-1">
              {isDayUse
                ? `/ ${r?.day_use_hours ?? h.day_use_hours ?? 8} hours day use`
                : "/ night"}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleWishlist}
            className="p-2 rounded-full hover:bg-surface-container-highest transition-colors"
            aria-label={
              saved ? "Remove from wishlist" : "Save to wishlist"
            }
          >
            <span
              className="material-symbols-outlined text-primary"
              style={
                saved
                  ? {
                      fontVariationSettings: "'FILL' 1",
                    }
                  : undefined
              }
            >
              {saved ? "favorite" : "favorite_border"}
            </span>
          </button>
        </div>

        {/* Booking button */}
        <Link
          href={reserveHref}
          className="w-full bg-[#F5A623] text-[#0B1D3A] font-semibold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform shadow-md"
        >
          {selectedRoom ? "Book This Room" : "Select a Room"}

          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </Link>

        {/* Message before room selection */}
        {!selectedRoom && (
          <p className="text-center mt-3 text-on-surface-variant text-xs">
            Choose a room below to continue
          </p>
        )}

        {/* Selected room message */}
        {selectedRoom && (
          <p className="text-center mt-3 text-on-surface-variant text-xs">
            You can continue with this room or select another room below.
          </p>
        )}
      </div>
    </div>
  );
}