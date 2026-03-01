// layout.tsx = Overall layout structure and global styles wrapped around ClerkProvider
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import "./globals.css";
// imports for Clerk
import { ClerkProvider } from '@clerk/nextjs';

// search engine optimization (SEO, aka the metadata)
export const metadata = {
  title: "mimi",
  description: "The modern sanctuary to track, discover, and organize your literary world.",
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preload" href="/romance-vid.mp4" as="video" type="video/mp4" />
        </head>
        <body className="relative bg-primary-white antialiased overflow-x-hidden">
          <NavBar />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}