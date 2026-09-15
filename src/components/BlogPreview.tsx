import Link from "next/link";
import { getPublicBlogPosts } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

export default async function BlogPreview() {
  const posts = (await getPublicBlogPosts()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-surface-container-low px-container-margin py-[72px]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-xl flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-secondary-container" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Travel Inspiration
              </span>
            </div>

            <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary-container md:font-headline-lg md:text-headline-lg">
              Layover &amp; Travel Guides
            </h2>

            <p className="mt-3 max-w-2xl text-body-md leading-7 text-on-surface-variant">
              Helpful tips, airport guides and travel inspiration to make
              your journey through Dubai easier and more comfortable.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-primary-container px-5 text-sm font-semibold text-primary-container transition-all duration-200 hover:bg-primary-container hover:text-white"
          >
            View All Guides

            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => {
            const image =
              toAbsoluteImageUrl(post.image_url) ??
              toAbsoluteImageUrl(post.image) ??
              toAbsoluteImageUrl(post.featured_image);

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug ?? post.id}`}
                className="group overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-[0_6px_25px_rgba(11,29,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-secondary-container/60 hover:shadow-[0_16px_40px_rgba(11,29,58,0.13)]"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-container-highest">
                      <span className="material-symbols-outlined text-5xl text-primary-container/30">
                        article
                      </span>
                    </div>
                  )}

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

                  {/* Read Guide Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-primary-container/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    <span className="material-symbols-outlined text-[16px]">
                      menu_book
                    </span>
                    Travel Guide
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="line-clamp-2 font-headline-md text-headline-md font-bold text-primary-container transition-colors duration-200 group-hover:text-secondary">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-on-surface-variant">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Read More */}
                  <div className="mt-5 flex items-center justify-between border-t border-outline-variant/50 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Read Guide
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container/15 text-secondary transition-all duration-200 group-hover:bg-secondary-container group-hover:text-on-secondary-container">
                      <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}