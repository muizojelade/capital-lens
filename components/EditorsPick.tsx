import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/lib/articles";

export default async function EditorsPick() {
  const articles = await getArticles();

  const featuredArticle = articles.find(
    (article) => article.editor_pick === true
  );

  if (!featuredArticle) {
    return null;
  }

  const formattedDate = new Date(
    featuredArticle.date
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* ARTICLE IMAGE */}

        <div className="relative h-80 overflow-hidden rounded-3xl bg-yellow-50 md:h-[420px]">
          {featuredArticle.image ? (
            <Image
              src={featuredArticle.image}
              alt={featuredArticle.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="text-7xl">📈</div>

                <p className="mt-4 text-gray-500">
                  Featured Financial Analysis
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ARTICLE CONTENT */}

        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
            Editor&apos;s Pick
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {featuredArticle.title}
          </h2>

          {featuredArticle.description && (
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              {featuredArticle.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{featuredArticle.author}</span>

            <span>·</span>

            <span>{formattedDate}</span>

            {featuredArticle.readingTime && (
              <>
                <span>·</span>

                <span>
                  {featuredArticle.readingTime} min read
                </span>
              </>
            )}
          </div>

          <Link
            href={`/articles/${featuredArticle.slug}`}
            className="mt-7 inline-block bg-yellow-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-yellow-700"
          >
            Read Full Article →
          </Link>
        </div>
      </div>
    </section>
  );
}