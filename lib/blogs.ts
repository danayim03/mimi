import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import { getSupabaseAdmin } from "@/utils/supabase-server";

const BLOGS_DIR = path.join(process.cwd(), "content/blogs");

export type BlogMeta = {
    slug: string;
    title: string;
    description: string;
    date: string;
    image?: string;
    published?: boolean;
};

export type BlogPost = BlogMeta & { html: string };

function useSupabase() {
    return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
}

export async function getBlogs(includeDrafts = false): Promise<BlogMeta[]> {
    const admin = getSupabaseAdmin();
    if (admin) {
        const { data, error } = await admin
            .from("blogs")
            .select("slug, title, description, date, image, published")
            .order("date", { ascending: false });

        if (error) {
            console.error("getBlogs Supabase error:", error);
            return [];
        }

        return (data ?? [])
            .filter((b) => includeDrafts || b.published)
            .map((b) => ({
                slug: b.slug,
                title: b.title ?? "",
                description: b.description ?? "",
                date: b.date ?? "",
                image: b.image ?? "",
                published: b.published ?? false,
            }));
    }

    if (!fs.existsSync(BLOGS_DIR)) return [];
    return fs
        .readdirSync(BLOGS_DIR)
        .filter((f) => f.endsWith(".md"))
        .map((filename) => {
            const source = fs.readFileSync(path.join(BLOGS_DIR, filename), "utf8");
            const { data } = matter(source);
            const published = data.published !== false;
            return {
                slug: filename.replace(/\.md$/i, ""),
                title: data.title ?? filename,
                description: data.description ?? "",
                date: data.date ?? "",
                image: data.image ?? "",
                published,
            } as BlogMeta;
        })
        .filter((b) => includeDrafts || b.published)
        .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getAllSlugs(): Promise<string[]> {
    const admin = getSupabaseAdmin();
    if (admin) {
        const { data } = await admin.from("blogs").select("slug");
        return (data ?? []).map((r) => r.slug);
    }

    if (!fs.existsSync(BLOGS_DIR)) return [];
    return fs
        .readdirSync(BLOGS_DIR)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/i, ""));
}

export async function getBlogRaw(
    slug: string
): Promise<{ data: Record<string, unknown>; content: string } | null> {
    const admin = getSupabaseAdmin();
    if (admin) {
        const { data, error } = await admin
            .from("blogs")
            .select("title, description, date, image, published, content")
            .eq("slug", slug)
            .single();

        if (error || !data) return null;

        return {
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                image: data.image,
                published: data.published,
            },
            content: data.content ?? "",
        };
    }

    const filePath = path.join(BLOGS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    const source = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(source);
    return { data: data as Record<string, unknown>, content };
}

export async function writeBlog(
    slug: string,
    frontmatter: {
        title: string;
        description: string;
        date: string;
        image?: string;
        published?: boolean;
    },
    content: string
): Promise<void> {
    const admin = getSupabaseAdmin();
    if (admin) {
        const row = {
            slug,
            title: frontmatter.title,
            description: frontmatter.description,
            date: frontmatter.date,
            image: frontmatter.image ?? null,
            content,
            published: frontmatter.published ?? false,
            updated_at: new Date().toISOString(),
        };

        const { error } = await admin.from("blogs").upsert(row, {
            onConflict: "slug",
        });

        if (error) throw error;
        return;
    }

    const filePath = path.join(BLOGS_DIR, `${slug}.md`);
    const fm = matter.stringify(content, frontmatter);
    fs.mkdirSync(BLOGS_DIR, { recursive: true });
    fs.writeFileSync(filePath, fm, "utf8");
}

export async function deleteBlog(slug: string): Promise<void> {
    const admin = getSupabaseAdmin();
    if (admin) {
        const { error } = await admin.from("blogs").delete().eq("slug", slug);
        if (error) throw error;
        return;
    }

    const filePath = path.join(BLOGS_DIR, `${slug}.md`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export async function getBlog(slug: string): Promise<BlogPost | null> {
    const admin = getSupabaseAdmin();
    if (admin) {
        const { data, error } = await admin
            .from("blogs")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error || !data) return null;

        const processedContent = await remark()
            .use(html, { sanitize: false })
            .process(data.content ?? "");

        return {
            slug: data.slug,
            title: data.title ?? slug,
            description: data.description ?? "",
            date: data.date ?? "",
            image: data.image ?? "",
            published: data.published ?? false,
            html: processedContent.toString(),
        };
    }

    const filePath = path.join(BLOGS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const source = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(source);
    const processedContent = await remark()
        .use(html, { sanitize: false })
        .process(content);

    return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        image: data.image ?? "",
        published: data.published !== false,
        html: processedContent.toString(),
    };
}
