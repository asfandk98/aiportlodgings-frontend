export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "search",
      title: "Search Your Stay",
      desc: "Enter your airport terminal, travel dates and number of guests to find available hotels.",
    },
    {
      number: "02",
      icon: "hotel",
      title: "Choose Your Hotel",
      desc: "Compare nearby properties, prices, ratings and airport shuttle options in one place.",
    },
    {
      number: "03",
      icon: "check_circle",
      title: "Book With Confidence",
      desc: "Complete your reservation securely and receive your confirmation details instantly.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-primary-container px-container-margin py-[72px]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-secondary-container/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mx-auto mb-14 max-w-2xl text-center">

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-secondary-container" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-container">
              Simple &amp; Fast
            </span>

            <span className="h-px w-10 bg-secondary-container" />
          </div>

          <h2
            className="
              font-headline-lg-mobile
              text-headline-lg-mobile
              font-bold
              text-white
              md:font-headline-lg
              md:text-headline-lg
            "
          >
            Book Your Airport Stay
            <span className="block text-secondary-container">
              in 3 Easy Steps
            </span>
          </h2>

          <p className="mt-4 text-body-md leading-7 text-white/70">
            From searching to confirmation, we make finding the right
            airport hotel in Dubai simple and stress-free.
          </p>
        </div>

        {/* =====================================================
            STEPS
        ====================================================== */}
        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">

          {/* Connecting line - desktop */}
          <div
            className="
              pointer-events-none
              absolute
              left-[16.66%]
              right-[16.66%]
              top-[48px]
              hidden
              h-px
              bg-gradient-to-r
              from-secondary-container/20
              via-secondary-container
              to-secondary-container/20
              md:block
            "
          />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative flex flex-col items-center text-center"
            >

              {/* =================================================
                  ICON
              ================================================== */}
              <div className="relative z-10 mb-7">

                {/* Outer ring */}
                <div
                  className="
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-secondary-container/40
                    bg-primary-container
                    shadow-[0_0_0_8px_rgba(254,174,44,0.08)]
                    transition-all
                    duration-300
                    group-hover:border-secondary-container
                    group-hover:shadow-[0_0_0_12px_rgba(254,174,44,0.12)]
                  "
                >
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      bg-secondary-container
                      text-on-secondary-container
                      shadow-lg
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  >
                    <span className="material-symbols-outlined text-[28px]">
                      {step.icon}
                    </span>
                  </div>
                </div>

                {/* Number */}
                <div
                  className="
                    absolute
                    -right-3
                    -top-2
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-primary-container
                    bg-white
                    px-2
                    text-xs
                    font-bold
                    text-primary-container
                    shadow-md
                  "
                >
                  {step.number}
                </div>
              </div>

              {/* =================================================
                  CONTENT
              ================================================== */}
              <h3
                className="
                  font-headline-md
                  text-headline-md
                  font-bold
                  text-white
                  transition-colors
                  duration-200
                  group-hover:text-secondary-container
                "
              >
                {step.title}
              </h3>

            
              {/* Mobile connector */}
              {index < steps.length - 1 && (
                <div
                  className="
                    mt-8
                    h-10
                    w-px
                    bg-gradient-to-b
                    from-secondary-container
                    to-transparent
                    md:hidden
                  "
                />
              )}
            </div>
          ))}
        </div>

        {/* =====================================================
            TRUST MESSAGE
        ====================================================== */}
        <div
          className="
            mx-auto
            mt-14
            flex
            max-w-3xl
            flex-col
            items-center
            justify-center
            gap-4
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-6
            py-5
            text-center
            backdrop-blur-sm
            sm:flex-row
            sm:text-left
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-secondary-container
              text-on-secondary-container
            "
          >
            <span className="material-symbols-outlined">
              verified
            </span>
          </div>

          <div>
            <p className="font-semibold text-white">
              A smoother airport stay starts here.
            </p>

            <p className="mt-1 text-sm text-white/60">
              Compare hotels near DXB &amp; DWC and book your stay
              in just a few clicks.
            </p>
          </div>

          <span className="material-symbols-outlined hidden text-secondary-container sm:ml-auto sm:block">
            arrow_forward
          </span>
        </div>
      </div>
    </section>
  );
}