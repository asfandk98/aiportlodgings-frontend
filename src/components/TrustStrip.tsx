export default function TrustStrip() {
  const items = [
    {
      icon: "check_circle",
      label: "Free Cancellation",
      description: "Flexible booking options",
    },
    {
      icon: "airport_shuttle",
      label: "Free Airport Shuttle",
      description: "Easy terminal transfers",
    },
    {
      icon: "bolt",
      label: "Instant Confirmation",
      description: "Book in just a few clicks",
    },
  ];

  return (
    <section className="border-b border-outline-variant/60 bg-surface-container-lowest px-container-margin">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`flex flex-1 items-center justify-center gap-4 px-5 py-5 md:py-6 ${
              index !== 0 ? "border-t border-outline-variant/50 md:border-l md:border-t-0" : ""
            }`}
          >
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-container/15">
              <span
                className="material-symbols-outlined text-[23px] text-secondary-container"
                style={{
                  fontVariationSettings:
                    "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
                }}
              >
                {item.icon}
              </span>
            </div>

            {/* Text */}
            <div>
              <p className="font-label-bold text-label-bold font-bold text-primary-container">
                {item.label}
              </p>

              <p className="mt-0.5 text-xs text-on-surface-variant">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}