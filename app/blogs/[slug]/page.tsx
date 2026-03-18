import { getAllSlugs, getBlog } from "@/lib/blogs";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import DeleteBlogButton from "@/components/DeleteBlogButton";

type BlogPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPageProps) {
    const { slug } = await params;
    const [blog, admin] = await Promise.all([getBlog(slug), isAdmin()]);

    if (!blog) {
        return (
            <main className="px-4 sm:px-8 pb-2">
                <div className="bg-primary-pink rounded-3xl min-h-[80vh] flex items-center justify-center">
                    <p className="font-swiss text-black/40 text-sm">Blog not found.</p>
                </div>
            </main>
        );
    }

    if (!blog.published && !admin) {
        return (
            <main className="px-4 sm:px-8 pb-2">
                <div className="bg-primary-pink rounded-3xl min-h-[80vh] flex items-center justify-center">
                    <p className="font-swiss text-black/40 text-sm">Blog not found.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 sm:px-8 pb-2">
            <div className="bg-primary-white rounded-3xl min-h-[80vh] px-4 sm:px-10 py-10 flex flex-col items-center">

                <div className="mb-8 w-full max-w-2xl flex items-center justify-between gap-4 flex-wrap">
                    <Link
                        href="/blogs"
                        className="text-[0.7rem] font-swiss uppercase tracking-[0.18em] text-black/60 hover:text-black transition-colors border-b border-black/30 pb-0.5"
                    >
                        ← Back to blogs
                    </Link>
                    {admin && (
                        <div className="flex items-center gap-4">
                            <Link
                                href={`/blogs/${slug}/edit`}
                                className="text-[0.7rem] font-swiss uppercase tracking-[0.18em] text-black/60 hover:text-black transition-colors border-b border-black/30 pb-0.5"
                            >
                                Edit
                            </Link>
                            <DeleteBlogButton slug={slug} />
                        </div>
                    )}
                </div>

                {!blog.published && admin && (
                    <div className="w-full max-w-2xl mb-4 px-4 py-2 bg-amber-100 border border-amber-400 rounded-lg">
                        <p className="font-swiss text-sm text-amber-800">This is a draft. Only you can see it.</p>
                    </div>
                )}
                <header className="max-w-2xl mb-4 pb-4 w-full">
                    <span className="text-[0.7rem] font-swiss uppercase tracking-[0.18em] text-black/50 block mb-3">
                        {blog.date}
                    </span>
                    <h1 className="font-swiss text-3xl sm:text-4xl md:text-[3rem] font-bold tracking-tight text-black leading-tight mb-3">
                        {blog.title}
                    </h1>
                    {blog.description && (
                        <p className="font-swiss text-sm text-black/70 leading-relaxed">
                            {blog.description}
                        </p>
                    )}
                </header>

                <div
                    className="
                        max-w-2xl font-swiss text-black/85 text-sm sm:text-base leading-relaxed w-full

                        [&_p]:mb-5
                        [&_p]:leading-[1.85]

                        [&_h3]:font-bold
                        [&_h3]:text-lg
                        [&_h3]:sm:text-xl
                        [&_h3]:mt-10
                        [&_h3]:mb-4
                        [&_h3]:tracking-tight
                        [&_h3]:border-t
                        [&_h3]:border-black/20
                        [&_h3]:pt-6

                        [&_aside]:bg-black/5
                        [&_aside]:border-l-4
                        [&_aside]:border-black
                        [&_aside]:px-5
                        [&_aside]:py-4
                        [&_aside]:my-6
                        [&_aside]:text-sm
                        [&_aside]:italic
                        [&_aside]:leading-relaxed

                        [&_figure]:my-8
                        [&_figure]:flex
                        [&_figure]:flex-col
                        [&_figure]:items-center
                        [&_figure]:gap-3

                        [&_figcaption]:text-xs
                        [&_figcaption]:text-black/50
                        [&_figcaption]:text-center
                        [&_figcaption]:italic
                        [&_figcaption]:mt-1

                        [&_img]:max-w-full
                        [&_img]:h-auto
                        [&_img]:border
                        [&_img]:border-black/10

                        [&_ul]:list-disc
                        [&_ul]:pl-5
                        [&_ul]:mb-5
                        [&_li]:mb-1
                    "
                    dangerouslySetInnerHTML={{ __html: blog.html }}
                />
            </div>
        </main>
    );
}
