"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Globe from "@/components/Globe";

export default function HomeClient() {
  return (
    <>
      {/* HERO SECTION */}

      <section className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-6">
        <Globe />

        <motion.div
          className="relative z-10 max-w-5xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <motion.h1
            className="text-5xl font-bold tracking-tight md:text-7xl"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: "easeOut",
            }}
          >
            Understand Markets.
            <span className="text-yellow-600"> Build Wealth.</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-gray-600 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease: "easeOut",
            }}
          >
            Capital Lens delivers clear insights on investing, financial
            markets, and economic trends to help you make smarter decisions.
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.5,
              ease: "easeOut",
            }}
          >
            <Link href="/articles">
  <motion.div
    className="cursor-pointer bg-yellow-600 px-6 py-3 text-white"
    whileHover={{
      scale: 1.05,
      y: -2,
    }}
    whileTap={{
      scale: 0.97,
    }}
    transition={{
      type: "spring",
      stiffness: 400,
      damping: 17,
    }}
  >
    Explore Articles
  </motion.div>
</Link>

            <motion.button
              className="cursor-pointer border border-yellow-600 px-6 py-3 text-yellow-600"
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
            >
              Start Learning
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}