import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { writeBlog } from "@/lib/blogs";

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, date, image, content, published } = body;

        if (!title || typeof title !== "string" || !content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            );
        }

        const slug = slugify(title);
        if (!slug) {
            return NextResponse.json(
                { error: "Title must contain at least one alphanumeric character" },
                { status: 400 }
            );
        }

        const frontmatter = {
            title: String(title).trim(),
            description: String(description ?? "").trim(),
            date: String(date ?? new Date().toISOString().slice(0, 10)).trim(),
            image: image ? String(image).trim() : undefined,
            published: published === true,
        };

        writeBlog(slug, frontmatter, String(content).trim());

        return NextResponse.json({ slug });
    } catch (e) {
        console.error("POST /api/blogs error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
