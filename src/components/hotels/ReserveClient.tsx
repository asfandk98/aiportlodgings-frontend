"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HotelDetail, HotelRoom } from "@/lib/api";
import { getSeasonalPrices } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";
import { initiatePayment } from "@/lib/payments";

declare global {
  interface Window {
    Checkout?: { configure: (opts: unknown) => void; showPaymentPage: () => void };
    paymentError?: (err: { cause?: string; explanation?: string }) => void;
    paymentCancelled?: () => void;
    paymentComplete?: () => void;
  }
}

interface ExtendedHotel extends HotelDetail {
  nearest_terminal?: string;
}
interface ExtendedRoom extends HotelRoom {
  day_use_available?: boolean;
  day_use_price?: number | string;
  day_use_hours?: number;
}

function roomImage(room: HotelRoom | null): string | null {
  if (!room) return null;
  const first = room.images?.[0];
  const galleryUrl = typeof first === "string" ? first : (first?.url ?? toAbsoluteImageUrl(first?.path));
  return toAbsoluteImageUrl(room.image_url) ?? toAbsoluteImageUrl(room.image) ?? galleryUrl ?? null;
}

export default function ReserveClient({ hotel, initialRoom }: { hotel: HotelDetail; initialRoom: HotelRoom | null }) {
  const router = useRouter();
  const h = hotel as ExtendedHotel;
  const selectedRoom = initialRoom;
  const r = selectedRoom as ExtendedRoom | null;

  const [stayType, setStayType] = useState<"overnight" | "day_use">("overnight");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seasonalPrices, setSeasonalPrices] = useState<Awaited<ReturnType<typeof getSeasonalPrices>>>([]);
  const [activeSeasonal, setActiveSeasonal] = useState<(typeof seasonalPrices)[number] | null>(null);

  const canDayUse = r?.day_use_available && r?.day_use_price;

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      if (user?.email) setEmail(user.email);
      if (user?.name) {
        const [f, ...rest] = user.name.split(" ");
        setFirstName(f ?? "");
        setLastName(rest.join(" "));
      }
    } catch {
      // not logged in yet
    }
  }, []);

  useEffect(() => {
    if (!selectedRoom?.id) return;
    getSeasonalPrices(selectedRoom.id).then(setSeasonalPrices);
  }, [selectedRoom?.id]);

  const startDate = checkIn ? new Date(checkIn) : null;
  const endDate = checkOut ? new Date(checkOut) : null;

  useEffect(() => {
    if (!startDate || !endDate || seasonalPrices.length === 0) {
      setActiveSeasonal(null);
      return;
    }
    const s = new Date(startDate);
    s.setHours(0, 0, 0, 0);
    const match = seasonalPrices.find((sp) => {
      const sStart = new Date(sp.start_date);
      sStart.setHours(0, 0, 0, 0);
      const sEnd = new Date(sp.end_date);
      sEnd.setHours(0, 0, 0, 0);
      return sStart <= s && sEnd >= s;
    });
    setActiveSeasonal(match ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, seasonalPrices]);

  const nights =
    stayType === "overnight" && startDate && endDate
      ? Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
      : stayType === "day_use" && startDate && endDate
      ? 1
      : 0;

  const isValidDates = stayType === "overnight" ? nights > 0 : !!startDate && !!endDate;

  const basePrice = Number(
    stayType === "day_use" && canDayUse ? r?.day_use_price : (selectedRoom?.active_price ?? selectedRoom?.price ?? hotel.price ?? 0)
  );
  const seasonalPrice = stayType === "overnight" && activeSeasonal ? Number(activeSeasonal.price) : null;
  const isOnOffer = seasonalPrice !== null && seasonalPrice < basePrice;
  const nightRate = isOnOffer ? seasonalPrice! : basePrice;

  const subtotal = stayType === "overnight" ? nights * nightRate : nightRate;
  const tax = Math.round(subtotal * 0.05);
  
  const total = subtotal + tax;

  useEffect(() => {
    window.paymentError = (err) => {
      setError("Payment failed: " + (err?.cause ?? err?.explanation ?? "Unknown error"));
      setLoading(false);
    };
    window.paymentCancelled = () => {
      setError("Payment was cancelled. You have not been charged.");
      setLoading(false);
    };
    window.paymentComplete = () => {
      window.location.href = "/payment/result";
    };
    return () => {
      delete window.paymentError;
      delete window.paymentCancelled;
      delete window.paymentComplete;
    };
  }, []);

  const loadMpgsAndPay = (sessionId: string, mpgsJsUrl: string) => {
    const script = document.createElement("script");
    script.src = mpgsJsUrl;
    script.setAttribute("data-error", "paymentError");
    script.setAttribute("data-cancel", "paymentCancelled");
    script.setAttribute("data-complete", "paymentComplete");
    script.onload = () => {
      if (!window.Checkout) {
        setError("Payment gateway failed to load. Please try again.");
        setLoading(false);
        return;
      }
      window.Checkout.configure({ session: { id: sessionId } });
      window.Checkout.showPaymentPage();
    };
    script.onerror = () => {
      setError("Could not connect to payment gateway. Please try again.");
      setLoading(false);
    };
    document.body.appendChild(script);
  };

  const handleConfirm = async () => {
    if (!isValidDates || loading) return;
    if (!firstName.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirect_after_login", window.location.pathname + window.location.search);
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await initiatePayment({
        total,
        email,
        hotel_id: hotel.id,
        room_id: selectedRoom?.id ?? null,
        check_in: startDate!.toISOString().split("T")[0],
        check_out: endDate!.toISOString().split("T")[0],
        guests: { adults: 1, children: 0 },
        night_rate: nightRate,
        seasonal_price_id: activeSeasonal?.id ?? null,
        description: `${hotel.title}${selectedRoom ? ` — ${selectedRoom.name}` : ""} · ${
          stayType === "overnight" ? `${nights} night${nights !== 1 ? "s" : ""}` : "Day use"
        }`,
      });
      loadMpgsAndPay(data.session_id, data.mpgs_js);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment initiation failed");
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-container-margin py-lg flex flex-col lg:flex-row gap-lg">
      <div className="w-full lg:w-2/3 flex flex-col gap-lg">
        {/* Stay type + dates */}
        <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant flex flex-col gap-lg">
          <h2 className="font-headline-md text-headline-md text-primary">Your Stay Details</h2>

          <div className="flex flex-col md:flex-row gap-md p-md bg-surface-container-low rounded-lg">
            <button
              onClick={() => setStayType("overnight")}
              className={`flex-1 border rounded-lg p-md text-center transition-all ${
                stayType === "overnight" ? "border-primary-container bg-primary-fixed ring-2 ring-primary-container" : "border-outline-variant"
              }`}
            >
              <span className="material-symbols-outlined text-primary mb-2 block">bed</span>
              <span className="font-label-bold text-label-bold text-primary block">Staying Overnight</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant block mt-1">Standard check-in/out</span>
            </button>
            <button
              onClick={() => setStayType("day_use")}
              disabled={!canDayUse}
              className={`flex-1 border rounded-lg p-md text-center transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                stayType === "day_use" ? "border-primary-container bg-primary-fixed ring-2 ring-primary-container" : "border-outline-variant"
              }`}
            >
              <span className="material-symbols-outlined text-primary mb-2 block">schedule</span>
              <span className="font-label-bold text-label-bold text-primary block">Day Use / Hourly</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant block mt-1">
                {canDayUse ? "Transit & short stays" : "Not available for this room"}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="flex flex-col gap-sm">
              <label className="font-label-bold text-label-bold text-primary">
                {stayType === "overnight" ? "Check-in Date & Time" : "Arrival Time"}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">calendar_today</span>
                <input
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full h-[48px] pl-10 pr-3 border border-outline-variant rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none bg-surface-container-lowest transition-all"
                  type="datetime-local"
                />
              </div>
            </div>
            <div className="flex flex-col gap-sm">
              <label className="font-label-bold text-label-bold text-primary">
                {stayType === "overnight" ? "Check-out Date & Time" : "Departure Time"}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">event</span>
                <input
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().slice(0, 16)}
                  className="w-full h-[48px] pl-10 pr-3 border border-outline-variant rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none bg-surface-container-lowest transition-all"
                  type="datetime-local"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Guest info */}
        <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant flex flex-col gap-lg">
          <h2 className="font-headline-md text-headline-md text-primary">Guest Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="flex flex-col gap-sm">
              <label className="font-label-bold text-label-bold text-primary">First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-[48px] px-3 border border-outline-variant rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none bg-surface-container-lowest transition-all"
                placeholder="John"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-sm">
              <label className="font-label-bold text-label-bold text-primary">Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-[48px] px-3 border border-outline-variant rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none bg-surface-container-lowest transition-all"
                placeholder="Doe"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-sm md:col-span-2">
              <label className="font-label-bold text-label-bold text-primary">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[48px] px-3 border border-outline-variant rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none bg-surface-container-lowest transition-all"
                placeholder="john.doe@example.com"
                type="email"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Summary sidebar */}
      <div className="w-full lg:w-1/3">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden sticky top-lg">
          <div className="p-lg border-b border-outline-variant">
            <div className="flex gap-md mb-md">
              <div className="w-24 h-24 rounded-lg bg-cover bg-center shrink-0 bg-surface-container-high overflow-hidden">
                {roomImage(selectedRoom) ? (
                  <img src={roomImage(selectedRoom)!} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🏨</div>
                )}
              </div>
              
            </div>
            {selectedRoom && (
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">king_bed</span>
                <span>{selectedRoom.name ?? selectedRoom.title}</span>
              </div>
            )}
          </div>

          {isValidDates ? (
            <div className="p-lg bg-surface-container-low flex flex-col gap-sm">
              <div className="flex justify-between items-center text-on-surface">
                <span>{stayType === "overnight" ? `Room Rate (${nights} Night${nights !== 1 ? "s" : ""})` : "Room Rate (Day Use)"}</span>
                <span>AED {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface">
                <span>Taxes &amp; Fees</span>
                <span>AED {tax.toLocaleString()}</span>
              </div>
             
              <div className="my-2 border-t border-outline-variant border-dashed" />
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md font-bold text-primary">Total</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Includes all taxes</span>
                </div>
                <span className="font-display-lg text-[32px] font-bold text-primary">AED {total.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="p-lg bg-surface-container-low text-center text-on-surface-variant text-sm">
              Select your dates to see the full price breakdown.
            </div>
          )}

          <div className="p-lg border-t border-outline-variant">
            {error && (
              <div className="bg-error-container border border-error/30 rounded-lg p-3 mb-lg">
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={!isValidDates || loading}
              className="w-full h-[48px] bg-[#F5A623] hover:bg-[#E0961E] text-[#0B1D3A] font-label-bold text-label-bold rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm disabled:opacity-40"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#0B1D3A] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[20px]">lock</span>
              )}
              {loading ? "Processing…" : "Continue to Payment"}
            </button>
            <p className="font-label-sm text-label-sm text-center text-on-surface-variant mt-sm">You won&apos;t be charged yet</p>
          </div>
        </div>
      </div>
    </main>
  );
}