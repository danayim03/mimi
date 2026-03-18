import { getBlogs } from "@/lib/blogs";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";

export default async function BlogsPage() {
    const admin = await isAdmin();
    const blogs = await getBlogs(admin);

    return (
        <main className="px-4 sm:px-8 pb-2">
            <div className="bg-primary-white rounded-3xl min-h-[80vh] px-4 sm:px-10 py-10">

                {/* Header */}
                <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
                    <h1 className="font-swiss text-[3.5rem] sm:text-[5rem] md:text-[7rem] leading-none font-bold tracking-tight text-black">
                        DANA BLOG
                    </h1>
                    {admin && (
                        <Link
                            href="/blogs/new"
                            className="font-swiss text-sm border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-primary-white transition-colors"
                        >
                            New blog
                        </Link>
                    )}
                </header>

                {blogs.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <p className="font-swiss text-black/40 text-sm">No blogs yet.</p>
                    </div>
                ) : (
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {blogs.map((blog) => (
                            <Link
                                key={blog.slug}
                                href={`/blogs/${blog.slug}`}
                                className="group border border-black flex flex-col bg-primary-white hover:bg-primary-pink transition-colors duration-200"
                            >
                                <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
                                    <span className="text-[0.65rem] font-swiss text-black/60 tracking-wide">
                                        {blog.date}
                                    </span>
                                    {!blog.published && admin && (
                                        <span className="text-[0.6rem] font-swiss uppercase tracking-wide text-amber-600 border border-amber-400 px-2 py-0.5 rounded">
                                            Draft
                                        </span>
                                    )}
                                </div>

                                {blog.image && (
                                    <div className="mx-4 border border-black/20 overflow-hidden aspect-4/3 bg-black/5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-300"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 px-4 pt-3 pb-4">
                                    <h2 className="font-swiss text-base font-semibold tracking-tight text-black leading-snug group-hover:underline">
                                        {blog.title}
                                    </h2>
                                    <p className="font-swiss text-xs text-black/70 leading-relaxed line-clamp-3">
                                        {blog.description}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between text-[0.65rem] font-swiss text-black/60">
                                        <div className="flex gap-1">
                                            <span className="font-semibold">Author</span>
                                            <span>Dana Yim</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <span className="font-semibold">Duration</span>
                                            <span>10 min</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}
