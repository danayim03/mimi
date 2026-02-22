// layout.tsx = Overall layout structure and global styles
import NavBar from "../components/NavBar";
import "./globals.css";
// search engine optimization (SEO, aka the metadata)
export const metadata = {
  title: "BookHub",
  description: "Discover your next favorite book to read.",
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className="relative bg-primary-plum antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}