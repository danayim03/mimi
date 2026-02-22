// page.tsx = unique content for this specific route (the home page).
// This file is injected into the { children } slot of layout.tsx file.
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
    </main>
  );
}