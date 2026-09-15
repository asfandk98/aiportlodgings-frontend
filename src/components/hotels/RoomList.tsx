"use client";

import type { HotelRoom } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

interface ExtendedRoom extends HotelRoom {
  day_use_available?: boolean;
  day_use_price?: number | string;
  day_use_hours?: number;
}

interface RoomsListProps {
  rooms: HotelRoom[];
  selectedRoom: HotelRoom | null;
  onSelect: (room: HotelRoom) => void;
}

function roomImage(room: HotelRoom): string | null {
  /*
   * 1. room.image_url
   * 2. room.image
   * 3. first room gallery image
   */
  const directImage =
    toAbsoluteImageUrl(room.image_url) ??
    toAbsoluteImageUrl(room.image);

  if (directImage) {
    return directImage;
  }

  const firstImage = room.images?.[0];

  if (!firstImage) {
    return null;
  }

  if (typeof firstImage === "string") {
    return toAbsoluteImageUrl(firstImage);
  }

  return (
    toAbsoluteImageUrl(firstImage.url) ??
    toAbsoluteImageUrl(firstImage.path)
  );
}

export default function RoomsList({
  rooms,
  selectedRoom,
  onSelect,
}: RoomsListProps) {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <section id="rooms" className="space-y-6">
      {/* Heading */}
      <div>
        <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-secondary">
          Accommodation
        </span>

        <h2 className="font-headline-md text-headline-md text-primary mt-2">
          Available Rooms
        </h2>

        <p className="mt-2 text-body-md text-on-surface-variant">
          Choose the room that best suits your stay.
        </p>
      </div>

      {/* Rooms */}
      <div className="space-y-5">
        {rooms.map((room) => {
          const r = room as ExtendedRoom;

          const image = roomImage(room);

          const isSelected =
            selectedRoom?.id === room.id;

          const isDayUse = Boolean(
            r.day_use_available && r.day_use_price
          );

          const price = isDayUse
            ? r.day_use_price
            : room.active_price ?? room.price;

          const originalPrice =
            room.original_price &&
            Number(room.original_price) > Number(price)
              ? room.original_price
              : null;

          return (
            <article
              key={room.id}
              className={`bg-surface-container-lowest rounded-xl overflow-hidden border transition-all duration-300 ${
                isSelected
                  ? "border-[#F5A623] ring-1 ring-[#F5A623]/30 shadow-md"
                  : "border-outline-variant/30 hover:border-outline-variant hover:shadow-md"
              }`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-56 lg:w-64 h-52 md:h-auto shrink-0">
                  {image ? (
                    <img
                      src={image}
                      alt={
                        room.name ??
                        room.title ??
                        "Hotel room"
                      }
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-surface-container-highest text-primary">
                      <span className="material-symbols-outlined text-5xl">
                        hotel
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between gap-5">
                  <div>
                    {/* Room name + day use */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-primary leading-tight">
                        {room.name ??
                          room.title ??
                          "Hotel Room"}
                      </h3>

                      {isDayUse && (
                        <span className="bg-[#FFF4E5] text-[#835500] text-[10px] font-bold px-2.5 py-1 rounded-full">
                          Day Use · {r.day_use_hours ?? 8}h
                        </span>
                      )}

                      {isSelected && (
                        <span className="bg-[#0B1D3A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          SELECTED
                        </span>
                      )}
                    </div>

                    {/* Room information */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4 text-xs text-on-surface-variant">
                      {room.size && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[17px]">
                            straighten
                          </span>

                          <span>{room.size}</span>
                        </div>
                      )}

                      {room.beds != null && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[17px]">
                            bed
                          </span>

                          <span>
                            {room.beds}{" "}
                            {room.beds === 1
                              ? "bed"
                              : "beds"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {room.description && (
                      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                        {room.description}
                      </p>
                    )}

                    {/* Amenities */}
                    {room.amenities &&
                      room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {room.amenities
                            .slice(0, 5)
                            .map((amenity) => (
                              <span
                                key={amenity}
                                className="inline-flex items-center rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] text-on-surface-variant"
                              >
                                {amenity}
                              </span>
                            ))}

                          {room.amenities.length > 5 && (
                            <span className="inline-flex items-center rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] text-on-surface-variant">
                              +{room.amenities.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Price + Select */}
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-outline-variant/30">
                    <div>
                      {originalPrice && (
                        <div className="text-xs text-on-surface-variant line-through mb-0.5">
                          AED {originalPrice}
                        </div>
                      )}

                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">
                          AED {price ?? "—"}
                        </span>
                      </div>

                      <span className="text-xs text-on-surface-variant">
                        {isDayUse
                          ? `${r.day_use_hours ?? 8} hours`
                          : "per night"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelect(room)}
                      className={`w-full sm:w-auto min-w-[140px] px-5 py-3 rounded-lg font-semibold text-sm transition-all ${
                        isSelected
                          ? "bg-[#F5A623] text-[#0B1D3A] shadow-sm"
                          : "bg-primary-container text-white hover:bg-primary"
                      }`}
                    >
                      {isSelected
                        ? "Selected"
                        : "Select Room"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}