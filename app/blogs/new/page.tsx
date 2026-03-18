import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import BlogForm from "@/components/BlogForm";

export default async function NewBlogPage() {
    if (!(await isAdmin())) {
        redirect("/blogs");
    }

    return (
        <main className="px-4 sm:px-8 pb-2">
            <div className="bg-primary-white rounded-3xl min-h-[80vh] px-4 sm:px-10 py-10 flex flex-col items-center">
                <BlogForm />
            </div>
        </main>
    );
}
