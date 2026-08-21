"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Article = {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  slug: string;
  image?: string | null;
  readingTime?: number;
};

export default function ArticleCard({
  article,
}: {
  article: Article;
}) {
  const formattedDate = new Date(
    article.date
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={{
        y: -6,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="group"
    >
      <Link href={`/articles/${article.slug}`}>
        <div className="overflow-hidden border border-gray-200 bg-white transition-shadow duration-300 group-hover:shadow-lg">
          {/* IMAGE */}

          {article.image ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
            </div>
          ) : (
            <div className="flex aspect-[16/10] w-full items-center justify-center bg-gray-100">
              <span className="text-sm font-medium text-gray-400">
                Capital Lens
              </span>
            </div>
          )}

          {/* CONTENT */}

          <div className="p-6">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-orange-500">
              {article.category || "Insights"}
            </span>

            <h2 className="mb-3 text-2xl font-semibold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-orange-500">
              {article.title}
            </h2>

            {article.description && (
              <p className="mb-6 line-clamp-3 text-gray-600">
                {article.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span>{article.author}</span>

              <span>·</span>

              <span>{formattedDate}</span>

              {article.readingTime && (
                <>
                  <span>·</span>

                  <span>
                    {article.readingTime} min read
                  </span>
                </>
              )}
            </div>

            <div className="mt-5 text-sm font-semibold text-yellow-600 transition-transform duration-300 group-hover:translate-x-1">
              Read Article →
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}