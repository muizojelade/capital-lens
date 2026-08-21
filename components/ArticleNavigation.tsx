import Image from "next/image";
import Link from "next/link";

type ArticleNavigationArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_image: string | null;
};

type ArticleNavigationProps = {
  previous: ArticleNavigationArticle | null;
  next: ArticleNavigationArticle | null;
};

export default function ArticleNavigation({
  previous,
  next,
}: ArticleNavigationProps) {
  return (
    <nav className="grid gap-6 sm:grid-cols-2">

      {/* PREVIOUS */}

      {previous ? (
        <Link
          href={`/articles/${previous.slug}`}
          className="group overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500"
        >
          {previous.cover_image && (
            <div className="relative aspect-[16/8] w-full overflow-hidden">
              <Image
                src={previous.cover_image}
                alt={previous.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          <div className="p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              ← Previous Article
            </span>

            {previous.category && (
              <span className="mt-3 block text-xs font-medium uppercase tracking-wide text-yellow-600">
                {previous.category}
              </span>
            )}

            <h3 className="mt-2 text-xl font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-yellow-600">
              {previous.title}
            </h3>

            {previous.excerpt && (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                {previous.excerpt}
              </p>
            )}
          </div>
        </Link>
      ) : (
        <div />
      )}

      {/* NEXT */}

      {next ? (
        <Link
          href={`/articles/${next.slug}`}
          className="group overflow-hidden border border-gray-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500 sm:text-right"
        >
          {next.cover_image && (
            <div className="relative aspect-[16/8] w-full overflow-hidden">
              <Image
                src={next.cover_image}
                alt={next.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          <div className="p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Next Article →
            </span>

            {next.category && (
              <span className="mt-3 block text-xs font-medium uppercase tracking-wide text-yellow-600">
                {next.category}
              </span>
            )}

            <h3 className="mt-2 text-xl font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-yellow-600">
              {next.title}
            </h3>

            {next.excerpt && (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                {next.excerpt}
              </p>
            )}
          </div>
        </Link>
      ) : (
        <div />
      )}

    </nav>
  );
}