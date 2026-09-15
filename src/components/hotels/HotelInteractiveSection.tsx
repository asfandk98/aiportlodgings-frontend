"use client";

import { useState } from "react";
import type { HotelDetail, HotelRoom } from "@/lib/api";

import RoomList from "@/components/hotels/RoomList";
import BookingWidget from "@/components/hotels/BookingWidget";

interface HotelInteractiveSectionProps {
  hotel: HotelDetail;
}

export default function HotelInteractiveSection({
  hotel,
}: HotelInteractiveSectionProps) {
  const [selectedRoom, setSelectedRoom] =
    useState<HotelRoom | null>(null);

  if (!hotel) {
    return null;
  }

  const rooms = hotel.rooms ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">

      <div className="lg:col-span-2">
        {rooms.length > 0 && (
          <RoomList
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelect={setSelectedRoom}
          />
        )}
      </div>

      <aside className="lg:col-span-1">
        <BookingWidget
          hotel={hotel}
          selectedRoom={selectedRoom}
        />
      </aside>

    </div>
  );
}