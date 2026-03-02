import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://surendrachouhan-ecommerce-xeb9.vercel.app"), // 🔴 yaha apna real domain daal

  title: {
    default: "Surendra Book Store | Buy Books Online in India",
    template: "%s | Surendra Book Store",
  },

  description:
    "Buy bestselling fiction, business, finance and productivity books online at Surendra Book Store. Fast delivery across India. Secure checkout & premium experience.",

  keywords: [
    "buy books online india",
    "online bookstore india",
    "business books",
    "finance books",
    "self help books",
    "fiction books",
    "best books to read",
    "Surendra Book Store",
  ],

  authors: [{ name: "Surendra Chouhan" }],
  creator: "Surendra Chouhan",
  publisher: "Surendra Book Store",

  openGraph: {
    title: "Surendra Book Store | Premium Online Bookstore",
    description:
      "Discover bestselling books across multiple genres. Fast delivery & secure checkout.",
    url: "https://surendrachouhan-ecommerce-xeb9.vercel.app,",
    siteName: "Surendra Book Store",
    type: "website",
    locale: "en_IN",
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
      "Premium online bookstore with secure checkout & fast delivery.",
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
    canonical: "https://surendrachouhan-ecommerce-xeb9.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <Providers>

          <Navbar />

          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#111827",
                color: "#fff",
                border: "1px solid #facc15",
                borderRadius: "12px",
              },
            }}
          />

          <main className="grow">
            {children}
          </main>

          <Footer />

        </Providers>
      </body>
    </html>
  );
}