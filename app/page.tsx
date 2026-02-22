// page.tsx = unique content for this specific route (the home page).
// This file is injected into the { children } slot of layout.tsx file.
import BookCard from "@/components/BookCard";
import Hero from "@/components/Hero";

export default function Home() {
  // dummy data to test grid for BookCard
  const allBooks = [
    { title: "Jane Eyre", author: "Charlotte Brontë", genre: "Classic", year: 1847 },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", genre: "Classic", year: 1890 },
    { title: "Frankenstein", author: "Mary Shelley", genre: "Classic", year: 1818 },
    { title: "Anna Karenina", author: "Leo Tolstoy", genre: "Classic", year: 1878 },
  ];

  return (
    <main className="overflow-hidden">
      {/* Main Content Section */}
      <Hero />

      {/* Grid Section */}
      <section className="padding-x padding-y">
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full">
          {allBooks.map((book) => (
            <BookCard 
              key={book.title}
              title={book.title}
              author={book.author}
              genre={book.genre}
              year={book.year}
            />
          ))}
        </div>
      </section>
    </main>
  );
}