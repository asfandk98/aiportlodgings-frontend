"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getAdminStats, getAdminBookings, type AdminStats, type AdminBooking } from "@/lib/admin";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  paid: "bg-blue-100 text-blue-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-violet-100 text-violet-800",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminBookings({ page: 1, status: "pending" })])
      .then(([statsRes, bookingsRes]) => {
        setStats(statsRes.data);
        setBookings((bookingsRes.data.data ?? []).slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = stats
    ? [
        { label: "Total Revenue", value: `AED ${Number(stats.revenue).toLocaleString()}`, icon: "payments" },
        { label: "Total Bookings", value: stats.bookings, icon: "book_online", note: `${stats.pending} pending` },
        { label: "Hotel Partners", value: stats.hotels, icon: "hotel", note: `${stats.active_hotels} active` },
        { label: "Total Rooms", value: stats.rooms, icon: "meeting_room" },
      ]
    : [];

  return (
    <>
      <AdminTopBar title="Dashboard Overview" subtitle="Welcome back. Here is what is happening today." />

      <div className="flex-1 overflow-y-auto p-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
          {cards.map((card) => (
            <div key={card.label} className="bg-white p-lg border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-md">
                <div className="p-2 rounded-lg bg-secondary-container/20">
                  <span className="material-symbols-outlined text-primary-container">{card.icon}</span>
                </div>
                {card.note && <span className="text-on-surface-variant font-label-sm text-label-sm">{card.note}</span>}
              </div>
              <p className="font-label-bold text-label-bold text-on-surface-variant">{card.label}</p>
              <h3 className="font-headline-lg text-headline-lg text-primary mt-1">{card.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant flex flex-col">
            <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
              <h4 className="font-headline-md text-headline-md text-primary">Pending Bookings</h4>
              <Link href="/admin/bookings" className="text-primary-container font-label-bold text-label-bold hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left zebra-table">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-lg py-3 font-label-bold text-label-bold text-on-surface-variant">Reference</th>
                    <th className="px-lg py-3 font-label-bold text-label-bold text-on-surface-variant">Guest</th>
                    <th className="px-lg py-3 font-label-bold text-label-bold text-on-surface-variant">Property</th>
                    <th className="px-lg py-3 font-label-bold text-label-bold text-on-surface-variant">Status</th>
                    <th className="px-lg py-3 font-label-bold text-label-bold text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-lg py-8 text-center text-on-surface-variant">No pending bookings</td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="px-lg py-4 text-primary text-sm">{b.reference ?? `#${b.id}`}</td>
                        <td className="px-lg py-4 text-primary text-sm">{b.user?.name ?? b.guest_name ?? "—"}</td>
                        <td className="px-lg py-4 text-on-surface-variant text-sm">{b.hotel?.title ?? "—"}</td>
                        <td className="px-lg py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[b.status] ?? "bg-gray-100 text-gray-800"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-lg py-4">
                          <Link href={`/admin/bookings?ref=${b.reference ?? b.id}`} className="text-primary-container hover:text-secondary">
                            <span className="material-symbols-outlined">edit</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm">
            <h4 className="font-headline-md text-headline-md text-primary mb-md">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-sm">
              <QuickAction href="/admin/hotels/create" icon="add_business" label="Add Hotel" />
              <QuickAction href="/admin/bookings" icon="event_available" label="All Bookings" />
              <QuickAction href="/admin/blog/create" icon="edit_note" label="New Post" />
              <QuickAction href="/admin/hotels" icon="hotel" label="All Hotels" />
              <QuickAction href="/admin/rooms/create" icon="meeting_room" label="Add Room" />
              <QuickAction href="/admin/rooms/seasonal-prices" icon="sell" label="Seasonal Prices" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-2 p-md border border-outline-variant rounded-lg hover:border-secondary-container hover:bg-surface-container-low transition-all group">
      <span className="material-symbols-outlined text-primary-container group-hover:text-secondary">{icon}</span>
      <span className="font-label-sm text-label-sm text-center">{label}</span>
    </Link>
  );
}