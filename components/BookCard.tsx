// BookCard.tsx = A reusable card that displays individual book details.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
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
                className="book-card group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => setIsOpen(true)}
            >
                <div className="relative w-full h-40 rounded-xl flex items-start justify-start">
                    <span className="font-karrik text-4xl line-clamp-3">
                        {title}
                    </span>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm text-primary-plum group-hover:text-primary-pink transition-colors">By {author}</p>

                    {/* Progress + Journal row — library view only */}
                    {isLibraryView && (
                        <div
                            className="flex justify-between items-center w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Journal */}
                            <button
                                onClick={() => router.push(`/journal/${id}`)}
                                className="text-[10px] font-bold text-primary-plum group-hover:text-primary-pink hover:scale-110 transition-all px-1 cursor-pointer"
                            >
                                journal
                            </button>

                            {/* Progress */}
                            <div className="flex items-center gap-2">
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
                                        className="text-[10px] font-bold text-primary-plum group-hover:text-primary-pink transition-colors hover:scale-110 px-1 cursor-pointer"
                                    >
                                        {progress}%
                                    </span>
                                )}
                                <div className="w-12 h-1.5 bg-white rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-plum group-hover:bg-primary-pink transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-between w-full text-sm font-bold uppercase tracking-widest">
                    <span className="text-primary-plum group-hover:text-primary-pink transition-colors">{genre}</span>
                    <span className="text-primary-plum group-hover:text-primary-pink transition-colors">{year}</span>
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