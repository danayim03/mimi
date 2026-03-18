"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteBlogButton({ slug }: { slug: string }) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm("Delete this blog? This cannot be undone.")) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/blogs");
                router.refresh();
            }
        } finally {
            setDeleting(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-[0.7rem] font-swiss uppercase tracking-[0.18em] text-red-600 hover:text-red-700 transition-colors border-b border-red-300 pb-0.5 disabled:opacity-50"
        >
            {deleting ? "Deleting…" : "Delete"}
        </button>
    );
}
