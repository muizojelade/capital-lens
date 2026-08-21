import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ArticleEditor from "@/components/ArticleEditor";

type EditArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;

  const { data: article, error } = await supabase
    .from("articles")
    .select(
  "id, title, slug, excerpt, category, tags, content, cover_image, editor_pick, status"
)
    .eq("id", id)
    .single();

if (error) {
  console.error("EDIT ARTICLE SUPABASE ERROR:", error);
  throw new Error(`Failed to load article: ${error.message}`);
}

if (!article) {
  notFound();
}

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#171717]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 md:px-10">
          <Link
            href="/admin/articles"
            className="text-sm text-gray-500 transition hover:text-black"
          >
            ← Back to Articles
          </Link>

          <h1 className="mt-3 text-2xl font-semibold">
            Edit Article
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Edit and update your Capital Lens article.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
          <ArticleEditor
            articleId={article.id}
            initialArticle={{
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt || "",
  category: article.category || "",
  tags: article.tags || "",
  content: article.content || "",
  cover_image: article.cover_image,
  editor_pick: article.editor_pick,
  status: article.status,
}}
          />
        </div>
      </div>
    </main>
  );
}