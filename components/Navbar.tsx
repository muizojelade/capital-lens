"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-white">
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}

        <Link
          href="/"
          onClick={closeMenu}
          className="text-xl font-semibold tracking-tight text-gray-900"
        >
          <span>
  <span className="text-black">Capital</span>{" "}
  <span className="text-yellow-600">Lens</span>
</span>
        </Link>

        {/* Desktop Menu */}

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/articles?category=Markets"
            className="transition-colors hover:text-yellow-600"
          >
            Markets
          </Link>

          <Link
            href="/articles?category=Investing"
            className="transition-colors hover:text-yellow-600"
          >
            Investing
          </Link>

          <Link
            href="/articles?category=Finance%20101"
            className="transition-colors hover:text-yellow-600"
          >
            Learn
          </Link>

          <Link
            href="/articles?category=Crypto"
            className="transition-colors hover:text-yellow-600"
          >
            Crypto
          </Link>

          <Link
            href="/about"
            className="transition-colors hover:text-yellow-600"
          >
            About
          </Link>
        </div>

        {/* Desktop Newsletter */}

        <Link
          href="/#newsletter"
          className="hidden bg-yellow-600 px-5 py-2 text-white transition-all duration-300 hover:scale-105 md:block"
        >
          Newsletter
        </Link>

        {/* Mobile Menu Button */}

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="relative z-50 text-2xl md:hidden"
        >
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="block"
          >
            {open ? "✕" : "☰"}
          </motion.span>
        </button>

        {/* Animated Mobile Menu */}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="absolute left-0 top-full w-full bg-white px-6 py-6 shadow-lg md:hidden"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.06,
                    },
                  },
                }}
                className="space-y-1"
              >
                {[
                  {
                    label: "Markets",
                    href: "/articles?category=Markets",
                  },
                  {
                    label: "Investing",
                    href: "/articles?category=Investing",
                  },
                  {
                    label: "Learn",
                    href: "/articles?category=Finance%20101",
                  },
                  {
                    label: "Crypto",
                    href: "/articles?category=Crypto",
                  },
                  {
                    label: "About",
                    href: "/about",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: -15,
                      },
                      visible: {
                        opacity: 1,
                        x: 0,
                      },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="block py-3 text-gray-800 transition-colors hover:text-yellow-600"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 10,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  className="pt-4"
                >
                  <Link
                    href="/#newsletter"
                    onClick={closeMenu}
                    className="block w-full bg-yellow-600 px-5 py-3 text-center text-white transition-colors hover:bg-yellow-700"
                  >
                    Newsletter
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}