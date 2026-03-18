// layout.tsx = Overall layout structure and global styles wrapped around ClerkProvider
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import "./globals.css";
// imports for Clerk
import { ClerkProvider } from '@clerk/nextjs';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mimireads.vercel.app";

export const metadata = {
  title: {
    default: "mimi — Track, Discover & Organize Your Literary World",
    template: "%s | mimi",
  },
  description:
    "The modern sanctuary to track, discover, and organize your literary world. Build your library, log journals, save quotes, and explore books — for daydreamers and book lovers.",
  keywords: [
    "mimi",
    "aesthetic book tracker",
    "app for book lovers",
    "book journal",
    "pretty website",
    "literary companion",
    "book quotes",
    "reading library",
    "book discovery",
    "whimsical website",
  ],
  authors: [{ name: "Dana Yim" }],
  creator: "Dana Yim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "mimi",
    title: "mimi — Track, Discover & Organize Your Literary World",
    description: "The modern sanctuary to track, discover, and organize your literary world. Build your library, log journals, save quotes, and explore books.",
  },
  twitter: {
    card: "summary_large_image",
    title: "mimi — Track, Discover & Organize Your Literary World",
    description: "The modern sanctuary to track, discover, and organize your literary world.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <ClerkProvider>
        <html lang="en">
        <head>
          <meta name="google-site-verification" content="1lbN5x1bCXMLdmu88DOO8WgrIMqmcjf3ZlDyW96Ssrk" />
          <link rel="preload" href="/romance-vid.mp4" as="video" type="video/mp4" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "mimi",
                description: "The modern sanctuary to track, discover, and organize your literary world. Build your library, log journals, save quotes, and explore books.",
                url: siteUrl,
                applicationCategory: "LifestyleApplication",
              }),
            }}
          />
        </head>
        <body className="relative bg-white antialiased overflow-x-hidden">
          <NavBar />
          <main className="pt-[52px]">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}