"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      setError(
        "Invalid email or password."
      );

      setLoading(false);

      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-6">
      <div className="w-full max-w-md">

        {/* BRAND */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Capital
            <span className="text-[#c58a2a]">
              Lens
            </span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Admin Dashboard
          </p>
        </div>

        {/* LOGIN CARD */}

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Sign in to manage Capital Lens.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c58a2a] focus:ring-2 focus:ring-[#c58a2a]/10"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c58a2a] focus:ring-2 focus:ring-[#c58a2a]/10"
              />
            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#c58a2a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#ad751e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Capital Lens Admin
        </p>

      </div>
    </main>
  );
}