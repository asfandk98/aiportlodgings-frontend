"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface AuthUser {
  name?: string;
  email?: string;
}

export default function Header() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const readAuth = () => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    readAuth();

    window.addEventListener("auth-change", readAuth);
    window.addEventListener("storage", readAuth);

    return () => {
      window.removeEventListener("auth-change", readAuth);
      window.removeEventListener("storage", readAuth);
    };
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">

        <div className="mx-3 mt-3 md:mx-5 lg:mx-8">
          <div
            className="relative h-16 md:h-[72px] rounded-2xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(11,29,58,0.08)]"
          >
            <div className="h-full px-4 md:px-6 lg:px-8 flex items-center justify-between">

              {/* =====================================================
                  LOGO
              ===================================================== */}

              <Link
                href="/"
                onClick={closeMobile}
                className="group flex items-center gap-3 shrink-0"
              >
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary-container text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                  <span className="material-symbols-outlined text-[22px]">
                    flight_takeoff
                  </span>

                  {/* Gold accent */}
                  <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-[#F5A623] border-2 border-white" />
                </div>

                <div className="hidden sm:block">
                  <div className="text-[17px] md:text-[18px] font-bold tracking-[-0.02em] text-primary leading-none">
                    AirportHotel
                    <span className="text-[#D58B0A]">Dubai</span>
                  </div>

                  <div className="text-[9px] font-semibold tracking-[0.18em] uppercase text-on-surface-variant mt-1">
                    Stay Near • Fly Easy
                  </div>
                </div>
              </Link>

              {/* =====================================================
                  DESKTOP NAVIGATION
              ===================================================== */}

              <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
                >
                  Home
                </Link>

                <Link
                  href="/hotels"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
                >
                  Hotels
                </Link>

                <Link
                  href="/blog"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
                >
                  Travel Guide
                </Link>

                <Link
                  href="/about-us"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
                >
                  Contact Us
                </Link>
              </nav>

              {/* =====================================================
                  RIGHT SIDE
              ===================================================== */}

              <div className="flex items-center gap-2 md:gap-3">

                {/* Search */}
                <Link
                  href="/hotels"
                  aria-label="Search hotels"
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
                >
                  <span className="material-symbols-outlined text-[21px]">
                    search
                  </span>
                </Link>

                {/* Divider */}
                <div className="hidden md:block w-px h-7 bg-outline-variant/50" />

                {/* User */}
                {user ? (
                  <Link
                    href="/dashboard"
                    className="group hidden sm:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-surface-container-low transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-container text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>

                    <div className="hidden md:block text-left">
                      <p className="text-xs font-bold text-primary leading-tight">
                        {user.name ?? "Account"}
                      </p>

                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        My Account
                      </p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-surface-container-low transition-all"
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      person
                    </span>

                    Login
                  </Link>
                )}

                {/* Main CTA */}
                <Link
                  href="/hotels"
                  className="hidden md:flex items-center gap-2 bg-[#F5A623] text-[#0B1D3A] px-4 lg:px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    hotel
                  </span>

                  Find a Hotel
                </Link>

                {/* Mobile menu */}
                <button
                  type="button"
                  aria-label={
                    mobileOpen
                      ? "Close menu"
                      : "Open menu"
                  }
                  aria-expanded={mobileOpen}
                  onClick={() =>
                    setMobileOpen((value) => !value)
                  }
                  className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-primary hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {mobileOpen ? "close" : "menu"}
                  </span>
                </button>
              </div>
            </div>

            {/* =====================================================
                MOBILE MENU
            ===================================================== */}

            {mobileOpen && (
              <div className="lg:hidden absolute left-0 right-0 top-[calc(100%+10px)]">
                <div className="rounded-2xl border border-white/60 bg-white/95 backdrop-blur-xl shadow-[0_12px_35px_rgba(11,29,58,0.12)] p-3">

                  <Link
                    href="/"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      home
                    </span>
                    Home
                  </Link>

                  <Link
                    href="/hotels"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      hotel
                    </span>
                    Hotels
                  </Link>

                  <Link
                    href="/blog"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      menu_book
                    </span>
                    Travel Guide
                  </Link>

                  <Link
                    href="/about-us"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      info
                    </span>
                    About Us
                  </Link>
                  <Link
                  href="/contact"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
                >
                  Contact Us
                </Link>

                  <div className="my-2 border-t border-outline-variant/30" />

                  {user ? (
                    <Link
                      href="/dashboard"
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-surface-container-low"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary-container text-white flex items-center justify-center text-sm font-bold">
                        {user.name?.[0]?.toUpperCase() ?? "U"}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-primary">
                          {user.name ?? "My Account"}
                        </p>

                        <p className="text-xs text-on-surface-variant">
                          View dashboard
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeMobile}
                      className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-primary-container text-white text-sm font-bold"
                    >
                      <span className="material-symbols-outlined text-[19px]">
                        person
                      </span>

                      Login
                    </Link>
                  )}

                  <Link
                    href="/hotels"
                    onClick={closeMobile}
                    className="mt-2 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#F5A623] text-[#0B1D3A] text-sm font-bold"
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      hotel
                    </span>

                    Find a Hotel
                  </Link>

                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Header spacing */}
      <div className="h-[88px] md:h-[96px]" />
    </>
  );
}