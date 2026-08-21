import Image from "next/image";
import Link from "next/link";

import ArticleNavigation from "@/components/ArticleNavigation";
import ArticleShare from "@/components/ArticleShare";
import ReadingProgress from "@/components/ReadingProgress";
import { supabase } from "@/lib/supabase";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  tags: string | null;
  content: string;
  cover_image: string | null;
  editor_pick: boolean;
  status: string;
  created_at: string;
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /*
   * Get the current article
   */
  const { data: article, error } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, category, tags, content, cover_image, editor_pick, status, created_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Article fetch error:", error);
  }

  /*
   * Article not found
   */
  if (!article) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-3xl font-bold text-gray-900">
          Article not found
        </h1>

        <p className="mt-4 text-gray-600">
          The article you're looking for doesn't exist or hasn't
          been published yet.
        </p>

        <Link
          href="/articles"
          className="mt-6 inline-block bg-yellow-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-yellow-700"
        >
          Back to Articles
        </Link>
      </main>
    );
  }

  /*
   * Get published articles for navigation
   * and similar articles.
   */
  const { data: allArticles } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, category, tags, content, cover_image, editor_pick, status, created_at"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const publishedArticles = (allArticles || []) as Article[];

  /*
   * Find current article position.
   */
  const currentIndex = publishedArticles.findIndex(
    (item) => item.id === article.id
  );

  /*
   * Previous and next articles.
   */
  const previousArticle =
    currentIndex >= 0 &&
    currentIndex < publishedArticles.length - 1
      ? publishedArticles[currentIndex + 1]
      : null;

  const nextArticle =
    currentIndex > 0
      ? publishedArticles[currentIndex - 1]
      : null;

  /*
   * Similar articles.
   */
  const similarArticles = publishedArticles
    .filter(
      (item) =>
        item.category === article.category &&
        item.id !== article.id
    )
    .slice(0, 4);

  /*
   * Reading time.
   */
  const plainText = article.content.replace(/<[^>]*>/g, " ");
  const wordCount = plainText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const readingTime = Math.max(
    1,
    Math.ceil(wordCount / 200)
  );

  /*
   * Format date.
   */
  const formattedDate = new Date(
    article.created_at
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <ReadingProgress />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">

        {/* ARTICLE HEADER */}

        <header className="mx-auto max-w-4xl">

          <span className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
            {article.category || "Insights"}
          </span>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-gray-900 md:text-6xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-6 text-xl leading-relaxed text-gray-600">
              {article.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Capital Lens</span>

            <span>·</span>

            <span>{formattedDate}</span>

            <span>·</span>

            <span>{readingTime} min read</span>
          </div>

        </header>

        {/* HERO IMAGE */}

        {article.cover_image && (
          <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/8] w-full">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* ARTICLE CONTENT + SIMILAR ARTICLES */}

        <div className="mt-16 grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">

          {/* SIMILAR ARTICLES */}

          <aside className="order-2 lg:order-1">

            <div className="lg:sticky lg:top-24">

              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Similar Articles
              </h2>

              <div className="mt-6 space-y-8">

                {similarArticles.length > 0 ? (
                  similarArticles.map((item) => (
                    <Link
                      key={item.id}
                      href={`/articles/${item.slug}`}
                      className="group block"
                    >

                      {/* IMAGE */}

                      {item.cover_image && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                          <Image
                            src={item.cover_image}
                            alt={item.title}
                            fill
                            sizes="240px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {/* CATEGORY */}

                      <span className="mt-4 block text-xs font-medium uppercase tracking-wide text-yellow-600">
                        {item.category || "Insights"}
                      </span>

                      {/* TITLE */}

                      <h3 className="mt-2 font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-yellow-600">
                        {item.title}
                      </h3>

                      {/* EXCERPT */}

                      {item.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
                          {item.excerpt}
                        </p>
                      )}

                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No similar articles yet.
                  </p>
                )}

              </div>

            </div>

          </aside>

          {/* MAIN ARTICLE */}

          <article className="order-1 min-w-0 lg:order-2">

            <div
  className="article-content"
  dangerouslySetInnerHTML={{
    __html: article.content,
  }}
/>

            {/* TAGS */}

            {article.tags && (
              <div className="mt-12 flex flex-wrap gap-2 border-t border-gray-200 pt-8">
                {article.tags
                  .split(",")
                  .map((tag: string) => tag.trim())
                  .filter(Boolean)
                  .map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            )}

            {/* SHARE */}

            <ArticleShare title={article.title} />

            {/* ARTICLE NAVIGATION */}

            <div className="mt-16 border-t border-gray-200 pt-10">
              <ArticleNavigation
                previous={previousArticle}
                next={nextArticle}
              />
            </div>

          </article>

        </div>

      </main>
    </>
  );
}