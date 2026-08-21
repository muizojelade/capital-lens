"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FeaturedCategories() {
  const categories = [
    {
      icon: "📈",
      title: "Markets",
      description: "Daily market analysis and global financial trends.",
    },
    {
      icon: "💰",
      title: "Investing",
      description: "Investment guides and wealth-building strategies.",
    },
    {
      icon: "🏦",
      title: "Economy",
      description: "Inflation, interest rates, and economic updates.",
    },
    {
      icon: "₿",
      title: "Crypto",
      description: "Blockchain technology and digital assets.",
    },
    {
      icon: "🥇",
      title: "Commodities",
      description: "Gold, oil, silver, and commodity market insights.",
    },
    {
      icon: "🎓",
      title: "Finance 101",
      description: "Beginner-friendly financial education.",
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Explore Topics
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Discover financial knowledge across different areas of investing,
            markets, and the global economy.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.title}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 30,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.55,
                    ease: "easeOut",
                  },
                },
              }}
              whileHover={{
                y: -8,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="group cursor-pointer border border-gray-200 bg-white p-8"
            >
              <Link
                href={`/articles?category=${encodeURIComponent(
                  category.title
                )}`}
                className="block"
              >
                <motion.div
                  className="text-4xl"
                  whileHover={{
                    scale: 1.1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                >
                  {category.icon}
                </motion.div>

                <h3 className="mt-6 text-2xl font-semibold">
                  {category.title}
                </h3>

                <p className="mt-3 text-gray-600">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}