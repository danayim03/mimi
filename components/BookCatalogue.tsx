// BookCatalogue.tsx = Client component for the book catalogue.
// Receives initial data from the server for SSR/LCP; handles search and pagination on the client.
"use client";

import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import { fetchBooks } from "@/utils";
import { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 12;

export interface BookCatalogueInitialData {
  books: Array<{
    title: string;
    author: string;
    genre: string;
    year: string | number;
    description: string;
    image: string;
  }>;
  totalItems: number;
  titleQuery: string;
  authorQuery: string;
}

interface BookCatalogueProps {
  initialData: BookCatalogueInitialData;
}

export default function BookCatalogue({ initialData }: BookCatalogueProps) {
  const {
    books: initialBooks,
    totalItems: initialTotal,
    titleQuery: initialTitle,
    authorQuery: initialAuthor,
  } = initialData;

  const [books, setBooks] = useState(initialBooks);
  const [titleQuery, setTitleQuery] = useState(initialTitle);
  const [authorQuery, setAuthorQuery] = useState(initialAuthor);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(initialTotal);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const loadBooks = async () => {
      setLoading(true);
      const { books: data, totalItems: total } = await fetchBooks(
        titleQuery,
        authorQuery,
        page * PAGE_SIZE
      );
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
    setPage(0);
    setTitleQuery(title);
    setAuthorQuery(author);
  };

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <div className="bg-primary-white rounded-3xl" id="discover">
      <div className="mt-12 padding-x padding-y max-width scroll-mt-20">
        <div className="flex flex-col items-start justify-start gap-y-3">
          <h1
            id="book-catalogue"
            className="text-9xl font-kapakana font-light text-black scroll-mt-24"
          >
            Book Catalogue
          </h1>
          <p className="font-swiss text-black/70 text-base">
            Search by title, author, or genre — find your next obsession.
          </p>
        </div>
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        <section className="mt-12">
          {loading ? (
            <div className="flex justify-center items-center mt-20">
              <h2 className="text-black font-swiss text-xl animate-pulse">
                Searching the library...
              </h2>
            </div>
          ) : books.length > 0 ? (
            <>
              <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-x-10 gap-y-10">
                {books.map((book, index) => (
                  <BookCard
                    key={`${book.title}-${index}`}
                    {...book}
                    year={typeof book.year === "string" ? parseInt(book.year, 10) || 0 : book.year}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 mt-16 mb-8">
                <button
                  onClick={() => {
                    setPage((p) => p - 1);
                    scrollToCatalogue();
                  }}
                  disabled={page === 0}
                  className="custom-btn min-w-[100px] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>

                <span className="text-black font-bold text-sm">
                  Page {page + 1}
                  {totalPages > 0 ? ` of ${totalPages}` : ""}
                </span>

                <button
                  onClick={() => {
                    setPage((p) => p + 1);
                    scrollToCatalogue();
                  }}
                  disabled={(page + 1) * PAGE_SIZE >= totalItems}
                  className="custom-btn min-w-[100px] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center mt-20">
              <h2 className="text-black text-xl font-bold">
                Oops, no results for &quot;{[titleQuery, authorQuery].filter(Boolean).join(" by ")}&quot;
              </h2>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
