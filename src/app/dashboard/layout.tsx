"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      sessionStorage.setItem("redirect_after_login", window.location.pathname);
      router.push("/login");
      return;
    }
    if (role === "admin") {
      router.push("/admin/dashboard");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-container-margin py-lg mt-14 mb-16 md:mb-0">
        <DashboardTabs />
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}