import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/lib/articles";

export default async function InsightCards() {
  const articles = (await getArticles()).slice(0, 3);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADER */}

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
            Capital Lens Research
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Latest Financial Insights
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            Explore our latest perspectives on markets, investing,
            economics, and the forces shaping global capital.
          </p>
        </div>

        {/* ARTICLES */}

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* IMAGE */}

              {article.image ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
                </div>
              ) : (
                <div className="flex aspect-[16/10] w-full items-center justify-center bg-gray-100">
                  <span className="text-sm font-medium text-gray-400">
                    Capital Lens
                  </span>
                </div>
              )}

              {/* CONTENT */}

              <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-yellow-600">
                  {article.category || "Insights"}
                </span>

                <h3 className="mt-3 text-xl font-semibold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-orange-500">
                  {article.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-gray-600">
                  {article.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span>{article.author}</span>

                  <span>·</span>

                  <span>
                    {new Date(article.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>

                  {article.readingTime && (
                    <>
                      <span>·</span>

                      <span>
                        {article.readingTime} min read
                      </span>
                    </>
                  )}
                </div>

                <span className="mt-6 inline-block text-sm font-semibold text-yellow-600 transition-transform duration-300 group-hover:translate-x-1">
                  Read Article →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* EMPTY STATE */}

        {articles.length === 0 && (
          <div className="mt-12 py-16 text-center">
            <p className="text-gray-500">
              No published articles yet.
            </p>
          </div>
        )}

        {/* VIEW ALL */}

        <div className="mt-12 text-center">
          <Link
            href="/articles"
            className="inline-flex border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-yellow-600 hover:text-yellow-600"
          >
            View All Insights →
          </Link>
        </div>
      </div>
    </section>
  );
}