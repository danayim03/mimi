// layout.tsx = Overall layout structure and global styles wrapped around ClerkProvider
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import "./globals.css";
// imports for Clerk
import { ClerkProvider } from '@clerk/nextjs';

// search engine optimization (SEO, aka the metadata)
export const metadata = {
  title: "mimi",
  description: "The modern sanctuary for readers to track, discover, and organize their literary world.",
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="relative bg-primary-white antialiased">
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