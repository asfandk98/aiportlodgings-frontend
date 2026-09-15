import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import FeaturedHotels from "@/components/FeaturedHotels";
import HowItWorks from "@/components/HowItWorks";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getHotels } from "@/lib/api";

export default async function Home() {
  const { featured } = await getHotels();

  return (
    <>
      <Header />

      <main className="mt-14">
        {/* =========================================================
            HERO
        ========================================================= */}
        <Hero />

        {/* =========================================================
            TRUST STRIP
        ========================================================= */}
        <TrustStrip />

        {/* =========================================================
            FEATURED HOTELS
        ========================================================= */}
        <FeaturedHotels hotels={featured} />

        {/* =========================================================
            HOW IT WORKS
        ========================================================= */}
        <HowItWorks />

        {/* =========================================================
            AIRPORT LOCATION
        ========================================================= */}
        <section className="bg-background px-container-margin py-[72px]">
          <div className="mx-auto max-w-7xl">
            {/* Section heading */}
            <div className="mb-8 text-center">
              <div className="mb-3 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-secondary-container" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                  Prime Locations
                </span>

                <span className="h-px w-8 bg-secondary-container" />
              </div>

              <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary-container md:font-headline-lg md:text-headline-lg">
                Stay Close to Your Airport
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-body-md leading-7 text-on-surface-variant">
                Our partner hotels are conveniently located near Dubai
                International Airport and Al Maktoum International Airport.
              </p>
            </div>

            {/* =====================================================
                LOCATION IMAGE
            ===================================================== */}
            <div className="group relative h-[360px] w-full overflow-hidden rounded-2xl shadow-[0_10px_35px_rgba(11,29,58,0.12)] md:h-[420px]">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8wx1TjIayPDJfk_xUtnTPQgjcAPYNzg01Ij2pbPOvVP1oD0lhUkhIL_hYJNX0wetJJjgqLKWxfI3EBqoUa7wh0wedPmwUm-ozoDxIbNN3irAhiHwF3LoOJ43xBjJcQaIDW7XP_9GCL3bqfy8q9xWnfhjZmYltxqWs99NkPWgu_Jlj8L6hDno6_Suz1X5OU8-6vs1mI7Ilk7XROPKF-yaHFvKmad945y7lvGTkeSSTtzB0P501HdZ7')",
                }}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container/95 via-primary-container/30 to-transparent" />

              {/* =================================================
                  LOCATION INFORMATION
              ================================================= */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="w-full max-w-3xl">
                  {/* Badge */}
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-primary-container/80 px-4 py-2 text-white backdrop-blur-md">
                    <span className="material-symbols-outlined text-[18px] text-secondary-container">
                      flight
                    </span>

                    <span className="text-xs font-semibold">
                      Dubai Airport Hotels
                    </span>
                  </div>

                  {/* Heading */}
                  <h3 className="text-2xl font-bold leading-tight text-white md:text-4xl">
                    Hotels Within 15 Minutes of Your Terminal
                  </h3>

                  {/* Description */}
                  <p className="mt-3 w-full max-w-2xl text-sm leading-6 text-white/90 md:text-base">
                    Convenient stays for overnight layovers, early morning
                    flights, business trips and short airport stays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TESTIMONIALS
        ========================================================= */}
        <section className="bg-surface-container-low px-container-margin py-[72px]">
          <div className="mx-auto max-w-7xl">
            <div className="mb-xl text-center">
              <div className="mb-3 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-secondary-container" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                  Guest Experiences
                </span>

                <span className="h-px w-8 bg-secondary-container" />
              </div>

              <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary-container md:font-headline-lg md:text-headline-lg">
                What Travelers Say
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-body-md text-on-surface-variant">
                Real experiences from travelers who chose a convenient stay
                close to Dubai&apos;s airports.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* =================================================
                  TESTIMONIAL 1
              ================================================= */}
              <div className="group rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-[0_6px_25px_rgba(11,29,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(11,29,58,0.11)] md:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="material-symbols-outlined text-[18px] text-secondary-container"
                        style={{
                          fontVariationSettings:
                            "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20",
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <span className="material-symbols-outlined text-3xl text-secondary-container/30">
                    format_quote
                  </span>
                </div>

                <p className="font-body-lg text-body-lg italic leading-8 text-on-surface">
                  &quot;Landed at 2am, had a room booked by 2:15am. Life
                  saver!&quot;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-outline-variant/50 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-white">
                    SJ
                  </div>

                  <div>
                    <p className="font-label-bold text-label-bold font-bold text-primary-container">
                      Sarah J.
                    </p>

                    <p className="text-xs text-on-surface-variant">
                      Transit Passenger
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  TESTIMONIAL 2
              ================================================= */}
              <div className="group rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-[0_6px_25px_rgba(11,29,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(11,29,58,0.11)] md:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="material-symbols-outlined text-[18px] text-secondary-container"
                        style={{
                          fontVariationSettings:
                            "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20",
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <span className="material-symbols-outlined text-3xl text-secondary-container/30">
                    format_quote
                  </span>
                </div>

                <p className="font-body-lg text-body-lg italic leading-8 text-on-surface">
                  &quot;Perfect for a 6-hour layover. The shuttle was right
                  where they said.&quot;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-outline-variant/50 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-white">
                    MR
                  </div>

                  <div>
                    <p className="font-label-bold text-label-bold font-bold text-primary-container">
                      Michael R.
                    </p>

                    <p className="text-xs text-on-surface-variant">
                      Business Traveler
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            BLOG
        ========================================================= */}
        <BlogPreview />

        {/* =========================================================
    FINAL CTA
========================================================= */}
<section className="relative w-full overflow-hidden bg-primary-container px-6 py-20 text-center md:px-8 md:py-24">
  {/* Decorative elements */}
  <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-secondary-container/10 blur-3xl" />

  <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

  {/* CTA Content */}
  <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center">
    
    {/* Small heading */}
    <div className="mb-5 flex w-full items-center justify-center gap-3">
      <span className="h-px w-10 shrink-0 bg-secondary-container" />

      <span className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-secondary-container">
        Your Stay Starts Here
      </span>

      <span className="h-px w-10 shrink-0 bg-secondary-container" />
    </div>

    {/* Main heading */}
    <h2 className="w-full text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
      Landing Soon?
      <span className="mt-2 block text-secondary-container">
        Book Your Room Now.
      </span>
    </h2>

    {/* Description */}
    <p className="mx-auto mt-6 w-full max-w-2xl text-base leading-7 text-white/75 md:text-lg md:leading-8">
      Find comfortable hotels near Dubai&apos;s airports and make your
      layover or overnight stay effortless.
    </p>

    {/* Button */}
    <a
      href="/hotels"
      className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-secondary-container px-8 font-bold text-on-secondary-container shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
    >
      <span>Find a Room</span>

      <span className="material-symbols-outlined text-[20px]">
        arrow_forward
      </span>
    </a>
  </div>
</section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <Footer />

      {/* =========================================================
          MOBILE BOTTOM NAVIGATION
      ========================================================= */}
      <BottomNav />
    </>
  );
}