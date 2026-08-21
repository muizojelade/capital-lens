"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <section className="px-6 py-20">
      <motion.div
        className="mx-auto max-w-4xl rounded-3xl bg-gray-900 p-8 md:p-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        <motion.h2
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
        >
          Stay Ahead of the Markets
        </motion.h2>

        <motion.p
          className="mt-5 text-gray-300"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.25,
          }}
        >
          Join our newsletter and receive weekly financial insights,
          investing ideas, and market analysis.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.35,
          }}
        >
          <motion.input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setStatus("idle");
            }}
            placeholder="Enter your email"
            required
            whileFocus={{
              scale: 1.01,
            }}
            transition={{
              duration: 0.2,
            }}
            className="flex-1 rounded-xl bg-white px-5 py-4 text-gray-900 outline-none placeholder:text-gray-400"
          />

          <motion.button
            type="submit"
            className="cursor-pointer rounded-xl bg-yellow-600 px-8 py-4 text-white"
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
            Subscribe
          </motion.button>
        </motion.form>

        {status === "success" && (
          <motion.p
            className="mt-4 text-sm text-green-400"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            You're on the list! We'll keep you updated.
          </motion.p>
        )}

        {status === "error" && (
          <motion.p
            className="mt-4 text-sm text-red-400"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Please enter a valid email address.
          </motion.p>
        )}

        <motion.p
          className="mt-4 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
        >
          No spam. Unsubscribe anytime.
        </motion.p>
      </motion.div>
    </section>
  );
}