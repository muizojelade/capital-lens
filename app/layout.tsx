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

const siteUrl = "https://capital-lens-eta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

    verification: {
    google: "YRh_1RUwGHBAD4qMr4dHE0NYwIX9l1TCFHo80WVQdS8",
  },

  title: {
    default: "Capital Lens",
    template: "%s | Capital Lens",
  },

  description:
    "Independent perspectives on markets, investing, economics, and the forces shaping global capital.",
    other: {
  "google-adsense-account": "ca-pub-3970518509028666",
},

  keywords: [
    "markets",
    "investing",
    "economy",
    "crypto",
    "commodities",
    "finance 101",
    "global capital",
    "financial insights",
  ],

  authors: [
    {
      name: "Capital Lens",
    },
  ],

  creator: "Capital Lens",
  publisher: "Capital Lens",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Capital Lens",
    title: "Capital Lens",
    description:
      "Independent perspectives on markets, investing, economics, and the forces shaping global capital.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Capital Lens",
    description:
      "Independent perspectives on markets, investing, economics, and the forces shaping global capital.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Capital Lens",
              url: siteUrl,
              description:
                "Independent perspectives on markets, investing, economics, and the forces shaping global capital.",
            }),
          }}
        />

        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}