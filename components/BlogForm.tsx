"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BlogFormProps = {
    slug?: string;
    initial?: {
        title: string;
        description: string;
        date: string;
        image: string;
        content: string;
        published?: boolean;
    };
};

export default function BlogForm({ slug, initial }: BlogFormProps) {
    const router = useRouter();
    const isEdit = !!slug;

    const [title, setTitle] = useState(initial?.title ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [date, setDate] = useState(
        initial?.date ?? new Date().toISOString().slice(0, 10)
    );
    const [image, setImage] = useState(initial?.image ?? "");
    const [content, setContent] = useState(initial?.content ?? "");
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(published: boolean) {
        setError("");
        setSubmitting(true);

        try {
            const url = isEdit ? `/api/blogs/${slug}` : "/api/blogs";
            const method = isEdit ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    date,
                    image: image || undefined,
                    content,
                    published,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Something went wrong");
                setSubmitting(false);
                return;
            }

            router.push(`/blogs/${data.slug}`);
            router.refresh();
        } catch {
            setError("Failed to save");
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-6 max-w-2xl w-full"
        >
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="font-swiss text-xl font-semibold">
                    {isEdit ? "Edit blog" : "New blog"}
                </h2>
                <div className="flex items-center gap-3">
                    {isEdit && (
                        <button
                            type="button"
                            onClick={async () => {
                                if (!confirm("Delete this blog? This cannot be undone.")) return;
                                setSubmitting(true);
                                try {
                                    const res = await fetch(`/api/blogs/${slug}`, {
                                        method: "DELETE",
                                    });
                                    if (res.ok) {
                                        router.push("/blogs");
                                        router.refresh();
                                    } else {
                                        const data = await res.json();
                                        setError(data.error ?? "Delete failed");
                                    }
                                } catch {
                                    setError("Delete failed");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                            disabled={submitting}
                            className="font-swiss text-sm text-red-600 hover:text-red-700 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        >
                            Delete blog
                        </button>
                    )}
                    <Link
                        href={isEdit ? `/blogs/${slug}` : "/blogs"}
                        className="text-sm font-swiss text-black/60 hover:text-black"
                    >
                        Cancel
                    </Link>
                </div>
            </div>

            {error && (
                <p className="font-swiss text-sm text-red-600 bg-red-50 px-4 py-2 rounded">
                    {error}
                </p>
            )}

            <div>
                <label className="block font-swiss text-xs uppercase tracking-wide text-black/60 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full font-swiss text-sm px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black"
                />
            </div>

            <div>
                <label className="block font-swiss text-xs uppercase tracking-wide text-black/60 mb-1">
                    Description
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full font-swiss text-sm px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-swiss text-xs uppercase tracking-wide text-black/60 mb-1">
                        Date
                    </label>
                    <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="2026-02-05"
                        className="w-full font-swiss text-sm px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label className="block font-swiss text-xs uppercase tracking-wide text-black/60 mb-1">
                        Cover image
                    </label>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 font-swiss text-sm px-4 py-2 border border-black/20 rounded-lg cursor-pointer hover:bg-black/5 transition-colors w-fit">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="hidden"
                                onChange={async (e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    setUploading(true);
                                    setError("");
                                    try {
                                        const form = new FormData();
                                        form.append("file", f);
                                        const res = await fetch("/api/blogs/upload", {
                                            method: "POST",
                                            body: form,
                                        });
                                        const data = await res.json();
                                        if (res.ok) setImage(data.path);
                                        else setError(data.error ?? "Upload failed");
                                    } catch {
                                        setError("Upload failed");
                                    } finally {
                                        setUploading(false);
                                        e.target.value = "";
                                    }
                                }}
                            />
                            {uploading ? "Uploading…" : "Upload JPG/PNG/WebP"}
                        </label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="/blogs-images/filename.jpg"
                            className="w-full font-swiss text-sm px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black"
                        />
                        {image && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/5 border border-black/10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={image}
                                    alt="Cover preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block font-swiss text-xs uppercase tracking-wide text-black/60 mb-1">
                    Content (Markdown + HTML)
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={16}
                    className="w-full font-mono text-sm px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:border-black"
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={submitting}
                    className="font-swiss custom-btn disabled:opacity-50"
                >
                    {submitting ? "Saving…" : "Post"}
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={submitting}
                    className="font-swiss text-sm border border-black/30 px-4 py-2 rounded-full hover:bg-black/5 transition-colors disabled:opacity-50"
                >
                    {submitting ? "Saving…" : "Save as draft"}
                </button>
            </div>
        </form>
    );
}
