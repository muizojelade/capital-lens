"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Article = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  status: string;
  editor_pick: boolean;
  created_at: string;
};

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * =========================
   * LOAD ARTICLES
   * =========================
   */

  async function loadArticles() {
    setLoading(true);

    const { data, error } = await supabase
      .from("articles")
      .select(
        "id, title, slug, category, status, editor_pick, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load articles:", error);
      setArticles([]);
    } else {
      setArticles((data || []) as Article[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  /*
   * =========================
   * ARTICLE COUNTS
   * =========================
   */

  const totalArticles = articles.length;

  const publishedArticles = articles.filter(
    (article) => article.status === "published"
  ).length;

  const draftArticles = articles.filter(
    (article) => article.status === "draft"
  ).length;

  const editorPicks = articles.filter(
    (article) => article.editor_pick
  ).length;

  /*
   * =========================
   * DATE FORMAT
   * =========================
   */

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /*
   * =========================
   * UI
   * =========================
   */

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#171717]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

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

        {/* MAIN */}

        <section className="min-w-0 flex-1">

          {/* HEADER */}

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

          {/* CONTENT */}

          <div className="p-6 md:p-10">

            {/* PAGE HEADING */}

            <div className="mb-8">
              <h1 className="text-2xl font-semibold">
                All Articles
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your published stories and drafts.
              </p>
            </div>

            {/* STATS */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* TOTAL */}

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-sm text-gray-500">
                  Total Articles
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {loading ? "—" : totalArticles}
                </p>
              </div>

              {/* PUBLISHED */}

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-sm text-gray-500">
                  Published
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {loading ? "—" : publishedArticles}
                </p>
              </div>

              {/* DRAFTS */}

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-sm text-gray-500">
                  Drafts
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {loading ? "—" : draftArticles}
                </p>
              </div>

              {/* EDITOR PICKS */}

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-sm text-gray-500">
                  Editor&apos;s Picks
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {loading ? "—" : editorPicks}
                </p>
              </div>

            </div>

            {/* ARTICLE LIBRARY */}

            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">

              {/* LIBRARY HEADER */}

              <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
                <div>
                  <h3 className="font-semibold">
                    Article Library
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Your articles appear here automatically.
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {loading
                    ? "Loading..."
                    : `${totalArticles} ${
                        totalArticles === 1
                          ? "Article"
                          : "Articles"
                      }`}
                </span>
              </div>

              {/* LOADING */}

              {loading && (
                <div className="px-6 py-20 text-center">
                  <p className="text-sm text-gray-500">
                    Loading articles...
                  </p>
                </div>
              )}

              {/* EMPTY */}

              {!loading && articles.length === 0 && (
                <div className="px-6 py-20 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c58a2a]/10 text-2xl">
                    ✍️
                  </div>

                  <h4 className="mt-5 text-lg font-semibold">
                    No articles yet
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    You haven&apos;t created any articles yet.
                    Start writing your first Capital Lens story
                    and it will appear in your article library.
                  </p>

                  <Link
                    href="/admin/articles/new"
                    className="mt-6 inline-flex rounded-xl bg-[#c58a2a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#ad751e]"
                  >
                    + Create Your First Article
                  </Link>

                </div>
              )}

              {/* ARTICLES */}

              {!loading && articles.length > 0 && (
                <div className="divide-y divide-black/10">

                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="flex flex-col gap-5 px-6 py-5 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between"
                    >

                      {/* ARTICLE INFO */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h4 className="truncate text-base font-semibold text-gray-900">
                            {article.title}
                          </h4>

                          {article.editor_pick && (
                            <span className="rounded-full bg-[#c58a2a]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#a66f17]">
                              Editor&apos;s Pick
                            </span>
                          )}

                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">

                          <span>
                            {article.category || "Insights"}
                          </span>

                          <span>•</span>

                          <span>
                            {formatDate(article.created_at)}
                          </span>

                        </div>

                      </div>

                      {/* STATUS + ACTIONS */}

                      <div className="flex shrink-0 items-center gap-3">

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                            article.status === "published"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {article.status}
                        </span>

                        <Link
  href={`/admin/articles/${article.id}/edit`}
  className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
>
  Edit
</Link>

                        {article.status === "published" && (
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80"
                          >
                            View
                          </Link>
                        )}

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}