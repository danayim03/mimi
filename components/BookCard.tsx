// BookCard.tsx = A reusable card that displays individual book details.
"use client";

import { useState } from "react";
import BookDetails from "./BookDetails";

interface BookProps {
    title: string;
    author: string;
    genre: string;
    year: number;
    description: string;
    image: string;
    isLibraryView?: boolean;
}

const BookCard = (book: BookProps) => {
    const { title, author, genre, year, description, image, isLibraryView } = book;
    const [ isOpen, setIsOpen ] = useState(false);

    return (
        <>
            {/* Clickable Card */}
            <div 
                className="book-card cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => setIsOpen(true)}
            >
                <div className="relative w-full h-40 rounded-xl flex items-start justify-start">
                    <span className="font-bold text-4xl line-clamp-3">
                        {title}
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-sm text-primary-plum">
                        By {author}
                    </p>
                </div>

                <div className="mt-4 flex flex-between w-full text-sm font-bold uppercase tracking-widest">
                    <span className="text-primary-plum">{genre}</span>
                    <span className="text-primary-plum">{year}</span>
                </div>
            </div>

            {/* Modal Component */}
            <BookDetails
                isOpen={isOpen}
                closeModal={() => setIsOpen(false)}
                book={book}
                isLibraryView={isLibraryView}
            />
        </>
    );
};

export default BookCard;