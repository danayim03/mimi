// page.tsx = the home page.
// This file is injected into the { children } slot of layout.tsx file.
"use client";

import { useState } from "react";
import BookCard from "@/components/BookCard";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";

export default function Home() {
  // dummy data to test grid for BookCard
  const allBooks = [
    { title: "Jane Eyre", author: "Charlotte Brontë", genre: "Classic", year: 1847 },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", genre: "Classic", year: 1890 },
    { title: "Frankenstein", author: "Mary Shelley", genre: "Classic", year: 1818 },
    { title: "Anna Karenina", author: "Leo Tolstoy", genre: "Classic", year: 1878 },
  ];

  // state to track the search query
  const [query, setQuery] = useState("");

  // filter the search: check if the book title includes the letters user typed (case-insensitive)
  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

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
          {/* Show results or a "Not Found" message */}
          {filteredBooks.length > 0 ? (
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-10">
              {filteredBooks.map((book) => (
                <BookCard key={book.title} {...book} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center mt-20">
              <h2 className="text-primary-pink text-xl font-bold">Oops, no results for "{query}"</h2>
            </div>
          )}
        </section>

        {/* Footer Section */}
        <Footer />

      </div>
    </main>
  );
}