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
            <h2 className="text-primary-pink font-karrik text-xl font-bold animate-pulse">
                Loading your collection...
            </h2>
        </div>
    );

    return (
        <> {/* Wrap everything in a Fragment */}
            {/* Profile Section */}
            <section className="mt-10 mb-12 p-8 flex flex-col md:flex-row items-center gap-8 rounded-3xl max-width mx-auto padding-x">
                <div className="flex-1 text-center md:text-left relative">
                    {/* Container for the Text + Bunny */}
                    <div className="relative inline-block group">
                        
                        {/* The Text Layer */}
                        <h1 className="relative z-20 font-kapakana font-light text-8xl md:text-9xl text-black tracking-tight leading-[0.8] mb-2 drop-shadow-sm">
                            {user?.firstName || "the Scholar"}'s Library
                        </h1>

                        {/* The Bunny Layer */}
                        <img
                            src="/bunny.png"
                            alt=""
                            className="absolute -top-4 -right-12 w-64 md:w-80 z-10 opacity-90 pointer-events-none select-none transform translate-x-4"
                        />
                        
                        {/* Stats Section below the wrap */}
                        <div className="relative z-20 flex justify-center md:justify-start gap-6 mt-4 text-black font-karrik text-xs uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2">
                                <span className="text-[10px]">✦</span> {books.length} Tomes
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-[10px]">✦</span> {books.filter(b => b.progress === 100).length} Finished
                            </span>
                        </div>
                    </div>
                </div>
            </section>
    
            {/* Grid Section */}
            <main className="padding-x pb-20 max-width">
                {books.length > 0 ? (
                    <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-10">
                        {books.map((book) => (
                            <BookCard 
                                key={book.id} 
                                {...book} 
                                isLibraryView={true} 
                                onProgressUpdate={handleProgressUpdate} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <h2 className="text-primary-pink/50 font-kapakana text-2xl italic">
                            Your shelves are currently bare...
                        </h2>
                    </div>
                )}
            </main>
        </>
    );
}

export default MyLibrary;