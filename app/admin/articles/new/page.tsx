import Link from "next/link";
import ArticleEditor from "./ArticleEditor";

export default function NewArticlePage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#171717]">

      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

          <div>
            <Link
              href="/admin/articles"
              className="text-sm text-gray-500 transition hover:text-black"
            >
              ← Back to Articles
            </Link>

            <h1 className="mt-3 text-2xl font-semibold">
              Create New Article
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create and publish a new story on Capital Lens.
            </p>
          </div>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
        <ArticleEditor />
      </div>

    </main>
  );
}