
"use client";

import Link from "next/link";

export default function AdminArticles() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#171717]">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-black/10 bg-white p-6 md:block">
          <div className="mb-10">
            <h1 className="text-xl font-bold tracking-tight">
              Capital<span className="text-[#c58a2a]">Lens</span>
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Admin Dashboard
            </p>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/articles"
              className="block rounded-xl bg-[#c58a2a]/10 px-4 py-3 text-sm font-medium text-[#a66f17]"
            >
              Articles
            </Link>

            <Link
              href="/admin/articles/new"
              className="block rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-100"
            >
              New Article
            </Link>
          </nav>

          <div className="mt-10">
            <Link
              href="/"
              className="text-sm text-gray-500 transition hover:text-black"
            >
              ← View Website
            </Link>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">

          {/* Header */}
          <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-5 md:px-10">
            <div>
              <h2 className="text-xl font-semibold">
                Articles
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Create and manage your articles.
              </p>
            </div>

            <Link
              href="/admin/articles/new"
              className="rounded-xl bg-[#c58a2a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#ad751e]"
            >
              + New Article
            </Link>
          </header>

          {/* Content */}
          <div className="p-6 md:p-10">

            {/* Page heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">
                All Articles
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your published stories and drafts.
              </p>
            </div>

            {/* Articles container */}
            <div className="rounded-2xl border border-black/10 bg-white">

              <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
                <div>
                  <h3 className="font-semibold">
                    Article Library
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Your articles will appear here.
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                  0 Articles
                </span>
              </div>

              {/* Empty state */}
              <div className="px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c58a2a]/10 text-2xl">
                  ✍️
                </div>

                <h4 className="mt-5 text-lg font-semibold">
                  No articles yet
                </h4>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  You haven't created any articles yet. Start writing your
                  first Capital Lens story and it will appear in your
                  article library.
                </p>

                <Link
                  href="/admin/articles/new"
                  className="mt-6 inline-flex rounded-xl bg-[#c58a2a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#ad751e]"
                >
                  + Create Your First Article
                </Link>

              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}
