import { MetadataRoute } from "next";
import { getBlogs } from "@/lib/blogs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mimireads.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
    const blogs = getBlogs(false);
    const blogEntries: MetadataRoute.Sitemap = blogs.map((b) => ({
        url: `${baseUrl}/blogs/${b.slug}`,
        lastModified: new Date(b.date),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        ...blogEntries,
    ];
}
