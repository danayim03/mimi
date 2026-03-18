import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { deleteBlog, getBlogRaw, writeBlog } from "@/lib/blogs";

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const existing = await getBlogRaw(slug);
        if (!existing) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        await deleteBlog(slug);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("DELETE /api/blogs/[slug] error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const existing = await getBlogRaw(slug);

        if (!existing) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        const body = await req.json();
        const { title, description, date, image, content, published } = body;

        if (!title || typeof title !== "string" || !content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            );
        }

        const frontmatter = {
            title: String(title).trim(),
            description: String(description ?? "").trim(),
            date: String(date ?? existing.data.date ?? "").trim(),
            image: image ? String(image).trim() : undefined,
            published: published === true,
        };

        await writeBlog(slug, frontmatter, String(content).trim());

        return NextResponse.json({ slug });
    } catch (e) {
        console.error("PUT /api/blogs/[slug] error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
