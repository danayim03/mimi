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
                    <p className="font-swiss text-3xl text-primary-plum leading-tight">{title}</p>
                    <p className="font-swiss text-[10px] text-primary-plum/50 uppercase tracking-widest mt-1">
                        {books.length} {books.length === 1 ? "book" : "books"}
                    </p>
                </div>
            </div>
        </div>
    </button>
);

interface JournalPost {
    id: string;
    content: string;
    rating: number | null;
    finished_date: string;
    updated_at: string;
    book_id: string;
    books: {
        title: string;
        author: string;
        image: string;
    };
}

const MyLibrary = () => {
    const { user, isLoaded } = useUser();
    const [books, setBooks] = useState<any[]>([]);
    const [journals, setJournals] = useState<JournalPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [stackOpen, setStackOpen] = useState(false);
    const [showInProgress, setShowInProgress] = useState(false);
    const [showFinished, setShowFinished] = useState(false);

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
        const fetchData = async () => {
            if (!user) return;

            try {
                const [{ data: bookData, error: bookError }, { data: journalData }] = await Promise.all([
                    supabase.from('books').select('*').eq('user_id', user.id),
                    supabase
                        .from('journals')
                        .select('id, content, rating, finished_date, updated_at, book_id')
                        .eq('user_id', user.id)
                        .order('updated_at', { ascending: false }),
                ]);

                if (bookError) throw bookError;
                const fetchedBooks = bookData || [];
                setBooks(fetchedBooks);

                // enrich journals with book info from the already-fetched books array
                const enriched = (journalData || [])
                    .filter((j: any) => j.content?.trim())
                    .map((j: any) => {
                        const book = fetchedBooks.find((b: any) => String(b.id) === String(j.book_id));
                        return {
                            ...j,
                            books: book
                                ? { title: book.title, author: book.author, image: book.image }
                                : { title: "Unknown", author: "", image: "" },
                        };
                    });
                setJournals(enriched as JournalPost[]);
            } catch (error) {
                console.error("Error fetching library:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded && user) {
            fetchData();
        }
    }, [user, isLoaded]);

    if (!isLoaded || loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <h2 className="text-black font-swiss text-xl font-bold animate-pulse">
                Loading your collection...
            </h2>
        </div>
    );

    return (
        <> {/* Wrap everything in a Fragment */}
            {/* Profile Section */}
            <section className="mt-10 mb-12 p-8 flex flex-col md:flex-row items-center gap-8 rounded-3xl max-width mx-auto padding-x overflow-x-clip">
                <div className="flex-1 text-center md:text-left relative">
                    {/* Container for the Text + Bunny */}
                    <div className="relative inline-block group">
                        
                        {/* The Text Layer */}
                        <h1 className="relative z-20 font-swiss font-light text-8xl md:text-9xl text-black tracking-tight leading-[0.8] mb-2 drop-shadow-sm">
                            {user?.firstName || "the Scholar"}'s <p className="font-kapakana">Library</p>
                        </h1>

                        {/* The Bunny Layer */}
                        <img
                            src="/bunny.png"
                            alt=""
                            className="absolute -top-4 -right-12 w-64 md:w-80 z-10 opacity-90 pointer-events-none select-none transform translate-x-4"
                        />
                        
                        {/* Stats Section below the wrap */}
                        <div className="relative z-20 flex justify-center md:justify-start gap-6 mt-4 text-black font-swiss text-xs uppercase tracking-[0.2em]">
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
    
            {/* Journal Gallery */}
            {journals.length === 0 && (
                <section className="padding-x max-width mx-auto mb-14">
                    <div className="flex items-baseline gap-3 mb-5">
                        <h2 className="font-swiss text-2xl text-black">Journals</h2>
                    </div>
                    <p className="font-swiss text-sm text-black/40">You have no journal entries yet.</p>
                </section>
            )}
            {journals.length > 0 && (
                <section className="padding-x max-width mx-auto mb-14">
                    <div className="flex items-baseline gap-3 mb-5">
                        <h2 className="font-swiss text-2xl text-black">Journals</h2>
                        <span className="text-[10px] font-swiss text-black/40 uppercase tracking-widest">
                            {journals.length} {journals.length === 1 ? "entry" : "entries"}
                        </span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
                        {journals.map((journal) => (
                            <a
                                key={journal.id}
                                href={`/journal/${journal.book_id}`}
                                className="snap-start shrink-0 w-44 sm:w-52 overflow-hidden bg-primary-white border border-black group cursor-pointer"
                            >
                                {/* Header */}
                                <div className="px-3 pt-3 pb-2.5 border-b border-black flex flex-col gap-1">
                                    <p className="text-black font-swiss text-xs font-bold truncate">
                                        {journal.books?.title}
                                    </p>
                                    <p className="text-black/50 font-swiss text-[10px]">
                                        {journal.finished_date
                                            ? new Date(journal.finished_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                                            : new Date(journal.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                    </p>
                                    {journal.rating && (
                                        <div className="flex gap-0.5 mt-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <span
                                                    key={s}
                                                    className={`text-[10px] ${s <= journal.rating! ? "text-black" : "text-black/20"}`}
                                                >
                                                    ✦
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Journal content area */}
                                <div className="p-3">
                                    <p className="text-black/80 text-[11px] font-swiss line-clamp-6 leading-relaxed">
                                        {journal.content}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* Stacks */}
            <main className="padding-x pb-20 max-width mx-auto">
                {books.length > 0 ? (
                    <>
                        {/* Closed — stacks */}
                        {!stackOpen && (
                            <>
                                <div className="flex items-baseline gap-3 mb-5">
                                    <h2 className="font-swiss text-2xl text-black">Book Collection</h2>
                                    <span className="text-[10px] font-swiss text-black/40 uppercase tracking-widest">
                                        {books.length} {books.length === 1 ? "book" : "books"}
                                    </span>
                                </div>
                                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
                                    {books.filter(b => b.progress < 100).length > 0 && (
                                        <StackThumbnail
                                            title="In Progress"
                                            books={books.filter(b => b.progress < 100)}
                                            onClick={() => { setStackOpen(true); setShowInProgress(true); setShowFinished(false); }}
                                        />
                                    )}
                                    {books.filter(b => b.progress === 100).length > 0 && (
                                        <StackThumbnail
                                            title="Finished"
                                            books={books.filter(b => b.progress === 100)}
                                            onClick={() => { setStackOpen(true); setShowInProgress(false); setShowFinished(true); }}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {/* Open — filter toggles + grid */}
                        {stackOpen && (() => {
                            const inProgressBooks = books.filter(b => b.progress < 100);
                            const finishedBooks = books.filter(b => b.progress === 100);
                            const activeBooks = [
                                ...(showInProgress ? inProgressBooks : []),
                                ...(showFinished ? finishedBooks : []),
                            ];
                            const toggle = (filter: "in-progress" | "finished") => {
                                if (filter === "in-progress") {
                                    if (showInProgress && !showFinished) return; // keep at least one active
                                    setShowInProgress(v => !v);
                                } else {
                                    if (showFinished && !showInProgress) return;
                                    setShowFinished(v => !v);
                                }
                            };
                            return (
                                <div className="w-full">
                                    <div className="flex items-center gap-4 mb-8 flex-wrap">
                                        <button
                                            onClick={() => { setStackOpen(false); setShowInProgress(false); setShowFinished(false); }}
                                            className="font-swiss text-xs text-black/50 uppercase tracking-widest hover:text-black transition-colors"
                                        >
                                            ←
                                        </button>
                                        {inProgressBooks.length > 0 && (
                                            <button
                                                onClick={() => toggle("in-progress")}
                                                className={`font-swiss text-xs px-3 py-1 rounded-full transition-all ${
                                                    showInProgress
                                                        ? "bg-black text-white"
                                                        : "bg-black/10 text-black/50 hover:bg-black/20"
                                                }`}
                                            >
                                                In Progress ({inProgressBooks.length})
                                            </button>
                                        )}
                                        {finishedBooks.length > 0 && (
                                            <button
                                                onClick={() => toggle("finished")}
                                                className={`font-swiss text-xs px-3 py-1 rounded-full transition-all ${
                                                    showFinished
                                                        ? "bg-black text-white"
                                                        : "bg-black/10 text-black/50 hover:bg-black/20"
                                                }`}
                                            >
                                                Finished ({finishedBooks.length})
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
                                        {activeBooks.map((book) => (
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
                        <h2 className="text-black/50 font-swiss text-2xl italic">
                            Your shelves are currently bare...
                        </h2>
                    </div>
                )}
            </main>
        </>
    );
}

export default MyLibrary;