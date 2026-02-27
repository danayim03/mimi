// journal/[id]/page.tsx = journal entry page for a specific book
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

interface JournalEntry {
    content: string;
    rating: number | null;
    finished_date: string;
}

const JournalPage = () => {
    const { id } = useParams();
    const { user, isLoaded } = useUser();
    const router = useRouter();

    const [book, setBook] = useState<Book | null>(null);
    const [entry, setEntry] = useState<JournalEntry>({
        content: "",
        rating: null,
        finished_date: "",
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Override body background to pink for this page only
    useEffect(() => {
        document.body.style.backgroundColor = "#FFBDC5";
        return () => { document.body.style.backgroundColor = ""; };
    }, []);

    // Fetch book info and existing journal entry
    useEffect(() => {
        if (!isLoaded || !user) return;

        const fetchData = async () => {
            const { data: bookData } = await supabase
                .from("books")
                .select("id, title, author")
                .eq("id", id)
                .single();

            if (bookData) setBook(bookData);

            const { data: journalData } = await supabase
                .from("journals")
                .select("content, rating, finished_date")
                .eq("book_id", id)
                .eq("user_id", user.id)
                .single();

            if (journalData) {
                setEntry({
                    content: journalData.content ?? "",
                    rating: journalData.rating ?? null,
                    finished_date: journalData.finished_date ?? "",
                });
            }
        };

        fetchData();
    }, [id, user, isLoaded]);

    const handleSave = async () => {
        if (!user || !id) return;
        setSaving(true);

        const bookId = Number(Array.isArray(id) ? id[0] : id);

        // Check if an entry already exists for this book + user
        const { data: existing, error: fetchError } = await supabase
            .from("journals")
            .select("id")
            .eq("book_id", bookId)
            .eq("user_id", user.id)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            setSaving(false);
            return;
        }

        let saveError;

        if (existing) {
            const { error } = await supabase
                .from("journals")
                .update({
                    content: entry.content,
                    rating: entry.rating,
                    finished_date: entry.finished_date || null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id);
            saveError = error;
        } else {
            const { error } = await supabase
                .from("journals")
                .insert({
                    book_id: bookId,
                    user_id: user.id,
                    content: entry.content,
                    rating: entry.rating,
                    finished_date: entry.finished_date || null,
                    updated_at: new Date().toISOString(),
                });
            saveError = error;
        }

        if (saveError) {
            setSaving(false);
            return;
        }

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-primary-pink -mt-20 pt-20">
        <div className="padding-x max-width mx-auto py-16">
            <button
                onClick={() => router.back()}
                className="mb-10 text-sm text-black/60 hover:text-black transition-colors"
            >
                ← back to library
            </button>

            <div className="flex flex-col md:flex-row gap-12">

                {/* Left — Book info + metadata */}
                <div className="flex flex-col gap-6 md:w-1/2">
                    <h1 className="font-kapakana font-light font-black text-5xl sm:text-8xl text-black leading-tight">
                        {book?.title ?? "Loading..."}
                    </h1>
                    <p className="font-karrik text-black/60 text-sm">
                        by {book?.author}
                    </p>

                    {/* Finished date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs uppercase tracking-widest text-black/50 font-karrik">
                            Date Completed
                        </label>
                        <input
                            type="date"
                            value={entry.finished_date}
                            onChange={(e) => setEntry({ ...entry, finished_date: e.target.value })}
                            className="bg-transparent border-b border-black/30 text-black font-karrik text-sm py-1 outline-none focus:border-black transition-colors"
                        />
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-black/50 font-karrik">
                            Rating
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setEntry({ ...entry, rating: star })}
                                    className={`text-2xl transition-transform hover:scale-110 ${
                                        entry.rating !== null && star <= entry.rating
                                            ? "opacity-100"
                                            : "opacity-25"
                                    }`}
                                >
                                    ✦
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — Journal entry */}
                <div className="flex flex-col gap-4 md:w-1/2">
                    <label className="text-xs uppercase tracking-widest text-black font-karrik">
                        Your Thoughts
                    </label>
                    <textarea
                        value={entry.content}
                        onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                        placeholder="Write your thoughts on this book..."
                        rows={16}
                        className="w-full bg-primary-white border p-6 text-black font-karrik text-sm resize-none outline-none transition-colors placeholder:text-black/20"
                    />
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="custom-btn self-end"
                    >
                        {saving ? "Saving..." : saved ? "Saved ✦" : "Save Entry"}
                    </button>
                </div>

            </div>
        </div>
        </div>
    );
};

export default JournalPage;
