import Link from "next/link";

export default function Footer() {
  const categories = [
    "Markets",
    "Investing",
    "Economy",
    "Crypto",
    "Commodities",
    "Finance 101",
  ];

  return (
    <footer className="border-t border-gray-200 bg-gray-950 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
        {/* BRAND */}

        <div>
          <Link
            href="/"
            className="inline-block text-2xl font-bold transition-opacity hover:opacity-80"
          >
            Capital <span className="text-yellow-600">Lens</span>
          </Link>

          <p className="mt-4 max-w-sm leading-relaxed text-gray-400">
            Understanding markets, investing, and the global economy
            through clear financial insights.
          </p>
        </div>

        {/* EXPLORE */}

        <div>
          <h3 className="font-semibold text-white">
            Explore
          </h3>

          <ul className="mt-4 space-y-3">
            <li>
              <Link
                href="/"
                className="text-gray-400 transition-colors hover:text-yellow-500"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/articles"
                className="text-gray-400 transition-colors hover:text-yellow-500"
              >
                Articles
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                className="text-gray-400 transition-colors hover:text-yellow-500"
              >
                About
              </Link>
            </li>

            <li>
              <a
                href="mailto:muizojelade@gmail.com"
                className="text-gray-400 transition-colors hover:text-yellow-500"
              >
                Contact
              </a>
            </li>

            <li>
              <Link
                href="/articles"
                className="text-gray-400 transition-colors hover:text-yellow-500"
              >
                Newsletter
              </Link>
            </li>
          </ul>
        </div>

        {/* CATEGORIES */}

        <div>
          <h3 className="font-semibold text-white">
            Categories
          </h3>

          <ul className="mt-4 space-y-3">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/articles?category=${encodeURIComponent(
                    category
                  )}`}
                  className="text-gray-400 transition-colors hover:text-yellow-500"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTTOM */}

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-gray-800 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 Capital Lens | Genius Brainer. All rights reserved.
        </p>

        <div className="flex gap-5">
          <Link
            href="/privacy"
            className="transition-colors hover:text-yellow-500"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="transition-colors hover:text-yellow-500"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}