"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFilters } from "@/lib/api";

export default function Hero() {
  const router = useRouter();
  const [stayType, setStayType] = useState<"overnight" | "day_use">("overnight");
  const [locations, setLocations] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [guests, setGuests] = useState("2 Adults");

  useEffect(() => {
    getFilters().then((data) => {
      const list = data.locations ?? [];
      setLocations(list);
      if (list.length > 0) setLocation(list[0]);
    });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("check_in", checkIn);
    if (guests) params.set("guests", guests);
    if (stayType === "day_use") params.set("stay_type", "day_use");
    router.push(`/hotels${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center pt-8">
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          role="img"
          aria-label="Dubai airport terminal at night"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8wx1TjIayPDJfk_xUtnTPQgjcAPYNzg01Ij2pbPOvVP1oD0lhUkhIL_hYJNX0wetJJjgqLKWxfI3EBqoUa7wh0wedPmwUm-ozoDxIbNN3irAhiHwF3LoOJ43xBjJcQaIDW7XP_9GCL3bqfy8q9xWnfhjZmYltxqWs99NkPWgu_Jlj8L6hDno6_Suz1X5OU8-6vs1mI7Ilk7XROPKF-yaHFvKmad945y7lvGTkeSSTtzB0P501HdZ7')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container/80 to-primary-container/60" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-container-margin text-center md:text-left flex flex-col md:flex-row gap-xl items-center">
        <div className="w-full md:w-1/2 text-on-primary">
          <h1 className="font-display-lg text-display-lg md:text-5xl text-on-tertiary mb-md">
            Your Flight Delayed? We&apos;ve Got a Room Near Your Gate.
          </h1>
          <p className="font-body-lg text-body-lg text-tertiary-fixed mb-xl">Book in under 2 minutes. Free shuttle included.</p>
        </div>

        {/* Search card */}
        <div className="w-full md:w-1/2">
          <div className="glass-panel rounded-xl shadow-[0_12px_32px_rgba(26,43,66,0.15)] p-md">
            <div className="flex gap-2 mb-md bg-surface-container-low p-1 rounded-lg">
              <button
                onClick={() => setStayType("overnight")}
                className={`flex-1 py-2 font-label-bold text-label-bold rounded-md transition-colors ${
                  stayType === "overnight" ? "bg-white text-primary-container shadow-sm" : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                Overnight
              </button>
              <button
                onClick={() => setStayType("day_use")}
                className={`flex-1 py-2 font-label-bold text-label-bold rounded-md transition-colors ${
                  stayType === "day_use" ? "bg-white text-primary-container shadow-sm" : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                Day Use (Hourly)
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Area</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">location_on</span>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 h-[48px] rounded-lg border-outline-variant bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface font-body-md"
                  >
                    {locations.length === 0 && <option value="">Loading areas…</option>}
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    {stayType === "overnight" ? "Check-in" : "Arrival Time"}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">calendar_today</span>
                    <input
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={stayType === "overnight" ? new Date().toISOString().split("T")[0] : undefined}
                      className="w-full pl-10 pr-3 h-[48px] rounded-lg border-outline-variant bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface font-body-md"
                      type={stayType === "overnight" ? "date" : "datetime-local"}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Guests</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">person</span>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full pl-10 pr-3 h-[48px] rounded-lg border-outline-variant bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface font-body-md"
                    >
                      <option>1 Adult</option>
                      <option>2 Adults</option>
                      <option>Family</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full h-[48px] bg-secondary-container text-on-secondary-container font-label-bold text-label-bold rounded-lg mt-2 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">search</span>
                Find a Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}