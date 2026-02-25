// my-library/page.tsx = user's library
"use client";

import BookCard from "@/components/BookCard";
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const MyLibrary = () => {
    const { user, isLoaded } = useUser();
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleProgressUpdate = async (id: string, newProgress: number) => {
        try {
            const { error } = await supabase
                .from('books')
                .update({ progress: newProgress })
                .eq('id', id);
            if (error) throw error;
            // progress bar UI update
            setBooks((prevBooks) =>
                prevBooks.map((book) =>
                    book.id === id ? {...book, progress: newProgress} : book
                )
            );
        } catch (error) {
            alert("Could not update progress. Please try again.")
        }
    };

    useEffect(() => {
        const fetchSavedBooks = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .eq('user_id', user.id); // get books for this user only
                if (error) throw error;
                setBooks(data || []);
            } catch (error) {
                console.error("Error fetching your books:", error);
            } finally {
                setLoading(false); // books done loading
            }
        };

        if (isLoaded && user) {
            fetchSavedBooks();
        }
    }, [user, isLoaded]);

    if (!isLoaded || loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <h2 className="text-primary-pink font-sans text-xl font-bold animate-pulse">
                Loading your collection...
            </h2>
        </div>
    );

    return (
        <main className="padding-x padding-y max-width">
            {books.length > 0 ? (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-10">
                    {books.map((book) => (
                        <BookCard key={book.id} {...book} isLibraryView={true} onProgressUpdate={handleProgressUpdate} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <h2 className="text-primary-pink font-sans text-xl font-bold">
                        Your library is currently empty.
                    </h2>
                </div>
            )}
        </main>
    );
};

export default MyLibrary;