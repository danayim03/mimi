// quotes/[id]/page.tsx = saved quotes for a specific book
"use client";

import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Book {
    id: string;
    title: string;
    author: string;
}

interface Quote {
    id: number;
    quote_text: string;
    created_at: string;
}

const QuotesPage = () => {
    const { id } = useParams();
    const { user, isLoaded } = useUser();
    const router = useRouter();

    const [book, setBook] = useState<Book | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newQuote, setNewQuote] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);


    useEffect(() => {
        if (!isLoaded || !user) return;

        const fetchData = async () => {
            const { data: bookData } = await supabase
                .from("books")
                .select("id, title, author")
                .eq("id", id)
                .single();

            if (bookData) setBook(bookData);

            const { data: quotesData } = await supabase
                .from("quotes")
                .select("id, quote_text, created_at")
                .eq("book_id", id)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (quotesData) setQuotes(quotesData);
        };

        fetchData();
    }, [id, user, isLoaded]);

    const handleSave = async () => {
        if (!user || !id || !newQuote.trim()) return;
        setSaving(true);

        const bookId = Number(Array.isArray(id) ? id[0] : id);

        const { data, error } = await supabase
            .from("quotes")
            .insert({
                book_id: bookId,
                user_id: user.id,
                quote_text: newQuote.trim(),
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (!error && data) {
            setQuotes((prev) => [data, ...prev]);
            setNewQuote("");
            setShowForm(false);
        }

        setSaving(false);
    };

    const handleDelete = async (quoteId: number) => {
        setDeletingId(quoteId);
        const { error } = await supabase.from("quotes").delete().eq("id", quoteId);
        if (!error) setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
        setDeletingId(null);
    };

    if (!isLoaded) return null;

    return (
        <div className="px-4 sm:px-8 pb-2">
        <div className="bg-primary-pink rounded-3xl min-h-[80vh]">
            <div className="padding-x max-width mx-auto py-16">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="mb-10 text-sm font-swiss text-black/60 hover:text-black transition-colors"
                >
                    ← back to library
                </button>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
                    <div>
                        <h1 className="font-kapakana font-light text-5xl sm:text-8xl text-black leading-tight">
                            {book?.title ?? "Loading..."}
                        </h1>
                        <p className="font-swiss text-black/60 text-sm mt-2">
                            by {book?.author}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm((v) => !v)}
                        className="custom-btn self-start sm:self-auto shrink-0"
                    >
                        {showForm ? "Cancel" : "+ Add Quote"}
                    </button>
                </div>

                {/* Add Quote Form */}
                {showForm && (
                    <div className="mb-12 flex flex-col gap-4 max-w-2xl">
                        <label className="text-xs uppercase tracking-widest text-black/50 font-swiss">
                            Quote
                        </label>
                        <textarea
                            autoFocus
                            value={newQuote}
                            onChange={(e) => setNewQuote(e.target.value)}
                            placeholder="Type the quote here..."
                            rows={4}
                            className="w-full bg-primary-white border border-black p-5 text-black font-swiss text-sm resize-none outline-none placeholder:text-black/20"
                        />
                        <button
                            onClick={handleSave}
                            disabled={saving || !newQuote.trim()}
                            className="custom-btn self-end disabled:opacity-40"
                        >
                            {saving ? "Saving..." : "Save Quote"}
                        </button>
                    </div>
                )}

                {/* Quotes */}
                {quotes.length === 0 ? (
                    <p className="font-swiss text-sm text-black/40">
                        You have no saved quotes yet.
                    </p>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {quotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="break-inside-avoid bg-primary-white border border-black p-6 flex flex-col gap-4 group"
                            >
                                <p className="font-swiss text-black text-base leading-relaxed">
                                    &ldquo;{quote.quote_text}&rdquo;
                                </p>
                                <div className="flex items-end justify-between gap-2">
                                    <p className="font-swiss text-black/50 text-xs italic">
                                        — {book?.title} by {book?.author}
                                    </p>
                                    <button
                                        onClick={() => handleDelete(quote.id)}
                                        disabled={deletingId === quote.id}
                                        className="text-[10px] font-swiss text-black/20 hover:text-black/60 transition-colors shrink-0"
                                    >
                                        {deletingId === quote.id ? "..." : "remove"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
        </div>
    );
};

export default QuotesPage;
