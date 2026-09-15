"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Search", href: "/hotels", icon: "search" },
  { label: "Bookings", href: "/dashboard/bookings", icon: "event_note" },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: "favorite" },
  { label: "Profile", href: "/dashboard", icon: "person" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-surface pb-safe border-t border-outline-variant md:hidden">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center active:scale-90 transition-all duration-200 ${
              active ? "text-secondary bg-secondary-fixed rounded-xl px-3 py-1" : "text-on-surface-variant hover:text-secondary"
            }`}
          >
            <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}