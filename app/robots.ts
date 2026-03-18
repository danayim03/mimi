import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mimireads.vercel.app";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/my-library", "/blogs/new", "/blogs/*/edit"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
