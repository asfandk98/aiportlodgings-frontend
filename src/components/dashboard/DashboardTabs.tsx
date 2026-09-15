"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "Wishlist", href: "/dashboard/wishlist" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-md border-b border-outline-variant mb-lg overflow-x-auto">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-2 pb-3 font-label-bold text-label-bold whitespace-nowrap border-b-2 transition-colors ${
              active ? "text-primary-container border-primary-container" : "text-on-surface-variant border-transparent hover:text-primary-container"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}