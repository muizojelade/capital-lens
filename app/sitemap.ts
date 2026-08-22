import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const baseUrl = "https://capital-lens-eta.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, created_at")
    .eq("status", "published");

  const articleUrls =
    articles?.map((article) => ({
      url: `${baseUrl}/insights/${article.slug}`,
      lastModified: new Date(article.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) ?? [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/insights`,
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