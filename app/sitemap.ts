import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const baseUrl = "https://capital-lens-eta.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const articleUrls: MetadataRoute.Sitemap =
    (articles || []).map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.created_at
        ? new Date(article.created_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articleUrls,
  ];
}