import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getPublicBlogPosts, type BlogPostSummary } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

export const metadata = { title: "Transit Survival Guides | AirportHotelDubai" };

function getCategory(post: BlogPostSummary): string {
  if (typeof post.category === "string") return post.category;
  return post.category?.name ?? "Guide";
}

function getImage(post: BlogPostSummary): string | null {
  return (
    toAbsoluteImageUrl(post.image_url) ??
    toAbsoluteImageUrl(post.image) ??
    toAbsoluteImageUrl(post.featured_image) ??
    null
  );
}

function fmtDate(post: BlogPostSummary): string {
  const raw = post.publish_date ?? post.created_at;
  if (!raw) return "";
  return new Date(raw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function BlogListingPage() {
  const posts = await getPublicBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Header />
      <main className="flex-1 mt-14 md:mt-20 mb-16 md:mb-0 w-full max-w-7xl mx-auto px-container-margin py-xl flex flex-col gap-xl">
        <section className="text-center md:text-left max-w-3xl mx-auto md:mx-0">
          <h1 className="font-display-lg text-display-lg text-primary mb-sm">Transit Survival Guides</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Expert tips, terminal secrets, and the best places to catch some sleep during your DXB layover.
          </p>
        </section>

        {posts.length === 0 ? (
          <p className="text-center text-on-surface-variant py-24">No guides published yet — check back soon.</p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-12 gap-md">
            {featured && (
              <Link
                href={`/blog/${featured.slug ?? featured.id}`}
                className="md:col-span-12 group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
              >
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                  {getImage(featured) ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={getImage(featured)!}
                      alt={featured.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-highest text-4xl">📝</div>
                  )}
                </div>
                <div className="w-full md:w-1/2 p-lg flex flex-col justify-center">
                  <div className="text-secondary font-label-bold text-label-bold uppercase tracking-wider mb-sm">
                    {getCategory(featured)}
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-primary mb-md group-hover:text-secondary-container transition-colors">
                    {featured.title}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-md">{featured.excerpt}</p>
                  {fmtDate(featured) && (
                    <div className="mt-auto flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      {fmtDate(featured)}
                    </div>
                  )}
                </div>
              </Link>
            )}

            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug ?? post.id}`}
                className="md:col-span-6 group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="w-full h-48 relative overflow-hidden">
                  {getImage(post) ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={getImage(post)!}
                      alt={post.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-highest text-3xl">📝</div>
                  )}
                </div>
                <div className="p-md flex flex-col flex-1">
                  <div className="text-secondary font-label-bold text-label-bold uppercase tracking-wider mb-xs">
                    {getCategory(post)}
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-sm group-hover:text-secondary-container transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md">{post.excerpt}</p>
                  {fmtDate(post) && (
                    <div className="mt-auto flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      {fmtDate(post)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}