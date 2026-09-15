import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getPublicBlogPost, getPublicBlogPosts } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

function getCategory(post: { category?: { name?: string } | string }): string {
  if (typeof post.category === "string") return post.category;
  return post.category?.name ?? "Guide";
}

function getImage(post: { image?: string; image_url?: string; featured_image?: string }): string | null {
  return (
    toAbsoluteImageUrl(post.image_url) ??
    toAbsoluteImageUrl(post.image) ??
    toAbsoluteImageUrl(post.featured_image) ??
    null
  );
}

function fmtDate(raw?: string): string {
  if (!raw) return "";
  return new Date(raw).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);
  if (!post) return { title: "Guide Not Found | AirportHotelDubai" };
  return {
    title: post.meta_title || `${post.title} | AirportHotelDubai`,
    description: post.meta_description || post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);
  if (!post) return notFound();

  const allPosts = await getPublicBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug && getCategory(p) === getCategory(post)).slice(0, 3);

  const tags = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <>
      <Header />

      <main className="flex-grow mt-14 md:mt-20 mb-16 md:mb-0 w-full max-w-4xl mx-auto px-container-margin py-xl">
        <div className="mb-lg">
          <Link href="/blog" className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Guides
          </Link>
        </div>

        <div className="text-secondary font-label-bold text-label-bold uppercase tracking-wider mb-sm">
          {getCategory(post)}
        </div>
        <h1 className="font-display-lg text-display-lg text-primary mb-md leading-tight">{post.title}</h1>
        {fmtDate(post.publish_date ?? post.created_at) && (
          <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-lg">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            {fmtDate(post.publish_date ?? post.created_at)}
          </div>
        )}

        {getImage(post) && (
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-xl">
            <img src={getImage(post)!} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <article
          className="font-body-lg text-body-lg text-on-surface leading-relaxed
            [&>h2]:font-headline-md [&>h2]:text-headline-md [&>h2]:text-primary [&>h2]:mt-xl [&>h2]:mb-md
            [&>p]:mb-md [&>ul]:mb-md [&>ul]:list-disc [&>ul]:pl-6 [&>li]:mb-2"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />

        {tags.length > 0 && (
          <div className="mt-xl pt-lg border-t border-outline-variant flex flex-wrap gap-sm">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-outline-variant text-on-surface-variant font-label-sm text-label-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-xl pt-xl border-t border-outline-variant">
            <h2 className="font-headline-md text-headline-md text-primary mb-lg">More {getCategory(post)} Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug ?? r.id}`}
                  className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="h-32 overflow-hidden">
                    {getImage(r) ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={getImage(r)!}
                        alt={r.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container-highest text-2xl">📝</div>
                    )}
                  </div>
                  <div className="p-md">
                    <h3 className="font-headline-md text-[16px] text-primary group-hover:text-secondary-container transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}