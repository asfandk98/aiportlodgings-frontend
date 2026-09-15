"use client";

import { useState } from "react";

export default function HotelGallery({
  images,
  alt,
  shuttleBadge,
}: {
  images: string[];
  alt: string;
  shuttleBadge?: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const shown = images.slice(0, 4);

  return (
    <>
      <section className="mb-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-sm h-[40vh] md:h-[60vh] rounded-xl overflow-hidden bg-surface-container-low" style={{ boxShadow: "0px 4px 12px rgba(26,43,66,0.08)" }}>
          <div className="col-span-1 md:col-span-2 md:row-span-2 relative group cursor-pointer" onClick={() => setShowAll(true)}>
            {shown[activeIndex] ? (
              <div
                className="bg-cover bg-center w-full h-full transition-transform duration-500 group-hover:scale-105"
                role="img"
                aria-label={alt}
                style={{ backgroundImage: `url('${shown[activeIndex]}')` }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container-highest text-4xl">🏨</div>
            )}
            {shuttleBadge && (
              <div className="absolute bottom-4 left-4 bg-[#E2E8F0] px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">airport_shuttle</span>
                <span className="font-label-bold text-label-bold text-primary text-xs">{shuttleBadge}</span>
              </div>
            )}
          </div>
          {[shown[1], shown[2], shown[3]].map((src, i) =>
            src ? (
              <div
                key={i}
                className={`hidden md:block relative group cursor-pointer overflow-hidden ${i === 2 ? "col-span-2" : "col-span-1"} row-span-1`}
                onClick={() => setShowAll(true)}
              >
                <div className="bg-cover bg-center w-full h-full transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${src}')` }} />
                {i === 2 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-surface text-primary font-label-bold px-4 py-2 rounded-lg" style={{ boxShadow: "0px 4px 12px rgba(26,43,66,0.08)" }}>
                      View All {images.length} Photos
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div key={i} className="hidden md:block bg-surface-container-highest" />
            )
          )}
        </div>

        <div className="md:hidden mt-sm flex justify-between items-center px-2">
          <div className="flex gap-1">
            {shown.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full ${i === activeIndex ? "bg-primary-container" : "bg-outline-variant"}`}
              />
            ))}
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {activeIndex + 1} of {images.length}
          </span>
        </div>
      </section>

      {showAll && (
        <div className="fixed inset-0 bg-black/90 z-[100] overflow-y-auto p-6" onClick={() => setShowAll(false)}>
          <button className="fixed top-6 right-6 text-white material-symbols-outlined text-3xl" onClick={() => setShowAll(false)}>
            close
          </button>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 py-16">
            {images.map((src, i) => (
              <img key={i} src={src} alt={`${alt} ${i + 1}`} className="w-full rounded-lg" onClick={(e) => e.stopPropagation()} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}