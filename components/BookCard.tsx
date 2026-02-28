// BookCard.tsx = A reusable card that displays individual book details.
"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState("");
    const [totalPages, setTotalPages] = useState("");
    const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSavePages = async (cp = currentPage, tp = totalPages) => {
        const current = parseInt(cp);
        const total = parseInt(tp);
        if (!isNaN(current) && !isNaN(total) && total > 0) {
            const val = Math.min(Math.round((current / total) * 100), 100);
            if (onProgressUpdate && id) {
                await onProgressUpdate(id, val);
            }
        }
        setIsEditing(false);
        setCurrentPage("");
        setTotalPages("");
    };

    const handleBlur = () => {
        blurTimeout.current = setTimeout(() => handleSavePages(), 150);
    };

    const handleFocus = () => {
        if (blurTimeout.current) clearTimeout(blurTimeout.current);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSavePages();
        if (e.key === "Escape") {
            setIsEditing(false);
            setCurrentPage("");
            setTotalPages("");
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
                    <span className="font-swiss text-4xl line-clamp-3">
                        {title}
                    </span>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm text-black font-swiss group-hover:text-primary-pink transition-colors">By {author}</p>

                    {/* Progress + Journal row — library view only */}
                    {isLibraryView && (
                        <div
                            className="flex justify-between items-center w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Journal */}
                            <button
                                onClick={() => router.push(`/journal/${id}`)}
                                className="text-xs font-swiss font-bold bg-black text-primary-pink px-3 py-1 rounded-full group-hover:bg-primary-pink group-hover:text-primary-red hover:!bg-primary-red hover:!text-primary-pink transition-all cursor-pointer"
                            >
                                Journal
                            </button>

                            {/* Progress */}
                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            autoFocus
                                            type="number"
                                            placeholder="pg"
                                            value={currentPage}
                                            onChange={(e) => setCurrentPage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onBlur={handleBlur}
                                            onFocus={handleFocus}
                                            className="w-9 bg-primary-white text-black text-[10px] font-swiss rounded text-center outline-none placeholder:text-black/30"
                                        />
                                        <span className="text-[10px] text-black/50">/</span>
                                        <input
                                            type="number"
                                            placeholder="total"
                                            value={totalPages}
                                            onChange={(e) => setTotalPages(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onBlur={handleBlur}
                                            onFocus={handleFocus}
                                            className="w-9 bg-primary-white text-black text-[10px] font-swiss rounded text-center outline-none placeholder:text-black/30"
                                        />
                                    </div>
                                ) : (
                                    <span
                                        onClick={() => setIsEditing(true)}
                                        className="text-[10px] font-swiss text-black group-hover:text-primary-pink transition-colors hover:scale-110 px-1 cursor-pointer"
                                    >
                                        {progress}%
                                    </span>
                                )}
                                <div className="w-12 h-1.5 bg-white rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black group-hover:bg-primary-pink transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-between w-full text-sm font-bold uppercase tracking-widest">
                    <span className="text-black font-swiss group-hover:text-primary-pink transition-colors">{genre}</span>
                    <span className="text-black font-swiss group-hover:text-primary-pink transition-colors">{year}</span>
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