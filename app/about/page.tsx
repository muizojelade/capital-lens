"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import AboutVisual from "@/components/AboutVisual";

const topics = [
  {
    title: "Markets",
    image: "/images/markets.jpg",
    description:
      "Market movements, trends, and the forces influencing financial assets.",
  },
  {
    title: "Investing",
    image: "/images/investing.jpg",
    description:
      "Investment principles, strategies, and ideas for building long-term knowledge.",
  },
  {
    title: "Economy",
    image: "/images/economy.jpg",
    description:
      "Inflation, interest rates, economic cycles, and global economic developments.",
  },
  {
    title: "Crypto",
    image: "/images/crypto.jpg",
    description:
      "Digital assets, blockchain technology, and the evolving crypto ecosystem.",
  },
  {
    title: "Commodities",
    image: "/images/commodities.jpg",
    description:
      "Gold, oil, silver, and other commodities that influence global markets.",
  },
  {
    title: "Finance 101",
    image: "/images/finance.jpg",
    description:
      "Straightforward explanations of financial concepts for anyone getting started.",
  },
];

const approach = [
  {
    title: "Research",
    image: "/images/research.jpg",
    description:
      "We examine the information and forces behind financial developments.",
  },
  {
    title: "Context",
    image: "/images/context.jpg",
    description:
      "We look beyond individual headlines to understand the bigger picture.",
  },
  {
    title: "Clarity",
    image: "/images/clarity.jpg",
    description:
      "We turn complex financial ideas into information readers can actually understand.",
  },
];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};


export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* HERO */}

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Hero Text */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-orange-500">
              About Capital Lens
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
              Clear thinking in a world of{" "}
              <span className="text-yellow-600">
                financial noise.
              </span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-gray-600 md:text-xl">
              Capital Lens is an independent financial publication focused on
              making markets, investing, economics, and global capital easier
              to understand.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/articles"
                className="bg-yellow-600 px-6 py-3 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-700"
              >
                Explore Articles →
              </Link>

              <Link
                href="/"
                className="border border-gray-300 px-6 py-3 text-gray-700 transition-all duration-300 hover:border-yellow-600 hover:text-yellow-600"
              >
                Back Home
              </Link>
            </div>
          </motion.div>

          {/* 3D Visual */}

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: 0.15,
            }}
            className="relative"
          >
            <AboutVisual />
          </motion.div>
        </div>
      </section>

      {/* MISSION */}

      <section className="border-y border-gray-100 bg-gray-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-orange-500">
              Our Mission
            </p>

            <h2 className="mt-4 text-3xl font-semibold text-gray-900 md:text-4xl">
              Understand the forces behind capital.
            </h2>
          </div>

          <div className="space-y-5 text-lg leading-8 text-gray-600">
            <p>
              Financial markets can feel complicated, noisy, and difficult to
              navigate. Capital Lens exists to cut through that noise.
            </p>

            <p>
              We focus on explaining the ideas, trends, and economic forces
              that influence markets and shape financial decisions.
            </p>

            <p>
              The goal is simple: help readers develop a clearer understanding
              of the financial world.
            </p>
          </div>
        </motion.div>
      </section>

      {/* WHAT WE COVER */}

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-orange-500">
            What We Cover
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-gray-900 md:text-4xl">
            Explore the world of capital.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            From everyday financial concepts to global market movements, our
            coverage spans the ideas that matter.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {topics.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -7 }}
              transition={{ duration: 0.25 }}
              className="group overflow-hidden border border-gray-200 bg-white"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-7">
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {item.description}
                </p>

                <Link
                  href={`/articles?category=${encodeURIComponent(item.title)}`}
                  className="mt-5 inline-block text-sm font-medium text-yellow-600 transition-colors hover:text-yellow-700"
                >
                  Explore {item.title} →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* APPROACH */}

      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="max-w-3xl"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-yellow-500">
              Our Approach
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Clarity over complexity.
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              We believe financial information should be informative without
              being unnecessarily complicated. Capital Lens focuses on clear
              explanations, thoughtful analysis, and useful context.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="mt-14 grid gap-8 md:grid-cols-3"
          >
            {approach.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="group overflow-hidden border border-gray-700"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeUp}
        className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32"
      >
        <p className="text-sm font-medium uppercase tracking-widest text-orange-500">
          Explore Capital Lens
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
          Start exploring the markets.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-gray-600">
          Discover our latest insights, research, and financial perspectives.
        </p>

        <Link
          href="/articles"
          className="mt-8 inline-block bg-yellow-600 px-7 py-3 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-700"
        >
          Explore Articles →
        </Link>
      </motion.section>
    </main>
  );
}