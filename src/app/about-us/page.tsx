import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getHotelsList } from "@/lib/api";

export const metadata = { title: "About Us | AirportHotelDubai" };

const VALUES = [
  { icon: "airport_shuttle", title: "Free Airport Shuttle", desc: "Every partner property offers scheduled transfers to and from your terminal." },
  { icon: "schedule", title: "Day-Use Rooms", desc: "Book by the hour for long layovers — no need to commit to a full night." },
  { icon: "event_available", title: "Flexible Cancellation", desc: "Flight plans change. Cancel free up to check-in on most rooms." },
  { icon: "bolt", title: "Instant Confirmation", desc: "No waiting on emails — your booking voucher is ready the moment you pay." },
];

export default async function AboutUsPage() {
  const { hotels } = await getHotelsList();

  return (
    <>
      <Header />

      <main className="mt-14 mb-16 md:mb-0">
        {/* Hero — split layout */}
        <section className="max-w-7xl mx-auto px-container-margin py-xl grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary-container/20 text-primary-container px-3 py-1.5 rounded-full mb-md">
              <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
              <span className="font-label-bold text-label-bold">Built for Transit</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary mb-md leading-tight">
              The Smart Traveler&apos;s Choice
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
              Our mission is simple: stress-free transit. We connect weary travelers with immediate, comfortable
              rest right at Dubai International Airport (DXB) and Al Maktoum International (DWC) — no long
              commutes, just seamless hospitality when you need it most.
            </p>
            <div className="flex items-center gap-lg">
              <div>
                <p className="font-headline-lg text-headline-lg text-primary">{hotels.length}+</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Partner Hotels</p>
              </div>
              <div className="h-10 w-px bg-outline-variant" />
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
                DXB &amp; DWC Coverage
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md h-72 md:h-96">
            <img
              className="w-full h-full object-cover"
              alt="Dubai airport terminal at night"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8wx1TjIayPDJfk_xUtnTPQgjcAPYNzg01Ij2pbPOvVP1oD0lhUkhIL_hYJNX0wetJJjgqLKWxfI3EBqoUa7wh0wedPmwUm-ozoDxIbNN3irAhiHwF3LoOJ43xBjJcQaIDW7XP_9GCL3bqfy8q9xWnfhjZmYltxqWs99NkPWgu_Jlj8L6hDno6_Suz1X5OU8-6vs1mI7Ilk7XROPKF-yaHFvKmad945y7lvGTkeSSTtzB0P501HdZ7"
            />
          </div>
        </section>

        {/* Mission narrative — image + text, reversed */}
        <section className="bg-surface-container-low py-xl">
          <div className="max-w-7xl mx-auto px-container-margin grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            <div className="rounded-2xl overflow-hidden shadow-md h-72 md:h-96 order-2 md:order-1">
              <img
                className="w-full h-full object-cover"
                alt="Sleeping pod for airport transit"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2aTRXL42ghpsb-OOuOGbXaujAmXV5mn_PYxWPvRNFCwEGOFPL4LHIpE653C5NFhujemGciRVWSm5xIdU6VszseDbdh2b3rOxKrSNjLUF6k7_gkKoqcxF3Ny8k9RQFN-eEHHvcckFKAZS5eQMx_kmwS549LwIY6wEUkwkwRysdv9LBw3oe-aixGbDVYm3ICG1D6HDIRPDX609pGja0GHFcn5nW8yxWJxemNwTd9h0MaiHB36ectb86"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Why We Built This</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                Long layovers, red-eye arrivals, and last-minute delays don&apos;t come with a manual. We built
                AirportHotelDubai after one too many nights spent searching for a room five minutes from a gate,
                only to find pages of hotels with no idea how close they actually were.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                So we built a platform that leads with the one thing that actually matters when you&apos;re
                traveling: how fast can you get there, and how fast can you leave. Everything else — free
                shuttles, day-use rooms, instant confirmation — follows from that.
              </p>
            </div>
          </div>
        </section>

        {/* Value props grid */}
        <section className="max-w-7xl mx-auto px-container-margin py-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-lg text-center">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg text-center flex flex-col items-center gap-sm">
                <div className="w-14 h-14 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined">{v.icon}</span>
                </div>
                <h3 className="font-label-bold text-label-bold text-primary">{v.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
       <section className="bg-primary-container py-xl px-container-margin">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="font-display-lg text-display-lg text-on-primary mb-md">Ready for Your Next Layover?</h2>
    <p className="font-body-lg text-body-lg text-tertiary-fixed mb-lg w-full max-w-xl mx-auto">
      Find a room near your terminal in under two minutes.
    </p>
    <Link
      href="/hotels"
      className="inline-block bg-secondary-container text-on-secondary-container h-14 px-xl rounded-lg font-label-bold text-label-bold active:scale-95 transition-transform leading-[3.5rem]"
    >
      Browse Hotels
    </Link>
  </div>
</section>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}