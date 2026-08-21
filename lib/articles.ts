import { supabase } from "@/lib/supabase";

export type Article = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  image?: string | null;
  featured?: boolean;
  editor_pick?: boolean;
  status: string;
  content: string;
  tags?: string;
  readingTime?: number;
};

function calculateReadingTime(content: string) {
  const words = content
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      slug,
      title,
      excerpt,
      category,
      content,
      cover_image,
      editor_pick,
      status,
      created_at,
      tags
      `
    )
    .eq("status", "published")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }

  return (data || []).map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.excerpt || "",
    date: article.created_at,
    author: "Capital Lens",
    category: article.category || "",
    image: article.cover_image,
    featured: article.editor_pick,
    editor_pick: article.editor_pick,
    status: article.status,
    content: article.content || "",
    tags: article.tags || "",
    readingTime: calculateReadingTime(
      article.content || ""
    ),
  }));
}

export async function getArticle(
  slug: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      slug,
      title,
      excerpt,
      category,
      content,
      cover_image,
      editor_pick,
      status,
      created_at,
      tags
      `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.excerpt || "",
    date: data.created_at,
    author: "Capital Lens",
    category: data.category || "",
    image: data.cover_image,
    featured: data.editor_pick,
    editor_pick: data.editor_pick,
    status: data.status,
    content: data.content || "",
    tags: data.tags || "",
    readingTime: calculateReadingTime(
      data.content || ""
    ),
  };
}