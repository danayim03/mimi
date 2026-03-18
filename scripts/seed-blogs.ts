/**
 * One-time script to migrate existing markdown blogs into Supabase.
 * Run: npx tsx scripts/seed-blogs.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and content/blogs/*.md
 */
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const BLOGS_DIR = path.join(process.cwd(), "content/blogs");

async function main() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
        process.exit(1);
    }

    if (!fs.existsSync(BLOGS_DIR)) {
        console.log("No content/blogs directory found.");
        process.exit(0);
    }

    const files = fs.readdirSync(BLOGS_DIR).filter((f) => f.endsWith(".md"));
    if (files.length === 0) {
        console.log("No markdown files to seed.");
        process.exit(0);
    }

    const supabase = createClient(url, key);

    for (const filename of files) {
        const slug = filename.replace(/\.md$/i, "");
        const filePath = path.join(BLOGS_DIR, filename);
        const source = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(source);

        const row = {
            slug,
            title: data.title ?? slug,
            description: data.description ?? "",
            date: data.date ?? new Date().toISOString().slice(0, 10),
            image: data.image ?? null,
            content,
            published: data.published !== false,
        };

        const { error } = await supabase.from("blogs").upsert(row, { onConflict: "slug" });
        if (error) {
            console.error(`Failed to seed ${slug}:`, error.message);
        } else {
            console.log(`Seeded: ${slug}`);
        }
    }

    console.log("Done.");
}

main();
