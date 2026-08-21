"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ArticleSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(currentSearch);

  function handleSearch(value: string) {
    setSearch(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`/articles?${params.toString()}`);
  }

  return (
    <div className="mx-auto mb-10 max-w-2xl">
      <div className="flex items-center border border-gray-300 bg-white px-4 py-3 transition-colors duration-300 focus-within:border-yellow-600">
        <span className="mr-3 text-gray-400">⌕</span>

        <input
          type="search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search financial insights..."
          className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}