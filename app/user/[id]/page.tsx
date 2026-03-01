"use client";

import BookCard from "@/components/BookCard";
import { supabase } from "@/utils/supabase";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STACK_COUNT = 3;
const ROTATIONS = [-4, 2, -1.5];

interface JournalModalProps {
    journal: JournalPost | null;
    onClose: () => void;
}

const JournalModal = ({ journal, onClose }: JournalModalProps) => {
    if (!journal) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4"
            onClick={onClose}
        >
            <div
                className="bg-primary-pink rounded-3xl w-[calc(100vw-2rem)] max-w-3xl max-h-[90vh] overflow-y-auto relative p-8 sm:p-12"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-full text-black/60 hover:text-black transition-all text-sm"
                >
                    ×
                </button>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Left — Book info + metadata */}
                    <div className="flex flex-col gap-6 md:w-1/2">
                        <h1 className="font-kapakana font-light text-5xl sm:text-7xl text-black leading-tight">
                            {journal.books?.title}
                        </h1>
                        <p className="font-swiss text-black/60 text-sm">by {journal.books?.author}</p>

                        {journal.finished_date && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs uppercase tracking-widest text-black/50 font-swiss">
                                    Date Completed
                                </span>
                                <span className="font-swiss text-black text-sm border-b border-black/20 py-1">
                                    {new Date(journal.finished_date).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        )}

                        {journal.rating !== null && (
                            <div className="flex flex-col gap-2">
                                <span className="text-xs uppercase tracking-widest text-black/50 font-swiss">
                                    Rating
                                </span>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`text-2xl ${star <= journal.rating! ? "opacity-100" : "opacity-20"}`}
                                        >
                                            ✦
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — Journal content */}
                    <div className="flex flex-col gap-4 md:w-1/2">
                        <span className="text-xs uppercase tracking-widest text-black font-swiss">
                            Thoughts
                        </span>
                        <div className="w-full bg-primary-white border p-6 text-black font-swiss text-sm leading-relaxed whitespace-pre-wrap min-h-64">
                            {journal.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface UserProfile {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    imageUrl: string;
}

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

interface QuotePost {
    id: number;
    quote_text: string;
    created_at: string;
    book_id: string;
    books: {
        title: string;
        author: string;
    };
}

const StackThumbnail = ({ title, books, onClick }: {
    title: string;
    books: any[];
    onClick: () => void;
}) => (
    <button onClick={onClick} className="flex flex-col gap-4 focus:outline-none group w-full text-left">
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

const UserProfilePage = () => {
    const { id } = useParams();
    const router = useRouter();
    const userId = Array.isArray(id) ? id[0] : id;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [books, setBooks] = useState<any[]>([]);
    const [journals, setJournals] = useState<JournalPost[]>([]);
    const [quotes, setQuotes] = useState<QuotePost[]>([]);
    const [isPublic, setIsPublic] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [stackOpen, setStackOpen] = useState(false);
    const [showInProgress, setShowInProgress] = useState(false);
    const [showFinished, setShowFinished] = useState(false);
    const [activeJournal, setActiveJournal] = useState<JournalPost | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            const [profileRes, settingsRes] = await Promise.all([
                fetch(`/api/users/${userId}`),
                fetch(`/api/users/${userId}/settings`),
            ]);

            const profileData = await profileRes.json();
            const settingsData = await settingsRes.json();

            setProfile(profileData);
            setIsPublic(settingsData.is_public);

            if (settingsData.is_public) {
                const [{ data: bookData }, { data: journalData }, { data: quoteData }] = await Promise.all([
                    supabase
                        .from("books")
                        .select("*")
                        .eq("user_id", userId),
                    supabase
                        .from("journals")
                        .select("id, content, rating, finished_date, updated_at, book_id")
                        .eq("user_id", userId)
                        .order("updated_at", { ascending: false }),
                    supabase
                        .from("quotes")
                        .select("id, quote_text, created_at, book_id")
                        .eq("user_id", userId)
                        .order("created_at", { ascending: false }),
                ]);

                const fetchedBooks = bookData || [];
                setBooks(fetchedBooks);

                const enrichedJournals = (journalData || [])
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
                setJournals(enrichedJournals as JournalPost[]);

                const enrichedQuotes = (quoteData || []).map((q: any) => {
                    const book = fetchedBooks.find((b: any) => String(b.id) === String(q.book_id));
                    return {
                        ...q,
                        books: book
                            ? { title: book.title, author: book.author }
                            : { title: "Unknown", author: "" },
                    };
                });
                setQuotes(enrichedQuotes as QuotePost[]);
            }

            setLoading(false);
        };

        fetchAll();
    }, [userId]);

    const displayName =
        [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
        profile?.username ||
        "Unknown";

    if (loading) return (
        <div className="px-4 sm:px-8 pb-2">
            <div className="bg-primary-white rounded-3xl min-h-[80vh] flex items-center justify-center">
                <p className="font-swiss text-black/40 text-sm animate-pulse">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <>
        <div className="px-4 sm:px-8 pb-2">
            <div className="bg-primary-white rounded-3xl overflow-hidden">

                {/* Profile Header */}
                <section className="mt-10 mb-12 p-8 flex flex-col md:flex-row items-center gap-8 rounded-3xl max-width mx-auto padding-x overflow-x-clip">
                    <div className="flex-1 text-center md:text-left relative">
                        <div className="relative inline-block group">
                            <div className="flex items-center gap-4 mb-3">
                                <button
                                    onClick={() => router.back()}
                                    className="text-sm font-swiss text-black/50 hover:text-black transition-colors"
                                >
                                    ← back
                                </button>
                            </div>

                            <h1 className="relative z-20 font-swiss font-light text-8xl md:text-9xl text-black tracking-tight leading-[0.8] mb-2 drop-shadow-sm">
                                {profile?.firstName || displayName}'s <p className="font-kapakana">Library</p>
                            </h1>

                            <img
                                src="/bunny.png"
                                alt=""
                                className="absolute -top-4 -right-12 w-64 md:w-80 z-10 opacity-90 pointer-events-none select-none transform translate-x-4"
                            />

                            <div className="relative z-20 flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-black font-swiss text-xs uppercase tracking-[0.2em]">
                                {isPublic && (
                                    <>
                                        <span className="flex items-center gap-2">
                                            <span className="text-[10px]">✦</span> {books.length} Tomes
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="text-[10px]">✦</span> {books.filter(b => b.progress === 100).length} Finished
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="text-[10px]">✦</span> {books.filter(b => b.progress !== 100).length} In Progress
                                        </span>
                                    </>
                                )}
                                <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/20 text-[10px] font-swiss uppercase tracking-widest text-black/60">
                                    {isPublic ? "🌐 Public" : "🔒 Private"}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {!isPublic ? (
                    <div className="padding-x max-width mx-auto pb-20">
                        <p className="font-swiss text-black/50 text-sm">This library is private.</p>
                    </div>
                ) : (
                    <>
                        {/* Quotes Gallery */}
                        <section className="padding-x max-width mx-auto mb-14">
                            <div className="flex items-baseline gap-3 mb-5">
                                <h2 className="font-swiss text-2xl text-black">Quotes</h2>
                                <span className="text-[10px] font-swiss text-black/40 uppercase tracking-widest">
                                    {quotes.length} {quotes.length === 1 ? "quote" : "quotes"}
                                </span>
                            </div>
                            {quotes.length === 0 ? (
                                <p className="font-swiss text-sm text-black/40">No saved quotes yet.</p>
                            ) : (
                                <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
                                    {quotes.map((quote) => (
                                        <div
                                            key={quote.id}
                                            className="snap-start shrink-0 w-52 sm:w-64 overflow-hidden bg-primary-white border border-black"
                                        >
                                            <div className="p-4 flex flex-col gap-3">
                                                <p className="font-swiss text-black text-xs leading-relaxed line-clamp-5">
                                                    &ldquo;{quote.quote_text}&rdquo;
                                                </p>
                                                <p className="font-swiss text-black/40 text-[10px] italic border-t border-black/10 pt-2">
                                                    — {quote.books?.title} by {quote.books?.author}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Journals Gallery */}
                        <section className="padding-x max-width mx-auto mb-14">
                            <div className="flex items-baseline gap-3 mb-5">
                                <h2 className="font-swiss text-2xl text-black">Journals</h2>
                                {journals.length > 0 && (
                                    <span className="text-[10px] font-swiss text-black/40 uppercase tracking-widest">
                                        {journals.length} {journals.length === 1 ? "entry" : "entries"}
                                    </span>
                                )}
                            </div>
                            {journals.length === 0 ? (
                                <p className="font-swiss text-sm text-black/40">No journal entries yet.</p>
                            ) : (
                                <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
                                    {journals.map((journal) => (
                                        <button
                                            key={journal.id}
                                            onClick={() => setActiveJournal(journal)}
                                            className="snap-start shrink-0 w-44 sm:w-52 overflow-hidden bg-primary-white border border-black text-left group hover:border-black/60 transition-colors cursor-pointer focus:outline-none"
                                        >
                                            <div className="px-3 pt-3 pb-2.5 border-b border-black flex flex-col gap-1">
                                                <p className="text-black italic font-swiss text-xs font-bold truncate group-hover:text-black/70 transition-colors">
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
                                            <div className="p-3">
                                                <p className="text-black/80 text-[11px] font-swiss line-clamp-6 leading-relaxed">
                                                    {journal.content}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Book Collection */}
                        <main className="padding-x pb-20 max-width mx-auto">
                            {books.length > 0 ? (
                                <>
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

                                    {stackOpen && (() => {
                                        const inProgressBooks = books.filter(b => b.progress < 100);
                                        const finishedBooks = books.filter(b => b.progress === 100);
                                        const activeBooks = [
                                            ...(showInProgress ? inProgressBooks : []),
                                            ...(showFinished ? finishedBooks : []),
                                        ];
                                        const toggle = (filter: "in-progress" | "finished") => {
                                            if (filter === "in-progress") {
                                                if (showInProgress && !showFinished) return;
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
                                                            isLibraryView={false}
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
                                        No books in this library yet.
                                    </h2>
                                </div>
                            )}
                        </main>
                    </>
                )}
            </div>
        </div>

        <JournalModal journal={activeJournal} onClose={() => setActiveJournal(null)} />
        </>
    );
};

export default UserProfilePage;
