import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getBlogRaw } from "@/lib/blogs";
import BlogForm from "@/components/BlogForm";

type EditPageProps = {
    params: Promise<{ slug: string }>;
};

export default async function EditBlogPage({ params }: EditPageProps) {
    if (!(await isAdmin())) {
        redirect("/blogs");
    }

    const { slug } = await params;
    const raw = await getBlogRaw(slug);

    if (!raw) {
        redirect("/blogs");
    }

    const { data, content } = raw;

    return (
        <main className="px-4 sm:px-8 pb-2">
            <div className="bg-primary-white rounded-3xl min-h-[80vh] px-4 sm:px-10 py-10 flex flex-col items-center">
                <BlogForm
                    slug={slug}
                    initial={{
                        title: String(data.title ?? ""),
                        description: String(data.description ?? ""),
                        date: String(data.date ?? ""),
                        image: String(data.image ?? ""),
                        content,
                        published: data.published !== false,
                    }}
                />
            </div>
        </main>
    );
}
