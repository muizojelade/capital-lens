import InsightCards from "@/components/InsightCards";
import FeaturedCategories from "@/components/FeaturedCategories";
import EditorsPick from "@/components/EditorsPick";
import Newsletter from "@/components/components/Newsletter";
import HomeClient from "@/components/HomeClient";

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