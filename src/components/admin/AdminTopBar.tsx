"use client";

import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { logoutUser } from "@/lib/auth";

function titleFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] ?? "Dashboard";
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
}

export default function AdminTopBar({ title, subtitle }: { title?: string; subtitle?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout request failed, signing out locally");
    }
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    router.replace("/login");
  };

  return (
    <header className="h-16 flex justify-between items-center px-lg bg-white border-b border-outline-variant sticky top-0 z-50">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary">{title ?? titleFromPath(pathname)}</h2>
        {subtitle && <p className="font-label-sm text-label-sm text-on-surface-variant">{subtitle}</p>}
      </div>
      <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors" aria-label="Logout">
        <span className="material-symbols-outlined">logout</span>
      </button>
    </header>
  );
}