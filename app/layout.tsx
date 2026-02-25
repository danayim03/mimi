// layout.tsx = Overall layout structure and global styles wrapped around ClerkProvider
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "./globals.css";
// imports for Clerk
import { ClerkProvider } from '@clerk/nextjs';

// search engine optimization (SEO, aka the metadata)
export const metadata = {
  title: "BookHub",
  description: "Discover your next favorite book to read.",
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="relative bg-primary-plum antialiased">
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