"use client";

import { useState } from "react";

export default function ArticleShare({
  title,
}: {
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      console.error("Could not copy article link.");
    }
  };

  const shareWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    window.open(
      `https://wa.me/?text=${text}%20${url}`,
      "_blank"
    );
  };

  const shareX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  return (
    <div className="mt-16 border-y border-gray-200 py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Share this article
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Found this useful? Share it with someone.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyLink}
            className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-yellow-600 hover:text-yellow-600"
          >
            {copied ? "✓ Copied!" : "Copy link"}
          </button>

          <button
            type="button"
            onClick={shareWhatsApp}
            className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-yellow-600 hover:text-yellow-600"
          >
            WhatsApp
          </button>

          <button
            type="button"
            onClick={shareX}
            className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-yellow-600 hover:text-yellow-600"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}