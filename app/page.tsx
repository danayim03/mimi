// page.tsx = the home page (SSR for better LCP).
// Initial book catalogue is fetched on the server so the first paint includes the grid.
import BookCatalogue from "@/components/BookCatalogue";
import Hero from "@/components/Hero";
import { fetchBooks } from "@/utils";

const DEFAULT_TITLE = "fiction";
const DEFAULT_AUTHOR = "";

export default async function Home() {
  const { books, totalItems } = await fetchBooks(DEFAULT_TITLE, DEFAULT_AUTHOR, 0);

  return (
    <main className="flex flex-col gap-2 px-4 sm:px-8 pb-2">
      {/* Hero Card */}
      <div className="bg-primary-white rounded-3xl overflow-hidden">
        <Hero />
      </div>

      {/* Catalogue Card — initial data from SSR for LCP; search/pagination are client-side */}
      <BookCatalogue
        initialData={{
          books,
          totalItems,
          titleQuery: DEFAULT_TITLE,
          authorQuery: DEFAULT_AUTHOR,
        }}
      />
    </main>
  );
}
