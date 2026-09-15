"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserBookings, getUserWishlistHotels, type UserBooking, type WishlistHotel } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

interface AuthUser {
  name?: string;
}

const STATUS_STYLES: Record<string, { label: string; classes: string; icon: string }> = {
  confirmed: { label: "Confirmed", classes: "bg-green-100 text-green-800", icon: "check_circle" },
  pending: { label: "Pending", classes: "bg-amber-100 text-amber-800", icon: "schedule" },
  cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-800", icon: "cancel" },
  cancellation_requested: { label: "Cancel Req.", classes: "bg-orange-100 text-orange-800", icon: "error" },
};

export default function DashboardOverview() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [wishlist, setWishlist] = useState<WishlistHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore malformed cache
    }
    Promise.all([getUserBookings(), getUserWishlistHotels()])
      .then(([b, w]) => {
        setBookings(b);
        setWishlist(w);
      })
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter((b) => new Date(b.check_in) >= new Date() && b.status === "confirmed");
  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: "event_note" },
    { label: "Upcoming Stays", value: upcoming.length, icon: "flight_land" },
    { label: "Saved Hotels", value: wishlist.length, icon: "favorite" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-xl">
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Here&apos;s your travel snapshot</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex items-center gap-md">
            <div className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="font-headline-lg text-headline-lg text-primary">{s.value}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-md">
          <h2 className="font-headline-md text-headline-md text-primary">Upcoming Stays</h2>
          <Link href="/dashboard/bookings" className="font-label-sm text-label-sm text-secondary hover:underline">
            View all →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2 block">flight_takeoff</span>
            <p className="text-on-surface-variant text-sm">No upcoming stays</p>
            <Link href="/hotels" className="mt-2 inline-block text-sm text-secondary hover:underline">
              Browse hotels →
            </Link>
          </div>
        ) : (
          <div className="space-y-sm">
            {upcoming.slice(0, 3).map((b) => {
              const cfg = STATUS_STYLES[b.status] ?? STATUS_STYLES.pending;
              return (
                <Link
                  key={b.id}
                  href={`/dashboard/bookings/${b.id}`}
                  className="flex items-center gap-md bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:border-primary-container transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                    {toAbsoluteImageUrl(b.hotel_image) ? (
                      <img src={toAbsoluteImageUrl(b.hotel_image)!} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🏨</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-primary text-sm font-semibold truncate">{b.hotel_name}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5 truncate">
                      {b.check_in} → {b.check_out}
                    </p>
                  </div>
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.classes}`}>
                    <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                    {cfg.label}
                  </div>
                  <p className="text-primary-container font-bold text-sm shrink-0">AED {Number(b.total_price).toLocaleString()}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}