import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import HotelsClient from "./HotelsClient";

export const metadata = { title: "Hotels Near DXB & DWC | AirportHotelDubai" };

export default function HotelsPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="pt-24 min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <HotelsClient />
      </Suspense>
      <Footer />
      <BottomNav />
    </>
  );
}