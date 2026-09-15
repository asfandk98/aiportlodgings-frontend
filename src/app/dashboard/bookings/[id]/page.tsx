"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getUserBooking, requestCancelBooking, type UserBooking } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

const STATUS_STYLES: Record<string, { label: string; classes: string; icon: string }> = {
  confirmed: { label: "Confirmed", classes: "bg-green-100 text-green-800", icon: "check_circle" },
  pending: { label: "Pending", classes: "bg-amber-100 text-amber-800", icon: "schedule" },
  cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-800", icon: "cancel" },
  cancellation_requested: { label: "Cancel Requested", classes: "bg-orange-100 text-orange-800", icon: "error" },
};

interface FullBooking extends UserBooking {
  guest_name?: string;
  guest_email?: string;
  created_at?: string;
}

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<FullBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    getUserBooking(id)
      .then((data) => setBooking(data as FullBooking))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to request cancellation?")) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await requestCancelBooking(id);
      setBooking((prev) => (prev ? { ...prev, status: "cancellation_requested" } : prev));
      setCancelled(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Could not cancel booking.";
      setCancelError(message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center text-on-surface-variant py-20">
        Booking not found.
        <Link href="/dashboard/bookings" className="block mt-3 text-secondary hover:underline text-sm">
          ← Back to bookings
        </Link>
      </div>
    );
  }

  const cfg = STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending;
  const canCancel = ["confirmed", "pending"].includes(booking.status) && !cancelled;

  return (
    <div className="space-y-md max-w-2xl">
      <Link href="/dashboard/bookings" className="flex items-center gap-2 text-on-surface-variant hover:text-primary-container transition text-sm">
        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to bookings
      </Link>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">Booking Reference</p>
            <p className="text-primary font-mono font-bold text-lg">{booking.reference}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${cfg.classes}`}>
            <span className="material-symbols-outlined text-[16px]">{cfg.icon}</span>
            {cfg.label}
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        {toAbsoluteImageUrl(booking.hotel_image) && (
          <div className="h-40 overflow-hidden">
            <img src={toAbsoluteImageUrl(booking.hotel_image)!} className="w-full h-full object-cover" alt={booking.hotel_name} />
          </div>
        )}
        <div className="p-md">
          <h2 className="font-headline-md text-headline-md text-primary">{booking.hotel_name}</h2>
          <p className="text-on-surface-variant text-sm flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-[16px]">bed</span> {booking.room_name}
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl">
        <div className="px-md py-3 border-b border-outline-variant">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Booking Details</p>
        </div>
        <div className="divide-y divide-outline-variant">
          {[
            ["Check-in", booking.check_in],
            ["Check-out", booking.check_out],
            ["Duration", `${booking.nights} night${booking.nights !== 1 ? "s" : ""}`],
            ["Booked on", booking.created_at?.split("T")[0] ?? "—"],
          ].map(([label, value]) => (
            <div key={label as string} className="flex justify-between items-center px-md py-3">
              <span className="text-xs text-on-surface-variant uppercase tracking-wide">{label}</span>
              <span className="text-sm text-primary font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl">
        <div className="px-md py-3 border-b border-outline-variant">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Price Breakdown</p>
        </div>
        <div className="px-md py-3 space-y-3">
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Room subtotal</span>
            <span>AED {Number(booking.subtotal ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Tax (5%)</span>
            <span>AED {Number(booking.tax ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-primary font-bold text-base pt-3 border-t border-outline-variant">
            <span>Total Paid</span>
            <span className="text-primary-container">AED {Number(booking.total_price).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {cancelError && <div className="bg-error-container border border-error/30 rounded-xl p-4 text-center text-error text-sm">{cancelError}</div>}

      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-error text-error hover:bg-error/5 transition text-sm font-semibold disabled:opacity-50"
        >
          {cancelling ? <span className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-lg">cancel</span>}
          {cancelling ? "Submitting…" : "Request Cancellation"}
        </button>
      )}

      {cancelled && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center text-orange-800 text-sm font-medium">
          Cancellation request submitted. Our team will be in touch.
        </div>
      )}
    </div>
  );
}