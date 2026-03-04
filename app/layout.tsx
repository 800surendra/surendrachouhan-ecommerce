import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://surendrachouhan-ecommerce.vercel.app"),

  title: {
    default: "Surendra Book Store | Buy Books Online in India",
    template: "%s | Surendra Book Store",
  },

  description:
    "Buy bestselling fiction, business, finance and productivity books online at Surendra Book Store. Fast delivery across India with secure checkout.",

  keywords: [
    "buy books online india",
    "online bookstore india",
    "best books to read",
    "business books",
    "self help books",
    "fiction books",
    "finance books",
    "Surendra Book Store",
  ],

  authors: [{ name: "Surendra Chouhan" }],
  creator: "Surendra Chouhan",
  publisher: "Surendra Book Store",

  openGraph: {
    title: "Surendra Book Store | Premium Online Bookstore",
    description:
      "Discover bestselling books across multiple genres. Secure checkout & fast delivery.",
    url: "https://surendrachouhan-ecommerce.vercel.app",
    siteName: "Surendra Book Store",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Surendra Book Store",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Surendra Book Store",
    description:
      "Premium online bookstore with secure checkout and fast delivery.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },

  alternates: {
    canonical: "https://surendrachouhan-ecommerce.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white min-h-screen flex flex-col antialiased">

        <Providers>

          {/* NAVBAR */}

          <Navbar />

          {/* GLOBAL TOAST */}

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#111827",
                color: "#fff",
                border: "1px solid #facc15",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              },
            }}
          />

          {/* MAIN CONTENT */}

          <main className="grow">

            {children}

          </main>

          {/* FOOTER */}

          <Footer />

        </Providers>

      </body>
    </html>
  );
}