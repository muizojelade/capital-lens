
import type { Metadata } from "next";

import InsightCards from "@/components/InsightCards";
import FeaturedCategories from "@/components/FeaturedCategories";
import EditorsPick from "@/components/EditorsPick";
import Newsletter from "@/components/components/Newsletter";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Markets, Investing & Global Capital",
  description:
    "Capital Lens delivers independent perspectives on markets, investing, economics, and the forces shaping global capital.",

  keywords: [
    "Capital Lens",
    "markets",
    "investing",
    "investment insights",
    "financial markets",
    "global markets",
    "economics",
    "global capital",
  ],

  openGraph: {
    title: "Markets, Investing & Global Capital",
    description:
      "Independent perspectives on markets, investing, economics, and the forces shaping global capital.",
    type: "website",
    siteName: "Capital Lens",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Markets, Investing & Global Capital",
    description:
      "Independent perspectives on markets, investing, economics, and the forces shaping global capital.",
  },
};

export default function Home() {
  return (
    <main>
      <HomeClient />

      <InsightCards />

      <FeaturedCategories />

      <EditorsPick />

      <Newsletter />
    </main>
  );
}

