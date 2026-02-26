// my-library/page.tsx = user's library
"use client";

import BookCard from "@/components/BookCard";
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const STACK_COUNT = 3;
const ROTATIONS = [-4, 2, -1.5];

// Just the visual stack (closed state)
const StackThumbnail = ({ title, books, onClick }: {
    title: string;
    books: any[];
    onClick: () => void;
}) => (
    <button onClick={onClick} className="flex flex-col gap-4 focus:outline-none group w-full text-left">
        {/* Stack — matches BookCard height (h-40 title + content + padding) */}
        <div className="relative w-full h-[272px]">
            {books.slice(0, STACK_COUNT).map((book, i) => (
                <div
                    key={book.id}
                    className="absolute inset-0 bg-primary-pink rounded-3xl transition-transform duration-300 group-hover:-translate-y-1"
                    style={{
                        transform: `rotate(${ROTATIONS[i]}deg) translateY(${i * 6}px)`,
                        zIndex: STACK_COUNT - i,
                        opacity: 1 - i * 0.15,
                    }}
                />
            ))}

            {/* Label on top card */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 pointer-events-none">
                <div>
                    <p className="font-kapakana text-3xl text-primary-plum leading-tight">{title}</p>
                    <p className="font-karrik text-[10px] text-primary-plum/50 uppercase tracking-widest mt-1">
                        {books.length} {books.length === 1 ? "book" : "books"}
                    </p>
                </div>
            </div>
        </div>
    </button>
);

const MyLibrary = () => {
    const { user, isLoaded } = useUser();
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openStack, setOpenStack] = useState<"in-progress" | "finished" | null>(null);

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
    
            {/* Stacks */}
            <main className="padding-x pb-20 max-width mx-auto">
                {books.length > 0 ? (
                    <>
                        {/* Closed — stacks in the same grid as cards */}
                        {!openStack && (
                            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
                                {books.filter(b => b.progress < 100).length > 0 && (
                                    <StackThumbnail
                                        title="In Progress"
                                        books={books.filter(b => b.progress < 100)}
                                        onClick={() => setOpenStack("in-progress")}
                                    />
                                )}
                                {books.filter(b => b.progress === 100).length > 0 && (
                                    <StackThumbnail
                                        title="Finished"
                                        books={books.filter(b => b.progress === 100)}
                                        onClick={() => setOpenStack("finished")}
                                    />
                                )}
                            </div>
                        )}

                        {/* Open — full-width grid */}
                        {openStack && (() => {
                            const active = openStack === "in-progress"
                                ? books.filter(b => b.progress < 100)
                                : books.filter(b => b.progress === 100);
                            const label = openStack === "in-progress" ? "In Progress" : "Finished";
                            return (
                                <div className="w-full">
                                    <button
                                        onClick={() => setOpenStack(null)}
                                        className="mb-8 font-karrik text-xs text-primary-pink/50 uppercase tracking-widest hover:text-primary-pink transition-colors"
                                    >
                                        ← {label}
                                    </button>
                                    <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
                                        {active.map((book) => (
                                            <BookCard
                                                key={book.id}
                                                {...book}
                                                isLibraryView={true}
                                                onProgressUpdate={handleProgressUpdate}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </>
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