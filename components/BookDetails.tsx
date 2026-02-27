// BookDetails.tsx = detail view of a BookCard & add to library button
"use client";
// import for Clerk
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

interface BookDetailsProps {
    isOpen: boolean;
    closeModal: () => void;
    book: {
        id?: string; // supabase ID for fetching a specific database row.
        title: string;
        author: string;
        genre: string;
        year: number;
        description: string;
        image: string;
    };
    isLibraryView?: boolean; // used for deleting books from my library page.
}

const BookDetails = ({ isOpen, closeModal, book, isLibraryView }: BookDetailsProps) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [isAdding, setIsAdding] = useState(false);
    // if not opened, don't show anything
    if (!isOpen) return null;
    // function for adding to library
    const handleAddToLibrary = async () => {
        if (!user) return;

        setIsAdding(true); // start adding book to library

        try {
            const { error } = await supabase
                .from('books') // supabase database table name
                .insert([
                    {
                        user_id: user.id, // clerk's unique ID
                        title: book.title,
                        author: book.author,
                        genre: book.genre,
                        year: String(book.year),
                        image: book.image,
                        description: book.description
                    }
                ]);
            if (error) throw error;
            alert("Added to your library 🕯️🖤");
            closeModal();
        } catch (error: any) {
            console.error("Error: ", error.message);
            alert("An unfortunate event has occured and the book could not be added to your library.")
        } finally {
            setIsAdding(false); // added to library so finish adding
        }
    };

    // function for deleting books from library
    const handleDeleteFromLibrary = async () => {
        if (!book.id) {
            alert("Error: Book ID not found.");
            return;
        }
        
        setIsAdding(true);
        try {
            const { error } = await supabase
                .from('books')
                .delete()
                .eq('id', book.id);
            if (error) throw error;
            alert("Removed the book from your collection.");
            closeModal();
            window.location.reload(); // refresh the page to show the book is deleted.
        } catch (error: any) {
            alert("Error occured while removing the book.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        /* Blurred Background */
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4">
            <div className="bg-primary-red rounded-3xl max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-8">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 bg-primary-white text-black rounded-full transition hover:bg-primary-pink hover:text-black"
                >
                    x
                </button>

                <div className="flex flex-row gap-6 items-start mt-4">
                    {/* Book Image */}
                    <div className="shrink-0">
                        {book.image ? (
                            <img src={book.image} alt={book.title} className="h-64 object-contain" />
                        ) : (
                            <img src="/default.png" alt="no book image found" className="h-64 object-contain" />
                        )}
                    </div>

                    {/* Book Info + Description + Button */}
                    <div className="flex flex-col gap-4 flex-1">
                        {/* Book Info */}
                        <div>
                            <h2 className="text-3xl font-bold font-kapakana text-black leading-tight">
                                {book.title}
                            </h2>
                            <p className="text-lg text-black mt-2">
                                By {book.author}
                            </p>

                            <div className="flex gap-4 mt-4">
                                <span className="bg-primary-white text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {book.genre}
                                </span>
                                <span className="bg-primary-white text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {book.year}
                                </span>
                                {/* Add and Delete Button Based On isLibraryView prop */}
                                <div>
                                    {isLibraryView ? (
                                        // Delete Button
                                        <button
                                            onClick={handleDeleteFromLibrary}
                                            className="bg-primary-white text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-primary-pink hover:text-black"
                                        >
                                            {isAdding ? "Removing..." : "Remove from Library"}
                                        </button>
                                    ) : (
                                        // Add Button
                                        <button
                                            disabled={!isSignedIn || isAdding } // disable when not signed in or book being added to library
                                            onClick={handleAddToLibrary}
                                            className="bg-primary-white text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-primary-pink hover:text-black"
                                        >
                                            {isAdding ? "Adding..." : (isSignedIn ? "Add to My Library" : "Sign in to add books")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Book Description */}
                        <div>
                            <h3 className="text-lg text-black font-karrik">
                                Description
                            </h3>
                            <p className="text-black leading-relaxed text-sm max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {book.description || "No description available for this book."}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;