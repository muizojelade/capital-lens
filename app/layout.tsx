import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Capital Lens",
    template: "%s | Capital Lens",
  },
  description:
    "Independent perspectives on markets, investing, economics, and the forces shaping global capital.",
  keywords: [
    "Capital Lens",
    "investing",
    "financial markets",
    "global markets",
    "economics",
    "investment insights",
  ],
  authors: [{ name: "Capital Lens" }],
  creator: "Capital Lens",
  publisher: "Capital Lens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="overflow-x-hidden">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}