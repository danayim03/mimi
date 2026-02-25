// BookCard.tsx = A reusable card that displays individual book details.
"use client";

import { useState } from "react";
import BookDetails from "./BookDetails";

interface BookProps {
    id?: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    description: string;
    image: string;
    isLibraryView?: boolean;
    progress?: number;
    onProgressUpdate?: (id: string, newProgress: number) => Promise<void>;
}

const BookCard = (book: BookProps) => {
    const { id, title, author, genre, year, description, image, isLibraryView, onProgressUpdate } = book;
    const progress = book.progress ?? 0;
    const [ isOpen, setIsOpen ] = useState(false);
    // editing states for progress
    const [isEditing, setIsEditing] = useState(false);
    const [tempProgress, setTempProgress] = useState(progress);

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const val = Math.min(Math.max(Number(tempProgress), 0), 100);
            if (onProgressUpdate && id) {
                await onProgressUpdate(id, val);
            }
            setIsEditing(false);
        }
    };

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

                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-sm text-primary-plum">
                            By {author}
                        </p>
                        {/* Progress Update */}
                        {isLibraryView && (
                                <div 
                                    className="flex items-center gap-2"
                                    onClick={(e) => e.stopPropagation()} // stops modal from opening
                                >
                                    {isEditing ? (
                                        <input
                                            autoFocus
                                            type="number"
                                            value={tempProgress}
                                            onChange={(e) => setTempProgress(Number(e.target.value))}
                                            onKeyDown={handleKeyDown}
                                            onBlur={() => setIsEditing(false)}
                                            className="w-10 bg-primary-plum text-primary-pink text-[10px] font-bold rounded text-center outline-none"
                                        />
                                    ) : (
                                        <span
                                            onClick={() => setIsEditing(true)}
                                            className="text-[10px] font-bold text-primary-plum hover:scale-110 transition-transform px-1 cursor-edit"
                                        >
                                            {progress}%
                                        </span>
                                    )}
                                    {/* Visual Progress Bar */}
                                    <div className="w-12 h-1.5 bg-white rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-plum transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                            </div>
                        )}
                    </div>
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