// page.tsx = the home page.
// This file is injected into the { children } slot of layout.tsx file.
"use client";

import BookCard from "@/components/BookCard";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { fetchBooks } from "@/utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [titleQuery, setTitleQuery] = useState("classics");
  const [authorQuery, setAuthorQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const data = await fetchBooks(titleQuery, authorQuery);
      setBooks(data);
      setLoading(false);
    };
    loadBooks();
  }, [titleQuery, authorQuery]);

  const handleSearch = (title: string, author: string) => {
    setTitleQuery(title);
    setAuthorQuery(author);
  };

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
          {/* Pass 'setQuery' to the SearchBar */}
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
            /* The Grid - now using the 'books' state from the API */
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-x-10 gap-y-10">
              {books.map((book: any, index: number) => (
                /* Use index along with title in case two or more books share a title */
                <BookCard key={`${book.title}-${index}`} {...book} />
              ))}
            </div>
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