"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function fetchArticles() {
    setLoading(true);

    const { data, error } = await supabase
      .from("articles")
      .select(
        "id, title, slug, category, status, editor_pick, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      setMessage("Failed to load articles.");
      setLoading(false);
      return;
    }

    setArticles(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  /*
   * Search + status filtering
   */
  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.slug.toLowerCase().includes(query) ||
        (article.category || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        article.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [articles, search, statusFilter]);

  /*
   * Delete article
   */
  async function handleDelete(article: Article) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${article.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(article.id);
    setMessage("");

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", article.id);

      if (error) {
        console.error("Delete article error:", error);

        setMessage(
          `Failed to delete article: ${error.message}`
        );

        return;
      }

      setArticles((current) =>
        current.filter((item) => item.id !== article.id)
      );

      setMessage("Article deleted successfully.");
    } catch (error) {
      console.error("Unexpected delete error:", error);

      setMessage(
        "Something went wrong while deleting the article."
      );
    } finally {
      setDeletingId(null);
    }
  }

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

          <div className="absolute bottom-6">
            <Link
              href="/"
              className="text-sm text-gray-500 transition hover:text-black"
            >
              ← View Website
            </Link>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1">

          {/* Header */}
          <header className="border-b border-black/10 bg-white px-6 py-5 md:px-10">
            <div className="flex items-center justify-between gap-4">

              <div>
                <h2 className="text-xl font-semibold">
                  Articles
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create and manage your Capital Lens articles.
                </p>
              </div>

              <Link
                href="/admin/articles/new"
                className="shrink-0 rounded-xl bg-[#c58a2a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#ad751e]"
              >
                + New Article
              </Link>

            </div>
          </header>

          {/* Content */}
          <div className="p-6 md:p-10">

            {/* Message */}
            {message && (
              <div className="mb-5 rounded-xl border border-black/10 bg-white px-5 py-4 text-sm text-gray-600">
                {message}
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">

              {/* Top section */}
              <div className="border-b border-black/10 px-6 py-5">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h3 className="font-semibold">
                      All Articles
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {filteredArticles.length}{" "}
                      {filteredArticles.length === 1
                        ? "article"
                        : "articles"}
                      {search || statusFilter !== "all"
                        ? " shown"
                        : ""}
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col gap-3 sm:flex-row">

                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        placeholder="Search articles..."
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black/30 sm:w-64"
                      />
                    </div>

                    {/* Status */}
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value)
                      }
                      className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black/30"
                    >
                      <option value="all">
                        All Status
                      </option>

                      <option value="published">
                        Published
                      </option>

                      <option value="draft">
                        Draft
                      </option>
                    </select>

                  </div>

                </div>

              </div>

              {/* Loading */}
              {loading && (
                <div className="px-6 py-16 text-center">
                  <p className="text-sm text-gray-500">
                    Loading articles...
                  </p>
                </div>
              )}

              {/* Empty */}
              {!loading && articles.length === 0 && (
                <div className="px-6 py-16 text-center">

                  <div className="mx-auto max-w-md">
                    <p className="text-lg font-medium">
                      No articles yet
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      You haven't created any articles yet.
                    </p>

                    <Link
                      href="/admin/articles/new"
                      className="mt-5 inline-block rounded-xl bg-[#c58a2a] px-5 py-3 text-sm font-medium text-white"
                    >
                      Create Article
                    </Link>
                  </div>

                </div>
              )}

              {/* No search results */}
              {!loading &&
                articles.length > 0 &&
                filteredArticles.length === 0 && (
                  <div className="px-6 py-16 text-center">

                    <p className="text-sm font-medium">
                      No matching articles
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filter.
                    </p>

                  </div>
                )}

              {/* Articles */}
              {!loading && filteredArticles.length > 0 && (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px]">

                    <thead>
                      <tr className="border-b border-black/10 bg-[#fafafa] text-left text-xs uppercase tracking-wide text-gray-500">

                        <th className="px-6 py-4 font-medium">
                          Article
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Category
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Status
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Created
                        </th>

                        <th className="px-6 py-4 text-right font-medium">
                          Actions
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {filteredArticles.map((article) => (
                        <tr
                          key={article.id}
                          className="border-b border-black/10 last:border-0"
                        >

                          {/* Article */}
                          <td className="px-6 py-5">

                            <div>
                              <p className="max-w-[350px] truncate text-sm font-medium">
                                {article.title}
                              </p>

                              <p className="mt-1 max-w-[350px] truncate text-xs text-gray-400">
                                /{article.slug}
                              </p>

                              {article.editor_pick && (
                                <span className="mt-2 inline-flex rounded-full bg-[#c58a2a]/10 px-2.5 py-1 text-xs font-medium text-[#a66f17]">
                                  ★ Editor&apos;s Pick
                                </span>
                              )}
                            </div>

                          </td>

                          {/* Category */}
                          <td className="px-6 py-5">

                            <span className="text-sm text-gray-600">
                              {article.category
                                ? article.category.replace(
                                    /-/g,
                                    " "
                                  )
                                : "—"}
                            </span>

                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                article.status ===
                                "published"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {article.status}
                            </span>

                          </td>

                          {/* Created */}
                          <td className="px-6 py-5">

                            <span className="text-sm text-gray-500">
                              {new Date(
                                article.created_at
                              ).toLocaleDateString()}
                            </span>

                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5">

                            <div className="flex items-center justify-end gap-2">

                              {/* Preview */}
                              <Link
                                href={`/articles/${article.slug}`}
                                target="_blank"
                                className="rounded-lg border border-black/10 px-3 py-2 text-xs font-medium transition hover:bg-gray-50"
                              >
                                View
                              </Link>

                              {/* Edit */}
                              <Link
                                href={`/admin/articles/${article.id}/edit`}
                                className="rounded-lg border border-black/10 px-3 py-2 text-xs font-medium transition hover:bg-gray-50"
                              >
                                Edit
                              </Link>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(article)
                                }
                                disabled={
                                  deletingId === article.id
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingId === article.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            </div>

                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>

          </div>

        </section>
      </div>
    </main>
  );
}