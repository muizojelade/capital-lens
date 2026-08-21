import { getArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import ArticleSearch from "@/components/ArticleSearch";
import Link from "next/link";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}) {
  const articles = await getArticles();

  const { category, search } = await searchParams;

  const searchTerm = search?.trim().toLowerCase() || "";

  const filteredArticles = articles.filter((article) => {
    const articleCategory = article.category || "";

    const matchesCategory = category
      ? articleCategory.toLowerCase() === category.toLowerCase()
      : true;

    const matchesSearch = searchTerm
      ? article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm) ||
        articleCategory.toLowerCase().includes(searchTerm) ||
        article.author.toLowerCase().includes(searchTerm) ||
        article.tags?.toLowerCase().includes(searchTerm)
      : true;

    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    "Markets",
    "Investing",
    "Economy",
    "Crypto",
    "Commodities",
    "Finance 101",
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* HEADER */}

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
            Capital Lens Research
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Market Insights & Analysis
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            Explore financial research, investment perspectives, and
            market analysis from Capital Lens.
          </p>
        </div>

        {/* SEARCH */}

        <div className="mx-auto mt-10 max-w-2xl">
          <ArticleSearch />
        </div>

        {/* CATEGORY FILTERS */}

        <div className="mb-12 mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((item) => {
            const isActive =
              item === "All"
                ? !category
                : category?.toLowerCase() === item.toLowerCase();

            const params = new URLSearchParams();

            if (item !== "All") {
              params.set("category", item);
            }

            if (searchTerm) {
              params.set("search", searchTerm);
            }

            const query = params.toString();

            return (
              <Link
                key={item}
                href={
                  query
                    ? `/articles?${query}`
                    : "/articles"
                }
                className={`border px-5 py-2 text-sm transition-all duration-300 ${
                  isActive
                    ? "border-yellow-600 bg-yellow-600 text-white"
                    : "border-gray-300 text-gray-600 hover:border-yellow-600 hover:text-yellow-600"
                }`}
              >
                {item}
              </Link>
            );
          })}
        </div>

        {/* SEARCH RESULT MESSAGE */}

        {searchTerm && (
          <div className="mb-8">
            <p className="text-sm text-gray-500">
              {filteredArticles.length > 0
                ? `Showing ${filteredArticles.length} result${
                    filteredArticles.length === 1
                      ? ""
                      : "s"
                  } for `
                : "No results for "}

              <span className="font-semibold text-gray-900">
                "{search}"
              </span>
            </p>
          </div>
        )}

        {/* ARTICLES */}

        {filteredArticles.length > 0 ? (
          <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}
          </section>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-md">
              <div className="text-5xl">⌕</div>

              <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                No articles found
              </h2>

              <p className="mt-3 text-gray-600">
                We couldn't find any articles matching your
                search. Try another keyword or browse the
                categories.
              </p>

              <Link
                href="/articles"
                className="mt-6 inline-block bg-yellow-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-yellow-700"
              >
                View All Articles
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}