// page.tsx = the home page.
// This file is injected into the { children } slot of layout.tsx file.
"use client";

import BookCard from "@/components/BookCard";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { fetchBooks } from "@/utils";
import { useEffect, useState } from "react";

const PAGE_SIZE = 12;

export default function Home() {
  const [books, setBooks] = useState([]);
  const [titleQuery, setTitleQuery] = useState("fiction");
  const [authorQuery, setAuthorQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const { books: data, totalItems: total } = await fetchBooks(titleQuery, authorQuery, page * PAGE_SIZE);
      setBooks(data);
      setTotalItems(total);
      setLoading(false);
    };
    loadBooks();
  }, [titleQuery, authorQuery, page]);

  const scrollToCatalogue = () => {
    document.getElementById("book-catalogue")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = (title: string, author: string) => {
    setPage(0); // reset to first page on new search
    setTitleQuery(title);
    setAuthorQuery(author);
  };

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <main className="overflow-hidden">
      {/* Main Content Section */}
      <Hero />

      {/* Search Bar Section */}
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="flex flex-col items-start justify-start gap-y-2.5">
          <h1 id="book-catalogue" className="text-4xl font-bold font-libre text-primary-pink scroll-mt-24">Book Catalogue</h1>
          <p className="font-sans text-primary-pink">Explore books you might like</p>
        </div>
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        <section className="mt-12">
          {loading ? (
            /* Loading State */
            <div className="flex justify-center items-center mt-20">
              <h2 className="text-primary-pink font-sans text-xl font-bold animate-pulse">
                Searching the library...
              </h2>
            </div>
          ) : books.length > 0 ? (
            <>
              {/* The Grid */}
              <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-x-10 gap-y-10">
                {books.map((book: any, index: number) => (
                  <BookCard key={`${book.title}-${index}`} {...book} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-6 mt-16 mb-8">
                <button
                  onClick={() => { setPage((p) => p - 1); scrollToCatalogue(); }}
                  disabled={page === 0}
                  className="custom-btn min-w-[100px] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>

                <span className="text-primary-pink font-bold text-sm">
                  Page {page + 1}{totalPages > 0 ? ` of ${totalPages}` : ""}
                </span>

                <button
                  onClick={() => { setPage((p) => p + 1); scrollToCatalogue(); }}
                  disabled={(page + 1) * PAGE_SIZE >= totalItems}
                  className="custom-btn min-w-[100px] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex justify-center items-center mt-20">
              <h2 className="text-primary-pink text-xl font-bold">
                Oops, no results for "{[titleQuery, authorQuery].filter(Boolean).join(" by ")}"
              </h2>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
