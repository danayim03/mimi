import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

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

export function getBlogs(includeDrafts = false): BlogMeta[] {
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

export function getAllSlugs(): string[] {
    if (!fs.existsSync(BLOGS_DIR)) return [];
    return fs
        .readdirSync(BLOGS_DIR)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/i, ""));
}

export function getBlogRaw(slug: string): { data: Record<string, unknown>; content: string } | null {
    const filePath = path.join(BLOGS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    const source = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(source);
    return { data: data as Record<string, unknown>, content };
}

export function writeBlog(
    slug: string,
    frontmatter: {
        title: string;
        description: string;
        date: string;
        image?: string;
        published?: boolean;
    },
    content: string
) {
    const filePath = path.join(BLOGS_DIR, `${slug}.md`);
    const fm = matter.stringify(content, frontmatter, { lineWidth: -1 });
    fs.mkdirSync(BLOGS_DIR, { recursive: true });
    fs.writeFileSync(filePath, fm, "utf8");
}

export async function getBlog(slug: string): Promise<BlogPost | null> {
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
