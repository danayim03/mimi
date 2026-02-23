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
  // initially there is no book data: []
  const [books, setBooks] = useState([]);
  // initial search term is classics
  const [query, setQuery] = useState("classics");
  // initially search not done -> not loading -> false
  const [loading, setLoading] = useState(false);
  // the search triggered:
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true); // load book data begins
      const data = await fetchBooks(query); // use tool from utils to fetch book data
      setBooks(data); // data loaded
      setLoading(false); // load finished
    };
    loadBooks(); // trigger search
  }, [query]);

  return (
    <main className="overflow-hidden">
      {/* Main Content Section */}
      <Hero />

      {/* Search Bar Section */}
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="flex flex-col items-start justify-start gap-y-2.5">
          <h1 className="text-4xl font-bold font-libre text-primary-pink">Book Catalogue</h1>
          <p className="font-sans text-primary-pink">Explore books you might like</p>
        </div>
        <div className="mb-12">
          {/* Pass 'setQuery' to the SearchBar */}
          <SearchBar setQuery={setQuery}/>
        </div>

        <section className="mt-12">
          {loading ? (
            /* Loading State */
            <div className="flex justify-center items-center mt-20">
              <h2 className="text-primary-pink text-xl font-bold animate-pulse">
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
                Oops, no results for "{query}"
              </h2>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}